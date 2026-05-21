import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const VIDEO_URL = 'https://media.base44.com/videos/public/69badf95d1c3200592bebb1e/9237d9c12_.mp4';

export default function SplashScreen({ onDone }) {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const handleVideoEnd = () => setShowAuth(true);

  // Fallback: show auth after 12s in case video fails to play
  useEffect(() => {
    const fallback = setTimeout(() => setShowAuth(true), 12000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Full-screen video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 1 }}
      />

      {/* Dark overlay when auth buttons appear */}
      <AnimatePresence>
        {showAuth && (
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.55)', zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>

      {/* Auth buttons — appear after video ends */}
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
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              ✨ הרשמה — חשבון חדש
            </button>
            <p className="text-center text-[10px] text-white/30 pt-1">
              VPP Solar Club · Smart Energy Platform
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}