import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ThankYouCard } from "@/components/thank-you-card";
import { createPublicClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/data";
import { formatCeremonialDate } from "@/lib/utils";
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

export default async function GuestCardPage({
  params,
}: PageProps<"/t/[slug]">) {
  const { slug } = await params;
  const [card, settings] = await Promise.all([getLiveCard(slug), getSettings()]);
  if (!card) notFound();

  return (
    <main className="flex flex-col items-center px-4 pt-16 sm:pt-24">
      <ThankYouCard
        coupleNames={settings.couple_names}
        message={card.greeting_message}
        ceremonialDate={
          settings.wedding_date ? formatCeremonialDate(settings.wedding_date) : null
        }
        venue={settings.venue}
        photoUrl={settings.couple_photo_url}
        cta={{ href: "/gallery", label: "View Photography" }}
      />
    </main>
  );
}
