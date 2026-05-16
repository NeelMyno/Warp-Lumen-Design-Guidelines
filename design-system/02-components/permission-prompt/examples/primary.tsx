// Lumen PermissionPrompt — Web React example.
// Centered dialog with the consequence + value. Primary fires the system prompt.

"use client";

import { Bell, Camera, Mic, MapPin, Image, User, Activity, Eye, Bluetooth, Fingerprint } from "lucide-react";
import { ReactNode, useId } from "react";

export type PermissionKind =
  | "camera" | "microphone" | "location" | "notifications"
  | "contacts" | "photos" | "motion" | "tracking" | "biometric" | "bluetooth";

const KIND: Record<PermissionKind, { title: string; icon: typeof Bell }> = {
  camera:        { title: "Allow camera access", icon: Camera },
  microphone:    { title: "Allow microphone access", icon: Mic },
  location:      { title: "Allow location access", icon: MapPin },
  notifications: { title: "Turn on notifications", icon: Bell },
  contacts:      { title: "Allow contacts access", icon: User },
  photos:        { title: "Allow photos access", icon: Image },
  motion:        { title: "Allow motion access", icon: Activity },
  tracking:      { title: "Allow tracking", icon: Eye },
  biometric:     { title: "Allow biometric sign-in", icon: Fingerprint },
  bluetooth:     { title: "Allow Bluetooth access", icon: Bluetooth },
};

export function PermissionPrompt({
  kind,
  title,
  description,
  primaryLabel = "Continue",
  secondaryLabel = "Not now",
  onPrimary,
  onSecondary,
}: {
  kind: PermissionKind;
  title?: string;
  description: ReactNode;
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  const titleId = useId();
  const { title: defaultTitle, icon: Icon } = KIND[kind];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className={[
        "fixed inset-0 z-[var(--z-modal,50)] flex items-center justify-center",
        "bg-[var(--color-surface-scrim)]",
        "animate-in fade-in-0 motion-reduce:animate-none",
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[400px] w-[calc(100vw-2rem)]",
          "rounded-[var(--radius-card-hero)] border border-[var(--color-border-hairline)]",
          "bg-[var(--color-surface-raised)] shadow-[var(--shadow-modal)]",
          "p-[var(--space-inset-xl)] text-center",
          "animate-in zoom-in-95 fade-in-0 motion-reduce:animate-none",
        ].join(" ")}
        style={{ animationDuration: "var(--motion-duration-slow)" }}
      >
        <span
          aria-hidden
          className="mx-auto mb-[var(--space-stack-md)] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-tint-accent)] text-[var(--color-text-accent)]"
        >
          <Icon size={20} />
        </span>
        <h2 id={titleId} className="text-[var(--type-heading-h3)] font-medium tracking-tight text-[var(--color-text-primary)]">
          {title ?? defaultTitle}
        </h2>
        <p className="mt-[var(--space-stack-md)] text-[var(--type-body-md)] text-[var(--color-text-secondary)]">{description}</p>
        <div className="mt-[var(--space-stack-lg)] flex flex-col gap-2">
          <button
            type="button"
            onClick={onPrimary}
            className={[
              "h-11 w-full rounded-[var(--radius-control-md)] font-medium",
              "bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
            ].join(" ")}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onSecondary}
            className={[
              "h-11 w-full rounded-[var(--radius-control-md)] font-medium",
              "bg-transparent text-[var(--color-action-tertiary-fg)] hover:bg-[var(--color-action-tertiary-bg-hover)]",
              "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
            ].join(" ")}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
