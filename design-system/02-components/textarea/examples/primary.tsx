// Lumen Textarea — Web React example (v0.6)
// Renders the bare <textarea> with the .lumen-field shell class. Wrap in
// <Field label=...> to get the label / description / error surface.

import { TextareaHTMLAttributes, forwardRef } from "react";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  resize?: "none" | "vertical" | "both";
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ resize = "vertical", className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={[
          "lumen-field",
          resize === "none" ? "resize-none" : resize === "both" ? "resize" : "resize-y",
          className ?? "",
        ].join(" ")}
        {...props}
      />
    );
  },
);

// Usage:
//
//   <Field label="Pickup notes" description="Visible to the driver">
//     <Textarea name="notes" rows={5} placeholder="Loading dock 3, ring intercom..." />
//   </Field>
