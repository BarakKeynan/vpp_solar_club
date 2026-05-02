import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Settings, Sparkles, X, CheckCircle2, Clock, TrendingUp, Sun } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

// AI recommendation data
const AI_RECS = [
  {
    icon: Sun,
    color: '#10b981',
    title: 'טעינה: 09:00–15:00',
    desc: 'שעות הייצור האופטימליות של הפאנלים היום — עננות נמוכה, קרינה 87%.',
    change: { type: 'charge', value: [9, 15] },
  },
  {
    icon: TrendingUp,
    color: '#f59e0b',
    title: 'מכירה: 20:00–23:00',
    desc: 'שעות השיא של חברת החשמל — מחיר ₪0.82/kWh, פי 3.2 מהממוצע.',
    change: { type: 'sell', value: [20, 23] },
  },
  {
    icon: Clock,
    color: '#8b5cf6',
    title: 'שמור 20% רזרבה',
    desc: 'תחזית שימוש לילי 4.1 kWh — מומלץ לא לרדת מתחת ל-20% טעינה.',
    change: null,
  },
];

function AIModal({ onClose, onApply }) {
  const [selected, setSelected] = useState(AI_RECS.map((_, i) => i)); // all checked by default

  const toggle = (i) => setSelected(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  );

  const handleApply = () => onApply(selected);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0, scale: 0.97 }}
        transition={{ type: 'spring', damping: 22, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl p-5 space-y-4"
        style={{ background: 'hsl(222 40% 10%)', border: '1px solid rgba(139,92,246,0.35)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <p className="text-sm font-black text-white">המלצות AI לתזמון אחסון</p>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            <X className="w-3.5 h-3.5 text-white/50" />
          </button>
        </div>

        {/* Context banner */}
        <div className="rounded-xl px-3 py-2 text-[11px] text-violet-300/80"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          מבוסס על: תחזית מזג אוויר, מחירי רשת בזמן אמת ודפוס הצריכה שלך ב-30 הימים האחרונים.
        </div>

        {/* Recommendations with radio/checkboxes */}
        <div className="space-y-2.5">
          {AI_RECS.map((rec, i) => {
            const Icon = rec.icon;
            const checked = selected.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)}
                className="w-full rounded-xl p-3 flex items-start gap-3 text-left transition-all"
                style={{
                  background: checked ? `${rec.color}12` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${checked ? rec.color + '50' : 'rgba(255,255,255,0.08)'}`,
                }}>
                {/* Custom radio circle */}
                <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 transition-all"
                  style={{
                    background: checked ? rec.color : 'transparent',
                    border: `2px solid ${checked ? rec.color : 'rgba(255,255,255,0.25)'}`,
                  }}>
                  {checked && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${rec.color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: rec.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black text-white">{rec.title}</p>
                  <p className="text-[11px] text-white/55 leading-relaxed mt-0.5">{rec.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Buttons row */}
        <div className="flex gap-2 pt-1">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white/40 transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            ביטול
          </button>
          <button onClick={handleApply}
            disabled={selected.length === 0}
            className="flex-2 flex-1 py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(16,185,129,0.3))', border: '1px solid rgba(139,92,246,0.5)', color: '#c4b5fd' }}>
            <CheckCircle2 className="w-4 h-4" />
            אשר שינויים ({selected.length})
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const fmt = (h) => `${String(h).padStart(2, '0')}:00`;

export default function Schedule() {
  const { t } = useLang();
  const [chargeRange, setChargeRange] = useState([8, 14]);
  const [sellRange, setSellRange] = useState([20, 23]);
  const [auto, setAuto] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const handleAuto = (v) => {
    setAuto(v);
    toast.success(v ? t('auto_on_msg') : t('auto_off_msg'));
  };

  const handleApplyAI = (selected) => {
    selected.forEach(i => {
      const rec = AI_RECS[i];
      if (rec.change?.type === 'charge') setChargeRange(rec.change.value);
      if (rec.change?.type === 'sell') setSellRange(rec.change.value);
    });
    setShowAI(false);
    toast.success(`✅ ${selected.length} המלצות AI יושמו`);
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <h1 className="text-xl font-black text-foreground">{t('schedule_title')}</h1>
        <Settings className="w-5 h-5 text-muted-foreground" />
      </motion.div>

      {/* Battery Status */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-primary/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">{t('home_battery')}</span>
          </div>
          <span className="text-2xl font-black text-primary">82%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: '82%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">{t('battery_remaining', { kwh: '16.4' })}</span>
          <span className="text-xs text-muted-foreground">{t('battery_capacity', { kwh: '20' })}</span>
        </div>
      </motion.div>

      {/* AI Row */}
      <motion.button
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
        onClick={() => setShowAI(true)}
        className="w-full rounded-2xl border p-4 flex items-center justify-between text-left transition-all active:scale-[0.98]"
        style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.3)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.18)' }}>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">המלצות AI לתזמון</p>
            <p className="text-xs text-white/45">לחץ לצפייה ואישור המלצות מותאמות אישית</p>
          </div>
        </div>
        <div className="text-[10px] font-black px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.35)' }}>
          3 המלצות
        </div>
      </motion.button>

      {/* Auto Toggle */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className={`rounded-2xl border p-4 flex items-center justify-between transition-colors ${auto ? 'border-primary/50 bg-primary/10' : 'border-border bg-card'}`}>
        <div>
          <p className="text-sm font-bold text-foreground">{t('auto_mode')}</p>
          <p className="text-xs text-muted-foreground">{t('auto_mode_sub')}</p>
        </div>
        <Switch checked={auto} onCheckedChange={handleAuto} />
      </motion.div>

      {/* Charge Schedule */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className={`bg-card rounded-2xl border border-border p-4 space-y-4 transition-opacity ${auto ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20">
            <Battery className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground">{t('charge_hours')}</p>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-primary">{fmt(chargeRange[0])}</span>
          <span className="text-muted-foreground">{t('until')}</span>
          <span className="text-primary">{fmt(chargeRange[1])}</span>
        </div>
        <Slider min={0} max={23} step={1} value={chargeRange} onValueChange={setChargeRange} className="w-full" />
        <p className="text-xs text-muted-foreground">{t('charge_from_panels')}</p>
      </motion.div>

      {/* Sell Schedule */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className={`bg-card rounded-2xl border border-border p-4 space-y-4 transition-opacity ${auto ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary/20">
            <Zap className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-sm font-bold text-foreground">{t('sell_hours')}</p>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-secondary">{fmt(sellRange[0])}</span>
          <span className="text-muted-foreground">{t('until')}</span>
          <span className="text-secondary">{fmt(sellRange[1])}</span>
        </div>
        <Slider min={0} max={23} step={1} value={sellRange} onValueChange={setSellRange} className="w-full" />
        <p className="text-xs text-muted-foreground">{t('sell_peak')}</p>
      </motion.div>

      <button
        onClick={() => toast.success(t('saved_ok'))}
        className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all"
      >
        {t('save_settings')}
      </button>

      <AnimatePresence>
        {showAI && <AIModal onClose={() => setShowAI(false)} onApply={(sel) => handleApplyAI(sel)} />}
      </AnimatePresence>
    </div>
  );
}