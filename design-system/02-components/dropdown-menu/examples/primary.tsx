// Lumen DropdownMenu — Web React example
// Wraps Radix DropdownMenu for a) portaled positioning (hard rule 10),
// b) focus trap, c) type-ahead, d) Escape / outside-click dismiss.
//
// Variants:
// - <DropdownMenu trigger="click">  default. Click / Enter / Space / ArrowDown opens.
// - <DropdownMenu trigger="hover">  top-nav style. 100 ms enter, 200 ms leave.
// - <DropdownMenu trigger="context"> right-click / long-press. Anchored to pointer.

"use client";

import * as DM from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export const DropdownMenu = DM.Root;
export const DropdownMenuTrigger = DM.Trigger;
export const DropdownMenuGroup = DM.Group;
export const DropdownMenuPortal = DM.Portal;
export const DropdownMenuSub = DM.Sub;
export const DropdownMenuRadioGroup = DM.RadioGroup;

const popoverChrome = [
  "z-[var(--z-popover,60)] min-w-[14rem] max-w-[20rem]",
  "rounded-[var(--radius-popover)] border border-[var(--color-border-hairline)]",
  "bg-[var(--color-surface-popover)] shadow-[var(--shadow-popover)]",
  "p-[var(--space-stack-xs)]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
  "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
  "duration-[var(--motion-duration-fast)]",
  "motion-reduce:animate-none",
].join(" ");

const itemBase = [
  "relative flex items-center gap-[var(--space-inline-sm)]",
  "px-[var(--space-inset-md)] h-8 rounded-[var(--radius-control-sm)]",
  "text-[var(--type-label-md)] text-[var(--color-text-primary)]",
  "outline-none cursor-default select-none",
  "data-[highlighted]:bg-[var(--color-action-ghost-bg-hover)]",
  "data-[disabled]:text-[var(--color-text-tertiary)] data-[disabled]:pointer-events-none",
  "transition-colors duration-[var(--motion-duration-fast)]",
].join(" ");

const itemDanger = [
  "text-[var(--color-text-error)]",
  "data-[highlighted]:bg-[var(--color-action-danger-soft-bg-hover)]",
  "data-[highlighted]:text-[var(--color-action-danger-soft-fg)]",
].join(" ");

export function DropdownMenuContent({
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
}: {
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}) {
  return (
    <DM.Portal>
      <DM.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        loop
        collisionPadding={8}
        className={popoverChrome}
      >
        {children}
      </DM.Content>
    </DM.Portal>
  );
}

export function DropdownMenuItem({
  children,
  shortcut,
  danger,
  disabled,
  onSelect,
}: {
  children: ReactNode;
  shortcut?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}) {
  return (
    <DM.Item
      className={[itemBase, danger ? itemDanger : ""].join(" ")}
      disabled={disabled}
      onSelect={onSelect}
    >
      <span className="flex-1 truncate">{children}</span>
      {shortcut && (
        <span className="ml-auto inline-flex items-center gap-1 text-[var(--type-micro)] text-[var(--color-text-tertiary)]">
          {shortcut}
        </span>
      )}
    </DM.Item>
  );
}

export function DropdownMenuCheckboxItem({
  children,
  checked,
  onCheckedChange,
}: {
  children: ReactNode;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <DM.CheckboxItem checked={checked} onCheckedChange={onCheckedChange} className={[itemBase, "pl-7"].join(" ")}>
      <DM.ItemIndicator className="absolute left-2 inline-flex">
        <Check size={12} aria-hidden />
      </DM.ItemIndicator>
      <span className="truncate">{children}</span>
    </DM.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({ children, value }: { children: ReactNode; value: string }) {
  return (
    <DM.RadioItem value={value} className={[itemBase, "pl-7"].join(" ")}>
      <DM.ItemIndicator className="absolute left-2 inline-flex">
        <span className="size-1.5 rounded-full bg-current" aria-hidden />
      </DM.ItemIndicator>
      <span className="truncate">{children}</span>
    </DM.RadioItem>
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <DM.Label className={[
      "px-[var(--space-inset-md)] pt-2 pb-1 select-none",
      "text-[var(--type-micro)] uppercase tracking-wider",
      "text-[var(--color-text-tertiary)] font-medium",
    ].join(" ")}>
      {children}
    </DM.Label>
  );
}

export function DropdownMenuSeparator() {
  return <DM.Separator className="my-1 h-px bg-[var(--color-border-hairline)]" />;
}

export function DropdownMenuSubTrigger({ children }: { children: ReactNode }) {
  return (
    <DM.SubTrigger className={[itemBase, "data-[state=open]:bg-[var(--color-action-ghost-bg-hover)]"].join(" ")}>
      <span className="flex-1 truncate">{children}</span>
      <ChevronRight size={12} aria-hidden className="ml-auto text-[var(--color-text-tertiary)]" />
    </DM.SubTrigger>
  );
}

export function DropdownMenuSubContent({ children }: { children: ReactNode }) {
  return (
    <DM.Portal>
      <DM.SubContent sideOffset={4} className={popoverChrome}>
        {children}
      </DM.SubContent>
    </DM.Portal>
  );
}
