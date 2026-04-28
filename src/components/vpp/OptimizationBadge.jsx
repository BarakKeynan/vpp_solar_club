import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Minus } from 'lucide-react';

export default function OptimizationBadge({ isActive, currentPrice, peakThreshold }) {
  return (
    <AnimatePresence mode="wait">
      {isActive ? (
        <motion.div
          key="active"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative flex items-center gap-3 rounded-2xl px-4 py-3 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
            border: '1px solid rgba(16,185,129,0.4)',
            boxShadow: '0 0 24px rgba(16,185,129,0.15)',
          }}
        >
          {/* Pulse ring */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(16,185,129,0.4)' }}
            />
            <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
              style={{ background: 'rgba(16,185,129,0.25)', border: '1.5px solid rgba(16,185,129,0.6)' }}>
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-emerald-400 tracking-widest uppercase">VPP DISCHARGE ACTIVE</p>
            <p className="text-[10px] text-white/50 mt-0.5">
              Current: <span className="text-emerald-300 font-bold">{currentPrice?.toFixed(3)} ₪/kWh</span>
              {' · '}Peak threshold: <span className="text-white/60">{peakThreshold?.toFixed(3)} ₪/kWh</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-emerald-400 font-bold uppercase">Top 10%</p>
            <p className="text-[9px] text-white/30">price window</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Minus className="w-4 h-4 text-white/30" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/40">VPP STANDBY</p>
            <p className="text-[10px] text-white/25">
              Current: {currentPrice?.toFixed(3) ?? '—'} ₪/kWh · Waiting for peak window
            </p>
          </div>
          <TrendingUp className="w-4 h-4 text-white/20 ml-auto" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}