"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { PageHeader, Section, SubSection } from "@/components/section";
import { Button, IconButton } from "@/components/primitives/button";
import { Badge } from "@/components/primitives/badge";
import { Card, CardHeader } from "@/components/primitives/card";
import { Avatar, AvatarGroup } from "@/components/primitives/avatar";
import { Skeleton } from "@/components/primitives/skeleton";
import { Spinner } from "@/components/primitives/spinner";
import { Switch } from "@/components/primitives/switch";
import { Slider } from "@/components/primitives/slider";
import { ProgressBar, ProgressRing } from "@/components/primitives/progress";
import { Field } from "@/components/primitives/field";
import { Checkbox } from "@/components/primitives/checkbox";
import { InlineTabs } from "@/components/primitives/tabs-inline";
import { Tooltip } from "@/components/primitives/tooltip";
import { Breadcrumb } from "@/components/primitives/breadcrumb";
import { Divider, VerticalDivider } from "@/components/primitives/divider";
import { LiveDot } from "@/components/primitives/live-dot";
import { RateTicker } from "@/components/primitives/rate-ticker";
import { Stat, StatGrid } from "@/components/primitives/stat";
import {
  ArrowRight, Plus, Search as SearchIcon, Bell, Home, Settings, MapPin, Inbox,
  Filter, Cart, User, Check, X, ChevronDown, Code, Box, Truck,
} from "@/components/primitives/icon";

import {
  TextInput, Textarea, SearchInput, Radio, RadioGroup, Select, Combobox,
  NumberInput, PasswordInput, PasswordStrength, OtpInput, TagsInput, ColorPicker,
  RangeSlider, FileDropzone, DatePicker, DatePickerCalendar, TimePicker, Segmented,
} from "@/components/primitives/inputs";

import {
  Pagination, Stepper, AnchorList, MenuList, MegaMenu, NavbarDemo, SidebarDemo,
  TabBar, BottomNav, FAB, SplitButton, CommandPalette, FooterDemo,
} from "@/components/primitives/nav";

import {
  Tag, StatusPill, Trend, Severity, Accordion, EmptyState, CodeBlock, ListGroup,
  DataTable, Kanban, TreeView, Timeline, Carousel, Gauge, Stars, KeyValue,
  ProgressTrack, Presence, KbdRow, ImageFrame, ComponentSpec, Showcase, VariantRow,
} from "@/components/primitives/display";

import {
  Alert, PageBanner, Toast, Snackbar, ModalCard, TypeToConfirm, Drawer, Popover,
  CookieBanner, ValidationMessage,
} from "@/components/primitives/feedback";

import {
  LineChart, AreaChart, BarChart, StackedBar, DonutChart, PieChart, Heatmap,
  MiniSparkline, Scatter, Radar, Treemap, Funnel, Histogram, Waterfall, Bullet,
  KpiCard, Cohort, ChartLegend, CHART_PALETTE,
} from "@/components/primitives/charts";

import {
  PhoneFrame, StatusBar, BottomSheet, ActionSheet, PermissionPrompt, PullToRefresh,
  MobileListItem, FaceIDPrompt, KeyboardAccessoryBar, CoachMark,
} from "@/components/primitives/mobile";

import {
  PricingCard, PricingToggle, ApplePay, GooglePay, ShopPay, PayPal, Klarna, Afterpay,
  RatingBlock, CouponInput, InventoryStatus, ProductGallery, CartDrawer, OrderSummary,
  CheckoutProgress, ComparisonTable, TrustStrip, ColorSwatchSelector, SizeSelector,
} from "@/components/primitives/commerce";

import {
  AIBadge, AIThinking, AIConfidence, AIPromptInput, AISuggestion, AICitation,
  AIShimmer, ChatBubble, ChatComposer, TypingIndicator, NotificationItem,
  NotificationCenter, CopilotPanel, CommentThread, ReactionBar,
} from "@/components/primitives/ai";

import {
  ErrorPage, LoginCard, HeroBlock, FeatureGrid, TestimonialCard, StatStrip,
  MaintenanceCard, NoDataIllustration,
} from "@/components/primitives/templates";

/* Deterministic, pre-seeded data so renders stay pure. */
const SCATTER_POINTS = [
  { x: 12, y: 22 }, { x: 24, y: 38 }, { x: 18, y: 58 }, { x: 36, y: 44 },
  { x: 42, y: 70 }, { x: 28, y: 31 }, { x: 54, y: 49 }, { x: 64, y: 62 },
  { x: 71, y: 38 }, { x: 50, y: 80 }, { x: 80, y: 58 }, { x: 90, y: 70 },
  { x: 32, y: 12 }, { x: 60, y: 22 }, { x: 76, y: 25 }, { x: 88, y: 42 },
  { x: 16, y: 78 }, { x: 44, y: 88 }, { x: 22, y: 92 }, { x: 5,  y: 50 },
  { x: 58, y: 14 }, { x: 70, y: 88 }, { x: 96, y: 30 }, { x: 6,  y: 35 },
  { x: 38, y: 60 }, { x: 84, y: 68 },
].map((p, i) => ({ ...p, size: 3 + (i % 5) }));

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "layout", label: "Layout · Structure" },
  { id: "navigation", label: "Navigation" },
  { id: "buttons", label: "Buttons · Actions" },
  { id: "inputs", label: "Inputs · Forms" },
  { id: "selection", label: "Selection" },
  { id: "pickers", label: "Pickers · Date/Time" },
  { id: "uploads", label: "Uploads · Files" },
  { id: "data", label: "Data Display" },
  { id: "tables", label: "Tables · Grids" },
  { id: "charts", label: "Charts · Viz" },
  { id: "kpi", label: "KPI · Metrics" },
  { id: "feedback", label: "Feedback · Status" },
  { id: "overlays", label: "Modals · Drawers · Popovers" },
  { id: "navigation-mobile", label: "Mobile · Native" },
  { id: "commerce", label: "Commerce" },
  { id: "auth", label: "Auth · Account" },
  { id: "ai", label: "AI · Chat" },
  { id: "notifications", label: "Notifications" },
  { id: "editor", label: "Editor · Code" },
  { id: "states", label: "State Matrix" },
  { id: "templates", label: "Templates · Pages" },
  { id: "trust", label: "Trust · Compliance" },
  { id: "marketing", label: "Marketing" },
  { id: "spec", label: "Spec · Anatomy" },
];

