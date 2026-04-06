'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  AlertTriangle,
  Bug,
  Link2,
  UserX,
  MessageSquareWarning,
  Inbox,
} from 'lucide-react'
import type { ThreatDistribution } from '@/lib/types'

interface ThreatDistributionProps {
  data: ThreatDistribution[]
}

const threatIcons: Record<string, React.ElementType> = {
  phishing: AlertTriangle,
  malware: Bug,
  suspicious_link: Link2,
  spoofing: UserX,
  social_engineering: MessageSquareWarning,
  spam: Inbox,
}

const threatColors: Record<string, string> = {
  phishing: 'bg-destructive',
  malware: 'bg-red-600',
  suspicious_link: 'bg-yellow-500',
  spoofing: 'bg-orange-500',
  social_engineering: 'bg-purple-500',
  spam: 'bg-muted-foreground',
}

export function ThreatDistributionCard({ data }: ThreatDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Threat Distribution</CardTitle>
        <CardDescription>Breakdown by threat type</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const Icon = threatIcons[item.type] || AlertTriangle
          const colorClass = threatColors[item.type] || 'bg-muted'
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0

          return (
            <div key={item.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1.5 rounded', colorClass + '/20')}>
                    <Icon className={cn('w-4 h-4', colorClass.replace('bg-', 'text-'))} />
                  </div>
                  <span className="text-sm font-medium capitalize">
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{item.count}</span>
                  <span className="text-xs text-muted-foreground">({percentage}%)</span>
                </div>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
              />
            </div>
          )
        })}

        {data.length === 0 && (
          <div className="text-center py-8">
            <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No threats detected</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
