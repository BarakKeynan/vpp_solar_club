import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Type, Moon, Volume2, Hand, ChevronRight, RotateCcw } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const DEFAULTS = {
  fontSize: 'normal',   // 'small' | 'normal' | 'large' | 'xlarge'
  contrast: 'normal',   // 'normal' | 'high'
  reduceMotion: false,
  largeButtons: false,
  readAloud: false,
};

const FONT_SIZES = [
  { key: 'small',  label: 'קטן',    px: '13px' },
  { key: 'normal', label: 'רגיל',   px: '16px' },
  { key: 'large',  label: 'גדול',   px: '19px' },
  { key: 'xlarge', label: 'גדול מאוד', px: '22px' },
];

function applySettings(settings) {
  const root = document.documentElement;
  const size = FONT_SIZES.find(f => f.key === settings.fontSize)?.px || '16px';
  root.style.fontSize = size;
  root.style.filter = settings.contrast === 'high' ? 'contrast(1.4) brightness(1.1)' : '';
  root.style.setProperty('--reduce-motion', settings.reduceMotion ? '0s' : '');
}

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('vpp_accessibility') || 'null') || DEFAULTS;
  } catch { return DEFAULTS; }
}

function saveSettings(s) {
  localStorage.setItem('vpp_accessibility', JSON.stringify(s));
}

function ToggleRow({ icon: Icon, title, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <button
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${value ? 'bg-orange-500' : 'bg-white/15'}`}
        aria-label={title}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
      <div className="flex-1 mx-3 text-right">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>
      </div>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: value ? 'rgba(255,140,0,0.15)' : 'rgba(255,255,255,0.05)' }}>
        <Icon className="w-4 h-4" style={{ color: value ? '#fb923c' : 'rgba(255,255,255,0.3)' }} />
      </div>
    </div>
  );
}

export default function Accessibility() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    applySettings(settings);
    saveSettings(settings);
  }, [settings]);

  const set = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  const reset = () => {
    setSettings(DEFAULTS);
    applySettings(DEFAULTS);
    saveSettings(DEFAULTS);
  };

  return (
    <div className="p-4 pb-28 max-w-lg mx-auto space-y-4" dir="rtl">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-400" />
          {isHe ? 'נגישות' : 'Accessibility'}
        </h1>
        <p className="text-xs text-white/40 mt-1">
          {isHe ? 'התאם את חווית השימוש לצרכיך' : 'Customize your experience'}
        </p>
      </motion.div>

      {/* Font Size */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-orange-400" />
          <p className="text-sm font-black text-white">{isHe ? 'גודל גופן' : 'Font Size'}</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FONT_SIZES.map(f => (
            <button key={f.key} onClick={() => set('fontSize')(f.key)}
              className="py-2.5 rounded-xl text-xs font-bold transition-all"
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
        <div className="flex justify-between mt-2 px-1">
          {FONT_SIZES.map(f => (
            <span key={f.key} className="text-[10px] text-white/25 flex-1 text-center">{f.label}</span>
          ))}
        </div>
      </motion.div>

      {/* Contrast */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4 text-orange-400" />
          <p className="text-sm font-black text-white">{isHe ? 'ניגודיות' : 'Contrast'}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'normal', label: isHe ? 'רגיל' : 'Normal' },
            { key: 'high',   label: isHe ? 'גבוהה' : 'High Contrast' },
          ].map(c => (
            <button key={c.key} onClick={() => set('contrast')(c.key)}
              className="py-2.5 rounded-xl text-xs font-bold transition-all"
              style={{
                background: settings.contrast === c.key ? 'rgba(255,140,0,0.2)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${settings.contrast === c.key ? 'rgba(255,140,0,0.6)' : 'rgba(255,255,255,0.08)'}`,
                color: settings.contrast === c.key ? '#fb923c' : 'rgba(255,255,255,0.4)',
              }}>
              {c.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Toggles */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="rounded-2xl px-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <ToggleRow
          icon={Hand}
          title={isHe ? 'כפתורים גדולים' : 'Large Buttons'}
          desc={isHe ? 'הגדל אזורי לחיצה לנוחות שימוש' : 'Larger tap targets for easier use'}
          value={settings.largeButtons}
          onChange={set('largeButtons')}
        />
        <ToggleRow
          icon={Volume2}
          title={isHe ? 'הפחתת אנימציות' : 'Reduce Motion'}
          desc={isHe ? 'מצמצם אנימציות ומעברים' : 'Minimizes animations and transitions'}
          value={settings.reduceMotion}
          onChange={set('reduceMotion')}
        />
      </motion.div>

      {/* Accessibility Statement */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 space-y-2"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-xs font-black text-emerald-400">
          ♿ {isHe ? 'הצהרת נגישות' : 'Accessibility Statement'}
        </p>
        <p className="text-[11px] text-white/50 leading-relaxed">
          {isHe
            ? 'VPP Solar Club מחויבת לנגישות מלאה בהתאם לתקן WCAG 2.1 AA ולחוק שוויון זכויות לאנשים עם מוגבלות. לדיווח על בעיית נגישות פנה אלינו בדוא"ל: accessibility@vppsolar.co.il'
            : 'VPP Solar Club is committed to full accessibility per WCAG 2.1 AA. To report an accessibility issue, contact us at accessibility@vppsolar.co.il'}
        </p>
      </motion.div>

      {/* Reset */}
      <motion.button
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        onClick={reset}
        className="w-full py-3 rounded-2xl text-sm font-bold text-white/40 hover:text-white/70 flex items-center justify-center gap-2 transition-colors"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <RotateCcw className="w-3.5 h-3.5" />
        {isHe ? 'אפס הגדרות נגישות' : 'Reset to defaults'}
      </motion.button>
    </div>
  );
}