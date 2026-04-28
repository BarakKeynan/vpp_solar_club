import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Bluetooth, MapPin, Zap, CheckCircle2, Loader2 } from 'lucide-react';

// Steps: welcome → scanning → found → connecting → done
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

function PulsingRing({ color = 'cyan', size = 'lg' }) {
  const sz = size === 'lg' ? 'w-48 h-48' : 'w-32 h-32';
  const colorMap = {
    cyan: 'border-cyan-400',
    emerald: 'border-emerald-400',
  };
  return (
    <div className={`relative flex items-center justify-center ${sz}`}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 ${colorMap[color]}`}
          animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2.4, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <div className={`w-20 h-20 rounded-full flex items-center justify-center`}
        style={{ background: color === 'cyan' ? 'rgba(34,211,238,0.12)' : 'rgba(52,211,153,0.12)', border: `2px solid ${color === 'cyan' ? 'rgba(34,211,238,0.5)' : 'rgba(52,211,153,0.5)'}` }}>
        <Bluetooth className={`w-9 h-9 ${color === 'cyan' ? 'text-cyan-400' : 'text-emerald-400'}`} />
      </div>
    </div>
  );
}

// ── Welcome Screen ─────────────────────────────────────────────────────────
function WelcomeStep({ user, onStart }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      className="flex flex-col items-center text-center px-6 pt-16 gap-8"
    >
      {/* Logo */}
      <motion.img
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.7 }}
        src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/f004e2167_Screenshot_20260422_170358_Gallery.jpg"
        alt="VPP Solar Club"
        className="w-40 h-auto object-contain rounded-2xl"
        style={{ filter: 'drop-shadow(0 0 32px rgba(34,211,238,0.35))' }}
      />

      {/* Greeting */}
      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="text-3xl font-black text-white leading-snug"
        >
          ברוכים הבאים,<br />
          <span style={{ color: 'rgba(34,211,238,0.9)' }}>{user?.full_name?.split(' ')[0] || 'חבר'}</span>! ☀️
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="text-base leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          בואו נחבר את המערכת הסולארית שלך<br />
          ונתחיל לייעל את האנרגיה שלך.
        </motion.p>
      </div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-2"
      >
        {['⚡ חיסכון עד 60%', '🌱 100% ירוק', '🤖 AI חכם', '🔋 VPP Club'].map(item => (
          <span key={item} className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(34,211,238,0.08)', color: 'rgba(147,210,245,0.8)', border: '1px solid rgba(34,211,238,0.2)' }}>
            {item}
          </span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        onClick={onStart}
        className="w-full max-w-xs py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-95"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.22), rgba(52,211,153,0.18))',
          border: '1px solid rgba(34,211,238,0.45)',
          boxShadow: '0 0 40px rgba(34,211,238,0.2)',
        }}
      >
        חבר את המערכת שלי ←
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
        className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        תהליך אוטומטי · ללא צורך בידע טכני
      </motion.p>
    </motion.div>
  );
}

// ── Scanning Screen ────────────────────────────────────────────────────────
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
      className="flex flex-col items-center justify-center text-center px-6 gap-10 min-h-[60vh]"
    >
      <PulsingRing color="cyan" />

      <div className="space-y-3">
        <motion.div
          key={stepIdx}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2"
        >
          <Icon className="w-5 h-5 text-cyan-400" />
          <p className="text-base font-bold text-white">{current.label}</p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 pt-2">
          {SCAN_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= stepIdx ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Found Screen ───────────────────────────────────────────────────────────
function FoundStep({ onConnect, connecting }) {
  return (
    <motion.div
      key="found"
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center px-6 pt-8 gap-7"
    >
      {/* Success ring */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(52,211,153,0.12)', border: '2px solid rgba(52,211,153,0.5)' }}
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Inverter image */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="w-52 h-52 rounded-3xl overflow-hidden"
        style={{ border: '2px solid rgba(52,211,153,0.3)', boxShadow: '0 0 40px rgba(52,211,153,0.15)' }}
      >
        <img src={INVERTER.image} alt={INVERTER.model} className="w-full h-full object-cover" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
        <p className="text-sm font-bold" style={{ color: 'rgba(52,211,153,0.9)' }}>✅ מצאנו את הממיר שלך!</p>
        <h2 className="text-2xl font-black text-white">{INVERTER.model}</h2>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', color: 'rgba(52,211,153,0.8)', border: '1px solid rgba(52,211,153,0.25)' }}>
            {INVERTER.brand}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,211,238,0.1)', color: 'rgba(34,211,238,0.8)', border: '1px solid rgba(34,211,238,0.25)' }}>
            {INVERTER.power}
          </span>
        </div>
      </motion.div>

      {/* One-click connect button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        onClick={onConnect}
        disabled={connecting}
        className="w-full max-w-xs py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
        style={{
          background: connecting
            ? 'rgba(52,211,153,0.2)'
            : 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 28%))',
          border: '1px solid rgba(52,211,153,0.5)',
          boxShadow: connecting ? 'none' : '0 0 40px rgba(52,211,153,0.3)',
        }}
      >
        {connecting ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> מתחבר...</>
        ) : (
          <>⚡ One-Click Connect</>
        )}
      </motion.button>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>חיבור מאובטח · SSL מוצפן</p>
    </motion.div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────
function SuccessStep() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center px-6 gap-6 min-h-[60vh]"
    >
      <motion.div
        animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.6 }}
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(52,211,153,0.15)', border: '2px solid rgba(52,211,153,0.5)' }}
      >
        <CheckCircle2 className="w-14 h-14 text-emerald-400" />
      </motion.div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">המערכת מחוברת! 🎉</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>מעביר אותך ל-Command Center...</p>
      </div>
      <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
    </motion.div>
  );
}

// ── Main Onboarding Page ───────────────────────────────────────────────────
export default function Onboarding() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('welcome'); // welcome | scanning | found | success
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
    });
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    await base44.functions.invoke('completeOnboarding', { inverter_model: INVERTER.model });
    setConnecting(false);
    setStep('success');
    setTimeout(() => navigate('/vpp-command-center', { replace: true }), 2000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(160deg, rgba(2,8,20,0.94) 0%, rgba(4,14,32,0.90) 50%, rgba(2,10,22,0.97) 100%)' }}
      />
      {/* Cyan glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.09) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full py-8">
        <AnimatePresence mode="wait">
          {step === 'welcome' && <WelcomeStep key="welcome" user={user} onStart={() => setStep('scanning')} />}
          {step === 'scanning' && <ScanningStep key="scanning" onDone={() => setStep('found')} />}
          {step === 'found' && <FoundStep key="found" onConnect={handleConnect} connecting={connecting} />}
          {step === 'success' && <SuccessStep key="success" />}
        </AnimatePresence>
      </div>
    </div>
  );
}