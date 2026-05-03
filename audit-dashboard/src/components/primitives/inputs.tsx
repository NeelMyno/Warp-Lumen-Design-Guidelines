"use client";

import { useState, useRef, useEffect, ReactNode, ChangeEvent, KeyboardEvent } from "react";
import { Search as SearchIcon, ChevronDown, Plus, X, Check } from "./icon";

import { cn } from "@/lib/utils";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";

/* INPUT_BASE — Lumen's shared input chrome class. Used by composite controls
 * (SearchInput, NumberInput, Combobox, TagsInput, etc.) that build their own
 * input shell around a custom layout. The bare TextInput / Textarea use the
 * shadcn Input / Textarea directly.
 */
const INPUT_BASE = [
  "h-10 w-full px-3 rounded-[var(--radius-md)]",
  "bg-[var(--surface-raised)] text-[var(--text-primary)]",
  "border border-[var(--border-default)]",
  "text-[var(--type-14)] tracking-[var(--tracking-tight)]",
  "placeholder:text-[var(--text-tertiary)]",
  "transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
  "hover:border-[var(--border-strong)]",
  "focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)]",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

/* ─────────────────────────  TEXT INPUT (shadcn Input)  ───────────────────────── */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <ShadcnInput type="text" {...props} className={cn(props.className)} />;
}

/* ─────────────────────────  TEXTAREA (shadcn Textarea)  ───────────────────────── */
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <ShadcnTextarea rows={4} {...props} className={cn("min-h-[96px]", props.className)} />;
}

/* ─────────────────────────  SEARCH INPUT  ───────────────────────── */
export function SearchInput({
  placeholder = "Search…",
  value,
  onChange,
  shortcut,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  shortcut?: string;
}) {
  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none">
        <SearchIcon size={14} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[INPUT_BASE, "pl-9", shortcut ? "pr-14" : ""].join(" ")}
      />
      {shortcut && (
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 lumen-kbd">{shortcut}</span>
      )}
    </div>
  );
}

/* ─────────────────────────  RADIO  ───────────────────────── */
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
    <label className={["flex items-start gap-2.5 cursor-pointer select-none group", disabled ? "opacity-50 cursor-not-allowed" : ""].join(" ")}>
      <span className="relative inline-flex items-center justify-center mt-[1px] shrink-0">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          name={name}
          value={value}
          className="peer sr-only"
        />
        <span
          className={[
            "h-[18px] w-[18px] rounded-full",
            "border-[1.5px] border-[var(--border-default)]",
            "bg-[var(--surface-raised)]",
            "transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
            "group-hover:border-[var(--border-strong)]",
            "peer-checked:border-[var(--lumen-accent-5)] peer-checked:bg-[var(--lumen-accent-4)]",
            "peer-focus-visible:shadow-[var(--shadow-focus)]",
          ].join(" ")}
        />
        <span className={["absolute h-2 w-2 rounded-full bg-white opacity-0 transition-opacity duration-[var(--motion-fast)]", checked ? "opacity-100" : ""].join(" ")} />
      </span>
      <span className="min-w-0 leading-[var(--leading-snug)]">
        <span className="block text-[var(--type-13)] text-[var(--text-primary)]">{label}</span>
        {description && <span className="block text-[var(--type-12)] text-[var(--text-tertiary)] mt-0.5">{description}</span>}
      </span>
    </label>
  );
}

export function RadioGroup({ children }: { children: ReactNode }) {
  return <div role="radiogroup" className="flex flex-col gap-2.5">{children}</div>;
}

