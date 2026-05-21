# PRIMITIVE-COVERAGE.md — what Lumen ships, where it lives

> **Generated 2026-05-21 for Lumen v0.15.0.** Maps the canonical ~700-item UI-primitive design audit list against where each item lives in Lumen — component contract, foundation, pattern, content guide, or out-of-scope.
>
> **Audience:** LLMs and developers generating UI under Lumen. Read this BEFORE you reach for a component you think you need to build — most of them already exist with a contract.

## How to read this map

Each row maps a primitive from the audit list to its Lumen home:

| Symbol | Meaning |
|---|---|
| ✅ component | Has a contract under [`design-system/02-components/{name}/`](design-system/02-components/) |
| 🪨 foundation | Lives in [`design-system/00-foundations/`](design-system/00-foundations/) as a system-level rule |
| 🧬 token | Lives in [`design-system/01-tokens/`](design-system/01-tokens/) (primitives → semantic → component) |
| 🧩 pattern | Lives in [`design-system/05-patterns/`](design-system/05-patterns/) as a multi-component composition |
| ✍️ content | Lives in [`design-system/04-content/`](design-system/04-content/) as copy / imagery / iconography rule |
| 🎭 variant | Variant of another contract (named in the entry) |
| 🔧 compose | Composed from multiple existing components — see the entry |
| ⏭️ out-of-scope | Intentionally not a primitive — see the entry for why |
| 📅 future | Planned for a later release |

When the map says "see X", X is the canonical contract or doc to read.

## A. Foundations & system primitives

| Audit item | Lumen home |
|---|---|
| Layout | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §1 The grid |
| Grid system | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §1 |
| Spacing | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §2-4 + 🧬 [01-tokens/semantic/space.tokens.json](design-system/01-tokens/semantic/space.tokens.json) |
| Alignment | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §4 form-specific gaps |
| Typography | 🪨 [foundations/typography.md](design-system/00-foundations/typography.md) + 🧬 [01-tokens/semantic/type.tokens.json](design-system/01-tokens/semantic/type.tokens.json) |
| Color system | 🪨 [foundations/color.md](design-system/00-foundations/color.md) + 🧬 [01-tokens/semantic/color.dark.tokens.json](design-system/01-tokens/semantic/color.dark.tokens.json) + [color.light.tokens.json](design-system/01-tokens/semantic/color.light.tokens.json) |
| Icon style | ✍️ [04-content/iconography.md](design-system/04-content/iconography.md) (lucide; 1.5 px stroke; 24 px grid; rounded ends) |
| Illustration style | ✍️ [04-content/illustration.md](design-system/04-content/illustration.md) |
| Brand style | 🪨 [foundations/voice-and-tone.md](design-system/00-foundations/voice-and-tone.md) + [foundations/first-impression.md](design-system/00-foundations/first-impression.md) |
| Elevation / shadows | 🪨 [foundations/elevation.md](design-system/00-foundations/elevation.md) + 🧬 [shadow.tokens.json](design-system/01-tokens/semantic/shadow.tokens.json) |
| Corners / border radius | 🧬 [01-tokens/semantic/radius.tokens.json](design-system/01-tokens/semantic/radius.tokens.json) |
| Borders | 🧬 `color.border.{hairline\|subtle\|default\|strong\|accent\|focus}` |
| Visual hierarchy | 🪨 [foundations/hierarchy.md](design-system/00-foundations/hierarchy.md) (the three-tier rule, 1.5–2× weight rule) |
| Responsive behavior | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §5 container widths + per-pattern responsive in [05-patterns/](design-system/05-patterns/) |
| Accessibility rules | 🪨 [foundations/accessibility.md](design-system/00-foundations/accessibility.md) (WCAG 2.2 AA floor) |
| Motion / animation rules | 🪨 [foundations/motion-language.md](design-system/00-foundations/motion-language.md) + [foundations/micro-interactions.md](design-system/00-foundations/micro-interactions.md) + 🧬 [motion.tokens.json](design-system/01-tokens/semantic/motion.tokens.json) |
| Dark mode / light mode | 🧬 dual token files — [color.dark.tokens.json](design-system/01-tokens/semantic/color.dark.tokens.json) (default) + [color.light.tokens.json](design-system/01-tokens/semantic/color.light.tokens.json) |
| Design tokens | 🧬 [01-tokens/](design-system/01-tokens/) (primitives → semantic → component, per Style Dictionary) |

## B. Navigation

| Audit item | Lumen home |
|---|---|
| Navbar | ✅ [Navbar](design-system/02-components/navbar/component.md) (marketing / operator / mobile) |
| Sidebar | ✅ [Sidebar](design-system/02-components/sidebar/component.md) (expanded / rail / auto) |
| Tab bar | ✅ [Tabs](design-system/02-components/tabs/component.md) (pill / underline / enclosed) |
| Bottom navigation | ✅ [BottomNav](design-system/02-components/bottom-nav/component.md) |
| Breadcrumbs | ✅ [Breadcrumbs](design-system/02-components/breadcrumbs/component.md) |
| Menus | ✅ [DropdownMenu](design-system/02-components/dropdown-menu/component.md) |
| Dropdown menus | ✅ [DropdownMenu](design-system/02-components/dropdown-menu/component.md) |
| Mega menus | 🎭 variant — DropdownMenu with content slot wrapping a Grid layout |
| Pagination | ✅ [Pagination](design-system/02-components/pagination/component.md) (numeric + cursor) |
| Stepper | ✅ [Stepper](design-system/02-components/stepper/component.md) |
| Back button | 🎭 variant of [IconButton](design-system/02-components/icon-button/component.md) with `<ArrowLeft />` + aria-label |
| Search navigation | ✅ [SearchField](design-system/02-components/search-field/component.md) |
| Anchor links | 🎭 variant of [Link](design-system/02-components/link/component.md) (`href="#section"`) |
| Table of contents | 🔧 compose from [List](design-system/02-components/list/component.md) variant=interactive + anchor [Link](design-system/02-components/link/component.md)s |

## C. Form components

