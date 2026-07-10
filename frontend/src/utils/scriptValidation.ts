import type { ParsedScript, ResolvedCharacter } from "botc-character-sheet";
import type {
  CharacterTeam,
  ScriptCharacter,
  ScriptMetadata,
} from "botc-script-checker";
import type { ValidationIssue } from "../types/validation";
import { validateColorField } from "./colorValidation";

const VALID_TEAMS: readonly CharacterTeam[] = [
  "townsfolk",
  "outsider",
  "minion",
  "demon",
  "traveller",
  "fabled",
  "loric",
];

const METADATA_STRING_ARRAY_FIELDS = [
  "bootlegger",
  "firstNight",
  "otherNight",
] as const;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function sanitizeMetadata(
  metadata: ScriptMetadata,
  issues: ValidationIssue[],
): ScriptMetadata {
  const sanitized: Record<string, unknown> = { ...metadata };

  if (sanitized.colour !== undefined) {
    sanitized.colour = validateColorField(
      sanitized.colour,
      "Script metadata 'colour'",
      issues,
    );
  }

  for (const field of METADATA_STRING_ARRAY_FIELDS) {
    const value = sanitized[field];
    if (value !== undefined && !isStringArray(value)) {
      issues.push({
        severity: "substituted",
        message: `Script metadata '${field}' was malformed — ignored.`,
      });
      sanitized[field] = [];
    }
  }

  return sanitized as ScriptMetadata;
}

function excludeChar(
  issues: ValidationIssue[],
  message: string,
): ScriptCharacter[] {
  issues.push({ severity: "excluded", message });
  return [];
}

function sanitizeCharacter(
  char: ScriptCharacter,
  issues: ValidationIssue[],
): ScriptCharacter[] {
  const raw = char as unknown as Record<string, unknown>;
  const isCustom = Boolean((char as ResolvedCharacter).isCustom);

  // Official characters come from the trusted ROLES_BY_ID data — only
  // normalize id casing defensively, no content validation needed.
  if (!isCustom) {
    return [{ ...char, id: char.id.toLowerCase() as ScriptCharacter["id"] }];
  }

  const id = raw.id;
  if (typeof id !== "string" || id.trim() === "") {
    return excludeChar(
      issues,
      "Removed a custom character — missing or invalid id.",
    );
  }

  const name = raw.name;
  if (typeof name !== "string" || name.trim() === "") {
    return excludeChar(
      issues,
      `Removed a custom character (id '${id}') — missing or invalid name.`,
    );
  }

  const ability = raw.ability;
  if (typeof ability !== "string" || ability.trim() === "") {
    return excludeChar(
      issues,
      `Removed custom character '${name}' — missing ability text.`,
    );
  }

  // Case-insensitive so hand-edited scripts using e.g. "Townsfolk" aren't excluded.
  const team = typeof raw.team === "string" ? raw.team.toLowerCase() : raw.team;
  if (
    typeof team !== "string" ||
    !VALID_TEAMS.includes(team as CharacterTeam)
  ) {
    return excludeChar(
      issues,
      `Removed custom character '${name}' — unknown team '${String(raw.team)}'.`,
    );
  }

  const sanitized: ScriptCharacter = {
    ...char,
    id: id.toLowerCase() as ScriptCharacter["id"],
    team: team as CharacterTeam,
  };

  const jinxes = raw.jinxes;
  if (jinxes !== undefined) {
    if (!Array.isArray(jinxes)) {
      issues.push({
        severity: "substituted",
        message: `Ignored invalid jinxes on '${name}'.`,
      });
      sanitized.jinxes = [];
    } else {
      sanitized.jinxes = jinxes.filter((jinx) => {
        const j = jinx as Record<string, unknown>;
        const valid =
          typeof j?.id === "string" &&
          j.id.trim() !== "" &&
          typeof j?.reason === "string" &&
          j.reason.trim() !== "";
        if (!valid) {
          issues.push({
            severity: "excluded",
            message: `Ignored an invalid jinx entry on '${name}'.`,
          });
        }
        return valid;
      }) as ScriptCharacter["jinxes"];
    }
  }

  return [sanitized];
}

// Drops jinxes referencing a character id no longer on the script, reporting each as a ValidationIssue.
function removeDanglingJinxes(
  characters: ScriptCharacter[],
  issues: ValidationIssue[],
): ScriptCharacter[] {
  const characterIds = new Set(characters.map((c) => c.id.toLowerCase()));

  return characters.map((char) => {
    if (!char.jinxes?.length) return char;

    const validJinxes = char.jinxes.filter((jinx) => {
      const valid = characterIds.has(jinx.id.toLowerCase());
      if (!valid) {
        issues.push({
          severity: "excluded",
          message: `Removed a jinx on '${char.name}' referencing '${jinx.id}', which isn't on the script.`,
        });
      }
      return valid;
    });

    return validJinxes.length === char.jinxes.length
      ? char
      : { ...char, jinxes: validJinxes };
  });
}

export function sanitizeScript(parsed: ParsedScript): {
  script: ParsedScript;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];

  const metadata = parsed.metadata
    ? sanitizeMetadata(parsed.metadata, issues)
    : null;
  const sanitizedCharacters = parsed.characters.flatMap((char) =>
    sanitizeCharacter(char, issues),
  );
  const characters = removeDanglingJinxes(sanitizedCharacters, issues);

  return { script: { metadata, characters }, issues };
}
