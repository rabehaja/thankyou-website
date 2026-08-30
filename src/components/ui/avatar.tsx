import Image from "next/image";
import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

const sizePx: Record<AvatarSize, number> = { sm: 32, md: 48, lg: 64 };

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-xl",
};

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  tone?: "terracotta" | "sage";
  className?: string;
}

export function Avatar({ name, src, size = "md", tone = "terracotta", className }: AvatarProps) {
  const px = sizePx[size];
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={px}
        height={px}
        className={cn("rounded-full object-cover", sizeClasses[size], className)}
      />
    );
  }
  const initials = name
    .split(/\s+/)
    .filter((part) => /^[a-z]/i.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium text-white",
        tone === "terracotta" ? "bg-terracotta" : "bg-sage",
        sizeClasses[size],
        className,
      )}
    >
      {initials || "?"}
    </span>
  );
}
