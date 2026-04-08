import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, ArrowLeftRight, CheckCircle2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

const getProviders = (isHe) => [
  {
    id: 'electra',
    name: 'Electra Power',
    logo: '⚡',
    rate: 0.58,
    monthlyEst: 420,
    rating: 4.2,
    active: true,
    badge: isHe ? 'נוכחי' : 'Current',
    badgeColor: 'bg-primary/20 text-primary',
    pros: isHe ? ['מחיר תחרותי', 'שירות לקוחות מהיר', 'חוזה גמיש'] : ['Competitive rate', 'Fast customer service', 'Flexible contract'],
    color: 'border-primary/40',
  },
  {
    id: 'amisragas',
    name: isHe ? 'אמישראגז' : 'Amisragas',
    logo: '🔥',
    rate: 0.61,
    monthlyEst: 450,
    rating: 3.8,
    active: false,
    badge: isHe ? 'חיסכון פוטנציאלי: -₪30/חודש' : 'Potential saving: -₪30/mo',
    badgeColor: 'bg-muted text-muted-foreground',
    pros: isHe ? ['חבילה משולבת גז+חשמל', 'הנחה לדיירים'] : ['Combined gas+electricity plan', 'Resident discount'],
    color: 'border-border',
  },
  {
    id: 'iec',
    name: isHe ? 'חברת החשמל (IEC)' : 'Israel Electric Corp. (IEC)',
    logo: '🏭',
    rate: 0.67,
    monthlyEst: 510,
    rating: 3.2,
    active: false,
    badge: isHe ? 'יקר יותר ב-₪90' : '₪90 more expensive',
    badgeColor: 'bg-destructive/10 text-destructive',
    pros: isHe ? ['תשתית אמינה', 'כיסוי ארצי'] : ['Reliable infrastructure', 'Nationwide coverage'],
    color: 'border-border',
  },
];

const getCompareData = (isHe) => [
  { name: 'Electra', rate: 58, fill: 'hsl(var(--primary))' },
  { name: isHe ? 'אמישראגז' : 'Amisragas', rate: 61, fill: 'hsl(var(--secondary))' },
  { name: 'IEC', rate: 67, fill: 'hsl(var(--accent))' },
];

export default function Providers() {
  const [expanded, setExpanded] = useState(null);
  const [current, setCurrent] = useState('electra');
  const { lang } = useLang();
  const isHe = lang === 'he';
  const providers = getProviders(isHe);
  const compareData = getCompareData(isHe);

  const handleSwitch = (id) => {
    setCurrent(id);
    const name = providers.find(p => p.id === id).name;
    toast.success(isHe ? `עברת בהצלחה לספק ${name}` : `Successfully switched to ${name}`);
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {isHe ? 'ניהול ספקי אנרגיה' : 'Energy Provider Management'}
      </motion.h1>

      {/* AI Recommendation */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="bg-primary/10 border border-primary/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <p className="text-sm font-bold text-primary">{isHe ? 'המלצת AI' : 'AI Recommendation'}</p>
            <p className="text-xs text-foreground/80 mt-1">
              {isHe
                ? <>Electra Power מציעה את התעריף הטוב ביותר עבורך. מעבר מ-IEC יחסוך <span className="font-black text-primary">₪90/חודש</span> — <span className="font-black">₪1,080/שנה</span>.</>
                : <>Electra Power offers the best rate for you. Switching from IEC will save <span className="font-black text-primary">₪90/month</span> — <span className="font-black">₪1,080/year</span>.</>
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Compare Chart */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">{isHe ? 'השוואת תעריפים (אג׳/kWh)' : 'Rate Comparison (agorot/kWh)'}</p>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={compareData} barSize={32}>
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 10, fontSize: 12 }}
              formatter={(v) => [`${v}`, isHe ? 'תעריף' : 'Rate']}
            />
            {compareData.map((d, i) => (
              <Bar key={i} dataKey="rate" fill={d.fill} radius={[6, 6, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Provider Cards */}
      {providers.map((p, i) => {
        const isActive = current === p.id;
        const isOpen = expanded === p.id;
        return (
          <motion.div key={p.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.08 }}
            className={`bg-card rounded-2xl border ${isActive ? 'border-primary/50' : p.color} overflow-hidden`}>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{p.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{p.name}</p>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="text-xs text-muted-foreground">{p.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-foreground">{p.rate} ₪</p>
                  <p className="text-xs text-muted-foreground">לkWh</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.badgeColor}`}>{isActive ? (isHe ? 'ספק נוכחי' : 'Current Provider') : p.badge}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setExpanded(isOpen ? null : p.id)} className="p-1.5 rounded-lg bg-muted">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {!isActive && (
                    <button onClick={() => handleSwitch(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
                      <ArrowLeftRight className="w-3 h-3" />
                      {isHe ? 'עבור' : 'Switch'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border">
                  <div className="p-4 space-y-1.5">
                    <p className="text-xs font-bold text-muted-foreground mb-2">{isHe ? 'יתרונות:' : 'Advantages:'}</p>
                    {p.pros.map(pro => (
                      <div key={pro} className="flex items-center gap-2 text-xs text-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {pro}
                      </div>
                    ))}
                    <div className="mt-3 p-3 bg-muted rounded-xl">
                      <p className="text-xs text-muted-foreground">{isHe ? 'הערכת עלות חודשית' : 'Monthly Cost Estimate'}</p>
                      <p className="text-lg font-black text-foreground">{p.monthlyEst} ₪</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}