import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Sun, Gift, Users, Copy, Check, ChevronRight, Phone } from 'lucide-react';
import { toast } from 'sonner';
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { useLang } from '@/lib/i18n';

// --- Mock user state ---
const REFERRAL_CODE = 'VPP-YONI42';
const REFERRAL_COUNT = 2; // change to 0,1,2,3,4,5 to test tiers

const getTiers = (isHe) => [
  {
    level: 1,
    threshold: 1,
    icon: Gift,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    title: isHe ? 'Level 1 — חודש חינם' : 'Level 1 — Free Month',
    reward: isHe ? 'חודש ללא עמלות ניהול (0% Success Fee)' : 'One month with 0% Success Fee',
    tag: isHe ? '1 חבר' : '1 friend',
  },
  {
    level: 2,
    threshold: 3,
    icon: Sun,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    title: isHe ? 'Level 2 — ניקוי + 3 חודשים' : 'Level 2 — Cleaning + 3 Months',
    reward: isHe ? '3 חודשים ללא עמלות + ניקוי פאנלים מקצועי במתנה' : '3 fee-free months + free professional panel cleaning',
    tag: isHe ? '3 חברים' : '3 friends',
  },
  {
    level: 3,
    threshold: 5,
    icon: Crown,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10 border-yellow-400/30',
    title: 'Founder Circle 👑',
    reward: isHe ? 'פאנל וירטואלי קבוע בארנק הדיגיטלי + ייעוץ אסטרטגי + תמיכה VIP ישירה' : 'Permanent virtual panel in digital wallet + strategic consulting + direct VIP support',
    tag: isHe ? '5 חברים' : '5 friends',
  },
];

function getTierInfo(count, tiers) {
  if (count >= 5) return { current: 3, next: null, progress: 100 };
  if (count >= 3) return { current: 2, next: tiers[2], progress: ((count - 3) / 2) * 100 };
  if (count >= 1) return { current: 1, next: tiers[1], progress: ((count - 1) / 2) * 100 };
  return { current: 0, next: tiers[0], progress: 0 };
}

const comparisonDataHe = [
  { month: 'ינו', vpp: 1800, passive: 400 }, { month: 'פבר', vpp: 2100, passive: 400 },
  { month: 'מרץ', vpp: 2400, passive: 400 }, { month: 'אפר', vpp: 2700, passive: 400 },
  { month: 'מאי', vpp: 3100, passive: 400 }, { month: 'יונ', vpp: 3400, passive: 400 },
];
const comparisonDataEn = [
  { month: 'Jan', vpp: 1800, passive: 400 }, { month: 'Feb', vpp: 2100, passive: 400 },
  { month: 'Mar', vpp: 2400, passive: 400 }, { month: 'Apr', vpp: 2700, passive: 400 },
  { month: 'May', vpp: 3100, passive: 400 }, { month: 'Jun', vpp: 3400, passive: 400 },
];