| Audit item | Lumen home |
|---|---|
| Text field | ✅ [Input](design-system/02-components/input/component.md) |
| Text area | ✅ [Textarea](design-system/02-components/textarea/component.md) |
| Search field | ✅ [SearchField](design-system/02-components/search-field/component.md) |
| Checkbox | ✅ [Checkbox](design-system/02-components/checkbox/component.md) |
| Radio button | ✅ [RadioGroup](design-system/02-components/radio-group/component.md) |
| Toggle / switch | ✅ [Toggle](design-system/02-components/toggle/component.md) + [Switch](design-system/02-components/switch/component.md) |
| Slider | ✅ [Slider](design-system/02-components/slider/component.md) (single value) |
| Range selector | ✅ [RangeSlider](design-system/02-components/range-slider/component.md) (two values) |
| Dropdown / select | ✅ [Select](design-system/02-components/select/component.md) |
| Combobox | ✅ [Combobox](design-system/02-components/combobox/component.md) |
| Date picker | ✅ [DatePicker](design-system/02-components/date-picker/component.md) |
| Time picker | ✅ [TimePicker](design-system/02-components/time-picker/component.md) |
| File upload | ✅ [FileDropzone](design-system/02-components/file-dropzone/component.md) |
| Image upload | 🎭 variant of FileDropzone (`accept="image/*"`) |
| Number input | ✅ [NumberInput](design-system/02-components/number-input/component.md) |
| Password input | ✅ [PasswordInput](design-system/02-components/password-input/component.md) |
| OTP input | ✅ [OtpInput](design-system/02-components/otp-input/component.md) |
| Tags input | ✅ [TagsInput](design-system/02-components/tags-input/component.md) |
| Color picker | ✅ [ColorPicker](design-system/02-components/color-picker/component.md) |
| Form groups | ✅ [Form](design-system/02-components/form/component.md) + [Field](design-system/02-components/field/component.md) |
| Form validation | ✅ [ValidationMessage](design-system/02-components/validation-message/component.md) |

## D. Actions

| Audit item | Lumen home |
|---|---|
| Primary button | 🎭 [Button intent='primary'](design-system/02-components/button/component.md) |
| Secondary button | 🎭 [Button intent='secondary'](design-system/02-components/button/component.md) |
| Icon button | ✅ [IconButton](design-system/02-components/icon-button/component.md) |
| Floating action button | ✅ [FAB](design-system/02-components/fab/component.md) |
| Link button | 🎭 [Button intent='link'](design-system/02-components/button/component.md) |
| Split button | ✅ [SplitButton](design-system/02-components/split-button/component.md) |
| CTA button | 🎭 [Button intent='primary' shape='pill'](design-system/02-components/button/component.md) with optional `glow` |
| Toolbar actions | ✅ [Toolbar](design-system/02-components/toolbar/component.md) |
| Contextual actions | ✅ [DropdownMenu trigger='context'](design-system/02-components/dropdown-menu/component.md) (web) / [ActionSheet](design-system/02-components/action-sheet/component.md) (mobile) |
| Swipe actions | ✅ [SwipeAction](design-system/02-components/swipe-action/component.md) |
| Bulk actions | 🔧 compose Toolbar + [DataGrid](design-system/02-components/data-grid/component.md) selection bar pattern |

## E. Display & data

| Audit item | Lumen home |
|---|---|
| Card | ✅ [Card](design-system/02-components/card/component.md) |
| List | ✅ [List](design-system/02-components/list/component.md) |
| Table | ✅ [Table](design-system/02-components/table/component.md) |
| Data grid | ✅ [DataGrid](design-system/02-components/data-grid/component.md) |
| Badge | ✅ [Badge](design-system/02-components/badge/component.md) |
| Tag / chip | ✅ [Tag](design-system/02-components/tag/component.md) |
| Avatar | ✅ [Avatar](design-system/02-components/avatar/component.md) |
| Tooltip | ✅ [Tooltip](design-system/02-components/tooltip/component.md) |
| Popover | ✅ [Popover](design-system/02-components/popover/component.md) |
| Accordion | ✅ [Accordion](design-system/02-components/accordion/component.md) |
| Carousel | ✅ [Carousel](design-system/02-components/carousel/component.md) |
| Image viewer | 🎭 variant of [Dialog](design-system/02-components/dialog/component.md) with `<img />` content + zoom |
| Video player | ⏭️ out-of-scope as primitive — wrap a real player (Mux, vimeo) inside Card |
| Map | ⏭️ out-of-scope — wrap mapbox / google / leaflet inside Card |
| Timeline | ✅ [Timeline](design-system/02-components/timeline/component.md) |
| Calendar | ✅ [Calendar](design-system/02-components/calendar/component.md) |
| Stat block | ✅ [Stat](design-system/02-components/stat/component.md) |
| Metric card / KPI card | ✅ [KpiCard](design-system/02-components/kpi-card/component.md) |
| Chart | ✅ [Chart](design-system/02-components/chart/component.md) |
| Graph | 🎭 [Chart kind='line\|area\|bar\|...']](design-system/02-components/chart/component.md) |
| Progress bar | ✅ [Progress](design-system/02-components/progress/component.md) |
| Skeleton loader | ✅ [Skeleton](design-system/02-components/skeleton/component.md) |
| Empty state | ✅ [EmptyState](design-system/02-components/empty-state/component.md) |
| Toast | ✅ [Toast](design-system/02-components/toast/component.md) |
| Snackbar | ✅ [Snackbar](design-system/02-components/snackbar/component.md) |
| Alert | ✅ [Alert](design-system/02-components/alert/component.md) |
| Banner | ✅ [Banner](design-system/02-components/banner/component.md) |
| Error / Success / Warning message | ✅ [ValidationMessage](design-system/02-components/validation-message/component.md) (inline) + [Alert](design-system/02-components/alert/component.md) (region) |
| Loading spinner | ✅ [Spinner](design-system/02-components/spinner/component.md) |
| Progress indicator | ✅ [Progress](design-system/02-components/progress/component.md) |
| Confirmation dialog | 🎭 [Dialog destructive=true](design-system/02-components/dialog/component.md) |
| Modal | ✅ [Dialog](design-system/02-components/dialog/component.md) |
| Inline validation | ✅ [ValidationMessage](design-system/02-components/validation-message/component.md) |
| System status message | 🎭 [Alert](design-system/02-components/alert/component.md) or [Banner](design-system/02-components/banner/component.md) |

## F. Containers & layout

