-- Ever After — initial schema. Paste this whole file into the Supabase SQL editor.

create type guest_status as enum ('active', 'pending', 'archived');
create type card_status as enum ('draft', 'published', 'archived');

-- Singleton settings row (id constrained to 1)
create table public.settings (
  id int primary key default 1 check (id = 1),
  couple_names text not null default 'Julian & Charlotte',
  wedding_date date,
  venue text,
  thank_you_message text,
  couple_photo_url text,
  rsvp_active boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.settings (id) values (1);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  table_assignment text,
  tags text[] not null default '{}',
  rsvp_received boolean not null default false,
  status guest_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.thank_you_cards (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete cascade,
  slug text not null unique,
  greeting_message text not null default '',
  status card_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (guest_id)
);

create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Row level security: anon may only read public-facing content.
-- All admin writes use the service-role key, which bypasses RLS.
alter table public.settings enable row level security;
alter table public.guests enable row level security;
alter table public.thank_you_cards enable row level security;
alter table public.gallery_photos enable row level security;

create policy "public read settings" on public.settings
  for select using (true);
create policy "public read gallery" on public.gallery_photos
  for select using (true);
create policy "public read live cards" on public.thank_you_cards
  for select using (status = 'published');
-- No anon policy on guests: guest data is never directly readable.

-- Public card page needs the guest's name without exposing the guests table.
create or replace function public.get_live_card(card_slug text)
returns table (greeting_message text, guest_name text)
language sql
security definer
set search_path = public
as $$
  select c.greeting_message, g.full_name
  from thank_you_cards c
  join guests g on g.id = c.guest_id
  where c.slug = card_slug and c.status = 'published';
$$;
grant execute on function public.get_live_card(text) to anon, authenticated;

-- Storage: public-read photo bucket; writes go through the service role only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 5242880, array['image/jpeg','image/png','image/webp']);

create policy "public read photos" on storage.objects
  for select using (bucket_id = 'photos');