const getEarningsSplit = (isHe) => [
  { label: isHe ? 'הכנסה מהמערכת הגגית' : 'Rooftop system income', value: '9,800 ₪', color: 'text-primary', bar: 'bg-primary', pct: 57 },
  { label: isHe ? 'פאנלים וירטואליים (מתנה)' : 'Virtual panels (gift)', value: '2,100 ₪', color: 'text-accent', bar: 'bg-accent', pct: 12 },
  { label: isHe ? 'חיסכון מחודשי עמלות חינם' : 'Savings from free fee months', value: '680 ₪', color: 'text-secondary', bar: 'bg-secondary', pct: 4 },
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

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Referral() {
  const [copied, setCopied] = useState(false);
  const [friendPhone, setFriendPhone] = useState('');
  const { lang } = useLang();
  const isHe = lang === 'he';
  const isVIP = REFERRAL_COUNT >= 5;
  const tiers = getTiers(isHe);
  const { current, next, progress } = getTierInfo(REFERRAL_COUNT, tiers);
  const earningsSplit = getEarningsSplit(isHe);
  const comparisonData = isHe ? comparisonDataHe : comparisonDataEn;

  const sendPersonalInvite = () => {
    const cleanPhone = friendPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      toast.error(isHe ? 'נא להזין מספר טלפון תקין' : 'Please enter a valid phone number');
      return;
    }
    const appLink = `${window.location.origin}/register?ref=${REFERRAL_CODE}`;
    const message = isHe
      ? `היי! הזמנתי אותך להצטרף ל-VPP Solar Club. ☀️\nהמערכת תעזור לך למקסם את הרווחים מהגג הסולארי שלך.\nעם הקוד שלי תקבל חודש ראשון ללא דמי הצלחה!\n\nקוד ההזמנה: ${REFERRAL_CODE}\nלהרשמה לאפליקציה: ${appLink}`
      : `Hey! I invited you to join VPP Solar Club. ☀️\nThe system will help you maximize your solar rooftop earnings.\nWith my code you get the first month with zero success fee!\n\nInvite code: ${REFERRAL_CODE}\nDownload & register: ${appLink}`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_CODE).catch(() => {});
    setCopied(true);
    toast.success(isHe ? 'קוד הפניה הועתק!' : 'Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-5 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-black text-foreground flex items-center gap-2">
          {isHe ? 'חבר מביא חבר' : 'Refer a Friend'}
          {isVIP && <Crown className="w-5 h-5 text-yellow-400" />}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">{isHe ? 'הפנה חברים וצבור הטבות בלעדיות' : 'Refer friends and earn exclusive rewards'}</p>
      </motion.div>

      {/* VIP Banner */}
      {isVIP && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl border border-yellow-400/40 bg-yellow-400/10 p-4 flex items-center gap-3">
          <Crown className="w-8 h-8 text-yellow-400 flex-shrink-0" />
          <div>
            <p className="text-base font-black text-yellow-400">Founder Circle VIP 👑</p>
            <p className="text-xs text-foreground/70 mt-0.5">{isHe ? 'הודעות WhatsApp שלך מועברות ישירות לייעוץ אנרגטי אישי — ללא תור בוט' : 'Your WhatsApp messages go directly to personal energy consulting — no bot queue'}</p>
          </div>
        </motion.div>
      )}

      {/* Referral Code */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">{isHe ? 'קוד ההפניה שלך' : 'Your Referral Code'}</p>
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

      {/* WhatsApp Personal Invite */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.25)' }}>
        <div className="flex items-center gap-2">
          <WhatsAppIcon />
          <p className="text-sm font-black text-white">{isHe ? 'שלח הזמנה אישית לחבר' : 'Send a Personal Invite'}</p>
        </div>
        <div className="relative">
          <Phone className="absolute top-3 right-3 w-4 h-4 text-white/30" />
          <input
            type="tel"
            value={friendPhone}
            onChange={e => setFriendPhone(e.target.value)}
            placeholder={isHe ? '05X-XXXXXXX' : '+972-5X-XXXXXXX'}
            className="w-full py-3 pr-9 pl-4 rounded-xl text-sm text-white outline-none placeholder:text-white/25"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(37,211,102,0.2)' }}
            dir="ltr"
          />
        </div>
        <button
          onClick={sendPersonalInvite}
          className="w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)', boxShadow: '0 0 20px rgba(37,211,102,0.3)' }}
        >
          <WhatsAppIcon />
          {isHe ? 'שלח הזמנה אישית לחבר' : 'Send Personal Invite via WhatsApp'}
        </button>
      </motion.div>

      {/* Milestone Tracker */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-muted-foreground">{isHe ? 'מסלול ההטבות שלך' : 'Your Rewards Track'}</p>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-black text-primary">{REFERRAL_COUNT} / 5 {isHe ? 'חברים' : 'friends'}</span>
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
            <span>0</span>
            <span className={REFERRAL_COUNT >= 1 ? 'text-primary font-bold' : ''}>{isHe ? '1 חבר' : '1 friend'}</span>
            <span className={REFERRAL_COUNT >= 3 ? 'text-accent font-bold' : ''}>{isHe ? '3 חברים' : '3 friends'}</span>
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
                  {unlocked ? (isHe ? '✓ פעיל' : '✓ Active') : tier.tag}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Earnings Split */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground mb-3">{isHe ? 'פירוט הכנסות' : 'Earnings Breakdown'}</p>
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
        <p className="text-xs font-bold text-muted-foreground mb-1">VPP vs. {isHe ? 'מסלול פסיבי סטטי' : 'Static Passive Plan'}</p>
        <p className="text-[10px] text-muted-foreground mb-3">{isHe ? 'הכנסה חודשית (₪)' : 'Monthly Income (₪)'}</p>
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
            <Area type="monotone" dataKey="passive" name={isHe ? 'מסלול פסיבי' : 'Passive Plan'} stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} fill="url(#passiveGrad)" strokeDasharray="4 4" />
            <Area type="monotone" dataKey="vpp" name="VPP Home" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#vppGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-2">
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-primary rounded" /><span className="text-[10px] text-muted-foreground">VPP Home</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-muted-foreground rounded border-dashed" /><span className="text-[10px] text-muted-foreground">{isHe ? 'פסיבי' : 'Passive'}</span></div>
        </div>
      </motion.div>
    </div>
  );
}