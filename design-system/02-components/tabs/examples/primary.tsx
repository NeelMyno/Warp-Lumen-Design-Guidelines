// Lumen Tabs — Web React example
// Tailwind v4 + Lumen tokens via CSS variables.
//
// Three chrome variants share one prop surface. The moving thumb (pill + underline)
// is positioned via inline style.left / style.width read from each trigger's
// getBoundingClientRect() — per AGENTS.md hard rule 12, never Tailwind arbitrary
// translate-x-[Npx] classes (Tailwind v4's scanner has been observed to drop them).

"use client";

import {
  ReactNode,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

type Variant = "pill" | "underline" | "enclosed";
type Density = "compact" | "dense" | "regular";
type Orientation = "horizontal" | "vertical";

export type TabsProps = {
  value: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: Variant;
  density?: Density;
  orientation?: Orientation;
  fitted?: boolean;
  children: ReactNode;
};

const DENSITY: Record<Density, string> = {
  compact: "h-7 text-[var(--type-label-sm)]",
  dense:   "h-8 text-[var(--type-label-md)]",
  regular: "h-9 text-[var(--type-label-md)]",
};

type Ctx = {
  value: string;
  setValue: (v: string) => void;
  variant: Variant;
  density: Density;
  orientation: Orientation;
  triggers: Map<string, HTMLButtonElement>;
  registerTrigger: (v: string, el: HTMLButtonElement | null) => void;
};

const TabsCtx = (() => {
  const noop = () => {};
  return { value: "", setValue: noop, variant: "pill", density: "regular", orientation: "horizontal", triggers: new Map(), registerTrigger: noop } as Ctx;
})();

// Simple context shim (avoid React.createContext import noise in copy-paste)
import { createContext, useContext } from "react";
const TabsContext = createContext<Ctx>(TabsCtx);

export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant = "pill",
  density = "regular",
  orientation = "horizontal",
  fitted = false,
  children,
}: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolled;
  const triggers = useRef(new Map<string, HTMLButtonElement>());

  const setValue = useCallback(
    (v: string) => {
      if (!isControlled) setUncontrolled(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange],
  );

  const registerTrigger = useCallback((v: string, el: HTMLButtonElement | null) => {
    if (el) triggers.current.set(v, el);
    else triggers.current.delete(v);
  }, []);

  return (
    <TabsContext.Provider
      value={{ value, setValue, variant, density, orientation, triggers: triggers.current, registerTrigger }}
    >
      <div
        data-orientation={orientation}
        data-fitted={fitted}
        className={[
          "flex",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          "gap-[var(--space-stack-md)]",
        ].join(" ")}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: ReactNode }) {
  const { variant, orientation, value } = useContext(TabsContext);
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);

  // Position the moving thumb (pill + underline only) from the active trigger's rect.
  useLayoutEffect(() => {
    if (variant === "enclosed") return;
    const list = ref.current;
    if (!list) return;
    const active = list.querySelector<HTMLButtonElement>(`[role="tab"][data-state="active"]`);
    if (!active) {
      setThumb(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const triggerRect = active.getBoundingClientRect();
    setThumb({
      left: triggerRect.left - listRect.left,
      width: triggerRect.width,
    });
  }, [variant, value]);

  // Reposition on resize.
  useEffect(() => {
    const onResize = () => {
      const list = ref.current;
      if (!list || variant === "enclosed") return;
      const active = list.querySelector<HTMLButtonElement>(`[role="tab"][data-state="active"]`);
      if (!active) return;
      const listRect = list.getBoundingClientRect();
      const triggerRect = active.getBoundingClientRect();
      setThumb({ left: triggerRect.left - listRect.left, width: triggerRect.width });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [variant]);

  const chrome: Record<Variant, string> = {
    pill: [
      "bg-[var(--color-surface-sunken)] border border-[var(--color-border-hairline)]",
      "rounded-[var(--radius-popover)] p-[3px]",
    ].join(" "),
    underline: [
      "border-b border-[var(--color-border-hairline)]",
    ].join(" "),
    enclosed: [
      "border border-[var(--color-border-default)] rounded-t-[var(--radius-control-md)]",
      "bg-[var(--color-surface-raised)]",
    ].join(" "),
  };

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      ref={ref}
      data-variant={variant}
      className={[
        "relative inline-flex items-center w-fit",
        orientation === "vertical" ? "flex-col items-stretch" : "flex-row",
        chrome[variant],
      ].join(" ")}
    >
      {children}
      {/* Moving thumb — pill (raised tile) */}
      {variant === "pill" && thumb && (
        <span
          aria-hidden
          className={[
            "absolute top-[3px] bottom-[3px] -z-0",
            "bg-[var(--color-action-selected-bg)]",
            "border border-[var(--color-border-accent)]",
            "rounded-[calc(var(--radius-popover)-3px)]",
            "transition-[left,width] duration-[var(--motion-duration-fast)]",
          ].join(" ")}
          style={{
            left: `${thumb.left}px`,
            width: `${thumb.width}px`,
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      )}
      {/* Moving thumb — underline (2 px lime stroke) */}
      {variant === "underline" && thumb && (
        <span
          aria-hidden
          className={[
            "absolute bottom-0 h-[2px]",
            "bg-[var(--color-border-accent)]",
            "transition-[left,width] duration-[var(--motion-duration-fast)]",
          ].join(" ")}
          style={{
            left: `${thumb.left}px`,
            width: `${thumb.width}px`,
            transitionTimingFunction: "cubic-bezier(0.2, 0, 0, 1)",
          }}
        />
      )}
    </div>
  );
}

export type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
  children: ReactNode;
};

export function TabsTrigger({ value, disabled, children }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  const triggerId = useId();
  const panelId = `${triggerId}-panel`;
  const isActive = ctx.value === value;
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    ctx.registerTrigger(value, ref.current);
    return () => ctx.registerTrigger(value, null);
  }, [value, ctx]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const keys = ctx.orientation === "horizontal"
      ? { next: "ArrowRight", prev: "ArrowLeft" }
      : { next: "ArrowDown",  prev: "ArrowUp"   };
    const values = Array.from(ctx.triggers.keys());
    const i = values.indexOf(value);
    if (event.key === keys.next) {
      event.preventDefault();
      const nextValue = values[(i + 1) % values.length];
      ctx.triggers.get(nextValue)?.focus();
      if (ctx.orientation === "horizontal") ctx.setValue(nextValue);
    } else if (event.key === keys.prev) {
      event.preventDefault();
      const prevValue = values[(i - 1 + values.length) % values.length];
      ctx.triggers.get(prevValue)?.focus();
      if (ctx.orientation === "horizontal") ctx.setValue(prevValue);
    } else if (event.key === "Home") {
      event.preventDefault();
      const first = values[0];
      ctx.triggers.get(first)?.focus();
      if (ctx.orientation === "horizontal") ctx.setValue(first);
    } else if (event.key === "End") {
      event.preventDefault();
      const last = values[values.length - 1];
      ctx.triggers.get(last)?.focus();
      if (ctx.orientation === "horizontal") ctx.setValue(last);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      ctx.setValue(value);
    }
  };

  const base = [
    "relative z-[1] inline-flex items-center justify-center",
    "px-[var(--space-inset-md)] font-medium whitespace-nowrap",
    "transition-colors duration-[var(--motion-duration-fast)]",
    "outline-none focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1",
    DENSITY[ctx.density],
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" ");

  const variantState: Record<Variant, string> = {
    pill:      isActive ? "text-[var(--color-text-accent)]"  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
    underline: isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
    enclosed:  isActive
      ? "bg-[var(--color-surface-raised)] text-[var(--color-text-primary)] border-b-0"
      : "bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
  };

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={triggerId}
      aria-selected={isActive}
      aria-controls={panelId}
      data-state={isActive ? "active" : "inactive"}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => ctx.setValue(value)}
      onKeyDown={onKeyDown}
      className={[base, variantState[ctx.variant]].join(" ")}
    >
      {children}
    </button>
  );
}

export type TabsPanelProps = {
  value: string;
  children: ReactNode;
};

export function TabsPanel({ value, children }: TabsPanelProps) {
  const ctx = useContext(TabsContext);
  const isActive = ctx.value === value;
  if (!isActive) return null;
  return (
    <div role="tabpanel" tabIndex={0} className="outline-none focus-visible:shadow-[var(--shadow-focus)]">
      {children}
    </div>
  );
}
