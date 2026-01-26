import { Toggle } from "../ui";

interface AppearanceOptionsProps {
  showNightSheet: boolean;
  teensyMode: boolean;
  onShowNightSheetChange: (value: boolean) => void;
  onTeensyModeChange: (value: boolean) => void;
}

export function AppearanceOptions({
  showNightSheet,
  teensyMode,
  onTeensyModeChange,
  onShowNightSheetChange,
}: AppearanceOptionsProps) {
  return (
    <>
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
