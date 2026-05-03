import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-[var(--surface-sunken)] animate-pulse rounded-[var(--radius-md)]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
