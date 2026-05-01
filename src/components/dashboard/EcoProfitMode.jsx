import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// Mock ToU tariff data — in production synced with IEC tariff API
const ECO_DATA = {
  active: true,
  mode: 'discharging', // 'discharging' | 'charging'
  currentRate: 0.72,   // ₪/kWh
  peakHour: true,
  profitToday: 34.2,
  profitMonth: 187,
  nextAction: '20:30', // when mode will switch
};

export default function EcoProfitMode() {
  const { lang } = useLang();
  const isHe = lang === 'he';

  if (!ECO_DATA.active) return null;

  const isDischarging = ECO_DATA.mode === 'discharging';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl px-4 py-3 space-y-2"
      style={{
        background: isDischarging
          ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.05))'
          : 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))',
        border: `1px solid ${isDischarging ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.25)'}`,
      }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: isDischarging ? '#f59e0b' : '#10b981' }}
          />
          <span className="text-[10px] font-black" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }}>
            {isHe ? 'חיסכון חכם פעיל 💰' : 'Eco-Profit Active 💰'}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: isDischarging ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)' }}>
          <Zap className="w-2.5 h-2.5" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }} />
          <span className="text-[9px] font-black" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }}>
            ₪{ECO_DATA.currentRate}/kWh
          </span>
        </div>
      </div>

      {/* Status line */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: isDischarging ? '#f59e0b' : '#10b981' }} />
          <p className="text-xs font-black" style={{ color: isDischarging ? '#fcd34d' : '#6ee7b7' }}>
            {isDischarging
              ? (isHe ? 'חוסך כרגע תעריף שיא' : 'Saving at peak tariff now')
              : (isHe ? 'טוען בתעריף שפל' : 'Charging at off-peak rate')}
          </p>
        </div>
        <span className="text-[10px] text-white/35 font-bold">
          {isHe ? `מתחלף ב-${ECO_DATA.nextAction}` : `Switches at ${ECO_DATA.nextAction}`}
        </span>
      </div>

      {/* Profit row */}
      <div className="flex items-center gap-3 pt-1 border-t border-white/5">
        <div>
          <p className="text-[9px] text-white/35">{isHe ? 'רווח חכם היום' : 'Smart profit today'}</p>
          <p className="text-sm font-black" style={{ color: '#fbbf24' }}>+₪{ECO_DATA.profitToday.toFixed(1)}</p>
        </div>
        <div className="w-px h-6 bg-white/10" />
        <div>
          <p className="text-[9px] text-white/35">{isHe ? 'החודש' : 'This month'}</p>
          <p className="text-sm font-black" style={{ color: '#10b981' }}>+₪{ECO_DATA.profitMonth}</p>
        </div>
        <div className="flex-1 text-left">
          <p className="text-[9px] text-white/30 leading-tight">
            {isHe
              ? 'המערכת נלחמת על כל שקל בשבילך'
              : 'The system fights for every ₪'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}