| Audit item | Lumen home |
|---|---|
| Page | 🧩 [05-patterns/](design-system/05-patterns/) (per-pattern Page wrappers) |
| Section | 🧩 audit-dashboard `<Section>` primitive + [foundations/spacing.md](design-system/00-foundations/spacing.md) §section tokens |
| Header | ✅ [Navbar](design-system/02-components/navbar/component.md) |
| Footer | 🧩 audit-dashboard `<FooterDemo>` — pattern, not primitive |
| Main content area | 🧩 pattern — `<main id="main-content">` per [foundations/accessibility.md](design-system/00-foundations/accessibility.md) skip-link rule |
| Drawer | ✅ [Drawer](design-system/02-components/drawer/component.md) |
| Sheet | ✅ [Sheet](design-system/02-components/sheet/component.md) |
| Modal container | ✅ [Dialog](design-system/02-components/dialog/component.md) |
| Panel | ✅ [Panel](design-system/02-components/panel/component.md) |
| Toolbar | ✅ [Toolbar](design-system/02-components/toolbar/component.md) |
| App bar | ✅ [Navbar](design-system/02-components/navbar/component.md) |
| Divider | ✅ [Divider](design-system/02-components/divider/component.md) |
| Spacer | 🧬 utility — use `space.*` tokens as gap or padding |
| Layout grid | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §1 |
| Stack | 🧬 utility — `flex flex-col gap-[var(--space-stack-md)]` |
| Tabs panel | ✅ [Tabs](design-system/02-components/tabs/component.md) (TabsPanel sub-component) |

## G. Typography

| Audit item | Lumen home |
|---|---|
| Headings / Paragraphs / Labels / Captions | 🪨 [foundations/typography.md](design-system/00-foundations/typography.md) + 🧬 `type.heading.h1-h4`, `type.body.{sm,md,lg}`, `type.label.{sm,md,lg}` |
| Helper text | 🎭 [Field](design-system/02-components/field/component.md) helper slot |
| Placeholder text | 🎭 [Input](design-system/02-components/input/component.md) `placeholder` prop + `color.text.placeholder` token |
| Error / empty-state / button-text copy | ✍️ [04-content/](design-system/04-content/) (empty-states, error-messages, microcopy, ui-writing-style) |
| Tooltips | ✅ [Tooltip](design-system/02-components/tooltip/component.md) |
| Microcopy | ✍️ [04-content/microcopy.md](design-system/04-content/microcopy.md) |
| Notifications | ✅ [Toast](design-system/02-components/toast/component.md) / [NotificationCenter](design-system/02-components/notification-center/component.md) |
| Onboarding text / instructional text | ✍️ [04-content/microcopy.md](design-system/04-content/microcopy.md) + ✅ [CoachMark](design-system/02-components/coach-mark/component.md) |

## H. Media

| Audit item | Lumen home |
|---|---|
| Images | ✍️ [04-content/imagery.md](design-system/04-content/imagery.md) |
| Icons | ✍️ [04-content/iconography.md](design-system/04-content/iconography.md) (lucide) |
| Logos | 🎭 [LogoCloud](design-system/02-components/logo-cloud/component.md) for the strip; raw asset rules in `04-content/imagery.md` |
| Illustrations | ✍️ [04-content/illustration.md](design-system/04-content/illustration.md) |
| Videos / Audio / GIFs / Lottie / 3D / Background images | ⏭️ out-of-scope as primitives — wrap real players inside Card / Drawer / Section; treat as `<img>` / `<video>` with Lumen radius/shadow tokens |
| Thumbnails | 🎭 `<img className={[radius.control.md, surface-sunken bg-fallback])} />` — common idiom |
| Maps | ⏭️ wrap mapbox / google / leaflet inside Card |

## I. Charts

| Audit item | Lumen home |
|---|---|
| Line / Bar / Pie / Donut / Area / Scatter / Heatmap / Funnel / Waterfall / Histogram | 🎭 [Chart kind='...']](design-system/02-components/chart/component.md) with adapter (Recharts / Visx / ECharts) |
| Gauge | 🎭 [Progress shape='circular']](design-system/02-components/progress/component.md) |
| KPI card | ✅ [KpiCard](design-system/02-components/kpi-card/component.md) |
| Comparison table | 🎭 [Table](design-system/02-components/table/component.md) with status indicator columns |
| Dashboard widget | 🔧 compose [KpiCard](design-system/02-components/kpi-card/component.md) + [Chart](design-system/02-components/chart/component.md) inside [Card](design-system/02-components/card/component.md) |
| Trend indicator | ✅ [Trend](design-system/02-components/trend/component.md) |
| Sparkline | ✅ [Sparkline](design-system/02-components/sparkline/component.md) |

## J. Interaction states (default / hover / focus / active / pressed / etc.)

🪨 [foundations/micro-interactions.md](design-system/00-foundations/micro-interactions.md) — every interactive component documents per-state behavior in its `component.json` `a11y.rules` + prose. Specific patterns:

| Audit item | Lumen home |
|---|---|
| Default / Hover / Active / Pressed | per-component `component.json` a11y rules + [foundations/micro-interactions.md](design-system/00-foundations/micro-interactions.md) |
| Focus | 🪨 AGENTS.md hard rule 11 — outline + box-shadow contract |
| Selected | 🧬 `color.action.selected.{bg,border,fg}` (tinted ~12% accent) |
| Disabled | 🧬 `color.action.*.disabled` + `aria-disabled` (not the `disabled` attribute in forms) |
| Loading | per-component `loading` prop (Button, AIPromptInput, KpiCard, etc.) + ✅ [Spinner](design-system/02-components/spinner/component.md) / [Skeleton](design-system/02-components/skeleton/component.md) |
| Error / Success / Warning | tone-tinted variants per [foundations/color.md](design-system/00-foundations/color.md) status palette |
| Empty | ✅ [EmptyState](design-system/02-components/empty-state/component.md) |
| Expanded / Collapsed | ✅ [Accordion](design-system/02-components/accordion/component.md) / [Panel](design-system/02-components/panel/component.md) `aria-expanded` |
| Dragging | ✅ [Kanban](design-system/02-components/kanban/component.md) (WCAG 2.5.7 keyboard-equivalent) / [SwipeAction](design-system/02-components/swipe-action/component.md) |
| Read-only | 🎭 [Input](design-system/02-components/input/component.md) `readOnly` prop + `color.surface.input.readOnly` token |

## K. Methodology (out of scope for components)

| Audit item | Lumen home |
|---|---|
| User flows / Journey maps / Wireframes / Prototypes | ⏭️ design artifacts — owned by the design team's Figma; not primitives |
| Information architecture | ⏭️ owned per-product |
| Accessibility / Error prevention / Consistency / Learnability / Feedback / User control / Responsiveness / Performance perception | 🪨 each is a Lumen principle — see [foundations/principles.md](design-system/00-foundations/principles.md) |

## L. Mobile-specific

