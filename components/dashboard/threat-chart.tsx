'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ThreatTrend } from '@/lib/types'

interface ThreatChartProps {
  data: ThreatTrend[]
}

export function ThreatChart({ data }: ThreatChartProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Threat Activity</CardTitle>
        <CardDescription>Daily threat detection over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.65 0.18 145)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
              <XAxis 
                dataKey="date" 
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis 
                stroke="oklch(0.65 0 0)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.15 0.01 250)',
                  border: '1px solid oklch(0.28 0.02 250)',
                  borderRadius: '8px',
                  color: 'oklch(0.95 0 0)',
                }}
                labelStyle={{ color: 'oklch(0.95 0 0)' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span style={{ color: 'oklch(0.95 0 0)', fontSize: '12px' }}>{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="low"
                name="Low Risk"
                stackId="1"
                stroke="oklch(0.65 0.18 145)"
                fill="url(#colorLow)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="medium"
                name="Medium Risk"
                stackId="1"
                stroke="oklch(0.75 0.18 85)"
                fill="url(#colorMedium)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="high"
                name="High Risk"
                stackId="1"
                stroke="oklch(0.55 0.22 25)"
                fill="url(#colorHigh)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
