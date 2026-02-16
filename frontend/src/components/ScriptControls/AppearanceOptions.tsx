import { ScriptOptions } from "botc-character-sheet";
import { Toggle } from "../ui";
import { ColorPicker } from "./ColorPicker";
import { DEFAULT_OPTIONS } from "../../types/options";

interface AppearanceOptionsProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
  onColorChange: (color: string | string[]) => void;
  onColorArrayChange: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onLogoChange: (logo: string) => void;
}

export function AppearanceOptions({
  options,
  onOptionChange,
  onColorChange,
  onColorArrayChange,
  onAddColor,
  onRemoveColor,
  onLogoChange,
}: AppearanceOptionsProps) {
  return (
    <>
      <ColorPicker
        color={options.color}
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
            value={options.logo}
            placeholder="https://example.com/logo.png"
            onInput={(e) => onLogoChange((e.target as HTMLInputElement).value)}
            className="text-input"
          />
        </label>
        {options.logo && (
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
              value={options.iconUrlTemplate}
              placeholder="https://example.com/icons/{id}.png"
              onInput={(e) =>
                onOptionChange(
                  "iconUrlTemplate",
                  (e.target as HTMLInputElement).value,
                )
              }
              className="text-input"
            />
          </label>
          {options.iconUrlTemplate !== DEFAULT_OPTIONS.iconUrlTemplate && (
            <button
              type="button"
              className="delete-button"
              onClick={() =>
                onOptionChange(
                  "iconUrlTemplate",
                  DEFAULT_OPTIONS.iconUrlTemplate,
                )
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
        {options.iconUrlTemplate === DEFAULT_OPTIONS.iconUrlTemplate && (
          <p className="print-options-hint">
            Default icons from{" "}
            <a href="https://github.com/tomozbot/botc-icons">tomozbot</a> &{" "}
            <a href="https://klutzbanana.com">klutzbanana.com</a>
          </p>
        )}
        <p className="print-options-hint">
          For custom icons, use <code>{"{id}"}</code> as a placeholder for the
          character ID, e.g. <code>https://example.com/icons/{"{id}"}.png</code>
        </p>
      </div>
      <Toggle
        label="Include Night Sheet"
        checked={options.showNightSheet}
        onChange={(value) => onOptionChange("showNightSheet", value)}
      />
      <Toggle
        label="Teensy Mode"
        checked={options.teensy}
        onChange={(value) => onOptionChange("teensy", value)}
      />
    </>
  );
}
