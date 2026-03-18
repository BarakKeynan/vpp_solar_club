import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell, Wifi, Car, Shield, ChevronLeft, Cpu,
  Volume2, VolumeX, Eye, EyeOff, LogOut
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

const settingSections = [
  {
    title: 'התראות',
    items: [
      { key: 'priceAlerts', label: 'התראות מחיר חשמל', desc: 'קבל עדכון כשהמחיר משתנה', icon: Bell },
      { key: 'batteryAlerts', label: 'התראות סוללה', desc: 'כשהסוללה מלאה או נמוכה', icon: Volume2 },
    ],
  },
  {
    title: 'חיבור מכשירים',
    items: [
      { key: 'inverter', label: 'אינוורטר SolarEdge', desc: 'מחובר • SE10K', icon: Cpu, connected: true },
      { key: 'ev', label: 'רכב חשמלי', desc: 'Tesla Model 3 • מחובר', icon: Car, connected: true },
      { key: 'wifi', label: 'רשת Wi-Fi', desc: 'MyHome_5G • מחובר', icon: Wifi, connected: true },
    ],
  },
  {
    title: 'אבטחה',
    items: [
      { key: 'twoFactor', label: 'אימות דו-שלבי', desc: 'שכבת הגנה נוספת', icon: Shield },
      { key: 'biometric', label: 'כניסה ביומטרית', desc: 'טביעת אצבע או Face ID', icon: Eye },
    ],
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState({
    priceAlerts: true,
    batteryAlerts: true,
    twoFactor: false,
    biometric: true,
  });

  const handleToggle = (key) => {
    setToggles(prev => {
      const newVal = !prev[key];
      toast.success(newVal ? 'הופעל' : 'כובה');
      return { ...prev, [key]: newVal };
    });
  };

  return (
    <div className="px-4 pt-6 space-y-5 pb-4">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-bold">הגדרות</h1>
        <p className="text-sm text-muted-foreground mt-1">נהל את המערכת שלך</p>
      </motion.div>

      {settingSections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 + si * 0.1 }}
          className="space-y-2"
        >
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
            {section.title}
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${
                    item.connected ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.connected ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                {item.connected !== undefined ? (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs text-primary font-medium">מחובר</span>
                  </div>
                ) : (
                  <Switch
                    checked={toggles[item.key] || false}
                    onCheckedChange={() => handleToggle(item.key)}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Logout */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => base44.auth.logout()}
        className="w-full bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center justify-center gap-2 text-destructive font-semibold text-sm"
      >
        <LogOut className="w-4 h-4" />
        <span>התנתקות</span>
      </motion.button>
    </div>
  );
}