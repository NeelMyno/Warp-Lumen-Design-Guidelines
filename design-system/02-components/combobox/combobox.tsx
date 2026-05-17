"use client";

/**
 * @lumen/combobox — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Searchable single-select. Popover (Radix) + cmdk for the type-ahead list.
 * Portaled per hard rule 10. Trigger mirrors the Input visual.
 */
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type ComboboxOption = {
  value: string;
  label: string;
  hint?: string;
};

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  clearable?: boolean;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results",
  disabled,
  className,
  clearable,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        data-slot="combobox-trigger"
        aria-expanded={open}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 text-[length:var(--type-14)] text-[color:var(--text-primary)] outline-none",
          "shadow-[var(--shadow-input-lit-edge)]",
          "transition-[color,box-shadow,border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
          "hover:border-[var(--border-strong)]",
          "data-[state=open]:border-[var(--border-focus)] data-[state=open]:shadow-[var(--shadow-input-focus)]",
          "focus-visible:border-[var(--border-focus)] focus-visible:shadow-[var(--shadow-input-focus)]",
          "disabled:cursor-not-allowed disabled:bg-[var(--surface-input-disabled)] disabled:text-[color:var(--text-disabled)] disabled:border-[var(--border-input-disabled)]",
          className,
        )}
      >
        <span
          className={cn(
            "truncate text-left flex-1",
            !selected && "text-[color:var(--text-placeholder)]",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        {clearable && selected ? (
          <span
            role="button"
            tabIndex={0}
            aria-label="Clear"
            onClick={(e) => {
              e.stopPropagation();
              onChange?.("");
            }}
            className="opacity-70 hover:opacity-100"
          >
            <X size={14} aria-hidden />
          </span>
        ) : (
          <ChevronDown size={16} aria-hidden className="opacity-50 shrink-0" />
        )}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="combobox-content"
          align="start"
          sideOffset={4}
          className={cn(
            "bg-[var(--surface-popover)] text-[color:var(--text-primary)] z-[var(--z-overlay)] w-(--radix-popover-trigger-width) min-w-[200px] origin-(--radix-popover-content-transform-origin) rounded-[var(--radius-lg)] border border-[var(--border-default)] shadow-[var(--shadow-popover)] outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          )}
        >
          <CommandPrimitive>
            <div className="flex items-center gap-2 px-3 h-10 border-b border-[var(--border-hairline)]">
              <CommandPrimitive.Input
                placeholder={searchPlaceholder}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[length:var(--type-14)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)]"
              />
            </div>
            <CommandPrimitive.List className="max-h-[280px] overflow-y-auto p-1">
              <CommandPrimitive.Empty className="px-3 py-4 text-center text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
                {emptyMessage}
              </CommandPrimitive.Empty>
              {options.map((opt) => (
                <CommandPrimitive.Item
                  key={opt.value}
                  value={`${opt.label} ${opt.hint ?? ""}`}
                  onSelect={() => {
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-xs)] text-[length:var(--type-13)] cursor-pointer data-[selected=true]:bg-[var(--surface-tint-accent)] data-[selected=true]:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]"
                >
                  <Check
                    size={14}
                    aria-hidden
                    className={cn("shrink-0", opt.value === value ? "opacity-100" : "opacity-0")}
                  />
                  <span className="flex-1 truncate">{opt.label}</span>
                  {opt.hint && (
                    <span className="text-[color:var(--text-tertiary)] text-[length:var(--type-11)] shrink-0">{opt.hint}</span>
                  )}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
