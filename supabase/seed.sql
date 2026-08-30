-- Ever After — development seed. Run after 0001_init.sql in the Supabase SQL editor.

update public.settings
set couple_names = 'Julian & Charlotte',
    wedding_date = '2024-10-19',
    venue = 'The Glasshouse at Botanic Gardens • Seattle, WA',
    thank_you_message = 'We are forever grateful for your presence, your warm wishes, and the thoughtful gifts that marked the beginning of our new chapter together.',
    rsvp_active = true
where id = 1;

insert into public.guests (id, full_name, email, table_assignment, tags, rsvp_received, status) values
  ('11111111-1111-4111-8111-111111111101', 'Olivia & Liam Henderson', 'olivia.henderson@example.com', 'Table 4', array['Bridal Party'], true, 'active'),
  ('11111111-1111-4111-8111-111111111102', 'Michael & Sarah Jenkins', 'mjenkins@example.com', 'Table 8', array['Groom''s Family'], true, 'active'),
  ('11111111-1111-4111-8111-111111111103', 'Emily Watson', 'emily.watson@example.com', 'Table 2', array['Bridal Shower'], true, 'active'),
  ('11111111-1111-4111-8111-111111111104', 'Daniel & Priya Sharma', 'dpsharma@example.com', 'Table 5', array['College Friends'], true, 'active'),
  ('11111111-1111-4111-8111-111111111105', 'Grace Kim', 'grace.kim@example.com', 'Table 2', array['Bridal Shower','Bridesmaids'], false, 'pending'),
  ('11111111-1111-4111-8111-111111111106', 'Thomas Alvarez', 'talvarez@example.com', 'Table 7', array['Groom''s Family'], true, 'active'),
  ('11111111-1111-4111-8111-111111111107', 'Hannah & Noah Bennett', 'bennetts@example.com', 'Table 3', array['Neighbors'], false, 'pending'),
  ('11111111-1111-4111-8111-111111111108', 'Sofia Rossi', 'sofia.rossi@example.com', 'Table 6', array['Work Friends'], true, 'active'),
  ('11111111-1111-4111-8111-111111111109', 'James O''Connor', 'joconnor@example.com', 'Table 7', array['Groomsmen'], true, 'active'),
  ('11111111-1111-4111-8111-111111111110', 'Amelia & Jack Turner', 'turners@example.com', 'Table 1', array['Bride''s Family'], true, 'active'),
  ('11111111-1111-4111-8111-111111111111', 'Robert Miles', null, 'Table 9', array[]::text[], false, 'archived'),
  ('11111111-1111-4111-8111-111111111112', 'Chloe Dubois', 'chloe.dubois@example.com', 'Table 5', array['College Friends'], true, 'active');

insert into public.thank_you_cards (guest_id, slug, greeting_message, status, published_at) values
  ('11111111-1111-4111-8111-111111111103', 'emily-demo0001',
   'Dear Emily, we are so incredibly grateful for the gorgeous ceramic vase you gifted us. It looks beautiful in our living room and will be cherished for years to come!',
   'published', now()),
  ('11111111-1111-4111-8111-111111111102', 'michael-demo0002',
   'Michael & Sarah, thank you for travelling all the way from Denver to celebrate with us — your energy on the dance floor made the night unforgettable.',
   'draft', null),
  ('11111111-1111-4111-8111-111111111111', 'robert-demo0003',
   'Robert, thank you for the lovely card and your warm wishes.',
   'archived', null);