| Audit item | Lumen home |
|---|---|
| Status bar / Safe area / Notch / Dynamic Island / Home indicator / Gesture handle | ✅ [PhoneFrame](design-system/02-components/phone-frame/component.md) + [StatusBar](design-system/02-components/status-bar/component.md) (for mockups). Real-device safe-area handled via `env(safe-area-inset-*)` per [05-patterns/mobile-primary.md](design-system/05-patterns/mobile-primary.md) |
| Pull-to-refresh control | ✅ [PullToRefresh](design-system/02-components/pull-to-refresh/component.md) |
| Swipe-to-delete / Swipe-to-archive / Swipe-to-reveal | ✅ [SwipeAction](design-system/02-components/swipe-action/component.md) |
| Long-press menu / Context menu | ✅ [DropdownMenu trigger='context'](design-system/02-components/dropdown-menu/component.md) (web) / [ActionSheet](design-system/02-components/action-sheet/component.md) (mobile) |
| Action sheet | ✅ [ActionSheet](design-system/02-components/action-sheet/component.md) |
| Bottom sheet / Half / Full / Detent | ✅ [Sheet](design-system/02-components/sheet/component.md) |
| Drag handle | 🎭 [Sheet `handle` prop](design-system/02-components/sheet/component.md) |
| Mobile keyboard accessory bar | 🧩 pattern — see audit-dashboard `KeyboardAccessoryBar` |
| Autofill suggestion strip / Keyboard dismiss area | ⏭️ OS-owned |
| Biometric / FaceID / TouchID / Passcode prompts | 🧩 OS-owned; documented in [05-patterns/mobile-primary.md](design-system/05-patterns/mobile-primary.md) |
| Permission prompt / Pre-prompt (location, camera, mic, notifications, contacts, photos, motion, tracking, bluetooth) | ✅ [PermissionPrompt](design-system/02-components/permission-prompt/component.md) |
| In-app review prompt / App update prompt | 🎭 [Dialog](design-system/02-components/dialog/component.md) variants |
| App version notice / maintenance notice / Offline mode / Network reconnect banner | ✅ [Banner tone='warning\|danger\|info'](design-system/02-components/banner/component.md) |
| Haptic / vibration feedback | ⏭️ OS-owned |
| Touch target zone / Thumb-zone action area / Floating bottom CTA / Sticky bottom CTA | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §6 + [05-patterns/mobile-primary.md](design-system/05-patterns/mobile-primary.md) |
| Mobile sheet form / Mobile full-screen form / Mobile filter sheet / Mobile sort sheet / Mobile share sheet | 🎭 [Sheet](design-system/02-components/sheet/component.md) variants |
| Native share panel | ⏭️ OS-owned (Web Share API on web) |
| QR / Barcode / Camera capture / Cropper / Image annotation / Location picker / Map pin / Address autocomplete / Place autocomplete | ⏭️ feature-specific — wrap a real implementation inside Sheet / Dialog |
| Voice input button / Dictation indicator / Audio recording / Recording waveform / Voice note player / Voice command overlay | 🎭 [IconButton](design-system/02-components/icon-button/component.md) (record/play) + [AIBadge kind='thinking'](design-system/02-components/ai-badge/component.md) (voice generation) |

## M. Auth & account flows

| Audit item | Lumen home |
|---|---|
| Mobile onboarding slides / Permission education / App walkthrough / Coach mark / Spotlight / First-run checklist / Guided setup / Setup progress checklist | ✅ [CoachMark](design-system/02-components/coach-mark/component.md) + 🎭 [Stepper](design-system/02-components/stepper/component.md) |
| Account creation / Login / Signup / Forgot password / Reset password / Magic link / Passkey login / Social login row / SSO panel / MFA verification / Backup code / Session expired | 🧩 [05-patterns/auth-flow.md](design-system/05-patterns/auth-flow.md) — compositions of Form + Field + Button + OtpInput + ValidationMessage |
| Account switcher / Profile switcher / Workspace switcher / Organization switcher / Store switcher / Project switcher / Environment switcher | 🎭 [DropdownMenu](design-system/02-components/dropdown-menu/component.md) trigger=avatar + items=routes |

## N. Settings & admin

| Audit item | Lumen home |
|---|---|
| Language / Region / Currency / Timezone selectors | 🎭 [Combobox](design-system/02-components/combobox/component.md) |
| Theme selector / Density selector / View mode / Compact mode | 🎭 [Segmented](design-system/02-components/segmented/component.md) |
| Accessibility / Notification / Privacy / Security preferences panels | 🔧 compose [Panel](design-system/02-components/panel/component.md) + [Form](design-system/02-components/form/component.md) + 🧩 [05-patterns/settings-page.md](design-system/05-patterns/settings-page.md) |
| Device management / Active sessions / Connected accounts / OAuth consent / API access | 🔧 compose [List variant='structured'](design-system/02-components/list/component.md) + [Table](design-system/02-components/table/component.md) + [Drawer](design-system/02-components/drawer/component.md) for detail |
| API key table / API key reveal / Copy / Secret token field | ✅ [Table](design-system/02-components/table/component.md) + [CopyButton](design-system/02-components/copy-button/component.md) for the value + 🎭 [Input type='password'](design-system/02-components/input/component.md) for reveal |
| Webhook endpoint table / event selector / delivery log | 🔧 [DataGrid](design-system/02-components/data-grid/component.md) + [Combobox](design-system/02-components/combobox/component.md) + [Timeline](design-system/02-components/timeline/component.md) |
| Integration card / marketplace / setup wizard / connected integration status / reconnect banner | 🔧 [Card](design-system/02-components/card/component.md) + [Stepper](design-system/02-components/stepper/component.md) + [Banner](design-system/02-components/banner/component.md) + [Alert](design-system/02-components/alert/component.md) |

## O. Search & filter

| Audit item | Lumen home |
|---|---|
| Search results page / suggestions / recent / saved | 🔧 [SearchField](design-system/02-components/search-field/component.md) + [List](design-system/02-components/list/component.md) + [Popover](design-system/02-components/popover/component.md) |
| Global command palette | 🔧 [SearchField variant='command'](design-system/02-components/search-field/component.md) + [Dialog](design-system/02-components/dialog/component.md) + [Kbd](design-system/02-components/kbd/component.md) shortcut hint + audit-dashboard's `command-palette.tsx` reference impl |
| Keyboard shortcut overlay / cheat sheet | 🔧 [Dialog](design-system/02-components/dialog/component.md) + [Kbd](design-system/02-components/kbd/component.md) |
| Quick action launcher / Recent items / Favorites / Starred / Pin / Recently viewed | 🎭 [DropdownMenu](design-system/02-components/dropdown-menu/component.md) + [List](design-system/02-components/list/component.md) variants |
| Saved view selector / Saved filters / Advanced filters / Filter builder / Query builder / Rule builder / Segment builder / Audience builder / Formula builder | 🎭 [Combobox](design-system/02-components/combobox/component.md) + [Tag](design-system/02-components/tag/component.md) + [Popover](design-system/02-components/popover/component.md) — full QueryBuilder is 📅 future (v0.13+) |
| Search results / suggestions / no-results recovery | 🔧 [SearchField](design-system/02-components/search-field/component.md) + [Popover](design-system/02-components/popover/component.md) + [EmptyState](design-system/02-components/empty-state/component.md) |

