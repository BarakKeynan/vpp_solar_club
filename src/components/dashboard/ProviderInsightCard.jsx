import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

// --- Provider Data ---
const CURRENT_PROVIDER = 'IEC';

const PROVIDERS = [
  {
    name: 'Cellcom Energy',
    monthlyYield: 840,
    stabilityBonus: 'גבוה',
    netROI: 14.2,
    color: '#8B5CF6', // purple
    bestMatch: true,
    switchable: true,
    // hourly profitability curve (SMP vs tariff, simulated)
    curve: [2,2,2,3,3,4,5,7,9,12,14,15,15,14,13,11,9,8,10,12,10,7,4,3],
  },
  {
    name: 'Electra Power',
    monthlyYield: 815,
    stabilityBonus: 'בינוני',
    netROI: 13.8,
    color: '#F59E0B', // amber
    bestMatch: false,
    switchable: true,
    curve: [2,2,2,3,3,4,5,6,8,11,13,13,13,12,11,10,8,7,9,11,9,6,4,2],
  },
  {
    name: 'Bezeq Energy',
    monthlyYield: 770,
    stabilityBonus: 'בינוני',
    netROI: 12.1,
    color: '#3B82F6', // blue
    bestMatch: false,
    switchable: true,
    curve: [2,2,2,2,3,4,4,6,8,10,11,12,12,11,10,9,7,7,8,10,8,5,3,2],
  },
  {
    name: 'Amisragas',
    monthlyYield: 710,
    stabilityBonus: 'נמוך',
    netROI: 10.8,
    color: '#10B981', // emerald
    bestMatch: false,
    switchable: true,
    curve: [2,2,2,2,3,3,4,5,7,9,10,10,10,9,9,8,6,6,7,8,7,5,3,2],
  },
  {
    name: 'IEC (נוכחי)',
    monthlyYield: 620,
    stabilityBonus: 'לא רלוונטי',
    netROI: 9.5,
    color: '#6B7280', // gray
    bestMatch: false,
    switchable: false,
    curve: [2,2,2,2,2,3,3,4,6,7,8,8,8,7,7,6,5,5,6,7,5,4,2,2],
  },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function SparkCard({ provider }) {
  const data = HOURS.map((h, i) => ({ h, v: provider.curve[i] }));
  return (
    <div className={`rounded-xl border p-3 ${provider.bestMatch ? 'border-violet-500/40 bg-violet-500/5' : 'border-border bg-card'}`}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: provider.color }} />
          <span className="text-xs font-bold text-foreground">{provider.name}</span>
          {provider.bestMatch && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400">
              Best Match לפרופיל שלך
            </span>
          )}
        </div>
        <span className="text-xs font-black" style={{ color: provider.color }}>
          ₪{provider.monthlyYield}/חודש
        </span>
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={provider.color}
              strokeWidth={1.5}
              dot={false}
            />
            <XAxis dataKey="h" hide />
            <YAxis hide domain={[0, 16]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
        <span>00:00</span>
        <span>רווחיות לפי שעה</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

export default function ProviderInsightCard() {
  const [open, setOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [switched, setSwitched] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (insight) return;
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an independent Israeli energy yield auditor AI.
A solar home user's 90-day profile:
- Current provider: IEC
- Solar peak: 10:00–15:00, avg 18.4 kWh/day
- Battery: 20 kWh, charges midday, exports ~9.8 kWh nightly
- Best match found: Cellcom Energy (₪840/month vs IEC ₪620/month)

Write a SHORT Hebrew insight (2–3 sentences) explaining objectively WHY Cellcom Energy yields more for THIS specific production/consumption signature. Reference net-metering tariff and SMP rates. Be neutral, data-driven, not salesy.`,
        response_json_schema: {
          type: 'object',
          properties: { insight: { type: 'string' } },
        },
      });
      setInsight(result.insight);
    } catch {
      setInsight('Cellcom Energy מציעה תעריף נטו-מטרינג גבוה ב-13% בשעות שיא הצהרים – שבהן הפרופיל שלך מייצא את עיקר האנרגיה. תעריף פריקת הסוללה שלה בשעות הערב גבוה בכ-9% מ-IEC, מה שמגדיל משמעותית את התשואה הכוללת.');
    }
    setAnalyzing(false);
  };

  const handleSwitch = async () => {
    setSwitching(true);
    await new Promise(r => setTimeout(r, 2000));
    setSwitching(false);
    setSwitched(true);
    toast.success('הבקשה נשלחה ל-Cellcom Energy! נציג יצור איתך קשר תוך 24 שעות. VPP Active Optimization הופעל.');
  };

  const winner = PROVIDERS.find(p => p.bestMatch);
  const gap = winner.monthlyYield - PROVIDERS.find(p => p.name.startsWith('IEC')).monthlyYield;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        onClick={handleOpen}
        className="w-full py-3 rounded-2xl border border-primary/40 bg-primary/5 text-sm font-black text-primary flex items-center justify-center gap-2 transition-all active:scale-95"
        style={{ boxShadow: '0 0 14px 0 hsl(160 84% 44% / 0.18)' }}
      >
        <Zap className="w-4 h-4" />
        אבחן את תשואת הספק שלי · 90 ימים
      </motion.button>

      {/* Report Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="bg-background border-t border-border w-full max-w-lg rounded-t-3xl max-h-[92vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-muted" />
              </div>

              <div className="px-4 pb-8 space-y-4">
                {/* Title */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-foreground">דוח ביצועי תשואה</p>
                    <p className="text-[10px] text-muted-foreground">מבוסס על 90 ימי נתוני מונה · Noga Data Hub</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-xl bg-muted">
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Sparklines per provider */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">עקומות רווחיות לפי שעה (SMP vs תעריף)</p>
                  <div className="space-y-2">
                    {PROVIDERS.map(p => <SparkCard key={p.name} provider={p} />)}
                  </div>
                </div>

                {/* Metrics Table */}
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2">טבלת מדדים השוואתית</p>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-right px-3 py-2 font-bold text-muted-foreground">ספק</th>
                          <th className="text-center px-2 py-2 font-bold text-muted-foreground">תשואה/חודש</th>
                          <th className="text-center px-2 py-2 font-bold text-muted-foreground">יציבות רשת</th>
                          <th className="text-center px-2 py-2 font-bold text-muted-foreground">Net ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PROVIDERS.map((p, i) => (
                          <tr key={p.name} className={`border-t border-border ${p.bestMatch ? 'bg-violet-500/8' : ''}`}>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                                <span className={`font-bold ${p.bestMatch ? 'text-violet-400' : 'text-foreground'}`}>{p.name}</span>
                                {p.bestMatch && <span className="text-[8px] bg-violet-500/20 text-violet-400 px-1 rounded-full font-black">★</span>}
                              </div>
                            </td>
                            <td className="text-center px-2 py-2.5 font-black" style={{ color: p.color }}>₪{p.monthlyYield}</td>
                            <td className="text-center px-2 py-2.5 text-muted-foreground">{p.stabilityBonus}</td>
                            <td className="text-center px-2 py-2.5 font-bold text-foreground">{p.netROI}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Insight */}
                <div className="bg-card border border-border rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <p className="text-xs font-bold text-muted-foreground">ניתוח אובייקטיבי – למה Cellcom מובילה לפרופיל שלך?</p>
                  </div>
                  {analyzing ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">מנתח נתוני מונה ו-SMP...</span>
                    </div>
                  ) : (
                    <p className="text-xs text-foreground leading-relaxed">{insight}</p>
                  )}
                </div>

                {/* Disclaimer */}
                <div className="flex items-start gap-2 bg-muted/50 rounded-xl p-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    מחושב על בסיס חתימת הייצור/צריכה האישית שלך בפרסי 15 דקות דרך Noga Data Hub. הנתונים מוצגים לצורכי מידע בלבד.
                  </p>
                </div>

                {/* Switch CTA */}
                {!switched ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleSwitch}
                      disabled={switching}
                      className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: '#8B5CF6', color: '#fff' }}
                    >
                      {switching ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> מחבר ל-Cellcom Energy...</>
                      ) : (
                        <><Zap className="w-4 h-4" /> עבור ל-Cellcom ותרוויח +₪{gap} בחודש</>
                      )}
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center">
                      VPP Active Optimization יופעל אוטומטית · עמלת הצלחה 20% על רווח עודף בלבד
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm font-bold text-primary">הבקשה נשלחה! VPP Active Optimization פעיל</span>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}