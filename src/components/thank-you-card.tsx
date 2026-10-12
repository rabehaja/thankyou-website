"use client";

import Image from "next/image";
import { CoupleProvider, useCouple } from "@/components/encre/couple-context";
import { CoverMarks } from "@/components/encre/cover-marks";
import { useEntrance } from "@/components/encre/entrance-context";
import { Monogram } from "@/components/encre/monogram";
import { Reveal } from "@/components/encre/reveal";
import { coupleOf } from "@/domain/couple";
import { cn } from "@/lib/utils";
import styles from "@/components/encre/letter.module.css";

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
  /** Overrides the "Dear …," line built from the guest name (used by the generic landing page). */
  salutation?: string;
  className?: string;
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

/**
 * The thank-you page in the Encre & Poudre design of the wedding invitation: the cover with the
 * couple's marks (which glide in from the intro card), the letter on paper, the photo, the
 * gallery link and the navy footer. Shared by `/`, `/t/[slug]` and the backoffice preview, so
 * the preview always matches the live page.
 */
export function ThankYouCard(props: ThankYouCardProps) {
  const couple = coupleOf(props.coupleNames, props.weddingDate ?? null);
  return (
    <CoupleProvider couple={couple}>
      <Letter {...props} />
    </CoupleProvider>
  );
}

function Letter({
  coupleNames,
  guestName,
  companions,
  message,
  venue,
  photoUrl,
  galleryHref,
  salutation,
  className,
}: ThankYouCardProps) {
  const entrance = useEntrance();
  const greeting = salutation ?? buildSalutation(guestName, companions);
  const body = stripSalutation(message);
  const externalGallery = galleryHref.startsWith("http");
  const couple = useCouple();

  return (
    <article className={cn(styles.page, className)}>
      {/* Cover: the marks share layoutIds with the intro card, so they glide into place. */}
      <section className={cn(styles.section, styles.cover)} aria-label="Cover">
        <Reveal delay={0.9}>
          <p className={styles.eyebrow}>Thank you</p>
        </Reveal>
        <CoverMarks
          mode={entrance}
          monogramSize={64}
          classes={{
            name: cn(styles.script, styles.names),
            amp: styles.amp,
            date: cn(styles.dateRow, styles.date),
          }}
        />
        {venue ? (
          <Reveal delay={1}>
            <p className={styles.venue} style={{ marginTop: 10 }}>
              {venue}
            </p>
          </Reveal>
        ) : null}
      </section>

      {/* The personal letter */}
      <section className={styles.section} aria-label="Letter">
        <Reveal>
          <div className={styles.letter}>
            <h1 className={cn(styles.script, styles.salutation)}>{greeting}</h1>
            <div className={styles.rule} />
            <p className={styles.message}>{body}</p>
          </div>
        </Reveal>
      </section>

      {/* The couple's photo in a paper mat */}
      {photoUrl ? (
        <section className={styles.section} aria-label="Photo">
          <Reveal>
            <div className={styles.photoMat}>
              <Image
                src={photoUrl}
                alt={coupleNames}
                width={1040}
                height={780}
                priority
                className={styles.photo}
              />
            </div>
          </Reveal>
        </section>
      ) : null}

      {/* Gallery */}
      <section className={styles.section} aria-label="Gallery">
        <Reveal>
          <a
            href={galleryHref}
            className={styles.gallery}
            {...(externalGallery ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            View the gallery
          </a>
        </Reveal>
      </section>

      <footer className={styles.footer}>
        <Monogram size={30} ring />
        {couple.date.short ? (
          <span className={styles.footerDate}>{couple.date.short}</span>
        ) : null}
        <span className={styles.footerScript}>With all our love</span>
        <span className={styles.footerNames}>{couple.names}</span>
      </footer>
    </article>
  );
}