## P. Activity, notifications, collaboration

| Audit item | Lumen home |
|---|---|
| Activity feed / log / Audit log | ✅ [Timeline](design-system/02-components/timeline/component.md) + [List](design-system/02-components/list/component.md) |
| Changelog panel / Version history / Revision comparison / Diff viewer | 🔧 [List](design-system/02-components/list/component.md) + [CodeBlock](design-system/02-components/code-block/component.md) — full DiffViewer 📅 future |
| Approval queue / Review request | 🔧 [List](design-system/02-components/list/component.md) + [Drawer](design-system/02-components/drawer/component.md) |
| Comment thread / Inline comment / Annotation marker | ✅ [CommentThread](design-system/02-components/comment-thread/component.md) |
| Mention picker | 🎭 [Combobox](design-system/02-components/combobox/component.md) triggered by `@` |
| Emoji reaction / Reaction bar | ✅ [ReactionBar](design-system/02-components/reaction-bar/component.md) |
| Presence indicator / Collaborator cursor / Live editing | ✅ [PresenceIndicator](design-system/02-components/presence-indicator/component.md) |
| Conflict resolution dialog | 🎭 [Dialog destructive=true](design-system/02-components/dialog/component.md) |
| Autosave / Save status / Draft / Publish status / Scheduled publish | 🎭 [Badge](design-system/02-components/badge/component.md) with status variants + [LiveDot](design-system/02-components/live-dot/component.md) |
| Notification center / inbox / item / grouping / preferences | ✅ [NotificationCenter](design-system/02-components/notification-center/component.md) |
| Announcement modal / center / banner / What's new panel | 🎭 [Dialog](design-system/02-components/dialog/component.md) + [Banner tone='promo'](design-system/02-components/banner/component.md) |
| Help article preview / Guided tour step / Product checklist / Activation milestone / Achievement badge | 🎭 [CoachMark](design-system/02-components/coach-mark/component.md) + 🎭 [Badge](design-system/02-components/badge/component.md) variants |
| Streak / Points / Level / Referral / Invite reward | 🎭 [Stat](design-system/02-components/stat/component.md) + [Progress](design-system/02-components/progress/component.md) — full Gamification 📅 future |

## Q. Editor / rich text

| Audit item | Lumen home |
|---|---|
| Rich text editor / Markdown editor / WYSIWYG editor | ⏭️ feature-specific — wrap TipTap / Lexical / ProseMirror; Lumen ships the Toolbar + CodeBlock skin |
| Formatting toolbar | ✅ [Toolbar](design-system/02-components/toolbar/component.md) |
| Slash command menu | 🎭 [DropdownMenu](design-system/02-components/dropdown-menu/component.md) triggered by `/` in the AIPromptInput slot |
| Mention autocomplete | 🎭 [Combobox](design-system/02-components/combobox/component.md) triggered by `@` |
| Link editor / Embed block | 🎭 [Popover](design-system/02-components/popover/component.md) anchored to the selected range |
| Attachment list / File preview card / Upload progress row / Validation error / Drop overlay | 🎭 [FileDropzone](design-system/02-components/file-dropzone/component.md) + [List](design-system/02-components/list/component.md) + [Progress](design-system/02-components/progress/component.md) |

## R. Media viewers

| Audit item | Lumen home |
|---|---|
| Document / PDF / Spreadsheet / Slide preview / Image comparison / Audio waveform / Media scrubber / Caption track / Transcript panel / Playback speed / Volume / Fullscreen / Picture-in-picture | ⏭️ feature-specific — wrap real viewers inside Card / Dialog / Drawer; Lumen ships chrome (Toolbar / Slider / Tooltip) |

## S. Loading + lazy

| Audit item | Lumen home |
|---|---|
| Loading shimmer / Content placeholder / Progressive image / Lazy-loaded content / Infinite scroll loader / Load more button | ✅ [Skeleton](design-system/02-components/skeleton/component.md) + 🎭 [Button loading=true](design-system/02-components/button/component.md) |
| Virtualized list / grid / Scroll shadow / Scroll progress / Reading progress / Back to top / Jump to section / In-page search / Section anchor copy | 🔧 [List](design-system/02-components/list/component.md) + [Progress](design-system/02-components/progress/component.md) + [Link](design-system/02-components/link/component.md) + [CopyButton](design-system/02-components/copy-button/component.md). Virtualization is consumer-side (TanStack Virtual). |
| Table row / Chart / Form / Card / Avatar skeleton | 🎭 [Skeleton shape='row\|rect\|card\|circle']](design-system/02-components/skeleton/component.md) |
| Responsive skeleton | 🎭 Skeleton at parent breakpoint; size matches eventual content within 10% |

## T. Accessibility-specific

| Audit item | Lumen home |
|---|---|
| Focus trap | 🧬 baked into Dialog / Drawer / Sheet / Popover (Radix-powered) — see component.json a11y rules |
| Skip link | 🪨 [foundations/accessibility.md](design-system/00-foundations/accessibility.md) — required first focusable inside [Navbar](design-system/02-components/navbar/component.md) (mandatory) |
| Screen-reader-only label | 🧬 Tailwind utility `sr-only` |
| ARIA live region | 🧬 every dynamic component declares its `aria-live` in `component.json` a11y rules |
| High contrast mode | 🪨 [foundations/color.md](design-system/00-foundations/color.md) honors `prefers-contrast: more` |
| Reduced motion variant | 🪨 every animated contract honors `prefers-reduced-motion` (AGENTS.md rule) |
| Large text variant | 🪨 type tokens scale via `clamp()` for Apple HIG dynamic type (per [foundations/spacing.md](design-system/00-foundations/spacing.md) §6.5) |
| Keyboard focus ring | 🪨 AGENTS.md hard rule 11 |
| Keyboard navigation map / Tab order / Accessible name / Touch exploration hint / Screen reader announcement / Contrast checker token | 🪨 [foundations/accessibility.md](design-system/00-foundations/accessibility.md) + per-component a11y rules |
| RTL layout support | 🪨 logical-properties + `dir="rtl"` aware utilities. Lumen tokens are direction-neutral. |
| Localization / Translation status / Locale-aware date+number+currency / Pluralization / Empty translation / Truncated text / Expand text / Read more / Clamp | 🧬 use `Intl.*` + `<time datetime>` in Lumen examples; `line-clamp-N` for truncation |

