'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, Mail, ShieldCheck, ShieldAlert, Shield } from 'lucide-react'
import type { Email } from '@/lib/types'

interface RecentEmailsProps {
  emails: Email[]
}

export function RecentEmails({ emails }: RecentEmailsProps) {
  const getRiskBadge = (riskScore: number, threatLevel: string) => {
    if (threatLevel === 'high' || riskScore >= 70) {
      return {
        variant: 'destructive' as const,
        icon: ShieldAlert,
        label: 'High Risk',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      }
    }
    if (threatLevel === 'medium' || riskScore >= 40) {
      return {
        variant: 'secondary' as const,
        icon: Shield,
        label: 'Medium Risk',
        className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      }
    }
    return {
      variant: 'secondary' as const,
      icon: ShieldCheck,
      label: 'Safe',
      className: 'bg-green-500/10 text-green-500 border-green-500/20',
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Recent Emails</CardTitle>
          <CardDescription>Latest scanned emails</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/emails" className="text-primary">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {emails.map((email) => {
            const riskScore = email.risk_score ?? email.score ?? 0
            const risk = getRiskBadge(riskScore, email.threat_level)
            const RiskIcon = risk.icon

            return (
              <div
                key={email.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className={cn(
                  'p-2 rounded-lg shrink-0',
                  email.threat_level === 'high' 
                    ? 'bg-destructive/10' 
                    : email.threat_level === 'medium'
                    ? 'bg-yellow-500/10'
                    : 'bg-primary/10'
                )}>
                  <Mail className={cn(
                    'w-5 h-5',
                    email.threat_level === 'high' 
                      ? 'text-destructive' 
                      : email.threat_level === 'medium'
                      ? 'text-yellow-500'
                      : 'text-primary'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium truncate">
                        {email.subject || '(No Subject)'}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        From: {email.sender_name || email.sender_email}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('shrink-0 gap-1', risk.className)}
                    >
                      <RiskIcon className="w-3 h-3" />
                      {riskScore}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {email.received_at && !isNaN(new Date(email.received_at).getTime())
                        ? formatDistanceToNow(new Date(email.received_at), { addSuffix: true })
                        : 'Unknown time'}
                    </span>
                    <Badge variant="outline" className={cn('text-xs', risk.className)}>
                      {risk.label}
                    </Badge>
                  </div>
                </div>
              </div>
            )
          })}

          {emails.length === 0 && (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No emails scanned yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Connect an email account to start monitoring
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
