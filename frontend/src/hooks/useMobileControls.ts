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

  // Calculate mobile scale for preview
  const calculateMobileScale = useCallback(() => {
    const MOBILE_BREAKPOINT = 1024;
    const MOBILE_PADDING = 40; // 10px on each side of .app + 10px padding on preview

    if (window.innerWidth > MOBILE_BREAKPOINT) {
      document.documentElement.style.removeProperty("--mobile-preview-scale");
      return;
    }

    // Convert mm to px (96 DPI: 1 inch = 25.4mm = 96px, so 1mm = 3.7795275591px)
    const MM_TO_PX = 3.7795275591;
    const sheetWidthPx = sheetWidthMm * MM_TO_PX;
    const availableWidth = window.innerWidth - MOBILE_PADDING;
    const scale = Math.min(1, availableWidth / sheetWidthPx);

    document.documentElement.style.setProperty(
      "--mobile-preview-scale",
      String(scale),
    );
  }, [sheetWidthMm]);

  // Update mobile scale on resize and when dimensions change
  useEffect(() => {
    calculateMobileScale();
    window.addEventListener("resize", calculateMobileScale);
    return () => window.removeEventListener("resize", calculateMobileScale);
  }, [calculateMobileScale]);

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
