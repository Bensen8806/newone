-- Insert Initial Approved Events for NSSCE Campus Event Calendar
INSERT INTO public.events (
  id, title, description, club_id, venue_id, start_time, end_time, status, category, ktu_activity, ktu_category
) VALUES
(
  gen_random_uuid(),
  'IEEE Workshop on Embedded Systems',
  'Hands-on technical workshop on Arduino microcontrollers, sensor interfacing, and IoT prototyping hosted by IEEE Student Chapter.',
  (SELECT id FROM public.clubs WHERE name = 'IEEE Student Chapter' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'ECE Seminar Hall' LIMIT 1),
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day 8 hours',
  'APPROVED',
  'TECHNICAL',
  true,
  'SEG2'
),
(
  gen_random_uuid(),
  'Dance Club Showcase - Rhythm 2026',
  'Annual cultural dance showcase and choreography battle featuring performances by NSSCE Dance Club in the main Auditorium.',
  (SELECT id FROM public.clubs WHERE name = 'Dance Club' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Auditorium' LIMIT 1),
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days 6 hours',
  'APPROVED',
  'CULTURAL',
  true,
  'SEG6'
),
(
  gen_random_uuid(),
  'NSS Blood Donation & Health Drive',
  'Annual social service blood donation camp organized by NSS Unit in association with District Blood Bank.',
  (SELECT id FROM public.clubs WHERE name = 'NSS' LIMIT 1),
  (SELECT id FROM public.venues WHERE name = 'Seminar Hall' LIMIT 1),
  NOW() + INTERVAL '4 days',
  NOW() + INTERVAL '4 days 5 hours',
  'APPROVED',
  'SOCIAL',
  true,
  'SEG7'
)
ON CONFLICT (id) DO NOTHING;

-- Insert Event Posts (Posters & Registration URLs)
INSERT INTO public.event_posts (
  id, event_id, poster_url, registration_url, caption
) VALUES
(
  gen_random_uuid(),
  (SELECT id FROM public.events WHERE title = 'IEEE Workshop on Embedded Systems' LIMIT 1),
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  'https://nssce.ac.in',
  'Register now for the IEEE Embedded Systems workshop!'
),
(
  gen_random_uuid(),
  (SELECT id FROM public.events WHERE title = 'Dance Club Showcase - Rhythm 2026' LIMIT 1),
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  'https://nssce.ac.in',
  'Join us for Rhythm 2026 at the Auditorium!'
),
(
  gen_random_uuid(),
  (SELECT id FROM public.events WHERE title = 'NSS Blood Donation & Health Drive' LIMIT 1),
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  'https://nssce.ac.in',
  'NSS Blood Donation Camp registration.'
)
ON CONFLICT (id) DO NOTHING;
