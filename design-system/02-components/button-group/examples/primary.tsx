// Lumen ButtonGroup — Web React example (v0.9)
// Joined buttons sharing a single rounded outline.

import { HTMLAttributes, ReactNode } from "react";

export type ButtonGroupProps = HTMLAttributes<HTMLDivElement> & {
  pill?: boolean;
  children: ReactNode;
};

export function ButtonGroup({ pill, className, children, ...props }: ButtonGroupProps) {
  return (
    <div
      role="group"
      {...props}
      className={[
        "lumen-button-group",
        pill ? "lumen-button-group-pill" : "",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

// Usage:
// <ButtonGroup>
//   <Button intent="ghost" size="sm">Cut</Button>
//   <Button intent="ghost" size="sm">Copy</Button>
//   <Button intent="ghost" size="sm">Paste</Button>
// </ButtonGroup>
