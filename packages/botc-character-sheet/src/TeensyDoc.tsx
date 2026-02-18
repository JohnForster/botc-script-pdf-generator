import { ScriptCharacter } from "botc-script-checker";
import { CharacterSheet } from "./pages/CharacterSheet";
import { ParsedScript, ScriptOptions, NightOrders } from "./types";
import { getFabledOrLoric } from "./utils/fabledOrLoric";
import { groupCharactersByTeam, findJinxes } from "./utils/scriptUtils";
import { InfoSheet } from "./pages/InfoSheet";
import { SheetBack } from "./pages/SheetBack";

import "./TeensyDoc.css";
import { NightSheet } from "./pages/NightSheet";

type TeensyDocProps = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
};

export const TeensyDoc = ({
  script,
  options: rawOptions,
  nightOrders,
}: TeensyDocProps) => {
  // If a custom font URL is provided, inject a @font-face and override titleStyle.font
  const hasCustomFont = !!rawOptions.titleStyle.customFontUrl;
  const options = hasCustomFont
    ? {
        ...rawOptions,
        titleStyle: { ...rawOptions.titleStyle, font: "CustomTitleFont" },
      }
    : rawOptions;

  const numberOfSheets =
    options.numberOfCharacterSheets + (options.numberOfCharacterSheets % 2); // Round up to even number

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

  const fabledAndLoric = getFabledOrLoric(
    script.characters,
    options.iconUrlTemplate,
  );
  return (
    <div className="sheet-wrapper teensy">
      {hasCustomFont && (
        <style>{`@font-face { font-family: "CustomTitleFont"; src: url("${rawOptions.titleStyle.customFontUrl}"); }`}</style>
      )}
      {Array.from({ length: numberOfSheets }).map(
        (_, i) =>
          !(i % 2) && (
            <div
              key={i}
              className={i + 2 >= numberOfSheets ? "" : "print-only"}
            >
              <div className="teensy-sheet-pair">
                <CharacterSheet
                  title={script.metadata?.name || "Custom Script"}
                  author={
                    options.showAuthor ? script.metadata?.author : undefined
                  }
                  characters={groupedCharacters}
                  jinxes={jinxes}
                  fabledOrLoric={fabledAndLoric}
                  bootleggerRules={script.metadata?.bootlegger}
                  options={options}
                />
                {i + 1 !== options.numberOfCharacterSheets && (
                  <CharacterSheet
                    title={script.metadata?.name || "Custom Script"}
                    author={
                      options.showAuthor ? script.metadata?.author : undefined
                    }
                    characters={groupedCharacters}
                    jinxes={jinxes}
                    fabledOrLoric={fabledAndLoric}
                    bootleggerRules={script.metadata?.bootlegger}
                    options={options}
                  />
                )}
                {/* If there is only one more back sheet to display, and
                    the user wants to show a night sheet, include the second 
                    side of the night sheet in this pair */}
                {options.overleaf !== "none" &&
                  i + 1 === options.numberOfCharacterSheets &&
                  options.showNightSheet && (
                    <NightSheet
                      title={script.metadata?.name || "Custom Script"}
                      firstNightOrder={nightOrders.first}
                      otherNightOrder={undefined}
                      options={options}
                    />
                  )}
              </div>
              <div style={{ breakAfter: "page" }}></div>
              <div className="teensy-sheet-pair">
                {options.overleaf === "backingSheet" && (
                  <>
                    {/* If there is only one more back sheet to display, and
                        the user wants to show a night sheet, include the 
                        second side of the night sheet in this pair */}
                    {i + 1 === options.numberOfCharacterSheets &&
                      options.showNightSheet && (
                        <NightSheet
                          title={script.metadata?.name || "Custom Script"}
                          firstNightOrder={undefined}
                          otherNightOrder={nightOrders.other}
                          options={options}
                        />
                      )}
                    <SheetBack
                      title={script.metadata?.name || "Custom Script"}
                      nightOrders={nightOrders}
                      options={options}
                    />
                    {i + 1 !== options.numberOfCharacterSheets && (
                      <SheetBack
                        title={script.metadata?.name || "Custom Script"}
                        nightOrders={nightOrders}
                        options={options}
                      />
                    )}
                  </>
                )}

                {options.overleaf === "infoSheet" && (
                  <>
                    {/* If there is only one more info sheet to display, and
                    the user wants to show a night sheet, include the second 
                    side of the night sheet in this pair */}
                    {i + 1 === options.numberOfCharacterSheets &&
                      options.showNightSheet && (
                        <NightSheet
                          title={script.metadata?.name || "Custom Script"}
                          firstNightOrder={undefined}
                          otherNightOrder={nightOrders.other}
                          options={options}
                        />
                      )}
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
                    {i + 1 !== options.numberOfCharacterSheets && (
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
                    )}
                  </>
                )}
              </div>
              {i + 2 < numberOfSheets && <div style="break-after:page;"></div>}
            </div>
          ),
      )}
      {options.showNightSheet &&
        (!(options.numberOfCharacterSheets % 2) ||
          options.overleaf === "none") && (
          <div
            className={`teensy-night-sheet ${options.overleaf === "none" ? "teensy-sheet-pair" : ""}`}
          >
            <NightSheet
              title={script.metadata?.name || "Custom Script"}
              firstNightOrder={nightOrders.first}
              otherNightOrder={nightOrders.other}
              options={options}
            />
          </div>
        )}
    </div>
  );
};
