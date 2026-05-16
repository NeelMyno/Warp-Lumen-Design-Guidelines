// Lumen StatusBar — Web React example.

export function StatusBar({
  time = "9:41",
  carrier,
  platform = "ios",
  tone = "auto",
  battery = 84,
}: {
  time?: string;
  carrier?: string;
  platform?: "ios" | "android";
  tone?: "light" | "dark" | "auto";
  battery?: number;
}) {
  const color =
    tone === "light"
      ? "text-[var(--color-text-primary)]"
      : tone === "dark"
      ? "text-black"
      : "text-[var(--color-text-primary)]";
  return (
    <div
      aria-hidden
      className={[
        "flex items-center justify-between px-6 h-full w-full",
        "text-[11px] font-medium tracking-tight",
        color,
      ].join(" ")}
    >
      <span className="lumen-tnum inline-flex items-center gap-1">{time}</span>
      <span className="inline-flex items-center gap-2">
        {carrier && <span className="text-[10px] opacity-70">{carrier}</span>}
        {/* Signal */}
        <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
          {[2, 4, 6, 8].map((h, i) => (
            <rect key={i} x={i * 3} y={10 - h} width="2" height={h} rx="0.5" fill="currentColor" />
          ))}
        </svg>
        {/* Wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
          <path d="M1 4 Q7 0 13 4" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3 6 Q7 3 11 6" stroke="currentColor" fill="none" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="7" cy="9" r="1" fill="currentColor" />
        </svg>
        {/* Battery */}
        <span className="inline-flex items-center gap-0.5">
          <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
            <rect x="0.5" y="0.5" width="19" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
            <rect x="2" y="2" width={Math.max(0, (battery / 100) * 16)} height="6" rx="1" fill="currentColor" />
            <rect x="20" y="3" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.6" />
          </svg>
        </span>
      </span>
    </div>
  );
}
