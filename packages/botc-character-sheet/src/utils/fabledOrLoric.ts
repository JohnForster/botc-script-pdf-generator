import { ResolvedCharacter } from "../types";

export type FabledOrLoric = { name: string; note: string; image?: string };

export function getFabledOrLoric(
  characters: ResolvedCharacter[]
): FabledOrLoric[] {
  const fabled = characters.filter((char) => char.team === "fabled");
  const loric = characters.filter((char) => char.team === "loric");

  const output = [
    ...loric.map((lo) => ({
      name: lo.name,
      note: lo.ability,
      image:
        lo.wiki_image ?? (Array.isArray(lo.image) ? lo.image[0] : lo.image),
    })),
    ...fabled.map((fb) => ({
      name: fb.name,
      note: fb.ability,
      image:
        fb.wiki_image ?? (Array.isArray(fb.image) ? fb.image[0] : fb.image),
    })),
  ];

  return output;
}
