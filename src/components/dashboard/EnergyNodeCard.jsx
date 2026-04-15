import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Zap, Battery, Sun, Home, Car } from 'lucide-react';

const NODE_DATA = {
  solar: {
    icon: Sun,
    colorClass: 'border-amber-500 text-amber-400',
    bgGlow: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.4)',
    dotColor: '#f59e0b',
    titleHe: 'פאנלים סולאריים',
    titleEn: 'Solar Panels',
    stats: [
      { labelHe: 'הספק נוכחי',     labelEn: 'Current Power',   value: '4.2 kW',    color: '#f59e0b' },
      { labelHe: 'ייצור היום',      labelEn: 'Today\'s Yield',  value: '18.4 kWh',  color: '#10b981' },
      { labelHe: 'קרינה',           labelEn: 'Irradiance',      value: '620 W/m²',  color: '#60a5fa' },
      { labelHe: 'יעילות',         labelEn: 'Efficiency',      value: '94.2%',     color: '#a78bfa' },
      { labelHe: 'טמפרטורת פאנל',  labelEn: 'Panel Temp',     value: '48°C',      color: '#f87171' },
    ],
    bodyHe: 'הפאנלים פועלים בביצועי שיא. קרינה גבוהה עם UV 8. הספק ייצור מקסימלי צפוי עד 14:00.',
    bodyEn: 'Panels operating at peak performance. High irradiance with UV 8. Max production expected until 14:00.',
    trend: '+12% vs yesterday',
    trendUp: true,
  },
  battery: {
    icon: Battery,
    colorClass: 'border-primary text-primary',
    bgGlow: 'rgba(16,185,129,0.15)',
    borderColor: 'rgba(16,185,129,0.4)',
    dotColor: '#10b981',
    titleHe: 'סוללת אנרגיה',
    titleEn: 'Energy Battery',
    stats: [
      { labelHe: 'רמת טעינה (SoC)', labelEn: 'State of Charge', value: '82%',      color: '#10b981' },
      { labelHe: 'קיבולת זמינה',    labelEn: 'Available Cap.',  value: '8.2 kWh',  color: '#60a5fa' },
      { labelHe: 'זרם טעינה',       labelEn: 'Charge Current',  value: '+2.1 kW',  color: '#a78bfa' },
      { labelHe: 'מתח',             labelEn: 'Voltage',         value: '51.4V',    color: '#f59e0b' },
      { labelHe: 'מחזורי טעינה',    labelEn: 'Cycle Count',    value: '312',       color: '#94a3b8' },
      { labelHe: 'בריאות (SoH)',    labelEn: 'State of Health', value: '97%',      color: '#10b981' },
    ],
    bodyHe: 'הסוללה בטעינה פעילה. SoH מצויין. זמן טעינה מלאה צפוי: ~50 דקות. מומלץ למכור לרשת בין 18:00–21:00.',
    bodyEn: 'Battery actively charging. Excellent SoH. Full charge in ~50 min. Recommended grid export: 18:00–21:00.',
    trend: 'Full charge in 50 min',
    trendUp: true,
  },
  home: {
    icon: Home,
    colorClass: 'border-secondary text-secondary',
    bgGlow: 'rgba(59,130,246,0.15)',
    borderColor: 'rgba(59,130,246,0.4)',
    dotColor: '#3b82f6',
    titleHe: 'צריכה ביתית',
    titleEn: 'Home Consumption',
    stats: [
      { labelHe: 'צריכה נוכחית',    labelEn: 'Current Load',   value: '1.8 kW',   color: '#3b82f6' },
      { labelHe: 'שימוש היום',      labelEn: 'Today\'s Usage', value: '11.2 kWh', color: '#f59e0b' },
      { labelHe: 'צריכה שיא',       labelEn: 'Peak Load',      value: '3.4 kW',   color: '#f87171' },
      { labelHe: 'מזגן',            labelEn: 'A/C',            value: '1.2 kW',   color: '#60a5fa' },
      { labelHe: 'מכשירים אחרים',   labelEn: 'Other devices',  value: '0.6 kW',   color: '#94a3b8' },
    ],
    bodyHe: 'הצריכה הביתית נמוכה יחסית. המזגן הוא הצרכן הגדול ביותר. כיסוי סולארי מלא של 100% מהצריכה.',
    bodyEn: 'Home consumption is relatively low. A/C is the largest consumer. 100% solar coverage of demand.',
    trend: '100% solar covered',
    trendUp: true,
  },
  ev: {
    icon: Car,
    colorClass: 'border-amber-500 text-amber-400',
    bgGlow: 'rgba(245,158,11,0.12)',
    borderColor: 'rgba(245,158,11,0.35)',
    dotColor: '#f59e0b',
    titleHe: 'רכב חשמלי',
    titleEn: 'Electric Vehicle',
    stats: [
      { labelHe: 'הספק טעינה',      labelEn: 'Charging Power', value: '7.4 kW',   color: '#f59e0b' },
      { labelHe: 'SoC רכב',         labelEn: 'Vehicle SoC',    value: '43%',      color: '#10b981' },
      { labelHe: 'זמן לסיום',       labelEn: 'Time to Full',   value: '~38 min',  color: '#60a5fa' },
      { labelHe: 'קילומטרים שנטענו', labelEn: 'Range Added',   value: '+82 km',   color: '#a78bfa' },
      { labelHe: 'עלות טעינה',      labelEn: 'Charge Cost',    value: '₪2.10',    color: '#f87171' },
    ],
    bodyHe: 'הרכב טוען מאנרגיה סולארית בלבד — עלות אפסית. כ-38 דקות להשלמת טעינה ל-80%. קילומטראז׳ מוסף: 82 ק"מ.',
    bodyEn: 'Vehicle charging from 100% solar — zero cost. ~38 min to 80% charge. Added 82 km of range.',
    trend: 'Free solar charge',
    trendUp: true,
  },
  grid: {
    icon: Zap,
    colorClass: 'border-secondary text-secondary',
    bgGlow: 'rgba(59,130,246,0.12)',
    borderColor: 'rgba(59,130,246,0.35)',
    dotColor: '#3b82f6',
    titleHe: 'רשת החשמל',
    titleEn: 'Power Grid',
    stats: [
      { labelHe: 'ייצוא נוכחי',     labelEn: 'Current Export', value: '2.4 kW',   color: '#10b981' },
      { labelHe: 'ייצוא היום',      labelEn: 'Today\'s Export', value: '9.8 kWh',  color: '#3b82f6' },
      { labelHe: 'הכנסה היום',      labelEn: 'Today\'s Revenue', value: '₪8.72',  color: '#f59e0b' },
      { labelHe: 'מחיר MCP נוכחי',  labelEn: 'MCP Price',      value: '₪0.89/kWh', color: '#a78bfa' },
      { labelHe: 'שיא MCP היום',    labelEn: 'Peak MCP Today', value: '₪1.12/kWh', color: '#10b981' },
      { labelHe: 'שיא מכירה',       labelEn: 'Best Sell Time', value: '18:00–21:00', color: '#f59e0b' },
    ],
    bodyHe: 'מייצא עודפים לרשת. מחיר MCP שיא צפוי ב-18:00–21:00 (₪1.12/kWh). מומלץ לשמור על SoC 60% לפני שעת השיא.',
    bodyEn: 'Exporting surplus to grid. Peak MCP at 18:00–21:00 (₪1.12/kWh). Keep 60% SoC before peak hour.',
    trend: '+₪8.72 revenue today',
    trendUp: true,
  },
};

