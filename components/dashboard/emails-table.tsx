'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
} from 'lucide-react'
import type { Email } from '@/lib/types'

interface EmailsTableProps {
  emails: Email[]
}

const PAGE_SIZE = 20

export function EmailsTable({ emails }: EmailsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState<string | null>(null)
  const [page, setPage] = useState(0)

  const filteredEmails = emails.filter((email) => {
    const matchesSearch =
      email.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = !filterLevel || email.threat_level === filterLevel

    return matchesSearch && matchesFilter
  })

  const totalPages = Math.ceil(filteredEmails.length / PAGE_SIZE)
  const pagedEmails = filteredEmails.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const getRiskBadge = (riskScore: number, threatLevel: string) => {
    if (threatLevel === 'high' || riskScore >= 70) {
      return {
        icon: ShieldAlert,
        label: 'High Risk',
        className: 'bg-destructive/10 text-destructive border-destructive/20',
      }
    }
    if (threatLevel === 'medium' || riskScore >= 40) {
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

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">All Emails</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              className="pl-10 w-64 bg-input/50"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0) }}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => { setFilterLevel(null); setPage(0) }}>
                All Emails
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setFilterLevel('high'); setPage(0) }}>
                High Risk Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setFilterLevel('medium'); setPage(0) }}>
                Medium Risk Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setFilterLevel('low'); setPage(0) }}>
                Safe Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-12" />
                <TableHead>Sender</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="w-24 text-center">Risk Score</TableHead>
                <TableHead className="w-28">Status</TableHead>
                <TableHead className="w-32">Received</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedEmails.map((email) => {
                const score = email.score ?? email.risk_score ?? 0
                const risk = getRiskBadge(score, email.threat_level)
                const RiskIcon = risk.icon

                return (
                  <TableRow
                    key={email.id}
                    className={cn(
                      'cursor-pointer hover:bg-muted/30',
                      !email.is_read && 'bg-primary/5'
                    )}
                  >
                    <TableCell>
                      <div
                        className={cn(
                          'p-1.5 rounded',
                          email.threat_level === 'high'
                            ? 'bg-destructive/10'
                            : email.threat_level === 'medium'
                            ? 'bg-yellow-500/10'
                            : 'bg-primary/10'
                        )}
                      >
                        <Mail
                          className={cn(
                            'w-4 h-4',
                            email.threat_level === 'high'
                              ? 'text-destructive'
                              : email.threat_level === 'medium'
                              ? 'text-yellow-500'
                              : 'text-primary'
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={cn('text-sm', !email.is_read && 'font-semibold')}>
                          {email.sender_name || email.sender_email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-48">
                          {email.sender_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className={cn('text-sm truncate max-w-md', !email.is_read && 'font-semibold')}>
                          {email.subject || '(No Subject)'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {email.body_preview}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div
                        className={cn(
                          'inline-flex items-center justify-center w-12 h-8 rounded-lg font-bold text-sm',
                          score >= 61
                            ? 'bg-destructive/20 text-destructive'
                            : score >= 41
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-green-500/20 text-green-500'
                        )}
                      >
                        {score}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('gap-1', risk.className)}
                      >
                        <RiskIcon className="w-3 h-3" />
                        {risk.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" suppressHydrationWarning>
                      {email.received_at && !isNaN(new Date(email.received_at).getTime())
                        ? formatDistanceToNow(new Date(email.received_at), { addSuffix: true })
                        : email.scanned_at && !isNaN(new Date(email.scanned_at).getTime())
                        ? formatDistanceToNow(new Date(email.scanned_at), { addSuffix: true })
                        : 'Unknown'}
                    </TableCell>
                    <TableCell>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {filteredEmails.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No emails found</p>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredEmails.length)} of {filteredEmails.length} emails
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              {page + 1} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
