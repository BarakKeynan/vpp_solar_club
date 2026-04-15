import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, ChevronUp, ShieldAlert, TrendingUp, ToggleLeft, ToggleRight, GripVertical, Info } from 'lucide-react';
import { toast } from 'sonner';

const INITIAL_DEVICES = [
  { id: 1, name: 'מזגן ראשי', icon: '❄️', category: 'חימום/קירור', power: 2.5, autoOff: true,  priority: 1, delay: 0   },
  { id: 2, name: 'מייבש כביסה', icon: '👕', category: 'כביסה',       power: 2.2, autoOff: true,  priority: 2, delay: 0   },
  { id: 3, name: 'מדיח כלים',   icon: '🍽️', category: 'מטבח',        power: 1.8, autoOff: true,  priority: 3, delay: 5   },
  { id: 4, name: 'דוד חשמל',    icon: '🚿', category: 'מים חמים',    power: 3.0, autoOff: false, priority: 4, delay: 10  },
  { id: 5, name: 'טלוויזיה',    icon: '📺', category: 'בידור',        power: 0.2, autoOff: false, priority: 5, delay: 0   },
  { id: 6, name: 'תנור חשמלי',  icon: '🍳', category: 'מטבח',        power: 2.0, autoOff: false, priority: 6, delay: 0   },
];

const THRESHOLDS = [
  { key: 'mild',    label: 'גבוה קל',    price: '0.55', color: '#f59e0b', desc: 'כבה רק מכשירים עם עדיפות 1-2' },
  { key: 'peak',    label: 'שיא',        price: '0.72', color: '#ef4444', desc: 'כבה עדיפות 1-4 — מקסם מכירה' },
  { key: 'extreme', label: 'שיא קיצוני', price: '0.95', color: '#dc2626', desc: 'כבה הכל — רווח מקסימלי' },
];

const DELAYS = [0, 5, 10, 15, 30];

