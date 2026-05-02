import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Leaf, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOURCES = [
  {
    key: 'solar',
    emoji: '☀️',
    title: 'פאנלים סולאריים',
    subtitle: 'ישיר מהגג שלך',
    available: '4.2 kW זמין',
    cost: '0 ₪/kWh',
    costColor: '#10b981',
    tag: 'חינם',
    tagBg: 'rgba(16,185,129,0.15)',
    tagColor: '#10b981',
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.07)',
    desc: 'השמש מייצרת עכשיו 4.2 kW. עדיפות ראשונה לטעינה חינמית.',
  },
  {
    key: 'farm',
    emoji: '🌾',
    title: 'חווה סולארית',
    subtitle: 'מניות אנרגיה שלך',
    available: '2.8 kW מוקצה',
    cost: '0.18 ₪/kWh',
    costColor: '#60a5fa',
    tag: 'מועדפון',
    tagBg: 'rgba(96,165,250,0.15)',
    tagColor: '#60a5fa',
    border: 'rgba(96,165,250,0.4)',
    bg: 'rgba(96,165,250,0.06)',
    desc: 'אנרגיה ממניות שרכשת בחווה הסולארית הקהילתית. זולה פי 3 מהרשת.',
  },
  {
    key: 'grid',
    emoji: '🔌',
    title: 'רשת חשמל',
    subtitle: 'IEC / ספק פרטי',
    available: 'ללא הגבלה',
    cost: '0.61 ₪/kWh',
    costColor: '#f59e0b',
    tag: 'יקר יותר',
    tagBg: 'rgba(245,158,11,0.12)',
    tagColor: '#f59e0b',
    border: 'rgba(245,158,11,0.3)',
    bg: 'rgba(245,158,11,0.04)',
    desc: 'גיבוי אמין בכל שעה. מומלץ רק אם אין אנרגיה ממקורות ירוקים.',
  },
];

const BATTERIES = [
  { id: 1, name: 'סוללה ראשית', model: 'Tesla Powerwall 2', capacity: 13.5, level: 82 },
  { id: 2, name: 'סוללה שניונית', model: 'BYD HVM 11.0', capacity: 11.0, level: 61 },
];

// AI logic: pick best source + target based on current "conditions"
function calcAiRecommendation(battery) {
  const hour = new Date().getHours();
  const gridPrice = 0.61;
  const solarAvailable = hour >= 7 && hour <= 18;
  const peakHour = hour >= 17 && hour <= 21;
  const offPeak = hour >= 23 || hour <= 6;

  if (solarAvailable) {
    return { source: 'solar', target: 95, reason: `שמש זמינה (${hour}:00) — טעינה חינמית. מומלץ לטעון עד 95% לפני שעת שיא ב-${peakHour ? 'עכשיו' : '20:00'}.` };
  } else if (offPeak) {
    return { source: 'grid', target: 80, reason: `שעות שפל (${hour}:00) — מחיר רשת נמוך 0.28 ₪/kWh. כדאי לטעון עד 80%.` };
  } else if (peakHour) {
    return { source: 'farm', target: 70, reason: `שעת שיא — השתמש באנרגיית החווה בלבד. הימנע מרשת (${gridPrice} ₪/kWh).` };
  } else {
    return { source: 'farm', target: 85, reason: 'אין שמש כעת. אנרגיית החווה היא האופציה הזולה — מומלץ לטעון עד 85%.' };
  }
}

