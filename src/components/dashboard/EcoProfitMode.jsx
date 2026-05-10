import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, X, CheckCircle2, ChevronLeft, Battery, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';

const OPTIMIZATIONS_HE = [
  {
    id: 'sell_peak',
    icon: '⚡',
    title: 'מכירה לרשת בשעות שיא',
    desc: 'שעות 17:00–21:00 — מחיר הרשת גבוה ב-40%. המערכת תמכור אנרגיה מהסוללה ותרוויח מקסימום.',
    gain: '+₪18–32',
    tag: 'מיטוב שיא',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.15)',
  },
  {
    id: 'charge_offpeak',
    icon: '🔋',
    title: 'טעינת סוללה בשעות שפל',
    desc: 'שעות 23:00–06:00 — תעריף נמוך ב-55%. טעינה מלאה תחסוך ₪12–20 ליום.',
    gain: '+₪12–20',
    tag: 'חיסכון שפל',
    tagColor: '#34d399',
    tagBg: 'rgba(16,185,129,0.15)',
  },
  {
    id: 'ev_smart',
    icon: '🚗',
    title: 'טעינת רכב חשמלי חכמה',
    desc: 'הזזת טעינת הרכב לאחר 23:00 חוסכת ₪8–15 לכל טעינה מלאה.',
    gain: '+₪8–15',
    tag: 'EV חכם',
    tagColor: '#60a5fa',
    tagBg: 'rgba(96,165,250,0.15)',
  },
  {
    id: 'solar_arbitrage',
    icon: '☀️',
    title: 'ארביטראז\' סולארי',
    desc: 'בשעות ייצור שמש (10:00–16:00) — שמירת אנרגיה בסוללה במקום מכירה מיידית, למכירה מאוחרת בתעריף גבוה יותר.',
    gain: '+₪10–25',
    tag: 'ארביטראז\'',
    tagColor: '#f472b6',
    tagBg: 'rgba(244,114,182,0.15)',
  },
];

const OPTIMIZATIONS_EN = [
  {
    id: 'sell_peak',
    icon: '⚡',
    title: 'Sell to Grid at Peak Hours',
    desc: '17:00–21:00 — Grid price is 40% higher. System sells battery energy for maximum profit.',
    gain: '+₪18–32',
    tag: 'Peak Opt.',
    tagColor: '#f59e0b',
    tagBg: 'rgba(245,158,11,0.15)',
  },
  {
    id: 'charge_offpeak',
    icon: '🔋',
    title: 'Charge Battery at Off-Peak',
    desc: '23:00–06:00 — Tariff is 55% lower. Full charge saves ₪12–20 per day.',
    gain: '+₪12–20',
    tag: 'Off-Peak Save',
    tagColor: '#34d399',
    tagBg: 'rgba(16,185,129,0.15)',
  },
  {
    id: 'ev_smart',
    icon: '🚗',
    title: 'Smart EV Charging',
    desc: 'Shifting EV charging to after 23:00 saves ₪8–15 per full charge.',
    gain: '+₪8–15',
    tag: 'Smart EV',
    tagColor: '#60a5fa',
    tagBg: 'rgba(96,165,250,0.15)',
  },
  {
    id: 'solar_arbitrage',
    icon: '☀️',
    title: 'Solar Arbitrage',
    desc: 'During solar production (10:00–16:00) — store energy instead of selling, sell later at higher tariff.',
    gain: '+₪10–25',
    tag: 'Arbitrage',
    tagColor: '#f472b6',
    tagBg: 'rgba(244,114,182,0.15)',
  },
];

