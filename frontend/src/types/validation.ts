export type ValidationSeverity = "substituted" | "excluded";

export interface ValidationIssue {
  severity: ValidationSeverity;
  message: string;
}
