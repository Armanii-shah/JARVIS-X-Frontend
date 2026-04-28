-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query → paste all → Run
-- Adds columns the backend actually uses (gmail_message_id, score, sender, etc.)
-- Safe to re-run — all statements use IF NOT EXISTS / DO blocks.

-- Add gmail_message_id (used instead of external_id for Gmail message tracking)
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS gmail_message_id TEXT;

-- Add score (backend uses 'score', original schema used 'risk_score')
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100);

-- Add sender (full display string e.g. "John Doe <john@example.com>")
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS sender TEXT;

-- Add sender_email and sender_name if not already present
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS sender_email TEXT;

ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS sender_name TEXT;

-- Add received_at if it doesn't exist
ALTER TABLE public.emails
  ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ;

-- Add unique constraint on (user_id, gmail_message_id) for duplicate detection
-- Wrapped in DO block so it's safe to re-run
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname  = 'emails'
      AND c.conname  = 'emails_user_id_gmail_message_id_key'
  ) THEN
    ALTER TABLE public.emails
      ADD CONSTRAINT emails_user_id_gmail_message_id_key
      UNIQUE (user_id, gmail_message_id);
  END IF;
END;
$$;

-- Indexes for polling duplicate-check and score queries
CREATE INDEX IF NOT EXISTS idx_emails_gmail_message_id
  ON public.emails (user_id, gmail_message_id);

CREATE INDEX IF NOT EXISTS idx_emails_score
  ON public.emails (score);
