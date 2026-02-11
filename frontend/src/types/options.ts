import { ScriptOptions, TitleStyle } from "botc-character-sheet";

export type AppearanceLevel =
  | "normal"
  | "compact"
  | "super-compact"
  | "mega-compact";
export type OverleafType = "none" | "backingSheet" | "infoSheet";
export type PaperType = "A4" | "Letter";

// Re-export types from botc-character-sheet for convenience
export type { PageDimensions, TitleStyle } from "botc-character-sheet";

export const randomColor = () => {
  const r = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const g = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");
  const b = Math.floor(Math.random() * 256)
    .toString(16)
    .padStart(2, "0");

  const hex = `#${r}${g}${b}`;
  return hex;
};

export const TITLE_FONT_DEFAULTS: Record<
  string,
  Omit<TitleStyle, "font" | "customFontUrl">
> = {
  "Alice in Wonderland": { letterSpacing: -0.6, wordSpacing: 0, lineHeight: 11, marginTop: -2, marginBottom: 0 },
  Anglican:              { letterSpacing: -0.2, wordSpacing: 0, lineHeight: 11, marginTop: -2, marginBottom: 0 },
  "Canterbury Regular":  { letterSpacing: -0.6, wordSpacing: 0, lineHeight: 11, marginTop: -1, marginBottom: 0 },
  "Utm Agin":            { letterSpacing: -0.6, wordSpacing: 0, lineHeight: 11, marginTop: -2, marginBottom: 0 },
  "Waters Gothic":       { letterSpacing: 0,    wordSpacing: 0, lineHeight: 11, marginTop: 0,  marginBottom: -3 },
};

export const DEFAULT_OPTIONS: ScriptOptions = {
  color: randomColor(),
  logo: "",
  showLogo: true,
  showTitle: true,
  showAuthor: true,
  showJinxes: true,
  useOldJinxes: false,
  showSwirls: true,
  includeMargins: false,
  solidTitle: false,
  appearance: "normal",
  overleaf: "backingSheet",
  showNightSheet: true,
  iconScale: 1.7,
  formatMinorWords: false,
  displayNightOrder: true,
  displayPlayerCounts: true,
  numberOfCharacterSheets: 1,
  inlineJinxIcons: "primary",
  iconUrlTemplate:
    "https://images.klutzbanana.com/characters_unofficial/{id}.png",
  titleStyle: {
    font: "Utm Agin",
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    marginTop: -2,
    marginBottom: 0,
    customFontUrl: "",
  },
  dimensions: { width: 210, height: 297, margin: 0, bleed: 0 },
  teensy: false,
};
