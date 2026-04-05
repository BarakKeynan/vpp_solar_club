import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const SEGMENTS = {
  renters: {
    emoji: '🏠',
    title: 'שוכרי דירה',
    body: 'מודל PPA וירטואלי - מעבר ספק ללא חומרה. חיסכון מיידי של 10% בחשבון.',
    tag: 'חיסכון מיידי',
    cta: 'הצטרף עכשיו',
    ctaAction: 'join',
  },
  apartment: {
    emoji: '🏢',
    title: 'דיירי בניין',
    body: 'ניהול מונה משותף וצבירת אנרגיה קבוצתית. כל הדיירים נהנים יחד.',
    tag: 'ניהול קבוצתי',
    cta: null,
    ctaAction: 'committee',
  },
  families: {
    emoji: '👨‍👩‍👧',
    title: 'משפחות',
    body: 'אופטימיזציה לסוללות ביתיות ומכירה בשעות שיא. מקסם את הרווח היומי שלך.',
    tag: 'אופטימיזציה ביתית',
    cta: 'הצטרף עכשיו',
    ctaAction: 'join',
  },
  cities: {
    emoji: '🌆',
    title: 'תושבי ערים',
    body: 'חיבור לרשת האנרגיה הלאומית וניהול עומסים חכם. השתתף ברשת ה-VPP הארצית.',
    tag: 'רשת לאומית',
    cta: 'הצטרף עכשיו',
    ctaAction: 'join',
  },
};

export default function SegmentModal({ segmentKey, onClose }) {
  const [committeeContact, setCommitteeContact] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const seg = SEGMENTS[segmentKey];
  if (!seg) return null;

  const handleJoin = () => {
    toast.success(`ברוך הבא! הצטרפת לקבוצת ${seg.title} בהצלחה 🎉`);
    onClose();
  };

  const handleCommittee = () => {
    if (!committeeContact) { toast.error('נא להזין פרטי ועד הבית'); return; }
    setSubmitted(true);
    toast.success('הפנייה נשלחה לנציג ועד הבית!');
  };

  return (
    <AnimatePresence>
      {segmentKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-3xl p-6 space-y-5"
            style={{ background: '#0D1420', border: '1px solid rgba(59,130,246,0.2)', borderBottom: 'none' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{seg.emoji}</span>
                <div>
                  <p className="text-base font-black text-white">{seg.title}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD' }}
                  >
                    {seg.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
              {seg.body}
            </p>

            {seg.ctaAction === 'committee' ? (
              submitted ? (
                <div
                  className="flex items-center gap-3 rounded-2xl px-4 py-3"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">הפנייה נשלחה לוועד הבית!</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>פרטי ועד הבית לקשר</p>
                  <input
                    type="text"
                    placeholder="שם / טלפון / מייל של נציג ועד"
                    value={committeeContact}
                    onChange={e => setCommitteeContact(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <button
                    onClick={handleCommittee}
                    className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 18px rgba(59,130,246,0.35)' }}
                  >
                    שלח פנייה לוועד ←
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={handleJoin}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 18px rgba(59,130,246,0.35)' }}
              >
                {seg.cta} ←
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}