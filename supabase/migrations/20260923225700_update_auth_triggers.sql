-- Remove Domain Restriction Trigger
DROP TRIGGER IF EXISTS restrict_email_domain ON auth.users;
DROP FUNCTION IF EXISTS auth.check_email_domain();
