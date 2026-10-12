import { OpeningExperience } from "@/components/encre/opening-experience";
import { ThankYouCard } from "@/components/thank-you-card";
import { coupleFromSettings } from "@/domain/couple";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

const DEFAULT_MESSAGE =
  "We are forever grateful for your presence, your warm wishes, and the thoughtful gifts that marked the beginning of our new chapter together.";

/** The generic thank-you page: the sealed envelope, then the letter addressed to everyone. */
export default async function LandingPage() {
  const settings = await getSettings();

  return (
    <main className="w-full">
      <OpeningExperience couple={coupleFromSettings(settings)}>
        <ThankYouCard
          coupleNames={settings.couple_names}
          guestName=""
          salutation="Dear family & friends,"
          message={settings.thank_you_message ?? DEFAULT_MESSAGE}
          weddingDate={settings.wedding_date}
          venue={settings.venue}
          photoUrl={settings.couple_photo_url}
          galleryHref={settings.gallery_url ?? "/gallery"}
        />
      </OpeningExperience>
    </main>
  );
}
