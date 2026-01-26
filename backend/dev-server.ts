/**
 * Local development server using Bun
 * Wraps the Vercel function handler for local testing
 */
import handler from "./functions/generate-pdf";

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Only handle /api/generate-pdf
    if (url.pathname !== "/api/generate-pdf") {
      return new Response("Not Found", { status: 404 });
    }

    // Create mock Vercel request/response objects
    const headers: Record<string, string | string[] | undefined> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value;
    });

    let body: any = undefined;
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    }

    const vercelReq = {
      method: req.method,
      headers,
      body,
      query: Object.fromEntries(url.searchParams),
    } as any;

    // Capture response
    let statusCode = 200;
    const responseHeaders = new Headers();
    let responseBody: any = null;

    const vercelRes = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      setHeader(key: string, value: string) {
        responseHeaders.set(key, value);
        return this;
      },
      json(data: any) {
        responseHeaders.set("Content-Type", "application/json");
        responseBody = JSON.stringify(data);
        return this;
      },
      send(data: any) {
        responseBody = data;
        return this;
      },
      end() {
        return this;
      },
    } as any;

    try {
      await handler(vercelReq, vercelRes);
    } catch (error) {
      console.error("Handler error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(responseBody, {
      status: statusCode,
      headers: responseHeaders,
    });
  },
});

console.log(`Backend dev server running at http://localhost:${PORT}`);
