export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: 'user' | 'admin'
  subscription_tier: 'free' | 'pro' | 'premium' | 'enterprise'
  created_at: string
  updated_at: string
}

export interface EmailAccount {
  id: string
  user_id: string
  email_address: string
  provider: 'gmail' | 'yahoo' | 'outlook'
  is_active: boolean
  last_sync_at: string | null
  created_at: string
}

export interface Email {
  id: string
  user_id: string
  email_account_id: string | null
  external_id: string | null
  gmail_message_id: string | null
  sender: string | null        // full display string e.g. "John Doe <john@example.com>"
  sender_email: string | null
  sender_name: string | null
  subject: string | null
  body_preview: string | null
  received_at: string | null
  scanned_at: string | null
  risk_score: number | null
  score: number | null
  threat_level: 'low' | 'medium' | 'high'
  is_read: boolean
  created_at: string
}

export interface Threat {
  id: string
  user_id: string
  email_id: string | null
  threat_type: 'phishing' | 'malware' | 'spam' | 'suspicious_link' | 'spoofing' | 'social_engineering'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string | null
  indicators: string[]
  is_resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  email?: Email
}

export interface Alert {
  id: string
  user_id: string
  threat_id: string | null
  alert_type: 'email' | 'sms' | 'whatsapp' | 'push' | 'call' | 'dashboard' | 'none'
  title: string
  message: string | null
  is_sent: boolean
  sent_at: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
  threat?: Threat
}

export interface ScanHistory {
  id: string
  user_id: string
  email_account_id: string | null
  scan_type: 'automatic' | 'manual' | 'scheduled'
  emails_scanned: number
  threats_found: number
  duration_ms: number | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  created_at: string
}

export interface AnalyticsDaily {
  id: string
  user_id: string
  date: string
  emails_scanned: number
  threats_low: number
  threats_medium: number
  threats_high: number
  alerts_sent: number
  created_at: string
}

export interface SpamEmail {
  gmail_message_id: string
  subject: string | null
  sender: string | null
  sender_email: string | null
  sender_name: string | null
  score: number
  threat_level: 'low' | 'medium' | 'high'
  received_at: string | null
  is_blocked: boolean
}

export interface DashboardStats {
  totalEmailsScanned: number
  totalThreatsDetected: number
  activeAlerts: number
  riskScore: number
  emailsToday: number
  threatsToday: number
  threatsBlocked: number
  phishingAttempts: number
}

export interface ThreatTrend {
  date: string
  low: number
  medium: number
  high: number
}

export interface ThreatDistribution {
  type: string
  count: number
  percentage: number
}
