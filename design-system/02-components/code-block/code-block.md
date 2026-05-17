---
name: CodeBlock
type: component
tier: T5
family: Content
version: 0.13.0
last_updated: 2026-05-17
status: stable
phase: 5
vercel_ai_elements: CodeBlock
install: npx ai-elements@latest add code-block
related:
  - ./code-block.skill.md
  - ../snippet/snippet.md
  - ../artifact/artifact.md
  - ../terminal/terminal.md
---

# CodeBlock

Formal AI-surface code block primitive — multi-line code with syntax highlighting, language label, copy-to-clipboard affordance, and optional line numbers / line highlighting.

Per master doc §7.Phase-5 Family 5: "CodeBlock — formalize the existing v0.12.4 code block." The v0.12.4 legacy `code-block` shipped only as `component.json` + `component.md`; this v0.13 entry adds the Vercel-AI-Elements-named contract.

Distinct from [Snippet](../snippet/snippet.md), which is a lightweight terminal-command + short-code-snippet variant built on shadcn's `InputGroup`. CodeBlock is the long-form / multi-line / language-tagged variant for assistant responses and Artifact content.

## Use when

- Assistant streams a multi-line code response — wrap in CodeBlock for syntax highlighting + copy.
- Documentation surfaces with substantial code samples (4+ lines).
- Inside Artifact (when the artifact type is `code`) — CodeBlock is the inner rendering primitive.

## API

```ts
interface CodeBlockProps {
  code: string;
  language?: string;             // default = "plaintext"
  showLineNumbers?: boolean;     // default = false
  highlightLines?: number[];     // line numbers to highlight (1-based)
  copyable?: boolean;            // default = true
  className?: string;
}
```

## Anatomy

| Sub-component | Role |
|---|---|
| `CodeBlock` | Root container. Header (language label + copy button) + scrollable code body. |

## Modes

- **Restrained** (default): solid `surface.sunken` background, hairline frame border.
- **Expressive**: same component; the surrounding canvas may render glow if inside `data-mode="expressive"`.

## Accessibility

- The copy button has `aria-label="Copy code to clipboard"` + visual feedback on click.
- Highlighted lines have `aria-label="highlighted"` (sr-only).
- Code body is a `<pre><code>` with `aria-readonly="true"`.
- `prefers-reduced-motion`: copy-success animation collapses to opacity-only.

## Related

- [Snippet](../snippet/snippet.md) (lightweight short-code variant)
- [Artifact](../artifact/artifact.md) (CodeBlock is the inner rendering primitive when artifact type is `code`)
- [Terminal](../terminal/terminal.md) (different idiom: ANSI-colored console output)
- [StackTrace](../stack-trace/stack-trace.md) (sibling: error-stack rendering)

## Install

```bash
npx ai-elements@latest add code-block
```
