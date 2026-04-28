import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jarvis_token')?.value

  if (!token) {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System-wide security monitoring and management
        </p>
      </div>

      <AdminDashboard />
    </div>
  )
}
