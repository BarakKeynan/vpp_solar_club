import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sun, Gift, Users, Copy, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Mock user state ---
const REFERRAL_CODE = 'VPP-YONI42';
const REFERRAL_COUNT = 2; // change to 0,1,2,3,4,5 to test tiers

const tiers = [
  {
    level: 1,
    threshold: 1,
    icon: Gift,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    title: 'Level 1 — חודש חינם',
    reward: 'חודש ללא עמלות ניהול (0% Success Fee)',
    tag: '1 חבר',
  },
  {
    level: 2,
    threshold: 3,
    icon: Sun,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    title: 'Level 2 — ניקוי + 3 חודשים',
    reward: '3 חודשים ללא עמלות + ניקוי פאנלים מקצועי במתנה',
    tag: '3 חברים',
  },
  {
    level: 3,
    threshold: 5,
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    title: 'Founder Circle 👑',
    reward: 'פאנל וירטואלי קבוע בארנק הדיגיטלי + ייעוץ אסטרטגי + תמיכה VIP ישירה',
    tag: '5 חברים',
  },
];

function getTierInfo(count) {
  if (count >= 5) return { current: 3, next: null, progress: 100 };
  if (count >= 3) return { current: 2, next: tiers[2], progress: ((count - 3) / 2) * 100 };
  if (count >= 1) return { current: 1, next: tiers[1], progress: ((count - 1) / 2) * 100 };
  return { current: 0, next: tiers[0], progress: 0 };
}

const comparisonData = [
  { month: 'ינו', vpp: 1800, passive: 400 },
  { month: 'פבר', vpp: 2100, passive: 400 },
  { month: 'מרץ', vpp: 2400, passive: 400 },
  { month: 'אפר', vpp: 2700, passive: 400 },
  { month: 'מאי', vpp: 3100, passive: 400 },
  { month: 'יונ', vpp: 3400, passive: 400 },
];

const earningsSplit = [
  { label: 'הכנסה מהמערכת הגגית', value: '9,800 ₪', color: 'text-primary', bar: 'bg-primary', pct: 57 },
  { label: 'פאנלים וירטואליים (מתנה)', value: '2,100 ₪', color: 'text-accent', bar: 'bg-accent', pct: 12 },
  { label: 'חיסכון מחודשי עמלות חינם', value: '680 ₪', color: 'text-secondary', bar: 'bg-secondary', pct: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()} ₪</p>
      ))}
    </div>
  );
};

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const { current, next, progress } = getTierInfo(REFERRAL_COUNT);
  const isVIP = REFERRAL_COUNT >= 5;

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).catch(() => {});
    setCopied(true);
    toast.success('קוד הפניה הועתק!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-black text-foreground flex items-center gap-2">
          חבר מביא חבר
          {isVIP && <Crown className="w-5 h-5 text-yellow-400" />}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">הפנה חברים וצבור הטבות בלעדיות</p>
      </motion.div>

      {/* VIP Banner */}
      {isVIP && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-base font-black text-yellow-400">Founder Circle VIP 👑</p>
            <p className="text-xs text-foreground/70 mt-0.5">הודעות WhatsApp שלך מועברות ישירות לייעוץ אנרגטי אישי — ללא תור בוט</p>
          </div>
        </motion.div>
      )}

      {/* Referral Code */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">קוד ההפניה שלך</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-muted rounded-xl px-4 py-3 font-mono text-lg font-black text-primary tracking-widest text-center">
            {REFERRAL_CODE}
          </div>
          <button onClick={handleCopy}
            className="p-3 bg-primary rounded-xl text-primary-foreground active:scale-95 transition-transform">
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Milestone Tracker */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-muted-foreground">מסלול ההטבות שלך</p>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-black text-primary">{REFERRAL_COUNT} / 5 חברים</span>
          </div>
        </div>

        {/* Steps */}
        <div className="relative mb-4">
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(REFERRAL_COUNT / 5) * 100}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full bg-primary"
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>0</span><span className={REFERRAL_COUNT >= 1 ? 'text-primary font-bold' : ''}>1 חבר</span>
            <span className={REFERRAL_COUNT >= 3 ? 'text-accent font-bold' : ''}>3 חברים</span>
            <span className={REFERRAL_COUNT >= 5 ? 'text-yellow-400 font-bold' : ''}>5 👑</span>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="space-y-2">
          {tiers.map(tier => {
            const unlocked = REFERRAL_COUNT >= tier.threshold;
            return (
              <div key={tier.level} className={`rounded-xl border p-3 flex items-center gap-3 transition-all ${unlocked ? tier.bg : 'border-border bg-muted/30 opacity-60'}`}>
                <tier.icon className={`w-5 h-5 ${unlocked ? tier.color : 'text-muted-foreground'} flex-shrink-0`} />
                <div className="flex-1">
                  <p className={`text-xs font-bold ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{tier.title}</p>
                  <p className="text-[10px] text-foreground/60 mt-0.5">{tier.reward}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${unlocked ? `${tier.bg} ${tier.color}` : 'bg-muted text-muted-foreground'}`}>
                  {unlocked ? '✓ פעיל' : tier.tag}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Earnings Split */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground mb-3">פירוט הכנסות</p>
        <div className="space-y-3">
          {earningsSplit.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{item.label}</span>
                <span className={`font-black ${item.color}`}>{item.value}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className={`h-full rounded-full ${item.bar}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Comparison Graph */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground mb-1">VPP vs. מסלול פסיבי סטטי</p>
        <p className="text-[10px] text-muted-foreground mb-3">הכנסה חודשית (₪)</p>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={comparisonData}>
            <defs>
              <linearGradient id="vppGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="passiveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="passive" name="מסלול פסיבי" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} fill="url(#passiveGrad)" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="vpp" name="VPP Home" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#vppGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-primary rounded" /><span className="text-[10px] text-muted-foreground">VPP Home</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-muted-foreground rounded border-dashed" /><span className="text-[10px] text-muted-foreground">פסיבי</span></div>
        </div>
      </motion.div>
    </div>
  );
}