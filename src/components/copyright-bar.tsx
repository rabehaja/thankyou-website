import { cn } from "@/lib/utils";

const PUBLISHER = "Vayu Consulting";
const YEAR = 2026;

/** Thin legal line at the very bottom of a page. Tone is picked per surface by the caller. */
export function CopyrightBar({
  tone = "light",
  className,
}: {
  readonly tone?: "light" | "dark";
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full px-4 py-3 text-center text-[11px] tracking-[0.04em]",
        tone === "dark"
          ? "bg-[#17203a] text-[#f6ebe7]/70"
          : "border-t border-border-neutral bg-cream-bg text-muted",
        className,
      )}
    >
      &copy; {YEAR} {PUBLISHER}. All rights reserved.
    </div>
  );
}
