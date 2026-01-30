interface ActionButtonsProps {
  isScriptSorted: boolean;
  error: string | null;
  onSort: () => void;
  onGeneratePDF: () => void;
  onGenerateImages: () => void;
  onPrint: () => void;
  onShare: () => void;
  isSharing: boolean;
  shareUrl: string | null;
  shareError: string | null;
}

export function ActionButtons({
  isScriptSorted,
  error,
  onSort,
  onGeneratePDF,
  onGenerateImages,
  onPrint,
  onShare,
  isSharing,
  shareUrl,
  shareError,
}: ActionButtonsProps) {
  return (
    <div className="action-buttons-section">
      <div className="action-buttons">
        <button onClick={onGeneratePDF} className="print-button primary">
          Generate PDF
        </button>
        <button onClick={onPrint} className="print-button">
          Browser Print
        </button>
        <button onClick={onGenerateImages} className="print-button">
          Download as Image
        </button>
        <button
          onClick={onSort}
          className={`sort-button${!isScriptSorted ? " glow" : ""}`}
        >
          Sort Script
        </button>
      </div>

      <p className="browser-print-note">
        Browser Print only works reliably in Chromium-based browsers
        <br />
        (Chrome, Edge, Brave, etc.)
      </p>
      <p className="browser-print-note">
        Produced PDFs don't work with some readers (eg. MacOS Preview). If you
        have issues, try opening the PDF in a different reader or browser.
      </p>

      {!isScriptSorted && (
        <div className="warning-message">
          <strong>Script Not Sorted:</strong> This script doesn't follow the
          official sorting order. Click "Sort Script" to fix this.
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button onClick={onShare} className="share-button" disabled={isSharing}>
        <ShareIcon />
        {isSharing ? "Sharing..." : "Share Script"}
      </button>

      {shareUrl && (
        <div className="success-message">
          Link copied to clipboard:{" "}
          <a href={shareUrl} target="_blank" rel="noopener noreferrer">
            {shareUrl}
          </a>
        </div>
      )}

      {shareError && <div className="error-message">{shareError}</div>}
    </div>
  );
}

function ShareIcon() {
  return (
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
