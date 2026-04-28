import { cookies } from 'next/headers'
import { EmailsTable } from '@/components/dashboard/emails-table'
import type { Email } from '@/lib/types'

export default async function EmailsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value ?? ''
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

  let emails: Email[] = []
  let blockedSenderEmails: string[] = []

  if (token) {
    const [inboxRes, blockedRes] = await Promise.all([
      fetch(`${backendUrl}/email/history`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null),
      fetch(`${backendUrl}/blocked`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => null),
    ])

    if (inboxRes?.ok) {
      const data = await inboxRes.json().catch(() => [])
      emails = Array.isArray(data) ? data : []
    }
    if (blockedRes?.ok) {
      const data = await blockedRes.json().catch(() => ({}))
      blockedSenderEmails = (data?.blocked ?? []).map((b: { sender_email: string }) => b.sender_email)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Scanned Emails</h1>
        <p className="text-muted-foreground mt-1">
          View and analyze all scanned emails with AI risk assessment
        </p>
      </div>

      <EmailsTable
        emails={emails}
        blockedSenderEmails={blockedSenderEmails}
        token={token}
        backendUrl={backendUrl}
      />
    </div>
  )
}
