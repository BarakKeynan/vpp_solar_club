import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';

export default function EcoProfitMode() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [ecoData, setEcoData] = useState(null);

  useEffect(() => {
    // Read eco-profit state from AppConfig (written by ecoProfitEngine backend)
    base44.entities.AppConfig.filter({ key: 'eco_profit_state' }).then(configs => {
      const cfg = configs[0];
      if (!cfg?.noga_api_url) return;
      const state = JSON.parse(cfg.noga_api_url);
      setEcoData(state);
    }).catch(() => {});
  }, []);

  // Fallback to latest NogaPrice if AppConfig state not available
  useEffect(() => {
    if (ecoData) return;
    base44.entities.NogaPrice.list('-created_date', 1).then(prices => {
      if (!prices[0]) return;
      const price = prices[0].price;
      const hour = new Date().getHours();
      const isPeak = (hour >= 17 && hour <= 21) || (hour >= 7 && hour <= 9);
      const mode = price >= 0.60 || isPeak ? 'discharging' : price <= 0.48 ? 'charging' : 'standby';
      setEcoData({
        mode,
        current_rate: price,
        peak_hour: isPeak,
        profit_cycle_nis: mode === 'discharging' ? +(price * 2.5).toFixed(2) : 0,
        is_mock: prices[0].is_mock,
      });
    }).catch(() => {});
  }, [ecoData]);

  if (!ecoData) return null;

  const isDischarging = ecoData.mode === 'discharging';
  const isCharging = ecoData.mode === 'charging';
  if (!isDischarging && !isCharging) return null; // standby — don't show

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
            {ecoData.is_mock && <span className="opacity-40 font-normal"> (demo)</span>}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{ background: isDischarging ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)' }}>
          <Zap className="w-2.5 h-2.5" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }} />
          <span className="text-[9px] font-black" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }}>
            ₪{ecoData.current_rate?.toFixed(3)}/kWh
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: isDischarging ? '#f59e0b' : '#10b981' }} />
          <p className="text-xs font-black" style={{ color: isDischarging ? '#fcd34d' : '#6ee7b7' }}>
            {isDischarging
              ? (isHe ? 'חוסך כרגע תעריף שיא' : 'Saving at peak tariff now')
              : (isHe ? 'טוען בתעריף שפל' : 'Charging at off-peak rate')}
          </p>
        </div>
        {ecoData.next_check && (
          <span className="text-[10px] text-white/35 font-bold">
            {isHe ? `עדכון ב-${new Date(ecoData.next_check).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}` : `Next check ${new Date(ecoData.next_check).toLocaleTimeString('en-IL', { hour: '2-digit', minute: '2-digit' })}`}
          </span>
        )}
      </div>

      {ecoData.profit_cycle_nis > 0 && (
        <div className="flex items-center gap-3 pt-1 border-t border-white/5">
          <div>
            <p className="text-[9px] text-white/35">{isHe ? 'רווח מחזור זה' : 'Cycle profit'}</p>
            <p className="text-sm font-black" style={{ color: '#fbbf24' }}>+₪{ecoData.profit_cycle_nis?.toFixed(2)}</p>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[9px] text-white/30 leading-tight">
              {isHe ? 'המערכת נלחמת על כל שקל בשבילך' : 'The system fights for every ₪'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}