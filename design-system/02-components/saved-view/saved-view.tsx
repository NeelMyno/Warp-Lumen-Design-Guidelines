"use client";

/**
 * @lumen/saved-view — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Named query state with diff indicator + share. Built atop the .lumen-btn
 * + DropdownMenu primitives. Dirty state surfaces as a lime dot on the trigger.
 */
import * as React from "react";
import { ChevronDown, Save, Plus, Share2, Trash2, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

export type SavedViewItem<TQuery = unknown> = {
  id: string;
  name: string;
  query: TQuery;
};

export type SavedViewProps<TQuery = unknown> = {
  views: SavedViewItem<TQuery>[];
  currentView?: string | null;
  isDirty?: boolean;
  onSelect?: (id: string) => void;
  onSave?: () => void;
  onSaveAs?: (name: string) => void;
  onRename?: (id: string, name: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  emptyLabel?: string;
  className?: string;
};

export function SavedView<TQuery = unknown>({
  views,
  currentView,
  isDirty,
  onSelect,
  onSave,
  onSaveAs,
  onDelete,
  onShare,
  emptyLabel = "No saved views",
  className,
}: SavedViewProps<TQuery>) {
  const [open, setOpen] = React.useState(false);
  const [saveAsOpen, setSaveAsOpen] = React.useState(false);
  const [draftName, setDraftName] = React.useState("");
  const current = views.find((v) => v.id === currentView);

  const label = current?.name ?? emptyLabel;

  return (
    <div data-slot="saved-view" className={cn("inline-flex items-center gap-1", className)}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Saved views, current: ${label}${isDirty ? ", unsaved changes" : ""}`}
          className="lumen-btn lumen-btn-ghost lumen-btn-sm inline-flex items-center gap-2"
        >
          <span className="truncate max-w-[180px]">{label}</span>
          {isDirty && (
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-[var(--color-accent)] shrink-0"
              title="Unsaved changes"
            />
          )}
          <ChevronDown size={14} aria-hidden className="opacity-60" />
        </button>
        {open && (
          <div
            role="menu"
            className="absolute z-[var(--z-overlay)] mt-1 min-w-[240px] rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] p-1"
            onMouseLeave={() => setOpen(false)}
          >
            <div className="px-2 pt-2 pb-1 lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
              Saved views
            </div>
            {views.length === 0 && (
              <div className="px-2 py-2 text-[length:var(--type-13)] text-[color:var(--text-tertiary)]">
                {emptyLabel}
              </div>
            )}
            {views.map((v) => (
              <button
                key={v.id}
                role="menuitem"
                onClick={() => {
                  onSelect?.(v.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-xs)] text-[length:var(--type-13)] text-left hover:bg-[var(--surface-sunken)]",
                  v.id === currentView && "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)]",
                )}
              >
                <span className="truncate">{v.name}</span>
                {v.id === currentView && (
                  <div className="flex items-center gap-1 shrink-0">
                    {onShare && (
                      <span
                        role="button"
                        aria-label={`Share ${v.name}`}
                        className="p-1 hover:bg-[var(--surface-sunken)] rounded-[var(--radius-xs)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onShare?.(v.id);
                        }}
                      >
                        <Share2 size={12} aria-hidden />
                      </span>
                    )}
                    {onDelete && (
                      <span
                        role="button"
                        aria-label={`Delete ${v.name}`}
                        className="p-1 hover:bg-[var(--surface-sunken)] rounded-[var(--radius-xs)] text-[color:var(--lumen-red-5)]"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(v.id);
                        }}
                      >
                        <Trash2 size={12} aria-hidden />
                      </span>
                    )}
                  </div>
                )}
              </button>
            ))}

            <hr className="my-1 -mx-1 border-[var(--border-hairline)]" />
            {isDirty && current && (
              <button
                role="menuitem"
                onClick={() => {
                  onSave?.();
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-xs)] text-[length:var(--type-13)] text-left hover:bg-[var(--surface-sunken)]"
              >
                <Save size={12} aria-hidden className="shrink-0" />
                Save changes to {current.name}
              </button>
            )}
            <button
              role="menuitem"
              onClick={() => {
                setSaveAsOpen(true);
                setOpen(false);
                setDraftName("");
              }}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-xs)] text-[length:var(--type-13)] text-left hover:bg-[var(--surface-sunken)]"
            >
              <Plus size={12} aria-hidden className="shrink-0" />
              Save as new view
            </button>
          </div>
        )}
      </div>

      {saveAsOpen && (
        <div
          role="dialog"
          aria-modal
          aria-label="Save as new view"
          className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center bg-[var(--surface-scrim)]"
          onClick={() => setSaveAsOpen(false)}
        >
          <div
            className="bg-[var(--surface-popover)] rounded-[var(--radius-xl)] border border-[var(--border-default)] shadow-[var(--shadow-modal)] p-6 w-full max-w-sm space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-semibold text-[length:var(--type-16)] flex items-center gap-2">
              <Pencil size={14} aria-hidden /> Save as new view
            </h3>
            <input
              autoFocus
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="View name"
              className="w-full h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-input-rest)] px-3 text-[length:var(--type-14)] outline-none focus-visible:border-[var(--border-focus)]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSaveAsOpen(false)}
                className="lumen-btn lumen-btn-ghost lumen-btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!draftName.trim()}
                onClick={() => {
                  onSaveAs?.(draftName.trim());
                  setSaveAsOpen(false);
                }}
                className="lumen-btn lumen-btn-primary lumen-btn-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
