---
name: FileDropzone
type: component
status: beta
version: 0.7.0
deprecated: false
platforms: [web-react]
a11y_level: WCAG-2.2-AA
related: [Field, Form, Button]
spec: ./component.json
last_updated: 2026-05-03
---

# FileDropzone

> Drag-and-drop file input. A large dashed-bordered tap target wrapping a hidden native `<input type="file">`. Click anywhere or drop files; the resting state, hover, and drag-over states are all distinct.

## When to use
- File upload anywhere — avatars, attachments, CSV import, freight rate sheet upload.
- When the user can drag files in (most desktop and tablet flows).
- Single OR multiple file selection (configurable via `multiple`).

## When NOT to use
- Server-side file selection (S3 picker, Drive browser) — these need their own picker UI.
- Camera capture flows — use a `<input type="file" accept="image/*" capture>` Button.
- Inline image editing — out of v0.7 scope.

## Anatomy

```
┌──────────────────────────────────────────────┐
│                                              │
│              ┌───┐                           │
│              │ + │     ← icon disc          │
│              └───┘                           │
│                                              │
│      Drop files here or browse              │  ← title (browse is accent + underline)
│      PDF, CSV, XLSX up to 25 MB             │  ← hint
│                                              │
└──────────────────────────────────────────────┘
   dashed border, lights up lime on dragover

After file selection:
┌──────────────────────────────────────────────┐
│   ↳ rate-sheet-may-2026.csv         12.4 KB │  ← file row
│   ↳ carriers.xlsx                   89.1 KB │
└──────────────────────────────────────────────┘
```

NOT a `.lumen-field` shell — FileDropzone is its own large drop target with distinct rest, hover, and drag-over treatments. Native `<input type="file">` is `sr-only` behind the label.

## States
Rest, hover, drag-over (lime border + tinted bg), error (red border, shown when accept/size validation fails), disabled. Per file row: rest, removing.

## Accessibility
- The whole dropzone is a `<label>` wrapping the input, so the click affordance is correct AND screen readers announce it as a file picker.
- `accept` and `multiple` attributes pass through to the inner `<input>`.
- After files are picked, a polite live region announces the count ("3 files selected").
- Drag-over events visually indicate "you can drop here"; consumer code should also call `e.preventDefault()` on `onDragOver` (the example handles this).

WCAG: 1.3.1, 1.4.3, 1.4.11, 2.1.1, 2.4.7, 2.5.8, 4.1.2.

## Do
- Pass `accept` for known MIME types (`accept=".pdf,.csv,.xlsx"` or `accept="image/*"`).
- Pass `maxSize` (bytes) and validate client-side; show a polite error in `error` slot.
- Use the file row to show what was picked and offer a remove affordance.
- Show the upload progress beneath each file row (out of v0.7; consumer responsibility).

## Don't
- Don't auto-upload silently — let the user confirm or clear before the request fires.
- Don't disable the file picker as your only error treatment — show a hint above and let them try again.
- Don't allow dropping arbitrary files when `accept` is set — filter on drop.

## Code
- [Web React](./examples/web-react.tsx)

## Changelog
- 0.7.0 — Initial release. Promotes the v0.6 audit-dashboard primitive in `inputs.tsx` to a contract. Single + multi-file modes; native `<input type="file">` behind a labeled drop target with distinct rest / hover / drag-over states.
