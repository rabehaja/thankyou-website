"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

const guestSchema = z.object({
  full_name: z.string().trim().min(1, "Guest name is required."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .or(z.literal(""))
    .transform((value) => value || null),
  table_assignment: z
    .string()
    .trim()
    .transform((value) => value || null),
  tags: z.array(z.string().trim().min(1)).max(12),
  rsvp_received: z.boolean(),
  status: z.enum(["active", "pending", "archived"]),
});

export interface GuestFormState {
  error: string | null;
}

function parseGuestForm(formData: FormData) {
  let tags: string[] = [];
  try {
    const raw = JSON.parse(String(formData.get("tags") ?? "[]"));
    if (Array.isArray(raw)) tags = raw.map(String);
  } catch {
    tags = [];
  }
  return guestSchema.safeParse({
    full_name: formData.get("full_name") ?? "",
    email: formData.get("email") ?? "",
    table_assignment: formData.get("table_assignment") ?? "",
    tags,
    rsvp_received: formData.get("rsvp_received") === "on",
    status: formData.get("status") ?? "active",
  });
}

export async function createGuest(
  _prev: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  await requireAdminAction();
  const parsed = parseGuestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid guest details." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("guests").insert(parsed.data);
  if (error) return { error: "Could not save the guest. Please try again." };
  revalidatePath("/admin");
  redirect("/admin/guests");
}

export async function updateGuest(
  guestId: string,
  _prev: GuestFormState,
  formData: FormData,
): Promise<GuestFormState> {
  await requireAdminAction();
  const parsed = parseGuestForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid guest details." };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("guests")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", guestId);
  if (error) return { error: "Could not update the guest. Please try again." };
  revalidatePath("/admin");
  redirect("/admin/guests");
}

export async function deleteGuest(guestId: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdminAction();
  const supabase = createAdminClient();
  const { error } = await supabase.from("guests").delete().eq("id", guestId);
  if (error) return { ok: false, error: "Could not delete the guest record." };
  revalidatePath("/admin");
  revalidatePath("/admin/guests");
  revalidatePath("/admin/cards");
  return { ok: true };
}
