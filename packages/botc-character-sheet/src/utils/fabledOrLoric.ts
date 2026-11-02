import { ResolvedCharacter } from "../types";
import { resolveIconUrl } from "./scriptUtils";
import { getTranslation } from "../translations/utils";

export type FabledOrLoric = {
  name: string;
  englishName: string;
  note: string;
  team: "fabled" | "loric";
  image?: string;
};

export function getFabledOrLoric(
  characters: ResolvedCharacter[],
  iconUrlTemplate?: string,
  language: string = "en",
): FabledOrLoric[] {
  const fabled = characters.filter((char) => char.team === "fabled");
  const loric = characters.filter((char) => char.team === "loric");

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

  const getTranslatedNote = (char: ResolvedCharacter): string => {
    if (language !== "en") {
      const translatedAbility = getTranslation("roles", char.id, "ability", language as any);
      if (translatedAbility) {
        return translatedAbility;
      }
    }
    return char.ability || "";
  };

  const getEnglishName = (char: ResolvedCharacter): string => char.name || "";

  const output = [
    ...loric.map((lo) => ({
      name: getTranslatedName(lo),
      englishName: getEnglishName(lo),
      note: getTranslatedNote(lo),
      team: "loric" as const,
      image: getImage(lo),
    })),
    ...fabled.map((fb) => ({
      name: getTranslatedName(fb),
      englishName: getEnglishName(fb),
      note: getTranslatedNote(fb),
      team: "fabled" as const,
      image: getImage(fb),
    })),
  ];

  return output;
}