/* ─────────────────────────  SELECT (native style, custom chrome)  ───────────────────────── */
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
  const heightClass = size === "sm" ? "h-8 text-[var(--type-13)]" : "h-10 text-[var(--type-14)]";
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={[
          INPUT_BASE.replace("h-10", "").replace("px-3", "pl-3 pr-9"),
          heightClass,
          "appearance-none cursor-pointer",
        ].join(" ")}
      >
        {!value && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────  COMBOBOX  ───────────────────────── */
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
      <input
        value={internal}
        onChange={(e) => { setInternal(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKey}
        placeholder={placeholder}
        className={[INPUT_BASE, "pr-9"].join(" ")}
      />
      <ChevronDown
        size={14}
        className={[
          "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none transition-transform",
          open ? "rotate-180" : "",
        ].join(" ")}
      />
      {open && filtered.length > 0 && (
        <div
          className="absolute z-[var(--z-overlay)] left-0 right-0 mt-1 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] overflow-hidden p-1"
          role="listbox"
        >
          {filtered.map((o, i) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => pick(o)}
              className={[
                "w-full text-left px-2.5 py-1.5 rounded-[var(--radius-sm)] text-[var(--type-13)]",
                i === highlight ? "bg-[var(--surface-sunken)] text-[var(--text-primary)]" : "text-[var(--text-secondary)]",
              ].join(" ")}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────  NUMBER INPUT  ───────────────────────── */
export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className="inline-flex items-stretch h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)] overflow-hidden">
      <button type="button" onClick={dec} aria-label="Decrement"
        className="px-3 text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors text-[16px] leading-none">−</button>
      <div className="flex items-center px-2 border-x border-[var(--border-hairline)]">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-14 bg-transparent text-center lumen-mono text-[var(--type-14)] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="text-[var(--type-12)] text-[var(--text-tertiary)] pr-1">{suffix}</span>}
      </div>
      <button type="button" onClick={inc} aria-label="Increment"
        className="px-3 text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors text-[16px] leading-none">+</button>
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
    <div className="relative w-full">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={[INPUT_BASE, "pr-12 lumen-mono"].join(" ")}
        autoComplete="current-password"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 px-2 h-7 rounded-[var(--radius-sm)] text-[var(--type-11)] uppercase tracking-[var(--tracking-wider)] text-[var(--text-secondary)] hover:bg-[var(--surface-sunken)] transition-colors"
        aria-pressed={show}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  const segs = [0, 1, 2, 3];
  const colors = ["var(--lumen-red-5)", "var(--lumen-amber-5)", "var(--lumen-cream-5)", "var(--lumen-accent-6)"];
  const labels = ["Too weak", "Weak", "Decent", "Strong"];
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-1">
        {segs.map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{ background: i < score ? colors[Math.max(0, score - 1)] : "var(--surface-sunken)" }}
          />
        ))}
      </div>
      <div className="text-[var(--type-11)] text-[var(--text-tertiary)] tabular-nums">
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

/* ─────────────────────────  OTP INPUT  ───────────────────────── */
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
    <div className="inline-flex gap-1.5">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          inputMode="numeric"
          maxLength={1}
          value={cells[i] ?? ""}
          onChange={(e) => set(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="h-12 w-10 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] text-center text-[var(--type-18)] lumen-mono text-[var(--text-primary)] hover:border-[var(--border-strong)] focus:outline-none focus:border-[var(--border-focus)] focus:shadow-[var(--shadow-focus)]"
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────  TAGS INPUT  ───────────────────────── */
export function TagsInput({
  value,
  onChange,
  placeholder = "Add tag…",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const t = draft.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft("");
  }
  return (
    <div className="flex flex-wrap items-center gap-2 min-h-10 px-2 py-1 rounded-[var(--radius-md)] bg-[var(--surface-raised)] border border-[var(--border-default)] focus-within:border-[var(--border-focus)] focus-within:shadow-[var(--shadow-focus)] transition-[border-color,box-shadow]">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 h-6 px-2 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[var(--type-12)] text-[var(--text-secondary)]">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="opacity-60 hover:opacity-100">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
          if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={add}
        placeholder={value.length ? "" : placeholder}
        className="flex-1 min-w-[80px] bg-transparent text-[var(--type-13)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none"
      />
    </div>
  );
}

/* ─────────────────────────  COLOR PICKER  ───────────────────────── */
export function ColorPicker({
  value,
  onChange,
  swatches = ["#4ade80", "#34c977", "#22c55e", "#4592e8", "#ecaa2c", "#e23b3b", "#9333ea", "#1c1b16"],
}: {
  value: string;
  onChange: (v: string) => void;
  swatches?: string[];
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="relative inline-flex items-center gap-2 px-2 h-10 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)]">
        <span className="block h-5 w-5 rounded-[4px] border border-[var(--border-default)]" style={{ background: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label="Pick a color"
        />
        <span className="lumen-mono text-[var(--type-12)] text-[var(--text-secondary)]">{value.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-1">
        {swatches.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={["h-6 w-6 rounded-full border transition-transform", value === c ? "border-[var(--lumen-accent-5)] scale-110" : "border-[var(--border-default)] hover:scale-110"].join(" ")}
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
}: {
  min?: number;
  max?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (v: number) => string;
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
          className="absolute inset-0 w-full bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--border-strong)] [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-grab"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
          className="absolute inset-0 w-full bg-transparent appearance-none pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-[var(--border-strong)] [&::-webkit-slider-thumb]:shadow-[var(--shadow-sm)] [&::-webkit-slider-thumb]:cursor-grab"
        />
      </div>
      <div className="mt-1 flex justify-between lumen-mono text-[var(--type-11)] text-[var(--text-tertiary)]">
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
      className={[
        "block w-full rounded-[var(--radius-lg)] border border-dashed cursor-pointer text-center px-4 py-8",
        "transition-[border-color,background-color] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        over
          ? "border-[var(--lumen-accent-5)] bg-[var(--lumen-accent-a08)]"
          : "border-[var(--border-default)] hover:border-[var(--border-strong)]",
      ].join(" ")}
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
        <span className="h-10 w-10 rounded-full bg-[var(--surface-sunken)] inline-flex items-center justify-center text-[var(--text-secondary)]">
          <Plus size={18} />
        </span>
        <div className="text-[var(--type-13)] font-medium text-[var(--text-primary)]">
          Drop files here or <span className="text-[var(--text-accent)] underline underline-offset-2">browse</span>
        </div>
        <div className="text-[var(--type-12)] text-[var(--text-tertiary)]">{hint}</div>
      </div>
      {picked.length > 0 && (
        <div className="mt-4 text-left flex flex-col gap-1">
          {picked.map((f) => (
            <div key={f.name} className="flex items-center justify-between gap-3 px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface-sunken)]">
              <span className="text-[var(--type-12)] text-[var(--text-secondary)] truncate">{f.name}</span>
              <span className="text-[var(--type-11)] text-[var(--text-tertiary)] lumen-mono">{(f.size / 1024).toFixed(1)} KB</span>
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
    <div className="inline-flex h-10 items-center gap-2 px-3 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)]">
      <CalendarSm />
      <span className="lumen-mono text-[var(--type-13)] text-[var(--text-primary)]">
        {value ?? "Select date"}
      </span>
    </div>
  );
}

export function DatePickerCalendar() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const cells = Array.from({ length: 35 }, (_, i) => i - 2);
  return (
    <div className="inline-block rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface-popover)] shadow-[var(--shadow-popover)] p-3 w-[260px]">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[var(--type-13)] font-semibold tracking-[var(--tracking-tight)]">May 2026</span>
        <div className="flex gap-1 text-[var(--text-tertiary)]">
          <button className="h-7 w-7 rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)]">‹</button>
          <button className="h-7 w-7 rounded-[var(--radius-sm)] hover:bg-[var(--surface-sunken)]">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1 mb-1.5">
        {days.map((d) => (
          <span key={d} className="text-center text-[var(--type-11)] text-[var(--text-tertiary)] uppercase tracking-[var(--tracking-wide)]">{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const day = d > 0 && d <= 31 ? d : null;
          const isToday = day === 12;
          const isSel = day === 19;
          return (
            <button
              key={i}
              disabled={!day}
              className={[
                "h-7 rounded-[var(--radius-sm)] text-[var(--type-12)] lumen-mono transition-colors",
                !day ? "opacity-0" : isSel ? "bg-[var(--lumen-accent-4)] text-[var(--lumen-accent-fg)] font-semibold" : isToday ? "border border-[var(--border-strong)]" : "hover:bg-[var(--surface-sunken)] text-[var(--text-secondary)]",
              ].join(" ")}
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
    <div className="inline-flex h-10 items-center gap-1 px-2 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-raised)]">
      <input
        defaultValue="14"
        maxLength={2}
        className="w-7 text-center bg-transparent lumen-mono text-[var(--type-14)] focus:outline-none text-[var(--text-primary)]"
        aria-label="Hours"
      />
      <span className="text-[var(--text-tertiary)] lumen-mono">:</span>
      <input
        defaultValue="30"
        maxLength={2}
        className="w-7 text-center bg-transparent lumen-mono text-[var(--type-14)] focus:outline-none text-[var(--text-primary)]"
        aria-label="Minutes"
      />
      <div className="ml-1 inline-flex rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] p-0.5">
        <button className="text-[var(--type-11)] uppercase tracking-[var(--tracking-wider)] px-1.5 py-0.5 rounded-[var(--radius-xs)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]">am</button>
        <button className="text-[var(--type-11)] uppercase tracking-[var(--tracking-wider)] px-1.5 py-0.5 rounded-[var(--radius-xs)] text-[var(--text-tertiary)]">pm</button>
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
    <div className="inline-flex items-center p-0.5 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            "h-7 px-3 rounded-[var(--radius-sm)] text-[var(--type-12)] font-medium tracking-[var(--tracking-tight)] transition-[background,color,box-shadow] duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
            value === o.value
              ? "bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
              : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
          ].join(" ")}
          aria-pressed={value === o.value}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* small helper */
function CalendarSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-tertiary)]">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}
