import Link from "next/link";
import { LeafIcon } from "@/components/ui/icons";

export default function CardNotFound() {
  return (
    <main className="flex flex-col items-center px-4 pt-24 text-center">
      <div className="w-full max-w-md rounded-frame bg-cream-card px-10 py-14 shadow-letter">
        <LeafIcon size={26} className="mx-auto text-sage" />
        <h1 className="mt-5 text-h1 text-[34px] text-terracotta">
          This page isn&apos;t available
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">
          The thank-you card you&apos;re looking for hasn&apos;t been published,
          or the link isn&apos;t quite right. Please check with the couple for a
          fresh link.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-pill border border-terracotta px-7 py-2.5 text-ui-label text-[12px] text-terracotta transition-colors hover:bg-terracotta-soft/60"
        >
          Visit Our Thank You Page
        </Link>
      </div>
    </main>
  );
}
