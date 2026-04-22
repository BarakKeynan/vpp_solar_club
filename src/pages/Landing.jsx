import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

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
          backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80)',
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

      {/* Subtle energy glow */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          style={{
            position: 'absolute', top: '35%', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '400px',
            background: 'radial-gradient(ellipse, rgba(255,140,0,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: 'rgba(255,140,0,0.12)',
            border: '1px solid rgba(255,140,0,0.3)',
            color: '#fb923c',
            letterSpacing: '0.18em',
          }}
        >
          Smart Energy Platform
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4"
          style={{ fontFamily: "'Inter', 'Heebo', sans-serif", letterSpacing: '-0.02em' }}
        >
          VPP Solar Club:<br />
          <span style={{ color: '#FF8C00' }}>The Future of</span><br />
          Energy Profitability.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.28 }}
          className="text-lg font-light mb-12"
          style={{ color: 'rgba(255,255,255,0.52)', letterSpacing: '0.01em' }}
        >
          Manage, Store, and Trade Energy with AI.
        </motion.p>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: pressed ? 0.6 : 1, scale: pressed ? 0.97 : 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          onClick={handleEnter}
          className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-white text-lg transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #FF8C00 0%, #f59e0b 100%)',
            boxShadow: '0 0 60px rgba(255,140,0,0.45), 0 4px 24px rgba(0,0,0,0.4)',
            letterSpacing: '0.01em',
          }}
        >
          Enter System
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Bottom brand line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute bottom-8 z-20 text-xs tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.18)' }}
      >
        VPP Solar Club · Powered by AI
      </motion.p>
    </div>
  );
}