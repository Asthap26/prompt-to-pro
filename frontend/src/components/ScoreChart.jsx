import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ScoreChart({ data = [] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.4)" 
            fontSize={11}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.4)" 
            fontSize={11}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              background: '#090d16', 
              border: '1px solid rgba(16, 185, 129, 0.25)', 
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px'
            }} 
            labelClassName="text-slate-400"
          />
          <Line 
            type="monotone" 
            dataKey="score" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#090d16', stroke: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#10b981', stroke: '#34d399', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
