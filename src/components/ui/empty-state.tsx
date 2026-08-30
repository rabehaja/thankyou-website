import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { XCircleIcon } from "@/components/ui/icons";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

/** Centered empty-state template, per Figma section 6. */
export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border border-dashed border-border-neutral bg-white px-8 py-14 text-center",
        className,
      )}
    >
      <XCircleIcon size={36} className="text-light-gray" strokeWidth={1.2} />
      <h3 className="text-h1 text-[30px] text-terracotta">{title}</h3>
      <p className="max-w-sm text-[15px] text-muted">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
