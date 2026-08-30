import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardComposer } from "@/components/admin/card-composer";
import { cardUrl, getSettings, publicPhotoUrl } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Compose Card" };

export default async function CardDetailPage({
  params,
}: PageProps<"/admin/cards/[id]">) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: card }, settings, { data: firstPhoto }] = await Promise.all([
    supabase
      .from("thank_you_cards")
      .select("*, guests(full_name)")
      .eq("id", id)
      .maybeSingle(),
    getSettings(),
    supabase
      .from("gallery_photos")
      .select("storage_path")
      .order("sort_order")
      .limit(1)
      .maybeSingle(),
  ]);
  if (!card) notFound();

  const guestName =
    (card.guests as { full_name: string } | null)?.full_name ?? "Unknown guest";

  return (
    <CardComposer
      card={{
        id: card.id,
        status: card.status,
        greeting_message: card.greeting_message,
        publicUrl: cardUrl(card.slug),
      }}
      guestName={guestName}
      preview={{
        coupleNames: settings.couple_names,
        weddingDate: settings.wedding_date,
        venue: settings.venue,
        photoUrl: settings.couple_photo_url,
        featuredPhotoUrl: firstPhoto ? publicPhotoUrl(firstPhoto.storage_path) : null,
        galleryHref: settings.gallery_url ?? "/gallery",
      }}
    />
  );
}
