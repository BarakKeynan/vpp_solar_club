import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid
} from 'recharts';
import { TrendingUp, Zap, Calendar, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

// --- Mock Data ---
const JOIN_DATE = 'מרץ 2023';
const MONTHS_ACTIVE = 25;

const roiHistory = [
  { month: 'מרץ 23', cumulative: -28000, monthly: 0 },
  { month: 'אפר 23', cumulative: -26800, monthly: 1200 },
  { month: 'מאי 23', cumulative: -25200, monthly: 1600 },
  { month: 'יונ 23', cumulative: -23100, monthly: 2100 },
  { month: 'יול 23', cumulative: -20800, monthly: 2300 },
  { month: 'אוג 23', cumulative: -18400, monthly: 2400 },
  { month: 'ספט 23', cumulative: -16500, monthly: 1900 },
  { month: 'אוק 23', cumulative: -14900, monthly: 1600 },
  { month: 'נוב 23', cumulative: -13600, monthly: 1300 },
  { month: 'דצ 23', cumulative: -12500, monthly: 1100 },
  { month: 'ינו 24', cumulative: -11200, monthly: 1300 },
  { month: 'פבר 24', cumulative: -9800, monthly: 1400 },
  { month: 'מרץ 24', cumulative: -7900, monthly: 1900 },
  { month: 'אפר 24', cumulative: -5600, monthly: 2300 },
  { month: 'מאי 24', cumulative: -3100, monthly: 2500 },
  { month: 'יונ 24', cumulative: -500, monthly: 2600 },
  { month: 'יול 24', cumulative: 2200, monthly: 2700 },
  { month: 'אוג 24', cumulative: 4900, monthly: 2700 },
  { month: 'ספט 24', cumulative: 7200, monthly: 2300 },
  { month: 'אוק 24', cumulative: 9100, monthly: 1900 },
  { month: 'נוב 24', cumulative: 10700, monthly: 1600 },
  { month: 'דצ 24', cumulative: 12100, monthly: 1400 },
  { month: 'ינו 25', cumulative: 13700, monthly: 1600 },
  { month: 'פבר 25', cumulative: 15400, monthly: 1700 },
  { month: 'מרץ 25', cumulative: 17200, monthly: 1800 },
];

const futureProjections = [
  { year: '2025', pessimistic: 22000, realistic: 26000, optimistic: 31000 },
  { year: '2026', pessimistic: 38000, realistic: 46000, optimistic: 55000 },
  { year: '2027', pessimistic: 52000, realistic: 64000, optimistic: 77000 },
  { year: '2028', pessimistic: 65000, realistic: 82000, optimistic: 100000 },
  { year: '2029', pessimistic: 77000, realistic: 100000, optimistic: 124000 },
];

const breakdownItems = [
  { label: 'חיסכון על חשבון חשמל', value: 9800, color: 'bg-primary', textColor: 'text-primary' },
  { label: 'מכירת חשמל לרשת', value: 4200, color: 'bg-secondary', textColor: 'text-secondary' },
  { label: 'Solar Club דיבידנדים', value: 2100, color: 'bg-accent', textColor: 'text-accent' },
  { label: 'הטבות מס', value: 1100, color: 'bg-chart-4', textColor: 'text-purple-400' },
];
const totalEarned = breakdownItems.reduce((s, i) => s + i.value, 0);
const investmentCost = 28000;
const netProfit = totalEarned - investmentCost;
const roiPercent = ((totalEarned / investmentCost) * 100).toFixed(1);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {Number(p.value).toLocaleString()} ₪</p>
      ))}
    </div>
  );
};

