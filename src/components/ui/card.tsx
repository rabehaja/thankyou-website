import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-card bg-white shadow-card", className)}>
      {children}
    </div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  className?: string;
}

export function StatCard({ label, value, detail, className }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <p className="text-xs font-medium uppercase tracking-[2.5px] text-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-4xl font-medium text-ink">{value}</span>
        {detail ? <span className="text-sm text-sage">{detail}</span> : null}
      </div>
    </Card>
  );
}

export interface FormCardProps {
  heading: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/** Standard internal-layout card with a script heading, per Figma section 4. */
export function FormCard({ heading, description, children, className }: FormCardProps) {
  return (
    <Card className={cn("p-8", className)}>
      <h2 className="text-h1 text-[32px] text-terracotta">{heading}</h2>
      {description ? <p className="mt-2 text-[15px] text-muted">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </Card>
  );
}
