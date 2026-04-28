import { cookies } from 'next/headers'
import { UpgradeView } from '@/components/dashboard/upgrade-view'

export default async function UpgradePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value ?? ''
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''

  let currentPlan = 'free'

  if (token) {
    try {
      const res = await fetch(`${backendUrl}/user/profile`, {
        cache: 'no-store',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        currentPlan = data.plan ?? 'free'
      }
    } catch {}
  }

  return <UpgradeView currentPlan={currentPlan} />
}
