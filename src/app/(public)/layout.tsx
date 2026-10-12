import type { ReactNode } from "react";

/**
 * Public pages wear the Encre & Poudre design of the wedding invitation. The sign-off lives in
 * each page's navy footer (see ThankYouCard), so the layout only sets the blush canvas.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return <div className="encre flex min-h-screen flex-col">{children}</div>;
}
