import "./SheetBack.css";
import { NightOrders, ScriptOptions } from "../types";
import { formatWithMinorWords } from "../utils/minorWordFormatter";
import { NightOrderPanel } from "../components/NightOrderPanel";
import { PlayerCount } from "../components/PlayerCount";
import { createOverlayBackground } from "../utils/colours";
import { PrintablePage } from "../components/PrintablePage";

type SheetBackProps = {
  title: string;
  nightOrders?: NightOrders;
  options: ScriptOptions;
};

export const SheetBack = ({
  title,
  nightOrders = { first: [], other: [] },
  options,
}: SheetBackProps) => {
  const {
    color,
    includeMargins,
    formatMinorWords,
    displayNightOrder,
    displayPlayerCounts,
    dimensions,
  } = options;
  const renderTitle = () => {
    const parts = title.split("&");
    return parts.map((part, partIndex) => (
      <>
        {formatMinorWords ? formatWithMinorWords(part) : part}
        {partIndex < parts.length - 1 && <span className="ampersand">&</span>}
      </>
    ));
  };

  const overlayBackground = createOverlayBackground(color, 180);

  return (
    <PrintablePage dimensions={dimensions}>
      <div
        className="sheet-backing"
        style={{
          transform: includeMargins ? "scale(0.952)" : undefined,
          "--title-font": options.titleStyle.font,
          "--title-letter-spacing": `${options.titleStyle.letterSpacing}mm`,
          "--title-word-spacing": `${options.titleStyle.wordSpacing}mm`,
          "--title-line-height": `${options.titleStyle.lineHeight}mm`,
          "--title-margin-top": `${options.titleStyle.marginTop}mm`,
          "--title-margin-bottom": `${options.titleStyle.marginBottom}mm`,
          "--icon-scale": (options.iconScale / 1.7).toString(),
        }}
      >
        <div className="sheet-background">
          <div className="title-container">
            <h1>{renderTitle()}</h1>
          </div>
        </div>

        <div
          className="sheet-back-overlay"
          style={{ background: overlayBackground }}
        ></div>

        <div className="back-info-container">
          {displayPlayerCounts && <PlayerCount />}

          {displayNightOrder && <NightOrderPanel nightOrders={nightOrders} iconUrlTemplate={options.iconUrlTemplate} />}
        </div>
      </div>
    </PrintablePage>
  );
};
