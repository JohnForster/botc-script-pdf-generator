import { h } from "preact";
import render from "preact-render-to-string";
import {
  ParsedScript,
  FancyDoc,
  NightOrderEntry,
  ScriptOptions,
  TeensyDoc,
} from "botc-character-sheet";
import { readFileSync } from "fs";
import { join } from "path";

// Default asset base URL for production
const DEFAULT_ASSET_BASE = "https://fancy.ravenswoodstudio.xyz";

// Determine base URL for assets based on environment
function getAssetBase(requestOrigin?: string): string {
  const isLocal = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;

  // For local development, use localhost
  if (isLocal) {
    return "http://localhost:5173";
  }

  // For Vercel deployments, use the request origin if available (supports preview deployments)
  if (requestOrigin) {
    return requestOrigin;
  }

  // Fallback to default production URL
  return process.env.ASSET_BASE_URL || DEFAULT_ASSET_BASE;
}

// Load CSS from the character-sheet package
function loadCSS(): string {
  try {
    // Try multiple possible paths for CSS
    // Working directory is: /Users/.../script-pdf-maker/packages/backend
    const possiblePaths = [
      // Workspace path (from backend directory - LOCAL DEV)
      join(process.cwd(), "../packages/botc-character-sheet/dist/style.css"),
      // node_modules path (Vercel deployment)
      join(process.cwd(), "node_modules/botc-character-sheet/dist/style.css"),
    ];

    for (const cssPath of possiblePaths) {
      try {
        const css = readFileSync(cssPath, "utf-8");
        console.log(`✓ Loaded CSS from: ${cssPath}`);
        return css;
      } catch (err) {
        console.log(`✗ Failed to load from: ${cssPath}`);
        // Try next path
        continue;
      }
    }

    throw new Error("CSS file not found in any expected location");
  } catch (error) {
    console.error("Failed to load CSS:", error);
    console.error("Working directory:", process.cwd());
    return "";
  }
}

// Load fonts from asset base (localhost or deployment origin)
function getFontFaces(assetBase: string): string {
  console.log(`Loading fonts from: ${assetBase}`);
  return `
    @font-face {
      font-family: 'Unlovable';
      src: url('${assetBase}/fonts/LHF_Unlovable.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Dumbledor';
      src: url('${assetBase}/fonts/Dumbledor/Dumbledor.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Trade Gothic';
      src: url('${assetBase}/fonts/TradeGothic/TradeGothic.otf') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'Goudy Old Style';
      src: url("${assetBase}/fonts/GoudyOldStyle/GoudyOldStyle.ttf");
    }
  `;
}

export interface NightOrders {
  first: NightOrderEntry[];
  other: NightOrderEntry[];
}

export function renderCharacterSheet(
  script: ParsedScript,
  options: ScriptOptions,
  nightOrders: NightOrders,
  requestOrigin?: string,
): string {
  const assetBase = getAssetBase(requestOrigin);
  let docHTML;
  if (options.teensy) {
    const dimensions = {
      ...options.dimensions,
      width: options.dimensions.height / 2,
      height: options.dimensions.width,
    };

    docHTML = render(
      h(TeensyDoc, {
        options: { ...options, dimensions },
        script,
        nightOrders,
      }),
    );
  } else {
    docHTML = render(
      h(FancyDoc, {
        options: { ...options, numberOfCharacterSheets: 1 },
        script,
        nightOrders,
      }),
    );
  }

  // Load CSS
  const css = loadCSS();
  const fontFaces = getFontFaces(assetBase);

  // Replace relative image URLs with absolute URLs pointing to asset base
  console.log(`Loading images from: ${assetBase}`);
  const processedCss = css
    .replace(/url\(\/images\//g, `url(${assetBase}/images/`)
    .replace(/url\("\/images\//g, `url("${assetBase}/images/`)
    .replace(/url\('\/images\//g, `url('${assetBase}/images/`);

  // Also fix image src attributes in the rendered HTML
  const processedFancyDocHTML = docHTML
    .replace(/src="\/images\//g, `src="${assetBase}/images/`)
    .replace(/src='\/images\//g, `src='${assetBase}/images/`);

  const orientation = options.teensy ? "landscape" : "portrait";

  const pageSize =
    options.dimensions.width === 210 && options.dimensions.height === 297
      ? "A4"
      : "Letter";

  // Create complete HTML document
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Character Sheet PDF</title>
  <style>
    ${fontFaces}

    * {
      box-sizing: border-box;
    }

    body {
      margin: 10mm;
      padding: 10mm;
      background: white;
    }

    .sheet-wrapper {
      display: flex;
      flex-direction: column;
      page-break-inside: avoid;
    }

    @page { size: ${pageSize} ${orientation}; margin: 0; }

    @media print {
      html {
        visibility: hidden;
      }

      .sheet-wrapper {
        visibility: visible;
        position: absolute;
        left: 0;
        top: 0;
      }
    }


    ${processedCss}
  </style>
</head>
<body>
${processedFancyDocHTML}
</body>
</html>
  `;

  return html;
}
