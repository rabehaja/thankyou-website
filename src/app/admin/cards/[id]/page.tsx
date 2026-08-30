import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardComposer } from "@/components/admin/card-composer";
import { cardUrl, getSettings } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCeremonialDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Compose Card" };

export default async function CardDetailPage({
  params,
}: PageProps<"/admin/cards/[id]">) {
  const { id } = await params;
  const supabase = createAdminClient();
  const [{ data: card }, settings] = await Promise.all([
    supabase
      .from("thank_you_cards")
      .select("*, guests(full_name)")
      .eq("id", id)
      .maybeSingle(),
    getSettings(),
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
        ceremonialDate: settings.wedding_date
          ? formatCeremonialDate(settings.wedding_date)
          : null,
        venue: settings.venue,
        photoUrl: settings.couple_photo_url,
      }}
    />
  );
}
