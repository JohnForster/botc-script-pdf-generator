import { type CSSProperties } from "preact";
import {
  teamColours,
  normalizeColors,
  createGradient,
  createOverlayBackground,
} from "../utils/colours";
import "./CharacterSheet.css";
import { GroupedCharacters, Jinx, ScriptOptions } from "../types";
import { FabledOrLoric } from "../utils/fabledOrLoric";
import { JinxesAndSpecial } from "../components/JinxesAndSpecial";
import { CharacterSection } from "./CharacterSection";
import { PrintablePage } from "../components/PrintablePage";

interface CharacterSheetProps {
  title: string;
  author?: string;
  characters: GroupedCharacters;
  jinxes: Jinx[];
  fabledOrLoric?: FabledOrLoric[];
  bootleggerRules?: string[];
  options: ScriptOptions;
}

export function CharacterSheet({
  title,
  author,
  characters,
  jinxes = [],
  fabledOrLoric = [],
  bootleggerRules = [],
  options,
}: CharacterSheetProps) {
  const {
    color,
    logo,
    showLogo,
    showTitle,
    showSwirls,
    includeMargins,
    solidTitle,
    iconScale,
    appearance,
    inlineJinxIcons,
    iconUrlTemplate,
    dimensions,
  } = options;
  const sections = [
    {
      key: "townsfolk",
      title: "Townsfolk",
      chars: characters.townsfolk,
      color: teamColours["townsfolk"],
    },
    {
      key: "outsider",
      title: "Outsiders",
      chars: characters.outsider,
      color: teamColours["outsider"],
    },
    {
      key: "minion",
      title: "Minions",
      chars: characters.minion,
      color: teamColours["minion"],
    },
    {
      key: "demon",
      title: "Demons",
      chars: characters.demon,
      color: teamColours["demon"],
    },
  ].filter((section) => section.chars.length > 0);

  const colors = normalizeColors(color);
  const gradient = createGradient(colors, 20);

  const appearanceClass =
    appearance !== "normal" ? `appearance-${appearance}` : "";
  const sheetClassName = ["character-sheet", appearanceClass]
    .filter(Boolean)
    .join(" ");

  return (
    <PrintablePage dimensions={dimensions}>
      <div
        className={sheetClassName}
        id="character-sheet"
        style={
          {
            "--header-gradient": gradient,
            "--sidebar-width": options.teensy ? "10mm" : "15mm",
            "--title-font": options.titleStyle.font,
            "--title-letter-spacing": `${options.titleStyle.letterSpacing}mm`,
            "--title-word-spacing": `${options.titleStyle.wordSpacing}mm`,
            "--title-line-height": `${options.titleStyle.lineHeight}mm`,
            "--title-margin-top": `${options.titleStyle.marginTop}mm`,
            "--title-margin-bottom": `${options.titleStyle.marginBottom}mm`,
            "--icon-scale": (iconScale / 1.7).toString(),
            transform: includeMargins ? "scale(0.952)" : undefined,
          } as CSSProperties
        }
      >
        <img
          className="character-sheet-background"
          src="/images/parchment_texture_a4_lightened.jpg"
        ></img>
        <Sidebar color={color} />
        <div className="sheet-content">
          <Header
            showSwirls={showSwirls}
            showTitle={showTitle}
            title={title}
            author={author}
            logo={showLogo ? logo : undefined}
            solidHeader={solidTitle}
          />

          <div className="characters-grid">
            {sections.map((section, i) => (
              <>
                <CharacterSection
                  key={section.key}
                  title={section.title.toUpperCase()}
                  characters={section.chars}
                  charNameColor={section.color}
                  jinxes={jinxes}
                  allCharacters={[
                    ...characters.townsfolk,
                    ...characters.outsider,
                    ...characters.minion,
                    ...characters.demon,
                  ]}
                  inlineJinxIcons={inlineJinxIcons}
                  iconUrlTemplate={iconUrlTemplate}
                />
                {i < sections.length - 1 && (
                  <img src="/images/divider.png" className="section-divider" />
                )}
              </>
            ))}
            {(jinxes.length > 0 || fabledOrLoric.length > 0) && (
              <>
                <img src="/images/divider.png" className="section-divider" />
                <JinxesAndSpecial
                  fabledAndLoric={fabledOrLoric}
                  jinxes={jinxes}
                  allCharacters={[
                    ...characters.townsfolk,
                    ...characters.outsider,
                    ...characters.minion,
                    ...characters.demon,
                  ]}
                  bootleggerRules={bootleggerRules}
                  iconUrlTemplate={iconUrlTemplate}
                />
              </>
            )}
          </div>

          <div className="sheet-footer">
            <span className="asterisk">*</span>Not the first night
          </div>
          <div className="author-credit">
            <p>© Steven Medway bloodontheclocktower.com</p>
            <p>Script template by John Forster ravenswoodstudio.xyz</p>
          </div>
        </div>
      </div>{" "}
    </PrintablePage>
  );
}

function Header({
  showSwirls,
  showTitle,
  title,
  author,
  logo,
  solidHeader = false,
}: {
  showSwirls: boolean;
  showTitle: boolean;
  title: string;
  author?: string;
  logo?: string;
  solidHeader?: boolean;
}) {
  // If showTitle is false and there's no logo and no swirls, hide header entirely
  if (!showTitle && !logo && !showSwirls) {
    return null;
  }

  return (
    <>
      <h1 className="sheet-header">
        {showSwirls && (
          <img
            src="/images/black-swirl-divider.png"
            className="swirl-divider"
          ></img>
        )}

        {logo && <img className="script-logo" src={logo}></img>}
        {showTitle && (
          <span
            style={{
              mixBlendMode: solidHeader ? "normal" : "multiply",
            }}
          >
            {title}
          </span>
        )}
        {showSwirls && (
          <img
            src="/images/black-swirl-divider.png"
            className="swirl-divider flip"
          ></img>
        )}
      </h1>
      {author && <h2 className="sheet-author">by {author}</h2>}
    </>
  );
}

function Sidebar({ color }: { color: string | string[] }) {
  const overlayBackground = createOverlayBackground(color, 180);
  return (
    <div className="sidebar-container">
      <div className="sidebar-background"></div>
      <div
        className="sidebar-overlay"
        style={{ background: overlayBackground }}
      ></div>
    </div>
  );
}
