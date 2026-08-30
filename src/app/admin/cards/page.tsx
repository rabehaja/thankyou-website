import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { createCardForGuest } from "@/lib/actions/cards";
import { cardUrl } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import type { CardStatus, ThankYouCard } from "@/lib/database.types";

export const metadata: Metadata = { title: "Thank You Cards" };

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

type CardWithGuest = ThankYouCard & { guests: { full_name: string } | null };

async function getData(): Promise<{
  cards: CardWithGuest[];
  guestsWithoutCards: { id: string; full_name: string }[];
} | null> {
  try {
    const supabase = createAdminClient();
    const [cardsResult, guestsResult] = await Promise.all([
      supabase
        .from("thank_you_cards")
        .select("*, guests(full_name)")
        .order("updated_at", { ascending: false }),
      supabase
        .from("guests")
        .select("id, full_name, thank_you_cards(id)")
        .neq("status", "archived")
        .order("full_name"),
    ]);
    if (cardsResult.error || guestsResult.error) return null;
    const guestsWithoutCards = (guestsResult.data ?? [])
      .filter((guest) => {
        const cards = guest.thank_you_cards as { id: string }[] | null;
        return !cards || cards.length === 0;
      })
      .map(({ id, full_name }) => ({ id, full_name }));
    return { cards: (cardsResult.data ?? []) as CardWithGuest[], guestsWithoutCards };
  } catch {
    return null;
  }
}

export default async function CardsPage() {
  const data = await getData();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 text-[36px] text-ink">Thank You Cards</h1>
        <p className="mt-1 text-[15px] text-muted">
          Write a personal greeting for each guest and publish their card page.
        </p>
      </div>

      {!data ? (
        <Alert variant="warning">
          Supabase is not configured yet — cards will appear once your project
          keys are in .env.local and the migration has run.
        </Alert>
      ) : (
        <>
          {data.guestsWithoutCards.length > 0 ? (
            <Card className="p-6">
              <h2 className="text-[15px] font-medium text-ink">Start a new card</h2>
              <form
                action={createCardForGuest}
                className="mt-3 flex flex-wrap items-center gap-3"
              >
                <Select name="guest_id" required className="w-72" defaultValue="">
                  <option value="" disabled>
                    Choose a guest…
                  </option>
                  {data.guestsWithoutCards.map((guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.full_name}
                    </option>
                  ))}
                </Select>
                <Button type="submit">Create Card</Button>
              </form>
            </Card>
          ) : null}

          {data.cards.length === 0 ? (
            <EmptyState
              title="No Thank Yous Sent Yet"
              description="Select guests and start generating custom greeting pages to fill this table."
            />
          ) : (
            <Table>
              <TableHead>
                <TableHeaderCell>Guest</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Opens</TableHeaderCell>
                <TableHeaderCell>Last Updated</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </TableHead>
              <TableBody>
                {data.cards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">
                      {card.guests?.full_name ?? "Unknown guest"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[card.status]}>
                        {statusLabel[card.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {card.open_count > 0 ? (
                        <>
                          <span className="font-medium">{card.open_count}</span>
                          {card.last_opened_at ? (
                            <div className="mt-0.5 text-[13px] text-muted">
                              last {formatDate(card.last_opened_at)}
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted">
                      {formatDate(card.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-4">
                        {card.status === "published" ? (
                          <CopyLinkButton url={cardUrl(card.slug)} />
                        ) : null}
                        <Link
                          href={`/admin/cards/${card.id}`}
                          className="text-[14px] font-medium text-terracotta hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </>
      )}
    </div>
  );
}
