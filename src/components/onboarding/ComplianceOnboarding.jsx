import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, PenLine, ChevronRight, Check, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const STORAGE_KEY = 'vpp_compliance_done';

const steps = [
  { id: 1, icon: '⚠️', titleHe: 'גילוי נאות', titleEn: 'Advisory Disclosure' },
  { id: 2, icon: '🏗️', titleHe: 'אישור בטיחות חומרה', titleEn: 'Hardware Safety' },
  { id: 3, icon: '✍️', titleHe: 'פרטיות וחתימה', titleEn: 'Privacy & Signature' },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black border-2 transition-all ${
            s.id < current ? 'bg-emerald-500 border-emerald-500 text-black' :
            s.id === current ? 'border-orange-500 text-orange-400' :
            'border-white/20 text-white/30'
          }`}>
            {s.id < current ? <Check className="w-4 h-4" /> : s.id}
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 rounded-full transition-all ${s.id < current ? 'bg-emerald-500' : 'bg-white/10'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Step1({ onNext, isHe }) {
  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl mb-3">⚠️</div>
        <h2 className="text-xl font-black" style={{ color: '#F97316' }}>
          {isHe ? 'גילוי נאות' : 'Advisory Disclosure'}
        </h2>
      </div>

      <div className="rounded-2xl p-5 space-y-4 text-sm leading-relaxed"
        style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.25)' }}>
        {isHe ? (
          <p className="text-white/80">
            <strong className="text-white">VPP Solar Club</strong> היא פלטפורמת ייעוץ מבוססת AI.
            על ידי הפעלת האופטימיזציה, אתה מאשר כי כל הפעולות הפיזיות
            (פריקת סוללה, החלפת ספק חשמל) דורשות את <strong className="text-orange-400">אישורך הסופי המפורש</strong>.
            האפליקציה אינה אחראית לאי-יציבות ברשת החשמל או לבלאי חומרה.
          </p>
        ) : (
          <p className="text-white/80">
            <strong className="text-white">VPP Solar Club</strong> is an AI-driven advisory platform.
            By enabling optimization, you acknowledge that all physical executions
            (discharging, provider switching) require your <strong className="text-orange-400">explicit final approval</strong>.
            The app is not liable for grid instability or hardware wear.
          </p>
        )}
      </div>

      <div className="rounded-xl p-4 space-y-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">
          {isHe ? 'חשוב לדעת' : 'Key Points'}
        </p>
        {(isHe ? [
          'המערכת מציגה המלצות בלבד — לא פועלת ללא אישורך',
          'כל פעולה נרשמת ומאוחסנת בצורה מאובטחת',
          'ניתן לבטל הרשאות בכל עת בהגדרות',
        ] : [
          'System shows recommendations only — acts only with your approval',
          'All actions are logged and stored securely',
          'Permissions can be revoked anytime in Settings',
        ]).map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-white/65">{item}</p>
          </div>
        ))}
      </div>

      <button onClick={onNext}
        className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #F97316, #EA580C)', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}>
        {isHe ? 'הבנתי — המשך' : 'I Understand — Continue'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function Step2({ onNext, isHe }) {
  const [checked, setChecked] = useState([false, false, false]);
  const allChecked = checked.every(Boolean);

  const items = isHe ? [
    'אני מאשר כי התקנת הסוללה/הממיר שלי עומדת בתקן NFPA 855 ובתקני בטיחות אש מקומיים.',
    'אני מאשר כי האתר מחזיק חוזה תחזוקה תקף.',
    'אני מודע לכך שהחלפת ספק חשמל דרך מערכת נוגה אורכת כ-60 יום להכנסה לתוקף.',
  ] : [
    'I certify my battery/inverter installation meets NFPA 855 and local fire safety standards.',
    'I confirm the site has a valid maintenance contract.',
    'I acknowledge that electricity provider switching through the Noga system takes ~60 days to take effect.',
  ];

  const toggle = (i) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-6">
      <div className="text-center space-y-2">
        <div className="text-5xl mb-3">🏗️</div>
        <h2 className="text-xl font-black" style={{ color: '#F97316' }}>
          {isHe ? 'אישור בטיחות חומרה' : 'Hardware Safety Certification'}
        </h2>
        <p className="text-xs text-white/40">
          {isHe ? 'יש לאשר את כל 3 הסעיפים כדי להמשיך' : 'All 3 items must be confirmed to proceed'}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <button key={i} onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 p-4 rounded-2xl text-right transition-all active:scale-[0.98]"
            style={{
              background: checked[i] ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${checked[i] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}>
            <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${
              checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
            }`}>
              {checked[i] && <Check className="w-3 h-3 text-black" />}
            </div>
            <p className="text-sm text-white/80 leading-relaxed text-right">{item}</p>
          </button>
        ))}
      </div>

      <button onClick={onNext} disabled={!allChecked}
        className="w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{
          background: allChecked ? 'linear-gradient(135deg, #F97316, #EA580C)' : 'rgba(255,255,255,0.06)',
          boxShadow: allChecked ? '0 0 20px rgba(249,115,22,0.3)' : 'none',
          color: allChecked ? 'white' : 'rgba(255,255,255,0.3)',
          cursor: allChecked ? 'pointer' : 'not-allowed',
        }}>
        {isHe ? 'אישרתי הכל — המשך' : 'All Confirmed — Continue'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

function Step3({ onDone, isHe }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#10b981';
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
      className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl mb-3">✍️</div>
        <h2 className="text-xl font-black" style={{ color: '#F97316' }}>
          {isHe ? 'פרטיות וחתימה דיגיטלית' : 'Privacy & Digital Signature'}
        </h2>
        <p className="text-[11px] text-white/40">
          {isHe ? 'בהתאם לתיקון 13 לחוק הגנת הפרטיות (2025)' : 'Per Israel Privacy Amendment 13 (2025)'}
        </p>
      </div>

      {/* AI Consent Toggle */}
      <div className="flex items-center justify-between rounded-2xl p-4"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="flex-1 text-right">
          <p className="text-sm font-bold text-white">
            {isHe ? 'הסכמה לניתוח AI של דפוסי צריכה' : 'Consent to AI analysis of consumption patterns'}
          </p>
          <p className="text-[11px] text-white/45 mt-0.5">
            {isHe ? 'נדרש לאופטימיזציה אישית' : 'Required for personalized optimization'}
          </p>
        </div>
        <button onClick={() => setAiConsent(v => !v)}
          className={`relative ml-3 w-12 h-6 rounded-full transition-all flex-shrink-0 ${aiConsent ? 'bg-emerald-500' : 'bg-white/20'}`}>
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${aiConsent ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>

      {/* Signature Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button onClick={clearSig} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">
            <X className="w-3 h-3" /> {isHe ? 'נקה' : 'Clear'}
          </button>
          <div className="flex items-center gap-2">
            <PenLine className="w-3.5 h-3.5 text-white/40" />
            <p className="text-xs text-white/50">{isHe ? 'חתום כאן לפתיחת הדשבורד' : 'Sign here to unlock dashboard'}</p>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)' }}>
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-white/15 text-lg font-black">
                {isHe ? 'חתימה' : 'Signature'}
              </p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={340}
            height={120}
            className="w-full touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>
        {hasSignature && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-xs text-emerald-400 text-center">
            ✓ {isHe ? 'החתימה נקלטה' : 'Signature captured'}
          </motion.p>
        )}
      </div>

      <button
        onClick={() => { if (hasSignature && aiConsent) onDone(); }}
        disabled={!hasSignature || !aiConsent}
        className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{
          background: hasSignature && aiConsent ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
          boxShadow: hasSignature && aiConsent ? '0 0 24px rgba(16,185,129,0.4)' : 'none',
          color: hasSignature && aiConsent ? 'black' : 'rgba(255,255,255,0.3)',
          cursor: hasSignature && aiConsent ? 'pointer' : 'not-allowed',
        }}>
        🚀 {isHe ? 'פתח את הדשבורד' : 'Unlock Dashboard'}
      </button>

      {(!hasSignature || !aiConsent) && (
        <p className="text-[11px] text-white/30 text-center">
          {isHe ? 'יש לחתום ולהפעיל הסכמת AI' : 'Sign and enable AI consent to proceed'}
        </p>
      )}
    </motion.div>
  );
}

export default function ComplianceOnboarding({ onDone }) {
  const [step, setStep] = useState(1);
  const { lang } = useLang();
  const isHe = lang === 'he';

  const handleDone = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onDone();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="w-full max-w-lg rounded-t-3xl max-h-[92vh] overflow-y-auto pb-24"
        style={{ background: '#0D1420', border: '1px solid rgba(249,115,22,0.25)', borderBottom: 'none' }}>
        <div className="p-6">
          {/* Handle */}
          <div className="flex justify-center -mt-2 mb-5">
            <div className="w-10 h-1 rounded-full bg-white/15" />
          </div>

          <StepIndicator current={step} />

          <AnimatePresence mode="wait">
            {step === 1 && <Step1 key="s1" onNext={() => setStep(2)} isHe={isHe} />}
            {step === 2 && <Step2 key="s2" onNext={() => setStep(3)} isHe={isHe} />}
            {step === 3 && <Step3 key="s3" onDone={handleDone} isHe={isHe} />}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function useComplianceDone() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}