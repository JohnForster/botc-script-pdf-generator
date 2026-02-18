import { useState, useEffect, useRef, useCallback } from "preact/hooks";
import type { Script } from "botc-script-checker";
import type { ScriptOptions } from "botc-character-sheet";

export interface SavedScript {
  id: string;
  name: string;
  savedAt: number;
  script: Script;
  options: ScriptOptions;
}

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
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  // Ref mirrors activeScriptId for synchronous reads in auto-save
  const activeIdRef = useRef<string | null>(null);

  // Persist to localStorage when savedScripts changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedScripts));
  }, [savedScripts]);

  const createEntry = useCallback(
    (rawScript: Script, options: ScriptOptions, name: string) => {
      const id = crypto.randomUUID();
      const entry: SavedScript = {
        id,
        name: name || "Untitled Script",
        savedAt: Date.now(),
        script: rawScript,
        options,
      };

      setSavedScripts((prev) => [entry, ...prev]);
      activeIdRef.current = id;
      setActiveScriptId(id);
    },
    [],
  );

  const updateActiveScript = useCallback(
    (rawScript: Script, options: ScriptOptions, name: string) => {
      const id = activeIdRef.current;
      if (!id) return;
      setSavedScripts((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                script: rawScript,
                options,
                name: name || s.name,
                savedAt: Date.now(),
              }
            : s,
        ),
      );
    },
    [],
  );

  const deleteScript = (id: string) => {
    setSavedScripts((prev) => prev.filter((s) => s.id !== id));
    if (activeIdRef.current === id) {
      activeIdRef.current = null;
      setActiveScriptId(null);
    }
  };

  const loadSavedScript = useCallback((id: string) => {
    activeIdRef.current = id;
    setActiveScriptId(id);
  }, []);

  return {
    savedScripts,
    createEntry,
    updateActiveScript,
    deleteScript,
    loadSavedScript,
    activeScriptId,
  };
}
