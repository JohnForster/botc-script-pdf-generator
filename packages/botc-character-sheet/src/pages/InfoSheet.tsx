import { BottomTrimSheet } from "../components/BottomTrimSheet";
import { PlayerCount } from "../components/PlayerCount";
import { NightOrderEntry, ResolvedCharacter, ScriptOptions } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";
import { getImageSrc } from "../utils/nightOrder";
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
  const { displayNightOrder, displayPlayerCounts } = options;
  return (
    <>
      <BottomTrimSheet options={options}>
        <div className="info-sheet-heading">
          <h3 className="script-title">{title}</h3>
        </div>
        <div className="info-sheet-content">
          {displayNightOrder && !!firstNightOrder?.length && (
            <>
              <h4 className="info-sheet-section-title">First Night</h4>
              <div class="info-sheet-section">
                <div className="icon-row">
                  {firstNightOrder.map((item) => (
                    <img src={getImageSrc(item)} class="icon"></img>
                  ))}
                </div>
              </div>
            </>
          )}
          {displayNightOrder && !!otherNightOrder?.length && (
            <>
              <h4 className="info-sheet-section-title">Other Nights</h4>
              <div class="info-sheet-section">
                <div className="icon-row">
                  {otherNightOrder.map((item) => (
                    <img src={getImageSrc(item)} class="icon"></img>
                  ))}
                </div>
              </div>
            </>
          )}

          {!!fabledOrLoric?.length && (
            <>
              <h4 className="info-sheet-section-title">Fabled & Loric</h4>
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
              <h4 className="info-sheet-section-title">Jinxes</h4>
              <div class="info-sheet-section">
                {jinxes?.map((jinx) => (
                  <div className="info-jinx-entry">
                    <img
                      src={getImageSrc(jinx.characters[0])}
                      alt={jinx.text}
                      class="icon"
                    ></img>
                    <img
                      src={getImageSrc(jinx.characters[1])}
                      alt={jinx.text}
                      class="icon"
                    ></img>
                    <div className="info-jinx-text">
                      <p className="info-jinx-name">
                        {jinx.characters[0].name} & {jinx.characters[1].name}
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
              <h4 className="info-sheet-section-title">
                Recommended Travellers
              </h4>
              <div class="info-sheet-section">
                {travellers?.map((entry) => (
                  <div className="info-fabled-loric-entry">
                    <img
                      src={getImageSrc(entry)}
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
              <h4 className="info-sheet-section-title">
                Base Character Counts
              </h4>
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
