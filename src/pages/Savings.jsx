import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Home, Car } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '@/lib/i18n';

const periodData = {
  day: [
    { label: '08:00', vpp: 12, club: 3 },
    { label: '10:00', vpp: 28, club: 6 },
    { label: '12:00', vpp: 45, club: 9 },
    { label: '14:00', vpp: 38, club: 8 },
    { label: '16:00', vpp: 32, club: 7 },
    { label: '18:00', vpp: 22, club: 5 },
  ],
  week: [
    { label: 'א׳', vpp: 42, club: 9 },
    { label: 'ב׳', vpp: 38, club: 8 },
    { label: 'ג׳', vpp: 55, club: 12 },
    { label: 'ד׳', vpp: 61, club: 14 },
    { label: 'ה׳', vpp: 47, club: 10 },
    { label: 'ו׳', vpp: 70, club: 16 },
  ],
  month: [
    { label: 'אוק', vpp: 180, club: 38 },
    { label: 'נוב', vpp: 210, club: 42 },
    { label: 'דצ', vpp: 165, club: 35 },
    { label: 'ינו', vpp: 240, club: 55 },
    { label: 'פבר', vpp: 280, club: 61 },
    { label: 'מרץ', vpp: 310, club: 74 },
  ],
};

export default function Savings() {
  const { t } = useLang();
  const [period, setPeriod] = useState('month');

  const summaryByPeriod = {
    day: [
      { label: t('savings_today'), value: '+187 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('production_today'), value: '28 kWh', color: 'text-accent', bg: 'border-accent/30 bg-accent/10' },
      { label: 'Solar Club', value: '+9 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('savings_peak_hour'), value: '12:00', color: 'text-secondary', bg: 'border-secondary/30 bg-secondary/10' },
    ],
    week: [
      { label: t('savings_week_savings'), value: '+1,210 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('savings_week_production'), value: '74 kWh', color: 'text-accent', bg: 'border-accent/30 bg-accent/10' },
      { label: 'Solar Club', value: '+37 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('savings_peak_day'), value: "ה׳", color: 'text-secondary', bg: 'border-secondary/30 bg-secondary/10' },
    ],
    month: [
      { label: t('savings_this_month'), value: '+4,230 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('savings_month_production'), value: '310 kWh', color: 'text-accent', bg: 'border-accent/30 bg-accent/10' },
      { label: 'Solar Club', value: '+74 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
      { label: t('savings_annual'), value: '+18,400 ₪', color: 'text-secondary', bg: 'border-secondary/30 bg-secondary/10' },
    ],
  };

  const periodLabels = {
    day: t('period_day'),
    week: t('period_week'),
    month: t('period_month'),
  };

  const devices = [
    { icon: Home, label: t('device_ac'), saving: 42, action: t('device_ac_action') },
    { icon: Car, label: t('ev'), saving: 85, action: t('device_ev_action') },
    { icon: Zap, label: t('device_dishwasher'), saving: 18, action: t('device_dishwasher_action') },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {t('savings_title')}
      </motion.h1>

      {/* Period Toggle */}
      <div className="flex bg-muted rounded-2xl p-1 gap-1">
        {Object.entries(periodLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setPeriod(key)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              period === key ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <AnimatePresence mode="wait">
        <motion.div key={period} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 gap-3">
          {summaryByPeriod[period].map(card => (
            <div key={card.label} className={`rounded-2xl border p-4 ${card.bg}`}>
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className={`text-2xl font-black mt-1 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Area Chart */}
      <AnimatePresence mode="wait">
        <motion.div key={`chart-${period}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">
            {t('chart_label', { period: periodLabels[period] })}
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={periodData[period]}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                formatter={(v, n) => [`${v} ₪`, n === 'vpp' ? 'VPP Home' : 'Solar Club']}
              />
              <Area type="monotone" dataKey="vpp" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#g1)" />
              <Area type="monotone" dataKey="club" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#g2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatePresence>

      {/* Smart Devices */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('smart_devices')}</p>
        {devices.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-muted">
              <d.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{d.label}</p>
              <p className="text-xs text-muted-foreground">{d.action}</p>
            </div>
            <span className="text-sm font-black text-primary">+{d.saving} ₪</span>
          </div>
        ))}
      </div>
    </div>
  );
}