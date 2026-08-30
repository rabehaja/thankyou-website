import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { GuestDeleteButton } from "@/components/admin/guest-delete-button";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Guest, GuestStatus } from "@/lib/database.types";

export const metadata: Metadata = { title: "Guest List" };

const PAGE_SIZE = 10;

const statusVariant: Record<GuestStatus, BadgeVariant> = {
  active: "active",
  pending: "pending",
  archived: "archived",
};

const statusLabel: Record<GuestStatus, string> = {
  active: "Active",
  pending: "Pending",
  archived: "Archived",
};

async function getGuests(
  query: string,
  page: number,
): Promise<{ guests: Guest[]; totalCount: number } | null> {
  try {
    const supabase = createAdminClient();
    let request = supabase
      .from("guests")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (query) {
      const escaped = query.replaceAll("%", "\\%").replaceAll("_", "\\_");
      request = request.ilike("full_name", `%${escaped}%`);
    }
    const { data, count, error } = await request;
    if (error) return null;
    return { guests: data ?? [], totalCount: count ?? 0 };
  } catch {
    return null;
  }
}

export default async function GuestsPage({
  searchParams,
}: PageProps<"/admin/guests">) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const page = Math.max(1, Number(typeof params.page === "string" ? params.page : "1") || 1);
  const result = await getGuests(query, page);

  const hrefForPage = (p: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (p > 1) search.set("page", String(p));
    const suffix = search.toString();
    return `/admin/guests${suffix ? `?${suffix}` : ""}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 text-[36px] text-ink">Guest List</h1>
          <p className="mt-1 text-[15px] text-muted">
            Manage guests and RSVP records.
          </p>
        </div>
        <Link
          href="/admin/guests/new"
          className="inline-flex items-center rounded-pill bg-terracotta px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-terracotta-hover"
        >
          Add Guest
        </Link>
      </div>

      <form action="/admin/guests" className="max-w-md">
        <SearchInput
          name="q"
          defaultValue={query}
          placeholder="Search guests..."
          aria-label="Search guests"
        />
      </form>

      {!result ? (
        <Alert variant="warning">
          Supabase is not configured yet — the guest list will appear once your
          project keys are in .env.local and the migration has run.
        </Alert>
      ) : result.guests.length === 0 ? (
        <EmptyState
          title={query ? "No Matching Guests" : "No Guests Yet"}
          description={
            query
              ? `Nothing matched "${query}". Try a different name or table.`
              : "Add your first guest to start building the list."
          }
          action={
            query ? null : (
              <Link
                href="/admin/guests/new"
                className="inline-flex items-center rounded-pill bg-terracotta px-6 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-terracotta-hover"
              >
                Add Guest
              </Link>
            )
          }
        />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableHeaderCell>Guest</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </TableHead>
            <TableBody>
              {result.guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="font-medium">{guest.full_name}</div>
                    {guest.tags.length > 0 ? (
                      <div className="mt-1 text-[13px] text-muted">
                        {guest.tags.join(" · ")}
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[guest.status]}>
                      {statusLabel[guest.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-4">
                      <Link
                        href={`/admin/guests/${guest.id}/edit`}
                        className="text-[14px] font-medium text-terracotta hover:underline"
                      >
                        Edit
                      </Link>
                      <GuestDeleteButton guestId={guest.id} guestName={guest.full_name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={result.totalCount}
            itemLabel="guests"
            hrefForPage={hrefForPage}
          />
        </>
      )}
    </div>
  );
}
