import { cn } from "@/lib/utils";

/** "WITH ALL OUR LOVE." in sans caps + "Always" in script, all black. */
export function LoveAlways({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-baseline justify-center gap-2.5 text-near-black", className)}>
      <span className="font-sans text-[13px] font-medium uppercase tracking-[3px]">
        With all our love.
      </span>
      <span className="font-script text-[56px] leading-none">Always</span>
    </p>
  );
}
