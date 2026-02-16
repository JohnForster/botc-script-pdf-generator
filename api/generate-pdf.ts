import { renderCharacterSheet } from "../backend/src/renderer";
import { gzipSync } from "node:zlib";
import {
  getBrowser,
  corsHeaders,
  handleApiRequest,
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

      // Set response headers
      const pdfFilename = filename || "script.pdf";
      const compressed = gzipSync(pdf);

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
