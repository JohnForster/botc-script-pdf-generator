import { ScriptCharacter } from "botc-script-checker";
import { ResolvedCharacter, GroupedCharacters, Jinx } from "../types";
import jinxesData from "../data/jinxes.json";

export function groupCharactersByTeam(
  characters: ResolvedCharacter[],
): GroupedCharacters {
  const grouped: GroupedCharacters = {
    townsfolk: [],
    outsider: [],
    minion: [],
    demon: [],
    traveller: [],
    fabled: [],
    loric: [],
  };

  for (const char of characters) {
    try {
      grouped[char.team].push(char);
    } catch {
      console.error("Unknown team for:", char);
    }
  }

  return grouped;
}

export function findJinxes(
  characters: ResolvedCharacter[],
  useOldJinxes = false,
): Jinx[] {
  const characterIds = new Set(characters.map((c) => c.id.toLowerCase()));
  const applicableJinxes: Jinx[] = [];

  // Add global jinxes from jinxes.json
  for (const jinx of jinxesData as Jinx[]) {
    const [char1, char2] = jinx.characters;
    if (characterIds.has(char1) && characterIds.has(char2)) {
      // If useOldJinxes is true and oldJinx exists, use it instead
      if (useOldJinxes && jinx.oldJinx) {
        applicableJinxes.push({
          characters: jinx.characters,
          jinx: jinx.oldJinx,
        });
      } else {
        applicableJinxes.push({
          characters: jinx.characters,
          jinx: jinx.jinx,
        });
      }
    }
  }

  // Extract jinxes from custom characters in the script
  for (const char of characters) {
    const isObjectElement = typeof char === "object" && char !== null;
    const hasCustomJinxes = "jinxes" in char;

    if (!isObjectElement || !hasCustomJinxes) continue;
    console.log("char.jinxes:", char.jinxes);

    const customChar = char as ScriptCharacter;
    const char1Id = customChar.id.toLowerCase();

    // Only process if this character is in the script
    if (characterIds.has(char1Id) && customChar.jinxes) {
      for (const jinxPair of customChar.jinxes) {
        const char2Id = jinxPair.id.toLowerCase();
        console.log(`${char.id} is jinxed with ${char2Id}`);

        if (!characterIds.has(char2Id)) {
          console.log("characterIds doesnt contain charId", char2Id);
          console.log("characterIds:", characterIds);
        }

        // Only add if both characters are in the script
        if (characterIds.has(char2Id)) {
          // Check if this jinx already exists (to avoid duplicates)
          const exists = applicableJinxes.some(
            (j) =>
              (j.characters[0] === char1Id && j.characters[1] === char2Id) ||
              (j.characters[0] === char2Id && j.characters[1] === char1Id),
          );
          console.log("Jinx already exists:", exists);

          if (!exists) {
            applicableJinxes.push({
              characters: [char1Id, char2Id],
              jinx: jinxPair.reason,
            });
          }
        }
      }
    }
  }

  return applicableJinxes;
}

export function resolveIconUrl(
  template: string,
  id: string,
): string | null {
  if (!template) return null;
  return template.replace("{id}", id);
}

export const getImageUrl = (
  character: ResolvedCharacter,
  iconUrlTemplate?: string,
) => {
  // Use custom image if provided on the character
  if (character.image) {
    if (typeof character.image === "string") {
      return character.image;
    }
    return character.image[0];
  }
  // Fall back to icon URL template
  if (iconUrlTemplate) {
    return resolveIconUrl(iconUrlTemplate, character.id);
  }
  return null;
};

export function getJinxedCharacters(
  character: ResolvedCharacter,
  jinxes: Jinx[],
  allCharacters: ResolvedCharacter[],
  mode: "none" | "primary" | "both" = "both",
): ResolvedCharacter[] {
  if (mode === "none") {
    return [];
  }

  const jinxedCharacterIds: string[] = [];

  jinxes.forEach((jinx) => {
    if (jinx.characters[0] === character.id) {
      // Current character is the primary (first) in the jinx pair
      jinxedCharacterIds.push(jinx.characters[1]);
    } else if (jinx.characters[1] === character.id && mode === "both") {
      // Current character is secondary - only include in "both" mode
      jinxedCharacterIds.push(jinx.characters[0]);
    }
  });

  return allCharacters.filter((char) => jinxedCharacterIds.includes(char.id));
}
