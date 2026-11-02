import { BottomTrimSheet } from "../components/BottomTrimSheet";
import { PlayerCount } from "../components/PlayerCount";
import { NightOrderEntry, ResolvedCharacter, ScriptOptions } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";
import { getImageSrc } from "../utils/nightOrder";
import { useTranslation } from "../translations/context";
import { getTranslatedTravellers } from "../utils/travellers";
import "./InfoSheet.css";

type InfoSheetProps = {
  title: string;
  firstNightOrder: NightOrderEntry[];
  otherNightOrder: NightOrderEntry[];
  jinxes: {
    characters: [ResolvedCharacter, ResolvedCharacter];
    text: string;
  }[];
  fabledOrLoric?: FabledOrLoric[];
  bootleggerRules?: string[];
  travellers?: ResolvedCharacter[];
  options: ScriptOptions;
};

export const InfoSheet = ({
  title,
  firstNightOrder,
  otherNightOrder,
  jinxes,
  fabledOrLoric,
  bootleggerRules,
  travellers,
  options,
}: InfoSheetProps) => {
  const { t } = useTranslation();
  const { displayNightOrder, displayPlayerCounts, iconUrlTemplate } = options;
  const language = options.language || "en";
  
  // Helper function to get translated character name
  const getTranslatedCharName = (char: ResolvedCharacter): string => {
    if (language !== "en") {
      const translatedName = t("roles", char.id, "name");
      if (translatedName) {
        return translatedName;
      }
    }
    return char.name || "";
  };
  
  // Translate travellers based on current language
  const translatedTravellers = travellers
    ? getTranslatedTravellers(travellers, iconUrlTemplate, language)
    : [];
  
  // Get translated text
  const firstNightText = t('ui', 'first_night') || 'First Night';
  const otherNightsText = t('ui', 'other_nights') || 'Other Nights';
  const fabledLoricText = t('ui', 'fabled_and_loric') || 'Fabled & Loric';
  const jinxesText = t('ui', 'jinxes') || 'Jinxes';
  const travellersText = t('ui', 'recommendedTravellers') || 'Recommended Travellers';
  const baseCountsText = t('ui', 'baseCounts') || 'Base Character Counts';
  
  return (
    <>
      <BottomTrimSheet options={options}>
        <div className="info-sheet-heading">
          <h3 className="script-title">{title}</h3>
        </div>
        <div className="info-sheet-content">
          {displayNightOrder && !!firstNightOrder?.length && (
            <>
              <h4 className="info-sheet-section-title">{firstNightText}</h4>
              <div class="info-sheet-section">
                <div className="icon-row">
                  {firstNightOrder.map((item) => (
                    <img
                      src={getImageSrc(item, iconUrlTemplate)}
                      class="icon"
                    ></img>
                  ))}
                </div>
              </div>
            </>
          )}
          {displayNightOrder && !!otherNightOrder?.length && (
            <>
              <h4 className="info-sheet-section-title">{otherNightsText}</h4>
              <div class="info-sheet-section">
                <div className="icon-row">
                  {otherNightOrder.map((item) => (
                    <img
                      src={getImageSrc(item, iconUrlTemplate)}
                      class="icon"
                    ></img>
                  ))}
                </div>
              </div>
            </>
          )}

          {!!fabledOrLoric?.length && (
            <>
              <h4 className="info-sheet-section-title">{fabledLoricText}</h4>
              <div class="info-sheet-section">
                {fabledOrLoric?.map((entry) => (
                  <div className="info-fabled-loric-entry">
                    <img src={entry.image} alt={entry.name} class="icon"></img>
                    <div className="info-fabled-loric-text">
                      <p className="info-fabled-loric-name">{entry.name}</p>
                      <p className="info-fabled-loric-note">{entry.note}</p>
                      {entry.name.toLowerCase() === "bootlegger" &&
                        bootleggerRules?.map((rule, i) => (
                          <p
                            key={`bootlegger-rule-${i}`}
                            className="info-fabled-loric-note"
                          >
                            {rule}
                          </p>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!!jinxes?.length && (
            <>
              <h4 className="info-sheet-section-title">{jinxesText}</h4>
              <div class="info-sheet-section">
                {jinxes?.map((jinx) => (
                  <div className="info-jinx-entry">
                    <img
                      src={getImageSrc(jinx.characters[0], iconUrlTemplate)}
                      alt={jinx.text}
                      class="icon"
                    ></img>
                    <img
                      src={getImageSrc(jinx.characters[1], iconUrlTemplate)}
                      alt={jinx.text}
                      class="icon"
                    ></img>
                    <div className="info-jinx-text">
                      <p className="info-jinx-name">
                        {getTranslatedCharName(jinx.characters[0])} & {getTranslatedCharName(jinx.characters[1])}
                      </p>
                      <p className="info-jinx-note">{jinx.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!!travellers?.length && (
            <>
              <h4 className="info-sheet-section-title">{travellersText}</h4>
              <div class="info-sheet-section">                
                {translatedTravellers?.map((entry) => (
                  <div className="info-fabled-loric-entry">
                    <img
                      src={entry.image}
                      alt={entry.name}
                      class="icon"
                    ></img>
                    <div className="info-fabled-loric-text">
                      <p className="info-fabled-loric-name">{entry.name}</p>
                      <p className="info-fabled-loric-note">{entry.ability}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {displayPlayerCounts && (
            <>
              <h4 className="info-sheet-section-title">{baseCountsText}</h4>
              <div className="info-sheet-section">
                <PlayerCount background={false} />
              </div>
            </>
          )}
        </div>
      </BottomTrimSheet>
    </>
  );
};
