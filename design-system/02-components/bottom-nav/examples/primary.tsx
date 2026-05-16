// Lumen BottomNav — Web React example. 3-5 items. safe-area padding.

import { ReactNode } from "react";

export type BottomNavItem = {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number | string;
};

export function BottomNav({
  items,
  activeId,
  onActiveChange,
  showLabels = true,
  elevation = "border",
}: {
  items: BottomNavItem[];
  activeId: string;
  onActiveChange: (id: string) => void;
  showLabels?: boolean;
  elevation?: "border" | "shadow";
}) {
  return (
    <nav
      aria-label="Bottom navigation"
      className={[
        "fixed inset-x-0 bottom-0 z-[var(--z-nav,30)]",
        "bg-[var(--color-surface-page)]",
        elevation === "border" ? "border-t border-[var(--color-border-hairline)]" : "shadow-[var(--shadow-elevation-md)]",
        "pb-[max(env(safe-area-inset-bottom),0px)]",
      ].join(" ")}
    >
      <ul role="list" className="grid grid-cols-5 h-14">
        {items.slice(0, 5).map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className={items.length < 5 && items.length > 3 ? `col-span-${5 / items.length}` : ""}>
              <button
                type="button"
                onClick={() => onActiveChange(item.id)}
                aria-current={active ? "page" : undefined}
                aria-label={showLabels ? undefined : item.label}
                className={[
                  "relative w-full h-full flex flex-col items-center justify-center gap-0.5",
                  "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:shadow-[var(--shadow-focus)]",
                  active
                    ? "text-[var(--color-text-accent)]"
                    : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]",
                  "transition-colors duration-[var(--motion-duration-fast)]",
                ].join(" ")}
              >
                {active && (
                  <span aria-hidden className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-b-full bg-[var(--color-accent-500)]" />
                )}
                <span className="relative">
                  <span className="inline-block w-5 h-5">{item.icon}</span>
                  {item.badge !== undefined && (
                    <span
                      aria-hidden
                      className="absolute -top-1 -right-2 lumen-tnum rounded-full bg-[var(--color-accent-500)] text-[var(--color-text-on-accent,var(--color-accent-fg))] text-[10px] px-1 leading-4 min-w-4 text-center"
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
                {showLabels && (
                  <span className="text-[10px] font-medium">{item.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
