import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sun, TrendingUp, Star, CheckCircle, ChevronRight, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import SegmentModal from '@/components/dashboard/SegmentModal';

const savingsData = [
  { month: 'אוק', savings: 38 },
  { month: 'נוב', savings: 42 },
  { month: 'דצ', savings: 35 },
  { month: 'ינו', savings: 55 },
  { month: 'פבר', savings: 61 },
  { month: 'מרץ', savings: 74 },
];

function JoinForm({ onJoin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', address: '', apartment: '', shares: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.address) { toast.error('נא למלא שם וכתובת'); return; }
    onJoin();
    toast.success('ברוך הבא למועדון הסולארי! 🎉');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Hero */}
      <div className="bg-gradient-to-br from-secondary/30 to-primary/20 rounded-2xl border border-secondary/30 p-5 text-center space-y-2">
        <div className="text-4xl">☀️</div>
        <h2 className="text-xl font-black text-foreground">מועדון סולארי וירטואלי</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          קנה מניות בחווה סולארית משותפת<br />וקבל זיכוי חודשי בחשבון החשמל שלך
        </p>
      </div>

      {/* Onboarding Segments */}
      {(() => {
        const [activeSegment, setActiveSegment] = React.useState(null);
        const segments = [
          { key: 'renters', emoji: '🏠', label: 'שוכרי דירה', desc: 'PPA וירטואלי' },
          { key: 'apartment', emoji: '🏢', label: 'דיירי בניין', desc: 'מונה משותף' },
          { key: 'families', emoji: '👨‍👩‍👧', label: 'משפחות', desc: 'סוללה ביתית' },
          { key: 'cities', emoji: '🌆', label: 'תושבי ערים', desc: 'רשת לאומית' },
        ];
        return (
          <>
            <div className="grid grid-cols-2 gap-2">
              {segments.map(s => (
                <motion.button key={s.key} whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveSegment(s.key)}
                  className="bg-card border border-border rounded-xl p-3 text-center hover:border-primary/50 transition-colors active:scale-95">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <p className="text-xs font-bold text-foreground">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                </motion.button>
              ))}
            </div>
            <SegmentModal segmentKey={activeSegment} onClose={() => setActiveSegment(null)} />
          </>
        );
      })()}

      {/* Pricing */}
      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <p className="text-xs font-bold text-muted-foreground">תוכנית חברות</p>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-semibold">דמי חברות חודשיים</span>
          <span className="text-primary font-black text-lg">29–49 ₪</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-foreground font-semibold">עמלה על חיסכון</span>
          <span className="text-accent font-black text-lg">15%</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <p className="text-sm font-bold text-foreground">הצטרפות למועדון</p>
        <input
          type="text" placeholder="שם מלא"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="text" placeholder="כתובת (רחוב ועיר)"
          value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <input
          type="text" placeholder="מספר דירה"
          value={form.apartment} onChange={e => setForm({ ...form, apartment: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <div>
          <p className="text-xs text-muted-foreground mb-2">כמות מניות ({form.shares} מניות × 29 ₪ = <span className="text-primary font-bold">{form.shares * 29} ₪/חודש</span>)</p>
          <div className="flex items-center justify-between bg-muted rounded-2xl px-4 py-3">
            <button type="button" onClick={() => setForm({ ...form, shares: Math.max(1, form.shares - 1) })}
              className="p-1.5 rounded-xl bg-card border border-border">
              <Minus className="w-4 h-4 text-foreground" />
            </button>
            <span className="text-2xl font-black text-foreground">{form.shares}</span>
            <button type="button" onClick={() => setForm({ ...form, shares: form.shares + 1 })}
              className="p-1.5 rounded-xl bg-card border border-border">
              <Plus className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
        <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all">
          הצטרף עכשיו ←
        </button>
      </form>
    </motion.div>
  );
}

function MemberDashboard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-foreground">המועדון הסולארי שלי</h2>
          <p className="text-xs text-muted-foreground">2 מניות פעילות</p>
        </div>
        <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1.5 rounded-full">
          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          <span className="text-xs font-bold text-primary">חבר פעיל</span>
        </div>
      </div>

      {/* Main Savings Card */}
      <div className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">חסכת החודש</p>
            <p className="text-4xl font-black text-primary">74 ₪</p>
          </div>
          <div className="text-left space-y-1">
            <div>
              <p className="text-[10px] text-muted-foreground">סה"כ השנה</p>
              <p className="text-lg font-bold text-foreground">388 ₪</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">אחוז בחווה</p>
              <p className="text-sm font-bold text-secondary">0.8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Chart */}
      <div className="bg-card rounded-2xl border border-border p-4">
        <p className="text-xs text-muted-foreground font-medium mb-3">חיסכון חודשי (₪)</p>
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
              formatter={(v) => [`${v} ₪`, 'חיסכון']}
            />
            <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#savingsGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Farm Status */}
      <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">סטטוס חווה סולארית</p>
        {[
          { label: 'חווה: נגב סולאר 3', value: 'פעילה', color: 'text-primary' },
          { label: 'ייצור היום', value: '2,840 kWh', color: 'text-accent' },
          { label: 'חברי מועדון', value: '247 דיירים', color: 'text-secondary' },
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
            <JoinForm onJoin={() => setIsMember(true)} />
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