'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'

const monthlyData = [
  { week: 'Week 1', emails: 0, threats: 0 },
  { week: 'Week 2', emails: 0, threats: 0 },
  { week: 'Week 3', emails: 0, threats: 0 },
  { week: 'Week 4', emails: 0, threats: 0 },
]

const COLORS = ['oklch(0.75 0.15 195)', 'oklch(0.65 0.18 145)', 'oklch(0.75 0.18 85)', 'oklch(0.55 0.22 25)']

const threatSourceData = [
  { name: 'External Domains', value: 65 },
  { name: 'Known Bad Actors', value: 20 },
  { name: 'Internal Spoofing', value: 10 },
  { name: 'Unknown Sources', value: 5 },
]

interface AnalyticsViewProps {
  weeklyData: { day: string; emails: number; threats: number; blocked: number }[]
  riskScoreDistribution: { range: string; count: number }[]
  avgRisk: number
  emailsThisWeek: number
  threatsBlocked: number
  totalEmails: number
}

export function AnalyticsView({
  weeklyData,
  riskScoreDistribution,
  avgRisk,
  emailsThisWeek,
  threatsBlocked,
  totalEmails,
}: AnalyticsViewProps) {
  const protectionRate = totalEmails > 0
    ? Math.round(((totalEmails - threatsBlocked) / totalEmails) * 100)
    : 100
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protection Rate</p>
                <p className="text-2xl font-bold text-green-500">{protectionRate}%</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                <p className="text-2xl font-bold">{avgRisk}</p>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emails This Week</p>
                <p className="text-2xl font-bold">{emailsThisWeek.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threats Blocked</p>
                <p className="text-2xl font-bold">{threatsBlocked}</p>
              </div>
              <div className="flex items-center gap-1 text-destructive">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="weekly" className="space-y-6">
        <TabsList>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Email Volume & Threats</CardTitle>
                <CardDescription>Daily breakdown for the current week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorEmails" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="oklch(0.75 0.15 195)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                      <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.15 0.01 250)',
                          border: '1px solid oklch(0.28 0.02 250)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0 0)',
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="emails"
                        name="Emails"
                        stroke="oklch(0.75 0.15 195)"
                        fill="url(#colorEmails)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Threats Detected vs Blocked</CardTitle>
                <CardDescription>All threats successfully neutralized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                      <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={12} />
                      <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'oklch(0.15 0.01 250)',
                          border: '1px solid oklch(0.28 0.02 250)',
                          borderRadius: '8px',
                          color: 'oklch(0.95 0 0)',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="threats" name="Detected" fill="oklch(0.55 0.22 25)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="blocked" name="Blocked" fill="oklch(0.65 0.18 145)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Monthly Overview</CardTitle>
              <CardDescription>Email volume and threats over the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                    <XAxis dataKey="week" stroke="oklch(0.65 0 0)" fontSize={12} />
                    <YAxis yAxisId="left" stroke="oklch(0.65 0 0)" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="oklch(0.65 0 0)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'oklch(0.15 0.01 250)',
                        border: '1px solid oklch(0.28 0.02 250)',
                        borderRadius: '8px',
                        color: 'oklch(0.95 0 0)',
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="emails"
                      name="Emails"
                      stroke="oklch(0.75 0.15 195)"
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.75 0.15 195)' }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="threats"
                      name="Threats"
                      stroke="oklch(0.55 0.22 25)"
                      strokeWidth={2}
                      dot={{ fill: 'oklch(0.55 0.22 25)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Threat Sources</CardTitle>
            <CardDescription>Origin of detected threats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={threatSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {threatSourceData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.15 0.01 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Score Distribution</CardTitle>
            <CardDescription>Email count by risk score range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskScoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
                  <XAxis dataKey="range" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.15 0.01 250)',
                      border: '1px solid oklch(0.28 0.02 250)',
                      borderRadius: '8px',
                      color: 'oklch(0.95 0 0)',
                    }}
                  />
                  <Bar dataKey="count" name="Emails" radius={[4, 4, 0, 0]}>
                    {riskScoreDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0 ? 'oklch(0.65 0.18 145)' :
                          index === 1 ? 'oklch(0.70 0.15 170)' :
                          index === 2 ? 'oklch(0.75 0.18 85)' :
                          index === 3 ? 'oklch(0.60 0.20 50)' :
                          'oklch(0.55 0.22 25)'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Insights */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Security Insights</CardTitle>
          <CardDescription>AI-powered recommendations to improve your security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Strong Protection</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your email security is well-configured. All detected threats have been successfully blocked.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">Recommendation</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enable SMS alerts for critical threats to get instant notifications on your phone.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Attention</span>
              </div>
              <p className="text-sm text-muted-foreground">
                65% of threats originate from external domains. Consider implementing stricter domain filtering.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
