---
name: Pagination
category: navigation
lumen_version: 0.13.0
status: stable
mode: agnostic
platforms: ["web-react"]
tokens:
  - surface.tint-accent
  - text.primary
  - text.tertiary
  - text.accent
  - border.hairline
  - radius.xs
  - shadow.focus
a11y:
  - WCAG-2.2-AA
  - prefers-reduced-motion
  - prefers-reduced-transparency
related: ["DataTable", "list"]
ai_naming: lumen-native
mcp_install: "npx shadcn add @lumen/pagination"
---

# Pagination

Page numbers + first / prev / next / last + optional jump-to-page. Mono-numerics. Active page gets lime accent. Truncates with ellipsis for large page counts.

## When to use

- Below DataTable or list views.
- Search result pagination.
- Multi-page report navigation.

## Anatomy

1. Nav root (<nav aria-label='Pagination'>)
2. First / Prev buttons
3. Page number buttons
4. Ellipsis truncation
5. Next / Last buttons
6. Optional 'Jump to page' input

## Modes

- **Restrained** (default): solid surfaces, hairline borders, no atmospheric layers.
- **Expressive**: rebinds via the parent `<ModeScope mode="expressive">` — surfaces, motion, and atmosphere semantic tokens flip; this component does not branch on mode.

## Accessibility

- <nav aria-label='Pagination'>.
- Active page has aria-current=page.
- Disabled buttons have aria-disabled=true.

## Tokens consumed

- `surface.tint-accent`
- `text.primary`
- `text.tertiary`
- `text.accent`
- `border.hairline`
- `radius.xs`
- `shadow.focus`

## Do

- Use ellipsis for >7 pages.
- Show current ± 1 minimum.
- Provide first/last when totalPages > 5.

## Don't

- Don't stack above + below.
- Don't omit aria-current.

## Related

- DataTable
- list

## Code

```tsx
import { Pagination } from "@/components/ui/pagination";

export function Example() {
  const [page, setPage] = useState(3);
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
}
```
