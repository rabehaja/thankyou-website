import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { StatCard } from "@/components/ui/card";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSettings } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

interface DashboardStats {
  totalGuests: number;
  rsvpReceived: number;
  liveCards: number;
  draftCards: number;
}

async function getStats(): Promise<DashboardStats | null> {
  try {
    const supabase = createAdminClient();
    const [guests, rsvps, live, drafts] = await Promise.all([
      supabase.from("guests").select("id", { count: "exact", head: true }),
      supabase
        .from("guests")
        .select("id", { count: "exact", head: true })
        .eq("rsvp_received", true),
      supabase
        .from("thank_you_cards")
        .select("id", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("thank_you_cards")
        .select("id", { count: "exact", head: true })
        .eq("status", "draft"),
    ]);
    return {
      totalGuests: guests.count ?? 0,
      rsvpReceived: rsvps.count ?? 0,
      liveCards: live.count ?? 0,
      draftCards: drafts.count ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [stats, settings] = await Promise.all([getStats(), getSettings()]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-h1 text-[36px] text-ink">Dashboard</h1>
        <p className="mt-1 text-[15px] text-muted">
          A quick look at your guests and thank-you pages.
        </p>
      </div>

      {settings.wedding_date ? (
        <Alert variant="info">
          Wedding date is set to {formatDate(settings.wedding_date)}.
        </Alert>
      ) : null}

      {stats ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Guests" value={stats.totalGuests} />
            <StatCard
              label="Total RSVP Received"
              value={stats.rsvpReceived}
              detail={
                stats.totalGuests > 0
                  ? `${Math.round((stats.rsvpReceived / stats.totalGuests) * 100)}% of Guests`
                  : undefined
              }
            />
            <StatCard label="Thank Yous Live" value={stats.liveCards} />
            <StatCard label="Drafts Pending" value={stats.draftCards} />
          </div>
          {stats.draftCards > 0 ? (
            <Alert variant="warning">
              You have {stats.draftCards} unsaved greeting{" "}
              {stats.draftCards === 1 ? "template" : "templates"} in draft mode.{" "}
              <Link href="/admin/cards" className="underline underline-offset-2">
                Review drafts
              </Link>
            </Alert>
          ) : null}
        </>
      ) : (
        <Alert variant="warning">
          Supabase is not configured yet. Add your project keys to .env.local and
          run the migration to see live stats.
        </Alert>
      )}
    </div>
  );
}
