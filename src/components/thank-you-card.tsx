import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LeafIcon } from "@/components/ui/icons";

export interface ThankYouCardProps {
  coupleNames: string;
  message: string;
  ceremonialDate?: string | null;
  venue?: string | null;
  photoUrl?: string | null;
  cta?: { href: string; label: string } | null;
  className?: string;
}

/**
 * The envelope-style thank-you card. Shared by the public card page and the
 * backoffice composer preview so the preview always matches the live page.
 */
export function ThankYouCard({
  coupleNames,
  message,
  ceremonialDate,
  venue,
  photoUrl,
  cta,
  className,
}: ThankYouCardProps) {
  return (
    <article
      className={cn(
        "w-full max-w-xl rounded-frame bg-cream-card px-10 py-14 text-center shadow-letter sm:px-14",
        className,
      )}
    >
      {photoUrl ? (
        <div className="mx-auto mb-8 max-w-sm overflow-hidden rounded-card shadow-card">
          <Image
            src={photoUrl}
            alt={coupleNames}
            width={640}
            height={480}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : (
        <LeafIcon size={28} className="mx-auto mb-6 text-sage" />
      )}
      <h1 className="text-h1 text-terracotta sm:text-[52px]">{coupleNames}</h1>
      {ceremonialDate ? (
        <p className="mt-4 text-h2 text-[13px] text-ink/80 sm:text-[15px]">{ceremonialDate}</p>
      ) : null}
      {venue ? <p className="mt-2 text-small text-muted">{venue}</p> : null}
      <div className="mx-auto my-8 h-px w-16 bg-border-neutral" />
      <p className="whitespace-pre-line text-body text-ink/90">{message}</p>
      <p className="mt-10 text-caption text-[13px] text-muted">
        With all our love, always
      </p>
      {cta ? (
        <Link
          href={cta.href}
          className="mt-8 inline-flex items-center justify-center rounded-pill bg-terracotta px-8 py-3 text-ui-label text-[12px] text-white transition-colors hover:bg-terracotta-hover"
        >
          {cta.label}
        </Link>
      ) : null}
    </article>
  );
}
