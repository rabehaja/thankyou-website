import type { ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-bg">
      <div className="flex-1">{children}</div>
      <footer className="px-6 pb-10 pt-16 text-center">
        <p className="text-caption text-[12px] text-light-gray">
          With all our love, always
        </p>
      </footer>
    </div>
  );
}
