// Lumen ValidationMessage — Web React example (v0.6)
//
// Inline message that sits below a form field to communicate validation
// state. Three tones: error (default, red ink + alert icon), success
// (accent ink + check icon), warning (amber ink + warn icon). Each tone
// uses role="alert" so the message announces immediately on appearance.

import { ReactNode } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

export type ValidationTone = "error" | "success" | "warning";

const TONE_CFG: Record<ValidationTone, { color: string; Icon: typeof AlertCircle; role: "alert" | "status" }> = {
  error: {
    color: "var(--text-error)",
    Icon: AlertCircle,
    role: "alert",
  },
  success: {
    color: "var(--text-success)",
    Icon: CheckCircle2,
    role: "status",
  },
  warning: {
    color: "var(--text-warning)",
    Icon: AlertTriangle,
    role: "status",
  },
};

export type ValidationMessageProps = {
  tone?: ValidationTone;
  id?: string;
  children: ReactNode;
};

export function ValidationMessage({
  tone = "error",
  id,
  children,
}: ValidationMessageProps) {
  const { color, Icon, role } = TONE_CFG[tone];
  return (
    <span
      id={id}
      role={role}
      className="text-caption inline-flex items-center gap-1"
      style={{ color }}
    >
      <Icon size={12} aria-hidden focusable={false} />
      {children}
    </span>
  );
}

// Usage:
//
//   <Field
//     label="Pickup ZIP"
//     error={errors.zip ? "Enter a valid 5-digit ZIP" : undefined}
//   >
//     <input className="lumen-field" />
//   </Field>
//
// Or directly (when not inside Field):
//
//   <ValidationMessage tone="warning">
//     This lane has fewer than 3 carriers — quotes may take longer.
//   </ValidationMessage>
//
//   <ValidationMessage tone="success">
//     Saved. Available to all teammates.
//   </ValidationMessage>
