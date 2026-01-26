import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ComponentChildren;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`collapsible-section ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="collapsible-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="control-group-label" style={{ margin: 0 }}>
          {title}
        </span>
        <span className={`collapsible-chevron ${isOpen ? "open" : ""}`}>
          <ChevronIcon />
        </span>
      </button>
      <div className="collapsible-content-wrapper">
        <div className="collapsible-content">{children}</div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
        fill="currentColor"
      />
    </svg>
  );
}
