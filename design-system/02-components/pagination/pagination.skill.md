---
name: lumen-pagination
description: Use beneath any paginated list / DataTable. Always show first + last + current ± 2 in the middle. Replace large gaps with an ellipsis (...). Provide aria-label='Pagination' on the root.
---

# Lumen Pagination

Page numbers + first / prev / next / last + optional jump-to-page. Mono-numerics. Active page gets lime accent. Truncates with ellipsis for large page counts.

## Use when

- Below DataTable or list views.
- Search result pagination.
- Multi-page report navigation.

## NEVER

- NEVER stack pagination above AND below — pick one.
- NEVER use Pagination for non-paginated content.
- NEVER omit aria-current on the active page.

## Tokens consumed

- surface.tint-accent
- text.primary
- text.tertiary
- text.accent
- border.hairline
- radius.xs
- shadow.focus

## Anatomy

1. Nav root (<nav aria-label='Pagination'>)
2. First / Prev buttons
3. Page number buttons
4. Ellipsis truncation
5. Next / Last buttons
6. Optional 'Jump to page' input

## API

- `currentPage` — number (1-indexed).
- `totalPages` — number.
- `onPageChange` — (page: number) => void.
- `siblingCount` — number (default 1) — pages shown adjacent to current.
- `showFirstLast` — boolean (default true).

## Modes

- **Restrained** (default): solid surfaces, no atmosphere.
- **Expressive**: atmospheric tokens rebind via the parent <ModeScope>; this component does not branch.

## Accessibility

- <nav aria-label='Pagination'>.
- Active page has aria-current=page.
- Disabled buttons have aria-disabled=true.

## Code (canonical)

```tsx
import { Pagination } from "@/components/ui/pagination";

export function Example() {
  const [page, setPage] = useState(3);
  return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />;
}
```

## Related

- DataTable
- list
