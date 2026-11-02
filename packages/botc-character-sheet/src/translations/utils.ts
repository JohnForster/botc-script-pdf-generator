import type { LanguageCode } from './types';
import { loadTranslations } from './loader';

/**
 * Generate a key for jinx lookup (alphabetically sorted to ensure consistency)
 * @param char1 - First character ID
 * @param char2 - Second character ID
 * @returns The jinx key (e.g., 'alchemist-boffin')
 */
export function getJinxKey(char1: string, char2: string): string {
  return [char1, char2].sort().join('-');
}

/**
 * Get a translated value with fallback chain
 * @param type - The translation type ('roles', 'jinxes', 'reminders', 'editions')
 * @param key - The key to look up (e.g., character ID)
 * @param field - The field to get (e.g., 'name', 'ability') - optional for simple types
 * @param language - The target language
 * @param fallbackLanguage - The fallback language (defaults to 'en')
 * @returns The translated string or undefined
 */
export function getTranslation(
  type: 'roles' | 'jinxes' | 'reminders' | 'editions' | 'ui',
  key: string,
  field?: string,
  language: LanguageCode = 'en',
  fallbackLanguage: LanguageCode = 'en',
): string | undefined {
  // If language is English, return undefined (no translation needed)
  if (language === 'en') {
    return undefined;
  }

  const translations = loadTranslations(language);
  
  if (!translations) {
    return undefined;
  }

  let value: unknown;

  switch (type) {
    case 'roles':
      value = translations.roles[key];
      if (value && field) {
        value = (value as any)[field];
      }
      break;
    case 'jinxes':
      value = translations.jinxes[key];
      break;
    case 'reminders':
      value = translations.reminders[key];
      break;
    case 'editions':
      value = translations.editions[key];
      if (value && field) {
        value = (value as any)[field];
      }
      break;
    case 'ui':
      value = translations.ui[key];
      break;
  }

  // If we found a value, return it
  if (value !== undefined && value !== null) {
    return String(value);
  }

  // Try fallback language if available and different from target
  if (fallbackLanguage && fallbackLanguage !== language && fallbackLanguage !== 'en') {
    const fallbackTranslations = loadTranslations(fallbackLanguage);
    if (fallbackTranslations) {
      let fallbackValue: unknown;
      switch (type) {
        case 'roles':
          fallbackValue = fallbackTranslations.roles[key];
          if (fallbackValue && field) {
            fallbackValue = (fallbackValue as any)[field];
          }
          break;
        case 'jinxes':
          fallbackValue = fallbackTranslations.jinxes[key];
          break;
        case 'reminders':
          fallbackValue = fallbackTranslations.reminders[key];
          break;
        case 'editions':
          fallbackValue = fallbackTranslations.editions[key];
          if (fallbackValue && field) {
            fallbackValue = (fallbackValue as any)[field];
          }
          break;
        case 'ui':
          fallbackValue = fallbackTranslations.ui[key];
          break;
      }
      if (fallbackValue !== undefined && fallbackValue !== null) {
        return String(fallbackValue);
      }
    }
  }

  // If fallback to English, return undefined (no translation)
  return undefined;
}

/**
 * Get a translated role name with fallback
 * @param roleId - The role ID
 * @param language - The target language
 * @returns The translated name or undefined
 */
export function getRoleName(roleId: string, language: LanguageCode): string | undefined {
  return getTranslation('roles', roleId, 'name', language);
}

/**
 * Get a translated role ability with fallback
 * @param roleId - The role ID
 * @param language - The target language
 * @returns The translated ability or undefined
 */
export function getRoleAbility(roleId: string, language: LanguageCode): string | undefined {
  return getTranslation('roles', roleId, 'ability', language);
}

/**
 * Get a translated jinx reason with fallback
 * @param char1 - First character ID
 * @param char2 - Second character ID
 * @param language - The target language
 * @returns The translated reason or undefined
 */
export function getJinxReason(
  char1: string,
  char2: string,
  language: LanguageCode,
): string | undefined {
  const key = getJinxKey(char1, char2);
  return getTranslation('jinxes', key, undefined, language);
}

/**
 * Get a translated reminder text with fallback
 * @param reminderId - The reminder ID
 * @param language - The target language
 * @returns The translated text or undefined
 */
export function getReminderText(reminderId: string, language: LanguageCode): string | undefined {
  return getTranslation('reminders', reminderId, undefined, language);
}

/**
 * Get a translated edition name with fallback
 * @param editionId - The edition ID
 * @param language - The target language
 * @returns The translated name or undefined
 */
export function getEditionName(editionId: string, language: LanguageCode): string | undefined {
  return getTranslation('editions', editionId, 'name', language);
}

/**
 * Get a translated edition description with fallback
 * @param editionId - The edition ID
 * @param language - The target language
 * @returns The translated description or undefined
 */
export function getEditionDescription(
  editionId: string,
  language: LanguageCode,
): string | undefined {
  return getTranslation('editions', editionId, 'description', language);
}

/**
 * Get translated jinxes for a character with fallback
 * @param characterId - The character ID
 * @param jinxes - The jinxes array from the script
 * @param language - The target language
 * @returns Array of jinxes with translated reasons
 */
export function getTranslatedJinxes(
  characterId: string,
  jinxes: Array<{ characters: [string, string]; jinx: string }>,
  language: LanguageCode,
): { characters: [string, string]; jinx: string }[] {
  return jinxes
    .filter((jinx) => jinx.characters.includes(characterId))
    .map((jinx) => {
      const translatedReason = getJinxReason(
        jinx.characters[0],
        jinx.characters[1],
        language,
      );
      return {
        characters: jinx.characters,
        jinx: translatedReason || jinx.jinx,
      };
    });
}

/**
 * Get translated jinxes for a character pair with fallback
 * @param char1 - First character ID
 * @param char2 - Second character ID
 * @param originalReason - The original English jinx reason
 * @param language - The target language
 * @returns The translated reason or original
 */
export function getTranslatedJinxReason(
  char1: string,
  char2: string,
  originalReason: string,
  language: LanguageCode,
): string {
  const translated = getJinxReason(char1, char2, language);
  return translated ?? originalReason;
}

/**
 * Check if a language is supported
 * @param language - The language code to check
 * @returns True if supported, false otherwise
 */
export function isLanguageSupported(language: LanguageCode): boolean {
  return ['en', 'de'].includes(language);
}

/**
 * Get all supported language codes
 * @returns Array of supported language codes
 */
export function getSupportedLanguages(): LanguageCode[] {
  return ['en', 'de'];
}

/**
 * Get a character name with optional English name for multi-lingual playgroups
 * @param translatedName - The translated character name
 * @param englishName - The original English character name
 * @param showEnglishNames - Whether to show English names alongside translations
 * @returns The formatted name string
 */
export function getCharacterNameWithEnglish(
  translatedName: string,
  englishName: string,
  showEnglishNames: boolean,
): string {
  // If English names should be shown and the names are different
  if (showEnglishNames && translatedName !== englishName) {
    return `${translatedName} (${englishName})`;
  }
  
  // Otherwise, just return the translated name
  return translatedName;
}
