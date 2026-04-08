import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { BrainCircuit, TrendingUp, ArrowUpRight } from 'lucide-react';

const DATA = [
  { time: '00:00', price: 0.32, sold: 0, ai: false },
  { time: '02:00', price: 0.29, sold: 0, ai: false },
  { time: '04:00', price: 0.27, sold: 0, ai: false },
  { time: '06:00', price: 0.35, sold: 0, ai: false },
  { time: '08:00', price: 0.41, sold: 2.1, ai: false },
  { time: '10:00', price: 0.48, sold: 3.8, ai: true },
  { time: '12:00', price: 0.52, sold: 4.2, ai: true },
  { time: '14:00', price: 0.55, sold: 5.1, ai: true },
  { time: '16:00', price: 0.61, sold: 6.4, ai: true },
  { time: '18:00', price: 0.89, sold: 9.2, ai: true },
  { time: '20:00', price: 0.84, sold: 8.7, ai: true },
  { time: '22:00', price: 0.63, sold: 5.5, ai: true },
];

const TRADES = [
  { time: '18:12', kwh: 4.8, rate: 0.89, profit: 148, isHe: false },
  { time: '16:45', kwh: 3.2, rate: 0.79, profit: 87, isHe: false },
  { time: '14:30', kwh: 2.5, rate: 0.63, profit: 52, isHe: false },
];

const CustomTooltip = ({ active, payload, label, isHe }) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="rounded-xl p-3 text-xs space-y-1" style={{ background: '#0d1829', border: '1px solid rgba(16,185,129,0.3)' }}>
        <p className="font-black text-white">{label}</p>
        <p style={{ color: '#10b981' }}>₪{d.price}/kWh</p>
        {d.sold > 0 && <p style={{ color: '#3b82f6' }}>{isHe ? 'נמכר:' : 'Sold:'} {d.sold} kWh</p>}
        {d.ai && <p className="text-emerald-400 font-bold">⚡ AI {isHe ? 'פעל' : 'Triggered'}</p>}
      </div>
    );
  }
  return null;
};

export default function AIArbitrageTracker({ isHe }) {
  const totalProfit = TRADES.reduce((s, t) => s + t.profit, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-5 col-span-2"
      style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(16,185,129,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white">{isHe ? 'מעקב ארביטראז׳ AI' : 'AI Arbitrage Tracker'}</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'מכירות בשעות שיא — אופטימיזציה אוטומטית' : 'Peak-hour selling — auto-optimized ROI'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black text-emerald-400">+₪{totalProfit}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{isHe ? 'רווח היום' : "Today's profit"}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="soldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip isHe={isHe} />} />
          <ReferenceLine y={0.65} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.6} label={{ value: isHe ? 'סף שיא' : 'Peak threshold', fill: '#f59e0b', fontSize: 9 }} />
          <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
          <Area type="monotone" dataKey="sold" stroke="#3b82f6" strokeWidth={1.5} fill="url(#soldGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex gap-4 mt-2 mb-4">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-emerald-400" /><span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'מחיר רשת' : 'Grid price'}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-blue-400" /><span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'כמות מכורה' : 'kWh sold'}</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-amber-400" style={{ borderTop: '1px dashed' }} /><span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'סף שיא' : 'Peak threshold'}</span></div>
      </div>

      {/* Recent trades */}
      <p className="text-[10px] font-black mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{isHe ? 'עסקאות אחרונות' : 'Recent Trades'}</p>
      <div className="space-y-2">
        {TRADES.map((t, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)' }}>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-white">{t.time}</span>
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.kwh} kWh @ ₪{t.rate}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-xs font-black text-emerald-400">+₪{t.profit}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}