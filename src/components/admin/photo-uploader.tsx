"use client";

import { useActionState, useEffect, useRef } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { UploadState } from "@/lib/actions/settings";

const initialState: UploadState = { error: null, uploaded: false };

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
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.uploaded) {
      toast(successMessage);
      formRef.current?.reset();
    }
  }, [state, successMessage, toast]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      {state.error ? <Alert variant="error">{state.error}</Alert> : null}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          className="text-[14px] text-muted file:mr-3 file:cursor-pointer file:rounded-pill file:border file:border-terracotta file:bg-transparent file:px-4 file:py-1.5 file:text-[13px] file:font-medium file:text-terracotta hover:file:bg-terracotta-soft/60"
        />
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Uploading…" : buttonLabel}
        </Button>
      </div>
      <p className="text-[13px] text-muted">JPEG, PNG, or WebP — up to 5 MB.</p>
    </form>
  );
}
