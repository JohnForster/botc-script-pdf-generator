import type { TranslationFile, LanguageCode } from './types';

// Import English data as source of truth
import { ROLES_BY_ID } from '../data/roles';
import { JINXES } from '../data/jinxes';

// German translations - will be generated from JSON
import { germanTranslations } from './german';

// Cache for loaded translations
const translationCache = new Map<LanguageCode, TranslationFile | null>();

/**
 * Load translations for a specific language
 * @param language - The language code to load
 * @returns The translation file or null if not available
 */
export function loadTranslations(language: LanguageCode): TranslationFile | null {
  if (translationCache.has(language)) {
    return translationCache.get(language) ?? null;
  }

  let translations: TranslationFile | null = null;

  switch (language) {
    case 'de':
      translations = germanTranslations;
      break;
    case 'en':
      // English is the default, no translations needed
      translations = null;
      break;
    default:
      // Other languages not yet implemented
      translations = null;
      break;
  }

  translationCache.set(language, translations);
  return translations;
}

/**
 * Get all available languages
 * @returns Array of supported language codes
 */
export function getAvailableLanguages(): LanguageCode[] {
  return ['en', 'de']; // Add more as translations become available
}

/**
 * Validate translation structure
 * @param translations - The translations to validate
 * @returns True if valid, false otherwise
 */
export function validateTranslations(translations: TranslationFile): boolean {
  // Basic validation - could be enhanced
  return (
    translations &&
    typeof translations.editions === 'object' &&
    typeof translations.jinxes === 'object' &&
    typeof translations.reminders === 'object' &&
    typeof translations.roles === 'object'
  );
}

/**
 * Get English data as fallback
 * @returns Object containing English roles and jinxes
 */
export function getEnglishFallback() {
  return {
    roles: ROLES_BY_ID,
    jinxes: JINXES,
  };
}