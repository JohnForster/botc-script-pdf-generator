import { Toggle } from "../ui";

interface CharacterSheetBackOptionsProps {
  overleaf: "none" | "backingSheet" | "infoSheet";
  displayNightOrder: boolean;
  displayPlayerCounts: boolean;
  formatMinorWords: boolean;
  onDisplayNightOrderChange: (value: boolean) => void;
  onDisplayPlayerCountsChange: (value: boolean) => void;
  onFormatMinorWordsChange: (value: boolean) => void;
}

export function CharacterSheetBackOptions({
  overleaf,
  displayNightOrder,
  displayPlayerCounts,
  formatMinorWords,
  onDisplayNightOrderChange,
  onDisplayPlayerCountsChange,
  onFormatMinorWordsChange,
}: CharacterSheetBackOptionsProps) {
  return (
    <>
      <Toggle
        label="Include Night Order"
        checked={displayNightOrder}
        onChange={onDisplayNightOrderChange}
      />
      <Toggle
        label="Include Player Counts"
        checked={displayPlayerCounts}
        onChange={onDisplayPlayerCountsChange}
      />

      {overleaf === "backingSheet" && (
        <Toggle
          label="Shrink Minor Words"
          checked={formatMinorWords}
          onChange={onFormatMinorWordsChange}
        />
      )}
    </>
  );
}
