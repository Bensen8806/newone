-- Add faculty advisor to clubs
ALTER TABLE public.clubs ADD COLUMN faculty_advisor_id UUID REFERENCES public.users(id);

-- Add principal meeting details to events
ALTER TABLE public.events ADD COLUMN principal_meeting_time TIMESTAMPTZ;
ALTER TABLE public.events ADD COLUMN principal_meeting_reason TEXT;

-- Create event posts table
CREATE TABLE public.event_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  poster_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on event_posts
ALTER TABLE public.event_posts ENABLE ROW LEVEL SECURITY;

-- Allow public reads for event posts (for the main feed)
CREATE POLICY "Public reads for event posts" ON public.event_posts FOR SELECT USING (true);

-- Allow authenticated users to insert event posts
CREATE POLICY "Authenticated users can insert event posts" ON public.event_posts FOR INSERT TO authenticated WITH CHECK (true);
