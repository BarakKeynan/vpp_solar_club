import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

export default function ApiKeyGuideModal({ open, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28 }}
          className="w-full max-w-md rounded-3xl p-6 space-y-5"
          style={{ background: 'rgba(13,21,37,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
          onClick={e => e.stopPropagation()}
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black text-white leading-tight">חיבור המערכת לענן</h2>
              <p className="text-sm text-white/40 mt-0.5">3 צעדים פשוטים — לוקח בדיוק דקה ✓</p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>

          {/* Explanation */}
          <p className="text-sm text-white/60 leading-relaxed">
            כדי שנוכל <strong className="text-white">לחסוך לך כסף באופן אוטומטי</strong>, עלינו לקבל "מפתח גישה" מאתר SolarEdge.
          </p>

          {/* Steps */}
          <div className="space-y-4">
            {[
              {
                num: '1',
                title: 'נכנסים לאתר',
                desc: 'לחצו על הכפתור למטה ״פתח את אתר SolarEdge״ והתחברו עם המייל והסיסמה שלכם.',
              },
              {
                num: '2',
                title: 'מוצאים את הקוד',
                desc: 'בתפריט למעלה לחצו על ניהול (Admin) ← ואז פרטי עסק (Company Details) ← ולשונית גישת API (API Access).',
              },
              {
                num: '3',
                title: 'מעתיקים ומדביקים',
                desc: 'העתיקו את הקוד שמופיע תחת "API Key", חזרו לכאן והדביקו אותו בתיבה.',
              },
            ].map(s => (
              <div key={s.num} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-lg font-black"
                  style={{ background: 'rgba(34,211,238,0.12)', border: '1px solid rgba(34,211,238,0.3)', color: 'rgba(34,211,238,0.9)' }}>
                  {s.num}
                </div>
                <div>
                  <p className="text-base font-bold text-white">{s.title}</p>
                  <p className="text-sm text-white/50 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://monitoring.solaredge.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.22), rgba(52,211,153,0.18))',
              border: '1px solid rgba(34,211,238,0.45)',
              boxShadow: '0 0 30px rgba(34,211,238,0.15)',
            }}
          >
            <ExternalLink className="w-5 h-5" />
            פתח את אתר SolarEdge
          </a>

          <button onClick={onClose}
            className="w-full text-sm text-white/30 py-2 active:opacity-50">
            סגור
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}