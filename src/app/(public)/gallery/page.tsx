import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/server";
import { getSettings, publicPhotoUrl } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Gallery" };

async function getPhotos(): Promise<{ id: string; url: string }[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("gallery_photos")
      .select("id, storage_path")
      .order("sort_order");
    return (data ?? []).map((photo) => ({
      id: photo.id,
      url: publicPhotoUrl(photo.storage_path),
    }));
  } catch {
    return [];
  }
}

export default async function GalleryPage() {
  const [settings, photos] = await Promise.all([getSettings(), getPhotos()]);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 pt-20 text-center">
      <p className="text-h2 text-[13px] text-muted">Our Photography</p>
      <h1 className="mt-4 text-h1 text-terracotta">{settings.couple_names}</h1>

      {photos.length === 0 ? (
        <p className="mt-16 text-body text-muted">
          The gallery is being prepared — please check back soon.
        </p>
      ) : (
        <div className="mt-14 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {photos.map((photo) => (
            <div key={photo.id} className="mb-6 break-inside-avoid overflow-hidden rounded-card shadow-card">
              <Image
                src={photo.url}
                alt={`${settings.couple_names} wedding photo`}
                width={640}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <Link
        href="/"
        className="mt-16 inline-flex items-center justify-center rounded-pill border border-terracotta px-8 py-3 text-ui-label text-[12px] text-terracotta transition-colors hover:bg-terracotta-soft/60"
      >
        Back to Thank You
      </Link>
    </main>
  );
}
