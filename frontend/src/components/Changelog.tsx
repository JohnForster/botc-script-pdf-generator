import "./Changelog.css";

interface ChangelogEntry {
  date: string;
  changes: string[];
}

const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: "2026-01-21",
    changes: [
      "Add half-size Teensyville support",
      "Fix bug that was stopping server-side generation from working",
    ],
  },
  {
    date: "2026-01-18",
    changes: ["Add support for Zenomancer, Hindu and Pope lorics"],
  },
  {
    date: "2026-01-16",
    changes: [
      "Add print dimensions options to customize the size and margins of the character sheets for printing.",
      "Add support for Letter paper size, used by countries such as Canada, the Phillippines and the USA.",
      "Improve UI to make it cleaner and less cluttered",
    ],
  },
  {
    date: "2026-01-14",
    changes: [
      "Added the option to have an info sheet on the back of the character sheet, which can display night order, jinxes, recommended travellers and base player counts, similar to the official script tool.",
      "Added the changelog :) ",
    ],
  },
  {
    date: "2026-01-10",
    changes: [
      "Bootlegger rules are now displayed alongside the loric",
      "Night orders now work with custom characters",
    ],
  },
  {
    date: "2025-12-20",
    changes: [
      "Jinx icons can now be displayed alongside character names, not just in the jinx section",
    ],
  },
];

// Filter entries from the last 3 weeks
function getRecentChanges(): ChangelogEntry[] {
  const now = new Date();
  const fourWeeksAgo = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);

  return CHANGELOG_ENTRIES.filter((entry) => {
    const entryDate = new Date(entry.date);
    return entryDate >= fourWeeksAgo;
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UK", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isWithinLastWeek(dateString: string): boolean {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const entryDate = new Date(dateString);
  return entryDate >= oneWeekAgo;
}

export function Changelog() {
  const recentChanges = getRecentChanges();

  if (recentChanges.length === 0) {
    return null;
  }

  return (
    <div className="changelog">
      <h3 className="changelog-title">Recent Updates</h3>
      <div className="changelog-entries">
        {recentChanges.map((entry, index) => {
          const isRecent = index === 0 && isWithinLastWeek(entry.date);
          return (
            <div
              key={index}
              className={`changelog-entry ${
                isRecent ? "changelog-entry-recent" : ""
              }`}
            >
              <div className="changelog-date">{formatDate(entry.date)}</div>
              <ul className="changelog-list">
                {entry.changes.map((change, changeIndex) => (
                  <li key={changeIndex} className="changelog-item">
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
