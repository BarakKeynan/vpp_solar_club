import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Phone, Mail, User, Lock, CheckCircle2, Shield, Smartphone } from 'lucide-react';
import TermsModal from '@/components/register/TermsModal';
import SmsVerification from '@/components/register/SmsVerification';
import EmailVerification from '@/components/register/EmailVerification';
import { base44 } from '@/api/base44Client';

// Password strength
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const STRENGTH_LABELS = ['', 'חלשה', 'בינונית', 'טובה', 'חזקה מאוד'];
const STRENGTH_COLORS = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

function StrengthMeter({ password }) {
  const s = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= s ? STRENGTH_COLORS[s] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <p className="text-[10px]" style={{ color: STRENGTH_COLORS[s] }}>{STRENGTH_LABELS[s]}</p>
    </div>
  );
}

function InputField({ icon: Icon, label, type = 'text', value, onChange, placeholder, suffix }) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  const inputType = isPass ? (show ? 'text' : 'password') : type;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-white/60 block text-right">{label}</label>
      <div className="relative">
        {/* Field icon — right side (only if icon provided) */}
        {Icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            <Icon className="w-4 h-4" />
          </span>
        )}

        <input
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          dir="rtl"
          className="w-full py-3 rounded-xl text-sm text-white placeholder-white/25 outline-none transition-all [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            paddingRight: Icon ? '2.5rem' : '1rem',
            paddingLeft: isPass ? '2.75rem' : '1rem',
          }}
          onFocus={e => e.target.style.borderColor = 'rgba(255,140,0,0.6)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
        />

        {/* Eye toggle — left side, only for password fields */}
        {isPass && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            aria-label={show ? 'הסתר סיסמה' : 'הצג סיסמה'}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 transition-colors"
            style={{ color: show ? '#fb923c' : 'rgba(255,255,255,0.4)' }}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {suffix}
    </div>
  );
}

