import { useEffect, useRef } from "preact/hooks";
import type {
  ScriptOptions,
  ParsedScript,
  PageDimensions,
} from "botc-character-sheet";

type Appearance = "normal" | "compact" | "super-compact" | "mega-compact";

interface UseOverflowDetectionProps {
  options: ScriptOptions;
  setOptions: (updater: (prev: ScriptOptions) => ScriptOptions) => void;
  script: ParsedScript | null;
}

const APPEARANCE_LEVELS: Appearance[] = [
  "normal",
  "compact",
  "super-compact",
  "mega-compact",
];

/**
 * Hook to detect if the CharacterSheet overflows its container and automatically
 * adjust the compactness level down (normal -> compact -> super-compact).
 */
export function useOverflowDetection({
  options,
  setOptions,
  script,
}: UseOverflowDetectionProps) {
  const lastCheckedAppearanceRef = useRef<Appearance | null>(null);
  const lastCheckedDimensionsRef = useRef<PageDimensions | null>(null);
  const isAdjustingRef = useRef(false);

  // Reset detection when script changes
  useEffect(() => {
    lastCheckedAppearanceRef.current = null;
    lastCheckedDimensionsRef.current = null;
    isAdjustingRef.current = false;
  }, [script]);

  useEffect(() => {
    if (!script) return;

    // Debounce to allow DOM to settle after appearance changes
    const timeoutId = setTimeout(() => {
      const characterSheet = document.getElementById("character-sheet");
      if (!characterSheet) return;

      const currentAppearance = options.appearance;
      const currentDimensions = options.dimensions;

      // Prevent re-checking the same appearance level
      if (
        lastCheckedAppearanceRef.current === currentAppearance &&
        lastCheckedDimensionsRef.current === currentDimensions
      ) {
        return;
      }

      // Check if content overflows
      const hasOverflow =
        characterSheet.scrollHeight > characterSheet.clientHeight;

      if (hasOverflow && !isAdjustingRef.current) {
        const currentIndex = APPEARANCE_LEVELS.indexOf(currentAppearance);
        const nextIndex = currentIndex + 1;

        // If there's a next compactness level, switch to it
        if (nextIndex < APPEARANCE_LEVELS.length) {
          isAdjustingRef.current = true;
          const nextAppearance = APPEARANCE_LEVELS[nextIndex];

          setOptions((prev) => ({
            ...prev,
            appearance: nextAppearance,
          }));

          // Allow the next check after appearance has changed
          setTimeout(() => {
            isAdjustingRef.current = false;
          }, 100);
        } else {
          // We're at super-compact and still overflowing - nothing more we can do
          lastCheckedAppearanceRef.current = currentAppearance;
        }
      } else if (!hasOverflow) {
        // No overflow, mark this appearance as checked
        lastCheckedAppearanceRef.current = currentAppearance;
      }
    }, 300); // 300ms debounce to allow rendering to complete

    return () => clearTimeout(timeoutId);
  }, [options.appearance, script, setOptions, options.dimensions]);
}
