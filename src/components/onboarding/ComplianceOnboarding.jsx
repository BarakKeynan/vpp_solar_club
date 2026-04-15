import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PenLine, X, Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const STORAGE_KEY = 'vpp_compliance_done';

const checkItems = {
  he: [
    'אני מאשר כי התקנת הסוללה/הממיר שלי עומדת בתקן NFPA 855 ובתקני בטיחות אש מקומיים.',
    'אני מאשר כי האתר מחזיק חוזה תחזוקה תקף.',
    'אני מודע לכך שהחלפת ספק חשמל דרך מערכת נוגה אורכת כ-60 יום להכנסה לתוקף.',
    'קראתי והבנתי את מדיניות הפרטיות בהתאם לחוק הגנת הפרטיות, התשמ"א–1981 ותיקון מס׳ 13 (2025). אני מסכים לאיסוף ועיבוד נתוני הצריכה שלי לצורך מתן השירות, ומאשר את זכותי לעיון, תיקון ומחיקה של המידע.',
  ],
  en: [
    'I certify my battery/inverter installation meets NFPA 855 and local fire safety standards.',
    'I confirm the site has a valid maintenance contract.',
    'I acknowledge that electricity provider switching through the Noga system takes ~60 days to take effect.',
    'I have read and understood the Privacy Policy in accordance with the Israeli Privacy Protection Law (1981) and Amendment No. 13 (2025). I consent to the collection and processing of my consumption data for service purposes, and acknowledge my rights to access, correct, and delete my data.',
  ],
};

export default function ComplianceOnboarding({ onDone }) {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);
  const [checked, setChecked] = useState([false, false, false, false]);
  const allChecked = checked.every(Boolean) && aiConsent && hasSignature;

  const toggle = (i) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

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
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleDone = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    onDone();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.88)' }}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 280 }}
        className="w-full max-w-lg mx-auto flex flex-col rounded-t-3xl"
        style={{ background: '#0D1420', border: '1px solid rgba(249,115,22,0.25)', borderBottom: 'none', maxHeight: '88vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Header */}
          <div className="text-center space-y-1">
            <div className="text-3xl mb-1">⚖️</div>
            <h2 className="text-lg font-black" style={{ color: '#F97316' }}>
              {isHe ? 'תנאי שימוש ואישור בטיחות' : 'Terms of Use & Safety Agreement'}
            </h2>
            <p className="text-[11px] text-white/40">
              {isHe ? 'בהתאם לתיקון 13 לחוק הגנת הפרטיות (2025)' : 'Per Israel Privacy Amendment 13 (2025)'}
            </p>
          </div>

          {/* Advisory Text */}
          <div className="rounded-xl p-3 space-y-1"
            style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)' }}>
            <p className="text-[10px] font-black text-orange-400/70 uppercase tracking-widest">
              {isHe ? 'גילוי נאות' : 'Advisory Disclosure'}
            </p>
            <p className="text-white/70 text-xs leading-relaxed">
              {isHe
                ? 'VPP Solar Club היא פלטפורמת ייעוץ מבוססת AI. כל הפעולות הפיזיות דורשות אישורך הסופי המפורש. האפליקציה אינה אחראית לאי-יציבות ברשת החשמל או לבלאי חומרה.'
                : 'VPP Solar Club is an AI-driven advisory platform. All physical executions require your explicit final approval. The app is not liable for grid instability or hardware wear.'}
            </p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
              {isHe ? 'אישור בטיחות חומרה' : 'Hardware Safety Certification'}
            </p>
            {checkItems[isHe ? 'he' : 'en'].map((item, i) => (
              <button key={i} onClick={() => toggle(i)}
                className="w-full flex items-start gap-3 p-3 rounded-xl text-right transition-all active:scale-[0.98]"
                style={{
                  background: checked[i] ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${checked[i] ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 transition-all ${checked[i] ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'}`}>
                  {checked[i] && <Check className="w-3 h-3 text-black" />}
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{item}</p>
              </button>
            ))}
          </div>

          {/* AI Consent */}
          <div className="flex items-center justify-between rounded-xl p-3"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex-1 text-right">
              <p className="text-xs font-bold text-white">
                {isHe ? 'הסכמה לניתוח AI של דפוסי צריכה' : 'Consent to AI analysis of consumption patterns'}
              </p>
              <p className="text-[10px] text-white/45 mt-0.5">
                {isHe ? 'נדרש לאופטימיזציה אישית' : 'Required for personalized optimization'}
              </p>
            </div>
            <button onClick={() => setAiConsent(v => !v)}
              className={`relative ml-3 w-12 h-6 rounded-full transition-all flex-shrink-0 ${aiConsent ? 'bg-emerald-500' : 'bg-white/20'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${aiConsent ? 'left-6' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <button onClick={clearSig} className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">
                <X className="w-3 h-3" /> {isHe ? 'נקה' : 'Clear'}
              </button>
              <div className="flex items-center gap-2">
                <PenLine className="w-3.5 h-3.5 text-white/40" />
                <p className="text-xs text-white/50">{isHe ? 'חתום כאן' : 'Sign here'}</p>
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-white/10 text-base font-black">{isHe ? 'חתימה' : 'Signature'}</p>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={340}
                height={90}
                className="w-full touch-none"
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
              />
            </div>
            {hasSignature && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400 text-center">
                ✓ {isHe ? 'החתימה נקלטה' : 'Signature captured'}
              </motion.p>
            )}
          </div>

        </div>

        {/* Fixed bottom button — above nav bar (80px) */}
        <div className="flex-shrink-0 px-5 pt-3 pb-24"
          style={{ background: 'linear-gradient(to top, #0D1420 70%, transparent)' }}>
          <button
            onClick={handleDone}
            disabled={!allChecked}
            className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: allChecked ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              boxShadow: allChecked ? '0 0 30px rgba(16,185,129,0.5)' : 'none',
              color: allChecked ? 'white' : 'rgba(255,255,255,0.3)',
              cursor: allChecked ? 'pointer' : 'not-allowed',
              border: allChecked ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.06)',
            }}>
            ✅ {isHe ? 'אשר ופתח את הדשבורד' : 'Confirm & Unlock Dashboard'}
          </button>
          {!allChecked && (
            <p className="text-[10px] text-white/20 text-center mt-1.5">
              {isHe ? 'יש לסמן את כל הסעיפים, להפעיל AI ולחתום' : 'Check all items, enable AI consent and sign'}
            </p>
          )}
        </div>

      </motion.div>
    </motion.div>
  );
}

export function useComplianceDone() {
  return localStorage.getItem(STORAGE_KEY) === 'true';
}