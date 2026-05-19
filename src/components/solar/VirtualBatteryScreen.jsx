import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, Search, CheckCircle2, Loader2, Zap, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ── Onboarding step config ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'פרטים אישיים',        labelShort: 'פרטים',   pct: 25  },
  { id: 2, label: 'סנכרון נגה',           labelShort: 'נגה',     pct: 50  },
  { id: 3, label: 'מכשירים חכמים',        labelShort: 'מכשירים', pct: 75  },
  { id: 4, label: 'הפעלה',                labelShort: 'הפעלה',   pct: 100 },
];

const DEVICE_CATEGORIES = [
  { icon: '☀️', label: 'סוללות וממירים',    sub: 'SolarEdge, BYD, Tesla' },
  { icon: '🔌', label: 'בקרים חכמים',       sub: 'Shelly, Sonoff' },
  { icon: '🚗', label: 'עמדות טעינה EV',    sub: 'Tesla, Wallbox' },
];

const PAIRED_DEVICES = [
  { icon: '☀️', name: 'SolarEdge SE10K',    type: 'ממיר',      connected: true  },
  { icon: '💡', name: 'Shelly Pro 4PM',      type: 'בקר חכם',   connected: true  },
  { icon: '🚗', name: 'Wallbox Pulsar Plus', type: 'עמדת EV',   connected: false },
];

// ── Battery SVG ────────────────────────────────────────────────────────────
function BatteryVisual({ pct }) {
  const fillH = Math.round(pct * 1.4); // max ~140px at 100%
  const color = pct >= 75 ? '#22c55e' : pct >= 50 ? '#10b981' : pct >= 25 ? '#f59e0b' : '#ef4444';
  const glow  = pct >= 50 ? 'rgba(34,197,94,0.4)' : 'rgba(245,158,11,0.4)';

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Battery cap */}
      <div className="w-10 h-3 rounded-t-lg" style={{ background: 'rgba(255,255,255,0.12)' }} />
      {/* Body */}
      <div className="relative w-24 h-40 rounded-3xl overflow-hidden"
        style={{ border: `2px solid ${color}55`, background: 'rgba(255,255,255,0.04)' }}>
        {/* Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0"
          style={{ background: `linear-gradient(180deg, ${color}dd, ${color}88)`, boxShadow: `0 0 24px ${glow}` }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Segment lines */}
        {[25, 50, 75].map(s => (
          <div key={s} className="absolute left-0 right-0 h-px" style={{ bottom: `${s}%`, background: 'rgba(255,255,255,0.08)', zIndex: 2 }} />
        ))}
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
          <motion.p
            key={pct}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black text-white drop-shadow-lg"
          >
            {pct}%
          </motion.p>
        </div>
      </div>
    </div>
  );
}

