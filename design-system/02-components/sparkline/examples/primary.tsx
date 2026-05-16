// Lumen Sparkline — Web React example.

export function Sparkline({
  data,
  height = 28,
  width = "auto",
  color = "var(--color-text-accent)",
  showLastDot = true,
  showArea = false,
  ariaLabel,
}: {
  data: number[];
  height?: number;
  width?: string;
  color?: string;
  showLastDot?: boolean;
  showArea?: boolean;
  ariaLabel: string;
}) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80;
  const h = height;
  const xs = data.map((_, i) => (i * w) / Math.max(1, data.length - 1));
  const ys = data.map((v) => h - ((v - min) / Math.max(1, max - min)) * (h - 2) - 1);
  const linePath = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const areaPath = `${linePath} L ${xs[xs.length - 1]} ${h} L ${xs[0]} ${h} Z`;
  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${w} ${h}`}
      width={width}
      height={h}
      preserveAspectRatio="none"
      className="inline-block"
    >
      {showArea && <path d={areaPath} fill={color} opacity="0.15" />}
      <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {showLastDot && (
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="1.5" fill={color} />
      )}
    </svg>
  );
}
