// Lumen TreeView — Web React example. Static skeleton — wire to recursive data.

"use client";

import { ChevronRight, Folder, FileText } from "lucide-react";
import { ReactNode, useState } from "react";

export type TreeNode = {
  id: string;
  label: string;
  icon?: ReactNode;
  children?: TreeNode[];
};

export function TreeView({
  items,
  selectedId,
  onSelect,
  density = "compact",
  indent = 16,
}: {
  items: TreeNode[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  density?: "compact" | "regular";
  indent?: number;
}) {
  return (
    <ul role="tree" className="text-[var(--type-label-md)]">
      {items.map((node, i) => (
        <TreeItem
          key={node.id}
          node={node}
          level={0}
          posInSet={i + 1}
          setSize={items.length}
          selectedId={selectedId}
          onSelect={onSelect}
          density={density}
          indent={indent}
        />
      ))}
    </ul>
  );
}

function TreeItem({
  node, level, posInSet, setSize, selectedId, onSelect, density, indent,
}: {
  node: TreeNode;
  level: number;
  posInSet: number;
  setSize: number;
  selectedId?: string;
  onSelect?: (id: string) => void;
  density: "compact" | "regular";
  indent: number;
}) {
  const [open, setOpen] = useState(false);
  const isSelected = node.id === selectedId;
  const hasChildren = !!node.children?.length;
  const Icon = node.icon ?? (hasChildren ? <Folder size={12} aria-hidden /> : <FileText size={12} aria-hidden />);

  return (
    <li role="none">
      <div
        role="treeitem"
        aria-level={level + 1}
        aria-posinset={posInSet}
        aria-setsize={setSize}
        aria-expanded={hasChildren ? open : undefined}
        aria-selected={isSelected}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => { onSelect?.(node.id); if (hasChildren) setOpen((o) => !o); }}
        className={[
          "flex items-center gap-1 cursor-default select-none",
          density === "compact" ? "h-7" : "h-9",
          "rounded-[var(--radius-control-sm)] px-1",
          "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:shadow-[var(--shadow-focus)]",
          isSelected ? "bg-[var(--color-action-selected-bg)] text-[var(--color-action-selected-fg)]" : "text-[var(--color-text-primary)] hover:bg-[var(--color-action-ghost-bg-hover)]",
          "transition-colors duration-[var(--motion-duration-fast)]",
        ].join(" ")}
        style={{ paddingLeft: indent * level + 4 }}
      >
        {hasChildren ? (
          <ChevronRight
            size={12}
            aria-hidden
            className={[
              "shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-[var(--motion-duration-fast)]",
              open ? "rotate-90" : "",
            ].join(" ")}
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}
        <span aria-hidden className="text-[var(--color-text-tertiary)]">{Icon}</span>
        <span className="truncate">{node.label}</span>
      </div>
      {hasChildren && open && (
        <ul role="group">
          {node.children!.map((child, i) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              posInSet={i + 1}
              setSize={node.children!.length}
              selectedId={selectedId}
              onSelect={onSelect}
              density={density}
              indent={indent}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