export default function PeakSheddingSettings() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [threshold, setThreshold] = useState('peak');
  const [showInfo, setShowInfo] = useState(false);
  const [dragging, setDragging] = useState(null);

  const toggleDevice = (id) => {
    setDevices(prev => prev.map(d =>
      d.id === id ? { ...d, autoOff: !d.autoOff } : d
    ));
  };

  const changeDelay = (id, delay) => {
    setDevices(prev => prev.map(d =>
      d.id === id ? { ...d, delay } : d
    ));
  };

  const moveUp = (id) => {
    setDevices(prev => {
      const idx = prev.findIndex(d => d.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next.map((d, i) => ({ ...d, priority: i + 1 }));
    });
  };

  const moveDown = (id) => {
    setDevices(prev => {
      const idx = prev.findIndex(d => d.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next.map((d, i) => ({ ...d, priority: i + 1 }));
    });
  };

  const autoOffCount = devices.filter(d => d.autoOff).length;
  const savedPower = devices.filter(d => d.autoOff).reduce((sum, d) => sum + d.power, 0).toFixed(1);
  const currentThreshold = THRESHOLDS.find(t => t.key === threshold);

  const handleSave = () => {
    toast.success(`✅ הגדרות שמורות — ${autoOffCount} מכשירים יכובו בשעת שיא >${currentThreshold.price} ₪/kWh`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl border p-4 transition-all active:scale-[0.98]"
        style={{
          background: open ? 'rgba(239,68,68,0.07)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{ background: enabled ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.06)' }}>
            <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
            <span className={`text-[11px] font-bold ${enabled ? 'text-emerald-400' : 'text-white/30'}`}>
              {enabled ? 'פעיל' : 'כבוי'}
            </span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-sm font-black text-white">תעדוף מכשירים בשעת שיא</p>
            <p className="text-[10px] text-white/40">{autoOffCount} מכשירים · {savedPower} kW ל"מכירה"</p>
          </div>
          <div className="p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.12)' }}>
            <ShieldAlert className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* Master toggle + info */}
              <div className="flex items-center justify-between rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowInfo(v => !v)}>
                    <Info className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                  </button>
                  <button
                    onClick={() => { setEnabled(v => !v); toast(enabled ? 'כיבוי אוטומטי הופסק' : 'כיבוי אוטומטי הופעל'); }}
                    className="flex items-center gap-1"
                  >
                    {enabled
                      ? <ToggleRight className="w-8 h-8 text-primary" />
                      : <ToggleLeft className="w-8 h-8 text-white/30" />}
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-white">כיבוי אוטומטי בשעת שיא</p>
                  <p className="text-[10px] text-white/40">AI מנהל כיבוי/הדלקה לפי מחיר שוק</p>
                </div>
              </div>

              {/* Info Banner */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="rounded-2xl p-4 text-right"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p className="text-xs font-black text-red-300 mb-1">⚡ איך זה עובד?</p>
                      <p className="text-[11px] text-white/55 leading-relaxed">
                        כאשר מחיר החשמל עולה מעל הסף שהגדרת, המערכת כובה אוטומטית מכשירים לפי סדר עדיפות.
                        האנרגיה שנחסכת נמכרת לרשת ברווח. המכשירים יחזרו לפעול כאשר המחיר יירד.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Threshold Selector */}
              <div className="space-y-2">
                <p className="text-[11px] font-black text-white/40 uppercase tracking-widest px-1">סף הפעלה</p>
                <div className="grid grid-cols-3 gap-2">
                  {THRESHOLDS.map(t => (
                    <button key={t.key} onClick={() => setThreshold(t.key)}
                      className="p-3 rounded-xl text-center transition-all"
                      style={{
                        background: threshold === t.key ? `${t.color}18` : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${threshold === t.key ? `${t.color}70` : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      <p className="text-sm font-black" style={{ color: threshold === t.key ? t.color : 'rgba(255,255,255,0.5)' }}>
                        ₪{t.price}
                      </p>
                      <p className="text-[10px]" style={{ color: threshold === t.key ? t.color : 'rgba(255,255,255,0.3)' }}>
                        {t.label}
                      </p>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-white/40 text-right px-1">{currentThreshold.desc}</p>
              </div>

              {/* Savings preview */}
              <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black text-primary">
                    +₪{(parseFloat(savedPower) * parseFloat(currentThreshold.price) * 2).toFixed(0)}/שעת שיא
                  </span>
                </div>
                <span className="text-[11px] text-white/40">
                  {savedPower} kW פנוי למכירה
                </span>
              </div>

              {/* Device Priority List */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-[10px] text-white/30">עדיפות כיבוי ← גבוה</p>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">סדר תעדוף</p>
                </div>

                {devices.map((device, idx) => (
                  <motion.div key={device.id} layout
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: device.autoOff ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${device.autoOff ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)'}`,
                    }}>
                    <div className="flex items-center gap-3 px-3 py-3">
                      {/* Priority badge + drag */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <button onClick={() => moveUp(device.id)} disabled={idx === 0}
                          className="p-0.5 rounded disabled:opacity-20 hover:bg-white/10 transition-colors">
                          <ChevronUp className="w-3 h-3 text-white/40" />
                        </button>
                        <span className="text-[10px] font-black text-white/40 w-4 text-center">{device.priority}</span>
                        <button onClick={() => moveDown(device.id)} disabled={idx === devices.length - 1}
                          className="p-0.5 rounded disabled:opacity-20 hover:bg-white/10 transition-colors">
                          <ChevronDown className="w-3 h-3 text-white/40" />
                        </button>
                      </div>

                      {/* Icon */}
                      <span className="text-xl flex-shrink-0">{device.icon}</span>

                      {/* Info */}
                      <div className="flex-1 text-right min-w-0">
                        <p className="text-sm font-black text-white truncate">{device.name}</p>
                        <p className="text-[10px] text-white/35">{device.category} · {device.power} kW</p>
                        {device.autoOff && (
                          <div className="flex items-center justify-end gap-1.5 mt-1">
                            <span className="text-[10px] text-white/30">עיכוב:</span>
                            <div className="flex gap-1">
                              {DELAYS.map(d => (
                                <button key={d} onClick={() => changeDelay(device.id, d)}
                                  className="text-[9px] font-bold px-1.5 py-0.5 rounded transition-all"
                                  style={{
                                    background: device.delay === d ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.06)',
                                    color: device.delay === d ? '#fca5a5' : 'rgba(255,255,255,0.3)',
                                    border: device.delay === d ? '1px solid rgba(239,68,68,0.4)' : '1px solid transparent',
                                  }}>
                                  {d === 0 ? 'מיד' : `${d}'`}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Toggle */}
                      <button onClick={() => toggleDevice(device.id)}
                        className="flex-shrink-0 transition-all">
                        {device.autoOff
                          ? <ToggleRight className="w-7 h-7 text-red-400" />
                          : <ToggleLeft className="w-7 h-7 text-white/20" />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Save Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  boxShadow: '0 0 20px rgba(239,68,68,0.3)',
                }}>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" />
                  שמור הגדרות תעדוף
                </div>
                <p className="text-[10px] text-red-200/60 mt-0.5 font-normal">
                  {autoOffCount} מכשירים · {savedPower} kW · סף ₪{currentThreshold.price}/kWh
                </p>
              </motion.button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}