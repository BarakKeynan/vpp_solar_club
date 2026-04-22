import React, { useState } from 'react';
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
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark overlay gradient */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(160deg, rgba(2,8,20,0.92) 0%, rgba(4,12,30,0.82) 50%, rgba(2,10,22,0.95) 100%)',
        }}
      />

      {/* Cyan/blue glow */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(56,189,248,0.10) 0%, rgba(14,165,233,0.06) 40%, transparent 70%)',
          filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '20%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      </div>

      {/* Lang toggle */}
      <button
        onClick={() => setLang(l => l === 'he' ? 'en' : 'he')}
        className="absolute top-6 right-6 z-30 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
        style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.3)', color: 'rgba(147,210,245,0.8)' }}
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
          style={{ color: 'rgba(147,210,245,0.55)', letterSpacing: '0.22em' }}
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
            background: 'linear-gradient(135deg, rgba(14,165,233,0.25) 0%, rgba(56,189,248,0.15) 100%)',
            border: '1px solid rgba(56,189,248,0.45)',
            boxShadow: '0 0 40px rgba(56,189,248,0.18), 0 4px 24px rgba(0,0,0,0.4)',
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
        style={{ color: 'rgba(147,210,245,0.22)' }}
      >
        {t.brand}
      </motion.p>
    </div>
  );
}