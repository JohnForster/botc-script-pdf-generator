import { useEffect } from "preact/hooks";
import type { Script } from "botc-script-checker";

export function useScriptPersistence(
  rawScript: Script | null,
  scriptName: string | undefined,
): void {
  // Persist script to localStorage
  useEffect(() => {
    if (rawScript) {
      localStorage.setItem("script", JSON.stringify(rawScript));
    }
  }, [rawScript]);

  // Update page title when script changes
  useEffect(() => {
    if (scriptName) {
      document.title = `${scriptName} Fancy`;
    } else {
      document.title = "Blood on the Clocktower - Script PDF Maker";
    }
  }, [scriptName]);
}
