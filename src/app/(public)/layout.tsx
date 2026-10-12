import type { ReactNode } from "react";
import { CopyrightBar } from "@/components/copyright-bar";

/**
 * Public pages wear the Encre & Poudre design of the wedding invitation. The sign-off lives in
 * each page's navy footer (see ThankYouCard); the layout sets the blush canvas and closes with
 * the copyright line, which sits under the navy footer in the same ink.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="encre flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <CopyrightBar tone="dark" />
    </div>
  );
}
