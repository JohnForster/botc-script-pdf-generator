import { ScriptOptions } from "botc-character-sheet";

export type AppearanceLevel =
  | "normal"
  | "compact"
  | "super-compact"
  | "mega-compact";
export type OverleafType = "none" | "backingSheet" | "infoSheet";
export type PaperType = "A4" | "Letter";

// Re-export PageDimensions from botc-character-sheet for convenience
export type { PageDimensions } from "botc-character-sheet";

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

export const TITLE_FONT_DEFAULTS: Record<string, { letterSpacing: number; wordSpacing: number }> = {
  "Alice in Wonderland": { letterSpacing: -0.6, wordSpacing: 0 },
  "Anglican": { letterSpacing: -0.2, wordSpacing: 0 },
  "Canterbury Regular": { letterSpacing: -0.6, wordSpacing: 0 },
  "Utm Agin": { letterSpacing: -0.6, wordSpacing: 0 },
  "Waters Gothic": { letterSpacing: 0, wordSpacing: 0 },
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
  iconUrlTemplate: "https://raw.githubusercontent.com/tomozbot/botc-icons/refs/heads/main/PNG/{id}.png",
  titleFont: "Utm Agin",
  titleLetterSpacing: -0.6,
  titleWordSpacing: 0,
  customFontUrl: "",
  dimensions: { width: 210, height: 297, margin: 0, bleed: 0 },
  teensy: false,
};
