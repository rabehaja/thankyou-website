import type { ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Compound table styled per Figma section 6; state lives in the caller. */
export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("overflow-x-auto rounded-card bg-white shadow-card", className)}>
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function TableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border-neutral">{children}</tr>
    </thead>
  );
}

export function TableHeaderCell({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-5 py-3.5 text-xs font-medium uppercase tracking-[2px] text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({
  selected,
  className,
  children,
}: {
  selected?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border-neutral/70 last:border-b-0 transition-colors",
        selected ? "bg-terracotta-soft/30" : "hover:bg-cream-card",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-5 py-4 text-[15px] text-ink", className)} {...props} />
  );
}
