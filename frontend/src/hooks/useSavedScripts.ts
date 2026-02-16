import { useState, useEffect, useRef } from "preact/hooks";
import type { Script } from "botc-script-checker";
import type { ScriptOptions } from "botc-character-sheet";

export interface SavedScript {
  id: string;
  name: string;
  savedAt: number;
  script: Script;
  options: ScriptOptions;
}

export type SaveStatus = "idle" | "saved";

const STORAGE_KEY = "savedScripts";

function loadFromStorage(): SavedScript[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useSavedScripts() {
  const [savedScripts, setSavedScripts] =
    useState<SavedScript[]>(loadFromStorage);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Persist to localStorage when savedScripts changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScripts));
  }, [savedScripts]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const saveScript = (
    rawScript: Script,
    options: ScriptOptions,
    name: string,
  ) => {
    const entry: SavedScript = {
      id: crypto.randomUUID(),
      name: name || "Untitled Script",
      savedAt: Date.now(),
      script: rawScript,
      options,
    };

    setSavedScripts((prev) => [entry, ...prev]);
    setSaveStatus("saved");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const deleteScript = (id: string) => {
    setSavedScripts((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    savedScripts,
    saveScript,
    deleteScript,
    saveStatus,
  };
}
