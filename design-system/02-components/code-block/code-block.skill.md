---
name: lumen-code-block
description: Multi-line AI-surface code block with syntax highlighting, language label, and copy affordance. Mirrors Vercel AI Elements `CodeBlock` verbatim per AGENTS.md hard rule 19. Install with `npx ai-elements@latest add code-block`. Status: stable.
---

# Lumen CodeBlock

Multi-line code with syntax highlighting, language label, copy-to-clipboard affordance, and optional line numbers / line highlighting.

## Use when

- Assistant streams a multi-line code response (4+ lines).
- Documentation surfaces with substantial code samples.
- Inside Artifact when `type === "code"` — CodeBlock is the inner rendering primitive.

## NEVER

- NEVER use CodeBlock for single-line inline code — use Snippet (with InputGroup base) instead.
- NEVER use CodeBlock for ANSI-colored terminal output — use Terminal instead.
- NEVER use CodeBlock for error stack traces — use StackTrace (it has clickable file paths).
- NEVER hardcode syntax highlighting colors — they come from Lumen tokens via the syntax-highlighter theme.
- NEVER auto-execute code — CodeBlock is read-only.

## Tokens consumed

- color.surface.sunken (background)
- color.text.primary, color.text.secondary
- color.border.hairline, color.border.frame
- color.accent.500 (copy-success indicator)
- space.2, space.3, space.4
- radius.md, radius.sm
- motion.duration.fast
- motion.easing.standard

## Anatomy

1. `CodeBlock` — Root container. Header (language label + copy button) + scrollable code body.

## API

```ts
interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  copyable?: boolean;
  className?: string;
}
```

## Modes

- Restrained (default): solid `surface.sunken` background, hairline frame border.
- Expressive: same component; ambient atmosphere from page chrome may surround.

## Accessibility

- Copy button has `aria-label="Copy code to clipboard"`.
- Highlighted lines have `aria-label="highlighted"` (sr-only).
- Code body is `<pre><code>` with `aria-readonly="true"`.
- `prefers-reduced-motion`: copy-success animation collapses to opacity-only.

## Code (canonical)

```tsx
// Install: npx ai-elements@latest add code-block
import { CodeBlock } from "@/components/ai-elements/code-block";

export function Example() {
  return (
    <CodeBlock
      code="function greet() { return 'hello'; }"
      language="typescript"
      showLineNumbers
    />
  );
}
```

## Related

- Snippet (short-code variant)
- Artifact (CodeBlock is inner primitive for `type: "code"`)
- Terminal (ANSI-colored output idiom)
- StackTrace (error stack with clickable paths)
- 03-patterns/chat-thread.md
