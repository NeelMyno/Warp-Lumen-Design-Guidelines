"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

/**
 * Lumen / shadcn Switch. v0.6 — adopts .lumen-switch shell. The thumb is
 * composed via ::before in CSS; the Radix Thumb is hidden so Radix's
 * data-state="checked|unchecked" hook drives the visual.
 */
function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn("lumen-switch", className)}
      {...props}
    >
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className="hidden" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
