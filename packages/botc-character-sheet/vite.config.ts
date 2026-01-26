import { defineConfig, Plugin, HmrContext } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";
import { exec } from "child_process";
import { promisify } from "util";

export default defineConfig({
  plugins: [preact(), tscPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CharacterSheet",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ["preact", "preact/hooks"],
      output: {
        // Provide global variables for externalized deps (not needed for ES modules but good practice)
        globals: {
          preact: "preact",
          "preact/hooks": "preactHooks",
        },
      },
    },
    // Ensure CSS is extracted to a separate file
    cssCodeSplit: false,
  },
});

const execAsync = promisify(exec);

// Custom plugin to run tsc on hot reload
function tscPlugin(): Plugin {
  return {
    name: "run-tsc",
    async writeBundle() {
      console.log("Running tsc to emit types...");
      try {
        await execAsync("tsc --emitDeclarationOnly");
        console.log("Types emitted successfully");
      } catch (error) {
        console.error("tsc error:", error);
      }
    },
  };
}
