"use client";

/**
 * @lumen/sidebar — v0.13 Phase 2 canonical implementation.
 * ----------------------------------------------------------------------------
 * Multi-section nav rail. Collapsed mode shrinks to icon-only with Tooltip
 * labels. Active items get aria-current=page + lime accent.
 */
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type SidebarContextValue = {
  collapsed: boolean;
};
const SidebarContext = React.createContext<SidebarContextValue>({ collapsed: false });

export function Sidebar({
  children,
  collapsed,
  onCollapsedChange,
  className,
  width = 240,
  collapsedWidth = 56,
}: {
  children: React.ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (c: boolean) => void;
  className?: string;
  width?: number;
  collapsedWidth?: number;
}) {
  const [internal, setInternal] = React.useState(false);
  const isCollapsed = collapsed ?? internal;
  return (
    <SidebarContext.Provider value={{ collapsed: isCollapsed }}>
      <aside
        data-slot="sidebar"
        data-collapsed={isCollapsed || undefined}
        aria-label="Primary navigation"
        className={cn(
          "h-full flex flex-col bg-[var(--surface-canvas)] border-r border-[var(--border-hairline)] transition-[width] duration-[var(--motion-base)] ease-[var(--easing-standard)]",
          className,
        )}
        style={{ width: isCollapsed ? collapsedWidth : width }}
      >
        {children}
        <button
          type="button"
          onClick={() => {
            const next = !isCollapsed;
            setInternal(next);
            onCollapsedChange?.(next);
          }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mt-auto m-2 h-7 w-7 inline-flex items-center justify-center rounded-[var(--radius-xs)] text-[color:var(--text-tertiary)] hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]"
        >
          {isCollapsed ? <ChevronRight size={14} aria-hidden /> : <ChevronLeft size={14} aria-hidden />}
        </button>
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  const { collapsed } = React.useContext(SidebarContext);
  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "h-14 flex items-center px-4 border-b border-[var(--border-hairline)] text-[color:var(--text-primary)] font-semibold tracking-[var(--tracking-tight)]",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarSection({
  heading,
  children,
  className,
}: {
  heading?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { collapsed } = React.useContext(SidebarContext);
  return (
    <nav
      data-slot="sidebar-section"
      className={cn("flex flex-col gap-0.5 px-2 py-3 first:pt-4", className)}
    >
      {heading && !collapsed && (
        <div className="px-2 pb-1 lumen-mono-cap text-[length:var(--type-10)] tracking-[var(--tracking-wider)] text-[color:var(--text-tertiary)]">
          {heading}
        </div>
      )}
      {children}
    </nav>
  );
}

export function SidebarItem({
  icon,
  children,
  active,
  href,
  onClick,
  className,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const { collapsed } = React.useContext(SidebarContext);
  const Tag = (href ? "a" : "button") as "a" | "button";
  return (
    <Tag
      data-slot="sidebar-item"
      data-active={active || undefined}
      aria-current={active ? "page" : undefined}
      href={href as string | undefined}
      onClick={onClick}
      title={collapsed && typeof children === "string" ? children : undefined}
      className={cn(
        "flex items-center gap-2 h-9 px-2 rounded-[var(--radius-md)] text-[length:var(--type-13)] text-[color:var(--text-secondary)] no-underline",
        "hover:bg-[var(--surface-sunken)] hover:text-[color:var(--text-primary)]",
        "transition-colors duration-[var(--motion-fast)] ease-[var(--easing-standard)]",
        "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
        active &&
          "bg-[var(--surface-tint-accent)] text-[color:var(--text-accent)] font-medium",
        collapsed && "justify-center px-0",
        className,
      )}
    >
      {icon && <span aria-hidden className="shrink-0">{icon}</span>}
      {!collapsed && <span className="truncate text-left flex-1">{children}</span>}
    </Tag>
  );
}

export function SidebarFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  const { collapsed } = React.useContext(SidebarContext);
  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "mt-auto border-t border-[var(--border-hairline)] p-3",
        collapsed && "px-0",
        className,
      )}
    >
      {children}
    </div>
  );
}
