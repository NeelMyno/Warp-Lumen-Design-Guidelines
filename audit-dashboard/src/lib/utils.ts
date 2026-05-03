import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — the standard shadcn / Tailwind class merger.
 * Combines conditional class names (clsx) with Tailwind-aware deduping
 * (tailwind-merge). Used by every shadcn primitive.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
