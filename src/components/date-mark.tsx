import { cn } from "@/lib/utils";

/**
 * The wedding-site date lockup: "18" over a sweeping script "July" over "26",
 * digits in Tenor Sans terracotta, month in the Abramo script.
 */
export function DateMark({ date, className }: { date: string; className?: string }) {
  const d = new Date(date);
  const day = String(d.getDate());
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = String(d.getFullYear() % 100).padStart(2, "0");

  return (
    <span
      aria-label={d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      className={cn("relative inline-block px-6 py-5", className)}
    >
      <span aria-hidden className="font-tenor absolute -top-0.5 left-[55%] text-[26px] tracking-[2px] text-terracotta">
        {day}
      </span>
      <span aria-hidden className="font-script block text-[68px] leading-none text-light-gray">
        {month}
      </span>
      <span aria-hidden className="font-tenor absolute -bottom-0.5 right-[55%] text-[26px] tracking-[2px] text-terracotta">
        {year}
      </span>
    </span>
  );
}
