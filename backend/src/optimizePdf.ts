/**
 * Post-processes PDFs produced by Chromium to reduce their size.
 *
 * Chromium embeds every raster image losslessly (FlateDecode), including
 * images that were JPEG/WebP in the source, and re-embeds the same image on
 * every page it appears on. This pass:
 *
 *  1. De-duplicates byte-identical images (and their soft masks).
 *  2. Downsamples images larger than `maxDimension` pixels.
 *  3. Re-encodes lossless colour data as JPEG. Soft masks (alpha channels)
 *     stay lossless, so transparent edges are unaffected.
 *
 * Text, fonts and vector graphics are never touched.
 */
import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFName,
  PDFNumber,
  PDFObject,
  PDFRawStream,
  PDFRef,
} from "pdf-lib";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { deflateSync, inflateSync } from "node:zlib";

export interface OptimizeOptions {
  /** JPEG quality (1-100). */
  jpegQuality?: number;
  /** Longest side, in pixels, that an image is downsampled to. */
  maxDimension?: number;
}

export interface OptimizeResult {
  pdf: Uint8Array;
  originalBytes: number;
  optimizedBytes: number;
  deduplicated: number;
  recompressed: number;
}

const DEFAULTS: Required<OptimizeOptions> = {
  jpegQuality: 85,
  maxDimension: 1600,
};

const N = (name: string) => PDFName.of(name);

function isImage(obj: PDFObject | undefined): obj is PDFRawStream {
  return (
    obj instanceof PDFRawStream && obj.dict.get(N("Subtype")) === N("Image")
  );
}

function num(dict: PDFDict, key: string): number | undefined {
  const value = dict.get(N(key));
  return value instanceof PDFNumber ? value.asNumber() : undefined;
}

/** Number of colour channels for colour spaces we know how to re-encode. */
function channelCount(doc: PDFDocument, dict: PDFDict): 1 | 3 | undefined {
  const cs = dict.get(N("ColorSpace"));
  if (cs === N("DeviceRGB")) return 3;
  if (cs === N("DeviceGray")) return 1;
  const resolved = cs instanceof PDFRef ? doc.context.lookup(cs) : cs;
  if (resolved instanceof PDFArray && resolved.get(0) === N("ICCBased")) {
    const profile = doc.context.lookup(resolved.get(1));
    if (profile instanceof PDFRawStream) {
      const n = num(profile.dict, "N");
      if (n === 1 || n === 3) return n;
    }
  }
  return undefined;
}

/** Plain 8-bit Flate data with no predictor, i.e. raw pixels once inflated. */
function isPlainFlate(dict: PDFDict): boolean {
  return (
    dict.get(N("Filter")) === N("FlateDecode") &&
    !dict.has(N("DecodeParms")) &&
    !dict.has(N("Decode")) &&
    !dict.has(N("Matte")) &&
    !dict.has(N("ImageMask")) &&
    num(dict, "BitsPerComponent") === 8
  );
}

function hashStream(stream: PDFRawStream | undefined): string {
  return stream
    ? createHash("sha1").update(stream.contents).digest("hex")
    : "none";
}

/** Rewrites every /XObject resource entry that points at a duplicate. */
function remapXObjectRefs(doc: PDFDocument, remap: Map<PDFRef, PDFRef>) {
  const visit = (obj: PDFObject | undefined) => {
    const dict =
      obj instanceof PDFDict
        ? obj
        : obj instanceof PDFRawStream
          ? obj.dict
          : undefined;
    if (!dict) return;
    const resources = doc.context.lookup(dict.get(N("Resources")));
    if (!(resources instanceof PDFDict)) return;
    const xobjects = doc.context.lookup(resources.get(N("XObject")));
    if (!(xobjects instanceof PDFDict)) return;
    for (const [key, value] of xobjects.entries()) {
      if (value instanceof PDFRef && remap.has(value)) {
        xobjects.set(key, remap.get(value)!);
      }
    }
  };
  for (const [, obj] of doc.context.enumerateIndirectObjects()) visit(obj);
}