export default function ChargeBattery() {
  const navigate = useNavigate();
  const [charging, setCharging] = useState(false);
  const [selectedSource, setSelectedSource] = useState('solar');
  const [selectedBattery, setSelectedBattery] = useState(BATTERIES[0]);
  const [targetPct, setTargetPct] = useState(95);
  const [progress, setProgress] = useState(selectedBattery.level);
  const [done, setDone] = useState(false);
  const [aiApplied, setAiApplied] = useState(false);

  const aiRec = calcAiRecommendation(selectedBattery);

  const applyAiRecommendation = () => {
    setSelectedSource(aiRec.source);
    setTargetPct(aiRec.target);
    setAiApplied(true);
    setTimeout(() => setAiApplied(false), 3000);
  };

  useEffect(() => {
    if (!charging) return;
    if (progress >= targetPct) { setDone(true); setCharging(false); return; }
    const t = setTimeout(() => setProgress(p => Math.min(p + 1, targetPct)), 120);
    return () => clearTimeout(t);
  }, [charging, progress, targetPct]);

  const source = SOURCES.find(s => s.key === selectedSource);
  const availableKwh = (selectedBattery.capacity * (targetPct - progress) / 100).toFixed(1);
  const costPerKwh = selectedSource === 'solar' ? 0 : selectedSource === 'farm' ? 0.18 : 0.61;
  const estimatedCost = (availableKwh * costPerKwh).toFixed(2);
  const minutesLeft = Math.round((targetPct - progress) * 0.9);
  const barColor = progress > 80 ? '#10b981' : progress > 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">טעינת סוללה</h1>
        <div className="mr-auto flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${charging ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-xs font-bold ${charging ? 'text-primary' : 'text-muted-foreground'}`}>
            {charging ? 'טוען...' : 'ממתין'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-36">

        {/* Battery Visual */}
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full justify-between">
            <div className="text-right">
              <p className="text-sm font-black text-white">{selectedBattery.name}</p>
              <p className="text-[11px] text-white/40">{selectedBattery.model} · {selectedBattery.capacity} kWh</p>
            </div>
            <div className="text-center">
              <motion.p key={progress} initial={{ scale: 0.85 }} animate={{ scale: 1 }}
                className="text-4xl font-black" style={{ color: barColor }}>
                {progress}%
              </motion.p>
              <p className="text-[10px] text-white/40">{(progress / 100 * selectedBattery.capacity).toFixed(1)} kWh</p>
            </div>
          </div>
          <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
              className="h-full rounded-full relative overflow-hidden"
              style={{ background: `linear-gradient(90deg, ${barColor}80, ${barColor})` }}>
              {charging && (
                <motion.div animate={{ x: ['-100%', '200%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              )}
            </motion.div>
          </div>
          {/* Target marker */}
          <div className="w-full flex items-center justify-between text-[10px] text-white/40">
            <span>כעת: {progress}%</span>
            <span>יעד: {targetPct}%</span>
          </div>
        </div>

        {/* Battery selector */}
        <div className="grid grid-cols-2 gap-2">
          {BATTERIES.map(bat => (
            <button key={bat.id} onClick={() => { setSelectedBattery(bat); setProgress(bat.level); setDone(false); setCharging(false); }}
              className="p-3 rounded-2xl text-right transition-all"
              style={{
                background: selectedBattery.id === bat.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${selectedBattery.id === bat.id ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              <p className="text-xs font-black text-white">{bat.name}</p>
              <p className="text-[10px] text-white/40">{bat.level}% · {bat.capacity} kWh</p>
            </button>
          ))}
        </div>

        {/* Source Selector */}
        <div className="space-y-2">
          <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">בחר מקור טעינה</p>
          {SOURCES.map(src => {
            const active = selectedSource === src.key;
            return (
              <button key={src.key} onClick={() => setSelectedSource(src.key)}
                className="w-full p-4 rounded-2xl text-right transition-all active:scale-[0.98]"
                style={{
                  background: active ? src.bg : 'rgba(255,255,255,0.02)',
                  border: `1.5px solid ${active ? src.border : 'rgba(255,255,255,0.07)'}`,
                }}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{src.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-black text-white">{src.title}</p>
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: src.tagBg, color: src.tagColor }}>{src.tag}</span>
                    </div>
                    <p className="text-[11px] text-white/40">{src.subtitle} · {src.available}</p>
                    {active && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-[11px] text-white/60 mt-1.5 leading-relaxed">{src.desc}</motion.p>
                    )}
                  </div>
                  <div className="text-left flex-shrink-0">
                    <p className="text-sm font-black" style={{ color: src.costColor }}>{src.cost}</p>
                    <p className="text-[9px] text-white/30">לkWh</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Target % Slider */}
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-primary">{targetPct}%</span>
            <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">יעד טעינה</p>
          </div>
          <input type="range" min={progress + 1} max={100} step={5} value={targetPct}
            onChange={e => setTargetPct(Number(e.target.value))}
            className="w-full accent-emerald-400" />
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'כמות', value: `${availableKwh} kWh` },
              { label: 'זמן', value: `${minutesLeft} דק'`, icon: Clock },
              { label: 'עלות', value: `₪${estimatedCost}`, color: costPerKwh === 0 ? 'text-primary' : 'text-accent' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-2 text-center"
                style={{ background: 'rgba(255,255,255,0.04)' }}>
                <p className={`text-sm font-black ${s.color || 'text-white'}`}>{s.value}</p>
                <p className="text-[10px] text-white/30">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tip */}
        <div className="rounded-2xl p-4 space-y-3"
          style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)' }}>
          <div className="flex gap-3">
            <span className="text-xl">🤖</span>
            <div className="flex-1">
              <p className="text-xs font-black text-violet-300 mb-0.5">המלצת AI</p>
              <p className="text-[11px] text-white/60 leading-relaxed">{aiRec.reason}</p>
              <div className="flex items-center gap-2 mt-2 text-[10px] text-white/35">
                <span>מקור מומלץ: <span className="text-violet-300 font-bold">{SOURCES.find(s=>s.key===aiRec.source)?.title}</span></span>
                <span>·</span>
                <span>יעד: <span className="text-violet-300 font-bold">{aiRec.target}%</span></span>
              </div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {aiApplied ? (
              <motion.div key="applied"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
                style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-400">ההמלצה יושמה!</span>
              </motion.div>
            ) : (
              <motion.button key="apply" whileTap={{ scale: 0.96 }}
                onClick={applyAiRecommendation}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(167,139,250,0.2))', border: '1px solid rgba(167,139,250,0.5)', boxShadow: '0 0 20px rgba(139,92,246,0.2)' }}>
                <span className="text-sm">✨</span>
                <span className="text-xs font-black text-violet-200">יישם המלצה</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Savings summary */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-lg font-black text-primary">
              {selectedSource === 'solar' ? '₪0' : selectedSource === 'farm' ? '₪1.20' : '₪4.10'}
            </p>
            <p className="text-[10px] text-white/40">עלות טעינה</p>
          </div>
          <div className="rounded-xl p-3 text-center"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Leaf className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-sm font-black text-primary">100% ירוק</p>
            <p className="text-[10px] text-white/40">אנרגיה נקייה</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-20 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-black text-primary">
            {done ? '✓ הסוללה טעונה!' : `${source.emoji} ${source.title}`}
          </span>
          <span className="text-[11px] text-white/40">{selectedBattery.name} → {targetPct}%</span>
        </div>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-primary font-black text-lg">הסוללה טעונה!</span>
            </motion.div>
          ) : (
            <motion.button key="btn" whileTap={{ scale: 0.96 }}
              onClick={() => setCharging(c => !c)}
              className="w-full py-4 rounded-2xl font-black text-lg"
              style={charging ? {
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.1)'
              } : {
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', boxShadow: '0 0 30px rgba(16,185,129,0.4)',
              }}>
              {charging ? '⏸ עצור טעינה' : `⚡ התחל טעינה מ${source.title}`}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}