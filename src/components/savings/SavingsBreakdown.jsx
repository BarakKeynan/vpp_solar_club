import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Zap, Battery, Users, ArrowDownLeft } from 'lucide-react';

const ITEMS = [
  {
    key: 'solar_self',
    icon: Sun,
    label: 'ייצור עצמי מהפאנלים',
    desc: 'חשמל שייצרת ולא קנית מהרשת',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
    value: (d) => d.solar_self,
  },
  {
    key: 'grid_sell',
    icon: Zap,
    label: 'מכירה לרשת (FIT)',
    desc: 'הכנסה ממכירת עודפים בשעות שיא',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
    value: (d) => d.grid_sell,
  },
  {
    key: 'battery_arb',
    icon: Battery,
    label: 'ארביטראז׳ סוללה',
    desc: 'קנייה בזול, מכירה/שימוש ביוקר',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)',
    value: (d) => d.battery_arb,
  },
  {
    key: 'vpp_club',
    icon: Users,
    label: 'VPP Solar Club',
    desc: 'רווח מהשתתפות בצי הווירטואלי',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.25)',
    value: (d) => d.vpp_club,
  },
  {
    key: 'peak_avoid',
    icon: ArrowDownLeft,
    label: 'הימנעות משעות שיא',
    desc: 'הזזת צריכה לשעות זולות',
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.1)',
    border: 'rgba(236,72,153,0.25)',
    value: (d) => d.peak_avoid,
  },
];

export default function SavingsBreakdown({ data, total, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <p className="text-xs font-black text-white/40 uppercase tracking-widest">פירוט חיסכון</p>

      <div className="space-y-2.5">
        {ITEMS.map((item, i) => {
          const val = data ? item.value(data) : 0;
          const pct = total > 0 ? (val / total) * 100 : 0;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-xl shrink-0" style={{ background: item.bg, border: `1px solid ${item.border}` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white/80">{item.label}</span>
                  {loading ? (
                    <div className="h-4 w-12 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.07)' }} />
                  ) : (
                    <span className="text-xs font-black" style={{ color: item.color }}>+{val.toLocaleString('he-IL')} ₪</span>
                  )}
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: loading ? '0%' : `${pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 + i * 0.07 }}
                  />
                </div>
                <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}