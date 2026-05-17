import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — the canonical shadcn / Tailwind class merger.
 * Combines conditional class names (clsx) with Tailwind-aware deduping
 * (tailwind-merge). Every Lumen registry component imports this.
 *
 * Distributed via @lumen/utils registry:lib item; installs to the consumer's
 * `lib/utils.ts` (which `@/lib/utils` resolves to in any shadcn project).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
