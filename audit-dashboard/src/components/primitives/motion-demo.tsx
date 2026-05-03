"use client";

import { useState } from "react";

export function MotionDemo({ token, ms }: { token: string; ms: string }) {
  const [active, setActive] = useState(false);
  return (
    <button
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive((a) => !a)}
      className="bg-[var(--accent-500)] text-[var(--accent-fg)] h-10 px-4 rounded-[var(--radius-md)] font-medium"
      style={{
        transform: active ? "translateX(140px)" : "translateX(0)",
        transition: `transform var(--motion-${token}) var(--easing-standard)`,
      }}
    >
      Hover me
    </button>
  );
}
