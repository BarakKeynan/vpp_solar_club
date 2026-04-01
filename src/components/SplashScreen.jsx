import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SplashScreen({ onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2800);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#030d1a]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.img
        src="https://media.base44.com/images/public/69badf95d1c3200592bebb1e/1fa311c7c_.png"
        alt="VPP Solar Club"
        className="w-full h-full object-cover"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      {/* fade-out overlay at the end */}
      <motion.div
        className="absolute inset-0 bg-[#030d1a]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.7 }}
      />
    </motion.div>
  );
}