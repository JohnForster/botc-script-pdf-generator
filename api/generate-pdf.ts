import { renderCharacterSheet } from "../backend/src/renderer.ts";
import {
  NetworkPayload,
  ParsedScript,
  ScriptOptions,
} from "botc-character-sheet";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { PDFDocument } from "pdf-lib";

// Conditionally import puppeteer based on environment
const isServerless =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Security configuration
const MAX_PAYLOAD_SIZE = 500 * 1024; // 500KB
const MAX_CHARACTERS = 100;

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) return true;
  if (origin === "https://fancy.ravenswoodstudio.xyz") return true;
  if (origin.endsWith(".vercel.app")) return true;
  return false;
}

// Optional API key for additional security (set in Vercel environment variables)
const API_KEY = process.env.PDF_API_KEY;

async function getBrowser() {
  if (isServerless) {
    return puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath: await chromium.executablePath(),
      headless: "shell",
      ignoreHTTPSErrors: true,
    });
  } else {
    // Local: Full Puppeteer with bundled Chrome
    const puppeteerModule = await import("puppeteer");
    const puppeteer = puppeteerModule.default;

    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
      ],
    });
  }
}

function corsHeaders(origin: string | null): HeadersInit {
  if (!origin || !isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  };
}

function jsonResponse(data: object, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    const origin = request.headers.get("origin");
    const originAllowed = isAllowedOrigin(origin);
    console.log("origin, isAllowedOrigin:", origin, originAllowed);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
      });
    }

    // Only allow POST requests
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    // Check origin
    if (origin && !originAllowed) {
      return jsonResponse({ error: "Forbidden: Invalid origin" }, 403, origin);
    }

    // Optional API key check
    if (API_KEY && request.headers.get("x-api-key") !== API_KEY) {
      return jsonResponse({ error: "Unauthorized: Invalid API key" }, 401, origin);
    }

    try {
      const body = await request.json() as NetworkPayload;

      // Validate payload size
      const payloadSize = JSON.stringify(body).length;
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        return jsonResponse({
          error: `Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE / 1024}KB`,
        }, 413, origin);
      }

      const { script, options, filename, nightOrders } = body;

      try {
        validateScript(script);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown Error";
        return new Response(message, {
          status: 400,
          headers: corsHeaders(origin),
        });
      }

      // Generate HTML with the character sheet
      const html = renderCharacterSheet(
        script,
        options || {},
        nightOrders || { first: [], other: [] },
        origin || undefined,
      );

      // Launch Puppeteer
      const browser = await getBrowser();

      const page = await browser.newPage();

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

      const format =
        options.dimensions.height === 297 && options.dimensions.width === 210
          ? "A4"
          : "Letter";

      // Generate PDF
      let startTime = Date.now();
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
      let endTime = Date.now();
      console.log(
        `PDF generated in ${endTime - startTime} ms (${options.numberOfCharacterSheets} character sheets, ${script.characters.length} characters)`,
      );

      browser.close();

      const pdfDoc = await PDFDocument.load(pdf);
      let finalPDF = await duplicateCharacterSheets(pdfDoc, options);

      // Set response headers
      const pdfFilename = filename || "script.pdf";

      return new Response(finalPDF, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${pdfFilename}"`,
          "Content-Length": finalPDF.byteLength.toString(),
          ...corsHeaders(origin),
        },
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      return jsonResponse({
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : "Unknown error",
      }, 500, origin);
    }
  },
};

function validateScript(script: ParsedScript): void {
  // Validate required fields
  if (!script || !script.characters || !script.characters.length) {
    throw new Error("Invalid script format");
  }

  // Validate character count
  const characterCount = script.characters.filter(
    (el: any) =>
      typeof el === "string" || (typeof el === "object" && el.id !== "_meta"),
  ).length;

  if (characterCount > MAX_CHARACTERS) {
    throw new Error(`Too many characters. Maximum is ${MAX_CHARACTERS}`);
  }
}

async function duplicateCharacterSheets(
  pdfDoc: PDFDocument,
  options: ScriptOptions,
) {
  if (options.teensy) {
    return pdfDoc.save();
  }

  if (options.overleaf === "none") {
    const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [1]);
    for (let i = 1; i < options.numberOfCharacterSheets; i++) {
      pdfDoc.insertPage(1, copiedPage);
    }
  } else {
    const [sheet, back] = await pdfDoc.copyPages(pdfDoc, [0, 1]);
    for (let i = 1; i < options.numberOfCharacterSheets; i++) {
      pdfDoc.insertPage(2, back);
      pdfDoc.insertPage(2, sheet);
    }
  }
  const modifiedBytes = await pdfDoc.save();
  return modifiedBytes;
}
