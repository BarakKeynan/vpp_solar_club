import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Leaf } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// Simulated real-time club stats
const STATS = {
  co2_tons: 1.2,
  trees_equiv: 50,
  kw_injected: 200,
  peak_hour: '17:00',
  members_active: 143,
  total_saved_ils: 8420,
};

export default function CommunityImpactCard() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [open, setOpen] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
        style={{
          background: open
            ? 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,197,94,0.06))'
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.2)'}`,
          boxShadow: open ? '0 0 24px rgba(16,185,129,0.12)' : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-xl blur-md"
              style={{ background: 'rgba(16,185,129,0.3)' }}
            />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
              🌍
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white leading-tight">
              {isHe ? 'השפעת הקהילה היום' : "Club's Daily Impact"}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">
              {isHe
                ? `${STATS.members_active} חברים פעילים · מנעו ${STATS.co2_tons} טון CO₂`
                : `${STATS.members_active} active members · ${STATS.co2_tons}t CO₂ avoided`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
            🌱 {isHe ? 'ירוק' : 'Green'}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* CO2 hero */}
              <div className="rounded-2xl p-4 text-center"
                style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(34,197,94,0.05))', border: '1px solid rgba(16,185,129,0.3)' }}>
                <p className="text-[10px] font-black text-emerald-400/60 uppercase tracking-widest mb-1">
                  {isHe ? 'מועדון ה-VPP מנע היום' : 'VPP Club prevented today'}
                </p>
                <p className="text-4xl font-black text-emerald-400">{STATS.co2_tons} <span className="text-xl">טון CO₂</span></p>
                <p className="text-xs text-white/45 mt-1">
                  {isHe
                    ? `שווה ערך לנטיעת ${STATS.trees_equiv} עצים 🌳`
                    : `Equivalent to planting ${STATS.trees_equiv} trees 🌳`}
                </p>
              </div>

              {/* Grid stabilization */}
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-blue-400">{STATS.kw_injected} kW</span>
                  <div className="text-right">
                    <p className="text-xs font-black text-white">
                      {isHe ? '⚡ ייצוב הרשת הארצית' : '⚡ National Grid Stabilization'}
                    </p>
                    <p className="text-[10px] text-white/40 mt-0.5">
                      {isHe
                        ? `בשיא עומס ${STATS.peak_hour} — מנענו הפעלת תחנת כוח מזהמת`
                        : `Peak at ${STATS.peak_hour} — prevented emergency polluting plant`}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-stat row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: `${STATS.members_active}`, labelHe: 'חברים פעילים', labelEn: 'Active members', color: '#a78bfa' },
                  { value: `₪${Number(STATS.total_saved_ils).toLocaleString()}`, labelHe: 'נחסך קולקטיבית', labelEn: 'Collective saving', color: '#10b981' },
                  { value: `${STATS.trees_equiv}`, labelHe: 'עצים שקולים', labelEn: 'Tree equiv.', color: '#34d399', suffix: '🌳' },
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-2.5 text-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-base font-black" style={{ color: s.color }}>{s.value}{s.suffix}</p>
                    <p className="text-[9px] text-white/35 mt-0.5">{isHe ? s.labelHe : s.labelEn}</p>
                  </div>
                ))}
              </div>

              {/* National angle */}
              <div className="rounded-xl p-3.5 flex items-start gap-3"
                style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <span className="text-xl flex-shrink-0">🏛️</span>
                <p className="text-[11px] text-white/65 leading-relaxed text-right">
                  {isHe
                    ? `בשיא העומס היום ב-${STATS.peak_hour}, חברי המועדון הזרימו לרשת ${STATS.kw_injected} קילו-וואט ומנעו הפעלת תחנת כוח מזהמת בחירום.`
                    : `During today's peak at ${STATS.peak_hour}, club members injected ${STATS.kw_injected} kW into the grid and prevented emergency activation of a polluting power plant.`}
                </p>
              </div>

              <p className="text-[9px] text-white/20 text-center">
                {isHe ? 'נתונים מתעדכנים כל שעה · מקור: נוגה' : 'Updated hourly · Source: Noga Grid'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}