import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Type, Eye, Zap, RotateCcw, X } from 'lucide-react';

const DEFAULTS = {
  fontSize: 'normal',
  contrast: 'normal',
  reduceMotion: false,
  largeButtons: false,
};

const FONT_SIZES = [
  { key: 'small',  label: 'קטן',    px: '13px' },
  { key: 'normal', label: 'רגיל',   px: '16px' },
  { key: 'large',  label: 'גדול',   px: '19px' },
  { key: 'xlarge', label: 'ענק',    px: '22px' },
];

function applySettings(settings) {
  const root = document.documentElement;
  const size = FONT_SIZES.find(f => f.key === settings.fontSize)?.px || '16px';
  root.style.fontSize = size;
  root.style.filter = settings.contrast === 'high' ? 'contrast(1.4) brightness(1.1)' : '';
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('vpp_accessibility') || 'null') || DEFAULTS;
  } catch { return DEFAULTS; }
}

function saveSettings(s) {
  localStorage.setItem('vpp_accessibility', JSON.stringify(s));
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(loadSettings);
  const panelRef = useRef(null);

  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    saveSettings(DEFAULTS);
  };

  return (
    <div ref={panelRef} className="fixed left-4 bottom-24 z-50" dir="rtl">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mb-3 rounded-2xl p-4 w-64 space-y-4 shadow-2xl"
            style={{
              background: 'rgba(10,18,35,0.97)',
              border: '1px solid rgba(255,165,0,0.3)',
              boxShadow: '0 0 40px rgba(255,140,0,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-black text-white flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-orange-400" />
                נגישות
              </p>
              <button onClick={() => setOpen(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.07)' }}>
                <X className="w-3 h-3 text-white/50" />
              </button>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 flex items-center gap-1.5 uppercase tracking-widest">
                <Type className="w-3 h-3" /> גודל טקסט
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {FONT_SIZES.map(f => (
                  <button key={f.key} onClick={() => set('fontSize')(f.key)}
                    className="py-2 rounded-xl text-sm font-bold transition-all"
                    style={{
                      background: settings.fontSize === f.key ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${settings.fontSize === f.key ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      color: settings.fontSize === f.key ? '#fb923c' : 'rgba(255,255,255,0.4)',
                      fontSize: f.px,
                    }}>
                    א
                  </button>
                ))}
              </div>
              <div className="flex justify-between px-0.5">
                {FONT_SIZES.map(f => (
                  <span key={f.key} className="text-[9px] text-white/25 flex-1 text-center">{f.label}</span>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 flex items-center gap-1.5 uppercase tracking-widest">
                <Eye className="w-3 h-3" /> ניגודיות
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {[{ key: 'normal', label: 'רגיל' }, { key: 'high', label: 'גבוהה' }].map(c => (
                  <button key={c.key} onClick={() => set('contrast')(c.key)}
                    className="py-2 rounded-xl text-xs font-bold transition-all"
                    style={{
                      background: settings.contrast === c.key ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${settings.contrast === c.key ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.08)'}`,
                      color: settings.contrast === c.key ? '#fb923c' : 'rgba(255,255,255,0.4)',
                    }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-white/40 flex items-center gap-1.5 uppercase tracking-widest">
                <Zap className="w-3 h-3" /> עוד אפשרויות
              </p>
              {[
                { key: 'reduceMotion', label: 'הפחת אנימציות' },
                { key: 'largeButtons', label: 'כפתורים גדולים' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => set(key)(!settings[key])}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: settings[key] ? 'rgba(255,140,0,0.1)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${settings[key] ? 'rgba(255,140,0,0.35)' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  <div className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${settings[key] ? 'bg-orange-500' : 'bg-white/15'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${settings[key] ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: settings[key] ? '#fb923c' : 'rgba(255,255,255,0.45)' }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* Reset */}
            <button onClick={reset}
              className="w-full py-2 rounded-xl text-xs font-bold text-white/30 flex items-center justify-center gap-1.5 transition-colors hover:text-white/60"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <RotateCcw className="w-3 h-3" />
              איפוס להגדרות ברירת מחדל
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileTap={{ scale: 0.92 }}
        animate={{ boxShadow: open ? '0 0 24px rgba(255,140,0,0.5)' : '0 0 16px rgba(255,140,0,0.2)' }}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-colors"
        style={{
          background: open ? 'rgba(255,140,0,0.3)' : 'rgba(255,140,0,0.15)',
          border: '2px solid rgba(255,140,0,0.5)',
        }}
        aria-label="תפריט נגישות"
      >
        <Accessibility className="w-5 h-5 text-orange-400" />
      </motion.button>
    </div>
  );
}