// ── Roadmap ────────────────────────────────────────────────────────────────
function Roadmap({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full" dir="rtl">
      {STEPS.map((step, i) => {
        const done    = step.id < currentStep;
        const active  = step.id === currentStep;
        const future  = step.id > currentStep;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: done ? '#10b981' : active ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.06)',
                  border: done ? '2px solid #10b981' : active ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.12)',
                  boxShadow: active ? '0 0 12px rgba(34,197,94,0.4)' : 'none',
                }}
              >
                {done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <span className="text-[10px] font-black" style={{ color: active ? '#22c55e' : 'rgba(255,255,255,0.3)' }}>
                    {step.id}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold text-center leading-tight w-12"
                style={{ color: done ? '#10b981' : active ? '#22c55e' : 'rgba(255,255,255,0.25)' }}>
                {step.labelShort}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-1 mb-4"
                style={{ background: step.id < currentStep ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Step 2: Noga Sync Card ─────────────────────────────────────────────────
function NogaSyncCard({ onDone }) {
  const [syncing, setSyncing] = useState(false);
  const [done, setDone] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2000));
    setSyncing(false);
    setDone(true);
    toast.success('✅ סנכרון נגה הופעל בהצלחה!');
    setTimeout(() => onDone(), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4"
      style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.3)' }}
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(212,175,55,0.15)' }}>
          <span className="text-xl">📡</span>
        </div>
        <div>
          <p className="text-sm font-black text-white">סנכרון נתוני שוק (Noga ISO)</p>
          <p className="text-[10px] text-white/40 mt-0.5">חיבור לשוק האנרגיה הישראלי</p>
        </div>
      </div>

      <p className="text-xs text-white/55 leading-relaxed">
        ביצענו עבורך את החיבור הטכני. כל שנותר הוא להפעיל את הסנכרון כדי לאפשר לאלגוריתם למקסם את הרווחים שלך.
      </p>

      {done ? (
        <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-black text-emerald-400">הסנכרון פעיל ✓</span>
        </div>
      ) : (
        <button
          onClick={handleSync}
          disabled={syncing}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          style={{
            background: syncing ? 'rgba(212,175,55,0.15)' : 'linear-gradient(135deg, rgba(212,175,55,0.9), rgba(245,158,11,0.75))',
            border: '1px solid rgba(212,175,55,0.5)',
            boxShadow: syncing ? 'none' : '0 0 28px rgba(212,175,55,0.25)',
            color: syncing ? 'rgba(255,255,255,0.5)' : '#0a0a0a',
          }}
        >
          {syncing
            ? <><Loader2 className="w-4 h-4 animate-spin" style={{ color: 'rgba(255,255,255,0.5)' }} /> מסנכרן...</>
            : <>⚡ הפעלת סנכרון נגה</>}
        </button>
      )}

      <p className="text-[10px] text-white/25 text-center leading-relaxed">
        🔒 החיבור מאובטח בתקני נגה המחמירים. המפתחות הסודיים שלך אינם נחשפים.
      </p>
    </motion.div>
  );
}

// ── Step 3: Smart Devices Card ─────────────────────────────────────────────
function SmartDevicesCard({ onDone }) {
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => { setScanning(false); setScanDone(true); toast.success('🔍 נמצאו 3 מכשירים ברשת!'); }, 2400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-4" dir="rtl"
    >
      {/* Auto-scan card */}
      <div className="rounded-2xl p-5 space-y-4"
        style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.25)' }}>
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex-shrink-0">
            {scanning && [0, 1].map(i => (
              <motion.div key={i}
                className="absolute inset-0 rounded-full border border-blue-400"
                animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, delay: i * 0.8, repeat: Infinity }}
              />
            ))}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(96,165,250,0.15)', position: 'relative' }}>
              <Search className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <p className="text-sm font-black text-white">איתור אוטומטי ברשת</p>
            <p className="text-[10px] text-white/40 mt-0.5">Shelly EM, ממירים, בקרים חכמים</p>
          </div>
        </div>

        <button
          onClick={handleScan}
          disabled={scanning}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          style={{
            background: scanning ? 'rgba(96,165,250,0.12)' : 'linear-gradient(135deg, rgba(96,165,250,0.8), rgba(96,165,250,0.55))',
            border: '1px solid rgba(96,165,250,0.4)',
            boxShadow: scanning ? 'none' : '0 0 24px rgba(96,165,250,0.2)',
            color: scanning ? 'rgba(255,255,255,0.4)' : '#060e1a',
          }}
        >
          {scanning
            ? <><Loader2 className="w-4 h-4 animate-spin" style={{ color: 'rgba(255,255,255,0.4)' }} /> סורק...</>
            : <>🔍 סרוק מכשירים ברשת הביתית</>}
        </button>

        <AnimatePresence>
          {scanDone && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-2">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">נמצאו מכשירים</p>
              {PAIRED_DEVICES.map((d, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <span className="text-base">{d.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-black text-white">{d.name}</p>
                    <p className="text-[10px] text-white/35">{d.type}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.connected ? '#10b981' : '#ef4444' }} />
                    <span className="text-[10px] font-bold" style={{ color: d.connected ? '#34d399' : '#f87171' }}>
                      {d.connected ? 'מחובר' : 'מנותק'}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manual categories */}
      <div className="space-y-2">
        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">חיבור ידני לפי קטגוריה</p>
        {DEVICE_CATEGORIES.map((cat, i) => (
          <button key={i}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all active:scale-[0.98]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-xl">{cat.icon}</span>
            <div className="text-right flex-1">
              <p className="text-sm font-black text-white">{cat.label}</p>
              <p className="text-[10px] text-white/35">{cat.sub}</p>
            </div>
            <span className="text-white/20 text-sm">←</span>
          </button>
        ))}
      </div>

      <button
        onClick={onDone}
        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-[0.98]"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(16,185,129,0.55))',
          border: '1px solid rgba(16,185,129,0.4)',
          boxShadow: '0 0 24px rgba(16,185,129,0.2)',
        }}
      >
        ⚡ המשך להפעלה
      </button>
    </motion.div>
  );
}

