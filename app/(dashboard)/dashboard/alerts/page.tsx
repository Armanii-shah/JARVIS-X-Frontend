import { cookies } from 'next/headers'
import { AlertsView } from '@/components/dashboard/alerts-view'
import type { Alert } from '@/lib/types'

export default async function AlertsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  let alerts: Alert[] = []

  if (token) {
    try {
      const res = await fetch(`${backendUrl}/alert/history`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        alerts = Array.isArray(data) ? data : (data.alerts ?? data.data ?? [])
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Alerts</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your security notifications
        </p>
      </div>

      <AlertsView alerts={alerts} token={token ?? ''} backendUrl={backendUrl ?? ''} />
    </div>
  )
}
