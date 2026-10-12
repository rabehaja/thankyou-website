import type { Settings } from "@/lib/database.types";

/**
 * The couple as the Encre & Poudre design shows it: two first names, their initials for the
 * monogram, and the wedding date in the two forms the cards use. Derived from the site settings
 * so the backoffice stays the single place where the names and the date are managed.
 */
export interface CoupleIdentity {
  readonly monogram: { readonly left: string; readonly right: string };
  readonly groom: string;
  readonly bride: string;
  /** Both names joined, e.g. "Loïc & Wiebke". */
  readonly names: string;
  readonly date: {
    /** "Saturday 14 November 2026", or null when no date is set. */
    readonly long: string | null;
    /** "14 · 11 · 2026", or null when no date is set. */
    readonly short: string | null;
  };
}

const NAME_SEPARATOR = /\s*(?:&|\band\b|\bet\b)\s*/i;

export function coupleFromSettings(
  settings: Pick<Settings, "couple_names" | "wedding_date">,
): CoupleIdentity {
  return coupleOf(settings.couple_names, settings.wedding_date);
}

export function coupleOf(
  coupleNames: string,
  weddingDate: string | null,
): CoupleIdentity {
  const [first = "", second = ""] = coupleNames
    .split(NAME_SEPARATOR)
    .map((part) => part.trim())
    .filter(Boolean);
  const groom = first;
  const bride = second;
  const date = weddingDate ? new Date(weddingDate) : null;
  const valid = date !== null && !Number.isNaN(date.getTime());
  return {
    monogram: { left: initial(groom), right: initial(bride) },
    groom,
    bride,
    names: bride ? `${groom} & ${bride}` : groom,
    date: {
      long: valid ? formatLong(date) : null,
      short: valid ? formatShort(date) : null,
    },
  };
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

function formatLong(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShort(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd} · ${mm} · ${date.getFullYear()}`;
}
