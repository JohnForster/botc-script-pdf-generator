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

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

// HSL → hex, since colour inputs and parseRgb expect hex strings.
const hslToHex = (h: number, s: number, l: number) => {
  const sat = s / 100;
  const light = l / 100;
  const a = sat * Math.min(light, 1 - light);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const value = light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(value * 255)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
};

// Saturation and lightness are kept within 20–70% to avoid washed-out,
// near-black, or garish colours.
export const randomColor = () => {
  const h = randomBetween(0, 360);
  const s = randomBetween(20, 70);
  const l = randomBetween(20, 70);
  return hslToHex(h, s, l);
};

export const TITLE_FONT_DEFAULTS: Record<
  string,
  Omit<TitleStyle, "font" | "customFontUrl">
> = {
  "Alice in Wonderland": {
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
  },
  Anglican: {
    letterSpacing: -0.2,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 26,
    marginTop: -2,
    marginBottom: 0,
  },
  "Canterbury Regular": {
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 22,
    marginTop: -1,
    marginBottom: 0,
  },
  "Utm Agin": {
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
  },
  "Waters Gothic": {
    letterSpacing: 0,
    wordSpacing: 0,
    lineHeight: 12.5,
    backLineHeight: 28,
    marginTop: 0,
    marginBottom: -3,
  },
};

export const DEFAULT_OPTIONS: ScriptOptions = {
  color: randomColor(),
  logo: "",
  showLogo: true,
  showTitle: true,
  showAuthor: true,
  showJinxes: true,
  showFabledAndLoric: true,
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
  iconUrlTemplate: "/images/icons/{id}.webp",
  titleStyle: {
    font: "Utm Agin",
    letterSpacing: -0.6,
    wordSpacing: 0,
    lineHeight: 11,
    backLineHeight: 23,
    marginTop: -2,
    marginBottom: 0,
    customFontUrl: "",
  },
  dimensions: { width: 210, height: 297, margin: 0, bleed: 0 },
  teensy: false,
};
