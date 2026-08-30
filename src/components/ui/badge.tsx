import { cn } from "@/lib/utils";
import { XIcon } from "@/components/ui/icons";

export type BadgeVariant = "active" | "pending" | "archived" | "hot";

const badgeClasses: Record<BadgeVariant, string> = {
  active: "bg-sage-soft text-sage",
  pending: "bg-gold-soft text-gold",
  archived: "bg-border-neutral/60 text-muted",
  hot: "bg-terracotta text-white",
};

export function Badge({
  variant,
  children,
  className,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-3 py-1 text-xs font-medium tracking-wide",
        badgeClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export interface TagProps {
  children: React.ReactNode;
  onRemove?: () => void;
  className?: string;
}

/** Removable identifier pill, per Figma section 7. */
export function Tag({ children, onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border border-terracotta/50 bg-terracotta-soft/40 px-3 py-1 text-[13px] text-terracotta",
        className,
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove tag"
          className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-terracotta/15"
        >
          <XIcon size={12} strokeWidth={2.2} />
        </button>
      ) : null}
    </span>
  );
}
