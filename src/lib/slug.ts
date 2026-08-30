import { nanoid } from "nanoid";

/** "sarah-Xk29fmQa" — human-friendly but unguessable card URL token. */
export function generateCardSlug(guestFullName: string): string {
  const firstName = guestFullName.trim().split(/\s+/)[0] ?? "guest";
  const base = firstName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);
  return `${base || "guest"}-${nanoid(8)}`;
}
