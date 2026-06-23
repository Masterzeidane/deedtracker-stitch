'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ActivityDay } from '@/types'

const BRANCH_COLORS = {
  worship: '#4edea3',
  knowledge: '#60a5fa',
  discipline: '#ffb95f',
  character: '#c084fc',
  charity: '#ffb3af',
}

interface ActivityChartProps {
  data: ActivityDay[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const weeklyActivity = data
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(23, 31, 51, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-sm font-semibold text-[#dae2fd] mb-4"
        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
      >
        Weekly Activity
      </h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={weeklyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {Object.entries(BRANCH_COLORS).map(([branch, color]) => (
              <linearGradient key={branch} id={`grad-${branch}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#86948a', fontSize: 11, fontFamily: 'var(--font-jetbrains), monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#86948a', fontSize: 10, fontFamily: 'var(--font-jetbrains), monospace' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#222a3d',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: '#dae2fd',
              fontSize: 12,
              fontFamily: 'var(--font-jetbrains), monospace',
            }}
            labelStyle={{ color: '#4edea3', fontFamily: 'var(--font-sora), sans-serif', fontWeight: 600 }}
          />
          {Object.entries(BRANCH_COLORS).map(([branch, color]) => (
            <Area
              key={branch}
              type="monotone"
              dataKey={branch}
              stackId="1"
              stroke={color}
              fill={`url(#grad-${branch})`}
              strokeWidth={1.5}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
