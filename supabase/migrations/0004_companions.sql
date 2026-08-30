-- Companion (+1) guests: greeted alongside the primary guest in the letter.
alter table public.guests add column companions text[] not null default '{}';

-- Return type changes, so the function must be dropped and recreated.
drop function public.get_live_card(text);
create function public.get_live_card(card_slug text)
returns table (greeting_message text, guest_name text, companions text[])
language sql
security definer
set search_path = public
as $$
  select c.greeting_message, g.full_name, g.companions
  from thank_you_cards c
  join guests g on g.id = c.guest_id
  where c.slug = card_slug and c.status = 'published';
$$;
grant execute on function public.get_live_card(text) to anon, authenticated;
