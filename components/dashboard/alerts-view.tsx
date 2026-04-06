'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  Bell,
  Mail,
  Smartphone,
  Monitor,
  Phone,
  CheckCircle,
  Circle,
  Trash2,
  CheckCheck,
} from 'lucide-react'
import type { Alert } from '@/lib/types'

interface AlertsViewProps {
  alerts: Alert[]
  token: string
  backendUrl: string
}

const alertTypeIcons: Record<string, React.ElementType> = {
  email: Mail,
  sms: Smartphone,
  whatsapp: Smartphone,
  push: Bell,
  call: Phone,
  dashboard: Monitor,
  none: Bell,
}

export function AlertsView({ alerts: initial, token, backendUrl }: AlertsViewProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initial)
  const [activeTab, setActiveTab] = useState('all')

  const authHeader = { Authorization: `Bearer ${token}` }

  const markRead = async (id: string) => {
    try {
      await fetch(`${backendUrl}/alert/${id}/read`, {
        method: 'PATCH',
        headers: authHeader,
      })
      setAlerts(prev =>
        prev.map(a => a.id === id ? { ...a, is_read: true } : a)
      )
    } catch {}
  }

  const deleteAlert = async (id: string) => {
    try {
      await fetch(`${backendUrl}/alert/${id}`, {
        method: 'DELETE',
        headers: authHeader,
      })
      setAlerts(prev => prev.filter(a => a.id !== id))
    } catch {}
  }

  const markAllRead = async () => {
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
    try {
      await fetch(`${backendUrl}/alert/mark-all-read`, {
        method: 'PATCH',
        headers: authHeader,
      })
    } catch {}
  }

  const clearAll = async () => {
    await Promise.allSettled(
      alerts.map(a =>
        fetch(`${backendUrl}/alert/${a.id}`, {
          method: 'DELETE',
          headers: authHeader,
        })
      )
    )
    setAlerts([])
  }

  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'unread') return !alert.is_read
    if (activeTab === 'read') return alert.is_read
    return true
  })

  const unreadCount = alerts.filter(a => !a.is_read).length

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn('border-border/50', unreadCount > 0 && 'border-primary/30')}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <Circle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unread</p>
              <p className="text-2xl font-bold">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Read</p>
              <p className="text-2xl font-bold">{alerts.length - unreadCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">All Alerts</CardTitle>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
            {alerts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={clearAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({alerts.length})</TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
                {unreadCount > 0 && (
                  <span className="ml-1.5 w-2 h-2 rounded-full bg-primary" />
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read ({alerts.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3">
              {filteredAlerts.map(alert => {
                const Icon = alertTypeIcons[alert.alert_type] ?? Bell
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'flex items-start gap-4 p-4 rounded-lg border transition-colors',
                      alert.is_read
                        ? 'border-border/50 hover:bg-muted/30'
                        : 'border-primary/30 bg-primary/5 hover:bg-primary/10'
                    )}
                  >
                    <div className={cn('p-2.5 rounded-lg shrink-0', alert.is_read ? 'bg-muted' : 'bg-primary/10')}>
                      <Icon className={cn('w-5 h-5', alert.is_read ? 'text-muted-foreground' : 'text-primary')} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!alert.is_read && (
                              <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                            )}
                            <h4 className={cn('font-medium truncate', !alert.is_read && 'text-foreground')}>
                              {alert.title || 'Security Alert'}
                            </h4>
                          </div>
                          {alert.message && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {alert.message}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {alert.alert_type || 'dashboard'}
                            </Badge>
                            <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                              {alert.created_at && !isNaN(new Date(alert.created_at).getTime())
                                ? formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })
                                : 'Unknown time'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {!alert.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => markRead(alert.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {filteredAlerts.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {activeTab === 'unread' ? 'No unread alerts' : 'No alerts found'}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
