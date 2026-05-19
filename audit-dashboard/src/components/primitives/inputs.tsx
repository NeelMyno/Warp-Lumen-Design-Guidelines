"use client";

import { useState, useRef, useEffect, ReactNode, KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";
import { Search as SearchIcon, ChevronDown, ChevronLeft, ChevronRight, Plus, X, Minus } from "./icon";

import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

/* v0.6 — Every text-entry control wraps in .lumen-field. The shell owns focus,
 * border, bg, lit-edge, error/disabled state. The inner element renders bare
 * (no chrome). Slots (leading, trailing, addon) are siblings inside the shell.
 * The previous INPUT_BASE constant + 3-parallel-systems setup is gone.
 *
 * For composite controls (NumberInput stepper, Combobox popover, Tags chip-row,
 * OTP cell-row), the shell still owns focus; the inner pattern just composes
 * different children inside it.
 */

/* ─────────────────────────  TEXT INPUT  ───────────────────────── */
/* Bare TextInput — used standalone (no Field wrapper). Renders shadcn Input,
 * which itself adopts .lumen-field shell semantics. */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <ShadcnInput type="text" {...props} className={cn(props.className)} />;
}

/* ─────────────────────────  TEXTAREA  ───────────────────────── */
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <ShadcnTextarea rows={4} {...props} className={cn(props.className)} />;
}

/* ─────────────────────────  SEARCH INPUT  ───────────────────────── */
export function SearchInput({
  placeholder = "Search…",
  value,
  onChange,
  shortcut,
  size = "md",
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  shortcut?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className="lumen-field"
      data-size={size === "md" ? undefined : size}
    >
      <span data-slot="leading" aria-hidden>
        <SearchIcon size={14} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
      {shortcut && (
        <span data-slot="trailing">
          <kbd className="lumen-kbd">{shortcut}</kbd>
        </span>
      )}
    </div>
  );
}

/* ─────────────────────────  RADIO  ─────────────────────────
 * Single radio with label + optional description. Composes the .lumen-radio
 * visual primitive over a real <input type="radio"> (sr-only) so screen
 * readers get native semantics. */
export function Radio({
  checked,
  onChange,
  label,
  description,
  disabled,
  name,
  value,
}: {
  checked?: boolean;
  onChange?: () => void;
  label: string;
  description?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
}) {
  return (
    <label className={cn(
      "flex items-start gap-inline-sm cursor-pointer select-none",
      disabled && "opacity-50 cursor-not-allowed",
    )}>
      {/* v0.12.7 — switch to uncontrolled mode when no onChange handler is
          supplied. Otherwise React warns ("checked prop without onChange")
          for showcase / static usages on /library that set `checked` to
          display a state. Radios can't take `readOnly`, so the only options
          are (a) a no-op handler — which silently absorbs keyboard clicks
          — or (b) defaultChecked. (b) is correct: a static demo without a
          state setter has no business behaving like a controlled input. */}
      <input
        type="radio"
        {...(onChange
          ? { checked, onChange }
          : { defaultChecked: checked })}
        disabled={disabled}
        name={name}
        value={value}
        className="peer sr-only"
        aria-checked={checked}
      />
      <span
        className="lumen-radio mt-[1px]"
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "true" : undefined}
        aria-hidden
      />
      <span className="min-w-0 leading-snug">
        <span className="block text-body-sm text-[color:var(--text-primary)]">{label}</span>
        {description && (
          <span className="block text-caption text-[color:var(--text-tertiary)] mt-1">{description}</span>
        )}
      </span>
    </label>
  );
}

export function RadioGroup({ children }: { children: ReactNode }) {
  return <div role="radiogroup" className="flex flex-col gap-stack-sm">{children}</div>;
}

