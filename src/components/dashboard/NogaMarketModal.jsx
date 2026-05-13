import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Zap, Sun, BarChart2, Activity } from 'lucide-react';

// Mock market data — in future can be replaced with real API calls
function useMarketData(nogaPrice) {
  const base = nogaPrice?.price || 0.663;
  const prevHour = +(base * (1 - (Math.random() * 0.06 - 0.03))).toFixed(3);
  return {
    smp: { value: base, prev: prevHour },
    mcp: { value: +(base * 0.94).toFixed(3), prev: +(base * 0.92).toFixed(3) },
    demand: { value: 7840, prev: 7620, unit: 'MW' },
    mix: { solar: 38, fossil: 52, other: 10 },
  };
}

function TrendBadge({ current, prev, unit = '₪' }) {
  const [showTrend, setShowTrend] = useState(false);
  const up = current >= prev;
  const diff = Math.abs(current - prev).toFixed(unit === 'MW' ? 0 : 3);

  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        onClick={e => { e.stopPropagation(); setShowTrend(v => !v); }}
        className="flex items-center gap-0.5 transition-all active:scale-90"
      >
        {up
          ? <TrendingUp className="w-3.5 h-3.5" style={{ color: '#34d399' }} />
          : <TrendingDown className="w-3.5 h-3.5" style={{ color: '#f87171' }} />}
      </button>
      <AnimatePresence>
        {showTrend && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="absolute bottom-full mb-1 right-0 z-50 px-2.5 py-1.5 rounded-xl text-[10px] font-black whitespace-nowrap"
            style={{
              background: 'rgba(18,18,18,0.97)',
              border: `1px solid ${up ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}`,
              boxShadow: `0 4px 20px ${up ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)'}`,
              color: up ? '#34d399' : '#f87171',
            }}
          >
            {up ? '▲' : '▼'} {diff} {unit} {up ? 'vs שעה קודמת' : 'vs שעה קודמת'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const CARDS = (data, lang) => [
  {
    icon: <Zap className="w-4 h-4" style={{ color: '#D4AF37' }} />,
    labelHe: 'מחיר שוק SMP',
    labelEn: 'System Marginal Price',
    value: `₪${data.smp.value.toFixed(3)}`,
    valueColor: data.smp.value >= 0.6 ? '#f59e0b' : '#34d399',
    trend: <TrendBadge current={data.smp.value} prev={data.smp.prev} />,
    sub: lang === 'he' ? 'לפריקת סוללה מיידית' : 'For immediate discharge',
  },
  {
    icon: <BarChart2 className="w-4 h-4" style={{ color: '#60a5fa' }} />,
    labelHe: 'מחיר סליקה MCP',
    labelEn: 'Market Clearing Price',
    value: `₪${data.mcp.value.toFixed(3)}`,
    valueColor: '#60a5fa',
    trend: <TrendBadge current={data.mcp.value} prev={data.mcp.prev} />,
    sub: lang === 'he' ? 'לתכנון מחזור טעינה' : 'Day-ahead planning',
  },
  {
    icon: <Activity className="w-4 h-4" style={{ color: '#a78bfa' }} />,
    labelHe: 'תחזית ביקוש',
    labelEn: 'Demand Forecast',
    value: `${data.demand.value.toLocaleString()} MW`,
    valueColor: data.demand.value > 7500 ? '#f59e0b' : '#34d399',
    trend: <TrendBadge current={data.demand.value} prev={data.demand.prev} unit="MW" />,
    sub: lang === 'he' ? 'עומס רשת ארצי' : 'National grid load',
  },
  {
    icon: <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} />,
    labelHe: 'תמהיל ייצור',
    labelEn: 'Production Mix',
    value: `${data.mix.solar}% ☀️`,
    valueColor: '#fbbf24',
    trend: null,
    sub: lang === 'he' ? `${data.mix.fossil}% גז · ${data.mix.other}% אחר` : `${data.mix.fossil}% gas · ${data.mix.other}% other`,
    extra: (
      <div className="mt-1.5 h-1.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div style={{ width: `${data.mix.solar}%`, background: '#fbbf24' }} />
        <div style={{ width: `${data.mix.fossil}%`, background: '#6b7280' }} />
        <div style={{ width: `${data.mix.other}%`, background: '#60a5fa' }} />
      </div>
    ),
  },
];

export default function NogaMarketModal({ open, onClose, nogaPrice, lang = 'he' }) {
  const data = useMarketData(nogaPrice);
  const cards = CARDS(data, lang);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl p-5"
            style={{
              background: 'rgba(12,18,14,0.92)',
              border: '1px solid rgba(212,175,55,0.45)',
              boxShadow: '0 0 60px rgba(212,175,55,0.12), 0 20px 60px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(24px)',
              direction: lang === 'he' ? 'rtl' : 'ltr',
              maxWidth: 420,
              margin: '0 auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
              <div className="text-right flex-1 mx-3">
                <p className="text-sm font-black text-white">נתוני שוק בזמן אמת</p>
                <p className="text-[10px] font-bold" style={{ color: 'rgba(212,175,55,0.7)' }}>
                  Noga ISO · {lang === 'he' ? 'עדכון אחרון' : 'Last update'}: {new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400">Live</span>
              </div>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {cards.map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24, delay: i * 0.07 }}
                  className="rounded-2xl p-3.5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(212,175,55,0.15)',
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {card.icon}
                    {card.trend}
                  </div>
                  <p className="text-[10px] font-black text-white/50 leading-tight">{card.labelHe}</p>
                  <p className="text-[9px] text-white/25 mb-2">{card.labelEn}</p>
                  <p className="text-xl font-black leading-none" style={{ color: card.valueColor }}>
                    {card.value}
                  </p>
                  {card.extra}
                  <p className="text-[9px] text-white/30 mt-1.5">{card.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 rounded-xl px-3 py-2.5"
              style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <p className="text-[10px] text-white/40 leading-relaxed text-center">
                המערכת מבצעת אופטימיזציה של פריקה וטעינה בהתבסס על נתונים אלו למקסום רווחים
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}