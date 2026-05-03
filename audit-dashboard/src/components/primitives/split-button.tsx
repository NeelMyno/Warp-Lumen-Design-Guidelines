/**
 * v0.9 — SplitButton (primary action + dropdown caret)
 * ----------------------------------------------------------------------------
 * The primary action is a full-width Button on the left; the dropdown trigger
 * is a square IconButton on the right with a hairline divider. Both halves
 * share intent + size + shape.
 *
 * Use for actions with a default + close-cousin alternates:
 *   "Quote → [Quote | Quote with AI | Quote + book]"
 *   "Save → [Save | Save & continue | Save as draft]"
 *
 * The dropdown menu itself is a separate concern — wire whatever menu component
 * you use (Radix DropdownMenu, cmdk popover, etc.) onto the trigger via
 * `onMenuOpenChange` or `asChild` patterns.
 */

import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button as LumenButton } from "./button";

type Intent = "primary" | "secondary" | "outline" | "ghost" | "danger" | "ai";
type Size = "sm" | "md" | "lg" | "xl";

export type SplitButtonProps = {
  /** Label of the primary action half. */
  children: ReactNode;
  intent?: Intent;
  size?: Size;
  /** Click handler for the primary action half. */
  onAction?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  /** Click handler for the dropdown trigger. */
  onMenuOpen?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  /** Required — the menu trigger needs an accessible name for screen readers. */
  menuLabel: string;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  className?: string;
};

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  function SplitButton(
    { children, intent = "primary", size = "md", onAction, onMenuOpen, menuLabel, loading, disabled, leadingIcon, className },
    ref,
  ) {
    return (
      <div ref={ref} role="group" className={cn("lumen-split-button", className)}>
        <LumenButton
          intent={intent}
          size={size}
          loading={loading}
          disabled={disabled}
          onClick={onAction}
          leadingIcon={leadingIcon}
        >
          {children}
        </LumenButton>
        <LumenButton
          intent={intent}
          size={size}
          aria-label={menuLabel}
          aria-haspopup="menu"
          disabled={disabled || loading}
          onClick={onMenuOpen}
          className="lumen-icon-button"
        >
          <ChevronDown aria-hidden />
        </LumenButton>
      </div>
    );
  },
);
