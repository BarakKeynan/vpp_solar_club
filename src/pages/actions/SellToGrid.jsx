import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PRICE_HOURS = [
  { hour: '00', price: 0.22, label: 'לילה' },
  { hour: '06', price: 0.31, label: 'בוקר' },
  { hour: '10', price: 0.45, label: 'בינוני' },
  { hour: '14', price: 0.38, label: 'צהריים' },
  { hour: '18', price: 0.72, label: 'שיא ✦' },
  { hour: '20', price: 0.68, label: 'ערב' },
  { hour: '22', price: 0.41, label: 'לילה' },
];

export default function SellToGrid() {
  const navigate = useNavigate();
  const [selling, setSelling] = useState(false);
  const [earned, setEarned] = useState(0);
  const [kwh, setKwh] = useState(0);

  useEffect(() => {
    if (!selling) return;
    const t = setInterval(() => {
      setEarned(e => Math.round((e + 0.043) * 100) / 100);
      setKwh(k => Math.round((k + 0.06) * 100) / 100);
    }, 400);
    return () => clearInterval(t);
  }, [selling]);

  const maxPrice = Math.max(...PRICE_HOURS.map(h => h.price));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">מכירה לרשת</h1>
        <div className="mr-auto flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${selling ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-xs font-bold ${selling ? 'text-primary' : 'text-muted-foreground'}`}>
            {selling ? 'מוכר עכשיו' : 'לא פעיל'}
          </span>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto pb-32">
        {/* Live Earnings */}
        <motion.div
          animate={{ borderColor: selling ? 'hsl(var(--primary) / 0.5)' : 'hsl(var(--border))' }}
          className="bg-gradient-to-l from-primary/10 to-card rounded-2xl border-2 p-5"
        >
          <p className="text-xs text-muted-foreground mb-1">הכנסה מהמכירה</p>
          <div className="flex items-end gap-3">
            <motion.p
              key={Math.floor(earned)}
              className="text-5xl font-black text-primary"
            >
              {earned.toFixed(2)} ₪
            </motion.p>
            <div className="pb-1 text-left">
              <p className="text-xs text-muted-foreground">בסשן הנוכחי</p>
              <p className="text-sm font-bold text-foreground">{kwh.toFixed(2)} kWh</p>
            </div>
          </div>
          {selling && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 mt-3">
              <Activity className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs text-primary font-medium">0.72 ₪/kWh · שעת שיא · מחיר מקסימלי</p>
            </motion.div>
          )}
        </motion.div>

        {/* Price Chart */}
        <div className="bg-card rounded-2xl border border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <p className="text-xs font-bold text-muted-foreground">מחיר חשמל לפי שעה (₪/kWh)</p>
          </div>
          <div className="flex items-end gap-2 h-28">
            {PRICE_HOURS.map((h, i) => {
              const heightPct = (h.price / maxPrice) * 100;
              const isPeak = h.price === maxPrice;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ delay: i * 0.06, duration: 0.5, type: 'spring' }}
                    className={`w-full rounded-t-lg ${isPeak ? 'bg-primary' : 'bg-muted'}`}
                    style={{ minHeight: 4 }}
                  />
                  <p className={`text-[9px] font-bold ${isPeak ? 'text-primary' : 'text-muted-foreground'}`}>{h.hour}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            💡 עכשיו שעת שיא – המחיר הגבוה ביותר לייצוא
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'מחיר כעת', value: '0.72 ₪', icon: DollarSign, color: 'text-primary' },
            { label: 'נמכר היום', value: '9.8 kWh', icon: Zap, color: 'text-secondary' },
            { label: 'הכנסה היום', value: '47 ₪', icon: TrendingUp, color: 'text-accent' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className={`text-base font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-background/95 backdrop-blur border-t border-border">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setSelling(s => !s)}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
            selling
              ? 'bg-destructive/20 text-destructive border border-destructive/40'
              : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
          }`}
        >
          {selling ? '⏹ הפסק מכירה' : '💰 מכור לרשת עכשיו'}
        </motion.button>
      </div>
    </div>
  );
}