import JSON5 from "json5";
import type { Script } from "botc-script-checker";
import type { ParsedScript, ScriptOptions } from "botc-character-sheet";
import { DEFAULT_OPTIONS } from "../types/options";
import { mergeAndValidateOptions } from "../utils/optionsValidation";
import type { ValidationIssue } from "../types/validation";
import { useScriptParsing } from "./useScriptParsing";
import { useScriptPersistence } from "./useScriptPersistence";
import { useScriptLoading } from "./useScriptLoading";

// Check if a specific option was provided in URL params
export function hasUrlParam(key: string): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has(key);
}

export function getInitialOptionsFromUrl(): {
  options: ScriptOptions;
  issues: ValidationIssue[];
} {
  const params = new URLSearchParams(window.location.search);
  const saved = localStorage.getItem("options");
  let savedOptions: unknown = null;
  if (saved) {
    try {
      savedOptions = JSON5.parse(saved);
    } catch {
      savedOptions = null;
    }
  }
  const savedRecord: Record<string, unknown> =
    savedOptions && typeof savedOptions === "object"
      ? (savedOptions as Record<string, unknown>)
      : {};

  const overrides: Record<string, unknown> = {};

  type OptionsKey = keyof ScriptOptions;

  for (const key of Object.keys(DEFAULT_OPTIONS) as OptionsKey[]) {
    const param = params.get(key);
    if (param === null) continue;

    const defaultValue = DEFAULT_OPTIONS[key];

    if (typeof defaultValue === "boolean") {
      overrides[key] = param === "true" || param === "1";
    } else if (typeof defaultValue === "number") {
      const num = parseFloat(param);
      if (!isNaN(num)) overrides[key] = num;
    } else if (key === "color") {
      // Color can be string or string[]
      overrides.color = param.includes(",")
        ? param.split(",").map((c) => c.trim())
        : param;
    } else if (typeof defaultValue === "string") {
      overrides[key] = param;
    }
  }

  // Handle dimensions as flat params (width, height, margin, bleed)
  const dimensionOverrides: Record<string, number> = {};
  type DimensionsKey = keyof typeof DEFAULT_OPTIONS.dimensions;
  for (const key of Object.keys(
    DEFAULT_OPTIONS.dimensions,
  ) as DimensionsKey[]) {
    const param = params.get(key);
    if (param !== null) {
      const num = parseFloat(param);
      if (!isNaN(num)) {
        dimensionOverrides[key] = num;
      }
    }
  }

  const merged = {
    ...savedRecord,
    ...overrides,
    dimensions: {
      ...(savedRecord.dimensions && typeof savedRecord.dimensions === "object"
        ? (savedRecord.dimensions as Record<string, unknown>)
        : {}),
      ...dimensionOverrides,
    },
  };

  return mergeAndValidateOptions(merged);
}

export function useScriptLoader(
  onLoad?: (json: Script, parsed: ParsedScript) => void,
) {
  const parsing = useScriptParsing();
  useScriptPersistence(parsing.rawScript, parsing.script?.metadata?.name);
  const loading = useScriptLoading(
    parsing.loadScript,
    parsing.setError,
    onLoad,
  );

  return {
    script: parsing.script,
    rawScript: parsing.rawScript,
    error: parsing.error,
    scriptIssues: parsing.issues,
    scriptText: parsing.scriptText,
    isScriptSorted: parsing.isScriptSorted,
    nightOrders: parsing.nightOrders,
    sharedOptions: loading.sharedOptions,
    loadScript: parsing.loadScript,
    handleScriptTextChange: parsing.handleScriptTextChange,
    handleFileUpload: loading.handleFileUpload,
    handlePasteButtonClick: loading.handlePasteButtonClick,
    handleSort: parsing.handleSort,
    handleSaveScript: parsing.handleSaveScript,
    updateScriptMetadata: parsing.updateScriptMetadata,
  };
}
