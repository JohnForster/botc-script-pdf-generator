import { useState, useEffect, useCallback } from "preact/hooks";

interface UseMobileControlsOptions {
  sheetWidthMm: number;
  hasScript: boolean;
}

export function useMobileControls({
  sheetWidthMm,
  hasScript,
}: UseMobileControlsOptions) {
  const [isOpen, setIsOpen] = useState(true);

  // Close mobile controls when a script is loaded
  useEffect(() => {
    if (hasScript) {
      setIsOpen(false);
    }
  }, [hasScript]);

  useMobilePreviewScale(sheetWidthMm);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const controlsClassName = hasScript
    ? isOpen
      ? "mobile-expanded"
      : "mobile-collapsed"
    : "";

  return {
    isOpen,
    toggle,
    controlsClassName,
  };
}

const MOBILE_BREAKPOINT = 1024;
const MOBILE_PADDING = 40; // 10px on each side of .app + 10px padding on preview
const MM_TO_PX = 3.7795275591; // 96 DPI: 1 inch = 25.4mm = 96px

export function useMobilePreviewScale(sheetWidthMm: number) {
  const calculateMobileScale = useCallback(() => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      document.documentElement.style.removeProperty("--mobile-preview-scale");
      return;
    }

    const sheetWidthPx = sheetWidthMm * MM_TO_PX;
    const availableWidth = window.innerWidth - MOBILE_PADDING;
    const scale = Math.min(1, availableWidth / sheetWidthPx);

    document.documentElement.style.setProperty(
      "--mobile-preview-scale",
      String(scale),
    );
  }, [sheetWidthMm]);

  useEffect(() => {
    calculateMobileScale();
    window.addEventListener("resize", calculateMobileScale);
    return () => window.removeEventListener("resize", calculateMobileScale);
  }, [calculateMobileScale]);
}
