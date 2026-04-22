import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SplashScreen({ onDone }) {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowAuth(true), 6800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #020c18 0%, #030f1f 50%, #040d1a 100%)' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(59,130,246,0.08) 45%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(50px)',
          }}
        />
        <motion.div
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          style={{
            position: 'absolute', bottom: '15%', right: '10%',
            width: '280px', height: '280px',
            background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(35px)',
          }}
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full flex items-center justify-center"
      >
        <img
          src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/1fa311c7c_.png"
          alt="VPP Solar Club"
          style={{ width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="relative z-10 mt-3 flex flex-col items-center gap-2"
      >
        <p className="text-xs font-semibold tracking-[0.22em] uppercase"
          style={{ color: 'rgba(147,197,253,0.65)' }}>
          SMART ENERGY PLATFORM
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div style={{ width: 30, height: 1, background: 'rgba(16,185,129,0.4)' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'hsl(160 84% 44%)', boxShadow: '0 0 8px hsl(160 84% 44%)' }} />
          <div style={{ width: 30, height: 1, background: 'rgba(16,185,129,0.4)' }} />
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="absolute bottom-14 w-32"
      >
        <div style={{ height: 2, background: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ delay: 1.1, duration: 5.2, ease: 'linear' }}
            style={{ height: '100%', background: 'linear-gradient(90deg, hsl(160 84% 44%), hsl(215 60% 50%))', borderRadius: 4 }}
          />
        </div>
      </motion.div>

      {/* Fade-out overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#020c18' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: showAuth ? 0 : 1 }}
        transition={{ delay: showAuth ? 0 : 6.1, duration: 0.65 }}
      />

      {/* Auth buttons — appear after splash */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 left-0 right-0 px-8 z-20 space-y-3"
          >
            <button
              onClick={() => base44.auth.redirectToLogin()}
              className="w-full py-4 rounded-2xl font-black text-white text-base"
              style={{ background: 'linear-gradient(135deg,#FF8C00,#f59e0b)', boxShadow: '0 0 40px rgba(255,140,0,0.4)' }}
            >
              🔑 כניסה לחשבון קיים
            </button>
            <button
              onClick={() => { onDone(); navigate('/register'); }}
              className="w-full py-3.5 rounded-2xl font-bold text-white/80 text-sm"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              ✨ הרשמה — חשבון חדש
            </button>
            <p className="text-center text-[10px] text-white/25 pt-1">
              VPP Solar Club · Smart Energy Platform
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}