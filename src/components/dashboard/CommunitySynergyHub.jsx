import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SYNERGY = 84;
const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CommunitySynergyHub() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(SYNERGY), 300);
    return () => clearTimeout(t);
  }, []);

  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl p-5 flex items-center gap-5"
      style={{
        background: 'linear-gradient(135deg, rgba(30,58,138,0.35) 0%, rgba(17,24,39,0.7) 60%, rgba(161,123,0,0.15) 100%)',
        border: '1px solid rgba(59,130,246,0.25)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Ring */}
      <div className="relative shrink-0" style={{ width: 120, height: 120 }}>
        {/* Glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(59,130,246,${0.08 + (progress / 100) * 0.18}) 0%, transparent 70%)`,
          }}
        />
        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="rgba(59,130,246,0.12)"
            strokeWidth="8"
          />
          {/* Progress – Electric Blue → Solar Gold */}
          <motion.circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="url(#synergyGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
          />
          <defs>
            <linearGradient id="synergyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
          {/* Pulse ring */}
          <motion.circle
            cx="60" cy="60" r={RADIUS}
            fill="none"
            stroke="rgba(59,130,246,0.25)"
            strokeWidth="14"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        {/* Center label */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'none' }}
        >
          <span className="text-2xl font-black" style={{ color: '#F59E0B', lineHeight: 1 }}>{SYNERGY}%</span>
          <span className="text-[9px] text-blue-300 font-bold mt-0.5">Synergy</span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1">
        <p className="text-sm font-black text-white leading-tight">Community Synergy</p>
        <p className="text-[11px] text-blue-200 mt-1 leading-relaxed">
          עוד <span className="text-amber-400 font-black">16%</span> מהפעלת תעריף הקבוצה של שכונת חיפה.
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full" style={{ background: 'rgba(59,130,246,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#3B82F6,#F59E0B)' }}
              initial={{ width: 0 }}
              animate={{ width: `${SYNERGY}%` }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <span className="text-[10px] text-blue-300 font-bold shrink-0">84/100</span>
        </div>
        <p className="text-[9px] text-blue-400/70 mt-1.5">Neighborhood Bulk-Rate מחכה</p>
      </div>
    </motion.div>
  );
}