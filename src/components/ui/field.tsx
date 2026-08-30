import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FieldProps {
  label: string;
  htmlFor?: string;
  helper?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + helper/error text, per the Figma "Label & Helper Text Spec". */
export function Field({ label, htmlFor, helper, error, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[13px] text-danger">{error}</p>
      ) : helper ? (
        <p className="text-[13px] text-muted">{helper}</p>
      ) : null}
    </div>
  );
}
