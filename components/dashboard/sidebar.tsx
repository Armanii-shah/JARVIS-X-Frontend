'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import {
  Shield,
  LayoutDashboard,
  Mail,
  AlertTriangle,
  Bell,
  BarChart3,
  Settings,
  Users,
  History,
  ShieldAlert,
  ShieldOff,
} from 'lucide-react'

interface DashboardSidebarProps {
  profile: Profile | null
  token: string
  backendUrl: string
  onNavClick?: () => void
}

const mainNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/emails', label: 'Emails', icon: Mail },
  { href: '/dashboard/threats', label: 'Threats', icon: AlertTriangle },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/scan-history', label: 'Scan History', icon: History },
  { href: '/dashboard/blocked', label: 'Blocked', icon: ShieldOff },
]

const adminNavItems = [
  { href: '/dashboard/admin', label: 'Admin Panel', icon: ShieldAlert },
  { href: '/dashboard/admin/users', label: 'User Management', icon: Users },
]

export function DashboardSidebar({ profile, token, backendUrl, onNavClick }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isAdmin = profile?.role === 'admin'
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!token || !backendUrl) return
    const fetchCount = () => {
      fetch(`${backendUrl}/alert/history?unread=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list = Array.isArray(data) ? data : (data.alerts ?? data.data ?? [])
          setUnreadCount(list.length)
        })
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [token, backendUrl])

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-cyan">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-lg font-bold">
              <span className="text-primary">JARVIS</span>
              <span className="text-sidebar-foreground">-X</span>
            </span>
            <p className="text-xs text-muted-foreground">Security Platform</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="mb-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                {item.label}
                {item.label === 'Alerts' && unreadCount > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-sidebar-border">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <Link
          href="/dashboard/settings"
          onClick={onNavClick}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
            pathname === '/dashboard/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>

      {/* Subscription Badge */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="px-3 py-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-muted-foreground">Plan</span>
            <span className="text-xs font-semibold text-primary capitalize">
              {profile?.subscription_tier || 'Free'}
            </span>
          </div>
          {profile?.subscription_tier === 'free' && (
            <Link
              href="/dashboard/settings"
              className="text-xs text-primary hover:underline"
            >
              Upgrade to Pro
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}
