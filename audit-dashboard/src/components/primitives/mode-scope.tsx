// audit-dashboard local copy of the Lumen ModeScope primitive.
// Source: design-system/02-components/mode-scope/examples/primary.tsx
// Keep in sync — Phase 2 will replace this with a shadcn-installed import.
import type { ReactNode } from "react";

export type LumenMode = "restrained" | "expressive";

export interface ModeScopeProps {
  mode?: LumenMode;
  as?: "div" | "section" | "main" | "article";
  className?: string;
  children: ReactNode;
}

export function ModeScope({
  mode = "restrained",
  as: Component = "div",
  className,
  children,
}: ModeScopeProps) {
  return (
    <Component data-mode={mode} className={className}>
      {children}
    </Component>
  );
}
