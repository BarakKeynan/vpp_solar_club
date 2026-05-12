import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const T = {
  he: {
    sub: 'נהל, אחסן וסחר באנרגיה עם AI',
    enter: 'כניסה למערכת',
    brand: 'VPP Solar Club · מופעל על ידי AI',
  },
  en: {
    sub: 'Manage, Store & Trade Energy with AI',
    enter: 'Enter System',
    brand: 'VPP Solar Club · Powered by AI',
  },
};

// Solar panel grid SVG background
function SolarPanelGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.13 }}
    >
      <defs>
        <pattern id="panel" x="0" y="0" width="80" height="60" patternUnits="userSpaceOnUse">
          {/* Panel frame */}
          <rect x="2" y="2" width="76" height="56" rx="3" fill="none" stroke="#10b981" strokeWidth="1" />
          {/* Inner grid lines - vertical */}
          <line x1="28" y1="2" x2="28" y2="58" stroke="#10b981" strokeWidth="0.5" />
          <line x1="54" y1="2" x2="54" y2="58" stroke="#10b981" strokeWidth="0.5" />
          {/* Inner grid lines - horizontal */}
          <line x1="2" y1="20" x2="78" y2="20" stroke="#10b981" strokeWidth="0.5" />
          <line x1="2" y1="40" x2="78" y2="40" stroke="#10b981" strokeWidth="0.5" />
          {/* Cell fills */}
          <rect x="3" y="3" width="24" height="16" rx="1" fill="rgba(16,185,129,0.08)" />
          <rect x="29" y="3" width="24" height="16" rx="1" fill="rgba(16,185,129,0.12)" />
          <rect x="55" y="3" width="22" height="16" rx="1" fill="rgba(16,185,129,0.06)" />
          <rect x="3" y="21" width="24" height="18" rx="1" fill="rgba(16,185,129,0.10)" />
          <rect x="29" y="21" width="24" height="18" rx="1" fill="rgba(16,185,129,0.07)" />
          <rect x="55" y="21" width="22" height="18" rx="1" fill="rgba(16,185,129,0.11)" />
          <rect x="3" y="41" width="24" height="16" rx="1" fill="rgba(16,185,129,0.09)" />
          <rect x="29" y="41" width="24" height="16" rx="1" fill="rgba(16,185,129,0.05)" />
          <rect x="55" y="41" width="22" height="16" rx="1" fill="rgba(16,185,129,0.08)" />
        </pattern>
        <pattern id="panelGold" x="40" y="30" width="80" height="60" patternUnits="userSpaceOnUse">
          <rect x="2" y="2" width="76" height="56" rx="3" fill="none" stroke="rgba(245,158,11,0.6)" strokeWidth="0.8" />
          <line x1="28" y1="2" x2="28" y2="58" stroke="rgba(245,158,11,0.4)" strokeWidth="0.4" />
          <line x1="54" y1="2" x2="54" y2="58" stroke="rgba(245,158,11,0.4)" strokeWidth="0.4" />
          <line x1="2" y1="20" x2="78" y2="20" stroke="rgba(245,158,11,0.4)" strokeWidth="0.4" />
          <line x1="2" y1="40" x2="78" y2="40" stroke="rgba(245,158,11,0.4)" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#panel)" />
      <rect width="100%" height="100%" fill="url(#panelGold)" />
    </svg>
  );
}

// Floating energy particles
function EnergyParticles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.5 + 0.15,
      alpha: Math.random() * 0.55 + 0.15,
      color: Math.random() > 0.45 ? '#10b981' : '#f59e0b',
      drift: (Math.random() - 0.5) * 0.3,
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
        ctx.fillStyle = grad; ctx.globalAlpha = p.alpha * 0.4; ctx.fill();
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
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

export default function Landing() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);
  const [lang, setLang] = useState('he');
  const t = T[lang];

  const handleEnter = () => {
    setPressed(true);
    setTimeout(() => navigate('/auth'), 400);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: '#050d0a' }}>

      {/* Solar panel grid */}
      <div className="absolute inset-0 z-0">
        <SolarPanelGrid />
      </div>

      {/* Hero background image — blended on top of panels */}
      <div
        className="absolute inset-0 z-1"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
        }}
      />

      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0 z-2"
        style={{
          background: 'linear-gradient(160deg, rgba(2,8,12,0.88) 0%, rgba(3,10,8,0.72) 50%, rgba(2,8,10,0.93) 100%)',
        }}
      />

      {/* Energy particles */}
      <div className="absolute inset-0 z-3 pointer-events-none">
        <EnergyParticles />
      </div>

      {/* Green + amber ambient glows */}
      <div className="absolute inset-0 z-3 pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, rgba(245,158,11,0.06) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '15%',
          width: '250px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.09) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', top: '55%', left: '10%',
          width: '200px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Lang toggle */}
      <button
        onClick={() => setLang(l => l === 'he' ? 'en' : 'he')}
        className="absolute top-6 right-6 z-30 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: 'rgba(110,231,183,0.85)' }}
      >
        {lang === 'he' ? 'EN' : 'עב'}
      </button>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

        {/* Logo image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 w-72 sm:w-96"
        >
          <img
            src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/f004e2167_Screenshot_20260422_170358_Gallery.jpg"
            alt="VPP Solar Club"
            className="w-full h-auto object-contain rounded-2xl"
            style={{ filter: 'drop-shadow(0 0 40px rgba(56,189,248,0.35))' }}
          />
        </motion.div>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base font-light mb-10 tracking-widest uppercase"
          style={{ color: 'rgba(110,231,183,0.55)', letterSpacing: '0.22em' }}
        >
          {t.sub}
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: pressed ? 0.6 : 1, y: 0, scale: pressed ? 0.97 : 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          onClick={handleEnter}
          className="flex items-center gap-3 px-10 py-4 rounded-2xl font-semibold text-white text-base transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.28) 0%, rgba(245,158,11,0.18) 100%)',
            border: '1px solid rgba(16,185,129,0.5)',
            boxShadow: '0 0 40px rgba(16,185,129,0.22), 0 4px 24px rgba(0,0,0,0.45)',
            backdropFilter: 'blur(10px)',
            letterSpacing: '0.06em',
          }}
        >
          {t.enter}
          <ArrowRight className="w-4 h-4 opacity-70" />
        </motion.button>
      </div>

      {/* Bottom brand line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 z-20 text-xs tracking-widest uppercase"
        style={{ color: 'rgba(110,231,183,0.22)' }}
      >
        {t.brand}
      </motion.p>
    </div>
  );
}