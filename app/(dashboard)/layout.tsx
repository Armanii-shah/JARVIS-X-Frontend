import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { OnboardingModal } from '@/components/dashboard/onboarding-modal'
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
    <div className="flex h-screen bg-background">
      {!onboarded && (
        <OnboardingModal token={token ?? ''} backendUrl={backendUrl} />
      )}
      <DashboardSidebar user={user} profile={profile} token={token ?? ''} backendUrl={backendUrl} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={user} profile={profile} token={token ?? ''} backendUrl={backendUrl} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