/* ─────────────────────────  SELECT (native, .lumen-field shell)  ───────────────────────── */
export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  size = "md",
  disabled,
}: {
  value?: string;
  onChange?: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  return (
    <div
      className="lumen-field"
      data-size={size === "md" ? undefined : size}
      data-disabled={disabled ? "true" : undefined}
      style={{ cursor: "pointer" }}
    >
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="appearance-none cursor-pointer pr-6"
      >
        {!value && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span data-slot="trailing" aria-hidden>
        <ChevronDown size={14} />
      </span>
    </div>
  );
}

/* ─────────────────────────  COMBOBOX  ─────────────────────────
   v0.12.4 — dropdown portaled to document.body. Pre-v0.12.4 the dropdown
   was an inline `absolute` panel relative to the Combobox wrapper, which
   meant any ancestor with `overflow: hidden` clipped it. User screenshot
   2026-05-06 of /library Combobox-in-Showcase caught this: the dropdown
   only showed its top edge through the Showcase frame's overflow-hidden.
   The same trap applies inside <Card padding="none"> (which gained
   overflow-hidden in v0.12.1 per ADR 0021), inside any flex/grid cell
   with overflow-clip, etc.

   Fix: render the dropdown via createPortal to document.body, with
   `position: fixed` anchored to the input's getBoundingClientRect(). The
   portal escapes every ancestor's overflow context. Position is recomputed
   on scroll + resize so the dropdown tracks the input. The outside-click
   handler now checks both the wrapper AND the portaled list, since the
   portaled list isn't inside `ref.current` anymore. */
export function Combobox({
  options,
  placeholder = "Type or pick…",
  value,
  onChange,
}: {
  options: string[];
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const [internal, setInternal] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* v0.12.4 — outside-click dismiss now also exempts the portaled list,
     since clicks on list options would otherwise close the dropdown
     before pick() can fire. */
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* v0.12.4 — track the input's viewport rect while the dropdown is open
     so the portaled list stays anchored on scroll + resize. The capture
     phase listener catches scroll events on every ancestor, not just the
     window — needed because the input can sit inside a scrolling pane
     that itself is nested inside the document. */
  useEffect(() => {
    if (!open || !ref.current) return;
    const update = () => setRect(ref.current!.getBoundingClientRect());
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  const filtered = options.filter((o) => o.toLowerCase().includes(internal.toLowerCase())).slice(0, 8);

  function pick(v: string) {
    setInternal(v);
    onChange?.(v);
    setOpen(false);
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") { setHighlight((i) => Math.min(i + 1, filtered.length - 1)); setOpen(true); }
    if (e.key === "ArrowUp") { setHighlight((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && filtered[highlight]) { e.preventDefault(); pick(filtered[highlight]); }
    if (e.key === "Escape") { setOpen(false); }
  }

  return (
    <div ref={ref} className="relative w-full">
      <div className="lumen-field">
        <input
          value={internal}
          onChange={(e) => { setInternal(e.target.value); setOpen(true); setHighlight(0); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        <span
          data-slot="trailing"
          aria-hidden
          className={cn("transition-transform", open && "rotate-180")}
        >
          <ChevronDown size={14} />
        </span>
      </div>
      {open && filtered.length > 0 && rect && typeof document !== "undefined" && createPortal(
        <div
          ref={listRef}
          role="listbox"
          style={{
            position: "fixed",
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
            zIndex: "var(--z-overlay)" as unknown as number,
          }}
          className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] overflow-hidden p-1"
        >
          {filtered.map((o, i) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => pick(o)}
              className={cn(
                "w-full text-left px-3 py-[var(--space-1_5)] rounded-[var(--radius-sm)] text-body-sm",
                i === highlight ? "bg-[var(--surface-tint-accent)] text-[color:var(--text-primary)]" : "text-[color:var(--text-secondary)]",
              )}
            >
              {o}
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

/* ─────────────────────────  NUMBER INPUT  ───────────────────────── */
/* Stepper-flanked numeric. Uses .lumen-field shell with custom layout —
 * minus button, value (mono), plus button + optional unit suffix. */
export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  /* v0.13.2 — accept id + aria-* so the parent Field's cloneElement can wire
     the accessible name to the inner <input>. Without this NumberInput's
     internal <input type="number"> stayed nameless even inside a labeled Field. */
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className="lumen-field" data-mono="true" data-padding="none">
      <button
        type="button"
        data-interactive
        onClick={dec}
        aria-label={ariaLabel ? `Decrement ${ariaLabel}` : "Decrement"}
        className="px-3 h-full text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors flex items-center"
        style={{ pointerEvents: "auto" }}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        id={id}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={!ariaLabelledBy ? ariaLabel : undefined}
        aria-labelledby={ariaLabelledBy}
        className="text-center"
        min={min}
        max={max}
        step={step}
      />
      {suffix && <span data-slot="addon">{suffix}</span>}
      <button
        type="button"
        data-interactive
        onClick={inc}
        aria-label="Increment"
        className="px-3 h-full text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors flex items-center"
        style={{ pointerEvents: "auto" }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

/* ─────────────────────────  PASSWORD INPUT  ───────────────────────── */
export function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="lumen-field" data-mono="true">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        autoComplete="current-password"
      />
      <span data-slot="trailing">
        <button
          type="button"
          data-interactive
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
          className="text-eyebrow-mono px-[var(--space-1_5)] py-1 rounded-[var(--radius-xs)] text-[color:var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors"
        >
          {show ? "Hide" : "Show"}
        </button>
      </span>
    </div>
  );
}

export function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  const segs = [0, 1, 2, 3];
  const colors = ["var(--lumen-red-5)", "var(--lumen-amber-5)", "var(--lumen-cream-5)", "var(--lumen-accent-6)"];
  const labels = ["Too weak", "Weak", "Decent", "Strong"];
  return (
    <div className="flex flex-col gap-[var(--space-1_5)]">
      <div className="flex gap-1">
        {segs.map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < score ? colors[Math.max(0, score - 1)] : "var(--surface-sunken)" }}
          />
        ))}
      </div>
      <div className="text-overline text-[color:var(--text-tertiary)]">
        {value ? labels[Math.max(0, score - 1)] : "Enter a password"}
      </div>
    </div>
  );
}
function scorePassword(v: string) {
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v)) s++;
  return s;
}

/* ─────────────────────────  OTP INPUT  ─────────────────────────
 * Cell-row pattern. Each cell is its own .lumen-field shell so each cell
 * has independent focus, while the row itself stays a flat layout. */
export function OtpInput({ length = 6, value, onChange }: { length?: number; value?: string; onChange?: (v: string) => void }) {
  const [internal, setInternal] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const cells = value ? value.padEnd(length, "").split("").slice(0, length) : internal;

  function set(i: number, v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    const next = [...cells];
    next[i] = clean;
    if (value === undefined) setInternal(next);
    onChange?.(next.join(""));
    if (clean && i < length - 1) refs.current[i + 1]?.focus();
  }
  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !cells[i] && i > 0) refs.current[i - 1]?.focus();
  }
  return (
    <div className="inline-flex gap-[var(--space-1_5)]" role="group" aria-label="One-time passcode">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="lumen-field"
          data-mono="true"
          data-size="lg"
          data-padding="none"
          style={{ width: 40, justifyContent: "center" }}
        >
          <input
            ref={(el) => { refs.current[i] = el; }}
            inputMode="numeric"
            maxLength={1}
            value={cells[i] ?? ""}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            className="text-center text-[length:var(--type-18)]"
            aria-label={`OTP digit ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────  TAGS INPUT  ───────────────────────── */
export function TagsInput({
  value,
  onChange,
  placeholder = "Add tag…",
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  /* v0.13.2 — accept id + aria-* so parent Field's cloneElement can wire the
     accessible name down to the inner <input>. Without this, TagsInput inside
     a labeled Field shipped a nameless input. */
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  }
  return (
    <div
      className="lumen-field"
      data-variant="chips"
    >
      {value.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 h-6 px-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-caption text-[color:var(--text-secondary)]"
          style={{ pointerEvents: "auto" }}
        >
          {t}
          <button
            type="button"
            onClick={() => onChange(value.filter((x) => x !== t))}
            aria-label={`Remove ${t}`}
            className="opacity-60 hover:opacity-100"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        aria-label={!ariaLabelledBy ? (ariaLabel ?? "Add tag") : undefined}
        aria-labelledby={ariaLabelledBy}
        className="min-w-[80px]"
        style={{ width: "auto" }}
      />
    </div>
  );
}

/* ─────────────────────────  COLOR PICKER  ───────────────────────── */
export function ColorPicker({
  value,
  onChange,
  /* v0.13.1 R5-002 — retired legacy obsidian-mint #171A18 (v0.11 pre-recolor)
     in favour of the v0.12 neutral obsidian #0D0D0D. The picker's default
     swatch list otherwise mirrors the brand status palette + accent + neutral
     anchors so consumers see a realistic seven-color starter set. These are
     LITERAL display colors for a color-picker UI (the picker IS a way to
     choose any hex), so semantic tokens don't apply — but the legacy mint
     anchor was a stale color from the pre-v0.12 era. */
  swatches = ["#00FA8A", "#00D675", "#00B062", "#4592e8", "#F5B118", "#E5484D", "#9333ea", "#0D0D0D"],
}: {
  value: string;
  onChange: (v: string) => void;
  swatches?: string[];
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="lumen-field" data-mono="true" style={{ width: "auto", paddingInline: "var(--space-2)" }}>
        <span className="block h-5 w-5 rounded-[var(--radius-xs)] border border-[var(--border-default)] flex-shrink-0" style={{ background: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Pick a color"
          style={{ width: "100%", height: "100%" }}
        />
        <span className="text-caption text-[color:var(--text-secondary)]" style={{ pointerEvents: "none" }}>{value.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-1">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={cn(
              "h-6 w-6 rounded-full border transition-transform",
              value === c ? "border-[var(--lumen-accent-5)] scale-110" : "border-[var(--border-default)] hover:scale-110",
            )}
            style={{ background: c }}
            aria-label={`Set color to ${c}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  RANGE SLIDER (dual-handle bar)  ───────────────────────── */
export function RangeSlider({
  min = 0,
  max = 100,
  value,
  onChange,
  format = (v: number) => `${v}`,
  label = "Range",
}: {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (v: number) => string;
  /* v0.13.2 — accept a label prop so the two thumb inputs ship aria-label.
     Without this, screen readers announced both range-inputs as nameless. */
  label?: string;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="w-full">
      <div className="relative h-6 flex items-center">
        <div className="absolute inset-x-0 h-1 rounded-full bg-[var(--surface-sunken)]" />
        <div
          className="absolute h-1 rounded-full bg-[var(--lumen-accent-5)]"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
          aria-label={`${label}: minimum (${format(value[0])})`}
          className="absolute inset-0 w-full bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--border-strong)] [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-grab"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
          aria-label={`${label}: maximum (${format(value[1])})`}
          className="absolute inset-0 w-full bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--border-strong)] [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-grab"
        />
      </div>
      <div className="mt-1 flex justify-between text-overline text-[color:var(--text-tertiary)]">
        <span>{format(value[0])}</span>
        <span>{format(value[1])}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────  FILE DROPZONE  ───────────────────────── */
export function FileDropzone({
  onFiles,
  hint = "PDF, CSV, XLSX up to 25 MB",
}: {
  onFiles?: (files: File[]) => void;
  hint?: string;
}) {
  const [over, setOver] = useState(false);
  const [picked, setPicked] = useState<File[]>([]);
  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files);
        setPicked(files);
        onFiles?.(files);
      }}
      className={cn(
        "block w-full rounded-[var(--radius-lg)] border border-dashed cursor-pointer text-center px-4 py-8",
        "transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        over
          ? "border-[var(--lumen-accent-5)] bg-[var(--lumen-accent-a08)]"
          : "border-[var(--border-default)] hover:border-[var(--border-strong)]",
      )}
    >
      <input
        type="file"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          setPicked(files);
          onFiles?.(files);
        }}
        className="sr-only"
      />
      <div className="flex flex-col items-center gap-2">
        <span className="h-10 w-10 rounded-full bg-[var(--surface-sunken)] inline-flex items-center justify-center text-[color:var(--text-secondary)]">
          <Plus size={18} />
        </span>
        <div className="text-body-sm font-medium text-[color:var(--text-primary)]">
          Drop files here or <span className="text-[color:var(--text-accent)] underline underline-offset-2">browse</span>
        </div>
        <div className="text-caption text-[color:var(--text-tertiary)]">{hint}</div>
      </div>
      {picked.length > 0 && (
        <div className="mt-4 text-left flex flex-col gap-1">
          {picked.map((f) => (
            <div key={f.name} className="flex items-center justify-between gap-3 px-3 py-[var(--space-1_5)] rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]">
              <span className="text-caption text-[color:var(--text-secondary)] truncate">{f.name}</span>
              <span className="text-overline text-[color:var(--text-tertiary)]">{(f.size / 1024).toFixed(1)} KB</span>
            </div>
          ))}
        </div>
      )}
    </label>
  );
}

/* ─────────────────────────  DATE PICKER (visual)  ───────────────────────── */
export function DatePicker({ value }: { value?: string }) {
  return (
    <div className="lumen-field" data-mono="true" style={{ width: "auto" }}>
      <span data-slot="leading" aria-hidden>
        <Calendar size={14} strokeWidth={1.5} aria-hidden focusable={false} />
      </span>
      <input
        readOnly
        value={value ?? ""}
        placeholder="Select date"
      />
    </div>
  );
}

/**
 * Calendar popover showcase.
 *
 * v0.12.9 — went dynamic. Prior versions hardcoded "May 2026" with a
 * 2-cell prefix offset (`Array.from({length:35}, (_,i) => i-2)`) and
 * `isToday = 12`. The offset and "today" marker only happened to align
 * with whatever month the showcase was authored against; the live R3
 * audit caught day "1" rendering in the Thursday column when May 1,
 * 2026 was actually a Friday, plus the today ring sitting on May 12
 * instead of today. Pinned-snapshot showcases drift quietly — dynamic
 * is the only correct contract for a date primitive that documents
 * "this is what a calendar should look like."
 *
 * The render now computes month/year/today from `new Date()` (default)
 * or from optional `today` + `selected` props for callers that need a
 * pinned screenshot. The week is Monday-start (matches the column
 * labels). 42 cells (6 weeks) covers the worst-case month — a 31-day
 * month starting on Sunday — without a ragged final row.
 */
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DatePickerCalendar({
  today: todayProp,
  selected: selectedProp,
}: {
  today?: Date;
  selected?: Date;
} = {}) {
  const today = todayProp ?? new Date();
  const selected = selectedProp ?? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const year = today.getFullYear();
  const month = today.getMonth();
  // Mon-start day-of-week index for the 1st of the month (0=Mon..6=Sun)
  const monStartOffset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // 42 cells = 6 rows × 7 cols so every month fits without a ragged tail
  const cells = Array.from({ length: 42 }, (_, i) => i - monStartOffset + 1);
  const isSameMonth = (d: Date) =>
    d.getFullYear() === year && d.getMonth() === month;
  const todayDay = isSameMonth(today) ? today.getDate() : -1;
  const selectedDay = isSameMonth(selected) ? selected.getDate() : -1;
  return (
    <div className="inline-block rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] p-3 w-[260px]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-body-sm font-semibold tracking-tight">
          {MONTH_LABELS[month]} {year}
        </span>
        {/* v0.12.1 — month-nav glyphs swapped from literal `‹` / `›` to the
            ChevronLeft / ChevronRight icon components, matching the v0.11.15
            Pagination cleanup. The literal arrow chars optical-shrink in
            Satoshi to ~6 px wide and read as a thin tail rather than an
            affordance; the icon components compose at 12 px stroke-1.5,
            consistent with the rest of the navigation chrome. */}
        <div className="flex gap-1 text-[color:var(--text-tertiary)]">
          <button className="h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)]" aria-label="Previous month">
            <ChevronLeft size={12} />
          </button>
          <button className="h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)]" aria-label="Next month">
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 mb-2">
        {days.map((d) => (
          <span key={d} className="text-center text-overline text-[color:var(--text-tertiary)]">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const day = d > 0 && d <= daysInMonth ? d : null;
          /* v0.13.1 R5-007 — empty cells (gutter before month-start / after
             month-end) used to render as <button disabled className="opacity-0">,
             which left 12 nameless disabled buttons in the DOM per calendar
             instance. Accessibility scanners flagged them as interactive
             targets with no label; even though `disabled` removes them from
             the tab order, they pollute the a11y tree. Rendering a passive
             aria-hidden <span> keeps the grid layout but stays out of the
             accessibility tree entirely. */
          if (!day) {
            return <span key={i} className="h-7" aria-hidden />;
          }
          const isToday = day === todayDay;
          const isSel = day === selectedDay;
          return (
            <button
              key={i}
              aria-label={`${MONTH_LABELS[month]} ${day}, ${year}${isSel ? " (selected)" : ""}${isToday ? " (today)" : ""}`}
              className={cn(
                "h-7 rounded-[var(--radius-sm)] text-caption lumen-mono transition-colors",
                isSel && "bg-[var(--lumen-accent-4)] text-[color:var(--lumen-accent-fg)] font-semibold",
                isToday && !isSel && "border border-[var(--border-strong)]",
                !isSel && !isToday && "hover:bg-[var(--surface-sunken)] text-[color:var(--text-secondary)]",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────  TIME PICKER  ───────────────────────── */
export function TimePicker() {
  return (
    <div className="lumen-field" data-mono="true" style={{ width: "auto", paddingInline: "var(--space-2)" }}>
      <input
        defaultValue="14"
        maxLength={2}
        className="w-7 text-center"
        aria-label="Hours"
      />
      <span className="text-[color:var(--text-tertiary)]" style={{ pointerEvents: "none" }}>:</span>
      <input
        defaultValue="30"
        maxLength={2}
        className="w-7 text-center"
        aria-label="Minutes"
      />
      <div className="ml-1 inline-flex rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] p-px" style={{ pointerEvents: "auto" }}>
        <button data-interactive className="text-overline px-[var(--space-1_5)] py-[2px] rounded-[var(--radius-xs)] bg-[var(--surface-raised)] text-[color:var(--text-primary)] shadow-[var(--shadow-xs)]">am</button>
        <button data-interactive className="text-overline px-[var(--space-1_5)] py-[2px] rounded-[var(--radius-xs)] text-[color:var(--text-tertiary)]">pm</button>
      </div>
    </div>
  );
}

/* ─────────────────────────  SEGMENTED CONTROL  ───────────────────────── */
export function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="inline-flex items-center p-px rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "h-7 px-3 rounded-[var(--radius-sm)] text-caption font-medium tracking-tight transition-[background,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
            value === o.value
              ? "bg-[var(--surface-raised)] text-[color:var(--text-primary)] shadow-[var(--shadow-xs)]"
              : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)]",
          )}
          aria-pressed={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

