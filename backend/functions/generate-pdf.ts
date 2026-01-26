import type { VercelRequest, VercelResponse } from "@vercel/node";
import { renderCharacterSheet } from "../src/renderer.ts";
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

function isAllowedOrigin(origin: string | undefined): boolean {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all responses
  const origin = req.headers.origin;
  const originAllowed = isAllowedOrigin(origin);
  console.log("origin, isAllowedOrigin:", origin, originAllowed);

  if (originAllowed && origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check origin
  if (origin && !originAllowed) {
    return res.status(403).json({ error: "Forbidden: Invalid origin" });
  }

  // Optional API key check
  if (API_KEY && req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API key" });
  }

  try {
    // Validate payload size
    const payloadSize = JSON.stringify(req.body).length;
    if (payloadSize > MAX_PAYLOAD_SIZE) {
      return res.status(413).json({
        error: `Payload too large. Maximum size is ${
          MAX_PAYLOAD_SIZE / 1024
        }KB`,
      });
    }

    const { script, options, filename, nightOrders } =
      req.body as NetworkPayload;

    try {
      validateScript(script);
    } catch (err) {
      return err instanceof Error
        ? res.status(400).send(err.message)
        : res.status(400).send("Unknown Error");
    }

    // Generate HTML with the character sheet
    const html = renderCharacterSheet(
      script,
      options || {},
      nightOrders || { first: [], other: [] },
      origin,
    );

    // Launch Puppeteer
    const browser = await getBrowser();

    const page = await browser.newPage();

    page.on("request", (request) => {
      console.log("request:", request.url());
    });

    page.on("response", (response) => {
      console.log("response:", response.url(), response.status());
    });

    page.on("requestfailed", (request) => {
      console.log(request.url() + " " + request.failure()?.errorText);
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
    let pdfBuffer = Buffer.from(finalPDF);
    // Set response headers
    const pdfFilename = filename || "script.pdf";
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${pdfFilename}"`,
    );
    res.setHeader("Content-Length", pdf.length);

    // Send PDF
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({
      error: "Failed to generate PDF",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

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
