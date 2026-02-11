import { ComponentChildren } from "preact";
import {
  normalizeColors,
  createGradient,
  createOverlayBackground,
} from "../utils/colours";
import "./BottomTrimSheet.css";
import { PrintablePage } from "./PrintablePage";
import { ScriptOptions } from "../types";

export type BottomTrimSheetProps = {
  options: ScriptOptions;
  children: ComponentChildren;
};

export const BottomTrimSheet = ({ options, children }: BottomTrimSheetProps) => {
  const { color, includeMargins, dimensions } = options;
  const colors = normalizeColors(color);
  const gradient = createGradient(colors, 20);
  const overlayBackground = createOverlayBackground(color, 180);

  return (
    <PrintablePage dimensions={dimensions}>
      <div
        className="bottom-trim-sheet"
        style={{
          transform: includeMargins ? "scale(0.952)" : undefined,
          "--header-gradient": gradient,
          "--title-font": options.titleStyle.font,
          "--title-letter-spacing": `${options.titleStyle.letterSpacing}mm`,
          "--title-word-spacing": `${options.titleStyle.wordSpacing}mm`,
          "--title-line-height": `${options.titleStyle.lineHeight}mm`,
          "--title-margin-top": `${options.titleStyle.marginTop}mm`,
          "--title-margin-bottom": `${options.titleStyle.marginBottom}mm`,
          "--icon-scale": (options.iconScale / 1.7).toString(),
        }}
      >
        <img
          className="character-sheet-background"
          src="/images/parchment_texture_a4_lightened.jpg"
        ></img>
        <div className="sheet-content">{children}</div>
        <div className="spacer"></div>
        <div className="info-footer-container">
          <div className="info-author-credit">
            <p>© Steven Medway bloodontheclocktower.com</p>
            <p>Script template by John Forster ravenswoodstudio.xyz</p>
          </div>
          <div className="info-footer-background"></div>
          <div
            className="info-footer-overlay"
            style={{ background: overlayBackground }}
          ></div>
        </div>
      </div>
    </PrintablePage>
  );
};
