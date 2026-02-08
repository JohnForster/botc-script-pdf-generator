import { CharacterSheet } from "./pages/CharacterSheet";
import { NightSheet } from "./pages/NightSheet";
import { SheetBack } from "./pages/SheetBack";
import { NightOrders, ParsedScript, ScriptOptions } from "./types";
import { getFabledOrLoric } from "./utils/fabledOrLoric";
import { groupCharactersByTeam, findJinxes } from "./utils/scriptUtils";
import "./FancyDoc.css";
import { InfoSheet } from "./pages/InfoSheet";
import { ScriptCharacter } from "botc-script-checker";

export type FancyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export function FancyDoc({ script, options: rawOptions, nightOrders }: FancyDocProps) {
  // If a custom font URL is provided, inject a @font-face and override titleFont
  const hasCustomFont = !!rawOptions.customFontUrl;
  const options = hasCustomFont
    ? { ...rawOptions, titleFont: "CustomTitleFont" }
    : rawOptions;

  const groupedCharacters = groupCharactersByTeam(script.characters);
  const jinxes = options.showJinxes
    ? findJinxes(script.characters, options.useOldJinxes)
    : [];
  const resolvedJinxes = jinxes.map(
    ({ characters: [char1id, char2id], jinx }) => {
      const char1 = script.characters.find((c) => c.id === char1id);
      const char2 = script.characters.find((c) => c.id === char2id);
      return {
        characters: [char1!, char2!] as [ScriptCharacter, ScriptCharacter],
        text: jinx,
      };
    },
  );
  const fabledAndLoric = getFabledOrLoric(script.characters, options.iconUrlTemplate);

  return (
    <div className="sheet-wrapper">
      {hasCustomFont && (
        <style>{`@font-face { font-family: "CustomTitleFont"; src: url("${rawOptions.customFontUrl}"); }`}</style>
      )}
      {Array(options.numberOfCharacterSheets)
        .fill(true)
        .map((_, i) => (
          <div className={i === 0 ? "" : "print-only"}>
            <CharacterSheet
              title={script.metadata?.name || "Custom Script"}
              author={options.showAuthor ? script.metadata?.author : undefined}
              characters={groupedCharacters}
              jinxes={jinxes}
              fabledOrLoric={fabledAndLoric}
              bootleggerRules={script.metadata?.bootlegger}
              options={options}
            />
            <div style="break-after:page;"></div>

            {options.overleaf === "backingSheet" && (
              <>
                <SheetBack
                  title={script.metadata?.name || "Custom Script"}
                  nightOrders={nightOrders}
                  options={options}
                />
                <div style="break-after:page;"></div>
              </>
            )}

            {options.overleaf === "infoSheet" && (
              <>
                <InfoSheet
                  title={script.metadata?.name || "Custom Script"}
                  firstNightOrder={nightOrders.first}
                  otherNightOrder={nightOrders.other}
                  bootleggerRules={script.metadata?.bootlegger}
                  jinxes={resolvedJinxes}
                  fabledOrLoric={fabledAndLoric}
                  travellers={groupedCharacters.traveller}
                  options={options}
                />
                <div style="break-after:page;"></div>
              </>
            )}
          </div>
        ))}

      {options.showNightSheet && (
        <>
          <NightSheet
            title={script.metadata?.name || "Custom Script"}
            firstNightOrder={nightOrders.first}
            otherNightOrder={nightOrders.other}
            options={options}
          />
        </>
      )}
    </div>
  );
}
