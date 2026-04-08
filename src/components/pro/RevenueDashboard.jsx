import React from 'react';
import { motion } from 'framer-motion';
import { PiggyBank, Zap, TrendingUp, DollarSign } from 'lucide-react';

const CARDS = (isHe) => [
  {
    icon: PiggyBank,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)',
    label: isHe ? 'חיסכון חודשי' : 'Monthly Savings',
    value: '₪412',
    sub: isHe ? 'לעומת ₪320 חודש שעבר' : 'vs ₪320 last month',
    change: '+28.7%',
    positive: true,
  },
  {
    icon: Zap,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.2)',
    label: isHe ? 'רווח ממכירת רשת' : 'Profit from Grid Sales',
    value: '₪287',
    sub: isHe ? 'השבוע: ₪68' : 'This week: ₪68',
    change: '+12.1%',
    positive: true,
  },
  {
    icon: TrendingUp,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)',
    label: isHe ? 'ROI מצטבר' : 'Cumulative ROI',
    value: '18.4%',
    sub: isHe ? 'מאז ינואר 2024' : 'Since Jan 2024',
    change: '+2.3%',
    positive: true,
  },
  {
    icon: DollarSign,
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.2)',
    label: isHe ? 'שווי תיק כולל' : 'Total Portfolio Value',
    value: '₪24,800',
    sub: isHe ? '5 נכסים פעילים' : '5 active assets',
    change: '+₪1,200',
    positive: true,
  },
];

export default function RevenueDashboard({ isHe }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CARDS(isHe).map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="rounded-2xl p-4"
            style={{ background: card.bg, border: `1px solid ${card.border}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${card.color}22` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: card.color }} />
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${card.positive ? 'text-emerald-400' : 'text-red-400'}`}
                style={{ background: card.positive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)' }}>
                {card.change}
              </span>
            </div>
            <p className="text-xl font-black text-white">{card.value}</p>
            <p className="text-[10px] font-bold mt-0.5" style={{ color: card.color }}>{card.label}</p>
            <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{card.sub}</p>
          </motion.div>
        );
      })}
    </div>
  );
}