'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import type { Profile, Alert } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  LogOut,
  User as UserIcon,
  Settings,
  Loader2,
  AlertTriangle,
  Info,
  CheckCircle,
  Menu,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface DashboardHeaderProps {
  user: User
  profile: Profile | null
  token: string
  backendUrl: string
  onMenuClick?: () => void
}

function alertDot(alert: Alert) {
  if (!alert.title) return 'bg-primary'
  const t = alert.title.toLowerCase()
  if (t.includes('critical') || t.includes('high risk') || t.includes('phishing')) return 'bg-destructive'
  if (t.includes('suspicious') || t.includes('warning') || t.includes('malicious')) return 'bg-yellow-500'
  return 'bg-primary'
}

function AlertIcon({ alert }: { alert: Alert }) {
  const dot = alertDot(alert)
  if (dot === 'bg-destructive') return <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
  if (dot === 'bg-yellow-500') return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
  return <Info className="w-3.5 h-3.5 text-primary" />
}

export function DashboardHeader({ user, profile, token, backendUrl, onMenuClick }: DashboardHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    if (!token || !backendUrl) return

    const fetchAlerts = () => {
      fetch(`${backendUrl}/alert/history?unread=true`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (!data) return
          const list: Alert[] = Array.isArray(data) ? data : (data.alerts ?? data.data ?? [])
          setAlerts(list)
        })
        .catch(() => {})
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [token, backendUrl])

  const displayed = alerts.slice(0, 5)

  const markRead = async (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id))
    try {
      await fetch(`${backendUrl}/alert/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {}
  }

  const markAllRead = async () => {
    setAlerts([])
    try {
      await fetch(`${backendUrl}/alert/mark-all-read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {}
  }

  const handleLogout = () => {
    setIsLoggingOut(true)
    window.location.href = '/auth/logout'
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U'

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Left: hamburger + mobile logo */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
        {/* Show logo on mobile when sidebar is hidden */}
        <div className="lg:hidden">
          <Logo href="/dashboard" size="sm" subtitle="" />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Security Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-green-500">Protected</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                  {alerts.length > 9 ? '9+' : alerts.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {alerts.length > 0 && (
                <Badge variant="secondary" className="text-xs">{alerts.length} new</Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              {displayed.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 text-green-500/50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                displayed.map(alert => (
                  <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={() => markRead(alert.id)}>
                    <div className="flex items-center gap-2 w-full">
                      <AlertIcon alert={alert} />
                      <span className="font-medium text-sm leading-tight">{alert.title}</span>
                    </div>
                    {alert.message && (
                      <p className="text-xs text-muted-foreground pl-5 line-clamp-2">
                        {alert.message}
                      </p>
                    )}
                    {alert.created_at && !isNaN(new Date(alert.created_at).getTime()) && (
                      <span className="text-xs text-muted-foreground pl-5" suppressHydrationWarning>
                        {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </div>
            <DropdownMenuSeparator />
            {alerts.length > 0 && (
              <DropdownMenuItem className="justify-center text-xs text-muted-foreground cursor-pointer" onClick={markAllRead}>
                Mark all as read
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild className="justify-center text-primary text-sm cursor-pointer">
              <Link href="/dashboard/alerts">View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium leading-none">
                  {profile?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {profile?.role === 'admin' ? 'Administrator' : 'Security Agent'}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Security Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-destructive focus:text-destructive"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
