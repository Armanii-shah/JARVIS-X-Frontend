'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Mail,
  ShieldAlert,
  Bell,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
  lastScanAt?: string | null
}

export function StatsCards({ stats, lastScanAt }: StatsCardsProps) {
  const cards = [
    {
      title: 'Emails Scanned',
      value: stats.totalEmailsScanned.toLocaleString(),
      change: '+12%',
      trend: 'up' as const,
      icon: Mail,
      color: 'primary',
      subtitle: `${stats.emailsToday} today`,
    },
    {
      title: 'Threats Detected',
      value: stats.totalThreatsDetected.toLocaleString(),
      change: '-8%',
      trend: 'down' as const,
      icon: ShieldAlert,
      color: 'destructive',
      subtitle: `${stats.threatsToday} today`,
    },
    {
      title: 'Active Alerts',
      value: stats.activeAlerts.toLocaleString(),
      change: '+3',
      trend: 'up' as const,
      icon: Bell,
      color: 'warning',
      subtitle: 'Requires attention',
    },
    {
      title: 'Security Score',
      value: `${stats.riskScore}%`,
      change: '+5%',
      trend: 'up' as const,
      icon: Activity,
      color: stats.riskScore >= 80 ? 'success' : stats.riskScore >= 60 ? 'warning' : 'destructive',
      subtitle: stats.riskScore >= 80 ? 'Excellent' : stats.riskScore >= 60 ? 'Good' : 'Needs Attention',
    },
  ]

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          border: 'border-primary/20',
        }
      case 'destructive':
        return {
          bg: 'bg-destructive/10',
          text: 'text-destructive',
          border: 'border-destructive/20',
        }
      case 'warning':
        return {
          bg: 'bg-yellow-500/10',
          text: 'text-yellow-500',
          border: 'border-yellow-500/20',
        }
      case 'success':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          border: 'border-green-500/20',
        }
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          border: 'border-border',
        }
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const colors = getColorClasses(card.color)
        return (
          <Card key={card.title} className={cn('border', colors.border)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">
                    {card.value}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'inline-flex items-center text-xs font-medium',
                        card.trend === 'up'
                          ? card.color === 'destructive' || card.title === 'Active Alerts'
                            ? 'text-destructive'
                            : 'text-green-500'
                          : card.color === 'destructive'
                          ? 'text-green-500'
                          : 'text-destructive'
                      )}
                    >
                      {card.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {card.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </span>
                  </div>
                </div>
                <div className={cn('p-3 rounded-lg', colors.bg)}>
                  <card.icon className={cn('w-6 h-6', colors.text)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Additional Quick Stats */}
      <Card className="md:col-span-2 lg:col-span-2 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <ShieldCheck className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Threats Blocked
                </p>
                <p className="text-2xl font-bold">{stats.threatsBlocked.toLocaleString()}</p>
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Phishing Attempts
                </p>
                <p className="text-2xl font-bold">{stats.phishingAttempts.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-2 border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                AI Protection Status
              </p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-lg font-semibold text-green-500">
                  Active & Monitoring
                </span>
              </div>
            </div>
            <div className="text-right" suppressHydrationWarning>
              <p className="text-sm text-muted-foreground">Last scan</p>
              <p className="text-sm font-medium">
                {lastScanAt && !isNaN(new Date(lastScanAt).getTime())
                  ? formatDistanceToNow(new Date(lastScanAt), { addSuffix: true })
                  : 'No scans yet'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