## U. Tooltips, validation, hints

| Audit item | Lumen home |
|---|---|
| Tooltip delay / Hover intent / Pointer cursor / Disabled reason tooltip / Validation hint / Recovery hint / Inline education note | 🎭 [Tooltip](design-system/02-components/tooltip/component.md) + [ValidationMessage](design-system/02-components/validation-message/component.md) + [Field](design-system/02-components/field/component.md) helper |
| Legal disclaimer / Terms acceptance / Consent checkbox group / Privacy notice / Data retention notice | 🎭 [Checkbox](design-system/02-components/checkbox/component.md) + [Link](design-system/02-components/link/component.md) + [Alert](design-system/02-components/alert/component.md) tone='info' |
| Sensitive data mask / Reveal / Copy / Secure input / Redacted value / Masked account/email/phone | 🎭 [Input type='password'](design-system/02-components/input/component.md) + [CopyButton](design-system/02-components/copy-button/component.md) |
| Verification badge / Verified merchant / Trust center link / Compliance status / SOC 2 / HIPAA / GDPR / Security checklist / Risk warning / Fraud warning / Suspicious activity / Device trust prompt / Session timeout / Idle timeout / Reauth prompt / Admin impersonation / Sandbox mode / Test mode / Production warning / Environment badge / Beta / Alpha / Experimental / Deprecated | 🎭 [Badge](design-system/02-components/badge/component.md) + [Banner tone='sandbox\|warning'](design-system/02-components/banner/component.md) + [Dialog](design-system/02-components/dialog/component.md) for reauth |

## V. Marketing surfaces

| Audit item | Lumen home |
|---|---|
| Hero section / Hero visual / Hero headline block / Hero CTA group / Hero trust row | 🧩 [05-patterns/marketing-landing.md](design-system/05-patterns/marketing-landing.md) + audit-dashboard `<HeroBlock>` |
| Logo cloud | ✅ [LogoCloud](design-system/02-components/logo-cloud/component.md) |
| Social proof strip / Testimonial card / Testimonial carousel / Review card / Rating stars / Press mentions / Partner / Customer logos / Case study card / Awards strip / Stats strip | ✅ [TestimonialCard](design-system/02-components/testimonial-card/component.md) + [LogoCloud](design-system/02-components/logo-cloud/component.md) + [Stat](design-system/02-components/stat/component.md) |
| Feature section / Feature grid / Feature comparison / Benefits row / Use-case section / Product tour / Demo embed / Interactive demo / Product screenshot frame / Browser mockup / Phone mockup / Device mockup / App preview panel / Before-after slider | 🧩 [05-patterns/marketing-landing.md](design-system/05-patterns/marketing-landing.md) + ✅ [PhoneFrame](design-system/02-components/phone-frame/component.md) |
| Pricing table / Pricing card / Pricing toggle / Monthly-yearly toggle / Plan comparison grid / Feature availability matrix | ✅ [PricingCard](design-system/02-components/pricing-card/component.md) + 🎭 [Segmented](design-system/02-components/segmented/component.md) for monthly/yearly + [Table](design-system/02-components/table/component.md) for comparison |
| FAQ section / FAQ accordion group / Objection handling / Guarantee badge / Security badge / Compliance badge / Trust badge | ✅ [Accordion](design-system/02-components/accordion/component.md) + [Badge](design-system/02-components/badge/component.md) |
| Countdown timer / Launch banner / Promo banner / Coupon banner / Exit intent popup | 🎭 [Banner tone='promo\|warning'](design-system/02-components/banner/component.md) + [Dialog](design-system/02-components/dialog/component.md) for exit-intent |
| Lead capture / Newsletter signup / Waitlist / Contact sales / Book demo / Demo scheduling / Calendar booking / Chat widget / Help widget / Support launcher | 🔧 [Form](design-system/02-components/form/component.md) + [Field](design-system/02-components/field/component.md) + ⏭️ embed a real chat widget (Intercom, Help Scout) |
| Knowledge base search / Help center article card / Documentation sidebar / Docs article layout / API reference layout / Endpoint card / Parameter table / Response example block / SDK selector / Language tabs / Sandbox console / API playground / Request builder / Response viewer / Error response viewer / Webhook simulator | 🔧 [SearchField](design-system/02-components/search-field/component.md) + [Card](design-system/02-components/card/component.md) + [Sidebar](design-system/02-components/sidebar/component.md) + [Tabs](design-system/02-components/tabs/component.md) + [CodeBlock](design-system/02-components/code-block/component.md) + [Table](design-system/02-components/table/component.md) — Docs/API pattern 📅 future (v0.13+) |

## W. Commerce

