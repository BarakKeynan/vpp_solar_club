import React from 'react';
import { useLang } from '@/lib/i18n';
import { motion } from 'framer-motion';

export default function LangToggle() {
  const { lang, setLang } = useLang();
  const isHe = lang === 'he';

  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={() => setLang(isHe ? 'en' : 'he')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.75)',
      }}
    >
      <span className="text-sm">{isHe ? '🇺🇸' : '🇮🇱'}</span>
      <span>{isHe ? 'EN' : 'HE'}</span>
    </motion.button>
  );
}