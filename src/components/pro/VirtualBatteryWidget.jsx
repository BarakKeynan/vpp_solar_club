import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

export default function VirtualBatteryWidget({ isHe }) {
  const [pct] = useState(72);
  const [value] = useState(1840);

  const R = 52;
  const circ = 2 * Math.PI * R;
  const filled = (pct / 100) * circ;

  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 col-span-2"
      style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(16,185,129,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {isHe ? 'מאגר אחסון קהילתי' : 'Community Storage Balance'}
          </p>
          <p className="text-lg font-black text-white mt-0.5">{isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}</p>
        </div>
        <div className="px-3 py-1.5 rounded-full flex items-center gap-2" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400">LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* SVG Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="132" height="132" viewBox="0 0 132 132">
            {/* Track */}
            <circle cx="66" cy="66" r={R} fill="none" strokeWidth="10" stroke="rgba(255,255,255,0.06)" />
            {/* Progress */}
            <circle
              cx="66" cy="66" r={R}
              fill="none"
              strokeWidth="10"
              stroke={color}
              strokeDasharray={`${filled} ${circ}`}
              strokeDashoffset={circ * 0.25}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dasharray 1s ease' }}
              transform="rotate(-90 66 66)"
            />
            {/* Glow ring */}
            <circle cx="66" cy="66" r={R - 14} fill="rgba(16,185,129,0.04)" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{pct}%</span>
            <span className="text-[10px] font-bold" style={{ color }}>{isHe ? 'מטעון' : 'Charged'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'קיבולת נוכחית' : 'Current Capacity'}</p>
            <p className="text-xl font-black text-white mt-0.5">18.4 <span className="text-sm text-emerald-400">kWh</span></p>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'שווי שוק' : 'Market Value'}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xl font-black text-white">₪{value.toLocaleString()}</p>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)' }}>
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-400">+4.2%</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-[9px] font-bold text-blue-400">{isHe ? 'תעריף נוכחי' : 'Current Rate'}</p>
              <p className="text-sm font-black text-white">₪0.54<span className="text-[9px] text-white/40">/kWh</span></p>
            </div>
            <div className="flex-1 rounded-xl p-2.5 text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-[9px] font-bold text-amber-400">{isHe ? 'שיא היום' : "Today's Peak"}</p>
              <p className="text-sm font-black text-white">₪0.89<span className="text-[9px] text-white/40">/kWh</span></p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}