import { ReactNode } from "react";

import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/**
 * Lumen Breadcrumb — wraps the shadcn Breadcrumb. The Lumen API stays
 * `<Breadcrumb items={[{href, label}, ...]} />` so consumer pages don't
 * need to switch to the verbose shadcn JSX.
 */

export type Crumb = { href?: string; label: ReactNode };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <span key={i} className="contents">
              <BreadcrumbItem>
                {c.href && !isLast ? (
                  <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{c.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </span>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}
