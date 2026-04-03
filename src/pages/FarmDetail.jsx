import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, TrendingUp, Bell, BellOff, Sun, Zap, Calendar, DollarSign, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { toast } from 'sonner';

const farm = {
  name: 'גלבוע פאוור',
  location: 'עמק יזרעאל',
  capacity: '3.2 MW',
  icon: '🌄',
  units: 3,
  unitPrice: 142,
  yield: 10.4,
  monthlyIncome: 148,
  totalInvested: 426,
  startDate: 'ינואר 2024',
  status: 'פעילה',
};

const roiHistory = [
  { month: 'ינו', income: 118, smp: 0.42 },
  { month: 'פבר', income: 125, smp: 0.45 },
  { month: 'מרץ', income: 138, smp: 0.48 },
  { month: 'אפר', income: 142, smp: 0.51 },
  { month: 'מאי', income: 155, smp: 0.54 },
  { month: 'יוני', income: 163, smp: 0.57 },
  { month: 'יולי', income: 171, smp: 0.59 },
  { month: 'אוג', income: 148, smp: 0.53 },
];

const paybackMonths = Math.ceil(farm.totalInvested / farm.monthlyIncome);
const totalEarned = roiHistory.reduce((s, r) => s + r.income, 0);
const roiPct = ((totalEarned / farm.totalInvested) * 100).toFixed(1);

export default function FarmDetail() {
  const navigate = useNavigate();
  const [alertActive, setAlertActive] = useState(false);
  const [alertPrice, setAlertPrice] = useState(0.60);
  const [showAlertForm, setShowAlertForm] = useState(false);

  const handleSetAlert = () => {
    setAlertActive(true);
    setShowAlertForm(false);
    toast.success(`התראת מחיר הוגדרה: SMP > ₪${alertPrice}/kWh`);
  };

  const handleRemoveAlert = () => {
    setAlertActive(false);
    toast('התראת המחיר הוסרה');
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-black text-foreground">פירוט החווה שלי</h1>
          <p className="text-xs text-muted-foreground">{farm.name} · {farm.location}</p>
        </div>
        <div className="mr-auto text-3xl">{farm.icon}</div>
      </motion.div>

      {/* Farm Summary */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">הכנסה חודשית</p>
            <p className="text-4xl font-black text-primary">{farm.monthlyIncome} ₪</p>
          </div>
          <div className="text-left space-y-1">
            <div className="flex items-center gap-1.5 bg-primary/20 px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary">{farm.status}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">מאז {farm.startDate}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary/20">
          {[
            { label: 'יחידות', value: farm.units },
            { label: 'תשואה שנתית', value: `${farm.yield}%` },
            { label: 'קיבולת', value: farm.capacity },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-black text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ROI Calculator */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <p className="text-sm font-bold text-foreground">חישוב החזר השקעה</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'סה"כ השקעה', value: `₪${farm.totalInvested}`, color: 'text-foreground' },
            { label: 'סה"כ הכנסה', value: `₪${totalEarned}`, color: 'text-primary' },
            { label: 'ROI עד כה', value: `${roiPct}%`, color: 'text-primary' },
            { label: 'זמן החזר', value: `${paybackMonths} חודשים`, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="bg-muted rounded-xl p-3">
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className={`text-base font-black mt-0.5 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            בהנחת מחיר SMP ממוצע של ₪0.51/kWh ותשואה שנתית של {farm.yield}%, ההשקעה צפויה להחזיר את עצמה תוך <span className="font-bold text-primary">{paybackMonths} חודשים</span>.
          </p>
        </div>
      </motion.div>

      {/* Income Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-bold text-muted-foreground mb-3">הכנסה חודשית (₪)</p>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={roiHistory}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 11 }}
              formatter={(v) => [`₪${v}`, 'הכנסה']}
            />
            <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#incomeGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* SMP Price Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-muted-foreground">מחיר SMP חודשי (₪/kWh)</p>
          {alertActive && (
            <div className="flex items-center gap-1 bg-accent/20 px-2 py-0.5 rounded-full">
              <Bell className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-bold text-accent">התראה ב-₪{alertPrice}</span>
            </div>
          )}
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <AreaChart data={roiHistory}>
            <defs>
              <linearGradient id="smpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 11 }}
              formatter={(v) => [`₪${v}`, 'SMP']}
            />
            {alertActive && <ReferenceLine y={alertPrice} stroke="hsl(var(--accent))" strokeDasharray="4 2" label={{ value: `▲ ₪${alertPrice}`, fill: 'hsl(var(--accent))', fontSize: 10 }} />}
            <Area type="monotone" dataKey="smp" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#smpGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Price Alert */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            <p className="text-sm font-bold text-foreground">התראת מחיר SMP</p>
          </div>
          {alertActive ? (
            <button onClick={handleRemoveAlert} className="flex items-center gap-1 text-xs text-destructive font-bold">
              <BellOff className="w-3.5 h-3.5" /> הסר
            </button>
          ) : (
            <button onClick={() => setShowAlertForm(v => !v)} className="text-xs text-primary font-bold">
              {showAlertForm ? 'ביטול' : '+ הגדר'}
            </button>
          )}
        </div>

        {alertActive && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            <p className="text-xs text-foreground">תקבל התראה כשמחיר SMP יעלה מעל <span className="font-black text-accent">₪{alertPrice}/kWh</span></p>
          </div>
        )}

        <AnimatePresence>
          {showAlertForm && !alertActive && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3">
              <p className="text-xs text-muted-foreground">קבע מחיר סף SMP להתראה (₪/kWh)</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setAlertPrice(p => Math.max(0.30, +(p - 0.01).toFixed(2)))}
                  className="p-2 rounded-xl bg-muted border border-border text-foreground font-bold">−</button>
                <div className="flex-1 text-center bg-muted rounded-xl py-2">
                  <span className="text-xl font-black text-accent">₪{alertPrice}</span>
                </div>
                <button onClick={() => setAlertPrice(p => +(p + 0.01).toFixed(2))}
                  className="p-2 rounded-xl bg-muted border border-border text-foreground font-bold">+</button>
              </div>
              <button onClick={handleSetAlert}
                className="w-full py-3 bg-accent text-accent-foreground font-black rounded-2xl active:scale-95 transition-all text-sm">
                הגדר התראה ל-₪{alertPrice}/kWh
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add Units CTA */}
      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={() => navigate('/marketplace')}
        className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl active:scale-95 transition-all">
        הוסף יחידות ייצור לתיק ←
      </motion.button>
    </div>
  );
}