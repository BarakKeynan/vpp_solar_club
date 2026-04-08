import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Thermometer, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const BATTERIES = [
  { id: 1, type: 'LFP', brand: 'BYD', model: 'Battery-Box Premium', capacity: '10 kWh', soh: 96, temp: 28, cycles: 312, status: 'optimal', voltage: '51.2V' },
  { id: 2, type: 'Li-Ion', brand: 'SolarEdge', model: 'Energy Bank', capacity: '9.7 kWh', soh: 83, temp: 34, cycles: 687, status: 'warning', voltage: '48.0V' },
];

function SohBar({ value }) {
  const color = value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] font-black w-7" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function BatteryHealthCard() {
  const { lang } = useLang();
  const isHe = lang === 'he';

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="bg-card rounded-2xl border border-border p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground">{isHe ? 'בריאות סוללות' : 'Battery Health'}</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#93c5fd' }}>
          {isHe ? 'אבחון AI' : 'AI Diagnostics'}
        </span>
      </div>

      <div className="space-y-3">
        {BATTERIES.map((bat) => (
          <div key={bat.id} className="rounded-xl p-3 space-y-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-black text-foreground">{bat.brand}</span>
                <span className="text-[10px] font-bold text-blue-400">{bat.type}</span>
                <span className="text-[10px] text-muted-foreground">· {bat.capacity}</span>
              </div>
              {bat.status === 'optimal' ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  <span className="text-[9px] font-bold text-emerald-400">{isHe ? 'תקין' : 'Optimal'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                  <span className="text-[9px] font-bold text-amber-400">{isHe ? 'בדיקה נדרשת' : 'Check Required'}</span>
                </div>
              )}
            </div>

            {/* SoH bar */}
            <div>
              <p className="text-[9px] text-muted-foreground mb-1">{isHe ? 'בריאות (SoH)' : 'Health (SoH)'}</p>
              <SohBar value={bat.soh} />
            </div>

            {/* Metrics */}
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <Thermometer className={`w-3 h-3 ${bat.temp > 32 ? 'text-amber-400' : 'text-blue-400'}`} />
                <span className={`text-[10px] font-bold ${bat.temp > 32 ? 'text-amber-400' : 'text-foreground'}`}>{bat.temp}°C</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] font-bold text-foreground">{bat.cycles} {isHe ? 'מחזורים' : 'cycles'}</span>
              </div>
              <div className="text-[10px] font-bold text-muted-foreground">{bat.voltage}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}