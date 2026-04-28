import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import type { Profile } from '@/lib/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value
  const userEmail = cookieStore.get('jarvis_user')?.value
  const onboarded = cookieStore.get('jarvis_onboarded')?.value

  if (!token) {
    redirect('/auth/login')
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

  let profile: Profile | null = null
  try {
    const res = await fetch(`${backendUrl}/user/profile`, {
      cache: 'no-store',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) {
      const data = await res.json()
      profile = data.profile ?? data ?? null
    }
  } catch {}

  const user = { id: profile?.id ?? '', email: userEmail ?? '' } as any

  return (
    <DashboardShell
      profile={profile}
      user={user}
      token={token ?? ''}
      backendUrl={backendUrl}
      showOnboarding={!onboarded}
    >
      {children}
    </DashboardShell>
  )
}