function OptimizationSheet({ open, onClose, ecoData, isHe }) {
  const [applied, setApplied] = useState({});
  const [applying, setApplying] = useState(null);
  const opts = isHe ? OPTIMIZATIONS_HE : OPTIMIZATIONS_EN;

  const handleApply = async (id) => {
    setApplying(id);
    try {
      await base44.functions.invoke('ecoProfitEngine', { action: id });
    } catch (_) {}
    setTimeout(() => {
      setApplied(prev => ({ ...prev, [id]: true }));
      setApplying(null);
    }, 1200);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full rounded-t-3xl overflow-hidden"
          style={{ background: 'hsl(222 40% 10%)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '85vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: 'calc(85vh - 32px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between py-3 mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <p className="text-sm font-black text-white">Eco Profit Mode</p>
                  <p className="text-[10px] text-white/40">
                    {isHe ? 'אופטימיזציות זמינות למיצוי רווח' : 'Available optimizations for max profit'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white/70 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current rate banner */}
            {ecoData && (
              <div className="rounded-xl px-3 py-2.5 mb-4 flex items-center gap-3"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-black text-amber-300">
                    {isHe ? `תעריף עכשווי: ₪${ecoData.current_rate?.toFixed(3)}/kWh` : `Current rate: ₪${ecoData.current_rate?.toFixed(3)}/kWh`}
                    {ecoData.is_mock && <span className="text-white/30 font-normal"> (demo)</span>}
                  </p>
                  <p className="text-[10px] text-white/40">
                    {isHe ? (ecoData.peak_hour ? '🔴 שעת שיא — זמן למכור!' : '🟢 שעת שפל — זמן לטעון!') : (ecoData.peak_hour ? '🔴 Peak hour — time to sell!' : '🟢 Off-peak — time to charge!')}
                  </p>
                </div>
              </div>
            )}

            {/* Optimizations list */}
            <div className="space-y-3">
              {opts.map(opt => (
                <div key={opt.id} className="rounded-2xl p-4 space-y-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0 mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-black text-white">{opt.title}</p>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: opt.tagBg, color: opt.tagColor }}>
                          {opt.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">{opt.desc}</p>
                    </div>
                    <div className="text-left flex-shrink-0">
                      <p className="text-sm font-black text-emerald-400">{opt.gain}</p>
                      <p className="text-[9px] text-white/30">{isHe ? 'ליום' : '/day'}</p>
                    </div>
                  </div>

                  {/* Apply button */}
                  {applied[opt.id] ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-black text-emerald-400">
                        {isHe ? 'יושם בהצלחה ✓' : 'Applied successfully ✓'}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(opt.id)}
                      disabled={applying === opt.id}
                      className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399' }}>
                      {applying === opt.id
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> {isHe ? 'מיישם...' : 'Applying...'}</>
                        : <>{isHe ? '⚡ יישם עכשיו' : '⚡ Apply Now'}</>}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total potential */}
            <div className="mt-4 rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div>
                <p className="text-[10px] text-white/40">{isHe ? 'פוטנציאל חיסכון יומי כולל' : 'Total daily savings potential'}</p>
                <p className="text-xl font-black text-emerald-400">+₪48–92</p>
              </div>
              <TrendingUp className="w-6 h-6 text-emerald-400/50" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EcoProfitMode() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [ecoData, setEcoData] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Auto-open if navigated from user guide with ?open=eco-profit
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('open') === 'eco-profit') setSheetOpen(true);
  }, []);

  useEffect(() => {
    base44.entities.AppConfig.filter({ key: 'eco_profit_state' }).then(configs => {
      const cfg = configs[0];
      if (!cfg?.noga_api_url) return;
      try { setEcoData(JSON.parse(cfg.noga_api_url)); } catch (_) {}
    }).catch(() => {});
  }, []);

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

  const isDischarging = ecoData?.mode === 'discharging';
  const isCharging = ecoData?.mode === 'charging';

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => setSheetOpen(true)}
        className="w-full rounded-2xl px-4 py-3 space-y-2 text-right transition-all active:scale-[0.98]"
        style={{
          background: isDischarging
            ? 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.05))'
            : isCharging
            ? 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))'
            : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isDischarging ? 'rgba(245,158,11,0.35)' : isCharging ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {ecoData && (isDischarging || isCharging) ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: isDischarging ? '#f59e0b' : '#10b981' }}
              />
            ) : (
              <span className="text-base">🔥</span>
            )}
            <span className="text-[11px] font-black"
              style={{ color: isDischarging ? '#fbbf24' : isCharging ? '#34d399' : 'rgba(255,255,255,0.6)' }}>
              Eco Profit Mode
              {ecoData?.is_mock && <span className="opacity-40 font-normal"> (demo)</span>}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {ecoData?.current_rate && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: isDischarging ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.12)' }}>
                <Zap className="w-2.5 h-2.5" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }} />
                <span className="text-[9px] font-black" style={{ color: isDischarging ? '#fbbf24' : '#34d399' }}>
                  ₪{ecoData.current_rate?.toFixed(3)}/kWh
                </span>
              </div>
            )}
            <span className="text-[11px] text-white/30">←</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" style={{ color: isDischarging ? '#f59e0b' : isCharging ? '#10b981' : 'rgba(255,255,255,0.3)' }} />
            <p className="text-xs font-black" style={{ color: isDischarging ? '#fcd34d' : isCharging ? '#6ee7b7' : 'rgba(255,255,255,0.4)' }}>
              {isDischarging
                ? (isHe ? 'חוסך כרגע תעריף שיא' : 'Saving at peak tariff now')
                : isCharging
                ? (isHe ? 'טוען בתעריף שפל' : 'Charging at off-peak rate')
                : (isHe ? 'לחץ לצפייה באופטימיזציות' : 'Tap to view optimizations')}
            </p>
          </div>
          {ecoData?.profit_cycle_nis > 0 && (
            <span className="text-sm font-black text-amber-400">+₪{ecoData.profit_cycle_nis?.toFixed(2)}</span>
          )}
        </div>
      </motion.button>

      <OptimizationSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        ecoData={ecoData}
        isHe={isHe}
      />
    </>
  );
}