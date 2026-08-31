import type { Metadata } from "next";
import Image from "next/image";
import { Alert } from "@/components/ui/alert";
import { FormCard } from "@/components/ui/card";
import { GalleryManager, type GalleryItem } from "@/components/admin/gallery-manager";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { SettingsForm } from "@/components/admin/settings-form";
import { uploadCouplePhoto, uploadGalleryPhoto } from "@/lib/actions/settings";
import { getSettings, publicPhotoUrl } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Settings" };

async function getGalleryPhotos(): Promise<GalleryItem[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("id, storage_path")
      .order("sort_order");
    if (error) return null;
    return (data ?? []).map((photo) => ({
      id: photo.id,
      url: publicPhotoUrl(photo.storage_path),
    }));
  } catch {
    return null;
  }
}

export default async function SettingsPage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGalleryPhotos()]);

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-h1 text-[56px] text-ink">Settings</h1>
        <p className="mt-1 text-[15px] text-muted">
          Everything shown on the public thank-you pages lives here.
        </p>
      </div>

      <FormCard
        heading="Wedding Details"
        description="Include key configuration parameters and controls inside this standard structured container."
      >
        <SettingsForm settings={settings} />
      </FormCard>

      <FormCard
        heading="Couple Photo"
        description="Displayed at the top of every thank-you card."
      >
        <div className="flex flex-col gap-5">
          {settings.couple_photo_url ? (
            <Image
              src={settings.couple_photo_url}
              alt={settings.couple_names}
              width={320}
              height={240}
              className="h-44 w-64 rounded-card object-cover shadow-card"
            />
          ) : null}
          <PhotoUploader
            action={uploadCouplePhoto}
            buttonLabel="Upload Couple Photo"
            successMessage="Couple photo updated!"
          />
        </div>
      </FormCard>

      <FormCard
        heading="Photo Gallery"
        description="These photos appear on the public gallery page."
      >
        <div className="flex flex-col gap-6">
          <PhotoUploader
            action={uploadGalleryPhoto}
            buttonLabel="Upload Gallery Photo"
            successMessage="Photo added to the gallery!"
          />
          {gallery === null ? (
            <Alert variant="warning">
              Supabase is not configured yet — gallery management will appear
              once your project keys are in .env.local.
            </Alert>
          ) : (
            <GalleryManager photos={gallery} />
          )}
        </div>
      </FormCard>
    </div>
  );
}
