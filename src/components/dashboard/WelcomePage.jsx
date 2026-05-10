import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Zap, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animated starfield + energy stream background
function SolarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const W = () => canvas.width;
    const H = () => canvas.height;

    // Stars
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 1.2 + 0.2,
      alpha: Math.random() * 0.6 + 0.1,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    // Energy particles (rising)
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.5 + 0.2,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.5 ? '#10b981' : '#f59e0b',
      drift: (Math.random() - 0.5) * 0.3,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // Draw stars
      stars.forEach(s => {
        s.twinkle += s.speed;
        const alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Draw energy particles
      particles.forEach(p => {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -10) { p.y = H() + 10; p.x = Math.random() * W(); }
        if (p.x < 0 || p.x > W()) p.drift *= -1;

        // Glow effect
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.alpha * 0.4;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// Premium SVG logo
function SolarClubLogo() {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {/* Outer glow layers */}
      <div className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(16,185,129,0.1) 50%, transparent 75%)', filter: 'blur(24px)' }} />
      <div className="absolute inset-3 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', filter: 'blur(12px)' }} />

      {/* Rotating outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full"
        style={{
          border: '1.5px solid transparent',
          borderTopColor: 'rgba(245,158,11,0.6)',
          borderRightColor: 'rgba(245,158,11,0.2)',
          borderBottomColor: 'transparent',
          borderLeftColor: 'rgba(16,185,129,0.4)',
        }}
      />
      {/* Counter-rotating middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-4 rounded-full"
        style={{
          border: '1px solid transparent',
          borderTopColor: 'rgba(16,185,129,0.5)',
          borderRightColor: 'transparent',
          borderBottomColor: 'rgba(245,158,11,0.3)',
          borderLeftColor: 'transparent',
        }}
      />

      {/* Main circle */}
      <div
        className="absolute inset-6 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(145deg, rgba(30,25,10,0.95) 0%, rgba(10,30,20,0.95) 100%)',
          border: '1.5px solid rgba(245,158,11,0.45)',
          boxShadow: '0 0 30px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)',
        }}
      >
        {/* SVG sun icon */}
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          {/* Sun rays */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <motion.line
              key={i}
              x1="26" y1="6" x2="26" y2="11"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${deg} 26 26)`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          {/* Sun circle */}
          <circle cx="26" cy="26" r="10" fill="url(#sunGrad)" />
          {/* Inner glow */}
          <circle cx="26" cy="26" r="7" fill="url(#innerGrad)" opacity="0.6" />
          {/* Lightning bolt */}
          <path
            d="M29 19l-5 8h4l-2 6 6-9h-4z"
            fill="#fbbf24"
            style={{ filter: 'drop-shadow(0 0 4px #f59e0b)' }}
          />
          <defs>
            <radialGradient id="sunGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
            <radialGradient id="innerGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Orbiting dot */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
        style={{ transformOrigin: 'center' }}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
          style={{ background: '#10b981', boxShadow: '0 0 8px #10b981, 0 0 16px rgba(16,185,129,0.4)' }} />
      </motion.div>
    </div>
  );
}

export default function WelcomePage({ onDismiss }) {
  const navigate = useNavigate();

  const handleGuide = () => {
    onDismiss();
    navigate('/user-guide');
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 30%, hsl(222 40% 10%) 0%, hsl(222 47% 4%) 70%)' }}
    >
      <SolarBackground />

      {/* Top status bar area */}
      <div className="relative h-12 flex-shrink-0 flex items-center justify-center px-6">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-white/30 font-bold tracking-widest uppercase">Solar Club VPP</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-between px-6 pb-8 text-center overflow-y-auto">

        <div className="flex-1 flex flex-col items-center justify-center gap-5 py-4">

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <SolarClubLogo />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-1.5"
          >
            <h2
              className="text-4xl font-black tracking-tight leading-none"
              style={{
                background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 40%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 2px 12px rgba(245,158,11,0.3))',
              }}
            >
              Solar Club
            </h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5))' }} />
              <p className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: 'rgba(16,185,129,0.7)' }}>VPP Home</p>
              <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(16,185,129,0.5), transparent)' }} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="space-y-2.5 max-w-[300px]"
          >
            <h1 className="text-xl font-black text-white leading-snug" dir="rtl">
              ברוכים הבאים ל-Solar Club
              <br />
              <span
                className="text-lg"
                style={{
                  background: 'linear-gradient(135deg, #6ee7b7, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                המרכז שלך לניהול אנרגיה חכם
              </span>
            </h1>

            <p className="text-sm text-white/45 leading-relaxed" dir="rtl">
              אנחנו כאן כדי לעזור לך למקסם את הרווחים מהאנרגיה הסולארית שלך, לחסוך בעלויות, ולנהל את החשמל שלך בצורה חכמה ואוטומטית.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 w-full max-w-[300px]"
          >
            {[
              { val: '₪4,230', label: 'חיסכון חודשי', color: '#10b981' },
              { val: '18.4', label: 'kWh ייצור', color: '#f59e0b' },
              { val: '100%', label: 'אוטומטי', color: '#60a5fa' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl py-3 px-1.5 text-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${s.color}22`,
                  boxShadow: `inset 0 1px 0 ${s.color}15`,
                }}
              >
                <p className="text-sm font-black" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[9px] text-white/30 leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="w-full max-w-[300px] space-y-3"
        >
          {/* Primary */}
          <button
            onClick={handleGuide}
            className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2.5 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              boxShadow: '0 4px 28px rgba(245,158,11,0.45), 0 1px 0 rgba(255,255,255,0.2) inset',
              color: '#1c0d00',
              fontSize: '15px',
            }}
          >
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            להוראות שימוש ומדריכים
          </button>

          {/* Secondary */}
          <button
            onClick={handleSkip}
            className="w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.25)',
              color: 'rgba(110,231,183,0.75)',
              fontSize: '14px',
            }}
          >
            <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
            דלג לדשבורד
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}