import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@/components/ui/icons";

/** CSS-only toggle switch — works uncontrolled inside server-action forms. */
export interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Toggle({ label, className, ...props }: ToggleProps) {
  return (
    <label className={cn("inline-flex items-center gap-3 cursor-pointer select-none", className)}>
      <span className="relative inline-flex">
        <input type="checkbox" role="switch" className="peer sr-only" {...props} />
        <span className="block h-6 w-11 rounded-pill bg-light-gray/60 transition-colors peer-checked:bg-terracotta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label ? <span className="text-[15px] text-ink">{label}</span> : null}
    </label>
  );
}

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <span className="relative inline-flex">
        <input type="checkbox" className="peer sr-only" {...props} />
        <span className="flex h-5 w-5 items-center justify-center rounded-[5px] border border-border-neutral bg-white transition-colors peer-checked:border-terracotta peer-checked:bg-terracotta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta" />
        <CheckIcon
          size={13}
          strokeWidth={2.5}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        />
      </span>
      <span className="text-[15px] text-ink">{label}</span>
    </label>
  );
}

export interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <span className="relative inline-flex">
        <input type="radio" className="peer sr-only" {...props} />
        <span className="h-5 w-5 rounded-full border border-border-neutral bg-white transition-colors peer-checked:border-terracotta peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-terracotta" />
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      <span className="text-[15px] text-ink">{label}</span>
    </label>
  );
}
