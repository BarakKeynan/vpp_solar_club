import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plug, Shield, ChevronRight, LogOut } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const sections = [
  {
    title: 'התראות',
    icon: Bell,
    items: [
      { key: 'alerts_price', label: 'התראות מחיר חשמל', defaultOn: true },
      { key: 'alerts_battery', label: 'התראות סוללה נמוכה', defaultOn: true },
      { key: 'alerts_export', label: 'אישור מכירה לרשת', defaultOn: false },
    ],
  },
  {
    title: 'מכשירים מחוברים',
    icon: Plug,
    items: [
      { key: 'inverter', label: 'אינוורטר SolarEdge', status: 'מחובר', statusColor: 'text-primary' },
      { key: 'ev', label: 'רכב חשמלי Tesla', status: 'מחובר', statusColor: 'text-primary' },
      { key: 'meter', label: 'מונה חכם', status: 'ממתין', statusColor: 'text-accent' },
    ],
  },
  {
    title: 'אבטחה',
    icon: Shield,
    items: [
      { key: 'biometric', label: 'כניסה ביומטרית', defaultOn: true },
      { key: '2fa', label: 'אימות דו-שלבי', defaultOn: false },
    ],
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState({
    alerts_price: true, alerts_battery: true, alerts_export: false,
    biometric: true, '2fa': false,
  });

  const toggle = (key) => {
    setToggles(p => ({ ...p, [key]: !p[key] }));
    toast.success('הגדרה עודכנה');
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        הגדרות
      </motion.h1>

      {sections.map((section, si) => (
        <motion.div key={section.title}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: si * 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 p-4 pb-2">
            <section.icon className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-muted-foreground">{section.title}</p>
          </div>
          {section.items.map((item, ii) => (
            <div key={item.key} className={`flex items-center justify-between px-4 py-3 ${ii < section.items.length - 1 ? 'border-b border-border' : ''}`}>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              {item.status ? (
                <span className={`text-xs font-bold ${item.statusColor}`}>{item.status}</span>
              ) : (
                <Switch checked={toggles[item.key] ?? item.defaultOn} onCheckedChange={() => toggle(item.key)} />
              )}
            </div>
          ))}
        </motion.div>
      ))}

      <button
        onClick={() => base44.auth.logout('/')}
        className="w-full py-3 rounded-2xl border border-destructive/40 text-destructive font-semibold text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        התנתק
      </button>
    </div>
  );
}