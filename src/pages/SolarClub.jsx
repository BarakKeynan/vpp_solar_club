import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SegmentModal from '@/components/dashboard/SegmentModal';
import { useLang } from '@/lib/i18n';

const savingsDataHe = [
  { month: 'אוק', savings: 38 }, { month: 'נוב', savings: 42 },
  { month: 'דצ', savings: 35 }, { month: 'ינו', savings: 55 },
  { month: 'פבר', savings: 61 }, { month: 'מרץ', savings: 74 },
];
const savingsDataEn = [
  { month: 'Oct', savings: 38 }, { month: 'Nov', savings: 42 },
  { month: 'Dec', savings: 35 }, { month: 'Jan', savings: 55 },
  { month: 'Feb', savings: 61 }, { month: 'Mar', savings: 74 },
];

function JoinForm() {
  const { t } = useLang();
  const [activeSegment, setActiveSegment] = useState(null);

  const segments = [
    { key: 'renters', emoji: '🏠', label: t('solar_club_segment_renters'), desc: t('solar_club_seg_desc_renters') },
    { key: 'apartment', emoji: '🏢', label: t('solar_club_segment_apartment'), desc: t('solar_club_seg_desc_apartment') },
    { key: 'families', emoji: '👨‍👩‍👧', label: t('solar_club_segment_families'), desc: t('solar_club_seg_desc_families') },
    { key: 'cities', emoji: '🌆', label: t('solar_club_segment_cities'), desc: t('solar_club_seg_desc_cities') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary/30 to-primary/20 rounded-2xl border border-secondary/30 p-5 text-center space-y-2">
        <div className="text-4xl">☀️</div>
        <h2 className="text-xl font-black text-foreground">{t('solar_club_title')}</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('solar_club_subtitle').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
        </p>
      </div>

      {/* Pricing strip */}
      <div className="flex gap-2">
        <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-primary font-black text-lg">29–49 ₪</p>
          <p className="text-[10px] text-muted-foreground">{t('solar_club_monthly_fee')}</p>
        </div>
        <div className="flex-1 bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-accent font-black text-lg">15%</p>
          <p className="text-[10px] text-muted-foreground">{t('solar_club_commission')}</p>
        </div>
      </div>

      {/* Segments — tap to open specific registration */}
      <p className="text-xs font-bold text-muted-foreground px-1">{t('solar_club_membership')}</p>
      <div className="grid grid-cols-2 gap-2">
        {segments.map(s => (
          <motion.button key={s.key} whileTap={{ scale: 0.96 }}
            onClick={() => setActiveSegment(s.key)}
            className="bg-card border border-border rounded-xl p-3 text-right hover:border-primary/50 transition-colors active:scale-95 flex items-center gap-3">
            <div className="text-2xl">{s.emoji}</div>
            <div className="flex-1">
              <p className="text-xs font-bold text-foreground">{s.label}</p>
              <p className="text-[10px] text-primary mt-0.5">{t('solar_club_join_cta')} ←</p>
            </div>
          </motion.button>
        ))}
      </div>

      <SegmentModal segmentKey={activeSegment} onClose={() => setActiveSegment(null)} />
    </motion.div>
  );
}

function MemberDashboard() {
  const { t, lang } = useLang();
  const savingsData = lang === 'en' ? savingsDataEn : savingsDataHe;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">{t('solar_club_my_club')}</h2>
          <p className="text-xs text-muted-foreground">{t('solar_club_active_shares')}</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-bold text-primary">{t('solar_club_active_member')}</span>
        </div>
      </div>

      <div className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t('solar_club_saved_month')}</p>
            <p className="text-4xl font-black text-primary">74 ₪</p>
          </div>
          <div className="text-left space-y-1">
            <div>
              <p className="text-[10px] text-muted-foreground">{t('solar_club_total_year')}</p>
              <p className="text-lg font-bold text-foreground">388 ₪</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{t('solar_club_farm_percent')}</p>
              <p className="text-sm font-bold text-secondary">0.8%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3">{t('solar_club_monthly_savings_chart')}</p>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={savingsData}>
            <defs>
              <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
              formatter={(v) => [`${v} ₪`, t('solar_club_monthly_savings_chart')]}
            />
            <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#savingsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">{t('solar_club_farm_status')}</p>
        {[
          { label: t('solar_club_farm_name'), value: `${lang === 'en' ? 'Negev Solar 3' : 'נגב סולאר 3'} · ${t('solar_club_farm_active')}`, color: 'text-primary' },
          { label: t('solar_club_farm_production'), value: '2,840 kWh', color: 'text-accent' },
          { label: t('solar_club_farm_members'), value: '247', color: 'text-secondary' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{item.label}</span>
            <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function SolarClub() {
  const [isMember, setIsMember] = useState(false);

  return (
    <div className="p-4 pb-28 space-y-4">
      <AnimatePresence mode="wait">
        {!isMember ? (
          <motion.div key="join" exit={{ opacity: 0, y: -20 }}>
            <JoinForm />
          </motion.div>
        ) : (
          <motion.div key="member" exit={{ opacity: 0, y: -20 }}>
            <MemberDashboard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}