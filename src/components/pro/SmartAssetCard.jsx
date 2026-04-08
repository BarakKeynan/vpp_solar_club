import React from 'react';
import { motion } from 'framer-motion';
import { Battery, CheckCircle2, AlertTriangle, Shield, Thermometer, Activity } from 'lucide-react';

const BATTERIES = [
  {
    id: 1,
    type: 'LFP',
    brand: 'BYD',
    model: 'BYD Battery-Box Premium',
    capacity: '10 kWh',
    soh: 96,
    temp: 28,
    cycles: 312,
    status: 'optimal',
    voltage: '51.2V',
  },
  {
    id: 2,
    type: 'Lithium-Ion',
    brand: 'SolarEdge',
    model: 'SolarEdge Energy Bank',
    capacity: '9.7 kWh',
    soh: 83,
    temp: 34,
    cycles: 687,
    status: 'warning',
    voltage: '48.0V',
  },
];

function SohBar({ value, isHe }) {
  const color = value >= 90 ? '#10b981' : value >= 75 ? '#f59e0b' : '#ef4444';
  const label = value >= 90
    ? (isHe ? 'מצוין' : 'Excellent')
    : value >= 75
    ? (isHe ? 'תקין' : 'Good')
    : (isHe ? 'זיהוי תקלה' : 'Fault Detected');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {isHe ? 'בריאות סוללה (SoH)' : 'Battery Health (SoH)'}
        </span>
        <span className="text-[10px] font-black" style={{ color }}>{label}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})`, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
      <p className="text-base font-black" style={{ color }}>{value}%</p>
    </div>
  );
}

export default function SmartAssetCard({ isHe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-5"
      style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(59,130,246,0.2)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-black text-white">{isHe ? 'נכסי חומרה חכמים' : 'Smart Hardware Assets'}</p>
        <span className="text-[10px] px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
          {isHe ? 'אבחון AI' : 'AI Diagnostics'}
        </span>
      </div>

      <div className="space-y-4">
        {BATTERIES.map((bat) => (
          <div key={bat.id} className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)' }}>
                  <Battery className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">{bat.brand} <span className="text-blue-400">{bat.type}</span></p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{bat.model}</p>
                </div>
              </div>
              {bat.status === 'optimal' ? (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.12)' }}>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400">{isHe ? 'מצוין' : 'Optimal'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400">{isHe ? 'בדיקה נדרשת' : 'Service Required'}</span>
                </div>
              )}
            </div>

            {/* SoH Bar */}
            <SohBar value={bat.soh} isHe={isHe} />

            {/* Metrics row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Thermometer, label: isHe ? 'טמפ׳' : 'Temp', value: `${bat.temp}°C`, warn: bat.temp > 32 },
                { icon: Activity, label: isHe ? 'מחזורים' : 'Cycles', value: bat.cycles, warn: false },
                { icon: Shield, label: isHe ? 'מתח' : 'Voltage', value: bat.voltage, warn: false },
              ].map(({ icon: Icon, label, value, warn }) => (
                <div key={label} className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <Icon className={`w-3 h-3 mx-auto mb-1 ${warn ? 'text-amber-400' : 'text-blue-400'}`} />
                  <p className={`text-xs font-black ${warn ? 'text-amber-400' : 'text-white'}`}>{value}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Maintenance text */}
            <div className="rounded-lg px-3 py-2" style={{ background: bat.status === 'optimal' ? 'rgba(16,185,129,0.07)' : 'rgba(245,158,11,0.07)' }}>
              <p className="text-[10px] font-bold" style={{ color: bat.status === 'optimal' ? '#34d399' : '#fbbf24' }}>
                {bat.status === 'optimal'
                  ? (isHe ? '✓ ביצועים אופטימליים — אין פעולה נדרשת' : '✓ Optimal Performance — No Action Required')
                  : (isHe ? '⚠ שירות נדרש: פנה לטכנאי מערכת' : '⚠ Service Required: Contact System Technician')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}