import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(8,16,36,0.95)', border: '1px solid rgba(56,189,248,0.25)' }}>
      <p className="text-white/50 mb-0.5">{label}</p>
      <p className="font-black text-cyan-300">{payload[0].value.toFixed(3)} ₪/kWh</p>
    </div>
  );
};

export default function PriceChart({ data, peakThreshold }) {
  if (!data?.length) return (
    <div className="h-40 flex items-center justify-center text-xs text-white/30">Loading price data...</div>
  );

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
        <Tooltip content={<CustomTooltip />} />
        {peakThreshold && (
          <ReferenceLine y={peakThreshold} stroke="rgba(245,158,11,0.6)" strokeDasharray="4 3"
            label={{ value: 'TOP 10%', position: 'right', fontSize: 8, fill: '#f59e0b' }} />
        )}
        <Line
          type="monotone"
          dataKey="price"
          stroke="url(#priceGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#38bdf8', stroke: 'rgba(56,189,248,0.3)', strokeWidth: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}