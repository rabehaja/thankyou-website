"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { UploadState } from "@/lib/actions/settings";

const initialState: UploadState = { error: null, uploaded: false };

const MAX_EDGE_PX = 2400;
const KEEP_AS_IS_BYTES = 1.5 * 1024 * 1024;
const HARD_LIMIT_BYTES = 4.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const DECODE_ERROR =
  "That file couldn't be read as a photo. Please choose a JPEG, PNG, or WebP.";
const TOO_LARGE_ERROR =
  "That photo is too large even after compression — please choose a smaller one.";

/**
 * Downscale/compress in the browser so uploads always fit the server-action
 * body limit (6 MB) and the storage bucket cap (5 MB), whatever the camera
 * produced. Small files of allowed types pass through untouched.
 */
async function processPhoto(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(DECODE_ERROR);
  }
  try {
    const longestEdge = Math.max(bitmap.width, bitmap.height);
    if (
      ALLOWED_TYPES.includes(file.type) &&
      file.size <= KEEP_AS_IS_BYTES &&
      longestEdge <= MAX_EDGE_PX
    ) {
      return file;
    }

    const scale = Math.min(1, MAX_EDGE_PX / longestEdge);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) throw new Error(DECODE_ERROR);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) throw new Error(DECODE_ERROR);
    if (blob.size > HARD_LIMIT_BYTES) throw new Error(TOO_LARGE_ERROR);
    return new File([blob], "photo.jpg", { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

export function PhotoUploader({
  action,
  buttonLabel,
  successMessage,
}: {
  action: (prev: UploadState, formData: FormData) => Promise<UploadState>;
  buttonLabel: string;
  successMessage: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [localError, setLocalError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [readyLabel, setReadyLabel] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.uploaded) {
      toast(successMessage);
      formRef.current?.reset();
      setReadyLabel(null);
    }
  }, [state, successMessage, toast]);

  const handleFileChange = async () => {
    const input = inputRef.current;
    const file = input?.files?.[0];
    setLocalError(null);
    setReadyLabel(null);
    if (!input || !file) return;

    setProcessing(true);
    try {
      const processed = await processPhoto(file);
      if (processed !== file) {
        const transfer = new DataTransfer();
        transfer.items.add(processed);
        input.files = transfer.files;
      }
      setReadyLabel(`Ready — ${(processed.size / 1024 / 1024).toFixed(1)} MB`);
    } catch (error) {
      input.value = "";
      setLocalError(error instanceof Error ? error.message : DECODE_ERROR);
    } finally {
      setProcessing(false);
    }
  };

  const error = localError ?? state.error;

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          onChange={handleFileChange}
          className="text-[14px] text-muted file:mr-3 file:cursor-pointer file:rounded-pill file:border file:border-terracotta file:bg-transparent file:px-4 file:py-1.5 file:text-[13px] file:font-medium file:text-terracotta hover:file:bg-terracotta-soft/60"
        />
        <Button type="submit" size="sm" disabled={pending || processing}>
          {processing ? "Processing…" : pending ? "Uploading…" : buttonLabel}
        </Button>
        {readyLabel ? (
          <span className="text-[13px] text-sage">{readyLabel}</span>
        ) : null}
      </div>
      <p className="text-[13px] text-muted">
        JPEG, PNG, or WebP — large photos are resized automatically.
      </p>
    </form>
  );
}
