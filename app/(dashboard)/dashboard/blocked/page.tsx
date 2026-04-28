import { cookies } from 'next/headers'
import { BlockedSenders } from '@/components/dashboard/blocked-senders'

export default async function BlockedPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value ?? ''
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

  let blocked: { id: string; sender_email: string; reason: string | null; created_at: string }[] = []

  if (token) {
    try {
      const res = await fetch(`${backendUrl}/blocked`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        blocked = data.blocked ?? []
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blocked Senders</h1>
        <p className="text-muted-foreground mt-1">
          Manage blocked senders and rescue emails from spam
        </p>
      </div>
      <BlockedSenders initialBlocked={blocked} token={token} backendUrl={backendUrl} />
    </div>
  )
}
