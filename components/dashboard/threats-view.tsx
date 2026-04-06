'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  AlertTriangle,
  Bug,
  Link2,
  UserX,
  MessageSquareWarning,
  Inbox,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw,
} from 'lucide-react'
import type { Threat } from '@/lib/types'

interface ThreatsViewProps {
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

export function ThreatsView({ threats }: ThreatsViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.threat_type.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && !threat.is_resolved) ||
      (activeTab === 'resolved' && threat.is_resolved)

    return matchesSearch && matchesTab
  })

  const activeCount = threats.filter((t) => !t.is_resolved).length
  const resolvedCount = threats.filter((t) => t.is_resolved).length
  const criticalCount = threats.filter((t) => t.severity === 'critical' && !t.is_resolved).length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Threats</p>
              <p className="text-2xl font-bold">{threats.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">{resolvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn('border-destructive/30', criticalCount > 0 && 'pulse-alert')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/20">
              <Shield className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threats List */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Threats</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search threats..."
                className="pl-10 w-64 bg-input/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({threats.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({resolvedCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredThreats.map((threat) => {
                const Icon = threatIcons[threat.threat_type] || AlertTriangle
                const colors = severityColors[threat.severity]

                return (
                  <div
                    key={threat.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                      colors.border,
                      colors.bg,
                      'hover:bg-opacity-70'
                    )}
                  >
                    <div className={cn('p-3 rounded-lg', colors.bg)}>
                      <Icon className={cn('w-6 h-6', colors.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium capitalize">
                              {threat.threat_type.replace('_', ' ')}
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn('capitalize', colors.border, colors.text)}
                            >
                              {threat.severity}
                            </Badge>
                            {threat.is_resolved ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Resolved
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                <Clock className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {threat.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {threat.indicators.map((indicator, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-muted/50"
                              >
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                            {formatDistanceToNow(new Date(threat.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                          {!threat.is_resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2"
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredThreats.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No threats found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
