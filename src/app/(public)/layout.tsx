import type { ReactNode } from "react";
import { LoveAlways } from "@/components/love-always";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-bg">
      <div className="flex-1">{children}</div>
      <footer className="px-6 pb-10 pt-16 text-center">
        <LoveAlways />
      </footer>
    </div>
  );
}
