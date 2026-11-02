import { ResolvedCharacter } from "../types";
import { resolveIconUrl } from "./scriptUtils";
import { getTranslation } from "../translations/utils";

export type TranslatedTraveller = {
  id: string;
  name: string;
  ability: string;
  image?: string;
};

export function getTranslatedTravellers(
  travellers: ResolvedCharacter[],
  iconUrlTemplate?: string,
  language: string = "en",
): TranslatedTraveller[] {
  const getImage = (char: ResolvedCharacter) =>
    (Array.isArray(char.image) ? char.image[0] : char.image) ??
    (iconUrlTemplate ? resolveIconUrl(iconUrlTemplate, char.id) : undefined) ??
    undefined;

  const getTranslatedName = (char: ResolvedCharacter): string => {
    if (language !== "en") {
      const translatedName = getTranslation("roles", char.id, "name", language as any);
      if (translatedName) {
        return translatedName;
      }
    }
    return char.name || "";
  };

  const getTranslatedAbility = (char: ResolvedCharacter): string => {
    if (language !== "en") {
      const translatedAbility = getTranslation("roles", char.id, "ability", language as any);
      if (translatedAbility) {
        return translatedAbility;
      }
    }
    return char.ability || "";
  };

  return travellers.map((traveller) => ({
    id: traveller.id,
    name: getTranslatedName(traveller),
    ability: getTranslatedAbility(traveller),
    image: getImage(traveller),
  }));
}