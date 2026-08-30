"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, type AlertVariant } from "@/components/ui/alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { ThankYouCard, buildSalutation } from "@/components/thank-you-card";
import {
  archiveCard,
  deleteCard,
  publishCard,
  saveCardMessage,
  unpublishCard,
} from "@/lib/actions/cards";
import { formatDate } from "@/lib/utils";
import type { CardStatus } from "@/lib/database.types";

const statusVariant: Record<CardStatus, BadgeVariant> = {
  published: "active",
  draft: "pending",
  archived: "archived",
};

const statusLabel: Record<CardStatus, string> = {
  published: "Live",
  draft: "Draft",
  archived: "Archived",
};

interface ComposerCard {
  id: string;
  status: CardStatus;
  greeting_message: string;
  publicUrl: string;
  openCount: number;
  firstOpenedAt: string | null;
}

interface PreviewSettings {
  coupleNames: string;
  weddingDate: string | null;
  venue: string | null;
  photoUrl: string | null;
  featuredPhotoUrl: string | null;
  galleryHref: string;
}

export function CardComposer({
  card,
  guestName,
  companions,
  preview,
}: {
  card: ComposerCard;
  guestName: string;
  companions: string[];
  preview: PreviewSettings;
}) {
  const salutation = buildSalutation(guestName, companions);
  const [message, setMessage] = useState(card.greeting_message);
  const [banner, setBanner] = useState<{ variant: AlertVariant; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const run = (work: () => Promise<void>) => startTransition(work);

  const handleSave = () =>
    run(async () => {
      const result = await saveCardMessage(card.id, message);
      if (result.ok) {
        setBanner(null);
        toast("Greeting saved.");
        router.refresh();
      } else {
        setBanner({ variant: "error", text: result.error ?? "Could not save." });
      }
    });

  const handlePublish = () =>
    run(async () => {
      const saved = await saveCardMessage(card.id, message);
      if (!saved.ok) {
        setBanner({ variant: "error", text: saved.error ?? "Could not save." });
        return;
      }
      const result = await publishCard(card.id);
      if (result.ok) {
        setBanner({
          variant: "success",
          text: "Thank you web page created! The link is now live.",
        });
        router.refresh();
      } else {
        setBanner({ variant: "error", text: result.error ?? "Could not publish." });
      }
    });

  const handleUnpublish = () =>
    run(async () => {
      const result = await unpublishCard(card.id);
      if (result.ok) {
        setBanner({ variant: "warning", text: "The card is back in draft mode — its page is offline." });
        router.refresh();
      } else {
        setBanner({ variant: "error", text: result.error ?? "Could not update." });
      }
    });

  const handleArchive = () =>
    run(async () => {
      const result = await archiveCard(card.id);
      if (result.ok) {
        setBanner({ variant: "info", text: "The card was archived — its page is offline." });
        router.refresh();
      } else {
        setBanner({ variant: "error", text: result.error ?? "Could not archive." });
      }
    });

  const handleDelete = () =>
    run(async () => {
      const result = await deleteCard(card.id);
      setConfirmingDelete(false);
      if (result.ok) {
        toast("The card was deleted.");
        router.push("/admin/cards");
      } else {
        setBanner({ variant: "error", text: result.error ?? "Could not delete." });
      }
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-[36px] text-ink">Card for {guestName}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Badge variant={statusVariant[card.status]}>{statusLabel[card.status]}</Badge>
            {card.status === "published" ? (
              <>
                <CopyLinkButton url={card.publicUrl} />
                <a
                  href={card.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-medium text-terracotta hover:underline"
                >
                  View Live Page
                </a>
              </>
            ) : null}
          </div>
          {card.status === "published" ? (
            <p className="mt-2 text-[14px] text-muted">
              {card.openCount > 0
                ? `Opened ${card.openCount} ${card.openCount === 1 ? "time" : "times"}${
                    card.firstOpenedAt ? ` · first on ${formatDate(card.firstOpenedAt)}` : ""
                  }`
                : "Not opened yet"}
            </p>
          ) : null}
        </div>
      </div>

      {banner ? <Alert variant={banner.variant}>{banner.text}</Alert> : null}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div className="rounded-card bg-white p-8 shadow-card">
          <Field
            label="Personal Greeting Message"
            htmlFor="greeting"
            helper={`The "${salutation}" salutation is added automatically — just write the message itself.`}
          >
            <Textarea
              id="greeting"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={8}
              placeholder="Thank you for celebrating with us…"
            />
          </Field>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={pending}>
              {pending ? "Working…" : "Save Design"}
            </Button>
            {card.status !== "published" ? (
              <Button variant="secondary" onClick={handlePublish} disabled={pending}>
                Send Thank You
              </Button>
            ) : (
              <Button variant="secondary" onClick={handleUnpublish} disabled={pending}>
                Take Offline
              </Button>
            )}
            {card.status !== "archived" ? (
              <Button variant="ghost" onClick={handleArchive} disabled={pending}>
                Archive
              </Button>
            ) : null}
            <Button
              variant="destructive"
              onClick={() => setConfirmingDelete(true)}
              disabled={pending}
            >
              Delete Design
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-[2.5px] text-muted">
            Thank You Page Preview
          </p>
          <div className="max-h-[75vh] w-full overflow-y-auto rounded-card border border-border-neutral bg-cream-bg">
            <ThankYouCard
              coupleNames={preview.coupleNames}
              guestName={guestName}
              companions={companions}
              message={message || "Your personal greeting will appear here…"}
              weddingDate={preview.weddingDate}
              venue={preview.venue}
              photoUrl={preview.photoUrl}
              featuredPhotoUrl={preview.featuredPhotoUrl}
              galleryHref={preview.galleryHref}
            />
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete This Card?"
        confirmLabel="Confirm Delete"
        pending={pending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      >
        Are you absolutely sure you want to delete {guestName}&apos;s thank-you
        card? Its public link will stop working. This action cannot be undone.
      </ConfirmDialog>
    </div>
  );
}
