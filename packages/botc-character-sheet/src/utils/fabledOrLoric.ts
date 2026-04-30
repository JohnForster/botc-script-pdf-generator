import { ResolvedCharacter } from "../types";
import { resolveIconUrl } from "./scriptUtils";

export type FabledOrLoric = {
  name: string;
  note: string;
  team: "fabled" | "loric";
  image?: string;
};

export function getFabledOrLoric(
  characters: ResolvedCharacter[],
  iconUrlTemplate?: string,
): FabledOrLoric[] {
  const fabled = characters.filter((char) => char.team === "fabled");
  const loric = characters.filter((char) => char.team === "loric");

  const getImage = (char: ResolvedCharacter) =>
    (Array.isArray(char.image) ? char.image[0] : char.image) ??
    (iconUrlTemplate ? resolveIconUrl(iconUrlTemplate, char.id) : undefined) ??
    undefined;

  const output = [
    ...loric.map((lo) => ({
      name: lo.name,
      note: lo.ability,
      team: "loric" as const,
      image: getImage(lo),
    })),
    ...fabled.map((fb) => ({
      name: fb.name,
      note: fb.ability,
      team: "fabled" as const,
      image: getImage(fb),
    })),
  ];

  return output;
}
