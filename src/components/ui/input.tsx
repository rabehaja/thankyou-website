import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, SearchIcon } from "@/components/ui/icons";

const fieldClasses =
  "w-full rounded-input border bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-muted/70 transition-colors focus:outline-none disabled:bg-cream-card disabled:text-muted disabled:cursor-not-allowed";

function stateClasses(invalid: boolean | undefined): string {
  return invalid
    ? "border-danger focus:border-danger"
    : "border-border-neutral focus:border-terracotta";
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function Input({ invalid, className, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(fieldClasses, stateClasses(invalid), className)}
      {...props}
    />
  );
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function Textarea({ invalid, className, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(fieldClasses, stateClasses(invalid), "min-h-28 leading-relaxed", className)}
      {...props}
    />
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export function Select({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(fieldClasses, stateClasses(invalid), "appearance-none pr-10 cursor-pointer", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

export function SearchInput({ className, ...props }: InputProps) {
  return (
    <div className={cn("relative", className)}>
      <SearchIcon
        size={17}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        className={cn(fieldClasses, stateClasses(false), "pl-10")}
        {...props}
      />
    </div>
  );
}
