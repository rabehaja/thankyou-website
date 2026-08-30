/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DateMark } from "@/components/date-mark";
import { PineIcon, SparklesIcon } from "@/components/ui/icons";

export interface ThankYouCardProps {
  coupleNames: string;
  guestName: string;
  companions?: string[];
  message: string;
  weddingDate?: string | null;
  venue?: string | null;
  photoUrl?: string | null;
  featuredPhotoUrl?: string | null;
  galleryHref: string;
  className?: string;
}

/** "Loïc & Wiebke" → "L & W" */
function monogram(coupleNames: string): string {
  const initials = coupleNames
    .split(/&|\band\b/i)
    .map((part) => part.trim()[0]?.toUpperCase())
    .filter(Boolean);
  return initials.length >= 2 ? initials.join(" & ") : (initials[0] ?? "•");
}

/** "Dear Verena & Ruben," — first names of the whole party. */
export function buildSalutation(guestName: string, companions: string[] = []): string {
  const firstNames = [guestName, ...companions]
    .map((name) => name.trim().split(/\s+/)[0])
    .filter(Boolean);
  if (firstNames.length === 0) return "Dear friend,";
  if (firstNames.length === 1) return `Dear ${firstNames[0]},`;
  const last = firstNames[firstNames.length - 1];
  return `Dear ${firstNames.slice(0, -1).join(", ")} & ${last},`;
}

/** Avoid a doubled salutation when the message already starts with "Dear …," */
function stripSalutation(message: string): string {
  const stripped = message.replace(/^dear\s+[^,\n]{1,50},\s*/i, "");
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

function FleuronDivider() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-4">
      <span className="h-px w-24 bg-border-neutral sm:w-32" />
      <span className="h-[5px] w-[5px] rounded-full bg-sage" />
      <SparklesIcon size={16} className="text-terracotta" />
      <span className="h-[5px] w-[5px] rounded-full bg-sage" />
      <span className="h-px w-24 bg-border-neutral sm:w-32" />
    </div>
  );
}

/**
 * The guest thank-you page, per the Figma "guest-thank-you-page" frame
 * (36:188). Shared by /t/[slug] and the backoffice composer preview.
 */
export function ThankYouCard({
  coupleNames,
  guestName,
  companions,
  message,
  weddingDate,
  venue,
  photoUrl,
  featuredPhotoUrl,
  galleryHref,
  className,
}: ThankYouCardProps) {
  const salutation = buildSalutation(guestName, companions);
  const body = stripSalutation(message);
  const externalGallery = galleryHref.startsWith("http");

  return (
    <article className={cn("flex w-full flex-col items-center gap-16 pb-8", className)}>
      {/* Header crest */}
      <header className="flex flex-col items-center gap-7 pt-16">
        <img
          src="/decor/vine.svg"
          alt=""
          width={140}
          height={140}
          className="opacity-80"
        />
        <span className="rounded-pill border border-terracotta/60 px-7 py-3 font-serif text-[26px] font-medium tracking-[3px] text-ink">
          {monogram(coupleNames)}
        </span>
      </header>

      {/* Hero photo in a white mat */}
      {photoUrl ? (
        <section className="flex w-full max-w-4xl flex-col items-center gap-8 px-4">
          <div className="w-full rounded-card bg-white p-3 shadow-card sm:p-4">
            <Image
              src={photoUrl}
              alt={coupleNames}
              width={1040}
              height={620}
              priority
              className="aspect-[4/3] w-full rounded-[8px] object-cover object-[center_30%] sm:aspect-[2/1]"
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            {weddingDate ? <DateMark date={weddingDate} /> : null}
            {venue ? <p className="text-small text-muted">{venue}</p> : null}
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center gap-1 text-center">
          {weddingDate ? <DateMark date={weddingDate} /> : null}
          {venue ? <p className="text-small text-muted">{venue}</p> : null}
        </section>
      )}

      {/* Personal letter */}
      <section className="w-full px-4">
        <div className="relative mx-auto w-full max-w-2xl rounded-frame bg-white px-8 py-14 shadow-letter sm:px-16">
          <PineIcon size={24} className="absolute right-6 top-6 text-sage opacity-40" />
          <h1 className="text-h1 text-[34px] text-terracotta sm:text-[40px]">
            {salutation}
          </h1>
          <p className="mt-8 whitespace-pre-line text-[16px] leading-[1.8] text-ink/85">
            {body}
          </p>
        </div>
      </section>

      {/* <FleuronDivider /> */}

      {/* Gallery feature */}
      <section className="grid w-full max-w-4xl grid-cols-1 items-center gap-10 px-6">
        <div className="flex flex-col items-center">
          {/* <p className="font-thin-serif text-[13px] uppercase tracking-[3px] text-sage">
            The Gallery
          </p>
          <p className="text-[19px] font-light leading-relaxed text-ink/85">
            Every laugh, every dance, every quiet moment — relive the day with
            us in pictures.
          </p>
          <span aria-hidden className="h-0.5 w-16 bg-sage/60" /> */}
          <a
            href={galleryHref}
            target={externalGallery ? "_blank" : undefined}
            rel={externalGallery ? "noreferrer" : undefined}
            className="mt-1 inline-flex items-center justify-center rounded-pill bg-terracotta px-8 py-3 font-sans text-[12px] font-semibold uppercase tracking-[4px] text-near-black transition-colors hover:bg-terracotta-hover"
          >
            View Gallery
          </a>
        </div>
        {/* {featuredPhotoUrl ? (
          <Image
            src={featuredPhotoUrl}
            alt={`${coupleNames} wedding moment`}
            width={480}
            height={600}
            className="aspect-[4/5] w-full rounded-[32px] rounded-bl-[120px] rounded-tl-[120px] rounded-tr-[120px] object-cover"
          />
        ) : null} */}
      </section>

      <FleuronDivider />

      {/* Romantic signoff */}
      <footer className="flex flex-col items-center gap-6 px-4 text-center">
        <p className="font-thin-serif text-[14px] uppercase tracking-[3px]">
          With love,
        </p>
        <p className="text-display text-[52px] text-terracotta sm:text-[64px]">
          {coupleNames}
        </p>
        <PineIcon size={24} className="text-sage opacity-40" />
      </footer>
    </article>
  );
}
