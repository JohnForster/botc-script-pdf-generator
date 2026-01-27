import { renderCharacterSheet } from "../backend/src/renderer";
import { NetworkPayload, ParsedScript } from "botc-character-sheet";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

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

function jsonResponse(
  data: object,
  status: number,
  origin: string | null
): Response {
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
      return jsonResponse(
        { error: "Unauthorized: Invalid API key" },
        401,
        origin
      );
    }

    try {
      const body = (await request.json()) as NetworkPayload;

      // Validate payload size
      const payloadSize = JSON.stringify(body).length;
      if (payloadSize > MAX_PAYLOAD_SIZE) {
        return jsonResponse(
          {
            error: `Payload too large. Maximum size is ${MAX_PAYLOAD_SIZE / 1024}KB`,
          },
          413,
          origin
        );
      }

      const { script, options, nightOrders } = body;

      try {
        validateScript(script);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown Error";
        return new Response(message, {
          status: 400,
          headers: corsHeaders(origin),
        });
      }

      // Force options to render both character sheet and info sheet
      const renderOptions = {
        ...options,
        numberOfCharacterSheets: 1,
        overleaf: "infoSheet" as const,
        showNightSheet: false,
      };

      // Generate HTML with the character sheet
      const html = renderCharacterSheet(
        script,
        renderOptions,
        nightOrders || { first: [], other: [] },
        origin || undefined
      );

      // Launch Puppeteer
      const browser = await getBrowser();
      const page = await browser.newPage();

      page.on("requestfailed", (req) => {
        console.log(req.url() + " " + req.failure()?.errorText);
      });

      // Set content and wait for fonts/images to load
      await page.setContent(html, {
        waitUntil: ["networkidle0", "load"],
      });

      // Calculate dimensions in pixels (assuming 96 DPI)
      const widthMm = options.dimensions.width;
      const heightMm = options.dimensions.height;
      const widthPx = Math.round((widthMm / 25.4) * 96 * 2); // 2x for higher resolution
      const heightPx = Math.round((heightMm / 25.4) * 96 * 2);

      await page.setViewport({
        width: widthPx,
        height: heightPx,
        deviceScaleFactor: 2,
      });

      // Take screenshot of character sheet (first printable page)
      const characterSheetElement = await page.$(".printable-page");
      let characterSheetImage: Buffer | null = null;

      if (characterSheetElement) {
        characterSheetImage = await characterSheetElement.screenshot({
          type: "png",
          omitBackground: false,
        });
      }

      // Take screenshot of info sheet (second printable page)
      const printablePages = await page.$$(".printable-page");
      let infoSheetImage: Buffer | null = null;

      if (printablePages.length > 1) {
        infoSheetImage = await printablePages[1].screenshot({
          type: "png",
          omitBackground: false,
        });
      }

      await browser.close();

      // Return both images as JSON with base64 encoded data
      const response = {
        characterSheet: characterSheetImage
          ? characterSheetImage.toString("base64")
          : null,
        infoSheet: infoSheetImage ? infoSheetImage.toString("base64") : null,
      };

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(origin),
        },
      });
    } catch (error) {
      console.error("Image generation error:", error);
      return jsonResponse(
        {
          error: "Failed to generate images",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        500,
        origin
      );
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
      typeof el === "string" || (typeof el === "object" && el.id !== "_meta")
  ).length;

  if (characterCount > MAX_CHARACTERS) {
    throw new Error(`Too many characters. Maximum is ${MAX_CHARACTERS}`);
  }
}
