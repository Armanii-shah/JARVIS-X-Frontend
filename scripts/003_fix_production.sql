-- ================================================================
-- JARVIS-X Production Fix — Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → paste all → Run
-- ================================================================

-- ----------------------------------------------------------------
-- 1. Create public.users table (backend's own user store)
--    This is separate from auth.users — the backend manages its
--    own user records keyed by Gmail email.
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  gmail_token TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------
-- 2. Fix emails table — drop FK to auth.users, point to public.users
--    Also add unique constraint on external_id (Gmail message ID)
--    so duplicate check works correctly.
-- ----------------------------------------------------------------
ALTER TABLE public.emails DROP CONSTRAINT IF EXISTS emails_user_id_fkey;
ALTER TABLE public.emails
  ADD CONSTRAINT emails_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.emails DROP CONSTRAINT IF EXISTS emails_external_id_key;
ALTER TABLE public.emails
  ADD CONSTRAINT emails_external_id_key UNIQUE (external_id);

-- ----------------------------------------------------------------
-- 3. Fix alerts table
--    The backend inserts: email_id, user_id, type, status
--    The original schema had: alert_type NOT NULL, title NOT NULL
--    which caused every backend insert to fail.
-- ----------------------------------------------------------------

-- Drop the FK to auth.users and re-point to public.users
ALTER TABLE public.alerts DROP CONSTRAINT IF EXISTS alerts_user_id_fkey;
ALTER TABLE public.alerts
  ADD CONSTRAINT alerts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Drop FK to threats (backend doesn't use threats table)
ALTER TABLE public.alerts DROP CONSTRAINT IF EXISTS alerts_threat_id_fkey;

-- Add columns the backend actually uses
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS email_id UUID REFERENCES public.emails(id) ON DELETE SET NULL;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'none';
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';

-- Make the original NOT NULL columns nullable
-- (backend doesn't send alert_type or title — it uses type/status instead)
ALTER TABLE public.alerts ALTER COLUMN alert_type DROP NOT NULL;
ALTER TABLE public.alerts ALTER COLUMN title DROP NOT NULL;

-- ----------------------------------------------------------------
-- 4. Disable RLS on backend tables
--    Backend uses service_role_key which bypasses RLS anyway,
--    but disabling it removes any chance of silent blocks.
-- ----------------------------------------------------------------
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------
-- 5. Done. Verify by running:
--    SELECT * FROM public.users LIMIT 5;
--    SELECT * FROM public.emails LIMIT 5;
--    SELECT * FROM public.alerts LIMIT 5;
-- ----------------------------------------------------------------
