import type { ValidationIssue } from "../../types/validation";

interface ScriptIssuesProps {
  issues: ValidationIssue[];
}

export function ScriptIssues({ issues }: ScriptIssuesProps) {
  if (issues.length === 0) return null;

  return (
    <div className="warning-message script-issues">
      <strong>Script Issues:</strong>
      <ul>
        {issues.map((issue, i) => (
          <li key={i}>{issue.message}</li>
        ))}
      </ul>
    </div>
  );
}
