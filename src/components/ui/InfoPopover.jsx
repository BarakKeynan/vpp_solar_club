import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * InfoPopover — a small (?) trigger that opens a frosted-glass explanation bubble.
 *
 * Props:
 *  id          – unique string used for the onboarding tour
 *  content     – string or JSX explanation text
 *  open        – controlled open state
 *  onOpen      – called when user taps (?)
 *  onClose     – called when bubble should close
 *  position    – 'top' | 'bottom' (default 'bottom')
 *  highlight   – if true, pulse the (?) button (used by tour)
 */
export function InfoButton({ id, onOpen, highlight }) {
  return (
    <motion.button
      data-info-id={id}
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
      animate={highlight ? { scale: [1, 1.3, 1] } : { scale: 1 }}
      transition={highlight ? { duration: 0.7, repeat: Infinity } : {}}
      className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black transition-all active:scale-90 select-none"
      style={{
        background: highlight ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.08)',
        border: `1px solid ${highlight ? 'rgba(139,92,246,0.7)' : 'rgba(255,255,255,0.18)'}`,
        color: highlight ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
        boxShadow: highlight ? '0 0 10px rgba(139,92,246,0.5)' : 'none',
      }}
    >
      ?
    </motion.button>
  );
}

export default function InfoPopover({ open, onClose, content, position = 'bottom' }) {
  const ref = useRef(null);

  // One-tap outside close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.85, y: position === 'bottom' ? -6 : 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: position === 'bottom' ? -6 : 6 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 w-64 rounded-2xl p-4 shadow-2xl"
          style={{
            background: 'rgba(15,25,42,0.82)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(139,92,246,0.35)',
            ...(position === 'bottom' ? { top: 'calc(100% + 8px)', right: 0 } : { bottom: 'calc(100% + 8px)', right: 0 }),
          }}
        >
          {/* Arrow */}
          <div
            className="absolute w-2.5 h-2.5 rotate-45"
            style={{
              background: 'rgba(15,25,42,0.9)',
              border: '1px solid rgba(139,92,246,0.35)',
              ...(position === 'bottom'
                ? { top: -6, right: 14, borderBottom: 'none', borderRight: 'none' }
                : { bottom: -6, right: 14, borderTop: 'none', borderLeft: 'none' }),
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-2.5 left-3 text-white/25 hover:text-white/60 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <p className="text-xs text-white/80 leading-relaxed text-right pr-1" dir="rtl">
            {content}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}