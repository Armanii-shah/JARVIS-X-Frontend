'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  AlertTriangle,
  Bug,
  Link2,
  UserX,
  MessageSquareWarning,
  Inbox,
  ArrowRight,
  CheckCircle,
  Clock,
} from 'lucide-react'
import type { Threat } from '@/lib/types'

interface RecentThreatsProps {
  threats: Threat[]
}

const threatIcons: Record<string, React.ElementType> = {
  phishing: AlertTriangle,
  malware: Bug,
  suspicious_link: Link2,
  spoofing: UserX,
  social_engineering: MessageSquareWarning,
  spam: Inbox,
}

const severityColors: Record<string, { bg: string; text: string; border: string }> = {
  low: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/20',
  },
  medium: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-500',
    border: 'border-yellow-500/20',
  },
  high: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    border: 'border-orange-500/20',
  },
  critical: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/20',
  },
}

export function RecentThreats({ threats }: RecentThreatsProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Threats</CardTitle>
          <CardDescription>Latest detected security threats</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/threats" className="text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat) => {
            const Icon = threatIcons[threat.threat_type] || AlertTriangle
            const colors = severityColors[threat.severity]

            return (
              <div
                key={threat.id}
                className={cn(
                  'flex items-start gap-4 p-4 rounded-lg border',
                  colors.border,
                  colors.bg
                )}
              >
                <div className={cn('p-2 rounded-lg', colors.bg)}>
                  <Icon className={cn('w-5 h-5', colors.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-medium capitalize">
                        {threat.threat_type.replace('_', ' ')} Detected
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {threat.description || 'No description available'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        'shrink-0 capitalize',
                        colors.border,
                        colors.text
                      )}
                    >
                      {threat.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(threat.created_at), { addSuffix: true })}
                    </span>
                    {threat.is_resolved ? (
                      <span className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {threats.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recent threats</p>
              <p className="text-xs text-muted-foreground mt-1">Your inbox is secure</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
