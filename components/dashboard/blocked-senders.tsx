'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { ShieldOff, Trash2, RotateCcw, Mail } from 'lucide-react'

interface BlockedSender {
  id: string
  sender_email: string
  reason: string | null
  created_at: string
}

interface BlockedSendersProps {
  initialBlocked: BlockedSender[]
  token: string
  backendUrl: string
}

export function BlockedSenders({ initialBlocked, token, backendUrl }: BlockedSendersProps) {
  const [blocked, setBlocked] = useState(initialBlocked)
  const [loading, setLoading] = useState<string | null>(null)

  async function handleUnblock(id: string, rescue: boolean) {
    setLoading(id)
    try {
      const res = await fetch(`${backendUrl}/blocked/${id}?rescue=${rescue}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setBlocked(prev => prev.filter(b => b.id !== id))
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Blocked Senders</CardTitle>
        <CardDescription>Senders whose emails are automatically routed to spam</CardDescription>
      </CardHeader>
      <CardContent>
        {blocked.length === 0 ? (
          <div className="text-center py-12">
            <ShieldOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No blocked senders</p>
          </div>
        ) : (
          <div className="space-y-3">
            {blocked.map((b) => (
              <div
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-destructive/10 shrink-0">
                    <Mail className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.sender_email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {b.reason && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          {b.reason}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        Blocked {formatDistanceToNow(new Date(b.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col lg:flex-row items-stretch sm:items-stretch lg:items-center gap-2 sm:shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading === b.id}
                    onClick={() => handleUnblock(b.id, true)}
                    title="Unblock and move spam emails back to inbox"
                    className="flex-1 sm:flex-none justify-center"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                    Rescue & Unblock
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading === b.id}
                    onClick={() => handleUnblock(b.id, false)}
                    title="Unblock only — spam emails stay in spam"
                    className="flex-1 sm:flex-none justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Unblock
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
