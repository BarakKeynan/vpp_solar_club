import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sun, TrendingUp, Star, CheckCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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
  const [form, setForm] = useState({ name: '', address: '', apartment: '', shares: '1' });

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

      {/* Benefits */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: '💰', label: 'חיסכון', desc: 'עד 80 ₪/חודש' },
          { icon: '🌱', label: 'ירוק', desc: '100% מתחדש' },
          { icon: '🏙️', label: 'לדיירים', desc: 'ללא גג נדרש' },
        ].map(b => (
          <div key={b.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{b.icon}</div>
            <p className="text-xs font-bold text-foreground">{b.label}</p>
            <p className="text-[10px] text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>

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
          <p className="text-xs text-muted-foreground mb-2">כמות מניות ({form.shares} מניות × 29 ₪)</p>
          <div className="flex gap-2">
            {['1', '2', '3', '4'].map(n => (
              <button
                key={n} type="button"
                onClick={() => setForm({ ...form, shares: n })}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${form.shares === n ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {n}
              </button>
            ))}
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