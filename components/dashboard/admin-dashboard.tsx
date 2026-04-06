'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Users,
  Shield,
  Mail,
  AlertTriangle,
  Server,
  Activity,
  CheckCircle,
  Clock,
  TrendingUp,
  Database,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const systemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  emailsProcessed: 2847563,
  threatsBlocked: 15847,
  systemUptime: 99.97,
  avgResponseTime: 45,
}

const userActivityData = [
  { date: 'Mon', users: 720, scans: 12500 },
  { date: 'Tue', users: 850, scans: 14200 },
  { date: 'Wed', users: 790, scans: 13100 },
  { date: 'Thu', users: 880, scans: 15400 },
  { date: 'Fri', users: 920, scans: 16800 },
  { date: 'Sat', users: 450, scans: 8200 },
  { date: 'Sun', users: 380, scans: 7100 },
]

const threatTypeData = [
  { type: 'Phishing', count: 8945 },
  { type: 'Malware', count: 2341 },
  { type: 'Spoofing', count: 1876 },
  { type: 'BEC', count: 1523 },
  { type: 'Spam', count: 1162 },
]

const recentActivity = [
  { id: 1, type: 'user', message: 'New user registration: john@company.com', time: '2 min ago' },
  { id: 2, type: 'threat', message: 'Critical phishing campaign detected', time: '5 min ago' },
  { id: 3, type: 'system', message: 'Database backup completed successfully', time: '15 min ago' },
  { id: 4, type: 'user', message: 'User upgraded to Pro plan: sarah@corp.com', time: '22 min ago' },
  { id: 5, type: 'threat', message: 'New malware signature added to database', time: '1 hour ago' },
]

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold mt-1">{systemStats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Processed</p>
                <p className="text-3xl font-bold mt-1">{(systemStats.emailsProcessed / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threats Blocked</p>
                <p className="text-3xl font-bold mt-1">{systemStats.threatsBlocked.toLocaleString()}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  100% blocked
                </p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                <p className="text-3xl font-bold mt-1">{systemStats.systemUptime}%</p>
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  All systems operational
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <Server className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">User Activity</CardTitle>
            <CardDescription>Active users and scans over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userActivityData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                  <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.15 0.01 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="oklch(0.75 0.15 195)"
                    fill="url(#colorUsers)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Threat Types</CardTitle>
            <CardDescription>Distribution of blocked threats by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={threatTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                  <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis dataKey="type" type="category" stroke="oklch(0.65 0 0)" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.15 0.01 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                  <Bar dataKey="count" fill="oklch(0.55 0.22 25)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">CPU Usage</span>
                <span className="font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">38%</span>
              </div>
              <Progress value={38} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network I/O</span>
                <span className="font-medium">72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-500">All Services Operational</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </div>
            <Button variant="outline" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'user' ? 'bg-primary/10' :
                    activity.type === 'threat' ? 'bg-destructive/10' :
                    'bg-green-500/10'
                  }`}>
                    {activity.type === 'user' ? (
                      <Users className={`w-4 h-4 ${
                        activity.type === 'user' ? 'text-primary' :
                        activity.type === 'threat' ? 'text-destructive' :
                        'text-green-500'
                      }`} />
                    ) : activity.type === 'threat' ? (
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                    ) : (
                      <Database className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 capitalize">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
