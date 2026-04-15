import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Zap, Battery, Sun, Home, Car, CheckCircle2, Pencil } from 'lucide-react';
import { toast } from 'sonner';

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
    devices: [
      { emoji: '❄️', nameHe: 'מזגן סלון',        nameEn: 'Living Room A/C',  power: '1.2 kW',  status: 'on',  color: '#60a5fa' },
      { emoji: '💡', nameHe: 'תאורה',             nameEn: 'Lighting',         power: '0.18 kW', status: 'on',  color: '#f59e0b' },
      { emoji: '📺', nameHe: 'טלוויזיה',          nameEn: 'TV',               power: '0.12 kW', status: 'on',  color: '#a78bfa' },
      { emoji: '🖥️', nameHe: 'מחשב',             nameEn: 'Computer',         power: '0.22 kW', status: 'on',  color: '#10b981' },
      { emoji: '🫙', nameHe: 'מקרר',              nameEn: 'Refrigerator',     power: '0.08 kW', status: 'on',  color: '#94a3b8' },
      { emoji: '🧺', nameHe: 'מכונת כביסה',       nameEn: 'Washing Machine',  power: '0.00 kW', status: 'off', color: '#475569' },
      { emoji: '🍳', nameHe: 'תנור חשמלי',        nameEn: 'Electric Oven',    power: '0.00 kW', status: 'off', color: '#475569' },
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
    aiTipHe: 'מחיר שיא ₪1.12 צפוי ב-18:00. הגדר מכירה אוטומטית של 8 kWh לשעת השיא ומקסם הכנסות.',
    aiTipEn: 'Peak price ₪1.12 expected at 18:00. Set auto-sell of 8 kWh at peak time to maximize revenue.',
    editFields: [
      { labelHe: 'כמות מכירה (kWh)', labelEn: 'Sell amount (kWh)', key: 'sellKwh', type: 'range', min: 1, max: 15, step: 0.5, defaultVal: 8 },
    ],
  },
};

// AI tip data per node
const AI_TIPS = {
  solar: {
    he: 'קרינה שיאית צפויה עד 14:00. הפנה את עודף הייצור ישירות לטעינת הסוללה כדי למקסם אחסון.',
    en: 'Peak irradiance expected until 14:00. Route surplus production directly to battery storage to maximize reserves.',
    applyHe: 'מפנה עודף ייצור לסוללה ✓',
    applyEn: 'Routing surplus to battery ✓',
  },
  battery: {
    he: 'SoH מצויין (97%). טען עד 95% עכשיו — שעת שיא ב-18:00 תאפשר מכירה רווחית של 6 kWh.',
    en: 'Excellent SoH (97%). Charge to 95% now — peak hour at 18:00 allows profitable sale of 6 kWh.',
    applyHe: 'יעד טעינה עודכן ל-95% ✓',
    applyEn: 'Charge target updated to 95% ✓',
  },
  home: {
    he: 'המזגן צורך 1.2 kW. העבר לתזמון 14:00–17:00 (שיא סולארי) וחסוך ~₪18 היום.',
    en: 'A/C draws 1.2 kW. Shift schedule to 14:00–17:00 (solar peak) and save ~₪18 today.',
    applyHe: 'תזמון מזגן עודכן לשעות השמש ✓',
    applyEn: 'A/C schedule shifted to solar hours ✓',
  },
  ev: {
    he: 'הפסק טעינה ב-80% — מחיר גריד גבוה. המשך מסולאר בין 11:00–14:00 בחינם.',
    en: 'Stop charging at 80% — grid price high now. Continue from solar 11:00–14:00 for free.',
    applyHe: 'יעד טעינה הוגדר ל-80% + מקור סולארי ✓',
    applyEn: 'Charge target set to 80% + solar source ✓',
  },
  grid: {
    he: 'מחיר שיא ₪1.12 צפוי ב-18:00. הגדר מכירה אוטומטית של 8 kWh לשעת השיא ומקסם הכנסות.',
    en: 'Peak price ₪1.12 expected at 18:00. Set auto-sell of 8 kWh at peak time to maximize revenue.',
    applyHe: 'מכירה אוטומטית הוגדרה ל-18:00 ✓',
    applyEn: 'Auto-sell scheduled for 18:00 ✓',
  },
};

// Edit configs per node
const EDIT_CONFIGS = {
  solar: [
    { labelHe: 'ספק תדירות ניטור', labelEn: 'Monitoring interval', key: 'interval', type: 'select', options: ['5 min', '10 min', '15 min'], defaultVal: '5 min' },
  ],
  battery: [
    { labelHe: 'יעד טעינה (%)', labelEn: 'Charge target (%)', key: 'chargeTarget', type: 'range', min: 50, max: 100, step: 5, defaultVal: 90 },
    { labelHe: 'מקור טעינה', labelEn: 'Charge source', key: 'source', type: 'select', options: ['solar', 'grid', 'auto'], defaultVal: 'solar' },
  ],
  home: [
    { labelHe: 'שעת התחלה מזגן', labelEn: 'A/C start time', key: 'acStart', type: 'select', options: ['11:00', '12:00', '13:00', '14:00'], defaultVal: '14:00' },
    { labelHe: 'שעת סיום מזגן', labelEn: 'A/C end time', key: 'acEnd', type: 'select', options: ['15:00', '16:00', '17:00', '18:00'], defaultVal: '17:00' },
  ],
  ev: [
    { labelHe: 'יעד טעינה (%)', labelEn: 'Charge target (%)', key: 'evTarget', type: 'range', min: 50, max: 100, step: 5, defaultVal: 80 },
    { labelHe: 'מקור טעינה', labelEn: 'Charge source', key: 'evSource', type: 'select', options: ['solar', 'battery', 'grid'], defaultVal: 'solar' },
  ],
  grid: [
    { labelHe: 'כמות מכירה (kWh)', labelEn: 'Sell amount (kWh)', key: 'sellKwh', type: 'range', min: 1, max: 15, step: 0.5, defaultVal: 8 },
    { labelHe: 'שעת מכירה', labelEn: 'Sell time', key: 'sellTime', type: 'select', options: ['17:00', '18:00', '19:00', '20:00'], defaultVal: '18:00' },
  ],
};

