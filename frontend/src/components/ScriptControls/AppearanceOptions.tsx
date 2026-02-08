import { Toggle } from "../ui";
import { ColorPicker } from "./ColorPicker";
import { DEFAULT_OPTIONS } from "../../types/options";

interface AppearanceOptionsProps {
  color: string | string[];
  logo: string;
  iconUrlTemplate: string;
  showNightSheet: boolean;
  teensyMode: boolean;
  onColorChange: (color: string | string[]) => void;
  onColorArrayChange: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onLogoChange: (logo: string) => void;
  onIconUrlTemplateChange: (value: string) => void;
  onShowNightSheetChange: (value: boolean) => void;
  onTeensyModeChange: (value: boolean) => void;
}

export function AppearanceOptions({
  color,
  logo,
  iconUrlTemplate,
  showNightSheet,
  teensyMode,
  onColorChange,
  onColorArrayChange,
  onAddColor,
  onRemoveColor,
  onLogoChange,
  onIconUrlTemplateChange,
  onTeensyModeChange,
  onShowNightSheetChange,
}: AppearanceOptionsProps) {
  return (
    <>
      <ColorPicker
        color={color}
        onColorChange={onColorChange}
        onColorArrayChange={onColorArrayChange}
        onAddColor={onAddColor}
        onRemoveColor={onRemoveColor}
      />
      <div className="form-control">
        <label className="form-control-label">
          <span className="form-control-text">Logo URL</span>
          <input
            type="text"
            value={logo}
            placeholder="https://example.com/logo.png"
            onInput={(e) =>
              onLogoChange((e.target as HTMLInputElement).value)
            }
            className="text-input"
          />
        </label>
        {logo && (
          <button
            type="button"
            className="delete-button"
            onClick={() => onLogoChange("")}
            title="Clear logo"
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
      <div>
        <div className="form-control">
          <label className="form-control-label">
            <span className="form-control-text">Icon URL Template</span>
            <input
              type="text"
              value={iconUrlTemplate}
              placeholder="https://example.com/icons/{id}.png"
              onInput={(e) =>
                onIconUrlTemplateChange((e.target as HTMLInputElement).value)
              }
              className="text-input"
            />
          </label>
          {iconUrlTemplate !== DEFAULT_OPTIONS.iconUrlTemplate && (
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                onIconUrlTemplateChange(DEFAULT_OPTIONS.iconUrlTemplate)
              }
              title="Reset to default"
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
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
            </button>
          )}
        </div>
        <p className="print-options-hint">
          Use <code>{"{id}"}</code> as a placeholder for the character ID, e.g.{" "}
          <code>https://example.com/icons/{"{id}"}.png</code>
        </p>
      </div>
      <Toggle
        label="Include Night Sheet"
        checked={showNightSheet}
        onChange={onShowNightSheetChange}
      />
      <Toggle
        label="Teensy Mode"
        checked={teensyMode}
        onChange={onTeensyModeChange}
      />
    </>
  );
}
