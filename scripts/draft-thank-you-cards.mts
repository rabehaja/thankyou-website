/**
 * Drafts a thank-you card for every active guest who has none yet.
 *
 *   npm run cards:draft            # dry run: prints every message, writes nothing
 *   npm run cards:draft -- --apply # inserts the cards as drafts (review them in the backoffice)
 *
 * Reads the Supabase keys from .env.local (service role: this runs on your machine only).
 * Idempotent: guests who already have a card are skipped, and the wording for a guest is
 * derived from their id, so re-running produces the same text.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database, Guest, Settings } from "../src/lib/database.types.ts";
import { generateCardSlug } from "../src/lib/slug.ts";
import {
  composeThankYouMessage,
  hasTag,
  partySizeOf,
  stayOf,
  type MessageContext,
} from "../src/domain/thank-you-message.ts";

const apply = process.argv.includes("--apply");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are needed (run through npm, which loads .env.local).");
  process.exit(1);
}
const supabase = createClient<Database>(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function weddingDayOf(settings: Pick<Settings, "wedding_date"> | null): string {
  if (!settings?.wedding_date) return "Our wedding day";
  const date = new Date(settings.wedding_date);
  return Number.isNaN(date.getTime())
    ? "Our wedding day"
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

function signatureOf(settings: Pick<Settings, "couple_names"> | null): string {
  // The template signs "Wiebke & Loïc": bride first.
  const [first = "", second = ""] = (settings?.couple_names ?? "")
    .split(/\s*(?:&|\band\b)\s*/i)
    .map((part) => part.trim());
  return second ? `${second} & ${first}` : first;
}

function contextFor(guest: Guest, weddingDay: string, signature: string): MessageContext {
  return {
    seed: guest.id,
    partySize: partySizeOf(guest.companions),
    stay: stayOf(guest.tags),
    gift: !hasTag(guest.tags, /\bno[\s-]?gift\b/i),
    helped: hasTag(guest.tags, /\b(helped|helper|witness|best man|maid of honou?r|bridesmaid|groomsman)\b/i),
    weddingDay,
    signature,
  };
}

async function main(): Promise<void> {
  const [{ data: settings }, { data: guests, error: guestsError }, { data: cards, error: cardsError }] =
    await Promise.all([
      supabase.from("settings").select("couple_names, wedding_date").eq("id", 1).maybeSingle(),
      supabase.from("guests").select("*").neq("status", "archived").order("full_name"),
      supabase.from("thank_you_cards").select("guest_id"),
    ]);
  if (guestsError) throw guestsError;
  if (cardsError) throw cardsError;

  const withCard = new Set((cards ?? []).map((card) => card.guest_id));
  const pending = (guests ?? []).filter((guest) => !withCard.has(guest.id));
  const weddingDay = weddingDayOf(settings);
  const signature = signatureOf(settings);

  console.log(`${(guests ?? []).length} guests, ${withCard.size} already have a card, ${pending.length} to draft.\n`);

  const drafts = pending.map((guest) => {
    const ctx = contextFor(guest, weddingDay, signature);
    return { guest, ctx, message: composeThankYouMessage(ctx) };
  });

  for (const { guest, ctx, message } of drafts) {
    const party = [guest.full_name, ...guest.companions].join(", ");
    console.log(`──── ${party}  (${ctx.partySize}, ${ctx.stay}${ctx.gift ? "" : ", no gift"}${ctx.helped ? ", helped" : ""})`);
    console.log(message, "\n");
  }

  if (!apply) {
    console.log(`Dry run: nothing written. Re-run with --apply to insert ${drafts.length} draft cards.`);
    return;
  }

  let inserted = 0;
  for (const { guest, message } of drafts) {
    const { error } = await supabase.from("thank_you_cards").insert({
      guest_id: guest.id,
      slug: generateCardSlug(guest.full_name),
      greeting_message: message,
      status: "draft",
    });
    if (error) console.error(`✗ ${guest.full_name}: ${error.message}`);
    else inserted++;
  }
  console.log(`\nInserted ${inserted} draft card(s). Review them under /admin/cards, then "Copy the shareable link" on each.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
