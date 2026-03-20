import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, DollarSign, Zap, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'אוק', savings: 38 },
  { month: 'נוב', savings: 42 },
  { month: 'דצ', savings: 35 },
  { month: 'ינו', savings: 55 },
  { month: 'פבר', savings: 61 },
  { month: 'מרץ', savings: 74 },
  { month: 'אפר', savings: 80 },
];

export default function SavingsInfo() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">חיסכון במועדון הסולארי</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 pb-16 overflow-y-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/30 to-card rounded-3xl border border-primary/40 p-6 text-center space-y-2">
          <div className="p-4 rounded-full bg-primary/20 inline-flex mx-auto">
            <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <p className="text-5xl font-black text-primary">עד 80 ₪</p>
          <p className="text-sm text-muted-foreground">חיסכון חודשי ממוצע לחבר מועדון</p>
        </motion.div>

        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground mb-3">חיסכון חודשי לחבר ממוצע (₪)</p>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 12, fontSize: 12 }}
                formatter={(v) => [`${v} ₪`, 'חיסכון']} />
              <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-primary font-bold mt-1">↑ מגמת עלייה – החיסכון גדל עם הזמן</p>
        </motion.div>

        {/* How it works */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="space-y-3">
          <p className="text-sm font-black text-foreground">איך זה עובד?</p>
          {[
            { step: '1', title: 'קונים מניות בחווה', desc: 'כל מניה = 29 ₪/חודש, מייצגת חלק אמיתי בחווה הסולארית', icon: BarChart2 },
            { step: '2', title: 'הפאנלים מייצרים', desc: 'החווה מייצרת חשמל 24/7 ומוכרת לחברת החשמל', icon: Zap },
            { step: '3', title: 'אתם מקבלים זיכוי', desc: 'הזיכוי מנוכה ישירות מחשבון החשמל שלכם כל חודש', icon: TrendingUp },
          ].map(item => (
            <div key={item.step} className="flex items-start gap-4 bg-card rounded-2xl border border-border p-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-black text-sm">{item.step}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all">
          הצטרף ותתחיל לחסוך ←
        </button>
      </div>
    </div>
  );
}