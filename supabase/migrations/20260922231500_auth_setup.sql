-- 1. Domain Restriction Trigger
CREATE OR REPLACE FUNCTION auth.check_email_domain()
RETURNS trigger AS $$
BEGIN
  IF NEW.email NOT LIKE '%@nssce.ac.in' AND NEW.email != 'eventsnssce@gmail.com' THEN
    RAISE EXCEPTION 'Only @nssce.ac.in emails are allowed.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS restrict_email_domain ON auth.users;
CREATE TRIGGER restrict_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.check_email_domain();

-- 2. Sync to public.users Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role text[];
BEGIN
  IF NEW.email = 'eventsnssce@gmail.com' THEN
    assigned_role := ARRAY['ADMIN'];
  ELSE
    assigned_role := ARRAY['STUDENT'];
  END IF;

  INSERT INTO public.users (id, email, name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    assigned_role,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
