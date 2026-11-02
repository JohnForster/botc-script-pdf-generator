import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { useState, useEffect } from 'preact/hooks';
import type { TranslationContextType, LanguageCode } from './types';
import { getJinxKey, getTranslation } from './utils';

// Create the translation context
const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Provider component
export function TranslationProvider({
  children,
  language = 'en',
}: {
  children: any;
  language?: LanguageCode;
}) {
  const [currentLanguage, setLanguageState] = useState<LanguageCode>(language);

  // Update language when prop changes
  useEffect(() => {
    if (language !== currentLanguage) {
      setLanguageState(language);
    }
  }, [language]);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
  };

  const t: TranslationContextType['t'] = (type, key, field, fallbackLanguage) => {
    return getTranslation(type, key, field, currentLanguage, fallbackLanguage);
  };

  const getJinxKeyMemoized = (char1: string, char2: string) => {
    return getJinxKey(char1, char2);
  };

  return (
    <TranslationContext.Provider
      value={{
        language: currentLanguage,
        setLanguage,
        t,
        getJinxKey: getJinxKeyMemoized,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
}

// Custom hook to use translation context
export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (!context) {
    // Fallback for when context is not available (e.g., in tests or outside provider)
    // This should only happen in tests or if the component is not wrapped in a provider
    return {
      language: 'en' as LanguageCode,
      setLanguage: () => {},
      t: (_type: any, _key: any, _field?: any) => undefined,
      getJinxKey: (char1: string, char2: string) => {
        return [char1, char2].sort().join('-');
      },
    };
  }
  return context;
}

// Hook to get translated text directly
export function useTranslatedText() {
  const { t } = useTranslation();
  return t;
}

// Hook to get current language
export function useLanguage() {
  const { language, setLanguage } = useTranslation();
  return { language, setLanguage };
}

// Hook to get translated jinxes
export function useTranslatedJinxes(
  characterId: string,
  jinxes: Array<{ characters: [string, string]; jinx: string }>,
) {
  const { t } = useTranslation();

  return jinxes
    .filter((jinx) => jinx.characters.includes(characterId))
    .map((jinx) => {
      const translatedReason = t('jinxes', jinx.characters.sort().join('-'));
      return {
        characters: jinx.characters,
        jinx: translatedReason || jinx.jinx,
      };
    });
}

// Hook to get translated role
export function useTranslatedRole(
  roleId: string,
  originalRole?: { name: string; ability: string },
) {
  const { t, language } = useTranslation();

  if (!originalRole) {
    return undefined;
  }

  const translatedName = t('roles', roleId, 'name');
  const translatedAbility = t('roles', roleId, 'ability');

  return {
    ...originalRole,
    name: translatedName || originalRole.name,
    ability: translatedAbility || originalRole.ability,
    _translated: !!translatedName || !!translatedAbility,
    _language: language,
  };
}

// Hook to get translated edition
export function useTranslatedEdition(
  editionId: string,
  originalName?: string,
) {
  const { t } = useTranslation();
  const translatedName = t('editions', editionId, 'name');
  return translatedName || originalName || editionId;
}

// Hook to get translated reminder
export function useTranslatedReminder(
  reminderId: string,
  originalText?: string,
) {
  const { t } = useTranslation();
  const translatedText = t('reminders', reminderId);
  return translatedText || originalText || reminderId;
}

