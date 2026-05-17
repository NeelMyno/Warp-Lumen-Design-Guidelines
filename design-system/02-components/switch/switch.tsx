"use client";

/**
 * @lumen/switch — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Built on Radix Switch + .lumen-switch shell (from @lumen/tokens). The thumb
 * is composed via ::before in CSS; the Radix Thumb is hidden so Radix's
 * data-state="checked|unchecked" hook drives the visual. Thumb position math
 * is inline-style-driven per hard rule 12.
 */
import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn("lumen-switch", className)} {...props}>
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className="hidden" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
