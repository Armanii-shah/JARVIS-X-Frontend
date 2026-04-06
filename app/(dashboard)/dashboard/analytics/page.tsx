import { cookies } from 'next/headers'
import { AnalyticsView } from '@/components/dashboard/analytics-view'
import type { Email } from '@/lib/types'

function getScore(email: any): number {
  return email.risk_score ?? email.score ?? 0
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const JS_DAY_TO_LABEL: Record<number, string> = {
  1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun',
}

export default async function AnalyticsPage() {
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

  // Weekly breakdown by day
  const weeklyMap: Record<string, { emails: number; threats: number }> = {}
  DAYS.forEach(d => { weeklyMap[d] = { emails: 0, threats: 0 } })

  for (const email of emails) {
    if (!email.scanned_at) continue
    const d = new Date(email.scanned_at)
    if (isNaN(d.getTime())) continue
    const day = JS_DAY_TO_LABEL[d.getDay()]
    weeklyMap[day].emails++
    if (email.threat_level === 'high' || getScore(email) > 60) {
      weeklyMap[day].threats++
    }
  }

  const weeklyData = DAYS.map(day => ({
    day,
    emails: weeklyMap[day].emails,
    threats: weeklyMap[day].threats,
    blocked: weeklyMap[day].threats,
  }))

  // Risk score distribution
  const scoreRanges = [
    { range: '0-20',   min: 0,  max: 20  },
    { range: '21-40',  min: 21, max: 40  },
    { range: '41-60',  min: 41, max: 60  },
    { range: '61-80',  min: 61, max: 80  },
    { range: '81-100', min: 81, max: 100 },
  ]
  const riskScoreDistribution = scoreRanges.map(({ range, min, max }) => ({
    range,
    count: emails.filter(e => { const s = getScore(e); return s >= min && s <= max }).length,
  }))

  // Summary stats
  const avgRisk = emails.length > 0
    ? Math.round((emails.reduce((sum, e) => sum + getScore(e), 0) / emails.length) * 10) / 10
    : 0

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const emailsThisWeek = emails.filter(e => {
    if (!e.scanned_at) return false
    const d = new Date(e.scanned_at)
    return !isNaN(d.getTime()) && d >= weekAgo
  }).length

  const threatsBlocked = emails.filter(e => getScore(e) > 60).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights into your email security posture
        </p>
      </div>

      <AnalyticsView
        weeklyData={weeklyData}
        riskScoreDistribution={riskScoreDistribution}
        avgRisk={avgRisk}
        emailsThisWeek={emailsThisWeek}
        threatsBlocked={threatsBlocked}
        totalEmails={emails.length}
      />
    </div>
  )
}
