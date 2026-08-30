"use server";

import { createPublicClient } from "@/lib/supabase/server";

/**
 * Public by design — called from the guest card page on load. The RPC is
 * security definer and only increments counters for published cards.
 */
export async function recordCardOpen(slug: string): Promise<void> {
  if (typeof slug !== "string" || slug.length === 0 || slug.length > 100) return;
  try {
    const supabase = createPublicClient();
    await supabase.rpc("record_card_open", { card_slug: slug });
  } catch {
    // Analytics must never break the guest-facing page.
  }
}
