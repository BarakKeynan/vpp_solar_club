import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plug, Wrench, Store, TrendingUp } from 'lucide-react';

const items = [
  {
    path: '/financial',
    icon: TrendingUp,
    emoji: '📈',
    title: 'ביצועים פיננסיים',
    subtitle: 'ROI היסטורי, תחזיות רווח ומחשבון חיסכון אישי',
    color: 'border-primary/30 bg-primary/5',
    accent: 'text-primary',
  },
  {
    path: '/providers',
    icon: Plug,
    emoji: '⚡',
    title: 'ניהול ספקים',
    subtitle: 'Electra · אמישראגז · IEC – השווה ועבור',
    color: 'border-primary/30 bg-primary/5',
    accent: 'text-primary',
  },
  {
    path: '/smart-care',
    icon: Wrench,
    emoji: '🔧',
    title: 'Smart Care',
    subtitle: 'ניטור פאנלים, מזג אוויר והזמנת תחזוקה',
    color: 'border-accent/30 bg-accent/5',
    accent: 'text-accent',
  },
  {
    path: '/marketplace',
    icon: Store,
    emoji: '☀️',
    title: 'Solar Farm Marketplace',
    subtitle: 'רכישת מניות בחוות סולאריות ברחבי ישראל',
    color: 'border-secondary/30 bg-secondary/5',
    accent: 'text-secondary',
  },
];

export default function More() {
  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        שירותים נוספים
      </motion.h1>

      {items.map((item, i) => (
        <motion.div key={item.path} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <Link to={item.path}
            className={`flex items-center gap-4 p-5 rounded-2xl border ${item.color} block active:scale-[0.98] transition-transform`}>
            <div className="text-4xl">{item.emoji}</div>
            <div className="flex-1">
              <p className={`text-base font-black ${item.accent}`}>{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
            </div>
            <div className="text-muted-foreground text-lg">›</div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}