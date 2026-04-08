import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Zap, Moon, Globe } from 'lucide-react';

const TOGGLES = (isHe) => [
  { icon: Zap, label: isHe ? 'AI Autopilot — מסחר אוטונומי' : 'AI Autopilot — Autonomous Trading', color: '#10b981', defaultOn: true },
  { icon: Bell, label: isHe ? 'התראות מחיר שיא' : 'Peak Price Alerts', color: '#f59e0b', defaultOn: true },
  { icon: Shield, label: isHe ? 'אישור מכירה ידני' : 'Manual Sale Approval', color: '#3b82f6', defaultOn: false },
  { icon: Moon, label: isHe ? 'מצב לילה — טעינה בלבד' : 'Night Mode — Charge Only', color: '#a78bfa', defaultOn: false },
  { icon: Globe, label: isHe ? 'שיתוף נתוני Noga Grid' : 'Share Noga Grid Data', color: '#34d399', defaultOn: true },
];

function Toggle({ on, onChange, color }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="relative w-10 h-5.5 rounded-full transition-all duration-300"
      style={{ background: on ? color : 'rgba(255,255,255,0.1)', minWidth: 40, height: 22 }}
    >
      <motion.div
        animate={{ x: on ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white"
        style={{ boxShadow: on ? `0 0 6px ${color}` : 'none' }}
      />
    </button>
  );
}

export default function ProSettingsTab({ isHe }) {
  const items = TOGGLES(isHe);
  const [states, setStates] = useState(items.map(i => i.defaultOn));

  return (
    <div className="p-5 space-y-5">
      <h1 className="text-xl font-black text-white">{isHe ? 'הגדרות מערכת' : 'System Settings'}</h1>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(255,255,255,0.08)' }}>
        {items.map(({ icon: Icon, label, color }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: i < items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <span className="text-sm font-bold text-white">{label}</span>
            </div>
            <Toggle on={states[i]} onChange={(v) => setStates(s => s.map((x, j) => j === i ? v : x))} color={color} />
          </motion.div>
        ))}
      </div>

      {/* Version badge */}
      <div className="text-center pt-2">
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>VPP Solar Club Pro · v2.4.1</p>
      </div>
    </div>
  );
}