import React, { useState, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, ArrowLeft, RefreshCw, Eye, EyeOff, Lock } from 'lucide-react';

const LangCtx = createContext('he');

const T = {
  he: {
    verifyTitle: m => `אימות ${m === 'phone' ? 'טלפון' : 'מייל'}`,
    verifySubtitle: c => `שלחנו קוד בן 6 ספרות אל ${c}`,
    demoCode: 'קוד לדמו:',
    wrongCode: 'הקוד שגוי. נסה שנית.',
    verifying: 'מאמת...',
    confirm: 'אשר קוד',
    back: 'חזור',
    resend: 'שלח שוב',
    signInTitle: 'כניסה לחשבון',
    signInSub: 'גש לפורטפוליו האנרגיה שלך',
    google: 'המשך עם Google',
    or: 'או',
    emailTab: 'מייל',
    phoneTab: 'טלפון',
    emailPlaceholder: 'your@email.com',
    phonePlaceholder: '050-0000000',
    passPlaceholder: 'סיסמה',
    sending: 'שולח...',
    submit: 'כניסה ←',
    noAccount: 'עדיין אין לך חשבון?',
    signUp: 'הצטרפות חינם →',
    terms: 'בכניסה אתה מסכים לתנאי השימוש',
    props: ['⚡ חיסכון עד 60%', '🌱 100% ירוק', '🤖 AI חכם'],
  },
  en: {
    verifyTitle: m => `Verify ${m === 'phone' ? 'Phone' : 'Email'}`,
    verifySubtitle: c => `We sent a 6-digit code to ${c}`,
    demoCode: 'Demo code:',
    wrongCode: 'Wrong code. Please try again.',
    verifying: 'Verifying...',
    confirm: 'Confirm Code',
    back: 'Back',
    resend: 'Resend',
    signInTitle: 'Sign In',
    signInSub: 'Access your energy portfolio',
    google: 'Continue with Google',
    or: 'or',
    emailTab: 'Email',
    phoneTab: 'Phone',
    emailPlaceholder: 'your@email.com',
    phonePlaceholder: '+1 555-000-0000',
    passPlaceholder: 'Password',
    sending: 'Sending...',
    submit: 'Sign In →',
    noAccount: "Don't have an account?",
    signUp: 'Join Free →',
    terms: 'By signing in you agree to our Terms of Service',
    props: ['⚡ Save up to 60%', '🌱 100% Green', '🤖 AI Smart'],
  },
};

// ── Password Input ──────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-3.5 pl-10 pr-12 rounded-xl text-white text-sm outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(255,255,255,0.1)',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.6)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 transition-colors"
        style={{ color: show ? 'rgba(125,211,252,0.9)' : 'rgba(255,255,255,0.35)' }}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ── OTP Screen ─────────────────────────────────────────────────────────────
