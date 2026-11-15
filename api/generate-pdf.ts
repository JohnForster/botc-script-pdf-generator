import { renderCharacterSheet, getAssetBase } from "../backend/src/renderer";
import { optimizePdf } from "../backend/src/optimizePdf";
import { gzipSync } from "node:zlib";
import {
  withPage,
  corsHeaders,
  handleApiRequest,
  serveBundledAssets,
} from "../backend/src/api-utils";

export default {
  async fetch(request: Request): Promise<Response> {
    return handleApiRequest(request, async (body, origin) => {
      const { script, options, filename, nightOrders } = body;

      // Generate HTML with the character sheet
      const html = renderCharacterSheet(
        script,
        options,
        nightOrders || { first: [], other: [] },
        origin || undefined,
      );

      const format =
        options.dimensions.height === 297 && options.dimensions.width === 210
          ? "A4"
          : "Letter";

      // Render with a (possibly warm, reused) Chromium instance
      const pdf = await withPage(async (page) => {
        await serveBundledAssets(page, getAssetBase(origin || undefined));

        page.on("request", (req) => {
          console.log("request:", req.url());
        });

        page.on("response", (response) => {
          console.log("response:", response.url(), response.status());
        });

        page.on("requestfailed", (req) => {
          console.log(req.url() + " " + req.failure()?.errorText);
        });

        // Set content and wait for fonts/images to load
        await page.setContent(html, {
          waitUntil: ["networkidle0", "load"],
        });

        // Generate PDF
        const startTime = Date.now();
        const pdf = await page.pdf({
          format,
          printBackground: true,
          margin: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
          landscape: options.teensy ? true : false,
          preferCSSPageSize: true,
          waitForFonts: true,
          timeout: 60_000,
        });
        console.log(
          `PDF generated in ${Date.now() - startTime} ms (${options.numberOfCharacterSheets} character sheets, ${script.characters.length} characters)`,
        );
        return pdf;
      });

      // Shrink the PDF (dedupe + JPEG-recompress images). Fall back to the
      // original PDF if anything goes wrong.
      let output: Uint8Array = pdf;
      const startTime = Date.now();
      try {
        const result = await optimizePdf(pdf);
        output = result.pdf;
        console.log(
          `PDF optimised in ${Date.now() - startTime} ms: ${(result.originalBytes / 1048576).toFixed(2)} MB -> ${(result.optimizedBytes / 1048576).toFixed(2)} MB (${result.deduplicated} duplicate images removed, ${result.recompressed} recompressed)`,
        );
      } catch (error) {
        console.error("PDF optimisation failed, sending original:", error);
      }

      // Set response headers
      const pdfFilename = filename || "script.pdf";
      const compressed = gzipSync(output);

      return new Response(compressed, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Encoding": "gzip",
          "Content-Disposition": `attachment; filename="${pdfFilename}"`,
          "Content-Length": compressed.byteLength.toString(),
          ...corsHeaders(origin),
        },
      });
    });
  },
};
