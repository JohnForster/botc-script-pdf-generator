// Translation types for language support

export type EditionTranslation = {
  name: string;
  description?: string;
};

export type RoleTranslation = {
  name: string;
  ability?: string;
  flavor?: string;
  first?: string;
  other?: string;
};

export type JinxTranslation = string;

export type ReminderTranslation = string;

export type TranslationFile = {
  editions: Record<string, EditionTranslation>;
  jinxes: Record<string, JinxTranslation>;
  reminders: Record<string, ReminderTranslation>;
  roles: Record<string, RoleTranslation>;
  ui: Record<string, string>;
};

export type LanguageCode = 'en' | 'de' | 'fr' | 'es' | 'pt' | 'it' | 'pl' | 'ru' | 'zh' | 'ja';

export interface TranslationContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (type: 'roles' | 'jinxes' | 'reminders' | 'editions' | 'ui', key: string, field?: string, fallbackLanguage?: LanguageCode) => string | undefined;
  getJinxKey: (char1: string, char2: string) => string;
}

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const SUPPORTED_LANGUAGES: LanguageCode[] = ['en', 'de'];

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
  it: 'Italiano',
  pl: 'Polski',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
};