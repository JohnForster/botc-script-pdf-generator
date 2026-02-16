import { useState } from "preact/hooks";
import type { SavedScript } from "../hooks/useSavedScripts";
import "./SavedScriptsPanel.css";

interface SavedScriptsPanelProps {
  savedScripts: SavedScript[];
  onLoad: (saved: SavedScript) => void;
  onDelete: (id: string) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function SavedScriptsPanel({
  savedScripts,
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
          {savedScripts.map((saved) => (
            <li key={saved.id} className="saved-script-item">
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
                  <div
                    className="saved-script-info"
                    onClick={() => onLoad(saved)}
                  >
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
          ))}
        </ul>
      </div>
    </>
  );
}
