import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, Zap } from 'lucide-react';

const SEVERITY_STYLES = {
  critical: {
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.35)',
    badge: { bg: 'rgba(239,68,68,0.2)', color: '#F87171' },
    label: 'קריטי',
    Icon: Zap,
    iconColor: '#F87171',
  },
  warning: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    badge: { bg: 'rgba(245,158,11,0.2)', color: '#FCD34D' },
    label: 'אזהרה',
    Icon: AlertTriangle,
    iconColor: '#FCD34D',
  },
  info: {
    bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.3)',
    badge: { bg: 'rgba(59,130,246,0.18)', color: '#93C5FD' },
    label: 'מידע',
    Icon: Info,
    iconColor: '#93C5FD',
  },
};

export default function AlertCard({ alert, onBook, delay = 0 }) {
  const s = SEVERITY_STYLES[alert.severity];
  const Icon = s.Icon;

  return (
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl shrink-0" style={{ background: `${s.iconColor}18` }}>
          <Icon className="w-4 h-4" style={{ color: s.iconColor }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: s.badge.bg, color: s.badge.color }}
            >
              {s.label}
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{alert.panel}</span>
          </div>
          <p className="text-sm font-black text-white">{alert.title}</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{alert.detail}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>הפסד מוערך</p>
          <p className="text-xs font-black" style={{ color: s.iconColor }}>{alert.estimatedLoss}</p>
        </div>
        <button
          onClick={() => onBook(alert.suggestedService)}
          className="px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 text-white"
          style={{ background: s.iconColor + '22', border: `1px solid ${s.iconColor}50` }}
        >
          הזמן תיקון ←
        </button>
      </div>
    </motion.div>
  );
}