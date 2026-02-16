import { NetworkPayload, ParsedScript } from "botc-character-sheet";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export const isServerless =
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export const MAX_PAYLOAD_SIZE = 500 * 1024; // 500KB
export const MAX_CHARACTERS = 100;

export const API_KEY = process.env.PDF_API_KEY;

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) return true;
  if (origin === "https://fancy.ravenswoodstudio.xyz") return true;
  if (origin === "https://pdf.ravenswoodstudio.xyz") return true;
  if (origin.endsWith(".vercel.app")) return true;
  return false;
}

export async function getBrowser() {
  if (isServerless) {
    return puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      executablePath: await chromium.executablePath(),
      headless: "shell",
      ignoreHTTPSErrors: true,
    });
  } else {
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

export function corsHeaders(origin: string | null): HeadersInit {
  if (!origin || !isAllowedOrigin(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  };
}

export function jsonResponse(
  data: object,
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

export function validateScript(script: ParsedScript): void {
  if (!script || !script.characters || !script.characters.length) {
    throw new Error("Invalid script format");
  }

  const characterCount = script.characters.filter(
    (el: any) =>
      typeof el === "string" || (typeof el === "object" && el.id !== "_meta"),
  ).length;

  if (characterCount > MAX_CHARACTERS) {
    throw new Error(`Too many characters. Maximum is ${MAX_CHARACTERS}`);
  }
}

export async function handleApiRequest(
  request: Request,
  handler: (body: NetworkPayload, origin: string | null) => Promise<Response>,
): Promise<Response> {
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
      origin,
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
        origin,
      );
    }

    try {
      validateScript(body.script);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Error";
      return new Response(message, {
        status: 400,
        headers: corsHeaders(origin),
      });
    }

    return await handler(body, origin);
  } catch (error) {
    console.error("API request error:", error);
    return jsonResponse(
      {
        error: "Request failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
      origin,
    );
  }
}
