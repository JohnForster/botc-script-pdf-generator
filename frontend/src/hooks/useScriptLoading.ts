import { useState, useEffect } from "preact/hooks";
import type { Script } from "botc-script-checker";
import type { ParsedScript, ScriptOptions } from "botc-character-sheet";
import { loadScript as loadSharedScript } from "../utils/scriptStorage";
import JSON5 from "json5";

export function useScriptLoading(
  loadScript: (json: Script) => ParsedScript,
  setError: (error: string | null) => void,
) {
  const [sharedOptions, setSharedOptions] = useState<ScriptOptions | null>(
    null,
  );

  // Load script from URL query parameter or localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const scriptParam = params.get("script");
    const scriptUrlParam = params.get("script_url");
    const sharedParam = params.get("shared");

    // Prioritize inline script over URL
    if (scriptParam) {
      try {
        const decoded = decodeURIComponent(scriptParam);
        const json = JSON5.parse(decoded);
        loadScript(json);
      } catch (err) {
        console.error("Failed to load script from URL:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to parse script from URL",
        );
      }
    } else if (scriptUrlParam) {
      const url = decodeURIComponent(scriptUrlParam);
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then((text) => {
          const json = JSON5.parse(text);
          loadScript(json);
        })
        .catch((err) => {
          console.error("Failed to fetch script from URL:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch script from URL",
          );
        });
    } else if (sharedParam) {
      // Load from Firestore shared script
      loadSharedScript(sharedParam)
        .then((data) => {
          if (!data) {
            setError("Shared script not found");
            return;
          }
          loadScript(data.rawScript);
          setSharedOptions(data.options);
        })
        .catch((err) => {
          console.error("Failed to load shared script:", err);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load shared script",
          );
        });
    } else {
      // Load from localStorage
      const saved = localStorage.getItem("script");
      if (saved) {
        try {
          loadScript(JSON.parse(saved));
        } catch {
          /* ignore corrupt data */
        }
      }
    }
  }, []);

  // Setup paste event listener
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedText = event.clipboardData?.getData("text");
      if (!pastedText) return;

      try {
        const json = JSON5.parse(pastedText);
        loadScript(json);
      } catch (err) {
        // Ignore paste if it's not valid JSON
        console.log("Pasted content is not valid JSON, ignoring");
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON5.parse(e.target?.result as string);
        loadScript(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse JSON");
      }
    };
    reader.readAsText(file);
  };

  return { sharedOptions, handleFileUpload };
}
