import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type { Settings } from "@/lib/database.types";

export const FALLBACK_SETTINGS: Settings = {
  id: 1,
  couple_names: "Julian & Charlotte",
  wedding_date: null,
  venue: null,
  thank_you_message: null,
  couple_photo_url: null,
  rsvp_active: true,
  updated_at: new Date(0).toISOString(),
};

/**
 * Site settings, deduplicated per request. Falls back to defaults when
 * Supabase env vars are missing so the app still renders before setup.
 */
export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data ?? FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
});

export function publicPhotoUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/photos/${storagePath}`;
}

export function cardUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base}/t/${slug}`;
}
