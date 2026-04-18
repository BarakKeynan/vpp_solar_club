import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Sun } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// Simulated energy windows — in production these come from the grid/forecast API
const ENERGY_WINDOWS = [
  {
    id: 'abundance',
    type: 'abundance',
    emoji: '☀️',
    titleHe: 'שעת שפע אנרגטי!',
    titleEn: 'Energy Abundance Window!',
    descHe: 'הסוללה שלך תיטען בחינם ב-30 הדקות הקרובות. זה הזמן להפעיל מכונת כביסה, לחמם דוד שמש, או לטעון את הרכב.',
    descEn: 'Your battery charges for free in the next 30 min. Great time to run the washing machine, heat the boiler, or charge your EV.',
    saving: '₪4.20',
    color: 'from-emerald-500/20 to-emerald-400/5',
    border: 'border-emerald-400/40',
    badge: 'bg-emerald-400/20 text-emerald-300',
    badgeHe: '⚡ חינם עכשיו',
    badgeEn: '⚡ Free Now',
    minutesLeft: 28,
  },
  {
    id: 'price_drop',
    type: 'price_drop',
    emoji: '⚡',
    titleHe: '⚡ חלוץ אנרגיה! מחיר החשמל צנח',
    titleEn: '⚡ Price Drop Alert! Electricity cheap now',
    descHe: 'מחיר החשמל ברשת צנח לשפל יומי. זמן מעולה להפעיל מכשירים כבדים — הסוללה תיטען במקביל במינימום עלות.',
    descEn: 'Grid electricity at daily low. Run heavy appliances now — battery charges simultaneously at minimum cost.',
    saving: '₪6.80',
    color: 'from-blue-500/20 to-blue-400/5',
    border: 'border-blue-400/40',
    badge: 'bg-blue-400/20 text-blue-300',
    badgeHe: '💰 מחיר שפל',
    badgeEn: '💰 Price Drop',
    minutesLeft: 45,
  },
];

export default function SmartEnergyBanner() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [windowIdx, setWindowIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [minutesLeft, setMinutesLeft] = useState(ENERGY_WINDOWS[0].minutesLeft);

  const current = ENERGY_WINDOWS[windowIdx];

  // Cycle windows every 15 seconds for demo
  useEffect(() => {
    const t = setInterval(() => {
      setWindowIdx(i => (i + 1) % ENERGY_WINDOWS.length);
      setMinutesLeft(ENERGY_WINDOWS[(windowIdx + 1) % ENERGY_WINDOWS.length].minutesLeft);
      setDismissed(false);
    }, 15000);
    return () => clearInterval(t);
  }, [windowIdx]);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setMinutesLeft(m => Math.max(0, m - 1)), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className={`relative rounded-2xl border bg-gradient-to-br ${current.color} ${current.border} p-4 overflow-hidden`}
        >
          {/* Pulsing glow */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl"
            style={{ background: current.type === 'abundance' ? 'rgba(16,185,129,0.25)' : 'rgba(59,130,246,0.25)' }}
          />

          <div className="relative">
            {/* Header row */}
            <div className="flex items-start justify-between mb-2">
              <button
                onClick={() => setDismissed(true)}
                className="p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xl">{current.emoji}</span>
                <div className="text-right">
                  <p className="text-sm font-black text-white leading-tight">
                    {isHe ? current.titleHe : current.titleEn}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${current.badge}`}>
                    {isHe ? current.badgeHe : current.badgeEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-[11px] text-white/70 leading-relaxed text-right mb-3">
              {isHe ? current.descHe : current.descEn}
            </p>

            {/* Footer: time + saving */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
                <span className="text-[10px] text-white/40">
                  {isHe ? `עוד ${minutesLeft} דקות` : `${minutesLeft} min left`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40">{isHe ? 'חיסכון צפוי' : 'Est. saving'}</span>
                <span className="text-base font-black text-emerald-400 mr-1">{current.saving}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}