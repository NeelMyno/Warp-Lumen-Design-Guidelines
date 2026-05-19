// Lumen PhoneFrame — Web React example. Stylized phone silhouette for marketing mockups.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

import { ReactNode } from "react";

type Platform = "ios-notch" | "ios-island" | "android-pin-hole";
type Size = "sm" | "md" | "lg";

const SIZE: Record<Size, { w: number; h: number }> = {
  sm: { w: 300, h: 600 },
  md: { w: 360, h: 720 },
  lg: { w: 420, h: 840 },
};

export type PhoneFrameProps = {
  platform?: Platform;
  size?: Size;
  rotation?: "portrait" | "landscape";
  statusBar?: ReactNode;
  showHomeIndicator?: boolean;
  background?: string;
  children: ReactNode;
};

export function PhoneFrame({
  platform = "ios-island",
  size = "md",
  rotation = "portrait",
  statusBar,
  showHomeIndicator = true,
  background,
  children,
}: PhoneFrameProps) {
  const { w, h } = rotation === "portrait" ? SIZE[size] : { w: SIZE[size].h, h: SIZE[size].w };
  const isIOS = platform.startsWith("ios");
  return (
    <div
      role="img"
      aria-label={`Phone mockup, ${platform}`}
      className="inline-block relative"
      style={{
        width: w + 16,
        height: h + 16,
      }}
    >
      <div
        className="absolute inset-0 rounded-[42px] bg-[var(--color-surface-sunken)] shadow-[var(--shadow-elevation-lg)]"
        style={{ border: "1px solid var(--color-alpha-paper-40)" }}
      />
      <div
        className="absolute inset-2 overflow-hidden rounded-[34px] bg-[var(--color-surface-page)] flex flex-col"
        style={{ background: background ?? undefined }}
      >
        {/* Status bar slot */}
        <div className="relative h-10 shrink-0">
          {statusBar ?? <div className="h-full w-full flex items-center justify-between px-6 text-[11px] text-[var(--color-text-primary)] lumen-tnum">
            <span>9:41</span><span>● ●</span>
          </div>}
          {/* Notch / Dynamic Island / Pin-hole */}
          {platform === "ios-notch" && (
            <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-0 h-6 w-32 rounded-b-[18px] bg-[var(--color-alpha-ink-86)]" />
          )}
          {platform === "ios-island" && (
            <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-2 h-6 w-24 rounded-full bg-[var(--color-alpha-ink-86)]" />
          )}
          {platform === "android-pin-hole" && (
            <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-2 size-2 rounded-full bg-[var(--color-alpha-ink-86)]" />
          )}
        </div>
        {/* Content */}
        <div className="flex-1 overflow-hidden">{children}</div>
        {/* Home indicator */}
        {isIOS && showHomeIndicator && (
          <div className="shrink-0 flex justify-center pt-2 pb-2">
            <span aria-hidden className="h-1 w-32 rounded-full bg-[var(--color-text-primary)] opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
