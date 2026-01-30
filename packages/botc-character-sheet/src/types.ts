import type { ScriptCharacter, ScriptMetadata } from "botc-script-checker";

// Character types needed by the component
export type CharacterTeam =
  | "townsfolk"
  | "outsider"
  | "minion"
  | "demon"
  | "traveller"
  | "fabled";

export type ResolvedCharacter = ScriptCharacter & {
  wiki_image?: string;
  edition?: string;
  isCustom?: boolean;
};

export interface GroupedCharacters {
  townsfolk: ResolvedCharacter[];
  outsider: ResolvedCharacter[];
  minion: ResolvedCharacter[];
  demon: ResolvedCharacter[];
  traveller: ResolvedCharacter[];
  fabled: ResolvedCharacter[];
  loric: ResolvedCharacter[];
}

export interface Jinx {
  characters: [string, string];
  jinx: string;
  oldJinx?: string;
}

export type NightMarker = "dawn" | "dusk" | "minioninfo" | "demoninfo";
export type NightOrderEntry = ResolvedCharacter | NightMarker;

export interface NightOrders {
  first: NightOrderEntry[];
  other: NightOrderEntry[];
}

export interface ScriptOptions {
  color: string | string[];
  logo: string;
  showLogo: boolean;
  showTitle: boolean;
  showAuthor: boolean;
  showJinxes: boolean;
  useOldJinxes: boolean;
  showSwirls: boolean;
  includeMargins: boolean;
  solidTitle: boolean;
  appearance: "normal" | "compact" | "super-compact" | "mega-compact";
  overleaf: "backingSheet" | "infoSheet" | "none";
  showNightSheet: boolean;
  iconScale: number;
  formatMinorWords: boolean;
  displayNightOrder: boolean;
  displayPlayerCounts: boolean;
  numberOfCharacterSheets: number;
  inlineJinxIcons: boolean;
  dimensions: PageDimensions;
  teensy: boolean;
}

export interface ParsedScript {
  metadata: ScriptMetadata | null;
  characters: ScriptCharacter[];
}

export type NetworkPayload = {
  script: ParsedScript;
  options: ScriptOptions;
  nightOrders: NightOrders;
  filename: string;
};

export type PageDimensions = {
  width: number;
  height: number;
  margin: number;
  bleed: number;
};
