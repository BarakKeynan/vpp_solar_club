import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, ExternalLink, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// After yPay redirects back, the URL will contain ?token_id=xxx&last4=xxxx&brand=xxx
function useTokenFromUrl(onSuccess) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_id = params.get('billing_token_id');
    if (!token_id) return;

    // Clean URL
    const clean = window.location.pathname;
    window.history.replaceState({}, '', clean);

    // Save token
    base44.functions.invoke('ypayBilling', {
      action: 'save_token',
      token_id,
      last4: params.get('billing_last4') || '****',
      brand: params.get('billing_brand') || 'Card',
    }).then(() => onSuccess && onSuccess());
  }, []);
}

export default function PaymentSetup({ onClose, onSuccess }) {
  const [step, setStep] = useState('checkout'); // checkout | loading | done
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  // Check URL params on mount (return from yPay redirect)
  useTokenFromUrl(onSuccess);

  const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  };

  const isValid = cardNumber.replace(/\s/g, '').length >= 13 && expiry.length === 5 && cvv.length >= 3 && name.trim().length >= 2;

  const handleConfirm = async () => {
    setStep('loading');
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    await base44.functions.invoke('ypayBilling', {
      action: 'save_token',
      token_id: `ypay_tok_${Date.now()}`,
      last4,
      brand: 'Visa',
    });
    setStep('done');
    setTimeout(() => onSuccess && onSuccess(), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(2,8,20,0.88)' }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="w-full max-w-sm rounded-3xl p-6 space-y-5 relative"
        style={{ background: 'rgba(8,16,36,0.97)', border: '1px solid rgba(239,68,68,0.25)', boxShadow: '0 0 60px rgba(0,0,0,0.7)' }}
        dir="rtl"
      >
        {/* Close */}
        {step !== 'done' && (
          <button onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        )}

        <AnimatePresence mode="wait">

          {/* ── Checkout Form ── */}
          {step === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3 pb-1">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <Lock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Checkout מאובטח — yPay</p>
                  <p className="text-[10px] text-white/35">🧪 Simulation Mode — להדגמה בלבד</p>
                </div>
              </div>

              {/* Reassurance note */}
              <div className="rounded-xl px-3 py-2.5 text-right"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                <p className="text-[11px] text-violet-300 leading-relaxed font-bold">
                  קישור הכרטיס מאפשר למערכת האוטומטית לפעול עבורך.
                </p>
                <p className="text-[10px] text-violet-400/60 mt-0.5">לא יתבצע חיוב בחצי השנה הראשונה.</p>
              </div>

              {/* Card Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-white/45 font-bold">מספר כרטיס</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none placeholder:text-white/20 text-left"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    dir="ltr"
                  />
                  <CreditCard className="absolute top-3 left-3 w-4 h-4 text-white/25" />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-white/45 font-bold">שם בעל הכרטיס</label>
                <input
                  type="text"
                  placeholder="ישראל ישראלי"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none placeholder:text-white/20"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-white/45 font-bold">תוקף</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none placeholder:text-white/20 text-left"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-white/45 font-bold">CVV</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="•••"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none placeholder:text-white/20 text-left"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!isValid}
                className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-35"
                style={{
                  background: isValid
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(16,185,129,0.25))'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isValid ? 'rgba(16,185,129,0.6)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isValid ? '0 0 30px rgba(16,185,129,0.2)' : 'none',
                }}
              >
                <Shield className="w-4 h-4" /> אשר והפעל אופטימיזציה
              </button>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-white/20" />
                  <p className="text-[10px] text-center text-white/20">פרטי הכרטיס מוצפנים ולא נשמרים בשרתינו</p>
                </div>
                <p className="text-[9px] text-center text-white/25 italic px-2 py-1.5 rounded-lg"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  🔒 פרטי האשראי שלך אינם נשמרים במערכת VPP ומאובטחים בתקן המחמיר ביותר על ידי yPay
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Loading ── */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-10">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
              <p className="text-sm text-white/50">מקשר את הכרטיס...</p>
            </motion.div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-6 text-center">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.5)' }}>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </motion.div>
              <div>
                <p className="text-base font-black text-white mb-2">Optimization Active ⚡️</p>
                <p className="text-xs text-emerald-400/80 leading-relaxed px-2">
                  שירות האופטימיזציה הופעל בהצלחה. תהנה מחצי שנה ללא עמלות ניהול — החיוב יחל רק לאחר 180 יום.
                </p>
                <div className="mt-3 rounded-xl px-3 py-2 mx-2"
                  style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                  <p className="text-[10px] text-violet-300 font-bold">סטטוס: תקופת הטבה פעילה (ללא עמלות ניהול)</p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}