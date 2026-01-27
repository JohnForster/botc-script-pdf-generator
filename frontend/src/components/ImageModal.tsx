interface ImageModalProps {
  isOpen: boolean;
  isLoading: boolean;
  characterSheetUrl: string | null;
  infoSheetUrl: string | null;
  error: string | null;
  onClose: () => void;
  onDownloadCharacterSheet: () => void;
  onDownloadInfoSheet: () => void;
}

export function ImageModal({
  isOpen,
  isLoading,
  characterSheetUrl,
  infoSheetUrl,
  error,
  onClose,
  onDownloadCharacterSheet,
  onDownloadInfoSheet,
}: ImageModalProps) {
  if (!isOpen) return null;

  const hasImages = characterSheetUrl || infoSheetUrl;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content-wide"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <>
            <div className="modal-spinner"></div>
            <h2 className="modal-title">Generating Images</h2>
            <p className="modal-text">This may take a minute...</p>
          </>
        )}

        {!isLoading && hasImages && (
          <>
            <div className="image-preview-container">
              {characterSheetUrl && (
                <div className="image-preview-item">
                  <h3>Character Sheet</h3>
                  <img
                    src={characterSheetUrl}
                    alt="Character Sheet"
                    className="image-preview"
                  />
                  <button
                    onClick={onDownloadCharacterSheet}
                    className="modal-button modal-button-primary"
                  >
                    Download
                  </button>
                </div>
              )}

              {infoSheetUrl && (
                <div className="image-preview-item">
                  <h3>Info Sheet</h3>
                  <img
                    src={infoSheetUrl}
                    alt="Info Sheet"
                    className="image-preview"
                  />
                  <button
                    onClick={onDownloadInfoSheet}
                    className="modal-button modal-button-primary"
                  >
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="modal-buttons">
              <button
                onClick={onClose}
                className="modal-button modal-button-secondary"
              >
                Close
              </button>
            </div>
          </>
        )}

        {!isLoading && error && (
          <>
            <svg
              className="modal-error-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="modal-title">Generation Failed</h2>
            <p className="modal-text">{error}</p>
            <div className="modal-buttons">
              <button
                onClick={onClose}
                className="modal-button modal-button-secondary"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
