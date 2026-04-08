import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sun, Thermometer, Wifi } from 'lucide-react';

const STATUS = (isHe) => [
  {
    icon: Cpu,
    label: isHe ? 'ממיר SolarEdge' : 'SolarEdge Inverter',
    value: isHe ? '41°C — תקין' : '41°C — Normal',
    pct: 82,
    color: '#10b981',
    detail: isHe ? 'טמפרטורה' : 'Temperature',
  },
  {
    icon: Sun,
    label: isHe ? 'יעילות פאנלים' : 'Panel Efficiency',
    value: '91%',
    pct: 91,
    color: '#f59e0b',
    detail: isHe ? '24 פאנלים פעילים' : '24 panels active',
  },
  {
    icon: Wifi,
    label: isHe ? 'חיבור מונה חכם' : 'Smart Meter Link',
    value: isHe ? 'מחובר' : 'Connected',
    pct: 100,
    color: '#3b82f6',
    detail: isHe ? 'Noga Data Hub' : 'Noga Data Hub',
  },
  {
    icon: Thermometer,
    label: isHe ? 'טמפ׳ סביבה' : 'Ambient Temp',
    value: '27°C',
    pct: 55,
    color: '#a78bfa',
    detail: isHe ? 'לחות: 48%' : 'Humidity: 48%',
  },
];

export default function HardwareStatus({ isHe }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-5"
      style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-sm font-black text-white mb-4">{isHe ? 'סטטוס חומרה' : 'Hardware Status'}</p>
      <div className="space-y-4">
        {STATUS(isHe).map(({ icon: Icon, label, value, pct, color, detail }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color }} />
                <span className="text-xs font-bold text-white">{label}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black" style={{ color }}>{value}</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}60` }}
              />
            </div>
            <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{detail}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}