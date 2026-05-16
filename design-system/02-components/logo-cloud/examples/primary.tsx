// Lumen LogoCloud — Web React example. Static grid layout.

export type LogoCloudLogo = { src: string; alt: string; href?: string };

export function LogoCloud({
  logos,
  layout = "grid",
  monochrome = true,
  label = "Trusted by",
  speed = 40,
}: {
  logos: LogoCloudLogo[];
  layout?: "grid" | "marquee";
  monochrome?: boolean;
  label?: string;
  speed?: number;
}) {
  const logoCls = [
    "h-7 w-auto max-w-[120px] object-contain",
    monochrome ? "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-[var(--motion-duration-slow)]" : "",
  ].join(" ");
  return (
    <section aria-label={label} className="flex flex-col items-center gap-[var(--space-stack-md)]">
      <p className="text-[var(--type-eyebrow-mono)] uppercase tracking-wider text-[var(--color-text-tertiary)]">{label}</p>
      {layout === "grid" ? (
        <ul role="list" className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {logos.map((l) => (
            <li key={l.alt}>
              {l.href ? <a href={l.href}><img className={logoCls} {...l} /></a> : <img className={logoCls} {...l} />}
            </li>
          ))}
        </ul>
      ) : (
        <div
          aria-live="off"
          className="w-full overflow-hidden mask-fade-x"
          onMouseEnter={(e) => { (e.currentTarget.firstChild as HTMLElement).style.animationPlayState = "paused"; }}
          onMouseLeave={(e) => { (e.currentTarget.firstChild as HTMLElement).style.animationPlayState = "running"; }}
        >
          <ul
            role="list"
            className="flex items-center gap-12 motion-reduce:!animate-none"
            style={{ animation: `lumen-marquee ${speed}s linear infinite` }}
          >
            {[...logos, ...logos].map((l, i) => (
              <li key={i} className="shrink-0">
                <img className={logoCls} src={l.src} alt={l.alt} />
              </li>
            ))}
          </ul>
          <style>{`@keyframes lumen-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
        </div>
      )}
    </section>
  );
}
