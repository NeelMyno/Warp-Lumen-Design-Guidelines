"use client";

import { ReactNode } from "react";

import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Lumen Tooltip — Radix-backed shadcn Tooltip wrapped to keep the existing
 * Lumen API of `<Tooltip content="..." side="top">{children}</Tooltip>`.
 */
export function Tooltip({
  content,
  children,
  side = "top",
  delay = 350,
}: {
  content: ReactNode;
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}) {
  return (
    <TooltipProvider delayDuration={delay}>
      <ShadcnTooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </ShadcnTooltip>
    </TooltipProvider>
  );
}