export default function Register() {
  const [regMode, setRegMode] = useState('phone'); // 'phone' | 'email'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);
  const [verifyMethod, setVerifyMethod] = useState('sms'); // 'sms' | 'email'
  const [step, setStep] = useState('form'); // 'form' | 'sms' | 'email' | 'success'
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regMode === 'phone') {
      if (!form.name || !form.phone) return setError('נא למלא שם ומספר טלפון');
      if (!termsAgreed || !privacyAgreed) return setError('יש להסכים לתנאי השימוש ולמדיניות הפרטיות');
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      setLoading(false);
      setStep('sms');
      return;
    }

    // email mode
    if (!form.name || !form.email || !form.phone || !form.password) return setError('נא למלא את כל השדות');
    if (form.password !== form.confirm) return setError('הסיסמאות אינן תואמות');
    if (getStrength(form.password) < 2) return setError('הסיסמה חלשה מדי');
    if (!termsAgreed || !privacyAgreed) return setError('יש להסכים לתנאי השימוש ולמדיניות הפרטיות');

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (twoFA) {
      setStep(verifyMethod);
    } else {
      setStep('success');
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
        style={{ background: '#0B1120', backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-4 max-w-sm">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6 }}
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
            style={{ background: 'rgba(16,185,129,0.2)', border: '2px solid #10b981' }}>
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-black text-white">ברוך הבא! 🎉</h2>
          <p className="text-white/60 text-sm">החשבון שלך נוצר בהצלחה. שלחנו אימות למייל <strong className="text-white">{form.email}</strong></p>
          {twoFA && (
            <div className="rounded-xl p-3 text-sm text-emerald-300"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
              ✅ הטלפון {form.phone} אומת בהצלחה
            </div>
          )}
          <button onClick={() => base44.auth.redirectToLogin()}
            className="w-full py-3 rounded-xl font-black text-white text-sm"
            style={{ background: 'linear-gradient(135deg,#FF8C00,#f59e0b)' }}>
            כניסה לדשבורד →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">

      {/* Solar background image */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(160deg, rgba(2,8,20,0.93) 0%, rgba(4,14,32,0.88) 50%, rgba(2,10,22,0.95) 100%)' }}
      />

      {/* Cyan glow orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.05) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md relative z-10">

        {/* Logo / Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="mb-4 w-52 mx-auto"
          >
            <img
              src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/f004e2167_Screenshot_20260422_170358_Gallery.jpg"
              alt="VPP Solar Club"
              className="w-full h-auto object-contain rounded-xl"
              style={{ filter: 'drop-shadow(0 0 24px rgba(56,189,248,0.3))' }}
            />
          </motion.div>
          <h1 className="text-xl font-black text-white mb-1">הצטרף למהפכת האנרגיה</h1>
          <p className="text-sm text-white/40">נהל, אחסן וסחר באנרגיה סולארית בחכמה</p>

          {/* Value props row */}
          <div className="flex items-center justify-center gap-4 mt-3">
            {['⚡ חיסכון עד 60%', '🌱 100% ירוק', '🤖 AI חכם'].map(item => (
              <span key={item} className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: 'rgba(56,189,248,0.1)', color: 'rgba(147,210,245,0.7)', border: '1px solid rgba(56,189,248,0.2)' }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6 space-y-4"
          style={{ background: 'rgba(13,21,37,0.9)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>

          {/* SMS Verification step */}
          {step === 'sms' && (
            <SmsVerification
              phone={form.phone}
              onVerified={() => setStep('success')}
              onBack={() => setStep('form')}
            />
          )}

          {/* Email Verification step */}
          {step === 'email' && (
            <EmailVerification
              email={form.email}
              onVerified={() => setStep('success')}
              onBack={() => setStep('form')}
            />
          )}

          {step === 'form' && <>
          <div className="text-right">
            <h2 className="text-lg font-black text-white">יצירת חשבון — בחינם לחלוטין</h2>
            <p className="text-xs text-white/35 mt-0.5">הצטרף ל-2,400+ חברים שכבר חוסכים</p>
          </div>

          {/* Google Sign In */}
          <button className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-sm transition-all hover:bg-white/95 active:scale-95"
            style={{ background: 'white', color: '#1f2937', border: '1px solid rgba(255,255,255,0.2)' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            המשך עם Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-xs text-white/30 font-bold">או</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          {/* Mode tabs: Phone OTP / Email+Password */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            {[
              { key: 'phone', icon: '📱', label: 'טלפון + OTP' },
              { key: 'email', icon: '📧', label: 'מייל + סיסמה' },
            ].map(({ key, icon, label }) => (
              <button key={key} type="button" onClick={() => { setRegMode(key); setError(''); }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold transition-all"
                style={{
                  background: regMode === key ? 'rgba(255,140,0,0.15)' : 'transparent',
                  color: regMode === key ? '#fb923c' : 'rgba(255,255,255,0.35)',
                  borderBottom: regMode === key ? '2px solid #FF8C00' : '2px solid transparent',
                }}>
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3" dir="rtl">
            <InputField icon={User} label="שם מלא" value={form.name} onChange={set('name')} placeholder="ישראל ישראלי" />

            {regMode === 'phone' ? (
              /* Phone OTP mode — only name + phone */
              <InputField icon={Phone} label="מספר טלפון" type="tel" value={form.phone} onChange={set('phone')} placeholder="050-0000000" />
            ) : (
              /* Email+Password mode */
              <>
                <InputField icon={Mail} label="כתובת מייל" type="email" value={form.email} onChange={set('email')} placeholder="israel@example.com" />
                <InputField icon={Phone} label="מספר טלפון" type="tel" value={form.phone} onChange={set('phone')} placeholder="050-0000000" />
                <InputField icon={null} label="סיסמה" type="password" value={form.password} onChange={set('password')} placeholder="לפחות 8 תווים"
                  suffix={<StrengthMeter password={form.password} />} />
                <InputField icon={null} label="אימות סיסמה" type="password" value={form.confirm} onChange={set('confirm')} placeholder="חזור על הסיסמה" />

                {/* 2FA Toggle */}
                <div className="flex items-center justify-between rounded-xl p-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <button type="button" onClick={() => setTwoFA(v => !v)}
                    className={`relative w-11 h-6 rounded-full transition-all flex-shrink-0 ${twoFA ? 'bg-orange-500' : 'bg-white/20'}`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${twoFA ? 'left-5' : 'left-0.5'}`} />
                  </button>
                  <div className="text-right flex-1 mr-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <p className="text-xs font-bold text-white">הפעל אימות דו-שלבי (2FA)</p>
                      <Smartphone className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <p className="text-[10px] text-white/35 mt-0.5">SMS לאבטחה מוגברת</p>
                  </div>
                </div>

                <AnimatePresence>
                  {twoFA && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {[
                          { key: 'sms', icon: '📱', label: 'SMS לטלפון' },
                          { key: 'email', icon: '📧', label: 'קוד למייל' },
                        ].map(({ key, icon, label }) => (
                          <button key={key} type="button" onClick={() => setVerifyMethod(key)}
                            className="py-2.5 rounded-xl text-xs font-bold transition-all"
                            style={{
                              background: verifyMethod === key ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.03)',
                              border: `1px solid ${verifyMethod === key ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.08)'}`,
                              color: verifyMethod === key ? '#fb923c' : 'rgba(255,255,255,0.35)',
                            }}>
                            {icon} {label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* OTP mode info banner */}
            {regMode === 'phone' && (
              <div className="rounded-xl p-3 text-xs text-right" style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.2)' }}>
                📲 ישלח קוד SMS לטלפון שלך לאימות מהיר — ללא סיסמה
              </div>
            )}

            {/* Terms checkboxes */}
            <div className="space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 flex-shrink-0 accent-orange-500 w-4 h-4" />
                <span className="text-xs text-white/55 text-right leading-relaxed">
                  קראתי ואני מסכים ל
                  <button type="button" onClick={() => setTermsOpen(true)}
                    className="text-orange-400 hover:text-orange-300 underline mx-1 font-bold">
                    תנאי השימוש
                  </button>
                </span>
              </label>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={privacyAgreed} onChange={e => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 flex-shrink-0 accent-orange-500 w-4 h-4" />
                <span className="text-xs text-white/55 text-right leading-relaxed">
                  קראתי ואני מסכים ל
                  <button type="button" onClick={() => setTermsOpen(true)}
                    className="text-orange-400 hover:text-orange-300 underline mx-1 font-bold">
                    מדיניות הפרטיות
                  </button>
                </span>
              </label>
            </div>

            {/* Error */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-red-400 text-right px-1">⚠️ {error}</motion.p>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-white text-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{
                background: loading ? 'rgba(255,140,0,0.5)' : 'linear-gradient(135deg,#FF8C00,#f59e0b)',
                boxShadow: '0 0 30px rgba(255,140,0,0.35)',
              }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> מעבד...</>
              ) : regMode === 'phone' ? (
                <>📲 שלח קוד OTP</>
              ) : (
                <>✨ צור חשבון בחינם</>
              )}
            </button>
          </form>

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <Shield className="w-3 h-3 text-white/25" />
            <p className="text-[10px] text-white/25">מוצפן SSL · GDPR · חוק הגנת הפרטיות תשמ"א</p>
          </div>
          </>}
        </div>

        {/* Sign in link */}
        <p className="text-center text-xs text-white/35 mt-4">
          כבר יש לך חשבון?{' '}
          <button onClick={() => base44.auth.redirectToLogin()}
            className="text-orange-400 font-bold hover:underline">כניסה</button>
        </p>
      </motion.div>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} onAgree={() => { setTermsAgreed(true); setPrivacyAgreed(true); }} />
    </div>
  );
}