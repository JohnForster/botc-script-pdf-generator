import { useState } from "preact/hooks";
import {
  NetworkPayload,
  NightOrders,
  ParsedScript,
  ScriptOptions,
} from "botc-character-sheet";
import { downloadBlob } from "../utils/downloadFile";

export function usePdfGeneration() {
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const generatePDF = async (
    script: ParsedScript,
    options: ScriptOptions,
    nightOrders: NightOrders,
  ) => {
    // Show modal and reset state
    setShowPdfModal(true);
    setPdfLoading(true);
    setPdfBlob(null);
    setPdfUrl(null);
    setPdfError(null);

    const payload: NetworkPayload = {
      script,
      options,
      nightOrders,
      filename: `${script.metadata?.name || "script"}.pdf`,
    };

    try {
      const apiUrl = import.meta.env.VITE_PDF_API_URL || "";
      console.log(apiUrl);
      const response = await fetch(`${apiUrl}/api/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: window.location.origin,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      setPdfLoading(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfError(
        "Failed to generate PDF. Please try the browser print option instead.",
      );
      setPdfLoading(false);
    }
  };

  const downloadPDF = (scriptName?: string) => {
    if (!pdfBlob) return;
    downloadBlob(pdfBlob, `${scriptName || "script"}.pdf`);
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setPdfBlob(null);
    setPdfError(null);

    // Clean up the blob URL
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return {
    showPdfModal,
    pdfLoading,
    pdfUrl,
    pdfError,
    generatePDF,
    downloadPDF,
    closePdfModal,
  };
}
