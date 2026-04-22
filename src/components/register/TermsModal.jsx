import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Zap, CreditCard, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  {
    icon: Shield,
    color: '#3b82f6',
    title: 'פרטיות נתונים',
    titleEn: 'Data Privacy',
    text: 'אנו אוספים נתוני צריכת חשמל, ייצור סולארי ונתוני מיקום בלבד לצורך מתן השירות. הנתונים מוצפנים AES-256 ואינם נמכרים לצד שלישי. בהתאם לחוק הגנת הפרטיות התשמ"א-1981 ותיקון 13 (2025), יש לך זכות לעיון, תיקון ומחיקת הנתונים שלך בכל עת.',
  },
  {
    icon: Zap,
    color: '#f59e0b',
    title: 'הרשאת ניהול אנרגיה',
    titleEn: 'Energy Management Authorization',
    text: 'בהצטרפותך ל-VPP Solar Club, אתה מאשר למערכת לבצע פעולות אוטומטיות של טעינה ופריקת סוללה, מכירת עודפי אנרגיה לרשת ואופטימיזציה של ניצול החשמל — הכל בכפוף לאישורך המפורש בכל עסקה. ניתן לבטל את ההרשאה בכל עת מתוך הגדרות החשבון.',
  },
  {
    icon: CreditCard,
    color: '#10b981',
    title: 'חיוב וארביטראז\'',
    titleEn: 'Billing & Arbitrage',
    text: 'רווחי ארביטראז\' מחושבים על פי תעריפי נוגה בזמן אמת. העמלה של VPP Solar Club היא 8% מהרווחים. חיוב מתבצע ב-1 לכל חודש. אין חיוב מינימלי. כל ניתוח OCR של חשבון חשמל כלול בחינם. ביטול בכל עת ללא קנס.',
  },
  {
    icon: AlertTriangle,
    color: '#ef4444',
    title: 'אחריות ומגבלות',
    titleEn: 'Liability',
    text: 'VPP Solar Club מספקת שירותי ייעוץ מבוססי AI. כל פעולה פיזית (טעינה, מכירה לרשת) מחייבת אישור סופי מהמשתמש. החברה אינה אחראית לנזקי חומרה שנגרמו בשל תקלות ברשת החשמל הארצית. ניתוחי ה-AI הינם המלצות בלבד ואינם מהווים ייעוץ פיננסי מוסמך.',
  },
];

export default function TermsModal({ open, onClose, onAgree }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: '#0D1525', border: '1px solid rgba(255,140,0,0.3)', maxHeight: '85vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/50" />
              </button>
              <div className="text-right">
                <p className="text-base font-black text-white">תנאי שימוש</p>
                <p className="text-[11px] text-white/40">VPP Solar Club · Terms of Use</p>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto px-5 py-4 space-y-4" style={{ maxHeight: '55vh' }}>
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="rounded-2xl p-4"
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}30` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                      <p className="text-sm font-black" style={{ color: s.color }}>{i + 1}. {s.title}</p>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed text-right">{s.text}</p>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 flex gap-3">
              <button onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white/40"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                סגור
              </button>
              <button onClick={() => { onAgree(); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white"
                style={{ background: 'linear-gradient(135deg,#FF8C00,#f59e0b)', boxShadow: '0 0 20px rgba(255,140,0,0.4)' }}>
                ✓ אני מסכים לתנאים
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}