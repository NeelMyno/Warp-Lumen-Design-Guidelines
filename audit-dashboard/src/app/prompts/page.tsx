import { PromptsClient } from "./client";

export const metadata = {
  title: "Prompt Library · Lumen",
  description:
    "Browse the Lumen v0.13 gpt-image-2 prompt library — style anchor + 7 paste-ready templates with copy buttons, canonical subjects, and reference assets.",
};

export default function PromptsPage() {
  return <PromptsClient />;
}
