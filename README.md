# Ever After — Wedding Thank-You Website + Backoffice

A warm-botanical thank-you site for wedding guests, with a backoffice for the
couple. Built with Next.js (App Router, TypeScript, Tailwind v4) and Supabase
(Postgres + Storage). UI follows the Figma file
"Wedding Thank-You — Theme v2 (Warm Botanical)".

## What it does

- **Public site**: a thank-you landing page (`/`), a photo gallery
  (`/gallery`), and personalized per-guest thank-you cards at unique links
  (`/t/<slug>`). Only published cards are visible.
- **Backoffice** (`/admin`): dashboard stats, guest list (search, pagination,
  tags, table assignments, RSVP), thank-you card composer with live preview and
  publish/copy-link flow, and site settings with photo uploads.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com), then
   in the SQL editor run, in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/seed.sql` (optional demo data)

3. **Configure environment** — copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project
     Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — same page (server-only; never expose)
   - `ADMIN_PASSWORD` — the shared backoffice password
   - `SESSION_SECRET` — `openssl rand -hex 32`
   - `NEXT_PUBLIC_SITE_URL` — the public URL used in shareable card links

4. **Run**

   ```bash
   npm run dev
   ```

   Sign in at `/login` with `ADMIN_PASSWORD`.

## Architecture notes

- **Auth**: single shared admin account. The password lives in `.env.local`;
  a signed HMAC session cookie (7-day TTL) gates `/admin` via `src/proxy.ts`,
  and every server action re-verifies it (`requireAdminAction`).
- **Data access**: admin mutations use the service-role client
  ([src/lib/supabase/admin.ts](src/lib/supabase/admin.ts), server-only). Public
  pages use the anon client; RLS only exposes settings, gallery photos, and
  published cards. Guest emails are never readable publicly — the card page
  goes through the `get_live_card` RPC which returns just name + greeting.
- **Design tokens**: Tailwind v4 `@theme` in
  [src/app/globals.css](src/app/globals.css) (palette, radii, shadows, and the
  Figma typography scale as `text-display`, `text-h1`, `text-caption`, …).
- **Shared card component**:
  [src/components/thank-you-card.tsx](src/components/thank-you-card.tsx) renders
  both the public card page and the backoffice preview, so the preview always
  matches the live page.
- `/admin/kitchen-sink` renders every UI component state for visual review
  (dev aid — remove before shipping).
