import { Select } from "../ui";
import { TitleStyle } from "../../types/options";

const TITLE_FONT_OPTIONS = [
  { value: "Alice in Wonderland", label: "Alice in Wonderland" },
  { value: "Anglican", label: "Anglican" },
  { value: "Canterbury Regular", label: "Canterbury" },
  { value: "Utm Agin", label: "Utm Agin" },
  { value: "Waters Gothic", label: "Waters Gothic" },
];

interface FontOptionsProps {
  titleStyle: TitleStyle;
  onTitleStyleChange: <K extends keyof TitleStyle>(key: K, value: TitleStyle[K]) => void;
}

export function FontOptions({
  titleStyle,
  onTitleStyleChange,
}: FontOptionsProps) {
  return (
    <>
      <Select
        label="Title Font"
        value={titleStyle.font}
        options={TITLE_FONT_OPTIONS}
        onChange={(value) => onTitleStyleChange("font", value)}
      />
      <div>
        <div className="form-control">
          <label className="form-control-label">
            <span className="form-control-text">Custom Font URL</span>
            <input
              type="text"
              value={titleStyle.customFontUrl}
              placeholder="https://example.com/font.ttf"
              onInput={(e) =>
                onTitleStyleChange("customFontUrl", (e.target as HTMLInputElement).value)
              }
              className="text-input"
            />
          </label>
          {titleStyle.customFontUrl && (
            <button
              type="button"
              className="delete-button"
              onClick={() => onTitleStyleChange("customFontUrl", "")}
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
            value={titleStyle.letterSpacing}
            step={0.1}
            onInput={(e) =>
              onTitleStyleChange(
                "letterSpacing",
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
            value={titleStyle.wordSpacing}
            step={0.1}
            onInput={(e) =>
              onTitleStyleChange(
                "wordSpacing",
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
          <span className="form-control-text">Line Height (mm)</span>
          <input
            type="number"
            value={titleStyle.lineHeight}
            step={0.5}
            onInput={(e) =>
              onTitleStyleChange(
                "lineHeight",
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
          <span className="form-control-text">Margin Top (mm)</span>
          <input
            type="number"
            value={titleStyle.marginTop}
            step={0.5}
            onInput={(e) =>
              onTitleStyleChange(
                "marginTop",
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
          <span className="form-control-text">Margin Bottom (mm)</span>
          <input
            type="number"
            value={titleStyle.marginBottom}
            step={0.5}
            onInput={(e) =>
              onTitleStyleChange(
                "marginBottom",
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
