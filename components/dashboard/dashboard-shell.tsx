'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { DashboardSidebar } from './sidebar'
import { DashboardHeader } from './header'
import { OnboardingModal } from './onboarding-modal'
import type { Profile } from '@/lib/types'

interface DashboardShellProps {
  profile: Profile | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  token: string
  backendUrl: string
  showOnboarding: boolean
  children: React.ReactNode
}

export function DashboardShell({
  profile,
  user,
  token,
  backendUrl,
  showOnboarding,
  children,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {showOnboarding && (
        <OnboardingModal token={token} backendUrl={backendUrl} />
      )}

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile (slides in/out), static on desktop */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out',
          'lg:relative lg:z-auto lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <DashboardSidebar
          profile={profile}
          token={token}
          backendUrl={backendUrl}
          onNavClick={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          user={user}
          profile={profile}
          token={token}
          backendUrl={backendUrl}
          onMenuClick={() => setSidebarOpen(v => !v)}
        />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
