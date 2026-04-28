'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Mail,
  RefreshCw,
  ShieldOff,
  RotateCcw,
} from 'lucide-react'
import type { Email, SpamEmail } from '@/lib/types'

interface EmailsTableProps {
  emails: Email[]
  blockedSenderEmails: string[]
  token: string
  backendUrl: string
}

const PAGE_SIZE = 20

function parseSender(email: Email | SpamEmail): { name: string; address: string } {
  if (email.sender_email) {
    return { name: email.sender_name || email.sender_email, address: email.sender_email }
  }
  if (email.sender) {
    const match = email.sender.match(/<([^>]+)>/)
    if (match) {
      const name = email.sender.slice(0, email.sender.indexOf('<')).trim()
      return { name: name || match[1], address: match[1] }
    }
    return { name: email.sender, address: email.sender }
  }
  return { name: 'Unknown', address: '' }
}

function getRiskBadge(score: number, threatLevel: string) {
  if (threatLevel === 'high' || score >= 70) {
    return {
      icon: ShieldAlert,
      label: 'High Risk',
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    }
  }
  if (threatLevel === 'medium' || score >= 40) {
    return {
      icon: Shield,
      label: 'Medium',
      className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    }
  }
  return {
    icon: ShieldCheck,
    label: 'Safe',
    className: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
}

function mailIconClasses(threatLevel: string) {
  return {
    wrapper: threatLevel === 'high'
      ? 'bg-destructive/10'
      : threatLevel === 'medium'
      ? 'bg-yellow-500/10'
      : 'bg-primary/10',
    icon: threatLevel === 'high'
      ? 'text-destructive'
      : threatLevel === 'medium'
      ? 'text-yellow-500'
      : 'text-primary',
  }
}

export function EmailsTable({ emails, blockedSenderEmails, token, backendUrl }: EmailsTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'inbox' | 'spam'>('inbox')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  function handleRefresh() {
    startTransition(() => {
      router.refresh()
    })
  }

  // Block dialog state
  const [blockTarget, setBlockTarget] = useState<{ email: string; name: string } | null>(null)
  const [blocking, setBlocking] = useState(false)

  // Spam: lazy-loaded on first tab click, cached thereafter
  const [spamEmails, setSpamEmails] = useState<SpamEmail[]>([])
  const [spamLoading, setSpamLoading] = useState(false)
  const [spamLoaded, setSpamLoaded] = useState(false)

  // Spam rescue state
  const [rescuingId, setRescuingId] = useState<string | null>(null)
  const [rescuedIds, setRescuedIds] = useState<Set<string>>(new Set())

  async function fetchSpam() {
    setSpamLoading(true)
    try {
      const res = await fetch(`${backendUrl}/email/spam`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSpamEmails(Array.isArray(data) ? data : [])
      }
    } finally {
      setSpamLoading(false)
      setSpamLoaded(true)
    }
  }

  function switchTab(tab: 'inbox' | 'spam') {
    setActiveTab(tab)
    setPage(0)
    setSearchQuery('')
    setFilterLevel(null)
    if (tab === 'spam' && !spamLoaded && !spamLoading) {
      fetchSpam()
    }
  }

  async function confirmBlock() {
    if (!blockTarget) return
    setBlocking(true)
    try {
      await fetch(`${backendUrl}/blocked`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sender_email: blockTarget.email, reason: 'Blocked by user' }),
      })
    } finally {
      setBlocking(false)
      setBlockTarget(null)
    }
  }

  async function handleRescue(gmailMessageId: string) {
    setRescuingId(gmailMessageId)
    try {
      const res = await fetch(`${backendUrl}/email/rescue/${gmailMessageId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setRescuedIds(prev => new Set([...prev, gmailMessageId]))
      }
    } finally {
      setRescuingId(null)
    }
  }

  const blockedSet = new Set(blockedSenderEmails.map(e => e.toLowerCase()))

  // ── Inbox filtering ──────────────────────────────────────────────────────
  const filteredInbox = emails.filter(email => {
    const { name, address } = parseSender(email)
    if (blockedSet.has(address.toLowerCase())) return false
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (!filterLevel || email.threat_level === filterLevel)
  })

  // ── Spam filtering ───────────────────────────────────────────────────────
  const visibleSpam = spamEmails.filter(s => !rescuedIds.has(s.gmail_message_id))
  const filteredSpam = visibleSpam.filter(email => {
    const { name, address } = parseSender(email)
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch && (!filterLevel || email.threat_level === filterLevel)
  })

  const activeList = activeTab === 'inbox' ? filteredInbox : filteredSpam
  const totalPages = Math.ceil(activeList.length / PAGE_SIZE)
  const pagedItems = activeList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <>
      {/* Block sender confirmation dialog */}
      <Dialog open={!!blockTarget} onOpenChange={open => { if (!open) setBlockTarget(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block Sender</DialogTitle>
            <DialogDescription>
              Block <strong>{blockTarget?.name}</strong> ({blockTarget?.email})? Future emails will be routed to spam automatically.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockTarget(null)} disabled={blocking}>Cancel</Button>
            <Button variant="destructive" onClick={confirmBlock} disabled={blocking}>
              {blocking ? 'Blocking…' : 'Block Sender'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="border-border/50">
        <Tabs value={activeTab} onValueChange={v => switchTab(v as 'inbox' | 'spam')}>
          <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="spam">
                Spam {spamLoading ? '…' : visibleSpam.length > 0 ? `(${visibleSpam.length})` : ''}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search emails..."
                  className="pl-10 w-40 sm:w-64 bg-input/50"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setPage(0) }}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setFilterLevel(null); setPage(0) }}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilterLevel('high'); setPage(0) }}>High Risk</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilterLevel('medium'); setPage(0) }}>Medium Risk</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setFilterLevel('low'); setPage(0) }}>Safe</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isPending}>
                <RefreshCw className={cn('w-4 h-4', isPending && 'animate-spin')} />
              </Button>
            </div>
          </CardHeader>

          {/* ── INBOX TAB ────────────────────────────────────────────────────── */}
          <TabsContent value="inbox">
            <CardContent>
              <EmailRowsTable
                items={pagedItems as Email[]}
                isSpam={false}
                blockedSet={blockedSet}
                rescuingId={rescuingId}
                onBlock={setBlockTarget}
                onRescue={handleRescue}
              />
              {filteredInbox.length === 0 && <EmptyState />}
              <Pagination
                page={page}
                totalPages={totalPages}
                total={filteredInbox.length}
                onPrev={() => setPage(p => p - 1)}
                onNext={() => setPage(p => p + 1)}
              />
            </CardContent>
          </TabsContent>

          {/* ── SPAM TAB ─────────────────────────────────────────────────────── */}
          <TabsContent value="spam">
            <CardContent>
              {spamLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyzing spam folder…</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-end mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => { setRescuedIds(new Set()); fetchSpam() }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </Button>
                  </div>
                  <EmailRowsTable
                    items={pagedItems as SpamEmail[]}
                    isSpam={true}
                    blockedSet={blockedSet}
                    rescuingId={rescuingId}
                    onBlock={setBlockTarget}
                    onRescue={handleRescue}
                  />
                  {filteredSpam.length === 0 && (
                    <EmptyState message={spamLoaded ? 'No spam emails in the last 7 days' : 'Click Refresh to load spam'} />
                  )}
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    total={filteredSpam.length}
                    onPrev={() => setPage(p => p - 1)}
                    onNext={() => setPage(p => p + 1)}
                  />
                </>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface EmailRowsTableProps {
  items: (Email | SpamEmail)[]
  isSpam: boolean
  blockedSet: Set<string>
  rescuingId: string | null
  onBlock: (target: { email: string; name: string }) => void
  onRescue: (gmailMessageId: string) => void
}

function EmailRowsTable({ items, isSpam, blockedSet, rescuingId, onBlock, onRescue }: EmailRowsTableProps) {
  return (
    <div className="rounded-lg border border-border/50 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-12" />
            <TableHead className="hidden sm:table-cell">Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="w-24 text-center">Risk</TableHead>
            <TableHead className="w-36 hidden sm:table-cell">Status</TableHead>
            <TableHead className="w-32 hidden md:table-cell">Received</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(email => {
            const score = ('score' in email ? email.score : null) ?? ('risk_score' in email ? (email as Email).risk_score : null) ?? 0
            const risk = getRiskBadge(score, email.threat_level)
            const RiskIcon = risk.icon
            const sender = parseSender(email)
            const mailCls = mailIconClasses(email.threat_level)
            const gmailId = 'gmail_message_id' in email
              ? email.gmail_message_id
              : (email as Email).gmail_message_id
            const isRead = 'is_read' in email ? (email as Email).is_read : true
            const senderIsBlocked = isSpam && blockedSet.has(sender.address)

            return (
              <TableRow
                key={gmailId ?? ('id' in email ? (email as Email).id : undefined)}
                className={cn('hover:bg-muted/30', !isRead && 'bg-primary/5')}
              >
                <TableCell>
                  <div className={cn('p-1.5 rounded', mailCls.wrapper)}>
                    <Mail className={cn('w-4 h-4', mailCls.icon)} />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <p className={cn('text-sm', !isRead && 'font-semibold')}>{sender.name}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-48">{sender.address}</p>
                </TableCell>
                <TableCell>
                  <p className={cn('text-sm truncate max-w-md', !isRead && 'font-semibold')}>
                    {email.subject || '(No Subject)'}
                  </p>
                  {'body_preview' in email && (
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {(email as Email).body_preview}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className={cn(
                    'inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold text-sm',
                    score >= 61 ? 'bg-destructive/20 text-destructive'
                      : score >= 41 ? 'bg-yellow-500/20 text-yellow-500'
                      : 'bg-green-500/20 text-green-500'
                  )}>
                    {score}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className={cn('gap-1 w-fit', risk.className)}>
                      <RiskIcon className="w-3 h-3" />
                      {risk.label}
                    </Badge>
                    {isSpam && (
                      <Badge variant="outline" className="w-fit text-xs bg-destructive/10 text-destructive border-destructive/20">
                        Spam
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground" suppressHydrationWarning>
                  {email.received_at && !isNaN(new Date(email.received_at).getTime())
                    ? formatDistanceToNow(new Date(email.received_at), { addSuffix: true })
                    : 'Unknown'}
                </TableCell>
                <TableCell>
                  {isSpam ? (
                    senderIsBlocked ? (
                      <Badge variant="outline" className="gap-1 bg-destructive/10 text-destructive border-destructive/20">
                        <ShieldOff className="w-3 h-3" />
                        Blocked
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs"
                        disabled={rescuingId === gmailId}
                        onClick={() => gmailId && onRescue(gmailId)}
                      >
                        <RotateCcw className="w-3 h-3" />
                        {rescuingId === gmailId ? 'Moving…' : 'Rescue'}
                      </Button>
                    )
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShieldAlert className="w-4 h-4 mr-2" />
                          Report Threat
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          Mark as Safe
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => onBlock({ email: sender.address, name: sender.name })}
                        >
                          <ShieldOff className="w-4 h-4 mr-2" />
                          Block Sender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function EmptyState({ message = 'No emails found' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
}: {
  page: number
  totalPages: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  if (total === 0) return null
  const start = page * PAGE_SIZE + 1
  const end = Math.min((page + 1) * PAGE_SIZE, total)
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total} emails
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page === 0} onClick={onPrev}>Previous</Button>
        <span className="text-sm text-muted-foreground">{page + 1} / {totalPages || 1}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={onNext}>Next</Button>
      </div>
    </div>
  )
}
