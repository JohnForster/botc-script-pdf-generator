interface UploadSectionProps {
  hasScript: boolean;
  onFileUpload: (event: Event) => void;
  onPasteButtonClick: () => void;
  onLoadExample: () => void;
  onLoadExampleTeensyville: () => void;
}

export function UploadSection({
  hasScript,
  onFileUpload,
  onPasteButtonClick,
  onLoadExample,
  onLoadExampleTeensyville,
}: UploadSectionProps) {
  const isMac = navigator.userAgent.includes("Mac");
  return (
    <>
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-label">
          Upload JSON
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json,.json5"
          onChange={onFileUpload}
          className="file-input"
        />
        <div className="or">or</div>
        <div className="paste-hint">
          Paste directly with {isMac ? "⌘" : "ctrl"}+V
        </div>
        <button
          type="button"
          className="paste-button"
          onClick={onPasteButtonClick}
        >
          Paste
        </button>
      </div>

      {!hasScript && (
        <div className="example-section">
          <button onClick={onLoadExample} className="example-button">
            Load Example Script
          </button>
          <button onClick={onLoadExampleTeensyville} className="example-button">
            Load Example Teensyville
          </button>
        </div>
      )}
    </>
  );
}
