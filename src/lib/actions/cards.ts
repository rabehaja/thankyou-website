"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateCardSlug } from "@/lib/slug";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createCardForGuest(formData: FormData): Promise<void> {
  await requireAdminAction();
  const guestId = z.uuid().parse(formData.get("guest_id"));
  const supabase = createAdminClient();

  const { data: guest } = await supabase
    .from("guests")
    .select("id, full_name")
    .eq("id", guestId)
    .maybeSingle();
  if (!guest) throw new Error("Guest not found");

  let cardId: string | null = null;
  // Retry once on the (astronomically unlikely) slug collision.
  for (let attempt = 0; attempt < 2 && !cardId; attempt++) {
    const { data, error } = await supabase
      .from("thank_you_cards")
      .insert({ guest_id: guest.id, slug: generateCardSlug(guest.full_name) })
      .select("id")
      .single();
    if (data) cardId = data.id;
    else if (error && !error.message.includes("slug")) {
      // unique(guest_id) — a card already exists; open it instead.
      const { data: existing } = await supabase
        .from("thank_you_cards")
        .select("id")
        .eq("guest_id", guest.id)
        .maybeSingle();
      if (existing) {
        redirect(`/admin/cards/${existing.id}`);
      }
      throw new Error(error.message);
    }
  }
  if (!cardId) throw new Error("Could not create the card");
  revalidatePath("/admin/cards");
  redirect(`/admin/cards/${cardId}`);
}

const messageSchema = z.string().trim().max(2000, "Greeting is too long (2000 characters max).");

export async function saveCardMessage(
  cardId: string,
  message: string,
): Promise<ActionResult> {
  await requireAdminAction();
  const parsed = messageSchema.safeParse(message);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid greeting." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("thank_you_cards")
    .update({ greeting_message: parsed.data, updated_at: new Date().toISOString() })
    .eq("id", cardId);
  if (error) return { ok: false, error: "Could not save the greeting. Please try again." };
  revalidatePath(`/admin/cards/${cardId}`);
  await revalidateCardPage(cardId);
  return { ok: true };
}

async function revalidateCardPage(cardId: string): Promise<void> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("thank_you_cards")
    .select("slug")
    .eq("id", cardId)
    .maybeSingle();
  if (data) revalidatePath(`/t/${data.slug}`);
}

async function setCardStatus(
  cardId: string,
  status: "draft" | "published" | "archived",
): Promise<ActionResult> {
  await requireAdminAction();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("thank_you_cards")
    .update({
      status,
      published_at: status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", cardId);
  if (error) return { ok: false, error: "Could not update the card status." };
  revalidatePath("/admin/cards");
  revalidatePath(`/admin/cards/${cardId}`);
  await revalidateCardPage(cardId);
  return { ok: true };
}

export async function publishCard(cardId: string): Promise<ActionResult> {
  return setCardStatus(cardId, "published");
}

export async function unpublishCard(cardId: string): Promise<ActionResult> {
  return setCardStatus(cardId, "draft");
}

export async function archiveCard(cardId: string): Promise<ActionResult> {
  return setCardStatus(cardId, "archived");
}

export async function deleteCard(cardId: string): Promise<ActionResult> {
  await requireAdminAction();
  const supabase = createAdminClient();
  await revalidateCardPage(cardId);
  const { error } = await supabase.from("thank_you_cards").delete().eq("id", cardId);
  if (error) return { ok: false, error: "Could not delete the card." };
  revalidatePath("/admin/cards");
  return { ok: true };
}
