-- Letter-open analytics: when a card was first opened and how many times.
alter table public.thank_you_cards
  add column open_count int not null default 0,
  add column first_opened_at timestamptz,
  add column last_opened_at timestamptz;

-- Called (via the anon role) from the public card page; only counts live cards.
create or replace function public.record_card_open(card_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update thank_you_cards
  set open_count = open_count + 1,
      first_opened_at = coalesce(first_opened_at, now()),
      last_opened_at = now()
  where slug = card_slug and status = 'published';
$$;
grant execute on function public.record_card_open(text) to anon, authenticated;
