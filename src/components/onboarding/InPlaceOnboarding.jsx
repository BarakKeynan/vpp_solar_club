import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, MapPin, Zap, CheckCircle2, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INVERTER = {
  model: 'SolarEdge Smart Inverter SE10K',
  image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=600&q=80',
  brand: 'SolarEdge',
  power: '10 kW',
};

const SCAN_STEPS = [
  { icon: Bluetooth, label: 'סריקת Bluetooth לממירים חכמים...', duration: 1800 },
  { icon: MapPin, label: 'בדיקת מיקום GPS...', duration: 1400 },
  { icon: Zap, label: 'ממיר נמצא! מאמת חיבור...', duration: 1200 },
];

function PulsingRing() {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-cyan-400"
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <div className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(34,211,238,0.12)', border: '2px solid rgba(34,211,238,0.5)' }}>
        <Bluetooth className="w-7 h-7 text-cyan-400" />
      </div>
    </div>
  );
}

function ScanningStep({ onDone }) {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    let idx = 0;
    const advance = () => {
      idx++;
      if (idx < SCAN_STEPS.length) {
        setStepIdx(idx);
        setTimeout(advance, SCAN_STEPS[idx].duration);
      } else {
        setTimeout(onDone, 600);
      }
    };
    setTimeout(advance, SCAN_STEPS[0].duration);
  }, []);

  const current = SCAN_STEPS[stepIdx];
  const Icon = current.icon;

  return (
    <motion.div
      key="scanning"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center gap-8"
    >
      <PulsingRing />
      <div className="space-y-3">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Icon className="w-4 h-4 text-cyan-400" />
          <p className="text-sm font-bold text-white">{current.label}</p>
        </motion.div>
        <div className="flex justify-center gap-2 pt-1">
          {SCAN_STEPS.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i <= stepIdx ? 'w-5 bg-cyan-400' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function FoundStep({ onConnect, connecting }) {
  return (
    <motion.div
      key="found"
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center gap-5"
    >
      {/* Success ring */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.5)' }}
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="w-36 h-36 rounded-2xl overflow-hidden"
        style={{ border: '2px solid rgba(52,211,153,0.3)', boxShadow: '0 0 30px rgba(52,211,153,0.15)' }}
      >
        <img src={INVERTER.image} alt={INVERTER.model} className="w-full h-full object-cover" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1">
        <p className="text-xs font-bold text-emerald-400">✅ מצאנו את הממיר שלך!</p>
        <h2 className="text-lg font-black text-white">{INVERTER.model}</h2>
        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: 'rgba(52,211,153,0.8)', border: '1px solid rgba(52,211,153,0.25)' }}>
            {INVERTER.brand}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,211,238,0.1)', color: 'rgba(34,211,238,0.8)', border: '1px solid rgba(34,211,238,0.25)' }}>
            {INVERTER.power}
          </span>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        onClick={onConnect}
        disabled={connecting}
        className="w-full max-w-xs py-4 rounded-2xl font-black text-white text-base transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        style={{
          background: connecting ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 28%))',
          border: '1px solid rgba(52,211,153,0.5)',
          boxShadow: connecting ? 'none' : '0 0 30px rgba(52,211,153,0.3)',
        }}
      >
        {connecting ? <><Loader2 className="w-4 h-4 animate-spin" /> מתחבר...</> : <>⚡ One-Click Connect</>}
      </motion.button>
      <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>חיבור מאובטח · SSL מוצפן</p>
    </motion.div>
  );
}

function SuccessStep() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center gap-5"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.6 }}
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.5)' }}
      >
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </motion.div>
      <div className="space-y-1">
        <h2 className="text-xl font-black text-white">המערכת מחוברת! 🎉</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>טוען נתונים בזמן אמת...</p>
      </div>
      <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
    </motion.div>
  );
}

// ── Main Modal Export ──────────────────────────────────────────────────────
export default function InPlaceOnboarding({ onDone, onClose }) {
  const [step, setStep] = useState('scanning'); // scanning | found | success
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await base44.functions.invoke('completeOnboarding', { inverter_model: INVERTER.model });
    setConnecting(false);
    setStep('success');
    setTimeout(() => onDone(), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ backdropFilter: 'blur(18px)', background: 'rgba(2,8,20,0.88)' }}
    >
      {/* Cyan ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 35%, rgba(34,211,238,0.08) 0%, transparent 65%)',
      }} />

      {/* Close button — only before success */}
      {step !== 'success' && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      )}

      {/* Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="relative w-full max-w-sm rounded-3xl p-7 flex flex-col items-center gap-6"
        style={{
          background: 'rgba(8,16,36,0.92)',
          border: '1px solid rgba(34,211,238,0.18)',
          boxShadow: '0 0 60px rgba(0,0,0,0.6), 0 0 80px rgba(34,211,238,0.06)',
        }}
      >
        {/* Header label */}
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(34,211,238,0.6)' }}>
            VPP Solar Club
          </p>
          <p className="text-sm font-bold text-white/50 mt-0.5">חיבור מערכת סולארית</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'scanning' && <ScanningStep key="scanning" onDone={() => setStep('found')} />}
          {step === 'found' && <FoundStep key="found" onConnect={handleConnect} connecting={connecting} />}
          {step === 'success' && <SuccessStep key="success" />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}