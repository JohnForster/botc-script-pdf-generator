import { useState } from "preact/hooks";
import type { Script } from "botc-script-checker";
import type { ScriptOptions } from "botc-character-sheet";
import { saveScript, getShareUrl } from "../utils/scriptStorage";

export function useShare() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShare = async (rawScript: Script, options: ScriptOptions) => {
    setIsSharing(true);
    setShareError(null);
    setShareUrl(null);

    try {
      const id = await saveScript(rawScript, options);
      const url = getShareUrl(id);
      setShareUrl(url);

      // Copy to clipboard
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to share script:", err);
      setShareError(
        err instanceof Error ? err.message : "Failed to share script",
      );
    } finally {
      setIsSharing(false);
    }
  };

  const clearShareState = () => {
    setShareUrl(null);
    setShareError(null);
  };

  return {
    isSharing,
    shareUrl,
    shareError,
    handleShare,
    clearShareState,
  };
}
