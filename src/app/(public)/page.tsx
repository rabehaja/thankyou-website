import Image from "next/image";
import Link from "next/link";
import { LeafIcon } from "@/components/ui/icons";
import { getSettings } from "@/lib/data";
import { formatCeremonialDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const DEFAULT_MESSAGE =
  "We are forever grateful for your presence, your warm wishes, and the thoughtful gifts that marked the beginning of our new chapter together.";

export default async function LandingPage() {
  const settings = await getSettings();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 pt-20 text-center sm:pt-28">
      <div className="flex items-center gap-4 text-terracotta">
        <span className="h-px w-10 bg-terracotta/50" />
        <span className="text-h2 text-[13px]">Dear Family &amp; Friends</span>
        <span className="h-px w-10 bg-terracotta/50" />
      </div>

      <h1 className="mt-8 text-display text-[52px] text-terracotta sm:text-[64px]">
        {settings.couple_names}
      </h1>

      {settings.wedding_date ? (
        <p className="mt-6 text-h2 text-[13px] text-ink/80 sm:text-[15px]">
          {formatCeremonialDate(settings.wedding_date)}
        </p>
      ) : null}
      {settings.venue ? (
        <p className="mt-3 text-small text-muted">{settings.venue}</p>
      ) : null}

      <LeafIcon size={30} className="mt-10 text-sage" />

      {settings.couple_photo_url ? (
        <div className="mt-10 w-full max-w-xl overflow-hidden rounded-frame shadow-letter">
          <Image
            src={settings.couple_photo_url}
            alt={settings.couple_names}
            width={960}
            height={640}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      <p className="mt-12 max-w-xl text-body text-ink/90">
        {settings.thank_you_message ?? DEFAULT_MESSAGE}
      </p>

      <Link
        href="/gallery"
        className="mt-12 inline-flex items-center justify-center rounded-pill bg-terracotta px-9 py-3.5 text-ui-label text-[12px] text-white transition-colors hover:bg-terracotta-hover"
      >
        View Gallery
      </Link>
    </main>
  );
}
