import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

/**
 * Lumen Button — Storybook stories (v0.14 scaffold, R12 candidate).
 *
 * First-ship example for the Storybook layer. Walks Button's full intent ×
 * size × shape matrix. Future rounds extend this to all 98 primitives.
 */

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  parameters: { layout: "padded" },
  argTypes: {
    intent: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "ghost", "outline", "danger", "danger-soft", "ai", "glass", "link"],
    },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape: { control: "select", options: ["rect", "pill", "round"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
  args: {
    intent: "primary",
    size: "md",
    shape: "rect",
    children: "Click me",
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { intent: "secondary" },
};

export const Ghost: Story = {
  args: { intent: "ghost" },
};

export const Danger: Story = {
  args: { intent: "danger", children: "Delete" },
};

export const Large: Story = {
  args: { intent: "primary", size: "lg", children: "Continue" },
};

export const FullWidth: Story = {
  args: { intent: "primary", size: "lg", fullWidth: true, children: "Submit application" },
};

export const Loading: Story = {
  args: { intent: "primary", loading: true, children: "Submitting…" },
};
