import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@/components/ui/icons";

export type AlertVariant = "success" | "error" | "warning" | "info";

const alertClasses: Record<AlertVariant, string> = {
  success: "bg-sage-soft text-sage",
  error: "bg-danger-soft text-danger",
  warning: "bg-gold-soft text-gold",
  info: "bg-info-soft text-info",
};

const alertIcons: Record<AlertVariant, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export function Alert({
  variant,
  children,
  className,
}: {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const Icon = alertIcons[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-3 rounded-card px-4 py-3 text-[14px] font-medium",
        alertClasses[variant],
        className,
      )}
    >
      <Icon size={18} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}