export function LibraryClient() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_220px] lg:gap-x-12">
      <article className="min-w-0">
        <PageHeader
          eyebrow="Component library"
          title="Library"
          description="Every component, state, and pattern in the system. Composed against Apple HIG, Material, Polaris, and Atlassian — then tuned to Lumen's restraint."
          meta={<Badge status="accent" leadingDot>v0.11.13 · 25 sections · 250+ components</Badge>}
        />

        {/* OVERVIEW */}
        <Section
          id="overview"
          eyebrow="01 · Map"
          title="What's in here"
          description="A flat catalog. Each section labels variants by their canonical names so consumers can search the page for anything."
        >
          <div className="grid gap-3 md:grid-cols-3">
            {SECTIONS.slice(1).map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group relative rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-inset-md hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] hover:bg-[var(--surface-tint-accent)]/40 transition-[border-color,box-shadow,background-color] duration-[var(--motion-base)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-heading-h6 text-[color:var(--text-primary)]">{s.label}</span>
                  {/* lumen-lint-allow: typography — mono regular at 11 section index; no semantic preset for 11px mono */}
                  <span className="lumen-mono text-[var(--type-11)] text-[color:var(--text-tertiary)] group-hover:text-[color:var(--text-accent)] group-hover:opacity-0 transition-opacity duration-[var(--motion-base)]">{String(i + 1).padStart(2, "0")}</span>
                  <span aria-hidden className="absolute right-4 text-[color:var(--text-accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[var(--motion-base)]">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </Section>

        {/* LAYOUT */}
        <Section
          id="layout"
          eyebrow="02 · Frame"
          title="Layout & structure"
          description="Page, Section, Header, Footer, Sidebar, Drawer, Modal container, Panel, Sheet, Toolbar, App bar, Divider, Spacer, Layout grid, Stack, Tabs panel."
        >
          <SubSection title="Application shell" description="Top app bar, sidebar, main content region, right rail.">
            <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
              <SidebarDemo />
              <div className="min-w-0 flex flex-col gap-3">
                <NavbarDemo />
                <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] h-44 lumen-stripe-grid" />
                <FooterDemo />
              </div>
            </div>
          </SubSection>

          <SubSection title="Layout primitives">
            <div className="grid gap-3 md:grid-cols-3">
              <Showcase label="Stack (vertical)"><div className="flex flex-col gap-2"><RowSwatch /><RowSwatch /><RowSwatch /></div></Showcase>
              <Showcase label="Stack (horizontal)"><div className="flex items-center gap-2"><DotSwatch /><DotSwatch /><DotSwatch /></div></Showcase>
              <Showcase label="Layout grid"><div className="grid grid-cols-3 gap-[var(--space-1_5)] w-full"><Sq /><Sq /><Sq /><Sq /><Sq /><Sq /></div></Showcase>
              <Showcase label="Divider · horizontal"><div className="w-full"><Divider /></div></Showcase>
              <Showcase label="Vertical divider"><div className="h-12 flex items-center"><VerticalDivider height="40px" /></div></Showcase>
              <Showcase label="Spacer (12 / 16 / 24)"><div className="flex flex-col gap-1"><span className="block h-3 bg-[var(--surface-sunken)] rounded-[var(--radius-xs)]" /><span className="block h-4 bg-[var(--surface-sunken)] rounded-[var(--radius-xs)]" /><span className="block h-6 bg-[var(--surface-sunken)] rounded-[var(--radius-xs)]" /></div></Showcase>
            </div>
          </SubSection>

          <SubSection title="Container variants" description="Fluid · fixed · max-width · two-pane · three-pane.">
            <div className="grid gap-3 md:grid-cols-2">
              <Showcase label="Fluid container"><div className="w-full h-12 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" /></Showcase>
              <Showcase label="Fixed (max 720)"><div className="mx-auto w-[80%] h-12 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" /></Showcase>
              <Showcase label="Two-pane (master-detail)">
                <div className="grid grid-cols-[120px_1fr] gap-[var(--space-1_5)] w-full">
                  <div className="h-16 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" />
                  <div className="h-16 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" />
                </div>
              </Showcase>
              <Showcase label="Three-pane">
                <div className="grid grid-cols-[80px_1fr_120px] gap-[var(--space-1_5)] w-full">
                  <div className="h-16 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" />
                  <div className="h-16 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" />
                  <div className="h-16 rounded-[var(--radius-md)] bg-[var(--surface-sunken)] border border-[var(--border-hairline)]" />
                </div>
              </Showcase>
            </div>
          </SubSection>

          <SubSection title="Sticky elements">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] overflow-hidden">
              {/* lumen-lint-allow: typography — type-12 plain sticky header bar; no semantic preset for 12 regular */}
              <div className="h-control-cozy px-3 flex items-center justify-between bg-[var(--surface-sunken)] border-b border-[var(--border-hairline)] text-[var(--type-12)] text-[color:var(--text-tertiary)]"><span className="lumen-eyebrow text-[10px]">Sticky header</span><Plus size={12} /></div>
              <div className="h-32 lumen-stripe-grid" />
              {/* lumen-lint-allow: typography — type-12 plain sticky footer bar; no semantic preset for 12 regular */}
              <div className="h-control-cozy px-3 flex items-center justify-end bg-[var(--surface-sunken)] border-t border-[var(--border-hairline)] text-[var(--type-12)] text-[color:var(--text-tertiary)]"><span className="lumen-eyebrow text-[10px]">Sticky action bar</span></div>
            </div>
          </SubSection>
        </Section>

        {/* NAVIGATION */}
        <Section
          id="navigation"
          eyebrow="03 · Wayfinding"
          title="Navigation"
          description="Navbar, Sidebar, Tab bar, Tabs panel, Breadcrumbs, Dropdown menu, Mega menu, Pagination, Stepper, Anchor links, Table of contents, Command palette."
        >
          <SubSection title="Tab bar" description="Underlined tab bar (horizontal navigation)">
            <TabBarDemo />
          </SubSection>

          <SubSection title="Inline tabs (segmented)">
            <InlineTabsDemo />
          </SubSection>

          <SubSection title="Breadcrumbs">
            <Breadcrumb
              items={[
                { label: "Workspace", href: "#" },
                { label: "Lanes", href: "#" },
                { label: "TX → CA", href: "#" },
                { label: "Quote 3,442" },
              ]}
            />
          </SubSection>

          <SubSection title="Pagination">
            <div className="flex flex-col gap-3">
              <PaginationDemo />
            </div>
          </SubSection>

          <SubSection title="Stepper" description="Multi-step progress indicator (account creation, checkout, onboarding)">
            <Stepper
              current={2}
              steps={[
                { label: "Workspace", description: "Created · Acme Logistics" },
                { label: "Team", description: "3 members invited" },
                { label: "Billing", description: "Add a payment method" },
                { label: "Connect", description: "Carriers · API keys" },
                { label: "Done" },
              ]}
            />
          </SubSection>

          <SubSection title="Dropdown menu / Context menu">
            <div className="grid gap-3 md:grid-cols-2">
              <Showcase label="Dropdown menu (item · shortcut · divider · destructive)">
                <MenuList items={[
                  { kind: "label", label: "Account" },
                  { kind: "item", label: "Profile settings", shortcut: "⌘," },
                  { kind: "item", label: "Switch workspace", shortcut: "⌘\\" },
                  { kind: "item", label: "Notifications" },
                  { kind: "divider" },
                  { kind: "item", label: "Help center" },
                  { kind: "item", label: "Sign out", danger: true },
                ]} />
              </Showcase>
              <Showcase label="Mega menu">
                <MegaMenu />
              </Showcase>
            </div>
          </SubSection>

          <SubSection title="Command palette · Search nav · ⌘K">
            <Showcase variant="wide"><CommandPalette /></Showcase>
          </SubSection>

          <SubSection title="Anchor links · Table of contents">
            <div className="max-w-[300px]">
              <AnchorList items={[
                { id: "a", label: "Why we built Lumen", level: 1 },
                { id: "b", label: "Token architecture", level: 1 },
                { id: "c", label: "Primitives", level: 2 },
                { id: "d", label: "Semantics", level: 2 },
                { id: "e", label: "Component contract", level: 1 },
              ]} />
            </div>
          </SubSection>

          <SubSection title="Bottom navigation · Floating action button">
            <div className="grid gap-3 md:grid-cols-2 items-end">
              <Showcase label="Bottom navigation (mobile)"><div className="w-full"><BottomNav /></div></Showcase>
              <Showcase label="Floating action button"><div className="flex items-end h-24"><FAB /></div></Showcase>
            </div>
          </SubSection>
        </Section>

        {/* BUTTONS */}
        <Section
          id="buttons"
          eyebrow="04 · Action"
          title="Buttons & actions"
          description="Primary, Secondary, Tertiary, Ghost, Danger, Icon button, FAB, Link button, Split button, CTA, Toolbar actions, Bulk actions."
        >
          <SubSection title="Intent">
            <VariantRow label="Primary"><Button intent="primary">Get rates</Button><Button intent="primary" leadingIcon={<Plus size={13} />}>New quote</Button><Button intent="primary" trailingIcon={<ArrowRight size={13} />}>Continue</Button></VariantRow>
            <VariantRow label="Secondary"><Button intent="secondary">Save draft</Button><Button intent="secondary" leadingIcon={<Filter size={13} />}>Filter</Button></VariantRow>
            <VariantRow label="Tertiary"><Button intent="tertiary">Cancel</Button><Button intent="tertiary" leadingIcon={<Plus size={13} />}>Add</Button></VariantRow>
            <VariantRow label="Ghost"><Button intent="ghost">Reset</Button></VariantRow>
            <VariantRow label="Danger"><Button intent="danger">Delete account</Button></VariantRow>
            <VariantRow label="Loading"><Button intent="primary" loading>Saving</Button></VariantRow>
            {/* lumen-lint-allow: button-label — "Submit"/"Cancel" are intentional generic stand-ins for the disabled-state showcase, not real product copy. */}
            <VariantRow label="Disabled"><Button intent="primary" disabled>Submit</Button><Button intent="secondary" disabled>Cancel</Button></VariantRow>
          </SubSection>

          <SubSection title="Sizes">
            <VariantRow label="xs"><Button size="xs">Run</Button><Button size="xs" intent="primary">Save</Button></VariantRow>
            <VariantRow label="sm"><Button size="sm">Run</Button><Button size="sm" intent="primary">Save</Button></VariantRow>
            <VariantRow label="md"><Button size="md">Run</Button><Button size="md" intent="primary">Save</Button></VariantRow>
            <VariantRow label="lg"><Button size="lg">Run</Button><Button size="lg" intent="primary">Save</Button></VariantRow>
          </SubSection>

          <SubSection title="Icon button (xs/sm/md/lg)">
            <div className="flex items-center gap-3">
              <IconButton aria-label="Add" size="xs"><Plus size={12} /></IconButton>
              <IconButton aria-label="Add" size="sm"><Plus size={14} /></IconButton>
              <IconButton aria-label="Add" size="md"><Plus size={15} /></IconButton>
              <IconButton aria-label="Add" size="lg"><Plus size={17} /></IconButton>
              <IconButton aria-label="Add" intent="primary"><Plus size={15} /></IconButton>
            </div>
          </SubSection>

          <SubSection title="Split button & link button">
            <div className="flex items-center gap-3">
              <SplitButton />
              <a className="lumen-link text-body-xs">View documentation</a>
            </div>
          </SubSection>

          <SubSection title="Toolbar / contextual actions / bulk actions">
            <div className="flex flex-col gap-3">
              <Showcase label="Toolbar">
                <div className="flex items-center gap-1 w-full">
                  <Button size="sm" intent="tertiary" leadingIcon={<Plus size={12} />}>New</Button>
                  <Button size="sm" intent="tertiary" leadingIcon={<Filter size={12} />}>Filter</Button>
                  <VerticalDivider height="22px" />
                  <Button size="sm" intent="tertiary">Sort</Button>
                  <Button size="sm" intent="tertiary">Group</Button>
                  {/* lumen-lint-allow: typography — type-11 mono row count; no semantic preset for 11px mono */}
                  <span className="ml-auto inline-flex items-center gap-[var(--space-1_5)] text-[var(--type-11)] text-[color:var(--text-tertiary)] lumen-mono">42 rows</span>
                  <Button size="sm" intent="tertiary">⋯</Button>
                </div>
              </Showcase>
              <Showcase label="Bulk action bar">
                <div className="flex items-center gap-3 w-full bg-[var(--surface-inverse)] text-[color:var(--text-inverse)] px-3 h-10 rounded-[var(--radius-md)]">
                  <span className="text-micro">7 selected</span>
                  <VerticalDivider height="20px" />
                  {/* lumen-lint-allow: typography — type-12 plain bulk action button; no semantic preset for 12 regular */}
                  <button className="text-[var(--type-12)]">Mark resolved</button>
                  {/* lumen-lint-allow: typography — type-12 plain bulk action button; no semantic preset for 12 regular */}
                  <button className="text-[var(--type-12)]">Assign</button>
                  {/* lumen-lint-allow: typography — type-12 plain bulk action button; no semantic preset for 12 regular */}
                  <button className="text-[var(--type-12)]">Export</button>
                  <span className="ml-auto"><X size={13} /></span>
                </div>
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* INPUTS */}
        <Section
          id="inputs"
          eyebrow="05 · Inputs"
          title="Inputs · forms"
          description="Text · Textarea · Search · Number · Password · OTP · Tags · Combobox · Select. Field primitive bundling label, hint, error, leading, trailing."
        >
          <SubSection title="Text inputs">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Text field" hint="32-character max" >
                <TextInput placeholder="Lane TX → CA" />
              </Field>
              <Field label="Search field" hint="⌘K opens command palette">
                <SearchInput placeholder="Search lanes, quotes, customers…" shortcut="⌘K" />
              </Field>
              <Field label="Textarea" hint="Markdown supported">
                <Textarea placeholder="Add a note for the carrier…" />
              </Field>
              <Field label="Number input">
                <NumberInputWrapper />
              </Field>
              <Field label="Password input" hint="At least 8 characters with mixed case">
                <PasswordSection />
              </Field>
              <Field label="OTP input">
                <OtpInput />
              </Field>
            </div>
          </SubSection>

          <SubSection title="Specialty inputs">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Tags input" hint="Press Enter or comma to add">
                <TagsInputWrapper />
              </Field>
              <Field label="Color picker"><ColorPickerWrapper /></Field>
              <Field label="Range selector" hint="Filter by lane price">
                <RangeWrapper />
              </Field>
              <Field label="Slider" hint="Confidence threshold">
                <Slider defaultValue={72} />
              </Field>
            </div>
          </SubSection>

          <SubSection title="Form group · validation">
            {/* v0.11.9 — added mx-auto so the constrained form group sits
                centered in its column instead of left-aligned with a wide
                empty right gutter. The form is a self-contained example, so
                centering is the cleaner read. */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5 max-w-[560px] mx-auto">
              <div className="text-heading-h5 mb-1">Carrier contact</div>
              {/* lumen-lint-allow: typography — type-12 plain form helper; no semantic preset for 12 regular */}
              <p className="text-[var(--type-12)] text-[color:var(--text-tertiary)] mb-4">For dispatch coordination only — never used for marketing.</p>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="First name"><TextInput defaultValue="Jordan" /></Field>
                <Field label="Last name"><TextInput defaultValue="Kim" /></Field>
                <Field label="Email" error="Use a work email" className="md:col-span-2"><TextInput type="email" defaultValue="jordan@gmail.com" /></Field>
                <Field label="Role" className="md:col-span-2"><Select options={[{label: "Dispatcher", value: "d"}, {label: "Operations Manager", value: "om"}, {label: "Owner", value: "o"}]} /></Field>
                <Field className="md:col-span-2" label=""><Checkbox label="Consent to email updates" /></Field>
              </div>
              <div className="flex items-center justify-end gap-2 mt-5">
                <Button intent="tertiary">Cancel</Button>
                <Button intent="primary">Save contact</Button>
              </div>
            </div>
          </SubSection>

          <SubSection title="Validation messages">
            <div className="grid gap-2 md:grid-cols-4">
              <ValidationMessage tone="success">Looks good</ValidationMessage>
              <ValidationMessage tone="info">Optional field</ValidationMessage>
              <ValidationMessage tone="warn">Will be visible to carriers</ValidationMessage>
              <ValidationMessage tone="danger">Email already in use</ValidationMessage>
            </div>
          </SubSection>
        </Section>

        {/* SELECTION */}
        <Section
          id="selection"
          eyebrow="06 · Selection"
          title="Selection controls"
          description="Checkbox · Radio · Toggle · Switch · Segmented · Combobox · Select."
        >
          <SubSection title="Checkbox · Radio · Switch">
            <div className="grid gap-4 md:grid-cols-3">
              <Showcase label="Checkbox">
                <div className="flex flex-col gap-2 items-start">
                  <Checkbox label="Email me when carrier accepts" defaultChecked />
                  <Checkbox label="SMS notifications" />
                  <Checkbox label="Disabled" disabled />
                </div>
              </Showcase>
              <Showcase label="Radio group">
                <RadioGroup>
                  <Radio name="rate" value="contract" label="Contract rate" description="$0.18/mi · 14-day SLA" checked />
                  <Radio name="rate" value="spot"     label="Spot rate" description="Live market · 24-hour SLA" />
                  <Radio name="rate" value="custom"   label="Custom" description="Carrier negotiation" />
                </RadioGroup>
              </Showcase>
              <Showcase label="Toggle / switch">
                <div className="flex flex-col gap-2 items-start">
                  <SwitchRow label="Auto-quote enabled" defaultChecked />
                  <SwitchRow label="Email digests" />
                  <SwitchRow label="Disabled" disabled />
                </div>
              </Showcase>
            </div>
          </SubSection>

          <SubSection title="Segmented · Select · Combobox">
            <div className="grid gap-4 md:grid-cols-3">
              <Showcase label="Segmented control">
                <SegmentedWrap />
              </Showcase>
              <Showcase label="Select (dropdown)">
                <div className="w-full max-w-[220px]">
                  <Select options={[{label: "Dry van", value:"dv"}, {label:"Reefer", value:"rf"}, {label:"Flatbed", value:"fb"}]} value="dv" />
                </div>
              </Showcase>
              <Showcase label="Combobox (autocomplete)">
                <div className="w-full max-w-[260px]">
                  <Combobox options={["Sterling LTL", "Saia", "Estes Express", "ABF Freight", "Old Dominion", "FedEx Freight", "UPS Freight", "XPO Logistics"]} placeholder="Pick or type a carrier" />
                </div>
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* PICKERS */}
        <Section
          id="pickers"
          eyebrow="07 · Pickers"
          title="Date · Time · Calendar"
          description="Date picker, time picker, calendar (month / week / agenda)."
        >
          <SubSection title="Date · Time picker">
            <div className="flex flex-wrap items-center gap-4">
              <Showcase label="Date input"><DatePicker value="May 19, 2026" /></Showcase>
              <Showcase label="Time input"><TimePicker /></Showcase>
              <Showcase label="Calendar (popover)"><DatePickerCalendar /></Showcase>
            </div>
          </SubSection>
        </Section>

        {/* UPLOADS */}
        <Section
          id="uploads"
          eyebrow="08 · Uploads"
          title="File · image upload"
          description="Drop zone · file preview · validation · progress."
        >
          <div className="grid gap-3 md:grid-cols-2">
            <FileDropzone />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4">
              <div className="text-heading-h6 mb-3">Upload progress</div>
              <div className="flex flex-col gap-stack-sm">
                <UploadRow name="bol-2026-04-29.pdf" pct={100} />
                <UploadRow name="rate-confirmation.pdf" pct={62} />
                <UploadRow name="invoice-3442.xlsx" pct={28} />
              </div>
            </div>
          </div>
        </Section>

        {/* DATA DISPLAY */}
        <Section
          id="data"
          eyebrow="09 · Display"
          title="Data display"
          description="Card · List · Tag/Chip · Badge · Avatar · Tooltip · Popover · Accordion · Carousel · Timeline · Tree view · Empty state."
        >
          <SubSection title="Card variants">
            <div className="grid gap-3 md:grid-cols-3">
              <Card padding="md"><CardHeader title="Flat card" description="Default elevation" /></Card>
              <Card padding="md" elevation="lifted"><CardHeader title="Lifted card" description="Hover-active surfaces" /></Card>
              <Card padding="md" elevation="popover"><CardHeader title="Popover card" description="Floating affordances" /></Card>
            </div>
          </SubSection>

          <SubSection title="Badge · Tag · Status pill">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge status="accent" leadingDot>Live</Badge>
              <Badge status="warning">Pending</Badge>
              <Badge status="danger">Failed</Badge>
              <VerticalDivider height="20px" />
              <Tag tone="neutral">Carrier</Tag>
              <Tag tone="accent">Premium</Tag>
              <Tag tone="info">Beta</Tag>
              <Tag tone="warn">Watch</Tag>
              <Tag tone="danger" onRemove={() => {}}>Disputed</Tag>
              <VerticalDivider height="20px" />
              <StatusPill tone="accent" pulse>Active</StatusPill>
              <StatusPill tone="warn">Pending</StatusPill>
              <StatusPill tone="danger">Failed</StatusPill>
              <StatusPill tone="info">Queued</StatusPill>
            </div>
          </SubSection>

          <SubSection title="Avatar · presence · group overflow">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar name="Daniel Sokolovsky" />
              <Avatar name="Jordan Kim" />
              <Avatar name="Neel Tengariya" />
              <span className="relative inline-block"><Avatar name="Lara Lee" /><span className="absolute right-0 bottom-0"><Presence status="online" /></span></span>
              <span className="relative inline-block"><Avatar name="Maria Mendez" /><span className="absolute right-0 bottom-0"><Presence status="away" /></span></span>
              <VerticalDivider height="22px" />
              <AvatarGroup names={["Daniel Sokolovsky", "Jordan Kim", "Neel Tengariya", "Lara Lee", "Mira Park", "Ren Tanaka"]} max={4} />
            </div>
          </SubSection>

          <SubSection title="Severity · Trend · Confidence">
            <div className="flex flex-wrap items-center gap-3">
              <Severity level="low" />
              <Severity level="med" />
              <Severity level="high" />
              <Severity level="critical" />
              <VerticalDivider height="20px" />
              <Trend delta={3.2} />
              <Trend delta={-1.4} />
              <VerticalDivider height="20px" />
              <AIConfidence score={0.92} />
              <AIConfidence score={0.62} />
              <AIConfidence score={0.31} />
            </div>
          </SubSection>

          <SubSection title="Tooltip · Popover">
            <div className="flex items-center gap-6">
              <Tooltip content="A helpful hint for power users">
                <Button size="sm" intent="secondary">Hover me</Button>
              </Tooltip>
              <Popover>
                <div className="text-heading-h6 mb-1">About this rate</div>
                {/* lumen-lint-allow: typography — type-12 plain popover helper; no semantic preset for 12 regular */}
                <p className="text-[var(--type-12)] text-[color:var(--text-tertiary)]">Spot rates refresh every 90 seconds and reflect the live market on a confidence-weighted basis.</p>
              </Popover>
            </div>
          </SubSection>

          <SubSection title="Accordion">
            <Accordion items={[
              { title: "How does Warp pick the recommended carrier?", content: "Carrier picks weight contracted rates, historical reliability, and current capacity. The model is documented in the trust center." },
              { title: "What happens if a carrier doesn't accept?", content: "We auto-route to the next-best option without re-quoting. Operators see a notification with the reason for the swap." },
              { title: "How do I import historical lanes?", content: "Use the CSV importer at Settings → Data → Import. Mapping is interactive and reversible." },
            ]} />
          </SubSection>

          <SubSection title="List · Tree view · Timeline">
            {/* v0.11.9 — items-start so each card sizes to its own content
                instead of stretching the shorter ones to the tallest column.
                The repetitive "Lane TX-CA-014" placeholder description was
                replaced with varied lane + transit-time data so the
                secondary column actually carries information. */}
            <div className="grid gap-3 lg:grid-cols-3 items-start">
              <ListGroup items={[
                { title: "Sterling LTL",  meta: "$1,840", description: "TX → CA · 1d transit" },
                { title: "Saia Motor",    meta: "$1,932", description: "TX → CA · 1d transit" },
                { title: "Estes Express", meta: "$2,104", description: "TX → CA · 2d transit" },
                { title: "ABF Freight",   meta: "$2,221", description: "TX → CA · 2d transit" },
              ]} />
              <TreeView />
              <Timeline />
            </div>
          </SubSection>

          <SubSection title="Carousel · Image frame">
            <Carousel items={[
              { title: "Spot rate compression", subtitle: "Q1 vs Q2 trend" },
              { title: "New carrier scorecard", subtitle: "Weighted by SLA" },
              { title: "Multi-stop quoting v2", subtitle: "Beta" },
              { title: "Audit-ready receipts", subtitle: "PDF export" },
            ]} />
          </SubSection>

          <SubSection title="Empty state">
            <div className="grid gap-3 md:grid-cols-2">
              <EmptyState
                title="No quotes yet"
                description="When a carrier responds to your request for rate, it'll show up here. Most quotes arrive within 6 minutes."
                action={<Button intent="primary" leadingIcon={<Plus size={13} />}>Request a rate</Button>}
              />
              <EmptyState
                illustration={<NoDataIllustration />}
                title="No data for this view"
                description="Adjust your date range or remove a filter to see results."
                action={<Button intent="tertiary">Reset filters</Button>}
              />
            </div>
          </SubSection>

          <SubSection title="Key/value · Description list">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5 max-w-[640px]">
              <KeyValue items={[
                { label: "Order ID", value: <span className="lumen-mono text-[color:var(--text-primary)]">QT-3442-A</span> },
                { label: "Customer", value: "Sterling LTL" },
                { label: "Origin", value: "Dallas, TX 75201" },
                { label: "Destination", value: "Long Beach, CA 90802" },
                { label: "Equipment", value: "Dry van · 53'" },
                { label: "Quote", value: <span className="lumen-tnum text-[color:var(--text-primary)] font-semibold">$1,840.00</span> },
                { label: "Status", value: <StatusPill tone="accent" pulse>Live</StatusPill> },
              ]} />
            </div>
          </SubSection>

          <SubSection title="Skeletons (variants)">
            <div className="grid gap-3 md:grid-cols-3">
              <Showcase label="Card skeleton">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-[60%]" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-3 w-[40%]" />
                </div>
              </Showcase>
              <Showcase label="Avatar skeleton">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-control-cozy w-[var(--size-control-cozy)] rounded-full" />
                  <div className="flex flex-col gap-[var(--space-1_5)]">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-2 w-20" />
                  </div>
                </div>
              </Showcase>
              <Showcase label="Form skeleton">
                <div className="flex flex-col gap-2 w-full">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-control-cozy w-full" />
                  <Skeleton className="h-3 w-12 mt-2" />
                  <Skeleton className="h-control-cozy w-full" />
                </div>
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* TABLES */}
        <Section
          id="tables"
          eyebrow="10 · Tables"
          title="Tables · data grids · kanban"
          description="Data table with toolbar, filters, sort, density, sticky columns. Kanban for workflows."
        >
          <SubSection title="Data table" description="Filter bar · column header · sort indicator · row hover · numerics tabular">
            <DataTable
              columns={[
                { key: "lane", label: "Lane" },
                { key: "carrier", label: "Carrier" },
                { key: "rate", label: "Rate $", align: "right" },
                { key: "trend", label: "Δ", align: "right" },
                { key: "status", label: "Status" },
              ]}
              rows={[
                { lane: "TX → CA-014", carrier: "Sterling LTL", rate: <span>1,840.00</span>, trend: <Trend delta={1.2} />, status: <StatusPill tone="accent" pulse>Live</StatusPill> },
                { lane: "OH → FL-022", carrier: "Saia", rate: <span>1,420.00</span>, trend: <Trend delta={-0.6} />, status: <StatusPill tone="warn">Pending</StatusPill> },
                { lane: "WA → NY-009", carrier: "Estes Express", rate: <span>3,210.00</span>, trend: <Trend delta={0.4} />, status: <StatusPill tone="success">Won</StatusPill> },
                { lane: "AZ → IL-031", carrier: "ABF Freight", rate: <span>2,104.00</span>, trend: <Trend delta={-2.1} />, status: <StatusPill tone="danger">Lost</StatusPill> },
              ]}
            />
          </SubSection>

          <SubSection title="Kanban board">
            <Kanban />
          </SubSection>
        </Section>

        {/* CHARTS */}
        <Section
          id="charts"
          eyebrow="11 · Viz"
          title="Charts · graphs"
          description="Line · Area · Bar · Stacked bar · Donut · Pie · Heatmap · Scatter · Radar · Treemap · Funnel · Histogram · Waterfall · Bullet · Cohort · Sparkline."
        >
          <SubSection title="Time-series">
            <div className="grid gap-4 md:grid-cols-2">
              <Showcase label="Line chart">
                <LineChart
                  series={[
                    { name: "Spot", data: [42, 48, 51, 47, 54, 60, 58, 64, 70] },
                    { name: "Contract", data: [38, 39, 41, 40, 42, 44, 46, 47, 49] },
                  ]}
                  labels={["W1","W2","W3","W4","W5","W6","W7","W8","W9"]}
                />
              </Showcase>
              <Showcase label="Area chart">
                <AreaChart data={[12, 19, 18, 24, 22, 30, 28, 36, 34, 42]} labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"]} />
              </Showcase>
            </div>
            <div className="mt-3"><ChartLegend items={[{ label: "Spot", color: CHART_PALETTE[0] }, { label: "Contract", color: CHART_PALETTE[1] }]} /></div>
          </SubSection>

          <SubSection title="Distribution">
            <div className="grid gap-4 md:grid-cols-2">
              <Showcase label="Bar (vertical)"><BarChart data={[24, 38, 31, 47, 52, 44, 39]} labels={["Mo","Tu","We","Th","Fr","Sa","Su"]} /></Showcase>
              <Showcase label="Bar (horizontal)"><BarChart data={[820, 642, 514, 380, 290]} labels={["Sterling LTL","Saia","Estes","ABF","OD"]} horizontal /></Showcase>
              <Showcase label="Histogram"><Histogram bins={[2,5,8,14,22,28,32,28,22,16,10,6,3]} /></Showcase>
              <Showcase label="Stacked bar (segments)"><div className="w-full"><StackedBar rows={[
                { label: "Q1", segments: [{ value: 42, color: "var(--lumen-accent-5)" }, { value: 24, color: "var(--lumen-cream-5)" }, { value: 18, color: "var(--lumen-amber-5)" }] },
                { label: "Q2", segments: [{ value: 50, color: "var(--lumen-accent-5)" }, { value: 18, color: "var(--lumen-cream-5)" }, { value: 22, color: "var(--lumen-amber-5)" }] },
                { label: "Q3", segments: [{ value: 56, color: "var(--lumen-accent-5)" }, { value: 14, color: "var(--lumen-cream-5)" }, { value: 28, color: "var(--lumen-amber-5)" }] },
              ]} /></div></Showcase>
            </div>
          </SubSection>

          <SubSection title="Composition">
            <div className="grid gap-4 md:grid-cols-2">
              <Showcase label="Donut chart">
                <DonutChart
                  segments={[
                    { label: "Sterling LTL", value: 38 },
                    { label: "Saia", value: 22 },
                    { label: "Estes", value: 18 },
                    { label: "ABF", value: 12 },
                    { label: "Others", value: 10 },
                  ]}
                  centerValue="$2.1B"
                  centerLabel="GMV"
                />
              </Showcase>
              <Showcase label="Pie chart">
                <PieChart segments={[
                  { label: "Won", value: 64 },
                  { label: "Lost", value: 22 },
                  { label: "Pending", value: 14 },
                ]} />
              </Showcase>
              <Showcase label="Treemap"><Treemap items={[
                { label: "Sterling LTL", value: 38 },
                { label: "Saia", value: 22 },
                { label: "Estes Express", value: 18 },
                { label: "ABF", value: 12 },
                { label: "Others", value: 10 },
              ]} /></Showcase>
              <Showcase label="Radar"><Radar axes={["Speed", "Cost", "SLA", "Capacity", "Risk", "Coverage"]} values={[80, 70, 90, 60, 78, 85]} /></Showcase>
            </div>
          </SubSection>

          <SubSection title="Performance">
            <div className="grid gap-4 md:grid-cols-2">
              <Showcase label="Funnel">
                <Funnel steps={[
                  { label: "Lanes posted", value: 8420 },
                  { label: "Quoted", value: 5180 },
                  { label: "Accepted", value: 3210 },
                  { label: "Booked", value: 2104 },
                  { label: "Delivered", value: 1986 },
                ]} />
              </Showcase>
              <Showcase label="Bullet (vs target)">
                <div className="w-full flex flex-col gap-3">
                  <Bullet label="Quotes" value={84} target={100} />
                  <Bullet label="Pickups" value={72} target={80} />
                  <Bullet label="OTD" value={94} target={90} max={100} />
                </div>
              </Showcase>
              <Showcase label="Waterfall">
                <Waterfall items={[
                  { label: "Start", delta: 100 },
                  { label: "+ New", delta: 28 },
                  { label: "− Churn", delta: -14 },
                  { label: "+ Expand", delta: 22 },
                  { label: "− Reactivate", delta: -8 },
                  { label: "End", delta: 0, total: 128, final: true },
                ]} />
              </Showcase>
              <Showcase label="Scatter">
                <Scatter points={SCATTER_POINTS} />
              </Showcase>
            </div>
          </SubSection>

          <SubSection title="Heatmap · Cohort · Sparkline">
            <div className="grid gap-4 md:grid-cols-2">
              <Showcase label="Heatmap (activity)"><Heatmap rows={7} cols={20} label="Booking activity · last 20 weeks" /></Showcase>
              <Showcase label="Cohort retention"><Cohort /></Showcase>
              <Showcase label="Sparkline (inline)">
                {/* lumen-lint-allow: typography — type-13 mono regular sparkline delta; no semantic preset for mono+regular at 13 */}
                <div className="flex items-center gap-3 w-full"><span className="text-body-xs text-[color:var(--text-secondary)]">Volume</span><MiniSparkline data={[12,14,11,16,13,18,21,19,23,28,24,30]} /><span className="lumen-mono text-[var(--type-13)]">+34%</span></div>
              </Showcase>
              <Showcase label="Gauge"><div className="w-full flex items-center justify-around"><Gauge value={72} label="Capacity" /><Gauge value={94} label="OTD" /><Gauge value={48} label="Risk" /></div></Showcase>
            </div>
          </SubSection>
        </Section>

        {/* KPI */}
        <Section
          id="kpi"
          eyebrow="12 · Metric"
          title="KPI · metrics"
          description="Stat block · KPI card · trend indicator · sparkline · goal progress · meter."
        >
          <SubSection title="KPI cards">
            <div className="grid gap-3 md:grid-cols-4">
              <KpiCard label="Quotes today" value="2,104" trend={{ delta: 12.4 }} spark={[12,14,11,16,13,18,21,19,23,28,24,30]} hint="vs 1,872 yesterday" />
              <KpiCard label="Win rate" value="64.2%" trend={{ delta: -1.1 }} spark={[64,63,65,66,64,63,62,64,65,64,63,64]} />
              <KpiCard label="Avg lane $" value="$1,842" trend={{ delta: 0.8 }} spark={[1820,1830,1825,1840,1838,1842,1845,1840,1843,1842]} />
              <KpiCard label="Capacity" value="84%" trend={{ delta: 4.4 }} spark={[60,64,68,72,75,78,80,82,84]} hint="across 12,400 carriers" />
            </div>
          </SubSection>

          <SubSection title="Stat block (existing primitive) · LiveDot · RateTicker">
            <StatGrid>
              <Stat label="Open quotes" value="42" delta="+4.2%" trend="up" />
              <Stat label="Live rate" value="1.62" unit="$/mi" delta="−0.3%" trend="down" />
              <Stat label="OTD" value="94.2" unit="%" delta="+0.6%" trend="up" />
            </StatGrid>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 text-body-xs"><LiveDot /> Live ingest</span>
              <span className="inline-flex items-center gap-2 text-body-xs"><LiveDot color="var(--lumen-amber-5)" /> Lagging</span>
              <span className="inline-flex items-center gap-2 text-body-xs"><LiveDot color="var(--lumen-red-5)" /> Stalled</span>
            </div>
          </SubSection>

          <SubSection title="Progress">
            <div className="grid gap-4 md:grid-cols-3">
              <Showcase label="Bar"><div className="w-full"><ProgressBar value={64} /></div></Showcase>
              <Showcase label="Ring"><ProgressRing value={72} /></Showcase>
              <Showcase label="Stacked tracks">
                <ProgressTrack items={[
                  { label: "Quote acceptance", pct: 72 },
                  { label: "Onboarding", pct: 48, tone: "warn" },
                  { label: "API errors", pct: 12, tone: "danger" },
                ]} />
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* FEEDBACK */}
        <Section
          id="feedback"
          eyebrow="13 · Feedback"
          title="Feedback · status"
          description="Alert · banner · toast · snackbar · inline validation · system status."
        >
          <SubSection title="Inline alerts">
            <div className="flex flex-col gap-3 max-w-[720px]">
              <Alert tone="info" title="Rates refreshed" onDismiss={() => {}}>Live data was just refreshed at 10:42 AM. Spot prices may have moved.</Alert>
              <Alert tone="success" title="Quote accepted">Sterling LTL accepted your $1,840 quote on Lane TX → CA-014.</Alert>
              <Alert tone="warn" title="Capacity tight">Six pending quotes on Saia routes need re-evaluation.</Alert>
              <Alert tone="danger" title="Ingest failed">No new rates received in the last 18 minutes. <a className="underline">View status →</a></Alert>
            </div>
          </SubSection>

          <SubSection title="Page-level banners">
            <div className="flex flex-col gap-2 max-w-[720px]">
              <PageBanner tone="info" action={<Button size="xs" intent="tertiary">Review</Button>}>Carrier compliance docs expire next week for ABF Freight.</PageBanner>
              <PageBanner tone="warn" onDismiss={() => {}}>You're viewing in sandbox mode — these quotes are not bookable.</PageBanner>
              <PageBanner tone="danger">A migration is running. Quoting is paused until 14:00 UTC.</PageBanner>
              <PageBanner tone="success">Your usage is on track for the month — 22% under budget.</PageBanner>
            </div>
          </SubSection>

          <SubSection title="Toast · Snackbar">
            <div className="flex flex-wrap items-end gap-3">
              <Toast tone="success" title="Saved" description="Quote drafted." action={{ label: "Undo" }} />
              <Toast tone="info" title="Update available" description="A new build is ready." action={{ label: "Reload" }} />
              <Toast tone="danger" title="Failed to save" description="The carrier API timed out. Retrying in 8s." />
              <Snackbar action={{ label: "Undo" }}>Quote moved to drafts</Snackbar>
            </div>
          </SubSection>
        </Section>

        {/* OVERLAYS */}
        <Section
          id="overlays"
          eyebrow="14 · Overlay"
          title="Modals · drawers · popovers"
          description="Modal · type-to-confirm · drawer/sheet · popover · cookie consent."
        >
          <SubSection title="Modals (rendered as cards)">
            <div className="grid gap-4 lg:grid-cols-2">
              <ModalCard
                title="Send quote to Sterling LTL"
                description="They'll receive a notification with the quote details. You can revoke before they accept."
                primary={{ label: "Send quote" }}
                secondary={{ label: "Cancel" }}
              >
                <div className="flex flex-col gap-3">
                  <Field label="Note (optional)"><Textarea placeholder="One-line context for the carrier…" /></Field>
                  <Checkbox label="Notify me when they respond" defaultChecked />
                </div>
              </ModalCard>
              <TypeToConfirm />
            </div>
          </SubSection>

          <SubSection title="Drawer · Popover · Cookie banner">
            <div className="grid gap-4 lg:grid-cols-3 items-start">
              <div><Drawer title="Filters">
                <div className="flex flex-col gap-3">
                  <Field label="Date range"><DatePicker value="May 1 – May 19" /></Field>
                  <Field label="Carrier"><Combobox options={["Sterling LTL", "Saia", "Estes Express"]} /></Field>
                  <Field label="Equipment"><Select options={[{label:"Dry van", value:"dv"}, {label:"Reefer", value:"rf"}]} /></Field>
                  <Checkbox label="Include lost quotes" />
                </div>
              </Drawer></div>
              <div className="pt-12"><Popover>
                <div className="text-heading-h6 mb-1">Why is this rate higher?</div>
                {/* lumen-lint-allow: typography — type-12 plain popover helper; no semantic preset for 12 regular */}
                <p className="text-[var(--type-12)] text-[color:var(--text-tertiary)]">Saia raised their fuel surcharge by 11% on Wednesday. The base rate is unchanged.</p>
              </Popover></div>
              <div><CookieBanner /></div>
            </div>
          </SubSection>
        </Section>

        {/* MOBILE */}
        <Section
          id="navigation-mobile"
          eyebrow="15 · Mobile"
          title="Mobile · native"
          description="iOS / Android frames · status bar · safe area · bottom sheet · action sheet · permission prompts · pull-to-refresh · biometric prompt · keyboard accessory · coach marks."
        >
          <SubSection title="Phone frames + screens">
            <div className="grid gap-6 md:grid-cols-3">
              <PhoneFrame os="ios" height={520}>
                <StatusBar />
                <div className="px-4 py-2 flex items-center justify-between">
                  {/* lumen-lint-allow: typography — type-22 mobile screen title; intermediate between heading-h3 (20) and heading-h2 (25) */}
                  <span className="text-[var(--type-22)] font-semibold tracking-[var(--tracking-tight)]">Inbox</span>
                  <button className="h-control-cozy w-[var(--size-control-cozy)] rounded-full bg-[var(--surface-sunken)] inline-flex items-center justify-center text-[color:var(--text-secondary)]"><SearchIcon size={16} /></button>
                </div>
                <PullToRefresh />
                <div className="flex-1 overflow-auto divide-y divide-[var(--border-hairline)]">
                  <MobileListItem title="Sterling LTL accepted" description="Quote 3,442 · $1,840" meta="2m" />
                  <MobileListItem title="Saia counter-offered" description="Lane OH→FL-022 · $1,520" meta="14m" />
                  <MobileListItem title="Estes pending" description="Quote 3,439 · 4 hours" meta="1h" />
                  <MobileListItem title="ABF compliance expires" description="Renew documents to stay active" meta="Yest" />
                </div>
                <BottomNav />
              </PhoneFrame>

              <PhoneFrame os="ios" height={520}>
                <StatusBar />
                <BottomSheet title="Filter shipments" height="78%">
                  <div className="flex flex-col gap-3">
                    <Field label="Date"><DatePicker value="May 1 – May 19" /></Field>
                    <Field label="Carrier"><Select options={[{label:"All carriers", value:"all"}, {label:"Sterling LTL", value:"st"}]} /></Field>
                    <Field label="Status"><Segmented value="all" onChange={() => {}} options={[{label:"All", value:"all"}, {label:"Live", value:"live"}, {label:"Won", value:"won"}, {label:"Lost", value:"lost"}]} /></Field>
                    <Button intent="primary" fullWidth>Apply filters</Button>
                  </div>
                </BottomSheet>
              </PhoneFrame>

              <PhoneFrame os="android" height={520}>
                <StatusBar carrier="T-Mobile" />
                <div className="flex items-center justify-center h-full px-6">
                  <PermissionPrompt />
                </div>
              </PhoneFrame>

              <PhoneFrame os="ios" height={520}>
                <StatusBar />
                <ActionSheet items={[
                  { label: "Mark as resolved" },
                  { label: "Snooze for 2 hours" },
                  { label: "Forward to Slack" },
                  { label: "Delete carrier", danger: true },
                  { label: "Cancel", cancel: true },
                ]} />
              </PhoneFrame>

              <PhoneFrame os="ios" height={520}>
                <StatusBar />
                <FaceIDPrompt />
              </PhoneFrame>

              <PhoneFrame os="ios" height={520}>
                <StatusBar />
                <div className="px-4 py-3">
                  {/* lumen-lint-allow: typography — type-22 mobile screen title; intermediate between heading-h3 (20) and heading-h2 (25) */}
                  <span className="text-[var(--type-22)] font-semibold tracking-[var(--tracking-tight)]">New quote</span>
                </div>
                <div className="px-4 flex flex-col gap-3 flex-1">
                  <Field label="Origin"><TextInput defaultValue="Dallas, TX" /></Field>
                  <Field label="Destination"><TextInput defaultValue="Long Beach, CA" /></Field>
                  <Field label="Pickup date"><DatePicker value="Friday, May 22" /></Field>
                </div>
                <KeyboardAccessoryBar />
              </PhoneFrame>
            </div>
          </SubSection>

          <SubSection title="Coach mark · Onboarding tip">
            <div className="flex items-start gap-6">
              <CoachMark />
            </div>
          </SubSection>
        </Section>

        {/* COMMERCE */}
        <Section
          id="commerce"
          eyebrow="16 · Commerce"
          title="E-commerce primitives"
          description="Pricing · payment buttons · cart drawer · product gallery · selectors · checkout progress · feature comparison · inventory."
        >
          <SubSection title="Pricing">
            <div className="flex items-center justify-end mb-4">
              <PricingToggleWrapper />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <PricingCard name="Starter" description="For solo brokers." price="$0" period="mo" features={["Up to 50 quotes / month", "Live carrier rates", "Email support"]} cta="Start free" />
              <PricingCard name="Growth" description="For growing teams." price="$990" period="mo" features={["Unlimited quotes", "Multi-stop quoting", "API access", "8-hour support SLA"]} cta="Get started" recommended />
              <PricingCard name="Scale" description="For multi-region operations." price="Custom" period="contract" features={["Everything in Growth", "Dedicated CSM", "99.95% uptime SLA", "SOC 2 audit assistance"]} cta="Contact sales" />
            </div>
          </SubSection>

          <SubSection title="Feature comparison table">
            <ComparisonTable />
          </SubSection>

          <SubSection title="Payment buttons">
            <div className="grid gap-2 md:grid-cols-3 max-w-[720px]">
              <ApplePay />
              <GooglePay />
              <ShopPay />
              <PayPal />
              <Klarna />
              <Afterpay />
            </div>
          </SubSection>

          <SubSection title="Product detail">
            <div className="grid gap-6 lg:grid-cols-[420px_1fr] items-start">
              <ProductGallery count={5} />
              <div className="flex flex-col gap-3">
                <span className="lumen-eyebrow text-[10px]">Aero Co.</span>
                <h3 className="text-display-sm font-semibold">Aero Trail Runner v2</h3>
                <RatingBlock />
                <div className="flex items-baseline gap-3">
                  <span className="text-heading-h2 lumen-tnum">$168.00</span>
                  <span className="line-through lumen-tnum text-[color:var(--text-tertiary)]">$220.00</span>
                  <Tag tone="accent">−24%</Tag>
                </div>
                <InventoryStatus status="low-stock" />
                <ColorPickerSwatchWrap />
                <SizeSelectorWrap />
                <div className="flex flex-col gap-2 mt-2">
                  <Button intent="primary" fullWidth size="lg" leadingIcon={<Cart size={15} />}>Add to bag — $168</Button>
                  <ApplePay />
                </div>
              </div>
            </div>
          </SubSection>

          <SubSection title="Cart · Order summary · Checkout progress">
            <div className="grid gap-4 lg:grid-cols-[380px_1fr] items-start">
              <CartDrawer />
              <div className="flex flex-col gap-3">
                <CheckoutProgress />
                <CouponInput />
                <OrderSummary />
              </div>
            </div>
          </SubSection>

          <SubSection title="Inventory states">
            <div className="flex flex-wrap items-center gap-4">
              <InventoryStatus status="in-stock" />
              <InventoryStatus status="low-stock" />
              <InventoryStatus status="backorder" />
              <InventoryStatus status="preorder" />
              <InventoryStatus status="sold-out" />
            </div>
          </SubSection>
        </Section>

        {/* AUTH */}
        <Section
          id="auth"
          eyebrow="17 · Auth"
          title="Auth · account · settings"
          description="Login · signup · social login row · MFA · session expired · workspace switcher · settings panels."
        >
          <SubSection title="Login screen">
            <div className="flex justify-center"><LoginCard /></div>
          </SubSection>

          <SubSection title="Workspace switcher · API key table">
            <div className="grid gap-4 lg:grid-cols-2">
              <Showcase label="Workspace switcher (popover)">
                <MenuList items={[
                  { kind: "label", label: "Workspaces" },
                  { kind: "item", label: "Acme Logistics", icon: <span className="h-4 w-4 rounded-full bg-[var(--lumen-accent-4)]" /> },
                  { kind: "item", label: "Sterling LTL", icon: <span className="h-4 w-4 rounded-full bg-[var(--lumen-cream-5)]" /> },
                  { kind: "item", label: "Estes Express", icon: <span className="h-4 w-4 rounded-full bg-[var(--lumen-amber-5)]" /> },
                  { kind: "divider" },
                  { kind: "item", label: "Create workspace", icon: <Plus size={13} /> },
                ]} />
              </Showcase>
              <Showcase label="API key table">
                <div className="w-full">
                  {/* v0.11.9 — API keys are not people/carriers, so the
                      auto-derived avatar would render meaningless initials.
                      Pass `leading` with a small key-shaped indicator dot
                      coloured by tier (live=accent, sandbox=info). */}
                  <ListGroup items={[
                    {
                      title: "Production · default",
                      description: "lk_live_••••••••pX5F · created Apr 12",
                      trailing: <Tag tone="accent">Active</Tag>,
                      leading: <span className="h-8 w-8 rounded-[var(--radius-md)] grid place-items-center bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)] lumen-mono text-[var(--type-11)] font-semibold">lk</span>,
                    },
                    {
                      title: "Production · backup",
                      description: "lk_live_••••••••aJ2H · created Mar 31",
                      trailing: <Tag tone="neutral">Idle</Tag>,
                      leading: <span className="h-8 w-8 rounded-[var(--radius-md)] grid place-items-center bg-[var(--surface-sunken)] text-[color:var(--text-tertiary)] lumen-mono text-[var(--type-11)] font-semibold">lk</span>,
                    },
                    {
                      title: "Sandbox",
                      description: "lk_test_••••••••wQ9k · created Mar 14",
                      trailing: <Tag tone="info">Sandbox</Tag>,
                      leading: <span className="h-8 w-8 rounded-[var(--radius-md)] grid place-items-center bg-[var(--surface-sunken)] text-[color:var(--text-secondary)] lumen-mono text-[var(--type-11)] font-semibold">tk</span>,
                    },
                  ]} />
                </div>
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* AI */}
        <Section
          id="ai"
          eyebrow="18 · AI"
          title="AI · chat · copilot"
          description="Prompt input · suggestion · confidence · citation · thinking · shimmer · chat bubbles · composer · copilot panel."
        >
          <SubSection title="Prompt + suggestion + citation">
            <div className="grid gap-4 lg:grid-cols-2">
              <AIPromptInput />
              <AISuggestion />
              <AICitation />
              <Showcase label="AI thinking · loading · badge">
                <div className="flex flex-col gap-3 w-full">
                  <AIThinking />
                  <AIBadge />
                  {/* lumen-lint-allow: typography — type-12 plain shimmer label; no semantic preset for 12 regular */}
                  <div className="text-[var(--type-12)] text-[color:var(--text-tertiary)] mb-1">Loading shimmer</div>
                  <AIShimmer />
                </div>
              </Showcase>
            </div>
          </SubSection>

          <SubSection title="Chat surface">
            <div className="grid gap-4 lg:grid-cols-2 items-start">
              <Showcase label="Chat thread (you · them · AI)">
                <div className="w-full flex flex-col gap-3">
                  <ChatBubble from="them" time="10:38 AM">Why is the quote for Sterling LTL higher than last week?</ChatBubble>
                  <ChatBubble from="ai" time="10:38 AM">Their fuel surcharge moved from 31% to 42% on April 26. Base rate hasn't changed.</ChatBubble>
                  <ChatBubble from="you" time="10:39 AM">Can you draft a counter at 36%?</ChatBubble>
                  <TypingIndicator name="Lumen AI" />
                </div>
              </Showcase>
              <Showcase label="Copilot side panel"><CopilotPanel /></Showcase>
              <Showcase label="Comment thread"><CommentThread /></Showcase>
              <Showcase label="Reaction bar · presence">
                <div className="flex flex-col gap-3 items-start">
                  <ReactionBar />
                  <div className="flex items-center gap-3">
                    <span className="relative inline-block"><Avatar name="Daniel Sokolovsky" /><span className="absolute right-0 bottom-0"><Presence status="online" /></span></span>
                    <span className="relative inline-block"><Avatar name="Jordan Kim" /><span className="absolute right-0 bottom-0"><Presence status="away" /></span></span>
                    <span className="relative inline-block"><Avatar name="Neel Tengariya" /><span className="absolute right-0 bottom-0"><Presence status="dnd" /></span></span>
                    <span className="relative inline-block"><Avatar name="Lara Lee" /><span className="absolute right-0 bottom-0"><Presence status="offline" /></span></span>
                  </div>
                </div>
              </Showcase>
            </div>
          </SubSection>
        </Section>

        {/* NOTIFICATIONS */}
        <Section
          id="notifications"
          eyebrow="19 · Notify"
          title="Notifications · activity"
          description="Notification center · inbox item · grouping · preferences."
        >
          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <NotificationCenter />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-5">
              <div className="text-heading-h5 mb-3">Notification preferences</div>
              <div className="flex flex-col gap-stack-sm">
                <SwitchRow label="Email · daily digest" defaultChecked />
                <SwitchRow label="Email · instant on rate accepted" defaultChecked />
                <SwitchRow label="Slack · Sterling LTL channel" defaultChecked />
                <SwitchRow label="Push · iOS" defaultChecked />
                <SwitchRow label="Push · marketing" />
              </div>
            </div>
          </div>
        </Section>

        {/* EDITOR */}
        <Section
          id="editor"
          eyebrow="20 · Editor"
          title="Editor · code · keyboard"
          description="Code block · markdown editor · keyboard shortcuts."
        >
          <SubSection title="Code block">
            <CodeBlock language="typescript" code={`import { Stat, LiveDot } from "@lumen/react";

export function Hero() {
  return (
    <Stat label="Lane TX→CA" value="$1,842" trend={{ delta: 1.2 }}>
      <LiveDot />
    </Stat>
  );
}`} />
          </SubSection>

          <SubSection title="Keyboard shortcut sheet">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] divide-y divide-[var(--border-hairline)] max-w-[420px]">
              <KbdRow label="Open command palette" keys={["⌘", "K"]} />
              <KbdRow label="New quote" keys={["⌘", "N"]} />
              <KbdRow label="Find a lane" keys={["⌘", "L"]} />
              <KbdRow label="Toggle theme" keys={["⌘", "⇧", "T"]} />
              <KbdRow label="Send quote" keys={["⌘", "↵"]} />
              <KbdRow label="Close modal" keys={["esc"]} />
            </div>
          </SubSection>
        </Section>

        {/* STATES */}
        <Section
          id="states"
          eyebrow="21 · State"
          title="State matrix"
          description="Default · Hover · Focus · Active · Pressed · Selected · Disabled · Loading · Error · Success · Empty · Read-only · Dragging."
        >
          <SubSection title="Button states">
            <VariantRow label="Default"><Button intent="primary">Save</Button></VariantRow>
            <VariantRow label="Hover (simulated)"><Button intent="primary" className="bg-[var(--lumen-accent-5)]!">Save</Button></VariantRow>
            <VariantRow label="Pressed (simulated)"><Button intent="primary" className="translate-y-px bg-[var(--lumen-accent-6)]!">Save</Button></VariantRow>
            <VariantRow label="Focus"><Button intent="primary" className="shadow-[var(--shadow-focus)]">Save</Button></VariantRow>
            <VariantRow label="Loading"><Button intent="primary" loading>Saving</Button></VariantRow>
            <VariantRow label="Disabled"><Button intent="primary" disabled>Save</Button></VariantRow>
          </SubSection>

          <SubSection title="Input states">
            <VariantRow label="Default"><div className="w-[240px]"><TextInput placeholder="Default" /></div></VariantRow>
            <VariantRow label="Filled"><div className="w-[240px]"><TextInput defaultValue="Sterling LTL" /></div></VariantRow>
            <VariantRow label="Focus"><div className="w-[240px]"><TextInput defaultValue="Sterling LTL" className="border-[var(--border-focus)]! shadow-[var(--shadow-input-focus)]" /></div></VariantRow>
            <VariantRow label="Error"><div className="w-[240px]"><TextInput defaultValue="invalid email" aria-invalid="true" /></div></VariantRow>
            <VariantRow label="Disabled"><div className="w-[240px]"><TextInput defaultValue="Read-only" disabled /></div></VariantRow>
          </SubSection>

          <SubSection title="Status indicators (every tone)">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill tone="neutral">Default</StatusPill>
              <StatusPill tone="accent" pulse>Active</StatusPill>
              <StatusPill tone="success">Success</StatusPill>
              <StatusPill tone="warn">Warning</StatusPill>
              <StatusPill tone="danger">Error</StatusPill>
              <StatusPill tone="info">Info</StatusPill>
              <VerticalDivider height="20px" />
              {(["pending","queued","processing","completed","cancelled","failed","retry"] as const).map((s) => (
                <Tag key={s} tone={s === "completed" ? "success" : s === "failed" ? "danger" : s === "cancelled" ? "neutral" : s === "retry" ? "warn" : "info"}>{s}</Tag>
              ))}
            </div>
          </SubSection>
        </Section>

        {/* TEMPLATES */}
        <Section
          id="templates"
          eyebrow="22 · Templates"
          title="Page templates"
          description="404 · 403 · 500 · Maintenance · Error recovery · Login · Onboarding."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ErrorPage code="404" title="Page not found" description="The link's expired or never existed. Search the workspace or head home." />
            <ErrorPage code="403" title="Access denied" description="You don't have permission to view this resource. Ask an admin to share access." />
            <ErrorPage code="500" title="Server error" description="Something on our side broke. We've been notified — try again in a few seconds." />
            <MaintenanceCard />
          </div>
        </Section>

        {/* TRUST */}
        <Section
          id="trust"
          eyebrow="23 · Trust"
          title="Trust · compliance · environment"
          description="Trust badges · environment badges · sandbox/test mode banners."
        >
          <SubSection title="Trust badges"><TrustStrip /></SubSection>
          <SubSection title="Environment badges">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="accent">Production</Tag>
              <Tag tone="info">Sandbox</Tag>
              <Tag tone="warn">Staging</Tag>
              <Tag tone="neutral">Local</Tag>
              <VerticalDivider height="20px" />
              <Tag tone="info">Beta</Tag>
              <Tag tone="warn">Alpha</Tag>
              <Tag tone="info">Experimental</Tag>
              <Tag tone="danger">Deprecated</Tag>
            </div>
          </SubSection>
          <SubSection title="System banners">
            <div className="flex flex-col gap-2 max-w-[720px]">
              <PageBanner tone="warn">Sandbox mode — quotes cannot be booked.</PageBanner>
              <PageBanner tone="info">You're impersonating <span className="font-semibold">Acme Logistics</span> as an admin.</PageBanner>
              <PageBanner tone="danger">Idle timeout in 1 minute — confirm to stay signed in.</PageBanner>
            </div>
          </SubSection>
        </Section>

        {/* MARKETING */}
        <Section
          id="marketing"
          eyebrow="24 · Marketing"
          title="Marketing · landing"
          description="Hero · trust row · feature grid · stat strip · testimonial · pricing · footer."
        >
          <div className="flex flex-col gap-6">
            <HeroBlock />
            <StatStrip />
            <FeatureGrid />
            <TestimonialCard />
          </div>
        </Section>

        {/* SPEC */}
        <Section
          id="spec"
          eyebrow="25 · Spec"
          title="Spec · anatomy · handoff"
          description="The handoff layer: anatomy diagrams, redline specs, token references."
        >
          <SubSection title="Component anatomy">
            <ComponentSpec name="Button" role="primary action">
              <div className="flex items-center justify-center py-6">
                <Button intent="primary" leadingIcon={<Plus size={13} />} trailingIcon={<ArrowRight size={13} />}>Get rates</Button>
              </div>
            </ComponentSpec>
          </SubSection>

          <SubSection title="Token reference">
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-hairline)] bg-[var(--surface-raised)] p-4">
              <CodeBlock language="json" code={`{
  "color": {
    "accent":   "#00FA8A",
    "fg":       "var(--text-primary)",
    "bg":       "var(--surface-page)",
    "muted":    "var(--text-tertiary)"
  },
  "radius":  { "sm": 5, "md": 7, "lg": 10, "xl": 14 },
  "shadow": {
    "sm":  "0 1px 2px rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.04)",
    "md":  "0 1px 2px rgba(0,0,0,.06), 0 4px 12px -2px rgba(0,0,0,.08)"
  },
  "motion": { "fast": "140ms", "base": "180ms" }
}`} />
            </div>
          </SubSection>
        </Section>

        {/* lumen-lint-allow: typography — type-12 plain footer note; no semantic preset for 12 regular */}
        <div className="mt-20 text-center text-[var(--type-12)] text-[color:var(--text-tertiary)]">
          End of library — last refreshed v0.11.12
        </div>
      </article>

      {/* Right rail · sticky on-page nav. v0.11.6 — grouped into 7 quiet
          categories with mono-cap subheadings, parallel to the foundations
          right-rail grouping shipped in v0.11.5. Aggressive hierarchy: 25
          jump links scan by category instead of serially. */}
      <aside className="hidden lg:block">
        {/* lumen-lint-allow: typography — type-12 plain right-rail nav; no semantic preset for 12 regular */}
        <nav className="sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-auto pr-2 flex flex-col gap-5 text-[var(--type-12)]">
          <div className="lumen-mono-cap text-[color:var(--text-tertiary)]">On this page</div>
          {[
            { label: "Overview", ids: ["overview"] },
            { label: "Layout & nav", ids: ["layout", "navigation"] },
            { label: "Inputs & forms", ids: ["buttons", "inputs", "selection", "pickers", "uploads"] },
            { label: "Data & viz", ids: ["data", "tables", "charts", "kpi"] },
            { label: "Feedback", ids: ["feedback", "overlays", "notifications"] },
            { label: "Surfaces", ids: ["navigation-mobile", "commerce", "auth", "ai", "editor"] },
            { label: "Reference", ids: ["states", "templates", "trust", "marketing", "spec"] },
          ].map((group) => {
            const items = group.ids.map((id) => SECTIONS.find((s) => s.id === id)).filter(Boolean) as typeof SECTIONS;
            if (items.length === 0) return null;
            return (
              <div key={group.label} className="flex flex-col gap-1">
                <div className="lumen-mono-cap text-[color:var(--text-tertiary)] opacity-70 mb-1">{group.label}</div>
                {items.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block px-2 py-1 rounded-[var(--radius-sm)] text-[color:var(--text-tertiary)] hover:text-[color:var(--text-primary)] hover:bg-[var(--surface-sunken)] transition-colors"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

/* ───── small helpers / wrappers for stateful demos ───── */
function RowSwatch() { return <span className="block h-2 rounded-[var(--radius-xs)] bg-[var(--surface-sunken)] w-[60%]" />; }
function DotSwatch() { return <span className="h-2 w-2 rounded-full bg-[var(--lumen-accent-5)]" />; }
function Sq() { return <span className="block aspect-square rounded-[var(--radius-xs)] bg-[var(--surface-sunken)]" />; }

function NumberInputWrapper() {
  const [v, setV] = useState(8);
  return <NumberInput value={v} onChange={setV} suffix="pallets" />;
}

function TagsInputWrapper() {
  const [t, setT] = useState(["TX", "CA", "Dry van"]);
  return <TagsInput value={t} onChange={setT} />;
}

function ColorPickerWrapper() {
  const [c, setC] = useState("#00FA8A");
  return <ColorPicker value={c} onChange={setC} />;
}

function RangeWrapper() {
  const [v, setV] = useState<[number, number]>([1200, 2400]);
  return <RangeSlider value={v} onChange={setV} min={500} max={4000} format={(x) => `$${x.toLocaleString()}`} />;
}

function PasswordSection() {
  const [v, setV] = useState("Lumen-2026!");
  return (
    <div className="flex flex-col gap-2">
      <PasswordInput value={v} onChange={setV} placeholder="••••••••" />
      <PasswordStrength value={v} />
    </div>
  );
}

function SwitchRow({ label, defaultChecked, disabled }: { label: string; defaultChecked?: boolean; disabled?: boolean }) {
  const [c, setC] = useState(!!defaultChecked);
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <Switch checked={c} onCheckedChange={setC} disabled={disabled} />
      <span className="text-body-xs text-[color:var(--text-secondary)]">{label}</span>
    </label>
  );
}

function SegmentedWrap() {
  const [v, setV] = useState("dv");
  return <Segmented value={v} onChange={setV} options={[{label:"Dry van",value:"dv"},{label:"Reefer",value:"rf"},{label:"Flatbed",value:"fb"}]} />;
}

function TabBarDemo() {
  const [v, setV] = useState("active");
  return <TabBar value={v} onChange={setV} tabs={[{ value: "active", label: "Active", count: 18 }, { value: "won", label: "Won", count: 84 }, { value: "lost", label: "Lost", count: 22 }, { value: "all", label: "All", count: 124 }]} />;
}
function InlineTabsDemo() {
  return <InlineTabs items={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }, { id: "month", label: "Month" }, { id: "quarter", label: "Quarter" }]} defaultId="week" />;
}
function PaginationDemo() {
  const [p, setP] = useState(4);
  return (
    <div className="flex flex-col gap-3">
      <Pagination current={p} total={12} onChange={setP} />
      <Pagination current={2} total={3} />
    </div>
  );
}
function PricingToggleWrapper() {
  const [v, setV] = useState<"monthly" | "yearly">("monthly");
  return <PricingToggle value={v} onChange={setV} />;
}
function ColorPickerSwatchWrap() {
  const [v, setV] = useState("#1c1b16");
  return <ColorSwatchSelector value={v} onChange={setV} />;
}
function SizeSelectorWrap() {
  const [v, setV] = useState("10.5");
  return <SizeSelector value={v} onChange={setV} />;
}

function UploadRow({ name, pct }: { name: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-sunken)] text-[color:var(--text-secondary)]">
        <FileText size={14} strokeWidth={1.5} aria-hidden focusable={false} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="text-body-xs text-[color:var(--text-primary)] truncate">{name}</span>
          {/* lumen-lint-allow: typography — mono regular at 11 progress percent; no semantic preset for 11px mono */}
          <span className="lumen-mono text-[var(--type-11)] text-[color:var(--text-tertiary)]">{pct}%</span>
        </div>
        <div className="h-1 mt-1 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--lumen-accent-5)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
