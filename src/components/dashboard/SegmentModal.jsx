import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

export default function SegmentModal({ segmentKey, onClose }) {
  const { t } = useLang();
  const [committeeContact, setCommitteeContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const SEGMENTS = {
    renters: {
      emoji: '🏠',
      titleKey: 'solar_club_segment_renters',
      bodyKey: 'solar_club_seg_renters_body',
      body: t('lang') === 'en'
        ? 'Virtual PPA model – provider switch without hardware. Immediate 10% savings on your bill.'
        : 'מודל PPA וירטואלי - מעבר ספק ללא חומרה. חיסכון מיידי של 10% בחשבון.',
      tagKey: 'solar_club_seg_desc_renters',
      cta: t('solar_club_join_cta'),
      ctaAction: 'join',
    },
    apartment: {
      emoji: '🏢',
      titleKey: 'solar_club_segment_apartment',
      body: t('lang') === 'en'
        ? 'Shared meter management and group energy accumulation. All residents benefit together.'
        : 'ניהול מונה משותף וצבירת אנרגיה קבוצתית. כל הדיירים נהנים יחד.',
      tagKey: 'solar_club_seg_desc_apartment',
      cta: null,
      ctaAction: 'committee',
    },
    families: {
      emoji: '👨‍👩‍👧',
      titleKey: 'solar_club_segment_families',
      body: t('lang') === 'en'
        ? 'Home battery optimization and peak-hour selling. Maximize your daily profit.'
        : 'אופטימיזציה לסוללות ביתיות ומכירה בשעות שיא. מקסם את הרווח היומי שלך.',
      tagKey: 'solar_club_seg_desc_families',
      cta: t('solar_club_join_cta'),
      ctaAction: 'join',
    },
    cities: {
      emoji: '🌆',
      titleKey: 'solar_club_segment_cities',
      body: t('lang') === 'en'
        ? 'Connect to the national energy grid with smart load management. Join the national VPP network.'
        : 'חיבור לרשת האנרגיה הלאומית וניהול עומסים חכם. השתתף ברשת ה-VPP הארצית.',
      tagKey: 'solar_club_seg_desc_cities',
      cta: t('solar_club_join_cta'),
      ctaAction: 'join',
    },
  };

  const seg = SEGMENTS[segmentKey];
  if (!seg) return null;

  const handleJoin = () => {
    toast.success(t('seg_join_success', { name: t(seg.titleKey) }));
    onClose();
  };

  const handleCommittee = () => {
    if (!committeeContact) { toast.error(t('seg_committee_error')); return; }
    setSubmitted(true);
    toast.success(t('seg_committee_sent'));
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
            <div className="flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{seg.emoji}</span>
                <div>
                  <p className="text-base font-black text-white">{t(seg.titleKey)}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD' }}
                  >
                    {t(seg.tagKey)}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
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
                  <span className="text-sm font-bold text-emerald-400">{t('seg_committee_success')}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('seg_committee_label')}</p>
                  <input
                    type="text"
                    placeholder={t('seg_committee_placeholder')}
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
                    {t('seg_committee_send')}
                  </button>
                </div>
              )
            ) : (
              <button
                onClick={handleJoin}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 18px rgba(59,130,246,0.35)' }}
              >
                {seg.cta}
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}