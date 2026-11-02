// Main exports for the character-sheet package
export { CharacterSheet } from "./pages/CharacterSheet";
export { SheetBack } from "./pages/SheetBack";
export { NightSheet } from "./pages/NightSheet";
export { FancyDoc } from "./FancyDoc";
export { TeensyDoc } from "./TeensyDoc";
export type {
  CharacterTeam,
  ResolvedCharacter,
  GroupedCharacters,
  Jinx,
  NightMarker,
  NightOrderEntry,
  NightOrders,
  TitleStyle,
  ScriptOptions,
  ParsedScript,
  NetworkPayload,
  PageDimensions,
} from "./types";
export { darken, parseRgb, rgbString } from "./utils/colours";
export { ROLES_BY_ID } from "./data/roles";
export { JINXES } from "./data/jinxes";
export { FIRST_NIGHT_ORDER, OTHER_NIGHT_ORDER } from "./data/nightsheet";
export {
  groupCharactersByTeam,
  findJinxes,
  resolveJinxCharacters,
  resolveJinxCharactersWithTranslation,
  resolveIconUrl,
  getGenericIconUrl,
  getImageUrl,
  getJinxedCharacters,
} from "./utils/scriptUtils";

// Translation exports
export {
  TranslationProvider,
  useTranslation,
  useTranslatedText,
  useLanguage,
  useTranslatedJinxes,
  useTranslatedRole,
  useTranslatedEdition,
  useTranslatedReminder,
} from "./translations/context";

export type {
  TranslationContextType,
  LanguageCode,
  EditionTranslation,
  RoleTranslation,
  JinxTranslation,
  ReminderTranslation,
  TranslationFile,
} from "./translations/types";

export {
  loadTranslations,
  getAvailableLanguages,
  validateTranslations,
  getEnglishFallback,
} from "./translations/loader";

export { getJinxKey, getTranslation, getRoleName, getRoleAbility, getJinxReason, getReminderText, getEditionName, getEditionDescription, getTranslatedJinxes, getTranslatedJinxReason, isLanguageSupported, getSupportedLanguages, getCharacterNameWithEnglish, } from "./translations/utils";
export { getFabledOrLoric } from "./utils/fabledOrLoric";
export { getTranslatedTravellers } from "./utils/travellers";


