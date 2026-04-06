-- JARVIS-X Email Security Platform Database Schema
-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email_accounts table for connected email accounts
CREATE TABLE IF NOT EXISTS public.email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_address TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('gmail', 'yahoo', 'outlook')),
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create emails table for scanned emails
CREATE TABLE IF NOT EXISTS public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE SET NULL,
  external_id TEXT,
  sender_email TEXT NOT NULL,
  sender_name TEXT,
  subject TEXT,
  body_preview TEXT,
  received_at TIMESTAMPTZ NOT NULL,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  threat_level TEXT DEFAULT 'low' CHECK (threat_level IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create threats table for detected threats
CREATE TABLE IF NOT EXISTS public.threats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_id UUID REFERENCES public.emails(id) ON DELETE CASCADE,
  threat_type TEXT NOT NULL CHECK (threat_type IN ('phishing', 'malware', 'spam', 'suspicious_link', 'spoofing', 'social_engineering')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  indicators JSONB DEFAULT '[]'::jsonb,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table for user notifications
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  threat_id UUID REFERENCES public.threats(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('email', 'sms', 'push', 'call', 'dashboard')),
  title TEXT NOT NULL,
  message TEXT,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scan_history table for tracking scans
CREATE TABLE IF NOT EXISTS public.scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_account_id UUID REFERENCES public.email_accounts(id) ON DELETE SET NULL,
  scan_type TEXT DEFAULT 'automatic' CHECK (scan_type IN ('automatic', 'manual', 'scheduled')),
  emails_scanned INTEGER DEFAULT 0,
  threats_found INTEGER DEFAULT 0,
  duration_ms INTEGER,
  status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analytics_daily table for dashboard stats
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  emails_scanned INTEGER DEFAULT 0,
  threats_low INTEGER DEFAULT 0,
  threats_medium INTEGER DEFAULT 0,
  threats_high INTEGER DEFAULT 0,
  alerts_sent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "profiles_admin_select_all" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for email_accounts
CREATE POLICY "email_accounts_select_own" ON public.email_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "email_accounts_insert_own" ON public.email_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "email_accounts_update_own" ON public.email_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "email_accounts_delete_own" ON public.email_accounts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for emails
CREATE POLICY "emails_select_own" ON public.emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "emails_insert_own" ON public.emails FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "emails_update_own" ON public.emails FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "emails_delete_own" ON public.emails FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for threats
CREATE POLICY "threats_select_own" ON public.threats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "threats_insert_own" ON public.threats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "threats_update_own" ON public.threats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "threats_delete_own" ON public.threats FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for alerts
CREATE POLICY "alerts_select_own" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "alerts_insert_own" ON public.alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "alerts_update_own" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "alerts_delete_own" ON public.alerts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for scan_history
CREATE POLICY "scan_history_select_own" ON public.scan_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "scan_history_insert_own" ON public.scan_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics_daily
CREATE POLICY "analytics_daily_select_own" ON public.analytics_daily FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "analytics_daily_insert_own" ON public.analytics_daily FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "analytics_daily_update_own" ON public.analytics_daily FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON public.emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_risk_score ON public.emails(risk_score);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON public.emails(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_threats_user_id ON public.threats(user_id);
CREATE INDEX IF NOT EXISTS idx_threats_severity ON public.threats(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_analytics_daily_user_date ON public.analytics_daily(user_id, date);
