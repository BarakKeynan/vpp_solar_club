import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp, Zap, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const PRIORITY_CONFIG = {
  high:   { label: 'עדיפות גבוהה', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  medium: { label: 'עדיפות בינונית', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
  low:    { label: 'עדיפות נמוכה', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.3)'  },
};

const WA_PHONE = '972506770772';
const WA_MSG = encodeURIComponent('היי צוות VPP Solar Club ☀️, אני מעוניין להפוך את המערכת הסולארית שלי לחכמה ורווחית יותר. אשמח לשמוע פרטים נוספים על הצטרפות למועדון!');

function RecommendationCard({ rec, index }) {
  const [applied, setApplied] = useState(false);
  const cfg = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.medium;

  const handleApply = () => {
    setApplied(true);
    toast.success(`✅ "${rec.title_he}" — הומלצה ליישום`);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `היי צוות VPP Solar Club ☀️, קיבלתי המלצה מהמערכת:\n"${rec.title_he}"\n${rec.desc_he}\n\nאשמח לעזרה ביישום!`
    );
    window.open(`https://wa.me/${WA_PHONE}?text=${msg}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl p-4 space-y-3"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: cfg.border, color: cfg.color }}>
              {cfg.label}
            </span>
            {rec.estimated_gain_ils > 0 && (
              <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +₪{Math.round(rec.estimated_gain_ils).toLocaleString()}/שנה
              </span>
            )}
          </div>
          <p className="text-sm font-black text-white">{rec.title_he}</p>
        </div>
        {applied && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed">{rec.desc_he}</p>

      {/* Timeline */}
      {rec.timeline_he && (
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-white/30" />
          <span className="text-[10px] text-white/40">{rec.timeline_he}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={applied}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: applied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.25)',
            border: `1px solid ${applied ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.5)'}`,
            color: applied ? '#34d399' : '#c4b5fd',
          }}
        >
          {applied ? <><CheckCircle2 className="w-3.5 h-3.5" /> יושם ✓</> : <><Zap className="w-3.5 h-3.5" /> יישם המלצה</>}
        </button>
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
          style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.35)', color: '#25D366' }}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          וואטסאפ
        </button>
      </div>
    </motion.div>
  );
}

export default function RecommendationsPanel({ recommendations, fileName }) {
  const [open, setOpen] = useState(true);

  if (!recommendations || recommendations.length === 0) return null;

  const totalGain = recommendations.reduce((s, r) => s + (r.estimated_gain_ils || 0), 0);

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.25)' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-violet-400" />}
          <span className="text-xs font-black text-violet-400">
            🤖 {recommendations.length} המלצות AI
            {fileName && <span className="text-violet-400/50 font-normal"> · {fileName}</span>}
          </span>
        </div>
        {totalGain > 0 && (
          <span className="text-xs font-black text-emerald-400">
            פוטנציאל: +₪{Math.round(totalGain).toLocaleString()}/שנה
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} rec={rec} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}