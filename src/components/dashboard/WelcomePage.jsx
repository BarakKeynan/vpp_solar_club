import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Animated background canvas — solar panels + energy bolts
function SolarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const W = canvas.width;
    const H = canvas.height;

    // Particles: small glowing dots drifting upward
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.5 ? '#10b981' : '#f59e0b',
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) { p.y = H; p.x = Math.random() * W; }
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
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
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
      style={{ background: 'linear-gradient(160deg, hsl(222 47% 5%) 0%, hsl(222 40% 9%) 60%, hsl(222 47% 5%) 100%)' }}
    >
      <SolarBackground />

      {/* Status bar spacer */}
      <div className="h-10 flex-shrink-0" />

      {/* Content */}
      <div className="relative flex-1 flex flex-col items-center justify-between px-6 pb-10 text-center">

        {/* Logo section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">

          {/* Icon + glow */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative flex items-center justify-center"
          >
            {/* Glow ring */}
            <div
              className="absolute w-40 h-40 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            {/* Icon circle */}
            <div
              className="relative w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(16,185,129,0.15))',
                border: '2px solid rgba(245,158,11,0.5)',
                boxShadow: '0 0 40px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Sun + bolt combined */}
              <div className="relative flex items-center justify-center">
                <span className="text-5xl leading-none select-none">☀️</span>
                <Zap
                  className="absolute -bottom-1 -right-1 w-5 h-5"
                  style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 6px #f59e0b)' }}
                />
              </div>
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-1"
          >
            <p
              className="text-3xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #10b981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Solar Club
            </p>
            <p className="text-sm font-bold text-white/40 tracking-widest uppercase">VPP Home</p>
          </motion.div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 }}
            className="w-16 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)' }}
          />

          {/* Main heading */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="space-y-3"
          >
            <h1 className="text-2xl font-black text-white leading-tight" dir="rtl">
              ברוכים הבאים ל-Solar Club
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #34d399, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                המרכז שלך לניהול אנרגיה חכם
              </span>
            </h1>

            <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto" dir="rtl">
              אנחנו כאן כדי לעזור לך למקסם את הרווחים מהאנרגיה הסולארית שלך,
              לחסוך בעלויות, ולנהל את החשמל שלך בצורה חכמה ואוטומטית.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 w-full max-w-xs"
          >
            {[
              { val: '₪4,230', label: 'חיסכון חודשי ממוצע' },
              { val: '18.4', label: 'kWh ייצור יומי' },
              { val: '100%', label: 'אוטומטי' },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl py-3 px-2 text-center"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <p className="text-base font-black text-white">{s.val}</p>
                <p className="text-[9px] text-white/35 leading-tight mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="w-full max-w-xs space-y-3"
        >
          {/* Primary CTA */}
          <button
            onClick={handleGuide}
            className="w-full py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2.5 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              boxShadow: '0 4px 24px rgba(245,158,11,0.4)',
              color: '#1a0a00',
            }}
          >
            <BookOpen className="w-4 h-4" />
            להוראות שימוש ומדריכים
          </button>

          {/* Secondary CTA */}
          <button
            onClick={handleSkip}
            className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 text-white/60 hover:text-white/80"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            דלג לדשבורד
            <ChevronLeft className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}