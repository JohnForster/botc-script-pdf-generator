import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

async function stripCssImports(dir) {
  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = join(dir, file.name);

    if (file.isDirectory()) {
      await stripCssImports(filePath);
    } else if (file.name.endsWith(".d.ts")) {
      let content = await readFile(filePath, "utf-8");
      const originalContent = content;

      // Remove CSS import lines
      content = content.replace(/^import\s+['"].*\.css['"];?\s*\n?/gm, "");

      if (content !== originalContent) {
        await writeFile(filePath, content, "utf-8");
        console.log(`Removed CSS imports from ${filePath}`);
      }
    }
  }
}

stripCssImports("dist").catch(console.error);
