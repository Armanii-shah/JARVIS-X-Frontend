import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle, AlertTriangle, Mail } from 'lucide-react'
import type { Email } from '@/lib/types'

function getScore(email: any): number {
  return email.risk_score ?? email.score ?? 0
}

function safeDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export default async function ScanHistoryPage() {
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

  // Group emails by scanned_at date (day buckets = one scan session per day)
  const buckets: Record<string, { date: Date; emails: Email[] }> = {}
  for (const email of emails) {
    const d = safeDate(email.scanned_at)
    if (!d) continue
    const key = d.toDateString()
    if (!buckets[key]) buckets[key] = { date: d, emails: [] }
    buckets[key].emails.push(email)
  }

  const scans = Object.values(buckets)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, emails: batch }) => {
      const threats = batch.filter(e => e.threat_level === 'high' || getScore(e) > 60).length
      return {
        date,
        total: batch.length,
        threats,
        status: threats === 0 ? 'clean' : 'threats_found',
      }
    })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scan History</h1>
        <p className="text-muted-foreground mt-1">
          History of all email security scans
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Scans</CardTitle>
          <CardDescription>{scans.length} scan sessions found</CardDescription>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No scans yet</p>
              <p className="text-xs text-muted-foreground mt-1">Connect your Gmail account to start scanning</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${scan.status === 'clean' ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                      {scan.status === 'clean'
                        ? <CheckCircle className="w-5 h-5 text-green-500" />
                        : <AlertTriangle className="w-5 h-5 text-destructive" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {scan.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {scan.total} emails scanned · {scan.threats} threat{scan.threats !== 1 ? 's' : ''} detected
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={scan.status === 'clean'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-destructive/10 text-destructive border-destructive/20'
                      }
                    >
                      {scan.status === 'clean' ? 'Clean' : 'Threats Found'}
                    </Badge>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {formatDistanceToNow(scan.date, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
