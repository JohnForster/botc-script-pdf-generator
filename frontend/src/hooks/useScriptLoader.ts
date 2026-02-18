import type { Script } from "botc-script-checker";
import type { ParsedScript, ScriptOptions } from "botc-character-sheet";
import { DEFAULT_OPTIONS } from "../types/options";
import { useScriptParsing } from "./useScriptParsing";
import { useScriptPersistence } from "./useScriptPersistence";
import { useScriptLoading } from "./useScriptLoading";

// Check if a specific option was provided in URL params
export function hasUrlParam(key: string): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has(key);
}

export function getInitialOptionsFromUrl(): ScriptOptions {
  const params = new URLSearchParams(window.location.search);
  const saved = localStorage.getItem("options");
  const savedOptions = saved ? JSON.parse(saved) : null;
  const options: ScriptOptions = {
    ...DEFAULT_OPTIONS,
    ...savedOptions,
    dimensions: {
      ...DEFAULT_OPTIONS.dimensions,
      ...savedOptions?.dimensions,
    },
    titleStyle: {
      ...DEFAULT_OPTIONS.titleStyle,
      ...savedOptions?.titleStyle,
    },
  };

  type OptionsKey = keyof ScriptOptions;

  for (const key of Object.keys(DEFAULT_OPTIONS) as OptionsKey[]) {
    const param = params.get(key);
    if (param === null) continue;

    const defaultValue = DEFAULT_OPTIONS[key];

    if (typeof defaultValue === "boolean") {
      (options[key] as boolean) = param === "true" || param === "1";
    } else if (typeof defaultValue === "number") {
      const num = parseFloat(param);
      if (!isNaN(num)) (options[key] as number) = num;
    } else if (key === "color") {
      // Color can be string or string[]
      options.color = param.includes(",")
        ? param.split(",").map((c) => c.trim())
        : param;
    } else if (typeof defaultValue === "string") {
      (options[key] as string) = param;
    }
  }

  // Handle dimensions as flat params (width, height, margin, bleed)
  type DimensionsKey = keyof typeof DEFAULT_OPTIONS.dimensions;
  for (const key of Object.keys(
    DEFAULT_OPTIONS.dimensions,
  ) as DimensionsKey[]) {
    const param = params.get(key);
    if (param !== null) {
      const num = parseFloat(param);
      if (!isNaN(num)) {
        options.dimensions[key] = num;
      }
    }
  }

  return options;
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
    scriptText: parsing.scriptText,
    isScriptSorted: parsing.isScriptSorted,
    nightOrders: parsing.nightOrders,
    sharedOptions: loading.sharedOptions,
    loadScript: parsing.loadScript,
    handleScriptTextChange: parsing.handleScriptTextChange,
    handleFileUpload: loading.handleFileUpload,
    handleSort: parsing.handleSort,
    handleSaveScript: parsing.handleSaveScript,
    updateScriptMetadata: parsing.updateScriptMetadata,
  };
}
