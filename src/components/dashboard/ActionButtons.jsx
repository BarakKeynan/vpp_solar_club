import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Car } from 'lucide-react';
import { toast } from 'sonner';

const actions = [
  {
    label: 'טען סוללה עכשיו',
    icon: Battery,
    bg: 'bg-primary hover:bg-primary/90',
    text: 'text-primary-foreground',
    toastMsg: 'הסוללה מתחילה להיטען...',
  },
  {
    label: 'מכור לרשת',
    icon: Zap,
    bg: 'bg-secondary hover:bg-secondary/90',
    text: 'text-secondary-foreground',
    toastMsg: 'מתחיל למכור אנרגיה לרשת...',
  },
  {
    label: 'טען רכב',
    icon: Car,
    bg: 'bg-accent hover:bg-accent/90',
    text: 'text-accent-foreground',
    toastMsg: 'הרכב מתחיל להיטען...',
  },
];

export default function ActionButtons() {
  return (
    <div className="flex gap-3">
      {actions.map((action, i) => (
        <motion.button
          key={action.label}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toast.success(action.toastMsg)}
          className={`flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl font-bold text-sm transition-all duration-200 ${action.bg} ${action.text}`}
        >
          <action.icon className="w-6 h-6" />
          <span className="leading-tight text-center text-xs font-semibold">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}