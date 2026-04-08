import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Battery, Zap, Car, AlertTriangle, ChevronLeft, Cloud } from 'lucide-react';
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

function VirtualBattery({ isHe }) {
  const [percent, setPercent] = useState(72);
  const [kWh, setKwh] = useState(18.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => Math.min(100, Math.max(0, prev + (Math.random() - 0.5) * 2)));
      setKwh(prev => Math.max(0, prev + (Math.random() - 0.5) * 0.5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border border-primary/30 p-4 space-y-4"
      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-black text-foreground">{isHe ? 'שלי VPP סוללה וירטואלית' : 'My VPP Virtual Battery'}</h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
          {isHe ? 'משדרת' : 'Streaming'}
        </span>
      </div>

      <div className="flex justify-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-3xl font-black text-primary">{Math.round(percent)}%</p>
            <p className="text-xs text-muted-foreground mt-1">{kWh.toFixed(1)} kWh</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-white/60 mb-0.5">{isHe ? 'ייצור היום' : 'Production'}</p>
          <p className="text-xs font-bold text-accent">18.4 kWh</p>
        </div>
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-white/60 mb-0.5">{isHe ? 'צריכה' : 'Usage'}</p>
          <p className="text-xs font-bold text-blue-400">9.8 kWh</p>
        </div>
        <div className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <p className="text-[9px] text-white/60 mb-0.5">{isHe ? 'חיסכון' : 'Saved'}</p>
          <p className="text-xs font-bold text-primary">+₪187</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="flex flex-col items-center gap-1.5 py-3 rounded-lg active:scale-95 transition-transform" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <Battery className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400">{isHe ? 'טען' : 'Charge'}</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 py-3 rounded-lg active:scale-95 transition-transform" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <Zap className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400">{isHe ? 'מכור' : 'Sell'}</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 py-3 rounded-lg active:scale-95 transition-transform" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <Car className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400">{isHe ? 'רכב' : 'EV'}</span>
        </button>
      </div>
    </motion.div>
  );
}

function MemberDashboard() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const isHe = lang === 'he';
  const savingsData = lang === 'en' ? savingsDataEn : savingsDataHe;
  const [showPanelBooking, setShowPanelBooking] = useState(false);
  const [showSynergy, setShowSynergy] = useState(false);

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

      <VirtualBattery isHe={isHe} />

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

      {/* Panel Maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowPanelBooking(true)}
        className="rounded-xl border border-accent/40 p-4 space-y-3 cursor-pointer active:scale-95 transition-transform"
        style={{ background: 'rgba(245,158,11,0.05)' }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="text-xs font-bold text-accent mb-1">{isHe ? 'תחזוקה' : 'MAINTENANCE'}</p>
              <p className="text-sm font-bold text-foreground">{isHe ? 'נצילות הפאנלים ירדה ל-85%' : 'Panel Efficiency Dropped to 85%'}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {isHe ? 'זיהינו לכלוך וקשיות מזג אוויר. הניקוי יחזיר ~8% ייצור.' : 'Detected dirt & weather issues. Cleaning restores ~8%.'}
              </p>
            </div>
          </div>
          <span className="text-lg">⚠️</span>
        </div>
        <button className="w-full px-3 py-2 rounded-lg text-xs font-bold text-accent border border-accent/40 hover:border-accent/60 transition-colors">
          {isHe ? 'הזמן ניקוי (₪280) ←' : 'Book Cleaning (₪280) →'}
        </button>
      </motion.div>

      {/* Community Synergy */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onClick={() => setShowSynergy(true)}
        className="rounded-xl border border-border p-4 space-y-3 cursor-pointer active:scale-95 transition-transform"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-foreground">{isHe ? 'Community Synergy' : 'Community Synergy'}</h3>
          <div className="text-right">
            <p className="text-2xl font-black text-accent">84%</p>
            <p className="text-[10px] text-muted-foreground">{isHe ? 'לפעילות' : 'Active'}</p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
          />
        </div>
        <p className="text-[10px] text-muted-foreground">
          {isHe ? 'עוד 16% להשגת תעריף הקבוצה של השכונה' : '16% more to unlock neighborhood rate'}
        </p>
      </motion.div>

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

      {/* My Solar Farm */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        onClick={() => navigate('/farm-detail')}
        className="w-full flex items-center justify-between bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">☀️</span>
          <div>
            <p className="text-sm font-bold text-white">{isHe ? 'החווה הסולארית שלי' : 'My Solar Farm'}</p>
            <p className="text-xs text-white/40">{isHe ? 'גלבוע פאוור · 3 יחידות · ROI 10.4%' : 'Gilboa Power · 3 units · ROI 10.4%'}</p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-white/40" />
      </motion.button>

      {/* Panel Booking Modal */}
      {showPanelBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end z-50"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full rounded-t-2xl p-6 space-y-4"
            style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">
                {isHe ? 'הזמנת ניקוי פאנלים' : 'Book Panel Cleaning'}
              </h2>
              <button
                onClick={() => setShowPanelBooking(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                type="date"
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                type="time"
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <textarea
                placeholder={isHe ? 'הערה אופציונלית...' : 'Optional note...'}
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                rows="3"
              />
            </div>

            <button
              onClick={() => { setShowPanelBooking(false); }}
              className="w-full px-4 py-3 rounded-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              {isHe ? 'אשר הזמנה' : 'Confirm Booking'}
            </button>
          </motion.div>
        </motion.div>
      )}
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