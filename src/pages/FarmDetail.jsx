import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Bell, BellOff, DollarSign, Info, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { toast } from 'sonner';
import { getPortfolio } from '@/lib/portfolio';

// Static farm metadata map (mirrors Marketplace farms)
const farmsMeta = {
  negev1:  { name: 'נגב סולאר A',  icon: '☀️', location: 'באר שבע',      yield: 9.8,  sharePrice: 142.5, monthlyPerShare: 1.16 },
  galilee1:{ name: 'גליל אנרגיה',  icon: '🌊', location: 'כנרת',          yield: 8.4,  sharePrice: 98.3,  monthlyPerShare: 0.69 },
  arava1:  { name: 'ערבה פאוור',   icon: '🏜️', location: 'ערד',           yield: 11.2, sharePrice: 211.0, monthlyPerShare: 1.97 },
  carmel1: { name: 'כרמל גרין',    icon: '🌿', location: 'חיפה',           yield: 7.6,  sharePrice: 76.8,  monthlyPerShare: 0.49 },
};

const smpHistory = [
  { month: 'ינו', smp: 0.42 }, { month: 'פבר', smp: 0.45 }, { month: 'מרץ', smp: 0.48 },
  { month: 'אפר', smp: 0.51 }, { month: 'מאי', smp: 0.54 }, { month: 'יוני', smp: 0.57 },
  { month: 'יולי', smp: 0.59 }, { month: 'אוג', smp: 0.53 },
];

export default function FarmDetail() {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState({});
  const [alertActive, setAlertActive] = useState(false);
  const [alertPrice, setAlertPrice] = useState(0.60);
  const [showAlertForm, setShowAlertForm] = useState(false);

  useEffect(() => {
    const refresh = () => setPortfolio(getPortfolio());
    refresh();
    window.addEventListener('portfolio_updated', refresh);
    return () => window.removeEventListener('portfolio_updated', refresh);
  }, []);

  const holdings = Object.entries(portfolio).map(([id, data]) => {
    const meta = farmsMeta[id] || data.farmMeta;
    const monthlyIncome = (meta.monthlyPerShare || (meta.sharePrice * meta.yield / 100 / 12)) * data.qty;
    const payback = Math.ceil(data.totalInvested / monthlyIncome);
    const roiPct = ((monthlyIncome * 8 / data.totalInvested) * 100).toFixed(1);
    return { id, ...data, meta, monthlyIncome: +monthlyIncome.toFixed(1), payback, roiPct };
  });

  const totalInvested = holdings.reduce((s, h) => s + h.totalInvested, 0);
  const totalMonthly = holdings.reduce((s, h) => s + h.monthlyIncome, 0);

  const handleSetAlert = () => {
    setAlertActive(true);
    setShowAlertForm(false);
    toast.success(`התראת מחיר הוגדרה: SMP > ₪${alertPrice}/kWh`);
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted">
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-black text-foreground">התיק הסולארי שלי</h1>
          <p className="text-xs text-muted-foreground">כלל ההחזקות שלך בחוות סולאריות</p>
        </div>
      </motion.div>

      {/* Portfolio Summary */}
      {holdings.length > 0 ? (
        <>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
            className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">הכנסה חודשית כוללת</p>
                <p className="text-4xl font-black text-primary">{totalMonthly.toFixed(1)} ₪</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">סה"כ השקעה</p>
                <p className="text-lg font-bold text-foreground">₪{totalInvested.toFixed(0)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/20">
              <div className="text-center">
                <p className="text-sm font-black text-foreground">{holdings.length}</p>
                <p className="text-[10px] text-muted-foreground">חוות פעילות</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-foreground">{holdings.reduce((s, h) => s + h.qty, 0)}</p>
                <p className="text-[10px] text-muted-foreground">סה"כ מניות</p>
              </div>
            </div>
          </motion.div>

          {/* Per-Farm Holdings */}
          {holdings.map((h, i) => (
            <motion.div key={h.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{h.meta.icon}</span>
                  <div>
                    <p className="text-sm font-black text-foreground">{h.meta.name}</p>
                    <p className="text-xs text-muted-foreground">{h.meta.location} · תשואה {h.meta.yield}%</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">הכנסה/חודש</p>
                  <p className="text-base font-black text-primary">+{h.monthlyIncome} ₪</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'מניות', value: h.qty },
                  { label: 'השקעה', value: `₪${h.totalInvested.toFixed(0)}` },
                  { label: 'החזר', value: `${h.payback} חודשים` },
                ].map(s => (
                  <div key={s.label} className="bg-muted rounded-xl p-2 text-center">
                    <p className="text-xs font-black text-foreground">{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl p-2.5">
                <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground">
                  תיק זה יחזיר את עצמו תוך <span className="font-bold text-primary">{h.payback} חודשים</span> (ROI ~{h.roiPct}% עד כה)
                </p>
              </div>
            </motion.div>
          ))}
        </>
      ) : (
        /* Empty State */
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center gap-4 text-center">
          <span className="text-5xl">☀️</span>
          <p className="text-base font-black text-foreground">עדיין אין מניות בתיק</p>
          <p className="text-xs text-muted-foreground">רכוש מניות בחוות סולאריות ב-Marketplace וכאן תוכל לעקוב אחר ביצועי ההשקעה שלך</p>
          <button onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-black rounded-2xl text-sm active:scale-95 transition-all">
            <Store className="w-4 h-4" /> עבור ל-Marketplace
          </button>
        </motion.div>
      )}

      {/* SMP Price Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
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
          <AreaChart data={smpHistory}>
            <defs>
              <linearGradient id="smpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 11 }}
              formatter={(v) => [`₪${v}`, 'SMP']} />
            {alertActive && <ReferenceLine y={alertPrice} stroke="hsl(var(--accent))" strokeDasharray="4 2"
              label={{ value: `▲ ₪${alertPrice}`, fill: 'hsl(var(--accent))', fontSize: 10 }} />}
            <Area type="monotone" dataKey="smp" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#smpGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Price Alert */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            <p className="text-sm font-bold text-foreground">התראת מחיר SMP</p>
          </div>
          {alertActive ? (
            <button onClick={() => { setAlertActive(false); toast('התראה הוסרה'); }}
              className="flex items-center gap-1 text-xs text-destructive font-bold">
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
            <p className="text-xs text-foreground">תקבל התראה כש-SMP יעלה מעל <span className="font-black text-accent">₪{alertPrice}/kWh</span></p>
          </div>
        )}
        <AnimatePresence>
          {showAlertForm && !alertActive && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-3">
              <p className="text-xs text-muted-foreground">קבע מחיר סף SMP (₪/kWh)</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setAlertPrice(p => Math.max(0.30, +(p - 0.01).toFixed(2)))}
                  className="p-2 rounded-xl bg-muted border border-border font-bold">−</button>
                <div className="flex-1 text-center bg-muted rounded-xl py-2">
                  <span className="text-xl font-black text-accent">₪{alertPrice}</span>
                </div>
                <button onClick={() => setAlertPrice(p => +(p + 0.01).toFixed(2))}
                  className="p-2 rounded-xl bg-muted border border-border font-bold">+</button>
              </div>
              <button onClick={handleSetAlert}
                className="w-full py-3 bg-accent text-accent-foreground font-black rounded-2xl active:scale-95 text-sm">
                הגדר התראה ל-₪{alertPrice}/kWh
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        onClick={() => navigate('/marketplace')}
        className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl active:scale-95 transition-all">
        הוסף יחידות ייצור ←
      </motion.button>
    </div>
  );
}