// ── Step 4: Activation Card ────────────────────────────────────────────────
function ActivationCard() {
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleActivate = async () => {
    setActivating(true);
    await new Promise(r => setTimeout(r, 2000));
    setActivating(false);
    setActivated(true);
    toast.success('🎉 הסוללה הווירטואלית פעילה!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-5 space-y-4 text-right"
      style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.3)' }}
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(16,185,129,0.2)' }}>
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-black text-white">הפעלת הסוללה הווירטואלית</p>
          <p className="text-[10px] text-white/40 mt-0.5">שלב אחרון — הפעל ותתחיל לייצר רווחים</p>
        </div>
      </div>

      {activated ? (
        <div className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-black text-emerald-400">🎉 המערכת פעילה ומייצרת רווחים!</span>
        </div>
      ) : (
        <button
          onClick={handleActivate}
          disabled={activating}
          className="w-full py-4 rounded-2xl font-black text-white text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          style={{
            background: activating ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #10b981, #059669)',
            border: '1px solid rgba(16,185,129,0.5)',
            boxShadow: activating ? 'none' : '0 0 32px rgba(16,185,129,0.35)',
          }}
        >
          {activating
            ? <><Loader2 className="w-4 h-4 animate-spin" /> מפעיל...</>
            : <>⚡ הפעל עכשיו</>}
        </button>
      )}
    </motion.div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────
export default function VirtualBatteryScreen() {
  const [currentStep, setCurrentStep] = useState(2); // Start at Noga sync
  const activePct = STEPS.find(s => s.id === currentStep)?.pct ?? 25;
  const isFullyConnected = currentStep > 4;

  return (
    <div className="space-y-6 pb-24 pt-2" dir="rtl">

      {/* ── Header + Battery ────────────────────────────── */}
      <div className="flex flex-col items-center gap-5 pt-2">
        <h1 className="text-xl font-black text-white text-center">הסוללה הווירטואלית שלי</h1>

        <BatteryVisual pct={activePct} />

        {/* Status line */}
        <motion.p
          key={activePct}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-center leading-relaxed"
          style={{ color: isFullyConnected ? '#34d399' : 'rgba(255,255,255,0.5)' }}
        >
          {isFullyConnected
            ? '🟢 המערכת פועלת ומייצרת רווחים'
            : '🔴 המערכת כבויה — השלם חיבור למקסום רווחים'}
        </motion.p>
      </div>

      {/* ── Roadmap ─────────────────────────────────────── */}
      <Roadmap currentStep={currentStep} />

      {/* ── Active Task Card ─────────────────────────────── */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-5 space-y-3 text-right"
              style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.25)' }}
              dir="rtl"
            >
              <p className="text-sm font-black text-white">פרטים אישיים</p>
              <p className="text-xs text-white/50 leading-relaxed">אשר את הפרטים שלך לחיבור המערכת.</p>
              <button onClick={() => setCurrentStep(2)}
                className="w-full py-4 rounded-2xl font-black text-white text-base transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.8), rgba(139,92,246,0.6))', border: '1px solid rgba(167,139,250,0.4)' }}>
                ✓ אשר פרטים והמשך
              </button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <NogaSyncCard onDone={() => setCurrentStep(3)} />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SmartDevicesCard onDone={() => setCurrentStep(4)} />
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ActivationCard />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── WhatsApp Support ─────────────────────────────── */}
      <a
        href="https://wa.me/972501234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95"
        style={{ background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      >
        <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.44.636 4.726 1.748 6.712L2 30l7.52-1.714A13.934 13.934 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.56 11.56 0 01-5.9-1.614l-.42-.252-4.466 1.016 1.04-4.342-.276-.442A11.566 11.566 0 014.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.358-8.656c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.104 1.366-.204.232-.406.26-.754.086-.348-.174-1.47-.542-2.8-1.728-1.034-.924-1.732-2.064-1.936-2.412-.204-.348-.022-.536.154-.71.158-.156.348-.406.522-.61.174-.202.232-.348.348-.58.116-.232.058-.436-.028-.61-.088-.174-.784-1.888-1.074-2.586-.282-.68-.57-.586-.784-.598l-.668-.012c-.232 0-.61.086-.928.432s-1.218 1.19-1.218 2.9c0 1.71 1.246 3.36 1.42 3.594.174.232 2.452 3.744 5.942 5.248.83.358 1.478.572 1.982.732.832.264 1.59.226 2.188.138.668-.1 2.06-.842 2.352-1.656.29-.812.29-1.51.202-1.656-.086-.144-.318-.232-.666-.406z"/>
        </svg>
      </a>
    </div>
  );
}