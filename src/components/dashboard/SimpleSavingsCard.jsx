import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

// Battery health gauge — iPhone-style
function BatteryHealthGauge({ soh = 94 }) {
  const color = soh >= 85 ? '#10b981' : soh >= 70 ? '#f59e0b' : '#ef4444';
  const labelHe = soh >= 85 ? 'מצב אופטימלי ✓' : soh >= 70 ? 'מצב טוב' : 'דורש בדיקה';
  const labelEn = soh >= 85 ? 'Optimal ✓' : soh >= 70 ? 'Good' : 'Needs Check';
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (soh / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
          <motion.circle
            cx="48" cy="48" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          />
        </svg>
        <div className="text-center">
          <p className="text-2xl font-black" style={{ color }}>{soh}%</p>
          <p className="text-[9px] text-white/40">SoH</p>
        </div>
      </div>
    </div>
  );
}

export default function SimpleSavingsCard() {
  const { lang } = useLang();
  const isHe = lang === 'he';

  const soh = 94; // State of Health
  const yearsLeft = 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-2xl p-4 space-y-4"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Title */}
      <div className="flex items-center justify-between">
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}
        >
          {isHe ? '🔋 בריאות סוללה' : '🔋 Battery Health'}
        </motion.span>
        <p className="text-xs font-black text-white">
          {isHe ? 'תמונת הסיכום שלך' : 'Your Snapshot'}
        </p>
      </div>

      {/* 2-col layout */}
      <div className="flex items-center gap-4">
        <BatteryHealthGauge soh={soh} />
        <div className="flex-1 space-y-3">
          {/* Savings ILS — not kWh */}
          <div className="rounded-xl p-3"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <p className="text-[9px] text-white/40 text-right">{isHe ? 'חסכת החודש' : 'Saved this month'}</p>
            <p className="text-2xl font-black text-emerald-400 text-right">₪4,230</p>
            <p className="text-[9px] text-emerald-400/50 text-right">{isHe ? 'ממכירה לרשת + בניית עצמי' : 'Grid sales + self-consumption'}</p>
          </div>
          <div className="rounded-xl p-2.5"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <p className="text-[9px] text-white/40 text-right">{isHe ? 'הכנסה מהרשת החודש' : 'Grid income this month'}</p>
            <p className="text-lg font-black text-amber-400 text-right">₪870</p>
          </div>
        </div>
      </div>

      {/* Battery longevity message — no kWh */}
      <div className="rounded-xl p-3 text-center"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[11px] text-white/60 leading-relaxed">
          {isHe
            ? `🔋 הסוללה שלך במצב אופטימלי ומתוכננת להחזיק מעמד עוד ${yearsLeft} שנים תחת הניהול שלנו.`
            : `🔋 Your battery is in optimal condition and expected to last ${yearsLeft} more years under our management.`}
        </p>
      </div>
    </motion.div>
  );
}