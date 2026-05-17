"use client";

/**
 * @lumen/toast — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Lumen-themed Sonner wrapper. Surfaces inherit --surface-popover + hairline
 * border + --shadow-popover; pill tones for status messages. Re-exports the
 * `toast` callable so consumers can `import { Toaster, toast }`.
 *
 * Mount <Toaster /> once near the app root; call `toast` from anywhere.
 */
import * as React from "react";
import { Toaster as SonnerToaster, toast } from "sonner";

const lumenToastClassNames = {
  toast:
    "group toast group-[.toaster]:bg-[var(--surface-popover)] group-[.toaster]:text-[color:var(--text-primary)] group-[.toaster]:border group-[.toaster]:border-[var(--border-default)] group-[.toaster]:shadow-[var(--shadow-popover)] group-[.toaster]:rounded-[var(--radius-lg)] group-[.toaster]:font-medium",
  description: "group-[.toast]:text-[color:var(--text-tertiary)]",
  actionButton:
    "group-[.toast]:bg-[var(--color-action-primary-bg-rest)] group-[.toast]:text-[color:var(--color-action-primary-fg)]",
  cancelButton:
    "group-[.toast]:bg-[var(--surface-sunken)] group-[.toast]:text-[color:var(--text-secondary)]",
  success:
    "group-[.toaster]:bg-[var(--pill-success-bg)] group-[.toaster]:text-[color:var(--pill-success-fg)] group-[.toaster]:border-[var(--pill-success-border)]",
  error:
    "group-[.toaster]:bg-[var(--pill-danger-bg)] group-[.toaster]:text-[color:var(--pill-danger-fg)] group-[.toaster]:border-[var(--pill-danger-border)]",
  warning:
    "group-[.toaster]:bg-[var(--pill-warn-bg)] group-[.toaster]:text-[color:var(--pill-warn-fg)] group-[.toaster]:border-[var(--pill-warn-border)]",
  info:
    "group-[.toaster]:bg-[var(--pill-info-bg)] group-[.toaster]:text-[color:var(--pill-info-fg)] group-[.toaster]:border-[var(--pill-info-border)]",
};

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({
  position = "bottom-right",
  visibleToasts = 3,
  closeButton = true,
  richColors = false,
  ...props
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      visibleToasts={visibleToasts}
      closeButton={closeButton}
      richColors={richColors}
      toastOptions={{
        classNames: lumenToastClassNames,
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
