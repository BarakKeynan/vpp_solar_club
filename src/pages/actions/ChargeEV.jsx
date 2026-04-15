import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, ArrowRight, Zap, Clock, CheckCircle2, Home, Battery, TrendingDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EV_MODES = [
  {
    key: 'charge',
    emoji: '⚡',
    title: 'טעינה',
    subtitle: 'טען את הרכב מהסוללה/שמש',
    desc: 'אנרגיה זורמת מהפאנלים / סוללת הבית אל הרכב. חינמית כשהשמש זורחת.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.4)',
  },
  {
    key: 'v2h',
    emoji: '🏠',
    title: 'פריקה לבית (V2H)',
    subtitle: 'הרכב מספק חשמל לבית',
    desc: 'בשעות שיא או הפסקות חשמל — הרכב פועל כסוללת גיבוי לבית. כל טעינה מלאה = ~3 ימי חשמל לבית ממוצע.',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.4)',
  },
  {
    key: 'v2g',
    emoji: '🔋',
    title: 'מכירה לרשת (V2G)',
    subtitle: 'הרכב מוכר אנרגיה לרשת הציבורית',
    desc: 'בשעות שיא (18:00-21:00) הרכב מזרים חשמל חזרה לרשת ב-0.72 ₪/kWh — פי 3 ממחיר הקנייה.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.4)',
  },
];

const CHARGE_SOURCES = [
  { key: 'solar', label: '☀️ פאנלים', cost: '0 ₪', color: '#f59e0b' },
  { key: 'battery', label: '🔋 סוללת בית', cost: '0 ₪', color: '#10b981' },
  { key: 'grid', label: '🔌 רשת', cost: '0.61 ₪', color: '#94a3b8' },
];

