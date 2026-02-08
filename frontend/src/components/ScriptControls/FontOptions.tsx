import { Select } from "../ui";

const TITLE_FONT_OPTIONS = [
  { value: "Alice in Wonderland", label: "Alice in Wonderland" },
  { value: "Anglican", label: "Anglican" },
  { value: "Canterbury Regular", label: "Canterbury" },
  { value: "Utm Agin", label: "Utm Agin" },
  { value: "Waters Gothic", label: "Waters Gothic" },
];

interface FontOptionsProps {
  titleFont: string;
  customFontUrl: string;
  titleLetterSpacing: number;
  titleWordSpacing: number;
  onTitleFontChange: (value: string) => void;
  onCustomFontUrlChange: (value: string) => void;
  onTitleLetterSpacingChange: (value: number) => void;
  onTitleWordSpacingChange: (value: number) => void;
}

export function FontOptions({
  titleFont,
  customFontUrl,
  titleLetterSpacing,
  titleWordSpacing,
  onTitleFontChange,
  onCustomFontUrlChange,
  onTitleLetterSpacingChange,
  onTitleWordSpacingChange,
}: FontOptionsProps) {
  return (
    <>
      <Select
        label="Title Font"
        value={titleFont}
        options={TITLE_FONT_OPTIONS}
        onChange={onTitleFontChange}
      />
      <div>
        <div className="form-control">
          <label className="form-control-label">
            <span className="form-control-text">Custom Font URL</span>
            <input
              type="text"
              value={customFontUrl}
              placeholder="https://example.com/font.ttf"
              onInput={(e) =>
                onCustomFontUrlChange((e.target as HTMLInputElement).value)
              }
              className="text-input"
            />
          </label>
          {customFontUrl && (
            <button
              type="button"
              className="delete-button"
              onClick={() => onCustomFontUrlChange("")}
              title="Clear custom font URL"
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
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          )}
        </div>
        <p className="print-options-hint">
          Overrides the font selection above.
        </p>
      </div>
      <div className="form-control">
        <label className="form-control-label">
          <span className="form-control-text">Letter Spacing (mm)</span>
          <input
            type="number"
            value={titleLetterSpacing}
            step={0.1}
            onInput={(e) =>
              onTitleLetterSpacingChange(
                parseFloat((e.target as HTMLInputElement).value) || 0,
              )
            }
            className="text-input"
            style={{ width: "80px" }}
          />
        </label>
      </div>
      <div className="form-control">
        <label className="form-control-label">
          <span className="form-control-text">Word Spacing (mm)</span>
          <input
            type="number"
            value={titleWordSpacing}
            step={0.1}
            onInput={(e) =>
              onTitleWordSpacingChange(
                parseFloat((e.target as HTMLInputElement).value) || 0,
              )
            }
            className="text-input"
            style={{ width: "80px" }}
          />
        </label>
      </div>
    </>
  );
}
