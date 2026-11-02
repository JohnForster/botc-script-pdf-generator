import { useEffect, useState } from "preact/hooks";
import { useTranslation } from "botc-character-sheet";
import type { LanguageCode } from "botc-character-sheet";

export function TranslationDebug({ onLanguageChange }: { onLanguageChange?: (lang: LanguageCode) => void }) {
  const { language, setLanguage, t } = useTranslation();
  const [showDebug, setShowDebug] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  // Toggle debug panel with Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setShowDebug((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Test translation function
  const testTranslation = () => {
    const result = t("roles", "alchemist", "name");
    setTestResult(result || "No translation found");
  };

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  if (!showDebug) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "15px",
        borderRadius: "8px",
        fontSize: "12px",
        zIndex: 10000,
        maxWidth: "300px",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>Translation Debug</h3>
      <p style={{ margin: "5px 0" }}>
        <strong>Current Language:</strong> {language}
      </p>
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={() => handleLanguageChange("en")}
          style={{
            marginRight: "5px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          English
        </button>
        <button
          onClick={() => handleLanguageChange("de")}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          German
        </button>
      </div>
      <div style={{ margin: "10px 0" }}>
        <button
          onClick={testTranslation}
          style={{
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Test Translation (Alchemist)
        </button>
      </div>
      {testResult && (
        <p style={{ margin: "5px 0", color: "#4CAF50" }}>
          <strong>Test Result:</strong> {testResult}
        </p>
      )}
      <p style={{ margin: "5px 0", color: "#aaa" }}>
        Press Ctrl+Shift+D to toggle this panel
      </p>
    </div>
  );
}