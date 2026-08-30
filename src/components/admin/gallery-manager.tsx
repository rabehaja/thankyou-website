"use client";

import Image from "next/image";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { XIcon } from "@/components/ui/icons";
import { deleteGalleryPhoto } from "@/lib/actions/settings";

export interface GalleryItem {
  id: string;
  url: string;
}

export function GalleryManager({ photos }: { photos: GalleryItem[] }) {
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = (photoId: string) => {
    startTransition(async () => {
      const result = await deleteGalleryPhoto(photoId);
      if (result.ok) {
        toast("Photo removed from the gallery.");
        router.refresh();
      } else {
        toast(result.error ?? "Could not remove the photo.", "error");
      }
    });
  };

  if (photos.length === 0) {
    return (
      <p className="text-[14px] text-muted">
        No gallery photos yet — upload the first one above.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div key={photo.id} className="group relative overflow-hidden rounded-card">
          <Image
            src={photo.url}
            alt="Gallery photo"
            width={320}
            height={240}
            className="h-36 w-full object-cover"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => handleDelete(photo.id)}
            aria-label="Remove photo"
            className="absolute right-2 top-2 cursor-pointer rounded-full bg-ink/70 p-1.5 text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          >
            <XIcon size={14} strokeWidth={2.2} />
          </button>
        </div>
      ))}
    </div>
  );
}
