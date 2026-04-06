import { cookies } from 'next/headers'
import { EmailsTable } from '@/components/dashboard/emails-table'
import type { Email } from '@/lib/types'

export default async function EmailsPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scanned Emails</h1>
        <p className="text-muted-foreground mt-1">
          View and analyze all scanned emails with AI risk assessment
        </p>
      </div>

      <EmailsTable emails={emails} />
    </div>
  )
}
