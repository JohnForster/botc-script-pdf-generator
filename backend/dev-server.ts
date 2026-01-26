/**
 * Local development server using Bun
 * Wraps the Vercel function handler for local testing
 */
import handler from "../api/generate-pdf";

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Only handle /api/generate-pdf
    if (url.pathname !== "/api/generate-pdf") {
      return new Response("Not Found", { status: 404 });
    }

    // The handler now uses Web API style, so we can pass the request directly
    return handler.fetch(req);
  },
});

console.log(`Backend dev server running at http://localhost:${PORT}`);
