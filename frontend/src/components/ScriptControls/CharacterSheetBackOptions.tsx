import { ScriptOptions } from "botc-character-sheet";
import { Toggle } from "../ui";

interface CharacterSheetBackOptionsProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
}

export function CharacterSheetBackOptions({
  options,
  onOptionChange,
}: CharacterSheetBackOptionsProps) {
  return (
    <>
      <Toggle
        label="Include Night Order"
        checked={options.displayNightOrder}
        onChange={(value) => onOptionChange("displayNightOrder", value)}
      />
      <Toggle
        label="Include Player Counts"
        checked={options.displayPlayerCounts}
        onChange={(value) => onOptionChange("displayPlayerCounts", value)}
      />

      {options.overleaf === "backingSheet" && (
        <Toggle
          label="Shrink Minor Words"
          checked={options.formatMinorWords}
          onChange={(value) => onOptionChange("formatMinorWords", value)}
        />
      )}
    </>
  );
}
