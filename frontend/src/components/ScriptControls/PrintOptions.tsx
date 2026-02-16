import { ScriptOptions } from "botc-character-sheet";
import { Select, NumberInput } from "../ui";
import { PaperType } from "../../types/options";

function getPaperType(width: number): PaperType {
  return width === 216 ? "Letter" : "A4";
}

interface PrintOptionsProps {
  options: ScriptOptions;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
}

export function PrintOptions({
  options,
  onOptionChange,
}: PrintOptionsProps) {
  const paperType = getPaperType(options.dimensions.width);

  const handlePaperChange = (paper: PaperType) => {
    if (paper === "A4") {
      onOptionChange("dimensions", {
        ...options.dimensions,
        width: 210,
        height: 297,
      });
    } else {
      onOptionChange("dimensions", {
        ...options.dimensions,
        width: 216,
        height: 279,
      });
    }
  };

  return (
    <>
      <NumberInput
        label="Number of Character Sheets:"
        value={options.numberOfCharacterSheets}
        min={1}
        onChange={(value) => onOptionChange("numberOfCharacterSheets", value)}
      />

      <Select
        label="Paper Type:"
        value={paperType}
        options={[
          { value: "A4", label: "A4" },
          { value: "Letter", label: "Letter" },
        ]}
        onChange={(value) => handlePaperChange(value as PaperType)}
      />

      <NumberInput
        label="Print Margin (mm):"
        value={options.dimensions.margin}
        min={0}
        onChange={(value) =>
          onOptionChange("dimensions", {
            ...options.dimensions,
            margin: value,
          })
        }
      />

      <NumberInput
        label="Bleed (mm):"
        value={options.dimensions.bleed}
        min={0}
        onChange={(value) =>
          onOptionChange("dimensions", {
            ...options.dimensions,
            bleed: value,
          })
        }
      />

      <p className="print-options-hint">
        For professional printing, try 2mm margin and 3mm bleed.
      </p>
    </>
  );
}
