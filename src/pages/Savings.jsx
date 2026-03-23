import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Home, Car } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid,
} from 'recharts';

const periodData = {
  day: [
    { month: '08:00', vpp: 12, club: 3 },
    { month: '10:00', vpp: 28, club: 6 },
    { month: '12:00', vpp: 45, club: 9 },
    { month: '14:00', vpp: 38, club: 8 },
    { month: '16:00', vpp: 32, club: 7 },
    { month: '18:00', vpp: 22, club: 5 },
  ],
  week: [
    { month: 'א׳', vpp: 42, club: 9 },
    { month: 'ב׳', vpp: 38, club: 8 },
    { month: 'ג׳', vpp: 55, club: 12 },
    { month: 'ד׳', vpp: 61, club: 14 },
    { month: 'ה׳', vpp: 47, club: 10 },
    { month: 'ו׳', vpp: 70, club: 16 },
  ],
  month: [
  { month: 'אוק', vpp: 180, club: 38 },
  { month: 'נוב', vpp: 210, club: 42 },
  { month: 'דצ', vpp: 165, club: 35 },
  { month: 'ינו', vpp: 240, club: 55 },
  { month: 'פבר', vpp: 280, club: 61 },
  { month: 'מרץ', vpp: 310, club: 74 },
];

const devices = [
  { icon: Home, label: 'מזגן', saving: 42, action: 'הוזז לשעות זול' },
  { icon: Car, label: 'רכב חשמלי', saving: 85, action: 'טעינה בלילה' },
  { icon: Zap, label: 'מדיח כלים', saving: 18, action: 'הוזז לבוקר' },
];

export default function Savings() {
  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        חיסכון ואנרגיה
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'חיסכון היום', value: '+187 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
          { label: 'חיסכון החודש', value: '+4,230 ₪', color: 'text-secondary', bg: 'border-secondary/30 bg-secondary/10' },
          { label: 'ייצור החודש', value: '310 kWh', color: 'text-accent', bg: 'border-accent/30 bg-accent/10' },
          { label: 'Solar Club', value: '+74 ₪', color: 'text-primary', bg: 'border-primary/30 bg-primary/10' },
        ].map(card => (
          <div key={card.label} className={`rounded-2xl border p-4 ${card.bg}`}>
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-black mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Area Chart */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">חיסכון חודשי (₪) – VPP Home vs Solar Club</p>
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={monthlyData}>
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
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
              formatter={(v, n) => [`${v} ₪`, n === 'vpp' ? 'VPP Home' : 'Solar Club']}
            />
            <Area type="monotone" dataKey="vpp" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#g1)" />
            <Area type="monotone" dataKey="club" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#g2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Smart Devices */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">מכשירים חכמים</p>
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