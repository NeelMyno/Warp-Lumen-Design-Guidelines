"use client";

/**
 * @lumen/command-palette — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * ⌘K palette built on cmdk inside a Radix Dialog. Glass-strong shell, search-
 * shaped input, grouped results, kbd hints in footer.
 *
 * Two usage modes:
 *   1. Sugar — pass `items` + each handles its own onSelect.
 *   2. Composition — render <Command>/<Command.Input>/<Command.List>/etc. as children.
 */
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { Search, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  label: string;
  hint?: string;
  group?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
};

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="lumen-kbd inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-[var(--radius-xs)] border border-[var(--border-hairline)] bg-[var(--surface-sunken)] text-[length:var(--type-10)] text-[color:var(--text-tertiary)] font-medium lumen-mono">
      {children}
    </span>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = "Search commands…",
  emptyMessage = "No results",
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items?: CommandItem[];
  placeholder?: string;
  emptyMessage?: string;
  children?: React.ReactNode;
}) {
  /* Group items if items prop is passed; otherwise consumer composes children. */
  const grouped = React.useMemo(() => {
    if (!items) return null;
    const map = new Map<string, CommandItem[]>();
    for (const it of items) {
      const g = it.group ?? "Commands";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(it);
    }
    return Array.from(map.entries());
  }, [items]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[var(--z-modal)] bg-[var(--surface-scrim)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "lumen-glass-strong",
            "fixed left-1/2 top-[18%] -translate-x-1/2",
            "z-[var(--z-modal)] w-full max-w-xl",
            "rounded-[var(--radius-lg)] border border-[var(--border-default)] shadow-[var(--shadow-modal)]",
            "outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          )}
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <CommandPrimitive
            label="Command palette"
            className="bg-transparent text-[color:var(--text-primary)]"
          >
            {/* Search row */}
            <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border-hairline)]">
              <Search size={16} aria-hidden className="text-[color:var(--text-tertiary)] shrink-0" />
              <CommandPrimitive.Input
                placeholder={placeholder}
                className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[length:var(--type-14)] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)]"
              />
              <Kbd>esc</Kbd>
            </div>

            {/* Results */}
            <CommandPrimitive.List
              className="max-h-[420px] overflow-y-auto p-2"
              aria-label="Search results"
            >
              <CommandPrimitive.Empty className="px-3 py-8 text-center text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
                {emptyMessage}
              </CommandPrimitive.Empty>
              {grouped
                ? grouped.map(([group, gs]) => (
                    <CommandPrimitive.Group
                      key={group}
                      heading={group}
                      className="mb-2 last:mb-0 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:lumen-mono-cap [&_[cmdk-group-heading]]:text-[color:var(--text-tertiary)] [&_[cmdk-group-heading]]:text-[length:var(--type-10)] [&_[cmdk-group-heading]]:tracking-[var(--tracking-wider)]"
                    >
                      {gs.map((it) => (
                        <CommandPrimitive.Item
                          key={it.id}
                          value={`${it.label} ${it.hint ?? ""}`}
                          onSelect={() => {
                            it.onSelect?.();
                            onOpenChange(false);
                          }}
                          className="flex items-center gap-3 w-full px-3 h-10 rounded-[var(--radius-md)] cursor-pointer transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--easing-standard)] data-[selected=true]:bg-[var(--surface-tint-accent)] data-[selected=true]:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)]"
                        >
                          {it.icon && (
                            <span
                              aria-hidden
                              className="inline-flex h-6 w-6 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[color:var(--text-secondary)] shrink-0"
                            >
                              {it.icon}
                            </span>
                          )}
                          <span className="flex flex-col min-w-0 gap-[1px] text-left flex-1">
                            <span className="text-[length:var(--type-13)] text-[color:var(--text-primary)] truncate">
                              {it.label}
                            </span>
                            {it.hint && (
                              <span className="text-[length:var(--type-11)] text-[color:var(--text-tertiary)] truncate">
                                {it.hint}
                              </span>
                            )}
                          </span>
                          <ArrowRight
                            size={13}
                            aria-hidden
                            className="ml-auto text-[color:var(--text-tertiary)] shrink-0"
                          />
                        </CommandPrimitive.Item>
                      ))}
                    </CommandPrimitive.Group>
                  ))
                : children}
            </CommandPrimitive.List>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 h-10 border-t border-[var(--border-hairline)] text-[length:var(--type-11)] text-[color:var(--text-tertiary)]">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <Kbd>↑</Kbd>
                  <Kbd>↓</Kbd>
                  <span>navigate</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Kbd>↵</Kbd>
                  <span>select</span>
                </span>
              </div>
            </div>
          </CommandPrimitive>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { CommandPrimitive as Command };
