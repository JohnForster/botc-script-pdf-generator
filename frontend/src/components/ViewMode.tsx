import { useState, useEffect } from "preact/hooks";
import type { ScriptOptions, ParsedScript, NightOrders } from "botc-character-sheet";
import { FancyDoc, TeensyDoc } from "botc-character-sheet";
import { DEFAULT_OPTIONS } from "../types/options";
import { loadScript as loadSharedScript } from "../utils/scriptStorage";
import { parseScript } from "../utils/scriptParser";
import { calculateNightOrders } from "../utils/nightOrders";
import { useMobilePreviewScale } from "../hooks/useMobileControls";

interface ViewModeProps {
  scriptId: string;
}

export function ViewMode({ scriptId }: ViewModeProps) {
  const [script, setScript] = useState<ParsedScript | null>(null);
  const [options, setOptions] = useState<ScriptOptions>(DEFAULT_OPTIONS);
  const [nightOrders, setNightOrders] = useState<NightOrders>({
    first: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useMobilePreviewScale(options.dimensions.width);

  useEffect(() => {
    async function fetchSharedScript() {
      try {
        const data = await loadSharedScript(scriptId);
        if (!data) {
          setError("Script not found");
          setLoading(false);
          return;
        }

        const parsed = parseScript(data.rawScript);
        setScript(parsed);
        setOptions(data.options);
        setNightOrders(calculateNightOrders(parsed, data.rawScript));
      } catch (err) {
        console.error("Failed to load shared script:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load shared script",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSharedScript();
  }, [scriptId]);

  // Update page title when script loads
  useEffect(() => {
    if (script?.metadata?.name) {
      document.title = `${script.metadata.name} Fancy`;
    }
  }, [script?.metadata?.name]);

  if (loading) {
    return (
      <div className="app">
        <div className="placeholder">
          <p className="placeholder-text">Loading shared script...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="placeholder">
          <p className="placeholder-text error-text">{error}</p>
          <a href="/" className="edit-link">
            Go to Editor
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app view-mode">
      <a href={`/?shared=${scriptId}`} className="edit-button" title="Open in Editor">
        Edit
      </a>

      {script && options.teensy && (
        <div className="preview-section teensy-preview">
          <TeensyDoc
            script={script}
            options={{
              ...options,
              dimensions: {
                ...options.dimensions,
                width: options.dimensions.height / 2,
                height: options.dimensions.width,
              },
            }}
            nightOrders={nightOrders}
          />
        </div>
      )}

      {script && !options.teensy && (
        <div className="preview-section">
          <FancyDoc script={script} options={options} nightOrders={nightOrders} />
        </div>
      )}
    </div>
  );
}
