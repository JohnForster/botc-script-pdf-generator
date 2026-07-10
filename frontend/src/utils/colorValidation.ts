import { parseRgb } from "botc-character-sheet";
import type { ValidationIssue } from "../types/validation";
import { randomColor } from "../types/options";

export function isValidHexColor(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    parseRgb(value);
    return true;
  } catch {
    return false;
  }
}

export function isValidColorValue(value: unknown): value is string | string[] {
  if (isValidHexColor(value)) return true;
  if (Array.isArray(value) && value.length > 0) {
    return value.every((v) => isValidHexColor(v));
  }
  return false;
}

// Shared by option- and script-level validation so the substitution policy stays in one place.
export function validateColorField(
  value: unknown,
  fieldLabel: string,
  issues: ValidationIssue[],
): string | string[] {
  if (isValidColorValue(value)) return value;
  issues.push({
    severity: "substituted",
    message: `${fieldLabel} was invalid — replaced with a random colour.`,
  });
  return randomColor();
}
