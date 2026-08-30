"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toast";
import { deleteGuest } from "@/lib/actions/guests";

export function GuestDeleteButton({
  guestId,
  guestName,
}: {
  guestId: string;
  guestName: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await deleteGuest(guestId);
      setOpen(false);
      if (result.ok) {
        toast(`${guestName} was removed from the guest list.`);
        router.refresh();
      } else {
        toast(result.error ?? "Could not delete the guest record.", "error");
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer text-[14px] font-medium text-danger hover:underline"
      >
        Delete
      </button>
      <ConfirmDialog
        open={open}
        title="Delete Guest Record?"
        confirmLabel="Confirm Delete"
        pending={pending}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      >
        Are you absolutely sure you want to delete {guestName}&apos;s record? Their
        thank-you card will be removed too. This action cannot be undone.
      </ConfirmDialog>
    </>
  );
}
