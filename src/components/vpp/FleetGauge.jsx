import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Activity } from 'lucide-react';

export default function FleetGauge({ fleetKwh, totalSites, totalPowerKw, avgSoc }) {
  const maxKwh = totalSites ? totalSites * 10 : 50;
  const pct = Math.min((fleetKwh / maxKwh) * 100, 100);

  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 52;
  const strokeDash = `${(pct / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular gauge */}
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          {/* Glow */}
          <circle cx="60" cy="60" r="52" fill="none" stroke={color} strokeWidth="10"
            strokeOpacity="0.15" />
          {/* Value arc */}
          <motion.circle
            cx="60" cy="60" r="52" fill="none"
            stroke={color} strokeWidth="10"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: strokeDash }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            key={fleetKwh}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black"
            style={{ color }}
          >
            {fleetKwh?.toFixed(1) ?? '—'}
          </motion.p>
          <p className="text-[9px] text-white/40 font-bold">kWh</p>
          <p className="text-[8px] text-white/25 mt-0.5">FLEET TOTAL</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          { icon: Battery, label: 'Sites Online', value: totalSites ?? '—', color: '#38bdf8' },
          { icon: Activity, label: 'Avg SoC', value: avgSoc ? `${avgSoc}%` : '—', color: '#10b981' },
          { icon: Zap, label: 'Power Out', value: totalPowerKw ? `${totalPowerKw} kW` : '—', color: '#f59e0b' },
        ].map(({ icon: Icon, label, value, color: c }) => (
          <div key={label} className="rounded-xl p-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: c }} />
            <p className="text-sm font-black text-white">{value}</p>
            <p className="text-[9px] text-white/35 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}