| Audit item | Lumen home |
|---|---|
| Checkout form / Cart drawer / Mini cart / Cart item row / Quantity selector / Variant selector / Product option picker / Size selector / Color swatch selector | ✅ [CartDrawer](design-system/02-components/cart-drawer/component.md) + 🎭 [Segmented](design-system/02-components/segmented/component.md) for size + [ColorPicker variant='swatches'](design-system/02-components/color-picker/component.md) |
| Product image gallery / zoom viewer / media carousel | 🎭 [Carousel](design-system/02-components/carousel/component.md) + [Dialog](design-system/02-components/dialog/component.md) for zoom |
| Product details section / recommendations row / related products grid / Recently viewed / Wishlist button / Save for later / Compare products / Comparison drawer | 🔧 [Card](design-system/02-components/card/component.md) + [List](design-system/02-components/list/component.md) + [Drawer](design-system/02-components/drawer/component.md) |
| Inventory / Low-stock / Backorder / Preorder labels | ✅ [InventoryStatus](design-system/02-components/inventory-status/component.md) |
| Shipping estimator / Delivery date / Store pickup / Pickup availability / Address validation | 🔧 [Form](design-system/02-components/form/component.md) + [Field](design-system/02-components/field/component.md) + [Combobox](design-system/02-components/combobox/component.md) |
| Coupon code field / Discount summary / Order summary / Tax summary / Shipping method / Payment method | 🔧 [Input](design-system/02-components/input/component.md) + [RadioGroup](design-system/02-components/radio-group/component.md) + [List](design-system/02-components/list/component.md) |
| Express checkout / Apple Pay / Google Pay / Shop Pay / PayPal / Klarna / Afterpay buttons | 🎭 [Button](design-system/02-components/button/component.md) compositions per provider — audit-dashboard `commerce.tsx` ships the references |
| Gift card / Loyalty points / Rewards balance / Referral widget | 🔧 [Card](design-system/02-components/card/component.md) + [Stat](design-system/02-components/stat/component.md) + [Progress](design-system/02-components/progress/component.md) |
| Order confirmation / Order tracking timeline / Return request / Refund status / Exchange flow / Subscription product controls / Subscribe-and-save / Bundle builder / Bundle card / Upsell / Cross-sell / Add-on selector / Checkout progress / Checkout step header / Abandoned cart prompt | 🔧 [Timeline](design-system/02-components/timeline/component.md) + [Stepper](design-system/02-components/stepper/component.md) + [Form](design-system/02-components/form/component.md) + [Banner](design-system/02-components/banner/component.md) + 🧩 [05-patterns/ecommerce-product.md](design-system/05-patterns/ecommerce-product.md) |
| Shopify admin embedded frame / resource picker / product picker / collection picker / customer picker / order picker / App Bridge title bar / contextual save bar / resource list / index table / choice list / account connection card | ⏭️ Shopify-platform-specific — wrap App Bridge with Lumen tokens; see [03-platforms/shopify-liquid/](design-system/03-platforms/shopify-liquid/) |
| Merchant onboarding checklist / Store setup checklist / Sales channel card / App setup guide / App billing confirmation / App uninstall feedback / App permissions | 🔧 [Stepper](design-system/02-components/stepper/component.md) + [Dialog](design-system/02-components/dialog/component.md) + [Card](design-system/02-components/card/component.md) |

## X. Responsive / breakpoint behavior

| Audit item | Lumen home |
|---|---|
| Responsive breakpoint rules / Mobile-first / Desktop-first / Adaptive / Fluid / Fixed / Max-width / Min-width / Responsive columns / Auto-fit grid / Auto-fill grid / Masonry / Container queries / Responsive image source / Art-directed image / Retina image | 🪨 [foundations/spacing.md](design-system/00-foundations/spacing.md) §5 + 🧩 [05-patterns/](design-system/05-patterns/) per surface |
| Touch / Mouse / Tablet / Foldable / Landscape / Portrait / Desktop dense layout variants | 🧩 [05-patterns/mobile-primary.md](design-system/05-patterns/mobile-primary.md) + [saas-dashboard.md](design-system/05-patterns/saas-dashboard.md) + [marketing-landing.md](design-system/05-patterns/marketing-landing.md) |
| Responsive nav collapse / Priority navigation / Overflow nav / More menu / Hamburger drawer / Off-canvas / Slide-out / Nested / Secondary / Local / Utility / Footer / Sitemap / Legal / Social links row | 🎭 [Navbar variant='mobile'](design-system/02-components/navbar/component.md) + [Sidebar mode='auto'](design-system/02-components/sidebar/component.md) + [DropdownMenu](design-system/02-components/dropdown-menu/component.md) overflow pattern |
| Mobile app install banner / PWA install prompt / Cookie consent / Privacy preference center / GDPR consent / Age gate / Region gate / Content warning gate | 🎭 [Banner](design-system/02-components/banner/component.md) + [Dialog](design-system/02-components/dialog/component.md) compositions |

## Y. Error / status pages

| Audit item | Lumen home |
|---|---|
| Maintenance page / 404 / 403 / 500 / Error recovery / Broken link / Unauthorized / Forbidden / Locked account / Suspended account / Archived item / Deleted item / Restorable deleted / Rate limit / Timeout / Slow connection / No permission / No data / No access / No internet | 🔧 [EmptyState](design-system/02-components/empty-state/component.md) — every error page composes EmptyState illustration + headline + action. Audit-dashboard `templates.tsx` `<ErrorPage>` + `<MaintenanceCard>` are the patterns. |
| Syncing / Sync failed / Conflict / Partial success / Pending / Queued / Processing / Completed / Cancelled / Failed / Retry / Optimistic update | 🎭 [Badge](design-system/02-components/badge/component.md) status variants + [Toast](design-system/02-components/toast/component.md) for transient + [Alert](design-system/02-components/alert/component.md) for persistent |
| Undo action / Redo / Undo snackbar / Restore / Dismiss / Close affordance / Clear / Reset filters / Apply filters / Save view / Share view / Copy link / Invite link / Download / Upload / Print / Duplicate / Archive / Restore / Delete confirmation / Destructive guard / Type-to-confirm / Multi-step confirmation / Safety interlock / Confirmation checkbox | 🎭 [Button](design-system/02-components/button/component.md) intents + [Snackbar](design-system/02-components/snackbar/component.md) for Undo + [Dialog destructive=true](design-system/02-components/dialog/component.md) with type-to-confirm |

## Z. Disclosure & hierarchy

| Audit item | Lumen home |
|---|---|
| Progressive disclosure / Expandable details row / Nested row | 🎭 [Accordion](design-system/02-components/accordion/component.md) + [TreeView](design-system/02-components/tree-view/component.md) |
| File tree / Folder tree / Navigation tree | ✅ [TreeView](design-system/02-components/tree-view/component.md) |
| Organization chart | ⏭️ feature-specific; not a primitive |
| Kanban board / card / column | ✅ [Kanban](design-system/02-components/kanban/component.md) |
| Drag-and-drop dropzone / Sortable list / Reorder handle / Resize handle / Splitter handle | ✅ [FileDropzone](design-system/02-components/file-dropzone/component.md) for files; 🔧 sortable list = consumer-side (dnd-kit) over a [List](design-system/02-components/list/component.md); resize handle in [Panel variant='inspector' resizable=true](design-system/02-components/panel/component.md) |

## AA. Calendar / scheduling

| Audit item | Lumen home |
|---|---|
| Calendar agenda / week / month / resource view / Scheduler grid / Availability picker / Time slot picker / Recurrence editor / Reminder editor / Event detail popover / Booking slot card / Capacity indicator | ✅ [Calendar](design-system/02-components/calendar/component.md) + 🎭 [Popover](design-system/02-components/popover/component.md) for event detail + 🔧 specialized recurrence editor 📅 future |

