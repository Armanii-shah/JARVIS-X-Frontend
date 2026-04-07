-- ============================================================
-- JARVIS-X Backend Schema Fix
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Drop all RLS policies on tables the backend writes to.
--    The backend uses service_role_key which bypasses RLS,
--    but the FK constraints still need fixing.
--    Frontend Supabase client uses anon key with auth session — keep RLS for that.

-- 2. Fix emails table — drop FK to auth.users, change to public.users
ALTER TABLE public.emails DROP CONSTRAINT IF EXISTS emails_user_id_fkey;
ALTER TABLE public.emails
  ADD CONSTRAINT emails_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Add unique constraint on external_id to prevent duplicate Gmail message inserts
ALTER TABLE public.emails DROP CONSTRAINT IF EXISTS emails_external_id_key;
ALTER TABLE public.emails ADD CONSTRAINT emails_external_id_key UNIQUE (external_id);

-- 3. Fix alerts table — the backend inserts: email_id, user_id, type, status, triggered_at
--    The schema has: threat_id, alert_type, title, message, is_sent, is_read
--    They are completely different. Add the backend columns if they don't exist.
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent';
ALTER TABLE public.alerts ADD COLUMN IF NOT EXISTS triggered_at TIMESTAMPTZ DEFAULT NOW();

-- Make alert_type and title nullable so backend inserts (which don't send them) don't fail
ALTER TABLE public.alerts ALTER COLUMN alert_type DROP NOT NULL;
ALTER TABLE public.alerts ALTER COLUMN title DROP NOT NULL;

-- Fix alerts FK to public.users instead of auth.users
ALTER TABLE public.alerts DROP CONSTRAINT IF EXISTS alerts_user_id_fkey;
ALTER TABLE public.alerts
  ADD CONSTRAINT alerts_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- 4. Fix alerts RLS to allow backend service role inserts (service role bypasses RLS anyway)
--    But also allow reads using the user_id column from public.users
--    The frontend reads alerts via the backend API (not direct Supabase), so RLS on alerts
--    only needs to work for service role writes.
DROP POLICY IF EXISTS "alerts_insert_own" ON public.alerts;
CREATE POLICY "alerts_insert_own" ON public.alerts
  FOR INSERT WITH CHECK (true);  -- backend (service role) handles auth

-- 5. Fix emails RLS similarly
DROP POLICY IF EXISTS "emails_insert_own" ON public.emails;
CREATE POLICY "emails_insert_own" ON public.emails
  FOR INSERT WITH CHECK (true);

-- Done. The backend service_role_key bypasses all RLS for reads/writes.
