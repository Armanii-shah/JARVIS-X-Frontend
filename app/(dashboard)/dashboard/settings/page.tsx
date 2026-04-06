import { cookies } from 'next/headers'
import { SettingsView } from '@/components/dashboard/settings-view'

export default async function SettingsPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value
  const userEmail = cookieStore.get('jarvis_user')?.value ?? ''
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  let phone: string | null = null
  let plan = 'free'

  if (token) {
    try {
      const res = await fetch(`${backendUrl}/user/profile`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        phone = data.phone ?? null
        plan = data.plan ?? 'free'
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and notification preferences
        </p>
      </div>

      <SettingsView
        email={userEmail}
        phone={phone}
        plan={plan}
        token={token ?? ''}
        backendUrl={backendUrl ?? ''}
      />
    </div>
  )
}