export async function optimizePdf(
  input: Uint8Array,
  options: OptimizeOptions = {},
): Promise<OptimizeResult> {
  const { jpegQuality, maxDimension } = { ...DEFAULTS, ...options };
  const doc = await PDFDocument.load(input, { updateMetadata: false });
  const ctx = doc.context;

  // Gather images, and work out which ones are soft masks of other images.
  const images: [PDFRef, PDFRawStream][] = [];
  const smaskUsers = new Map<PDFRef, number>();
  for (const [ref, obj] of ctx.enumerateIndirectObjects()) {
    if (!isImage(obj)) continue;
    images.push([ref, obj]);
    const smask = obj.dict.get(N("SMask"));
    if (smask instanceof PDFRef) {
      smaskUsers.set(smask, (smaskUsers.get(smask) ?? 0) + 1);
    }
  }
  const colourImages = images.filter(([ref]) => !smaskUsers.has(ref));

  // 1. De-duplicate identical images (colour data + soft mask).
  const canonical = new Map<string, PDFRef>();
  const remap = new Map<PDFRef, PDFRef>();
  const unique: [PDFRef, PDFRawStream][] = [];
  for (const [ref, image] of colourImages) {
    const smask = ctx.lookup(image.dict.get(N("SMask")));
    const key = [
      hashStream(image),
      hashStream(smask instanceof PDFRawStream ? smask : undefined),
      num(image.dict, "Width"),
      num(image.dict, "Height"),
      channelCount(doc, image.dict),
      image.dict.get(N("Filter"))?.toString(),
    ].join(":");
    const existing = canonical.get(key);
    if (existing) {
      remap.set(ref, existing);
    } else {
      canonical.set(key, ref);
      unique.push([ref, image]);
    }
  }
  if (remap.size) remapXObjectRefs(doc, remap);

  // 2 + 3. Downsample and re-encode lossless colour data as JPEG.
  let recompressed = 0;
  await Promise.all(
    unique.map(async ([ref, image]) => {
      const dict = image.dict;
      const width = num(dict, "Width");
      const height = num(dict, "Height");
      const channels = channelCount(doc, dict);
      if (!width || !height || !channels || !isPlainFlate(dict)) return;

      const smaskRef = dict.get(N("SMask"));
      const smask = ctx.lookup(smaskRef);
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      // Only resize if the soft mask can be resized in step (not shared).
      const canResize =
        scale < 1 &&
        (!(smaskRef instanceof PDFRef) ||
          (smask instanceof PDFRawStream &&
            isPlainFlate(smask.dict) &&
            smaskUsers.get(smaskRef) === 1));
      const newWidth = canResize ? Math.round(width * scale) : width;
      const newHeight = canResize ? Math.round(height * scale) : height;

      try {
        const pixels = inflateSync(image.contents);
        if (pixels.length !== width * height * channels) return;
        let pipeline = sharp(pixels, { raw: { width, height, channels } });
        if (canResize) {
          pipeline = pipeline.resize(newWidth, newHeight, {
            kernel: "lanczos3",
          });
        }
        if (channels === 1) pipeline = pipeline.toColourspace("b-w");
        const jpeg = await pipeline
          .jpeg({ quality: jpegQuality, mozjpeg: true })
          .toBuffer();
        if (!canResize && jpeg.length >= image.contents.length) return;

        let newSmask: Buffer | undefined;
        if (canResize && smask instanceof PDFRawStream) {
          const maskWidth = num(smask.dict, "Width")!;
          const maskHeight = num(smask.dict, "Height")!;
          const maskPixels = await sharp(inflateSync(smask.contents), {
            raw: { width: maskWidth, height: maskHeight, channels: 1 },
          })
            .resize(newWidth, newHeight, { kernel: "lanczos3" })
            .toColourspace("b-w")
            .raw()
            .toBuffer();
          newSmask = deflateSync(maskPixels);
        }

        const newDict = dict.clone(ctx);
        newDict.set(N("Filter"), N("DCTDecode"));
        newDict.set(N("Width"), PDFNumber.of(newWidth));
        newDict.set(N("Height"), PDFNumber.of(newHeight));
        newDict.set(N("Length"), PDFNumber.of(jpeg.length));
        ctx.assign(ref, PDFRawStream.of(newDict, jpeg));

        if (newSmask && smask instanceof PDFRawStream) {
          const maskDict = smask.dict.clone(ctx);
          maskDict.set(N("Width"), PDFNumber.of(newWidth));
          maskDict.set(N("Height"), PDFNumber.of(newHeight));
          maskDict.set(N("Length"), PDFNumber.of(newSmask.length));
          ctx.assign(smaskRef as PDFRef, PDFRawStream.of(maskDict, newSmask));
        }
        recompressed++;
      } catch (error) {
        // Leave this image as it was; one bad image shouldn't fail the PDF.
        console.warn(`optimizePdf: skipped image ${ref.toString()}:`, error);
      }
    }),
  );

  // Drop the duplicates we no longer reference (and their soft masks).
  for (const duplicate of remap.keys()) {
    const image = ctx.lookup(duplicate);
    const smask = image instanceof PDFRawStream && image.dict.get(N("SMask"));
    if (smask instanceof PDFRef && smaskUsers.get(smask) === 1) {
      ctx.delete(smask);
    }
    ctx.delete(duplicate);
  }

  const pdf = await doc.save({ useObjectStreams: true });
  return {
    pdf,
    originalBytes: input.byteLength,
    optimizedBytes: pdf.byteLength,
    deduplicated: remap.size,
    recompressed,
  };
}
