import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, RotateCcw, CheckCircle2 } from 'lucide-react';

// Simulated OTP — in production replace with real SMS backend
const MOCK_OTP = '123456';

export default function SmsVerification({ phone, onVerified, onBack }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [sent, setSent] = useState(false);
  const refs = useRef([]);

  // Countdown for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Simulate sending OTP on mount
  useEffect(() => {
    setTimeout(() => setSent(true), 800);
  }, []);

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError('');
    if (v && i < 5) refs.current[i + 1]?.focus();
    // Auto-submit when all filled
    if (v && i === 5) {
      const code = [...next.slice(0, 5), v].join('');
      if (code.length === 6) submitCode([...next.slice(0, 5), v]);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      const arr = paste.split('');
      setDigits(arr);
      setTimeout(() => submitCode(arr), 100);
    }
  };

  const submitCode = async (arr) => {
    const code = arr.join('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === MOCK_OTP) {
      onVerified();
    } else {
      setError('הקוד שגוי. נסה שנית.');
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join('');
    if (code.length < 6) return setError('נא להזין את כל 6 הספרות');
    submitCode(digits);
  };

  const handleResend = () => {
    setResendCooldown(30);
    setDigits(['', '', '', '', '', '']);
    setError('');
    setSent(false);
    setTimeout(() => setSent(true), 800);
  };

  return (
    <motion.div
      initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="space-y-6 text-center"
    >
      {/* Icon */}
      <div className="flex justify-center">
        <motion.div
          animate={{ scale: sent ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.4)' }}
        >
          <Phone className="w-7 h-7 text-orange-400" />
        </motion.div>
      </div>

      <div>
        <h3 className="text-lg font-black text-white">אימות מספר טלפון</h3>
        <p className="text-xs text-white/45 mt-1.5 leading-relaxed">
          שלחנו קוד אימות בן 6 ספרות למספר<br />
          <span className="text-orange-400 font-bold">{phone}</span>
        </p>
        {sent && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] text-emerald-400 mt-1">
            ✓ הקוד נשלח בהצלחה
          </motion.p>
        )}
      </div>

      {/* OTP boxes */}
      <div className="flex justify-center gap-2" onPaste={handlePaste} dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-11 h-12 text-center text-xl font-black text-white rounded-xl outline-none transition-all"
            style={{
              background: d ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${d ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.1)'}`,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(255,140,0,0.8)'}
            onBlur={e => e.target.style.borderColor = digits[i] ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.1)'}
          />
        ))}
      </div>

      {/* Hint for demo */}
      <p className="text-[10px] text-white/20">
        🧪 לדמו: הקוד הוא <span className="text-white/40 font-bold">123456</span>
      </p>

      {/* Error */}
      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-red-400">⚠️ {error}</motion.p>
      )}

      {/* Verify button */}
      <button onClick={handleVerify} disabled={loading || digits.join('').length < 6}
        className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg,#FF8C00,#f59e0b)',
          boxShadow: '0 0 25px rgba(255,140,0,0.3)',
        }}>
        {loading
          ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> מאמת...</>
          : <><CheckCircle2 className="w-4 h-4" /> אמת קוד</>
        }
      </button>

      {/* Resend */}
      <div className="flex items-center justify-center gap-2">
        {resendCooldown > 0 ? (
          <p className="text-xs text-white/30">שלח שוב בעוד {resendCooldown} שניות</p>
        ) : (
          <button onClick={handleResend}
            className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold transition-colors">
            <RotateCcw className="w-3 h-3" /> שלח קוד חדש
          </button>
        )}
      </div>

      {/* Back */}
      <button onClick={onBack} className="text-xs text-white/25 hover:text-white/50 transition-colors">
        ← חזור לטופס
      </button>
    </motion.div>
  );
}