export default function FinancialPerformance() {
  const [projectionScenario, setProjectionScenario] = useState('realistic');

  const scenarios = [
    { key: 'pessimistic', label: 'שמרני', color: 'text-muted-foreground' },
    { key: 'realistic', label: 'ריאלי', color: 'text-primary' },
    { key: 'optimistic', label: 'אופטימי', color: 'text-accent' },
  ];

  return (
    <div className="p-4 space-y-5 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        ביצועים פיננסיים
      </motion.h1>

      {/* Summary KPI Cards */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-primary/30 rounded-2xl p-4 bg-primary/5">
          <p className="text-xs text-muted-foreground">סה״כ הרווחת</p>
          <p className="text-2xl font-black text-primary mt-1">+{totalEarned.toLocaleString()} ₪</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">מאז {JOIN_DATE}</p>
        </div>
        <div className={`bg-card border rounded-2xl p-4 ${netProfit >= 0 ? 'border-primary/30 bg-primary/5' : 'border-accent/30 bg-accent/5'}`}>
          <p className="text-xs text-muted-foreground">רווח נקי</p>
          <p className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-primary' : 'text-accent'}`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₪
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">לאחר עלות ההשקעה</p>
        </div>
        <div className="bg-card border border-secondary/30 rounded-2xl p-4 bg-secondary/5">
          <p className="text-xs text-muted-foreground">ROI מצטבר</p>
          <p className="text-2xl font-black text-secondary mt-1">{roiPercent}%</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">תשואה על ההשקעה</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">חודשים פעיל</p>
          <p className="text-2xl font-black text-foreground mt-1">{MONTHS_ACTIVE}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">מאז {JOIN_DATE}</p>
        </div>
      </motion.div>

      {/* ROI History Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <p className="text-sm font-bold text-foreground">ROI מצטבר לאורך זמן</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={roiHistory} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} interval={4} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="hsl(var(--accent))" strokeDasharray="4 4" strokeWidth={1.5} />
            <Area type="monotone" dataKey="cumulative" name="ROI מצטבר"
              stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#roiGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">קו כתום = נקודת איזון (Break-even)</p>
      </motion.div>

      {/* Breakdown */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-accent" />
          <p className="text-sm font-bold text-foreground">פירוט מקורות הכנסה</p>
        </div>
        <div className="space-y-3">
          {breakdownItems.map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/80">{item.label}</span>
                <span className={`font-bold ${item.textColor}`}>+{item.value.toLocaleString()} ₪</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(item.value / totalEarned) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border flex justify-between">
          <span className="text-xs text-muted-foreground">סה״כ הכנסות</span>
          <span className="text-sm font-black text-primary">+{totalEarned.toLocaleString()} ₪</span>
        </div>
      </motion.div>

      {/* Future Projections */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            <p className="text-sm font-bold text-foreground">תחזית רווח עתידית</p>
          </div>
          <div className="flex bg-muted rounded-xl p-0.5 gap-0.5">
            {scenarios.map(s => (
              <button key={s.key} onClick={() => setProjectionScenario(s.key)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${projectionScenario === s.key ? 'bg-card shadow text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={futureProjections} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false}
              tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={projectionScenario} name="רווח מצטבר" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-muted-foreground mt-2">
          מבוסס על: תעריף חשמל נוכחי (0.61 ₪/kWh) + עלייה שנתית צפויה של {projectionScenario === 'pessimistic' ? '2%' : projectionScenario === 'realistic' ? '4%' : '7%'} + יעילות פאנלים {projectionScenario === 'pessimistic' ? '85%' : projectionScenario === 'realistic' ? '91%' : '95%'}
        </p>
      </motion.div>

      {/* Personal Calculator */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="bg-card border border-border rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-accent" />
          <p className="text-sm font-bold text-foreground">מחשבון חיסכון אישי</p>
        </div>
        <div className="space-y-2">
          {[
            { label: 'השקעה ראשונית', value: `-${investmentCost.toLocaleString()} ₪`, color: 'text-destructive' },
            { label: 'הכנסות מצטברות', value: `+${totalEarned.toLocaleString()} ₪`, color: 'text-primary' },
            { label: `ממוצע חודשי (${MONTHS_ACTIVE} חודשים)`, value: `+${Math.round(totalEarned / MONTHS_ACTIVE).toLocaleString()} ₪/חודש`, color: 'text-secondary' },
            { label: 'חיסכון על חשמל ביתי', value: '+9,800 ₪', color: 'text-primary' },
            { label: 'הכנסה מהרשת + Solar Club', value: '+6,300 ₪', color: 'text-accent' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className={`text-sm font-black ${row.color}`}>{row.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-bold text-foreground">רווח נקי עד היום</span>
            <span className={`text-lg font-black ${netProfit >= 0 ? 'text-primary' : 'text-accent'}`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₪
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}