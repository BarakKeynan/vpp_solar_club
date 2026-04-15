import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, TrendingUp, DollarSign, Activity, Battery, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRICE_HOURS = [
  { hour: '00', price: 0.22 },
  { hour: '06', price: 0.31 },
  { hour: '10', price: 0.45 },
  { hour: '14', price: 0.38 },
  { hour: '18', price: 0.72 },
  { hour: '20', price: 0.68 },
  { hour: '22', price: 0.41 },
];

const BATTERY_INVENTORY = [
  { id: 1, name: 'סוללה ראשית',   model: 'Tesla Powerwall 2', capacity: 13.5, level: 82, temp: 28 },
  { id: 2, name: 'סוללה שניונית', model: 'BYD HVM 11.0',      capacity: 11.0, level: 61, temp: 31 },
  { id: 3, name: 'גיבוי קהילתי',  model: 'CATL 10kWh',        capacity: 10.0, level: 44, temp: 26 },
];

const SELL_MODES = [
  {
    key: 'optimal',
    emoji: '🤖',
    titleHe: 'מכירה אופטימלית AI',
    titleEn: 'AI Optimal Sell',
    descHe: 'AI בוחר את שעת השיא הטובה ביותר ומוכר אוטומטית',
    descEn: 'AI picks the best peak window and sells automatically',
    badgeHe: 'מומלץ',
    badgeEn: 'Recommended',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.4)',
  },
  {
    key: 'now',
    emoji: '⚡',
    titleHe: 'מכירה מיידית',
    titleEn: 'Sell Now',
    descHe: 'מכור עכשיו במחיר הנוכחי ₪0.72/kWh',
    descEn: 'Sell now at current price ₪0.72/kWh',
    badgeHe: 'שעת שיא',
    badgeEn: 'Peak Hour',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.35)',
  },
  {
    key: 'scheduled',
    emoji: '🕐',
    titleHe: 'תזמון מכירה',
    titleEn: 'Schedule Sale',
    descHe: 'קבע שעה ספציפית למכירה אוטומטית',
    descEn: 'Set a specific time for automatic sale',
    badgeHe: null,
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.3)',
  },
];

