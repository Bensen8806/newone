-- Users
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT UNIQUE,
  role TEXT[],
  department_id UUID,
  roll_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  code TEXT UNIQUE,
  hod_user_id UUID REFERENCES public.users(id)
);

-- Add Foreign Key to users (done later due to circular ref)
ALTER TABLE public.users ADD CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Clubs
CREATE TABLE public.clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,
  type TEXT,
  head_user_id UUID REFERENCES public.users(id)
);

-- Venues
CREATE TABLE public.venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE,
  department_id UUID REFERENCES public.departments(id),
  capacity INT,
  features JSONB,
  svg_element_id TEXT
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  club_id UUID REFERENCES public.clubs(id),
  club_head_id UUID REFERENCES public.users(id),
  venue_id UUID REFERENCES public.venues(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  expected_attendance INT,
  category TEXT,
  ktu_activity_points_category TEXT,
  status TEXT DEFAULT 'DRAFT',
  special_requirements TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approvals
CREATE TABLE public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id),
  approver_id UUID REFERENCES public.users(id),
  approver_role TEXT,
  action TEXT,
  remark TEXT NOT NULL,
  actioned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id),
  student_id UUID REFERENCES public.users(id),
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'REGISTERED',
  attended BOOLEAN DEFAULT false
);

-- Certificates
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID REFERENCES public.registrations(id),
  type TEXT,
  verification_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  type TEXT,
  message TEXT,
  event_id UUID REFERENCES public.events(id),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow all reads for now, and rely on server actions/service role for writes
CREATE POLICY "Public reads for all" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Public reads for all" ON public.clubs FOR SELECT USING (true);
CREATE POLICY "Public reads for all" ON public.venues FOR SELECT USING (true);
CREATE POLICY "Public reads for all" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
