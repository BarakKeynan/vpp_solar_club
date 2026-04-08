import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030d1a] overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: '420px', height: '420px',
          background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 50%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Logo image — contained, never cropped */}
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="relative z-10 w-full px-6 flex items-center justify-center"
        style={{ maxWidth: '480px' }}
      >
        <img
          src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/1fa311c7c_.png"
          alt="VPP Solar Club"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '60vh',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </motion.div>

      {/* Tagline under logo */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 mt-4 text-sm font-medium tracking-widest"
        style={{ color: 'rgba(147,197,253,0.7)', letterSpacing: '0.18em' }}
      >
        SMART ENERGY PLATFORM
      </motion.p>

      {/* Bottom loader dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="absolute bottom-12 flex gap-2"
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.2 }}
            style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'hsl(160 84% 44%)',
            }}
          />
        ))}
      </motion.div>

      {/* Fade-out overlay */}
      <motion.div
        className="absolute inset-0 bg-[#030d1a] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.65 }}
      />
    </motion.div>
  );
}