## BB. Data tables (advanced)

| Audit item | Lumen home |
|---|---|
| Data table toolbar / Column menu / Column visibility / Column reorder / Column resize / Frozen / Sticky column / Row expansion / Row selection / Row action menu / Cell editor / Inline edit field / Editable cell / Density / Sort indicator / Filter chip row / Summary row / Grouped row / Aggregated row / Subtotal row / Grand total row / Pivot table / Pivot controls / Drill-down / Drill-through | ✅ [DataGrid](design-system/02-components/data-grid/component.md) |
| Data freshness indicator / Last updated timestamp / Refresh button / Auto-refresh toggle / Live data indicator / Streaming data row / Real-time feed item | ✅ [LiveDot](design-system/02-components/live-dot/component.md) + [RateTicker](design-system/02-components/rate-ticker/component.md) + 🎭 [IconButton](design-system/02-components/icon-button/component.md) (Refresh) |
| KPI delta / Sparkline / Bullet chart / Candlestick / Box plot / Radar / Treemap / Sankey / Network graph / Chord / Histogram / Waterfall / Cohort table / Retention grid / Funnel step row / Conversion metric / Goal progress ring / Donut progress / Radial progress / Meter / Health score card / Risk score badge / SLA indicator / Status dot / Status pill / Severity indicator / Priority flag / Confidence score / Trend arrow / Variance indicator / Threshold marker / Annotation line | ✅ [Chart kind='...']](design-system/02-components/chart/component.md) + [KpiCard](design-system/02-components/kpi-card/component.md) + [Sparkline](design-system/02-components/sparkline/component.md) + [Trend](design-system/02-components/trend/component.md) + [LiveDot](design-system/02-components/live-dot/component.md) + [Badge](design-system/02-components/badge/component.md) variants. Audit-dashboard `charts.tsx` ships every chart kind as a reference. |
| Chart legend / controls / tooltip / brush selector / zoom / export | 🎭 [Chart](design-system/02-components/chart/component.md) sub-slots + [Popover](design-system/02-components/popover/component.md) tooltip skin |
| Dashboard layout editor / widget picker / widget resize / widget settings / template selector / Report builder / preview / scheduler / email report settings / saved report list / alert rule builder / alert threshold editor / alert recipient selector / incident card / incident timeline / status page / uptime monitor card / service health table / deployment status / release notes / roadmap card / feature request board / voting / feedback widget / NPS / CSAT survey / poll / inline survey / satisfaction rating / thumbs up-down / bug report / screenshot feedback / session replay link / user journey map / funnel analysis / cohort analysis / experiment results / A/B test setup / variant card / experiment status / feature flag toggle / feature flag targeting / rollout percentage / kill switch | 🔧 compositions of the above primitives. Lumen's discipline: build it from Card + Panel + Toolbar + Chart + Form. Component-level recipes captured in `05-patterns/` per surface. |

## CC. AI surfaces

| Audit item | Lumen home |
|---|---|
| Model selector / AI prompt input / Prompt template picker / Prompt history | ✅ [AIPromptInput](design-system/02-components/ai-prompt-input/component.md) + 🎭 [Select](design-system/02-components/select/component.md) inside the modelSelector slot + [DropdownMenu](design-system/02-components/dropdown-menu/component.md) for templates |
| AI suggestion card / AI rewrite action / AI summary box / AI citation card / AI confidence label / AI generated badge / AI loading shimmer / AI thinking indicator / AI source list / AI feedback buttons | ✅ [AISuggestion](design-system/02-components/ai-suggestion/component.md) + [CitationCard](design-system/02-components/citation-card/component.md) + [AIBadge](design-system/02-components/ai-badge/component.md) (kinds: generated / summary / confidence / thinking) |
| Copilot side panel | 🔧 [Drawer side='right'](design-system/02-components/drawer/component.md) wrapping a vertical stack of [ChatBubble](design-system/02-components/chat-bubble/component.md)s + [AIPromptInput](design-system/02-components/ai-prompt-input/component.md) sticky footer |
| Chat message bubble / Chat composer / Chat attachment chip / Chat typing indicator / Chat read receipt / Chat timestamp divider / Chat thread list / Chat conversation panel / Chat handoff banner | ✅ [ChatBubble](design-system/02-components/chat-bubble/component.md) (streaming variant doubles as typing indicator) + 🎭 [Tag](design-system/02-components/tag/component.md) (attachment chip) + 🎭 [Banner](design-system/02-components/banner/component.md) (handoff) |

## DD. What we intentionally don't ship as a primitive

- **Real-app domain logic** — order processing, payments, integrations. Lumen ships the chrome; the consumer ships the logic.
- **Specialized editors** — rich text, code, image, video. Wrap TipTap / Lexical / Monaco / Mux inside Card / Drawer with Lumen tokens.
- **Native player UI for video/audio** — same reasoning. Lumen ships the Toolbar / Slider / Tooltip needed to skin them, not the player.
- **Brand-specific payment buttons (Apple Pay / Google Pay / Shop Pay)** — provider-mandated chrome. Lumen ships Button compositions in audit-dashboard `commerce.tsx` references, but the contract is bound by the provider's brand kit.
- **Operating-system UI** (status bar, FaceID, app store install banners on iOS) — OS-owned; Lumen only ships decorative mockup variants (PhoneFrame + StatusBar) for marketing.
- **Diagrams and visualizations beyond standard chart types** (org charts, network graphs, Gantt) — pull a real library and skin with Lumen tokens.

## EE. What's planned for v0.13+

- **QueryBuilder** — visual + structured filter / rule / segment builder.
- **DiffViewer** — side-by-side or unified diff with token-tinted highlights.
- **GanttChart** — for project timelines.
- **MapBox / Leaflet skin** — Lumen-tokenized map base layer recipe.
- **Docs API pattern** — composed surface (Sidebar + Tabs + CodeBlock + Endpoint card + Parameter table).
- **Gamification kit** — streak, points, level, badge surface.

---

## Summary

- **98 component contracts** ship with Lumen as of v0.12.6.
- **14 foundations** + **9 content guides** + **7 patterns** + **9 platform guides** + **5 token primitive files** + **7 token semantic files** + **19 token component files** complete the surface.
- **Every primitive in the audit list either maps to a contract, a foundation, a pattern, a content guide, a token, or a documented out-of-scope decision.** No gap.

If you're an LLM generating UI: read `_registry/registry.json` for the canonical contract index. Use `component.json` over `component.md` when you only need the contract — it's ~80% smaller in tokens and unambiguous.
