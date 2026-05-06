import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const MONTH_DATA = [
  { day: '1', saved: 110 },
  { day: '5', saved: 340 },
  { day: '10', saved: 680 },
  { day: '15', saved: 1050 },
  { day: '20', saved: 1580 },
  { day: '25', saved: 2200 },
  { day: '30', saved: 2870 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs"
      style={{ background: 'hsl(222 40% 10%)', border: '1px solid rgba(16,185,129,0.3)' }}>
      <p className="text-white/40 mb-0.5">יום {label}</p>
      <p className="font-black text-emerald-400">+{payload[0].value.toLocaleString('he-IL')} ₪</p>
    </div>
  );
};

export default function SavingsMonthChart({ totalSaved }) {
  // Scale mock data to match actual total
  const scale = totalSaved > 0 ? totalSaved / 2870 : 1;
  const scaledData = MONTH_DATA.map(d => ({ ...d, saved: Math.round(d.saved * scale) }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-black text-white/40 uppercase tracking-widest">צבירת חיסכון החודש</p>
        <span className="text-[11px] font-black text-emerald-400">
          +{totalSaved.toLocaleString('he-IL')} ₪
        </span>
      </div>
      <ResponsiveContainer width="100%" height={130}>
        <AreaChart data={scaledData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="saved"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#savGrad)"
            dot={false}
            activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}