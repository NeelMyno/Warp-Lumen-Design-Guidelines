import { RegistryBrowserClient } from "./client";

export const metadata = {
  title: "Registry Browser · Lumen",
  description:
    "Data-driven view of the @lumen/* shadcn registry — every component with install command, tokens consumed, mode badge, SKILL.md NEVER-rule count, and tier filter.",
};

export default function RegistryBrowserPage() {
  return <RegistryBrowserClient />;
}