function OTPScreen({ method, contact, onBack }) {
  const lang = useContext(LangCtx);
  const t = T[lang];
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef([]);

  const handleDigit = (i, val) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setError('');
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (v && i === 5) verify([...next]);
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      const arr = paste.split('');
      setDigits(arr);
      setTimeout(() => verify(arr), 100);
    }
  };

  const verify = async (arr) => {
    const code = arr.join('');
    if (code.length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    if (code === '123456') {
      window.location.href = '/Dashboard';
    } else {
      setError(t.wrongCode);
      setDigits(['', '', '', '', '', '']);
      refs.current[0]?.focus();
    }
  };

  return (
    <motion.div key="otp" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }} className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-black text-white mb-1">{t.verifyTitle(method)}</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.38)' }}>
          {t.verifySubtitle('')}<span className="text-white/70 font-semibold">{contact}</span>
        </p>
      </div>

      <div className="flex justify-between gap-2" onPaste={handlePaste} dir="ltr">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleDigit(i, e.target.value)}
            onKeyDown={e => handleKey(i, e)}
            className="flex-1 h-14 text-center text-2xl font-black text-white rounded-xl outline-none transition-all"
            style={{
              background: d ? 'rgba(56,189,248,0.10)' : 'rgba(255,255,255,0.05)',
              border: `1.5px solid ${d ? 'rgba(56,189,248,0.6)' : 'rgba(255,255,255,0.1)'}`,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.9)'}
            onBlur={e => e.target.style.borderColor = digits[i] ? 'rgba(56,189,248,0.6)' : 'rgba(255,255,255,0.1)'}
          />
        ))}
      </div>

      <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.2)' }}>
        {t.demoCode} <span style={{ color: 'rgba(255,255,255,0.4)' }}>123456</span>
      </p>

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-center" style={{ color: '#f87171' }}>
          {error}
        </motion.p>
      )}

      <button
        onClick={() => verify(digits)}
        disabled={loading || digits.join('').length < 6}
        className="w-full py-4 rounded-2xl font-black text-white text-base transition-all disabled:opacity-30"
        style={{
          background: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(56,189,248,0.18) 100%)',
          border: '1px solid rgba(56,189,248,0.45)',
          boxShadow: '0 0 24px rgba(56,189,248,0.15)',
        }}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.verifying}
          </span>
        ) : t.confirm}
      </button>

      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <ArrowLeft className="w-4 h-4" /> {t.back}
        </button>
        <button className="flex items-center gap-1.5 text-sm" style={{ color: 'rgba(125,211,252,0.7)' }}>
          <RefreshCw className="w-3.5 h-3.5" /> {t.resend}
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Auth Form ──────────────────────────────────────────────────────────
function AuthForm({ onOTP }) {
  const lang = useContext(LangCtx);
  const t = T[lang];
  const [tab, setTab] = useState('email'); // 'email' | 'phone'
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async (e) => {
    e.preventDefault();
    if (!contact) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onOTP(tab, contact);
  };

  return (
    <motion.div key="form" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.35 }} className="w-full space-y-5">
      <div>
        <h2 className="text-xl font-black text-white mb-1">{t.signInTitle}</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.36)' }}>{t.signInSub}</p>
      </div>

      {/* Google */}
      <button
        onClick={() => base44.auth.redirectToLogin()}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
        style={{ background: 'white', color: '#111', boxShadow: '0 2px 12px rgba(0,0,0,0.35)' }}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {t.google}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.28)' }}>{t.or}</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Tab: Email / Phone */}
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
        {[
          { key: 'email', icon: Mail, label: t.emailTab },
          { key: 'phone', icon: Phone, label: t.phoneTab },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: tab === key ? 'rgba(56,189,248,0.12)' : 'transparent',
              color: tab === key ? '#7dd3fc' : 'rgba(255,255,255,0.35)',
              borderBottom: tab === key ? '2px solid rgba(56,189,248,0.7)' : '2px solid transparent',
            }}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleContinue} className="space-y-3" dir="rtl">
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type={tab === 'phone' ? 'tel' : 'email'}
            placeholder={tab === 'phone' ? t.phonePlaceholder : t.emailPlaceholder}
            value={contact}
            onChange={e => setContact(e.target.value)}
            className="w-full py-3.5 pr-10 pl-4 rounded-xl text-white text-sm outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1.5px solid rgba(255,255,255,0.1)' }}
            onFocus={e => e.target.style.borderColor = 'rgba(56,189,248,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        {tab === 'email' && (
          <PasswordInput value={password} onChange={e => setPassword(e.target.value)} placeholder={t.passPlaceholder} />
        )}

        <button
          type="submit"
          disabled={!contact || loading}
          className="w-full py-3.5 rounded-xl font-black text-white text-base transition-all disabled:opacity-30 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(56,189,248,0.18) 100%)',
            border: '1px solid rgba(56,189,248,0.45)',
            boxShadow: '0 0 24px rgba(56,189,248,0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t.sending}
            </span>
          ) : t.submit}
        </button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {t.noAccount}{' '}
        <Link to="/register" className="font-bold underline" style={{ color: 'rgba(125,211,252,0.8)' }}>
          {t.signUp}
        </Link>
      </p>
    </motion.div>
  );
}

// ── Page Shell ──────────────────────────────────────────────────────────────
export default function Auth() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState('form');
  const [otpMethod, setOtpMethod] = useState('email');
  const [otpContact, setOtpContact] = useState('');
  const [lang, setLang] = useState('he');
  const t = T[lang];

  const handleOTP = (method, contact) => {
    setOtpMethod(method);
    setOtpContact(contact);
    setScreen('otp');
  };

  return (
    <LangCtx.Provider value={lang}>
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 overflow-hidden">
      {/* Solar background */}
      <div className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(160deg, rgba(2,8,20,0.94) 0%, rgba(4,14,32,0.90) 50%, rgba(2,10,22,0.96) 100%)' }}
      />
      {/* Cyan glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />
      </div>

      {/* Back */}
      <button
        onClick={() => navigate('/landing')}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 text-xs transition-colors"
        style={{ color: 'rgba(255,255,255,0.25)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
      </button>

      {/* Lang toggle */}
      <button
        onClick={() => setLang(l => l === 'he' ? 'en' : 'he')}
        className="absolute top-6 right-6 z-20 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
        style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: 'rgba(147,210,245,0.8)' }}
      >
        {lang === 'he' ? 'EN' : 'עב'}
      </button>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-6 w-44"
      >
        <img
          src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/f004e2167_Screenshot_20260422_170358_Gallery.jpg"
          alt="VPP Solar Club"
          className="w-full h-auto object-contain rounded-xl"
          style={{ filter: 'drop-shadow(0 0 24px rgba(56,189,248,0.3))' }}
        />
      </motion.div>

      {/* Value props */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 flex items-center gap-3 mb-6"
      >
        {t.props.map(item => (
          <span key={item} className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: 'rgba(56,189,248,0.1)', color: 'rgba(147,210,245,0.7)', border: '1px solid rgba(56,189,248,0.2)' }}>
            {item}
          </span>
        ))}
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 w-full max-w-sm rounded-3xl p-7"
        style={{
          background: 'rgba(8,16,36,0.85)',
          border: '1px solid rgba(56,189,248,0.12)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        <AnimatePresence mode="wait">
          {screen === 'form' ? (
            <AuthForm key="form" onOTP={handleOTP} />
          ) : (
            <OTPScreen key="otp" method={otpMethod} contact={otpContact} onBack={() => setScreen('form')} />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Legal */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10 mt-6 text-xs text-center"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        <button
          onClick={() => navigate('/terms')}
          className="underline"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {t.terms}
        </button>
      </motion.p>
    </div>
    </LangCtx.Provider>
  );
}