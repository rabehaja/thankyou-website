import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OpenTracker } from "@/components/open-tracker";
import { ThankYouCard } from "@/components/thank-you-card";
import { createPublicClient } from "@/lib/supabase/server";
import { getSettings, publicPhotoUrl } from "@/lib/data";
import type { LiveCard } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "A Thank You For You" };

async function getLiveCard(slug: string): Promise<LiveCard | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.rpc("get_live_card", { card_slug: slug });
    return data?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getFeaturedPhotoUrl(): Promise<string | null> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("gallery_photos")
      .select("storage_path")
      .order("sort_order")
      .limit(1)
      .maybeSingle();
    return data ? publicPhotoUrl(data.storage_path) : null;
  } catch {
    return null;
  }
}

export default async function GuestCardPage({
  params,
}: PageProps<"/t/[slug]">) {
  const { slug } = await params;
  const [card, settings, featuredPhotoUrl] = await Promise.all([
    getLiveCard(slug),
    getSettings(),
    getFeaturedPhotoUrl(),
  ]);
  if (!card) notFound();

  return (
    <main className="w-full">
      <OpenTracker slug={slug} />
      <ThankYouCard
        coupleNames={settings.couple_names}
        guestName={card.guest_name}
        companions={card.companions}
        message={card.greeting_message}
        weddingDate={settings.wedding_date}
        venue={settings.venue}
        photoUrl={settings.couple_photo_url}
        featuredPhotoUrl={featuredPhotoUrl}
        galleryHref={settings.gallery_url ?? "/gallery"}
      />
    </main>
  );
}
