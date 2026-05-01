import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Thermometer, Zap, CheckCircle2, PlusCircle, Wifi, CloudLightning } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';

// Mock: swap this flag to false to see the "no battery" state
const MOCK_BATTERY = {
  detected: true,
  brand: 'Tesla Powerwall 2',
  soc: 85,          // % State of Charge
  powerKw: 2.4,     // positive = charging, negative = discharging
  tempC: 28,
};

function SocBar({ pct }) {
  const color = pct > 60 ? '#10b981' : pct > 25 ? '#f59e0b' : '#ef4444';
  const glow = pct > 60 ? 'rgba(16,185,129,0.4)' : pct > 25 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)';
  return (
    <div className="space-y-1">
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${glow}` }}
        />
      </div>
    </div>
  );
}

export default function PhysicalBatteryStatus() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const bat = MOCK_BATTERY;

  const flowLabel = bat.powerKw > 0
    ? (isHe ? `טעינה · ${bat.powerKw} kW` : `Charging · ${bat.powerKw} kW`)
    : bat.powerKw < 0
    ? (isHe ? `פריקה · ${Math.abs(bat.powerKw)} kW` : `Discharging · ${Math.abs(bat.powerKw)} kW`)
    : (isHe ? 'המתנה' : 'Standby');

  const flowColor = bat.powerKw > 0 ? '#10b981' : bat.powerKw < 0 ? '#60a5fa' : '#9ca3af';

  if (bat.detected) {
    return (
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.22)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400">
              {isHe ? 'סוללה פיזית מזוהה: כן' : 'Physical Battery Detected: Yes'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-400/60" />
            <span className="text-[9px] text-emerald-400/50 font-bold">API ✓</span>
          </div>
        </div>

        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-black text-white">{bat.brand}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Storm guard icon — shown when storm mode is active */}
            <motion.div title="Storm Guard Active" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }}>
              <CloudLightning className="w-3.5 h-3.5 text-violet-400" />
            </motion.div>
            <span className="text-sm font-black text-white">{bat.soc}%</span>
          </div>
        </div>

        {/* SoC bar */}
        <SocBar pct={bat.soc} />

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-2">
          {/* SoC */}
          <div className="rounded-xl py-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-black text-emerald-400">{bat.soc}%</p>
            <p className="text-[9px] text-white/35 mt-0.5">{isHe ? 'טעינה (SoC)' : 'SoC'}</p>
          </div>

          {/* Power */}
          <div className="rounded-xl py-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-black" style={{ color: flowColor }}>
              {bat.powerKw > 0 ? '+' : ''}{bat.powerKw} kW
            </p>
            <p className="text-[9px] text-white/35 mt-0.5">{isHe ? 'הספק' : 'Power'}</p>
          </div>

          {/* Temp */}
          <div className="rounded-xl py-2.5 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-black" style={{ color: bat.tempC > 35 ? '#f59e0b' : '#93c5fd' }}>
              {bat.tempC}°C
            </p>
            <p className="text-[9px] text-white/35 mt-0.5">{isHe ? 'טמפ׳' : 'Temp'}</p>
          </div>
        </div>

        {/* Flow status */}
        <div className="flex items-center gap-2">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: flowColor }} />
          <span className="text-[11px] font-bold" style={{ color: flowColor }}>{flowLabel}</span>
        </div>
      </motion.div>
    );
  }

  // Not detected
  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.2)' }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-sky-400">
            {isHe ? 'סוללה פיזית מזוהה: לא' : 'Physical Battery Detected: No'}
          </span>
          <button onClick={() => setDismissed(true)} className="text-white/20 hover:text-white/50 text-xs">✕</button>
        </div>

        <p className="text-xs text-white/50 leading-relaxed">
          {isHe
            ? 'לא זוהתה סוללה פיזית מחוברת למערכת. חיבור סוללה פיזית יאפשר ניהול אנרגיה מיטבי ומכירה לרשת.'
            : 'No physical battery detected. Connecting one enables optimal energy management and grid sales.'}
        </p>

        <button
          onClick={() => navigate('/onboarding')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.2), rgba(56,189,248,0.1))', border: '1px solid rgba(56,189,248,0.35)' }}
        >
          <PlusCircle className="w-4 h-4 text-sky-400" />
          {isHe ? 'האם יש לך סוללה פיזית שברצונך לחבר?' : 'Do you have a physical battery to connect?'}
        </button>
      </motion.div>
    </AnimatePresence>
  );
}