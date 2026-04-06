import { cookies } from 'next/headers'
import { ThreatsView } from '@/components/dashboard/threats-view'
import type { Email, Threat } from '@/lib/types'

function getScore(email: any): number {
  return email.risk_score ?? email.score ?? 0
}

function emailsToThreats(emails: Email[]): Threat[] {
  return emails
    .filter(e => e.threat_level === 'high' || getScore(e) > 60)
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

export default async function ThreatsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  let emails: Email[] = []

  if (token) {
    try {
      const res = await fetch(`${backendUrl}/email/history`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        emails = Array.isArray(data) ? data : (data.emails ?? data.data ?? [])
      }
    } catch {}
  }

  const threats = emailsToThreats(emails)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Threat Detection</h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage detected security threats
        </p>
      </div>

      <ThreatsView threats={threats} />
    </div>
  )
}
