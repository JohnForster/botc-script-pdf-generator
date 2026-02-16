interface MobileSavedScriptsToggleProps {
  onToggle: () => void;
}

export function MobileSavedScriptsToggle({
  onToggle,
}: MobileSavedScriptsToggleProps) {
  return (
    <button
      className="mobile-saved-scripts-toggle"
      onClick={onToggle}
      aria-label="Show saved scripts"
    >
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
        />
      </svg>
    </button>
  );
}