function NodeDrawer({ node, isHe, onClose }) {
  const d = NODE_DATA[node];
  const tip = AI_TIPS[node];
  const editConfig = (EDIT_CONFIGS[node] || []);

  const initVals = {};
  editConfig.forEach(f => { initVals[f.key] = f.defaultVal; });

  const [editOpen, setEditOpen] = useState(false);
  const [editVals, setEditVals] = useState(initVals);
  const [applied, setApplied] = useState(false);

  if (!d) return null;
  const Icon = d.icon;

  const handleApply = () => {
    setApplied(true);
    toast.success(isHe ? tip.applyHe : tip.applyEn);
  };

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
        className="w-full rounded-t-3xl max-h-[88vh] overflow-y-auto"
        style={{ background: '#0D1420', border: `1px solid ${d.borderColor}`, borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        <div className="px-5 pb-28 space-y-5">
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
                <div className="flex items-center gap-1 justify-end mt-0.5">
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

          {/* AI Recommendation */}
          <div className="rounded-2xl p-3.5 space-y-2.5"
            style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.1),rgba(124,58,237,0.07))', border: '1px solid rgba(167,139,250,0.3)' }}>
            <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">🤖 {isHe ? 'המלצת AI' : 'AI Tip'}</p>
            <p className="text-xs text-white/70 leading-relaxed text-right">{isHe ? tip.he : tip.en}</p>
            <button
              onClick={handleApply}
              disabled={applied}
              className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95"
              style={{
                background: applied ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg,rgba(124,58,237,0.4),rgba(79,70,229,0.3))',
                border: applied ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(124,58,237,0.5)',
                color: applied ? '#10b981' : '#c4b5fd',
              }}>
              {applied
                ? <><CheckCircle2 className="w-3.5 h-3.5" />{isHe ? 'יושם ✓' : 'Applied ✓'}</>
                : <>{isHe ? '⚡ יישם המלצה' : '⚡ Apply Recommendation'}</>}
            </button>
          </div>

          {/* Edit Section */}
          {editConfig.length > 0 && (
            <div>
              <button
                onClick={() => setEditOpen(v => !v)}
                className="w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-all"
                style={{
                  background: editOpen ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${editOpen ? 'rgba(167,139,250,0.35)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                <Pencil className="w-3.5 h-3.5" style={{ color: editOpen ? '#a78bfa' : 'rgba(255,255,255,0.35)' }} />
                <span className="text-xs font-black" style={{ color: editOpen ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
                  {editOpen ? (isHe ? '✓ סגור עריכה' : '✓ Close Edit') : (isHe ? '✏️ ערוך הגדרות' : '✏️ Edit Settings')}
                </span>
              </button>

              <AnimatePresence>
                {editOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="pt-3 space-y-4">
                      {editConfig.map((field) => (
                        <div key={field.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-black text-white">
                              {field.type === 'range' ? editVals[field.key] : editVals[field.key]}
                            </span>
                            <p className="text-[10px] text-white/40">{isHe ? field.labelHe : field.labelEn}</p>
                          </div>
                          {field.type === 'range' && (
                            <input type="range" min={field.min} max={field.max} step={field.step}
                              value={editVals[field.key]}
                              onChange={e => setEditVals(v => ({ ...v, [field.key]: Number(e.target.value) }))}
                              className="w-full accent-violet-400" />
                          )}
                          {field.type === 'select' && (
                            <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${field.options.length}, 1fr)` }}>
                              {field.options.map(opt => (
                                <button key={opt} onClick={() => setEditVals(v => ({ ...v, [field.key]: opt }))}
                                  className="py-1.5 rounded-lg text-[10px] font-black transition-all"
                                  style={{
                                    background: editVals[field.key] === opt ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${editVals[field.key] === opt ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                    color: editVals[field.key] === opt ? '#a78bfa' : 'rgba(255,255,255,0.35)',
                                  }}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => { setEditOpen(false); toast.success(isHe ? '✅ ההגדרות נשמרו' : '✅ Settings saved'); }}
                        className="w-full py-2.5 rounded-xl text-xs font-black text-white transition-all active:scale-95"
                        style={{ background: 'linear-gradient(135deg,rgba(167,139,250,0.35),rgba(124,58,237,0.25))', border: '1px solid rgba(167,139,250,0.4)' }}>
                        {isHe ? '💾 שמור הגדרות' : '💾 Save Settings'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Connected Devices (home only) */}
          {d.devices && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/35 uppercase tracking-widest text-right">
                {isHe ? 'מכשירים מחוברים' : 'Connected Devices'}
              </p>
              {d.devices.map((dev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5"
                  style={{
                    background: dev.status === 'on' ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.015)',
                    border: `1px solid ${dev.status === 'on' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black" style={{ color: dev.status === 'on' ? dev.color : '#475569' }}>
                      {dev.power}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${dev.status === 'on' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/25'}`}>
                      {dev.status === 'on' ? (isHe ? 'פועל' : 'ON') : (isHe ? 'כבוי' : 'OFF')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">{isHe ? dev.nameHe : dev.nameEn}</span>
                    <span className="text-base">{dev.emoji}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

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