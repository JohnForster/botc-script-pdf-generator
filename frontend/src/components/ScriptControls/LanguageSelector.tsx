import { ScriptOptions } from "botc-character-sheet";
import { LanguageCode } from "../../types/options";

interface LanguageSelectorProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
}

const languageOptions: { value: LanguageCode; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch (German)" },
];

export function LanguageSelector({
  options,
  onOptionChange,
}: LanguageSelectorProps) {
  return (
    <div className="form-control">
      <label className="form-control-label">
        <span className="form-control-text">Language</span>
        <select
          value={options.language || "en"}
          onChange={(e) =>
            onOptionChange(
              "language",
              (e.target as HTMLSelectElement).value as LanguageCode
            )
          }
          className="text-input"
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </label>
      <p className="print-options-hint">
        For character names, abilities, and night reminders.
      </p>
    </div>
  );
}