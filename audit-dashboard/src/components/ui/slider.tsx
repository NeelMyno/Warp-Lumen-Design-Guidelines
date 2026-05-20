"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-[var(--surface-sunken)] relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            /* v0.8.1 — Direct lime token; see ui/button.tsx. */
            "bg-[var(--lumen-accent-5)] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          /* v0.8.1 — border-primary → border-[var(--lumen-accent-4)]; see ui/button.tsx.
             v0.14 R11 — hover/focus ring shadows go neutral. The thumb's
             border-color remains accent (borders are allowed to be green),
             but the Tailwind `ring-*` utility compiles to a box-shadow,
             so its color must follow the no-green-in-shadows mandate. */
          className="border-[var(--lumen-accent-4)] bg-[var(--surface-raised)] focus-visible:shadow-[var(--shadow-focus)] block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 hover:ring-[var(--border-frame)] focus-visible:ring-4 focus-visible:ring-[var(--border-frame)] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
