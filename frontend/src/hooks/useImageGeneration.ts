import { useState } from "preact/hooks";
import {
  NetworkPayload,
  NightOrders,
  ParsedScript,
  ScriptOptions,
} from "botc-character-sheet";

interface ImageResponse {
  characterSheet: string | null;
  infoSheet: string | null;
}

export function useImageGeneration() {
  const [showImageModal, setShowImageModal] = useState(false);
  const [characterSheetUrl, setCharacterSheetUrl] = useState<string | null>(
    null
  );
  const [infoSheetUrl, setInfoSheetUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const generateImages = async (
    script: ParsedScript,
    options: ScriptOptions,
    nightOrders: NightOrders
  ) => {
    // Show modal and reset state
    setShowImageModal(true);
    setImageLoading(true);
    setCharacterSheetUrl(null);
    setInfoSheetUrl(null);
    setImageError(null);

    const payload: NetworkPayload = {
      script,
      options,
      nightOrders,
      filename: `${script.metadata?.name || "script"}.png`,
    };

    try {
      const apiUrl = import.meta.env.VITE_PDF_API_URL || "";
      const response = await fetch(`${apiUrl}/api/download-as-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate images: ${response.statusText}`);
      }

      const data: ImageResponse = await response.json();

      if (data.characterSheet) {
        setCharacterSheetUrl(`data:image/png;base64,${data.characterSheet}`);
      }
      if (data.infoSheet) {
        setInfoSheetUrl(`data:image/png;base64,${data.infoSheet}`);
      }

      setImageLoading(false);
    } catch (error) {
      console.error("Error generating images:", error);
      setImageError(
        "Failed to generate images. Please try the browser print option instead."
      );
      setImageLoading(false);
    }
  };

  const downloadCharacterSheet = (scriptName?: string) => {
    if (!characterSheetUrl) return;
    downloadDataUrl(
      characterSheetUrl,
      `${scriptName || "script"}-character-sheet.png`
    );
  };

  const downloadInfoSheet = (scriptName?: string) => {
    if (!infoSheetUrl) return;
    downloadDataUrl(infoSheetUrl, `${scriptName || "script"}-info-sheet.png`);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setCharacterSheetUrl(null);
    setInfoSheetUrl(null);
    setImageError(null);
  };

  return {
    showImageModal,
    imageLoading,
    characterSheetUrl,
    infoSheetUrl,
    imageError,
    generateImages,
    downloadCharacterSheet,
    downloadInfoSheet,
    closeImageModal,
  };
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
