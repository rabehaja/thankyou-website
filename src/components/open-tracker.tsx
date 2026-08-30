"use client";

import { useEffect, useRef } from "react";
import { recordCardOpen } from "@/lib/actions/analytics";

/** Fires once per page load; runs only in the browser so most bots don't count. */
export function OpenTracker({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void recordCardOpen(slug);
  }, [slug]);

  return null;
}