export default function ChargeEV() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('charge');
  const [active, setActive] = useState(false);
  const [evPct, setEvPct] = useState(34);
  const [done, setDone] = useState(false);
  const [chargeSource, setChargeSource] = useState('solar');
  const [targetPct, setTargetPct] = useState(80);
  const [showInfo, setShowInfo] = useState(false);

  const currentMode = EV_MODES.find(m => m.key === mode);

  useEffect(() => {
    if (!active) return;
    if (mode === 'charge') {
      if (evPct >= targetPct) { setDone(true); setActive(false); return; }
      const t = setTimeout(() => setEvPct(p => Math.min(p + 1, targetPct)), 130);
      return () => clearTimeout(t);
    } else {
      // discharge
      if (evPct <= 20) { setDone(true); setActive(false); return; }
      const t = setTimeout(() => setEvPct(p => Math.max(p - 1, 20)), 130);
      return () => clearTimeout(t);
    }
  }, [active, evPct, mode, targetPct]);

  const range = Math.round(evPct * 4.8);
  const minutesLeft = mode === 'charge'
    ? Math.round((targetPct - evPct) * 1.1)
    : Math.round((evPct - 20) * 1.1);

  const barColor = evPct > 60 ? '#10b981' : evPct > 30 ? '#f59e0b' : '#ef4444';

  const v2gRevenue = ((evPct - 20) / 100 * 75 * 0.72).toFixed(0); // 75kWh battery
  const v2hHours = Math.round((evPct - 20) / 100 * 75 / 1.2); // 1.2kW avg home

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">רכב חשמלי — מרכז אנרגיה</h1>
        <button onClick={() => setShowInfo(v => !v)} className="mr-auto p-2 rounded-xl bg-muted">
          <Info className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-36">

        {/* Info Banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden rounded-2xl p-4 text-right"
              style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)' }}>
              <p className="text-xs font-black text-blue-300 mb-2">🚗 הרכב החשמלי כמצבר אנרגיה</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                הרכב החשמלי שלך הוא לא רק תחבורה — הוא סוללה ניידת של 60-100 kWh. <br /><br />
                <strong className="text-white">טעינה (Charge):</strong> אנרגיה מהשמש/סוללה → רכב<br />
                <strong className="text-white">פריקה לבית (V2H):</strong> רכב → מספק חשמל לבית בהפסקות / שעות שיא<br />
                <strong className="text-white">מכירה לרשת (V2G):</strong> רכב → מוכר אנרגיה חזרה לרשת הציבורית ברווח<br /><br />
                ביחד, הרכב משתלב במכלול האנרגיה הביתי ומגדיל את ה-ROI הכולל של המערכת.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EV Status Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div animate={{ color: active ? '#f59e0b' : '#94a3b8' }}>
                <Car className="w-6 h-6" />
              </motion.div>
              {active && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background: `${currentMode.bg}`, color: currentMode.color, border: `1px solid ${currentMode.border}` }}>
                  {currentMode.emoji} {mode === 'charge' ? 'טוען' : mode === 'v2h' ? 'מספק לבית' : 'מוכר לרשת'}
                </motion.span>
              )}
            </div>
            <div className="text-right">
              <motion.p key={evPct} initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                className="text-4xl font-black" style={{ color: barColor }}>{evPct}%</motion.p>
              <p className="text-[10px] text-white/40">{range} ק"מ טווח</p>
            </div>
          </div>

          <div className="h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div animate={{ width: `${evPct}%` }} transition={{ duration: 0.4 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: `linear-gradient(90deg, ${barColor}70, ${barColor})` }}>
              {active && (
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm font-black text-white">{minutesLeft} דק'</p>
              <p className="text-[10px] text-white/30">{mode === 'charge' ? 'לטעינה' : 'לפריקה'}</p>
            </div>
            <div>
              <p className="text-sm font-black text-accent">7.4 kW</p>
              <p className="text-[10px] text-white/30">עצמה</p>
            </div>
            <div>
              <p className="text-sm font-black" style={{ color: barColor }}>
                {Math.round(evPct * 0.75)} kWh
              </p>
              <p className="text-[10px] text-white/30">אנרגיה</p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="space-y-2">
          <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">בחר פעולה</p>
          {EV_MODES.map(m => {
            const isActive = mode === m.key;
            return (
              <button key={m.key}
                onClick={() => { setMode(m.key); setDone(false); setActive(false); }}
                className="w-full p-4 rounded-2xl text-right transition-all active:scale-[0.98]"
                style={{
                  background: isActive ? m.bg : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${isActive ? m.border : 'rgba(255,255,255,0.07)'}`,
                }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-black" style={{ color: isActive ? m.color : 'rgba(255,255,255,0.7)' }}>
                      {m.title}
                    </p>
                    <p className="text-[11px] text-white/40">{m.subtitle}</p>
                    {isActive && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[11px] text-white/55 mt-1.5 leading-relaxed">{m.desc}</motion.p>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center`}
                    style={{ borderColor: isActive ? m.color : 'rgba(255,255,255,0.2)' }}>
                    {isActive && <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Charge Source (only in charge mode) */}
        <AnimatePresence>
          {mode === 'charge' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-2">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">מקור טעינה</p>
              <div className="grid grid-cols-3 gap-2">
                {CHARGE_SOURCES.map(src => (
                  <button key={src.key} onClick={() => setChargeSource(src.key)}
                    className="p-3 rounded-xl text-center transition-all"
                    style={{
                      background: chargeSource === src.key ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${chargeSource === src.key ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    <p className="text-xs font-bold text-white">{src.label}</p>
                    <p className="text-[10px] font-black mt-0.5" style={{ color: src.color }}>{src.cost}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-xl p-3 space-y-2"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-white">{targetPct}%</span>
                  <span className="text-[11px] text-white/40">יעד טעינה</span>
                </div>
                <input type="range" min={evPct + 1} max={100} step={5} value={targetPct}
                  onChange={e => setTargetPct(Number(e.target.value))}
                  className="w-full accent-amber-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* V2G / V2H Revenue Preview */}
        <AnimatePresence>
          {(mode === 'v2g' || mode === 'v2h') && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-2xl p-4 space-y-3"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-widest text-right">
                {mode === 'v2g' ? 'פוטנציאל הכנסה' : 'גיבוי זמין'}
              </p>
              {mode === 'v2g' ? (
                <div className="flex items-center justify-between">
                  <TrendingDown className="w-5 h-5 text-primary" />
                  <div className="text-right">
                    <p className="text-2xl font-black text-primary">+₪{v2gRevenue}</p>
                    <p className="text-[10px] text-white/40">הכנסה מהיום · @0.72 ₪/kWh</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <Home className="w-5 h-5 text-blue-400" />
                  <div className="text-right">
                    <p className="text-2xl font-black text-blue-400">{v2hHours} שעות</p>
                    <p className="text-[10px] text-white/40">חשמל לבית ממוצע</p>
                  </div>
                </div>
              )}
              <p className="text-[11px] text-white/50 leading-relaxed">
                {mode === 'v2g'
                  ? `מבוסס על ${Math.round((evPct - 20) * 0.75)} kWh פנויים לפריקה. הרכב ישמור 20% לנסיעה.`
                  : `הרכב יספק אנרגיה לבית ויישאר עם 20% מינימום לנסיעה חירום.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Tip */}
        <div className="rounded-2xl p-4 flex gap-3"
          style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
          <span className="text-xl">🤖</span>
          <div>
            <p className="text-xs font-black text-violet-300 mb-1">המלצת AI</p>
            <p className="text-[11px] text-white/60 leading-relaxed">
              {mode === 'charge'
                ? 'טעינה אופטימלית: 08:00-14:00 מהשמש. הרכב טעון ב-80% עד אחה"צ, עלות 0 ₪.'
                : mode === 'v2g'
                  ? 'שעות שיא היום: 18:00-21:00. מכירה כעת תניב ₪' + v2gRevenue + ' תוך 3 שעות.'
                  : 'הרכב יכסה את הבית ב-' + v2hHours + ' שעות גיבוי. מומלץ לשמור 30% לנסיעות בוקר.'}
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-20 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] text-white/40">
            {currentMode.emoji} {currentMode.title} · {evPct}% ({range} ק"מ)
          </span>
        </div>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-primary font-black text-lg">
                {mode === 'charge' ? 'הרכב טעון!' : mode === 'v2h' ? 'הבית מסופק!' : 'מכירה הושלמה!'}
              </span>
            </motion.div>
          ) : (
            <motion.button key="btn" whileTap={{ scale: 0.96 }}
              onClick={() => setActive(a => !a)}
              className="w-full py-4 rounded-2xl font-black text-lg"
              style={active ? {
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)'
              } : {
                background: mode === 'charge'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : mode === 'v2h'
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                boxShadow: '0 0 30px rgba(16,185,129,0.3)',
              }}>
              {active ? '⏸ עצור'
                : mode === 'charge' ? '⚡ התחל טעינה'
                  : mode === 'v2h' ? '🏠 הפעל גיבוי לבית'
                    : '💰 התחל מכירה לרשת'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}