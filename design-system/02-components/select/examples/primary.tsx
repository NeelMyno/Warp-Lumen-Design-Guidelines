// Lumen Select — Web React example (v0.6, native)
// Composes the .lumen-field shell over a real <select>. Use this for short
// option lists (≤ 20). For longer lists or rich option content, use Combobox
// (the autocomplete variant) instead.

import { SelectHTMLAttributes, ReactNode, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export type SelectOption = { label: string; value: string };

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  options: SelectOption[];
  placeholder?: string;
  size?: "sm" | "md";
  leadingIcon?: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { options, placeholder = "Select…", size = "md", leadingIcon, className, value, ...props },
    ref,
  ) {
    return (
      <div
        className={["lumen-field", className ?? ""].join(" ")}
        data-size={size === "md" ? undefined : size}
        style={{ cursor: "pointer" }}
      >
        {leadingIcon && (
          <span data-slot="leading" aria-hidden>
            {leadingIcon}
          </span>
        )}
        <select
          ref={ref}
          value={value}
          className="appearance-none cursor-pointer pr-6 bg-transparent"
          {...props}
        >
          {!value && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span data-slot="trailing" aria-hidden>
          <ChevronDown size={14} />
        </span>
      </div>
    );
  },
);

// Usage:
//
//   <Field label="Carrier" required>
//     <Select
//       name="carrier"
//       value={carrier}
//       onChange={(e) => setCarrier(e.target.value)}
//       options={[
//         { label: "Sterling LTL", value: "sterling" },
//         { label: "Estes Express", value: "estes" },
//         { label: "FedEx Freight", value: "fedex" },
//       ]}
//     />
//   </Field>
