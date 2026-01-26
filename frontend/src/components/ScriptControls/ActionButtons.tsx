interface ActionButtonsProps {
  isScriptSorted: boolean;
  error: string | null;
  onSort: () => void;
  onGeneratePDF: () => void;
  onPrint: () => void;
}

export function ActionButtons({
  isScriptSorted,
  error,
  onSort,
  onGeneratePDF,
  onPrint,
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
    </div>
  );
}
