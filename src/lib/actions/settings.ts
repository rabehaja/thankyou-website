"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SettingsFormState {
  error: string | null;
  saved: boolean;
}

const settingsSchema = z.object({
  couple_names: z.string().trim().min(1, "Couple names are required."),
  wedding_date: z
    .string()
    .trim()
    .transform((value) => value || null),
  venue: z
    .string()
    .trim()
    .transform((value) => value || null),
  thank_you_message: z
    .string()
    .trim()
    .max(2000, "Message is too long (2000 characters max).")
    .transform((value) => value || null),
  rsvp_active: z.boolean(),
});

export async function updateSettings(
  _prev: SettingsFormState,
  formData: FormData,
): Promise<SettingsFormState> {
  await requireAdminAction();
  const parsed = settingsSchema.safeParse({
    couple_names: formData.get("couple_names") ?? "",
    wedding_date: formData.get("wedding_date") ?? "",
    venue: formData.get("venue") ?? "",
    thank_you_message: formData.get("thank_you_message") ?? "",
    rsvp_active: formData.get("rsvp_active") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings.", saved: false };
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("settings")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: "Could not save settings. Please try again.", saved: false };
  revalidatePath("/", "layout");
  return { error: null, saved: true };
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

async function uploadPhoto(
  file: File,
  folder: "couple" | "gallery",
): Promise<{ path: string } | { error: string }> {
  if (file.size === 0) return { error: "Please choose a photo to upload." };
  if (file.size > MAX_PHOTO_BYTES) return { error: "Photos must be 5 MB or smaller." };
  const extension = ALLOWED_PHOTO_TYPES[file.type];
  if (!extension) return { error: "Photos must be JPEG, PNG, or WebP." };

  const supabase = createAdminClient();
  const path = `${folder}/${nanoid()}.${extension}`;
  const { error } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });
  if (error) return { error: "Error occurred while uploading the photo. Try again." };
  return { path };
}

export interface UploadState {
  error: string | null;
  uploaded: boolean;
}

export async function uploadCouplePhoto(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  await requireAdminAction();
  const file = formData.get("photo");
  if (!(file instanceof File)) return { error: "Please choose a photo to upload.", uploaded: false };
  const result = await uploadPhoto(file, "couple");
  if ("error" in result) return { error: result.error, uploaded: false };

  const supabase = createAdminClient();
  const url = supabase.storage.from("photos").getPublicUrl(result.path).data.publicUrl;
  const { error } = await supabase
    .from("settings")
    .update({ couple_photo_url: url, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) return { error: "Could not save the photo. Please try again.", uploaded: false };
  revalidatePath("/", "layout");
  return { error: null, uploaded: true };
}

export async function uploadGalleryPhoto(
  _prev: UploadState,
  formData: FormData,
): Promise<UploadState> {
  await requireAdminAction();
  const file = formData.get("photo");
  if (!(file instanceof File)) return { error: "Please choose a photo to upload.", uploaded: false };
  const result = await uploadPhoto(file, "gallery");
  if ("error" in result) return { error: result.error, uploaded: false };

  const supabase = createAdminClient();
  const { count } = await supabase
    .from("gallery_photos")
    .select("id", { count: "exact", head: true });
  const { error } = await supabase
    .from("gallery_photos")
    .insert({ storage_path: result.path, sort_order: (count ?? 0) + 1 });
  if (error) return { error: "Could not save the photo. Please try again.", uploaded: false };
  revalidatePath("/gallery");
  revalidatePath("/admin/settings");
  return { error: null, uploaded: true };
}

export async function deleteGalleryPhoto(photoId: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdminAction();
  const supabase = createAdminClient();
  const { data: photo } = await supabase
    .from("gallery_photos")
    .select("storage_path")
    .eq("id", photoId)
    .maybeSingle();
  if (!photo) return { ok: false, error: "Photo not found." };
  const { error } = await supabase.from("gallery_photos").delete().eq("id", photoId);
  if (error) return { ok: false, error: "Could not remove the photo." };
  await supabase.storage.from("photos").remove([photo.storage_path]);
  revalidatePath("/gallery");
  revalidatePath("/admin/settings");
  return { ok: true };
}
