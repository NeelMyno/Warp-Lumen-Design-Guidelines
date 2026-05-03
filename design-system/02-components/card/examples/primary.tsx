// Lumen Card — Web React example
// Tailwind v4 + tokens consumed via @theme inline / CSS variables.
//
// Copy this into your repo at /components/ui/card.tsx.
// Tokens come from /_build/tailwind/theme.css which you import in your global css.

import {
  ReactNode,
  HTMLAttributes,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
} from "react";

type Padding = "none" | "sm" | "md" | "lg";
type As = "div" | "article" | "section" | "button" | "a";

const PAD: Record<Padding, string> = {
  none: "p-0",
  sm: "p-[var(--card-padding-sm)]",
  md: "p-[var(--card-padding-md)]",
  lg: "p-[var(--card-padding-lg)]",
};

export type CardProps = HTMLAttributes<HTMLElement> & {
  padding?: Padding;
  interactive?: boolean;
  selected?: boolean;
  as?: As;
  children: ReactNode;
};

/**
 * Card — bounded surface with hairline border and optional subtle shadow.
 *
 * Renders a non-interactive <div> by default. Pass `as="button"` for action
 * cards or `as="a"` for navigation cards — never combine `<div onClick>`.
 * Selection state announces via aria-pressed (button) or aria-selected (a).
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    padding = "md",
    interactive = false,
    selected = false,
    as = "div",
    className,
    children,
    ...rest
  },
  ref,
) {
  const base = [
    "block rounded-[var(--card-radius-default)]",
    "bg-[var(--card-background)] text-[var(--color-text-primary)]",
    "border border-[var(--card-border)]",
    "shadow-[var(--card-shadow-rest)]",
    "transition-[background-color,border-color,box-shadow]",
    "duration-[var(--motion-transition-fast)]",
    PAD[padding],
  ];

  if (interactive) {
    base.push(
      "text-left w-full cursor-pointer",
      "hover:shadow-[var(--card-shadow-hover)]",
      "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
      "focus-visible:border-[var(--color-border-focus)]",
    );
  }

  if (selected) {
    base.push("border-[var(--color-border-focus)]");
  }

  const classes = [...base, className ?? ""].join(" ");

  if (as === "button") {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={buttonProps.type ?? "button"}
        aria-pressed={selected || undefined}
        {...buttonProps}
        className={classes}
      >
        {children}
      </button>
    );
  }

  if (as === "a") {
    const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        aria-current={selected ? "page" : undefined}
        {...anchorProps}
        className={classes}
      >
        {children}
      </a>
    );
  }

  const Tag = as as "div" | "article" | "section";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
      className={classes}
    >
      {children}
    </Tag>
  );
});

export type CardHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
};

export function CardHeader({
  title,
  description,
  eyebrow,
  action,
}: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && (
          <div className="text-[var(--type-eyebrow-mono)] uppercase tracking-[var(--tracking-wider)] text-[var(--color-text-tertiary)] mb-1">
            {eyebrow}
          </div>
        )}
        <div className="text-[var(--type-heading-h4)] font-semibold tracking-[var(--tracking-tight)] text-[var(--color-text-primary)]">
          {title}
        </div>
        {description && (
          <div className="text-[var(--type-body-md)] text-[var(--color-text-tertiary)] leading-[var(--leading-snug)]">
            {description}
          </div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