function NodeDrawer({ node, isHe, onClose }) {
  const d = NODE_DATA[node];
  if (!d) return null;
  const Icon = d.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full rounded-t-3xl max-h-[82vh] overflow-y-auto"
        style={{ background: '#0D1420', border: `1px solid ${d.borderColor}`, borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <div className="px-5 pb-8 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button onClick={onClose}
              className="p-2 rounded-xl transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              <X className="w-4 h-4 text-white/50" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-lg font-black text-white">{isHe ? d.titleHe : d.titleEn}</p>
                <div className={`flex items-center gap-1 justify-end mt-0.5`}>
                  {d.trendUp
                    ? <TrendingUp className="w-3 h-3 text-emerald-400" />
                    : <TrendingDown className="w-3 h-3 text-red-400" />}
                  <span className={`text-[10px] font-bold ${d.trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
                    {d.trend}
                  </span>
                </div>
              </div>
              <motion.div
                animate={{ boxShadow: [`0 0 0px ${d.dotColor}`, `0 0 18px ${d.dotColor}60`, `0 0 0px ${d.dotColor}`] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: d.bgGlow, border: `1.5px solid ${d.borderColor}` }}
              >
                <Icon className="w-6 h-6" style={{ color: d.dotColor }} />
              </motion.div>
            </div>
          </div>

          {/* Live dot */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[10px] text-white/35">{isHe ? 'נתונים חיים' : 'Live data'}</span>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: d.dotColor }}
            />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {d.stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-3.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{isHe ? s.labelHe : s.labelEn}</p>
              </motion.div>
            ))}
          </div>

          {/* Description */}
          <div className="rounded-2xl p-4"
            style={{ background: d.bgGlow, border: `1px solid ${d.borderColor}` }}>
            <p className="text-[11px] text-white/70 leading-relaxed text-right">
              {isHe ? d.bodyHe : d.bodyEn}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Clickable PowerNode ───────────────────────────────────────────────────────
export function ClickablePowerNode({ nodeKey, icon: Icon, label, value, colorClass, isHe }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
      >
        <div className={`p-3 rounded-2xl border-2 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] text-muted-foreground">{label}</span>
        {value && <span className="text-xs font-bold">{value}</span>}
      </button>

      <AnimatePresence>
        {open && <NodeDrawer node={nodeKey} isHe={isHe} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// ── Clickable Battery Center Node ─────────────────────────────────────────────
export function ClickableBatteryNode({ label, value, isHe }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
        <div className="relative">
          <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-md animate-pulse" />
          <div className="relative p-4 rounded-2xl border-2 border-primary text-primary bg-primary/5">
            <Battery className="w-8 h-8" />
          </div>
        </div>
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-2xl font-black text-primary">{value}</span>
      </button>

      <AnimatePresence>
        {open && <NodeDrawer node="battery" isHe={isHe} onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}