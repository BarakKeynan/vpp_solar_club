import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, LayoutDashboard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BG_IMAGE = 'https://media.base44.com/images/public/69badf95d1c3200592bebb1e/f9e0944b7_generated_image.png';

// Floating energy particles overlay
function EnergyParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.45 + 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      color: Math.random() > 0.5 ? '#10b981' : '#f59e0b',
      drift: (Math.random() - 0.5) * 0.25,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y -= p.speed; p.x += p.drift;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.color); grad.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad; ctx.globalAlpha = p.alpha * 0.35; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fill();
      });
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
}

// Premium animated logo mark
function LogoMark() {
  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      {/* Outer ambient glow */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(16,185,129,0.15) 50%, transparent 75%)', filter: 'blur(28px)' }} />

      {/* Rotating outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{
          border: '2px solid transparent',
          borderTopColor: 'rgba(245,158,11,0.75)',
          borderRightColor: 'rgba(245,158,11,0.25)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'rgba(16,185,129,0.5)',
        }}
      />
      {/* Counter ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full"
        style={{
          border: '1.5px dashed rgba(16,185,129,0.35)',
        }}
      />

      {/* Main circle */}
      <div
        className="absolute inset-7 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(20,15,5,0.97) 0%, rgba(5,20,12,0.97) 100%)',
          border: '2px solid rgba(245,158,11,0.6)',
          boxShadow: '0 0 40px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <motion.line key={i} x1="22" y1="4" x2="22" y2="9"
              stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"
              transform={`rotate(${deg} 22 22)`}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
          {/* Sun body */}
          <circle cx="22" cy="22" r="9" fill="url(#sunG)" />
          <circle cx="22" cy="22" r="6" fill="url(#innerG)" opacity="0.7" />
          {/* Lightning bolt */}
          <path d="M25 14l-5 8h4l-3 8 8-11h-5z" fill="#fbbf24"
            style={{ filter: 'drop-shadow(0 0 5px rgba(245,158,11,0.9))' }} />
          <defs>
            <radialGradient id="sunG" cx="38%" cy="32%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="55%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </radialGradient>
            <radialGradient id="innerG" cx="38%" cy="32%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Orbiting green dot */}
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0" style={{ transformOrigin: 'center' }}>
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
          style={{ background: '#10b981', boxShadow: '0 0 10px #10b981, 0 0 20px rgba(16,185,129,0.5)' }} />
      </motion.div>
      {/* Orbiting amber dot (opposite) */}
      <motion.div animate={{ rotate: -360 }} transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0" style={{ transformOrigin: 'center' }}>
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          style={{ background: '#f59e0b', boxShadow: '0 0 8px #f59e0b, 0 0 16px rgba(245,158,11,0.4)' }} />
      </motion.div>
    </div>
  );
}

export default function WelcomePage({ onDismiss }) {
  const navigate = useNavigate();
  const handleGuide = () => { onDismiss(); navigate('/user-guide'); };
  const handleSkip = () => { onDismiss(); navigate('/Dashboard'); };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_IMAGE})` }}
      />
      {/* Dark overlays for readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,10,8,0.72) 0%, rgba(5,12,8,0.55) 40%, rgba(5,10,8,0.9) 80%, rgba(3,8,5,0.98) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(16,185,129,0.08) 0%, transparent 65%)' }} />

      {/* Particles */}
      <EnergyParticles />

      {/* Status bar row */}
      <div className="relative z-20 h-12 flex-shrink-0 flex items-center justify-center px-6">
        <div className="flex items-center gap-1.5">
          <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: 'rgba(52,211,153,0.6)' }}>
            Solar Club VPP
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-between px-6 pb-10 text-center overflow-y-auto">

        <div className="flex-1 flex flex-col items-center justify-center gap-5">

          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 170, damping: 16 }}
          >
            <LogoMark />
          </motion.div>

          {/* Brand name */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}
            className="space-y-2">
            <h2
              className="text-5xl font-black tracking-tight leading-none"
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #f59e0b 35%, #fbbf24 55%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 16px rgba(245,158,11,0.4))',
              }}
            >
              Solar Club
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 max-w-[60px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6))' }} />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase"
                style={{ color: 'rgba(52,211,153,0.75)' }}>VPP Home</span>
              <div className="h-px flex-1 max-w-[60px]"
                style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.6), transparent)' }} />
            </div>
          </motion.div>

          {/* Headline + body */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.54 }}
            className="space-y-3 max-w-[300px]">
            <h1 className="text-xl font-black text-white leading-snug" dir="rtl">
              ברוכים הבאים ל-Solar Club
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #6ee7b7, #10b981)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                המרכז שלך לניהול אנרגיה חכם
              </span>
            </h1>
            <p className="text-sm leading-relaxed" dir="rtl"
              style={{ color: 'rgba(255,255,255,0.5)' }}>
              אנחנו כאן כדי לעזור לך למקסם את הרווחים מהאנרגיה הסולארית שלך, לחסוך בעלויות, ולנהל את החשמל שלך בצורה חכמה ואוטומטית.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.68 }}
            className="flex gap-3 w-full max-w-[300px]">
            {[
              { val: '₪4,230', label: 'חיסכון חודשי', color: '#10b981' },
              { val: '18.4', label: 'kWh ייצור', color: '#f59e0b' },
              { val: '100%', label: 'אוטומטי', color: '#60a5fa' },
            ].map((s, i) => (
              <div key={i} className="flex-1 rounded-2xl py-3 px-1.5 text-center"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${s.color}30`,
                  backdropFilter: 'blur(8px)',
                }}>
                <p className="text-sm font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[9px] leading-tight mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.82 }}
          className="w-full max-w-[300px] space-y-3 pt-2"
        >
          {/* Primary — gold/teal gradient */}
          <motion.button
            onClick={handleGuide}
            whileTap={{ scale: 0.96 }}
            className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #059669 100%)',
              boxShadow: '0 6px 32px rgba(245,158,11,0.5), 0 1px 0 rgba(255,255,255,0.25) inset',
              color: '#fff',
              fontSize: '15px',
              textShadow: '0 1px 3px rgba(0,0,0,0.4)',
            }}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            להוראות שימוש ומדריכים
          </motion.button>

          {/* Secondary — subtle glass */}
          <motion.button
            onClick={handleSkip}
            whileTap={{ scale: 0.96 }}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '14px',
            }}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            דלג לדשבורד
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}