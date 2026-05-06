import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar, Award } from 'lucide-react';

export default function SavingsROI({ monthlySaved }) {
  const annual = monthlySaved * 12;
  const systemCost = 45000; // typical system cost in NIS
  const roiYears = systemCost > 0 ? (systemCost / annual).toFixed(1) : '—';

  const milestones = [
    { label: 'החודש', value: `+${monthlySaved.toLocaleString('he-IL')} ₪`, icon: '📅', color: '#10B981' },
    { label: 'תחזית שנתית', value: `+${annual.toLocaleString('he-IL')} ₪`, icon: '📈', color: '#3B82F6' },
    { label: 'החזר השקעה', value: `${roiYears} שנים`, icon: '🎯', color: '#8B5CF6' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="text-xs font-black text-white/40 uppercase tracking-widest">תחזית ו-ROI</p>

      <div className="grid grid-cols-3 gap-2">
        {milestones.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.08 }}
            className="rounded-2xl p-3 text-center space-y-1"
            style={{ background: `${m.color}10`, border: `1px solid ${m.color}30` }}
          >
            <span className="text-xl">{m.icon}</span>
            <p className="text-[10px] font-black" style={{ color: m.color }}>{m.value}</p>
            <p className="text-[9px] text-white/35 leading-tight">{m.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress toward annual goal */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-white/40 font-bold">
          <span>התקדמות ליעד שנתי</span>
          <span className="text-white/60">{Math.round((monthlySaved / (annual / 12)) * (new Date().getMonth() + 1) / 12 * 100)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #8B5CF6, #3B82F6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(((new Date().getMonth() + 1) / 12) * 100, 100)}%` }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.4 }}
          />
        </div>
        <p className="text-[10px] text-white/25">
          {new Date().getMonth() + 1} מתוך 12 חודשים — יעד: {annual.toLocaleString('he-IL')} ₪/שנה
        </p>
      </div>
    </motion.div>
  );
}