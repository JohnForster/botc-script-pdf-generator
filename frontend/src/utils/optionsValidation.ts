import type { ScriptOptions } from "botc-character-sheet";
import type { ValidationIssue } from "../types/validation";
import { DEFAULT_OPTIONS } from "../types/options";
import { validateColorField } from "./colorValidation";

type NumericKey<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

function validateNumericFields<T extends object>(
  values: T,
  defaults: T,
  keys: NumericKey<T>[],
  fieldLabel: string,
  issues: ValidationIssue[],
): T {
  const result = { ...values } as unknown as Record<string, unknown>;
  const defaultsRecord = defaults as unknown as Record<string, unknown>;
  for (const key of keys) {
    const k = String(key);
    const value = result[k];
    if (typeof value !== "number" || !Number.isFinite(value)) {
      issues.push({
        severity: "substituted",
        message: `${fieldLabel} '${k}' was invalid — reset to default.`,
      });
      result[k] = defaultsRecord[k];
    }
  }
  return result as unknown as T;
}

export function mergeAndValidateOptions(saved: unknown): {
  options: ScriptOptions;
  issues: ValidationIssue[];
} {
  const issues: ValidationIssue[] = [];
  const savedOptions = (
    saved && typeof saved === "object" ? saved : {}
  ) as Partial<Record<keyof ScriptOptions, unknown>>;

  const options: ScriptOptions = {
    ...DEFAULT_OPTIONS,
    ...(savedOptions as Partial<ScriptOptions>),
    dimensions: {
      ...DEFAULT_OPTIONS.dimensions,
      ...(savedOptions.dimensions as
        | Partial<ScriptOptions["dimensions"]>
        | undefined),
    },
    titleStyle: {
      ...DEFAULT_OPTIONS.titleStyle,
      ...(savedOptions.titleStyle as
        | Partial<ScriptOptions["titleStyle"]>
        | undefined),
    },
  };

  options.color = validateColorField(
    options.color,
    "Saved color option",
    issues,
  );

  options.dimensions = validateNumericFields(
    options.dimensions,
    DEFAULT_OPTIONS.dimensions,
    ["width", "height", "margin", "bleed"],
    "Saved dimension",
    issues,
  );

  options.titleStyle = validateNumericFields(
    options.titleStyle,
    DEFAULT_OPTIONS.titleStyle,
    [
      "letterSpacing",
      "wordSpacing",
      "lineHeight",
      "backLineHeight",
      "marginTop",
      "marginBottom",
    ],
    "Saved title style",
    issues,
  );

  const sheets = options.numberOfCharacterSheets;
  const validSheets = typeof sheets === "number" && Number.isFinite(sheets);
  const sanitizedSheets = validSheets
    ? Math.max(1, Math.round(sheets))
    : DEFAULT_OPTIONS.numberOfCharacterSheets;
  if (sanitizedSheets !== sheets) {
    issues.push({
      severity: "substituted",
      message: `'Number of character sheets' was invalid — reset to ${sanitizedSheets}.`,
    });
    options.numberOfCharacterSheets = sanitizedSheets;
  }

  return { options, issues };
}
