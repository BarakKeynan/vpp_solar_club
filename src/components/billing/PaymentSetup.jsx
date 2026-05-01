import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Shield, ExternalLink, CheckCircle2, Loader2, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// After Morning redirects back, the URL will contain ?token_id=xxx&last4=xxxx&brand=xxx
function useTokenFromUrl(onSuccess) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token_id = params.get('billing_token_id');
    if (!token_id) return;

    // Clean URL
    const clean = window.location.pathname;
    window.history.replaceState({}, '', clean);

    // Save token
    base44.functions.invoke('morningBilling', {
      action: 'save_token',
      token_id,
      last4: params.get('billing_last4') || '****',
      brand: params.get('billing_brand') || 'Card',
    }).then(() => onSuccess && onSuccess());
  }, []);
}

export default function PaymentSetup({ onClose, onSuccess }) {
  const [step, setStep] = useState('intro'); // intro | loading | redirect | simulate | done
  const [url, setUrl] = useState('');
  const [simToken, setSimToken] = useState('');

  // Check URL params on mount (return from Morning redirect)
  useTokenFromUrl(onSuccess);

  const handleStart = async () => {
    setStep('loading');
    const redirectBase = window.location.origin + window.location.pathname;
    const res = await base44.functions.invoke('morningBilling', {
      action: 'create_tokenization_link',
      redirect_url: `${redirectBase}?billing_token_id=TOKEN_ID&billing_last4=LAST4&billing_brand=BRAND`,
      success_url: `${redirectBase}?billing_token_id=TOKEN_ID&billing_last4=LAST4&billing_brand=BRAND`,
      failure_url: redirectBase,
    });

    const data = res.data;
    setUrl(data.url);

    if (data.simulated) {
      setStep('simulate');
    } else {
      setStep('redirect');
      window.location.href = data.url;
    }
  };

  // Simulation: manually enter a fake token
  const handleSimSave = async () => {
    setStep('loading');
    await base44.functions.invoke('morningBilling', {
      action: 'save_token',
      token_id: `sim_tok_${Date.now()}`,
      last4: simToken.slice(-4) || '4242',
      brand: 'Visa',
    });
    setStep('done');
    setTimeout(() => onSuccess && onSuccess(), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(2,8,20,0.85)' }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="w-full max-w-sm rounded-3xl p-6 space-y-5 relative"
        style={{ background: 'rgba(8,16,36,0.95)', border: '1px solid rgba(239,68,68,0.2)', boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}
      >
        {/* Close */}
        {step !== 'done' && (
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        )}

        <AnimatePresence mode="wait">

          {/* ── Intro ── */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <CreditCard className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">Payment Setup</p>
                  <p className="text-[11px] text-white/40">Secure via Morning (Green Invoice)</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { icon: '🔒', text: 'No card data stored on our servers' },
                  { icon: '⚡️', text: 'Enables full battery profit optimization' },
                  { icon: '🏦', text: 'PCI-DSS compliant tokenization' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5">
                    <span className="text-base">{icon}</span>
                    <p className="text-xs text-white/55">{text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleStart}
                className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.3), rgba(239,68,68,0.2))', border: '1px solid rgba(239,68,68,0.5)', boxShadow: '0 0 30px rgba(239,68,68,0.15)' }}
              >
                <Shield className="w-4 h-4" /> Continue to Secure Payment
              </button>
              <p className="text-[10px] text-center text-white/20">You'll be redirected to Morning's secure page</p>
            </motion.div>
          )}

          {/* ── Loading ── */}
          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="w-8 h-8 animate-spin text-red-400" />
              <p className="text-sm text-white/50">Preparing secure link...</p>
            </motion.div>
          )}

          {/* ── Simulate (no API key) ── */}
          {step === 'simulate' && (
            <motion.div key="simulate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4" dir="rtl">
              <div className="rounded-xl p-3 text-xs text-amber-300 text-center"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                🧪 מצב הדגמה — Simulation Mode
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-white">הזן פרטי כרטיס אשראי</p>
                <p className="text-[11px] text-white/35 mt-0.5">הנתונים לצורך הדגמה בלבד — לא יחויב דבר</p>
              </div>
              <div className="space-y-2.5">
                <div>
                  <p className="text-[10px] text-white/40 mb-1 text-right">מספר כרטיס</p>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    value={simToken}
                    onChange={e => setSimToken(e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())}
                    className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none text-right tracking-widest"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-white/40 mb-1 text-right">תוקף</p>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none text-right"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 mb-1 text-right">CVV</p>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={3}
                      className="w-full py-3 px-4 rounded-xl text-sm text-white outline-none text-right"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <p className="text-[10px] text-emerald-400/80">מאובטח בתקן PCI-DSS · פרטי הכרטיס לא נשמרים אצלנו</p>
                </div>
              </div>
              <button
                onClick={handleSimSave}
                disabled={simToken.replace(/\s/g, '').length < 4}
                className="w-full py-3.5 rounded-2xl font-black text-white text-sm active:scale-95 transition-all disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(16,185,129,0.25))', border: '1px solid rgba(16,185,129,0.6)', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}
              >
                ✅ אשר והפעל אופטימיזציה
              </button>
            </motion.div>
          )}

          {/* ── Redirecting ── */}
          {step === 'redirect' && (
            <motion.div key="redirect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8">
              <ExternalLink className="w-8 h-8 text-red-400" />
              <p className="text-sm text-white/60 text-center">Redirecting to Morning's secure page...</p>
              <a href={url} className="text-xs text-red-400 underline">Click here if not redirected</a>
            </motion.div>
          )}

          {/* ── Done ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-8 text-center" dir="rtl">
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.6 }}
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.5)', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </motion.div>
              <div className="space-y-2">
                <p className="text-base font-black text-white">החשבון קושר בהצלחה ⚡️</p>
                <p className="text-xs text-white/55 leading-relaxed max-w-[260px]">
                  VPP Solar Club יבצע מעתה התחשבנות אוטומטית על בסיס הרווחים שייוצרו עבורך
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <p className="text-[11px] font-black text-emerald-400">Optimization Active 🟢</p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}