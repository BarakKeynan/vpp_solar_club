import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, DollarSign, Zap, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '@/lib/i18n';

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
  const { t } = useLang();

  const steps = [
    { step: '1', titleKey: 'savings_info_step1_title', descKey: 'savings_info_step1_desc', icon: BarChart2 },
    { step: '2', titleKey: 'savings_info_step2_title', descKey: 'savings_info_step2_desc', icon: Zap },
    { step: '3', titleKey: 'savings_info_step3_title', descKey: 'savings_info_step3_desc', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">{t('savings_info_title')}</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 pb-16 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/30 to-card rounded-3xl border border-primary/40 p-6 text-center space-y-2">
          <div className="p-4 rounded-full bg-primary/20 inline-flex mx-auto">
            <DollarSign className="w-10 h-10 text-primary" />
          </div>
          <p className="text-5xl font-black text-primary">{t('savings_info_hero_value')}</p>
          <p className="text-sm text-muted-foreground">{t('savings_info_hero_sub')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs font-bold text-muted-foreground mb-3">{t('savings_info_chart_label')}</p>
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
                formatter={(v) => [`${v} ₪`, t('savings_info_chart_label')]} />
              <Area type="monotone" dataKey="savings" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#sg)" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-primary font-bold mt-1">{t('savings_info_chart_trend')}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <p className="text-sm font-black text-foreground">{t('savings_info_how_title')}</p>
          {steps.map(item => (
            <div key={item.step} className="flex items-start gap-4 bg-card rounded-2xl border border-border p-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-black text-sm">{item.step}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{t(item.titleKey)}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all">
          {t('savings_info_cta')}
        </button>
      </div>
    </div>
  );
}