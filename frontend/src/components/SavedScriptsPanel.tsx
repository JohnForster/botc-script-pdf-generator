import { useState } from "preact/hooks";
import type { SavedScript } from "../hooks/useSavedScripts";
import "./SavedScriptsPanel.css";

interface SavedScriptsPanelProps {
  savedScripts: SavedScript[];
  activeScriptId: string | null;
  onLoad: (saved: SavedScript) => void;
  onDelete: (id: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

function getScriptColour(saved: SavedScript): string | string[] | null {
  for (const element of saved.script) {
    if (
      typeof element === "object" &&
      element !== null &&
      "id" in element &&
      element.id === "_meta"
    ) {
      const colour = (element as Record<string, unknown>).colour;
      if (typeof colour === "string") return colour;
      if (Array.isArray(colour) && colour.length > 0) return colour as string[];
    }
  }
  return null;
}

function colourCssVar(colour: string | string[] | null): string | undefined {
  if (!colour) return undefined;
  if (typeof colour === "string") return colour;
  return `linear-gradient(to bottom, ${colour.join(", ")})`;
}

export function SavedScriptsPanel({
  savedScripts,
  activeScriptId,
  onLoad,
  onDelete,
  isMobileOpen,
  onMobileClose,
}: SavedScriptsPanelProps) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  return (
    <>
      {isMobileOpen && (
        <div className="saved-scripts-backdrop" onClick={onMobileClose} />
      )}
      <div
        className={`saved-scripts-panel ${isMobileOpen ? "mobile-open" : ""}`}
      >
        <div className="saved-scripts-header">
          <h2 className="saved-scripts-title">Saved Scripts</h2>
          <button
            className="saved-scripts-close"
            onClick={onMobileClose}
            aria-label="Close saved scripts"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <ul className="saved-scripts-list">
          {savedScripts.map((saved) => {
            const colourValue = colourCssVar(getScriptColour(saved));
            const isActive = saved.id === activeScriptId;
            return (
              <li
                key={saved.id}
                className={`saved-script-item ${isActive ? "active" : ""}`}
                style={
                  colourValue
                    ? ({ "--script-colour": colourValue } as Record<
                        string,
                        string
                      >)
                    : undefined
                }
                onClick={() => {
                  if (confirmingId !== saved.id) onLoad(saved);
                }}
              >
                {confirmingId === saved.id ? (
                  <div
                    className="saved-script-confirm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="saved-script-confirm-text">Delete?</span>
                    <div className="saved-script-confirm-buttons">
                      <button
                        className="saved-script-confirm-delete"
                        onClick={() => {
                          onDelete(saved.id);
                          setConfirmingId(null);
                        }}
                      >
                        Delete
                      </button>
                      <button
                        className="saved-script-confirm-cancel"
                        onClick={() => setConfirmingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="saved-script-info">
                      <span className="saved-script-name">{saved.name}</span>
                      <span className="saved-script-date">
                        {new Date(saved.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      className="saved-script-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmingId(saved.id);
                      }}
                      aria-label={`Delete ${saved.name}`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
