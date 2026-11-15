import { NetworkPayload, ParsedScript } from "botc-character-sheet";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

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

async function launchBrowser() {
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

type Browser = Awaited<ReturnType<typeof launchBrowser>>;
type BrowserPage = Awaited<ReturnType<Browser["newPage"]>>;

// The browser is cached at module scope so that warm invocations of the
// serverless function reuse it instead of launching Chromium again. Each
// request gets its own browser context (see `withPage`), so no cookies, cache
// or page state leaks between requests.
let browserPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserPromise) {
    const browser = await browserPromise.catch(() => null);
    if (browser?.connected) {
      console.log("Reusing warm browser");
      return browser;
    }
  }
  const startTime = Date.now();
  const launch = launchBrowser();
  browserPromise = launch;
  try {
    const browser = await launch;
    console.log(`Launched browser in ${Date.now() - startTime} ms`);
    browser.once("disconnected", () => {
      if (browserPromise === launch) browserPromise = null;
    });
    return browser;
  } catch (error) {
    if (browserPromise === launch) browserPromise = null;
    throw error;
  }
}

/**
 * Runs `fn` with a fresh page in its own browser context, then closes the
 * context. If the cached browser turns out to be dead (e.g. the instance was
 * frozen between invocations), it relaunches Chromium and retries once.
 */
export async function withPage<T>(
  fn: (page: BrowserPage) => Promise<T>,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    const browser = await getBrowser();
    let context: Awaited<ReturnType<Browser["createBrowserContext"]>> | null =
      null;
    try {
      context = await browser.createBrowserContext();
      const page = await context.newPage();
      return await fn(page);
    } catch (error) {
      if (attempt === 1 && !browser.connected) {
        console.warn("Browser disconnected mid-request, relaunching:", error);
        continue;
      }
      throw error;
    } finally {
      await context?.close().catch(() => {});
    }
  }
}

// Fonts and images from frontend/public are bundled with the serverless
// function (see `includeFiles` in vercel.json), so Chromium can load them from
// disk instead of fetching them over the network from the frontend origin.
// Where the bundled files end up varies by platform, so check several places.
const moduleDir = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR_CANDIDATES = [
  ...new Set([
    join(moduleDir, "../../frontend/public"), // this file is backend/src/*
    join(moduleDir, "../frontend/public"), // if bundled into api/*
    join(process.cwd(), "frontend/public"), // cwd is the project root
    join(process.cwd(), "../frontend/public"), // local dev (cwd is backend/)
    ...(process.env.LAMBDA_TASK_ROOT
      ? [join(process.env.LAMBDA_TASK_ROOT, "frontend/public")]
      : []),
  ]),
];
const publicDir = PUBLIC_DIR_CANDIDATES.find((dir) =>
  existsSync(join(dir, "fonts")),
);
if (publicDir) {
  console.log(`Serving bundled assets from ${publicDir}`);
} else {
  console.warn(
    `Bundled assets not found (cwd ${process.cwd()}). Checked:\n  ${PUBLIC_DIR_CANDIDATES.join("\n  ")}`,
  );
}

const BUNDLED_PREFIXES = ["/fonts/", "/images/"];

const CONTENT_TYPES: Record<string, string> = {
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

/**
 * Serves requests for `${assetBase}/fonts/*` and `${assetBase}/images/*` from
 * the bundled copy of frontend/public. Anything not found on disk (or not under
 * the asset base, e.g. custom character icons) falls through to the network.
 */
export async function serveBundledAssets(page: BrowserPage, assetBase: string) {
  if (!publicDir) return;
  const root = publicDir;
  let served = 0;
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.isInterceptResolutionHandled()) return;
    const url = request.url();
    const path = URL.canParse(url)
      ? decodeURIComponent(new URL(url).pathname)
      : "";
    const isAssetPath = BUNDLED_PREFIXES.some((prefix) =>
      path.startsWith(prefix),
    );
    if (isAssetPath && !url.startsWith(assetBase + "/")) {
      console.warn(`Asset not under asset base ${assetBase}: ${url}`);
    } else if (isAssetPath) {
      const filePath = normalize(join(root, path));
      if (!filePath.startsWith(root + sep) || !existsSync(filePath)) {
        console.warn(`Asset not in bundle, using network: ${url}`);
      } else {
        served++;
        request.respond({
          status: 200,
          contentType:
            CONTENT_TYPES[extname(filePath).toLowerCase()] ??
            "application/octet-stream",
          headers: { "Access-Control-Allow-Origin": "*" },
          body: readFileSync(filePath),
        });
        return;
      }
    }
    request.continue();
  });
  page.once("load", () => console.log(`Served ${served} bundled assets`));
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
