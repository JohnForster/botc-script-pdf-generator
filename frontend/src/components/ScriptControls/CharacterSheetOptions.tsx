import { ScriptOptions } from "botc-character-sheet";
import { Toggle, Select, Slider } from "../ui";
import { AppearanceLevel, OverleafType } from "../../types/options";

export type InlineJinxIconsMode = "none" | "primary" | "both";

interface CharacterSheetOptionsProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
}

export function CharacterSheetOptions({
  options,
  onOptionChange,
}: CharacterSheetOptionsProps) {
  return (
    <>
      <Select
        label="Overleaf:"
        value={options.overleaf}
        options={[
          { value: "backingSheet", label: "Backing Sheet" },
          { value: "infoSheet", label: "Info Sheet" },
          { value: "none", label: "None" },
        ]}
        onChange={(value) => onOptionChange("overleaf", value as OverleafType)}
      />

      <Select
        label="Sizing:"
        value={options.appearance}
        options={[
          { value: "normal", label: "Normal" },
          { value: "compact", label: "Small" },
          { value: "super-compact", label: "Smaller" },
          { value: "mega-compact", label: "Smallest" },
        ]}
        onChange={(value) =>
          onOptionChange("appearance", value as AppearanceLevel)
        }
      />

      <Toggle
        label="Show Author"
        checked={options.showAuthor}
        onChange={(value) => onOptionChange("showAuthor", value)}
      />

      <Toggle
        label="Show Logo"
        checked={options.showLogo}
        onChange={(value) => onOptionChange("showLogo", value)}
      />

      <Toggle
        label="Show Title"
        checked={options.showTitle}
        onChange={(value) => onOptionChange("showTitle", value)}
      />

      <Toggle
        label="Show Swirls"
        checked={options.showSwirls}
        onChange={(value) => onOptionChange("showSwirls", value)}
      />

      <Toggle
        label="Show Jinxes"
        checked={options.showJinxes}
        onChange={(value) => onOptionChange("showJinxes", value)}
      />

      <Select
        label="Inline Jinx Icons:"
        value={options.inlineJinxIcons}
        options={[
          { value: "none", label: "None" },
          { value: "primary", label: "Primary Character Only" },
          { value: "both", label: "Both Characters" },
        ]}
        onChange={(value) =>
          onOptionChange("inlineJinxIcons", value as InlineJinxIconsMode)
        }
      />

      <Toggle
        label="Use Old Jinxes"
        checked={options.useOldJinxes}
        onChange={(value) => onOptionChange("useOldJinxes", value)}
      />

      <Toggle
        label="Solid Title"
        checked={options.solidTitle}
        onChange={(value) => onOptionChange("solidTitle", value)}
      />

      <Slider
        label="Icon Scale"
        value={options.iconScale}
        min={0.5}
        max={3}
        step={0.1}
        displayValue={options.iconScale.toFixed(1)}
        onChange={(value) => onOptionChange("iconScale", value)}
      />
    </>
  );
}
