import { cookies } from 'next/headers'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ThreatChart } from '@/components/dashboard/threat-chart'
import { ThreatDistributionCard } from '@/components/dashboard/threat-distribution'
import { RecentThreats } from '@/components/dashboard/recent-threats'
import { RecentEmails } from '@/components/dashboard/recent-emails'
import { AutoRefresh } from '@/components/dashboard/auto-refresh'
import type { DashboardStats, ThreatTrend, ThreatDistribution, Threat, Email, Alert } from '@/lib/types'

// backend stores field as 'score', frontend type uses 'risk_score' — handle both
function getScore(email: any): number {
  return email.risk_score ?? email.score ?? 0
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
// JS getDay(): 0=Sun,1=Mon,...,6=Sat  →  map to our Mon-first order
const JS_DAY_TO_LABEL: Record<number, string> = {
  1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun',
}

function computeThreatTrends(emails: Email[]): ThreatTrend[] {
  const map: Record<string, { low: number; medium: number; high: number }> = {}
  DAYS.forEach(d => { map[d] = { low: 0, medium: 0, high: 0 } })

  for (const email of emails) {
    if (!email.scanned_at) continue
    const date = new Date(email.scanned_at)
    if (isNaN(date.getTime())) continue
    const day = JS_DAY_TO_LABEL[date.getDay()]
    const level = email.threat_level
    if (level === 'low' || level === 'medium' || level === 'high') {
      map[day][level]++
    }
  }

  return DAYS.map(date => ({ date, ...map[date] }))
}

function computeThreatDistribution(emails: Email[]): ThreatDistribution[] {
  const map: Record<string, number> = { low: 0, medium: 0, high: 0 }

  for (const email of emails) {
    const level = email.threat_level
    if (level === 'low' || level === 'medium' || level === 'high') {
      map[level]++
    }
  }

  const total = emails.length
  return (['high', 'medium', 'low'] as const)
    .map(type => ({
      type,
      count: map[type],
      percentage: total > 0 ? Math.round((map[type] / total) * 100) : 0,
    }))
    .filter(d => d.count > 0)
}

function computeRecentThreats(emails: Email[]): Threat[] {
  return emails
    .filter(e => e.threat_level === 'high' || getScore(e) > 60)
    .slice(0, 5)
    .map(e => ({
      id: e.id,
      user_id: e.user_id,
      email_id: e.id,
      threat_type: 'phishing' as const,
      severity: getScore(e) > 80 ? 'critical' as const : 'high' as const,
      description: `High risk email detected: ${e.subject || '(No Subject)'}`,
      indicators: ['High risk score', 'Suspicious content'],
      is_resolved: false,
      resolved_at: null,
      resolved_by: null,
      created_at: e.scanned_at || e.created_at,
      email: e,
    }))
}

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const authHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  let recentEmails: Email[] = []
  let alerts: Alert[] = []

  const [emailResult, alertResult] = await Promise.allSettled([
    fetch(`${backendUrl}/email/history`, { cache: 'no-store', headers: authHeaders })
      .then(r => r.ok ? r.json() : null),
    fetch(`${backendUrl}/alert/history`, { cache: 'no-store', headers: authHeaders })
      .then(r => r.ok ? r.json() : null),
  ])

  if (emailResult.status === 'fulfilled' && emailResult.value) {
    const data = emailResult.value
    recentEmails = Array.isArray(data) ? data : (data.emails ?? data.data ?? [])
  }

  if (alertResult.status === 'fulfilled' && alertResult.value) {
    const data = alertResult.value
    alerts = Array.isArray(data) ? data : (data.alerts ?? data.data ?? [])
  }

  // --- Stats ---
  const today = new Date().toDateString()
  const avgRisk = recentEmails.length > 0
    ? recentEmails.reduce((sum, e) => sum + getScore(e), 0) / recentEmails.length
    : 0

  const stats: DashboardStats = {
    totalEmailsScanned: recentEmails.length,
    totalThreatsDetected: alerts.length,
    activeAlerts: alerts.filter(a => !a.is_read).length,
    riskScore: recentEmails.length > 0 ? Math.round(100 - avgRisk) : 100,
    emailsToday: recentEmails.filter(e => {
      const d = new Date(e.received_at)
      return !isNaN(d.getTime()) && d.toDateString() === today
    }).length,
    threatsToday: alerts.filter(a => {
      const d = new Date(a.created_at)
      return !isNaN(d.getTime()) && d.toDateString() === today
    }).length,
    threatsBlocked: recentEmails.filter(e => e.threat_level === 'high' && getScore(e) > 60).length,
    phishingAttempts: recentEmails.filter(e => getScore(e) > 70).length,
  }

  // --- Computed chart data ---
  const threatTrends = computeThreatTrends(recentEmails)
  const threatDistribution = computeThreatDistribution(recentEmails)
  const recentThreats = computeRecentThreats(recentEmails)

  return (
    <div className="space-y-6">
      <AutoRefresh intervalMs={30000} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your email security status and threat intelligence
        </p>
      </div>

      <StatsCards stats={stats} lastScanAt={recentEmails[0]?.scanned_at ?? null} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ThreatChart data={threatTrends} />
        </div>
        <div>
          <ThreatDistributionCard data={threatDistribution} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentThreats threats={recentThreats} />
        <RecentEmails emails={recentEmails.slice(0, 5)} />
      </div>
    </div>
  )
}