export default function SellToGrid() {
  const navigate = useNavigate();
  const [selling, setSelling] = useState(false);
  const [earned, setEarned] = useState(0);
  const [kwh, setKwh] = useState(0);
  const [selectedMode, setSelectedMode] = useState('optimal');
  const [selectedBattery, setSelectedBattery] = useState(BATTERY_INVENTORY[0]);
  const [sellAmount, setSellAmount] = useState(5.0); // kWh to sell
  const [showBatteryPicker, setShowBatteryPicker] = useState(false);
  const maxPrice = Math.max(...PRICE_HOURS.map(h => h.price));

  useEffect(() => {
    if (!selling) return;
    const t = setInterval(() => {
      setEarned(e => Math.round((e + 0.043) * 100) / 100);
      setKwh(k => Math.round((k + 0.06) * 100) / 100);
    }, 400);
    return () => clearInterval(t);
  }, [selling]);

  const availableKwh = (selectedBattery.level / 100) * selectedBattery.capacity;
  const estimatedRevenue = (sellAmount * 0.72).toFixed(2);
  const minSell = 0.5;
  const maxSell = Math.floor(availableKwh * 10) / 10;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">מכירה לרשת</h1>
        <div className="mr-auto flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${selling ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-xs font-bold ${selling ? 'text-primary' : 'text-muted-foreground'}`}>
            {selling ? 'מוכר עכשיו' : 'לא פעיל'}
          </span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-36">

        {/* Live Earnings */}
        <motion.div
          animate={{ borderColor: selling ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)' }}
          className="rounded-2xl border-2 p-5"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))' }}
        >
          <p className="text-xs text-muted-foreground mb-1">הכנסה מהמכירה</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black text-primary">{earned.toFixed(2)} ₪</p>
            <div className="pb-1">
              <p className="text-xs text-muted-foreground">בסשן הנוכחי</p>
              <p className="text-sm font-bold text-foreground">{kwh.toFixed(2)} kWh</p>
            </div>
          </div>
          {selling && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-3">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs text-primary font-medium">0.72 ₪/kWh · שעת שיא · מחיר מקסימלי</p>
            </motion.div>
          )}
        </motion.div>

        {/* Sell Mode Selector */}
        <div className="space-y-2">
          <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">
            אופן מכירה
          </p>
          {SELL_MODES.map(mode => {
            const active = selectedMode === mode.key;
            return (
              <button key={mode.key} onClick={() => setSelectedMode(mode.key)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl text-right transition-all active:scale-[0.98]"
                style={{
                  background: active ? mode.bg : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${active ? mode.border : 'rgba(255,255,255,0.07)'}`,
                }}>
                <span className="text-xl flex-shrink-0">{mode.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black" style={{ color: active ? mode.color : 'rgba(255,255,255,0.7)' }}>
                      {mode.titleHe}
                    </p>
                    {mode.badgeHe && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: `${mode.color}20`, color: mode.color }}>
                        {mode.badgeHe}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">{mode.descHe}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all`}
                  style={{ borderColor: active ? mode.color : 'rgba(255,255,255,0.2)' }}>
                  {active && <div className="w-2 h-2 rounded-full" style={{ background: mode.color }} />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Battery Inventory */}
        <div className="space-y-2">
          <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">
            מלאי סוללות — בחר מקור
          </p>
          <button
            onClick={() => setShowBatteryPicker(v => !v)}
            className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
            style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <div className="flex items-center gap-2">
              {showBatteryPicker
                ? <ChevronUp className="w-4 h-4 text-white/40" />
                : <ChevronDown className="w-4 h-4 text-white/40" />}
              <span className="text-xs text-white/40">{`${availableKwh.toFixed(1)} kWh זמין`}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-black text-white">{selectedBattery.name}</p>
                <p className="text-[10px] text-white/40">{selectedBattery.model}</p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Battery className="w-5 h-5 text-primary" />
              </div>
            </div>
          </button>

          <AnimatePresence>
            {showBatteryPicker && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden space-y-2"
              >
                {BATTERY_INVENTORY.map(bat => {
                  const avail = (bat.level / 100) * bat.capacity;
                  const isSelected = bat.id === selectedBattery.id;
                  const barColor = bat.level > 60 ? '#10b981' : bat.level > 30 ? '#f59e0b' : '#ef4444';
                  return (
                    <button key={bat.id}
                      onClick={() => { setSelectedBattery(bat); setShowBatteryPicker(false); setSellAmount(Math.min(sellAmount, Math.floor(avail * 10) / 10)); }}
                      className="w-full p-4 rounded-2xl text-right transition-all active:scale-[0.98]"
                      style={{
                        background: isSelected ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                        border: `1.5px solid ${isSelected ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black" style={{ color: barColor }}>{bat.level}%</span>
                          <span className="text-[10px] text-white/40">{avail.toFixed(1)} kWh</span>
                        </div>
                        <div>
                          <p className="text-sm font-black text-white">{bat.name}</p>
                          <p className="text-[10px] text-white/40">{bat.model} · {bat.capacity} kWh · {bat.temp}°C</p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${bat.level}%`, background: barColor }} />
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Amount Slider */}
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">מתוך {availableKwh.toFixed(1)} kWh</span>
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">כמות למכירה</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setSellAmount(a => Math.max(minSell, Math.round((a - 0.5) * 10) / 10))}
              className="w-9 h-9 rounded-xl text-lg font-black text-white flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.07)' }}>−</button>
            <div className="flex-1 text-center">
              <p className="text-3xl font-black text-white">{sellAmount.toFixed(1)}</p>
              <p className="text-[10px] text-white/40">kWh</p>
            </div>
            <button onClick={() => setSellAmount(a => Math.min(maxSell, Math.round((a + 0.5) * 10) / 10))}
              className="w-9 h-9 rounded-xl text-lg font-black text-white flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.07)' }}>+</button>
          </div>
          <input type="range" min={minSell} max={maxSell} step={0.5} value={sellAmount}
            onChange={e => setSellAmount(Number(e.target.value))}
            className="w-full accent-emerald-400" />
          <div className="flex items-center justify-between rounded-xl px-3 py-2"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <span className="text-xs font-black text-primary">≈ ₪{estimatedRevenue}</span>
            <span className="text-[10px] text-white/40">הכנסה צפויה @ ₪0.72/kWh</span>
          </div>
        </div>

        {/* Price Chart */}
        <div className="rounded-2xl border border-border p-4 bg-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <p className="text-xs font-bold text-muted-foreground">מחיר חשמל לפי שעה (₪/kWh)</p>
          </div>
          <div className="flex items-end gap-2 h-24">
            {PRICE_HOURS.map((h, i) => {
              const heightPct = (h.price / maxPrice) * 100;
              const isPeak = h.price === maxPrice;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${heightPct}%` }}
                    transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
                    className={`w-full rounded-t-lg ${isPeak ? 'bg-primary' : 'bg-muted'}`}
                    style={{ minHeight: 4 }}
                  />
                  <p className={`text-[9px] font-bold ${isPeak ? 'text-primary' : 'text-muted-foreground'}`}>{h.hour}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            💡 עכשיו שעת שיא – המחיר הגבוה ביותר לייצוא
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'מחיר כעת', value: '0.72 ₪', icon: DollarSign, color: 'text-primary' },
            { label: 'נמכר היום', value: '9.8 kWh', icon: Zap, color: 'text-secondary' },
            { label: 'הכנסה היום', value: '47 ₪', icon: TrendingUp, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className={`text-base font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed CTA — with extra bottom padding to clear nav bar */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-20 bg-background/95 backdrop-blur border-t border-border">
        {/* Summary line */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black text-primary">≈ ₪{estimatedRevenue}</span>
          <span className="text-[11px] text-white/40">
            {sellAmount.toFixed(1)} kWh · {selectedBattery.name} · {SELL_MODES.find(m => m.key === selectedMode)?.titleHe}
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setSelling(s => !s)}
          className="w-full py-4 rounded-2xl font-black text-lg transition-all"
          style={selling ? {
            background: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.4)',
          } : {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            boxShadow: '0 0 30px rgba(16,185,129,0.4)',
          }}
        >
          {selling ? '⏹ הפסק מכירה' : `💰 מכור ${sellAmount.toFixed(1)} kWh עכשיו`}
        </motion.button>
      </div>
    </div>
  );
}