import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Users, Target } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function SyndicateDetailModal({ open, onClose }) {
  const { t } = useLang();

  const stats = [
    { icon: Zap, labelKey: 'syndicate_streamed', value: '12.5 MW', color: '#F59E0B' },
    { icon: Users, labelKey: 'syndicate_group_savings', value: '₪14,500', color: '#3B82F6' },
    { icon: Target, labelKey: 'syndicate_next_goal', value: t('syndicate_next_goal_val'), color: '#8B5CF6' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-3xl p-6 space-y-4"
            style={{ background: '#0D1420', border: '1px solid rgba(245,158,11,0.2)', borderBottom: 'none' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-black text-white">{t('syndicate_title')}</p>
                <p className="text-[11px]" style={{ color: 'rgba(253,211,77,0.7)' }}>{t('syndicate_active')}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            <div className="space-y-3">
              {stats.map(s => (
                <div
                  key={s.labelKey}
                  className="flex items-center gap-4 rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="p-2.5 rounded-xl shrink-0" style={{ background: `${s.color}18` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{t(s.labelKey)}</p>
                    <p className="text-sm font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
            >
              <p className="text-[11px]" style={{ color: 'rgba(253,211,77,0.6)' }}>
                {t('syndicate_reward_note')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}