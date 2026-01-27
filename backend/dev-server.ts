/**
 * Local development server using Bun
 * Wraps the Vercel function handler for local testing
 */
import pdfHandler from "../api/generate-pdf";
import imageHandler from "../api/download-as-image";

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/api/generate-pdf") {
      return pdfHandler.fetch(req);
    }

    if (url.pathname === "/api/download-as-image") {
      return imageHandler.fetch(req);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Backend dev server running at http://localhost:${PORT}`);
