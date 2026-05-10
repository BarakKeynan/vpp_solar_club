import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/i18n';

export default function WelcomeBanner({ userName }) {
  const navigate = useNavigate();
  const { lang } = useLang();
  const isHe = lang === 'he';

  const hour = new Date().getHours();
  const greeting = isHe
    ? (hour < 12 ? 'בוקר טוב' : hour < 17 ? 'צהריים טובים' : 'ערב טוב')
    : (hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

  const firstName = userName?.split(' ')[0] || (isHe ? 'משתמש' : 'User');

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 100%)',
        border: '1px solid rgba(16,185,129,0.2)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-white/40 font-medium">{greeting},</p>
          </div>
          <h2 className="text-lg font-black text-white leading-tight">{firstName} ☀️</h2>
          <p className="text-[11px] text-white/50 leading-relaxed mt-1.5">
            {isHe
              ? 'מערכת ה-VPP שלך מייצרת אנרגיה ומרוויחה עבורך. הסוללה מנוהלת אוטומטית לפי תעריפי הרשת.'
              : 'Your VPP system is generating energy and earning for you. The battery is managed automatically based on grid tariffs.'}
          </p>
        </div>
        <div className="flex-shrink-0 p-2.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <div className="text-center">
            <p className="text-lg font-black text-emerald-400">☀️</p>
          </div>
        </div>
      </div>

      {/* Guide link */}
      <button
        onClick={() => navigate('/user-guide')}
        className="mt-3 w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all active:scale-95"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[11px] text-white/50 font-medium">
            {isHe ? 'הוראות שימוש ומדריך למשתמש' : 'User Guide & Instructions'}
          </span>
        </div>
        <ChevronLeft className="w-3.5 h-3.5 text-white/30" />
      </button>
    </motion.div>
  );
}