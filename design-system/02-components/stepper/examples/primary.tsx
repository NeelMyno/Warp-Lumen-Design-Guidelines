// Lumen Stepper — Web React example
// Linear flow progress. Click backward to revisit completed steps; forward
// jumps are gated by your validation, not by the Stepper.

// lumen-lint-allow-block: primitives — v0.13.3 / ADR 0026: this is a component-contract showcase example. Container widths, font-size literals (e.g. `text-[10px]`), and `var(--token, #fallback)` brand-anchor hex codes are intentional fixtures demonstrating the component at deliberate sizes. Tokenizing the showcase would defeat the demonstration. The lint-allow-block stays open to EOF.

"use client";

import { Check, AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

export type StepperState = "complete" | "current" | "upcoming" | "error";

export type StepDescriptor = {
  label: string;
  description?: string;
  icon?: ReactNode;
  state?: StepperState; // override the index-derived state
};

export type StepperProps = {
  steps: StepDescriptor[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
  variant?: "numbered" | "dotted" | "iconed";
  clickable?: boolean;
  onStepClick?: (index: number) => void;
  compact?: boolean;
};

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  variant = "numbered",
  clickable = false,
  onStepClick,
  compact = false,
}: StepperProps) {
  const isVertical = orientation === "vertical";

  return (
    <nav aria-label="Progress">
      <ol
        className={[
          "flex",
          isVertical ? "flex-col gap-[var(--space-stack-md)]" : "items-start gap-[var(--space-inline-md)]",
        ].join(" ")}
      >
        {steps.map((step, i) => {
          const derived: StepperState =
            i < currentStep ? "complete" : i === currentStep ? "current" : "upcoming";
          const state = step.state ?? derived;
          const isLast = i === steps.length - 1;
          const interactive = clickable && state === "complete";

          return (
            <li
              key={i}
              className={[
                "flex",
                isVertical ? "flex-row items-start" : "flex-1 flex-col items-stretch",
                "min-w-0",
              ].join(" ")}
            >
              <div className={["flex items-center gap-[var(--space-inline-sm)] min-w-0", isVertical ? "flex-row" : "w-full"].join(" ")}>
                <StepMarker
                  state={state}
                  index={i + 1}
                  variant={variant}
                  icon={step.icon}
                  label={`Step ${i + 1} of ${steps.length}: ${step.label}, ${state}`}
                  onClick={interactive ? () => onStepClick?.(i) : undefined}
                />
                {!isVertical && !isLast && <Connector state={state} />}
              </div>

              <div
                className={[
                  isVertical ? "ml-[44px] mt-1" : "mt-2",
                  compact ? "" : "flex flex-col gap-[2px]",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-[var(--type-label-md)] truncate",
                    state === "current" ? "font-medium text-[var(--color-text-primary)]" : "",
                    state === "complete" ? "text-[var(--color-text-primary)]" : "",
                    state === "upcoming" ? "text-[var(--color-text-tertiary)]" : "",
                    state === "error" ? "text-[var(--color-text-error)] font-medium" : "",
                  ].join(" ")}
                  aria-current={state === "current" ? "step" : undefined}
                >
                  {step.label}
                </span>
                {!compact && step.description && (
                  <span className="text-[var(--type-body-sm)] text-[var(--color-text-tertiary)] truncate">
                    {step.description}
                  </span>
                )}
              </div>

              {isVertical && !isLast && (
                <div className="ml-[14px] mt-1 mb-1 w-px self-stretch flex-1 bg-[var(--color-border-hairline)] data-[state=complete]:bg-[var(--color-border-accent)]" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepMarker({
  state,
  index,
  variant,
  icon,
  label,
  onClick,
}: {
  state: StepperState;
  index: number;
  variant: "numbered" | "dotted" | "iconed";
  icon?: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";
  const content: ReactNode =
    variant === "dotted"
      ? <span className="size-2 rounded-full bg-current" />
      : state === "complete"
      ? <Check size={14} aria-hidden />
      : state === "error"
      ? <AlertTriangle size={14} aria-hidden />
      : variant === "iconed" && icon
      ? icon
      : <span className="lumen-tnum text-[12px] font-medium">{index}</span>;

  return (
    <Tag
      type={onClick ? ("button" as const) : undefined}
      aria-label={label}
      onClick={onClick}
      className={[
        "relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-circle)]",
        "transition-colors duration-[var(--motion-duration-fast)]",
        "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:shadow-[var(--shadow-focus)]",
        state === "complete"
          ? "bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]"
          : state === "current"
          ? "bg-[var(--color-action-primary-bg-rest)] text-[var(--color-action-primary-fg)]"
          : state === "upcoming"
          ? "bg-[var(--color-surface-sunken)] text-[var(--color-text-tertiary)] border border-[var(--color-border-hairline)]"
          : "bg-[var(--color-status-danger-bg)] text-[var(--color-text-error)]",
        onClick ? "cursor-pointer hover:ring-2 hover:ring-[var(--color-border-accent)]" : "cursor-default",
      ].join(" ")}
      data-state={state}
    >
      {content}
    </Tag>
  );
}

function Connector({ state }: { state: StepperState }) {
  const colored = state === "complete" ? "bg-[var(--color-border-accent)]" : "bg-[var(--color-border-hairline)]";
  return <span aria-hidden className={["h-px flex-1 mx-2", colored].join(" ")} data-state={state} />;
}
