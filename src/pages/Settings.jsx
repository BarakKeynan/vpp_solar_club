import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plug, Shield, LogOut } from 'lucide-react';
import PaymentManagement from '@/components/billing/PaymentManagement';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

export default function Settings() {
  const { t } = useLang();
  const [toggles, setToggles] = useState({
    alerts_price: true, alerts_battery: true, alerts_export: false,
    biometric: true, '2fa': false,
  });

  const toggle = (key) => {
    setToggles(p => ({ ...p, [key]: !p[key] }));
    toast.success(t('setting_updated'));
  };

  const sections = [
    {
      titleKey: 'section_alerts',
      icon: Bell,
      items: [
        { key: 'alerts_price', label: t('alert_price'), defaultOn: true },
        { key: 'alerts_battery', label: t('alert_battery'), defaultOn: true },
        { key: 'alerts_export', label: t('alert_export'), defaultOn: false },
      ],
    },
    {
      titleKey: 'section_devices',
      icon: Plug,
      items: [
        { key: 'inverter', label: t('device_inverter'), status: t('status_connected'), statusColor: 'text-primary' },
        { key: 'ev', label: t('device_ev'), status: t('status_connected'), statusColor: 'text-primary' },
        { key: 'meter', label: t('device_meter'), status: t('status_pending'), statusColor: 'text-accent' },
      ],
    },
    {
      titleKey: 'section_security',
      icon: Shield,
      items: [
        { key: 'biometric', label: t('security_biometric'), defaultOn: true },
        { key: '2fa', label: t('security_2fa'), defaultOn: false },
      ],
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {t('settings_title')}
      </motion.h1>

      {sections.map((section, si) => (
        <motion.div key={section.titleKey}
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: si * 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 p-4 pb-2">
            <section.icon className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-muted-foreground">{t(section.titleKey)}</p>
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

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
        <PaymentManagement />
      </motion.div>

      <button
        onClick={() => base44.auth.logout('/')}
        className="w-full py-3 rounded-2xl border border-destructive/40 text-destructive font-semibold text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        {t('logout')}
      </button>
    </div>
  );
}