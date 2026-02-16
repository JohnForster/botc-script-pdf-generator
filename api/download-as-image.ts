import { renderCharacterSheet } from "../backend/src/renderer";
import {
  getBrowser,
  corsHeaders,
  handleApiRequest,
} from "../backend/src/api-utils";

export default {
  async fetch(request: Request): Promise<Response> {
    return handleApiRequest(request, async (body, origin) => {
      const { script, options, nightOrders } = body;

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
        origin || undefined,
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
    });
  },
};
