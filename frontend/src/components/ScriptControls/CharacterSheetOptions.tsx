import { Toggle, Select, Slider } from "../ui";
import { AppearanceLevel, OverleafType } from "../../types/options";

interface CharacterSheetOptionsProps {
  overleaf: OverleafType;
  appearance: AppearanceLevel;
  showAuthor: boolean;
  showJinxes: boolean;
  inlineJinxIcons: boolean;
  useOldJinxes: boolean;
  showSwirls: boolean;
  solidTitle: boolean;
  iconScale: number;
  onOverleafChange: (value: OverleafType) => void;
  onAppearanceChange: (value: AppearanceLevel) => void;
  onShowAuthorChange: (value: boolean) => void;
  onShowJinxesChange: (value: boolean) => void;
  onInlineJinxIconsChange: (value: boolean) => void;
  onUseOldJinxesChange: (value: boolean) => void;
  onShowSwirlsChange: (value: boolean) => void;
  onSolidTitleChange: (value: boolean) => void;
  onIconScaleChange: (value: number) => void;
}

export function CharacterSheetOptions({
  overleaf,
  appearance,
  showAuthor,
  showJinxes,
  inlineJinxIcons,
  useOldJinxes,
  showSwirls,
  solidTitle,
  iconScale,
  onOverleafChange,
  onAppearanceChange,
  onShowAuthorChange,
  onShowJinxesChange,
  onInlineJinxIconsChange,
  onUseOldJinxesChange,
  onShowSwirlsChange,
  onSolidTitleChange,
  onIconScaleChange,
}: CharacterSheetOptionsProps) {
  return (
    <>
      <Select
        label="Overleaf:"
        value={overleaf}
        options={[
          { value: "backingSheet", label: "Backing Sheet" },
          { value: "infoSheet", label: "Info Sheet" },
          { value: "none", label: "None" },
        ]}
        onChange={(value) => onOverleafChange(value as OverleafType)}
      />

      <Select
        label="Sizing:"
        value={appearance}
        options={[
          { value: "normal", label: "Normal" },
          { value: "compact", label: "Small" },
          { value: "super-compact", label: "Smaller" },
          { value: "mega-compact", label: "Smallest" },
        ]}
        onChange={(value) => onAppearanceChange(value as AppearanceLevel)}
      />

      <Toggle
        label="Show Author"
        checked={showAuthor}
        onChange={onShowAuthorChange}
      />

      <Toggle
        label="Show Swirls"
        checked={showSwirls}
        onChange={onShowSwirlsChange}
      />

      <Toggle
        label="Show Jinxes"
        checked={showJinxes}
        onChange={onShowJinxesChange}
      />

      <Toggle
        label="Inline Jinx Icons"
        checked={inlineJinxIcons}
        onChange={onInlineJinxIconsChange}
      />

      <Toggle
        label="Use Old Jinxes"
        checked={useOldJinxes}
        onChange={onUseOldJinxesChange}
      />

      <Toggle
        label="Solid Title"
        checked={solidTitle}
        onChange={onSolidTitleChange}
      />

      <Slider
        label="Icon Scale"
        value={iconScale}
        min={0.5}
        max={3}
        step={0.1}
        displayValue={iconScale.toFixed(1)}
        onChange={onIconScaleChange}
      />
    </>
  );
}
