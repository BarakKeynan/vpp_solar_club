import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function InfoButton({ id, onOpen, highlight, buttonRef }) {
  return (
    <motion.button
      ref={buttonRef}
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

export default function InfoPopover({ open, onClose, content, position = 'bottom', anchorRef }) {
  const ref = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const POPOVER_WIDTH = 256; // w-64

  // Calculate position from anchor element
  useEffect(() => {
    if (!open || !anchorRef?.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const margin = 8;
    const viewportWidth = window.innerWidth;

    // Try to align right edge of popover with right edge of button
    let left = rect.right - POPOVER_WIDTH;
    // Clamp so it doesn't go off-screen on either side
    left = Math.max(margin, Math.min(left, viewportWidth - POPOVER_WIDTH - margin));

    const top = position === 'bottom'
      ? rect.bottom + margin
      : rect.top - margin; // will be adjusted below with transform

    setCoords({ top, left });
  }, [open, anchorRef, position]);

  // Click-outside close
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('pointerdown', handler, true);
    return () => document.removeEventListener('pointerdown', handler, true);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-[9999] rounded-2xl p-4 shadow-2xl"
          style={{
            width: POPOVER_WIDTH,
            top: coords.top,
            left: coords.left,
            ...(position === 'top' ? { transform: 'translateY(-100%)' } : {}),
            background: 'rgba(15,25,42,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(139,92,246,0.35)',
          }}
        >
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
    </AnimatePresence>,
    document.body
  );
}