import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Zap, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';

// Simulated back-test data (90 days)
const CURRENT_PROVIDER = 'Electra';
const WINNING_PROVIDER = 'Sellecom';
const CURRENT_EARNED = 1243;
const WINNING_EARNED = 1431;
const GAP = WINNING_EARNED - CURRENT_EARNED;
const GAP_PCT = Math.round((GAP / CURRENT_EARNED) * 100);

const providerComparison = [
  { name: 'Sellecom', earned: 1431, color: 'text-primary', bar: 100 },
  { name: 'Electra', earned: 1243, color: 'text-secondary', bar: Math.round((1243 / 1431) * 100) },
  { name: 'Bezeq אנרגיה', earned: 1198, color: 'text-muted-foreground', bar: Math.round((1198 / 1431) * 100) },
  { name: 'IEC', earned: 1102, color: 'text-muted-foreground', bar: Math.round((1102 / 1431) * 100) },
];

export default function ProviderInsightCard() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [switched, setSwitched] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState(null);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an energy analyst AI. A solar home user in Israel has the following 90-day data:
- Current provider: ${CURRENT_PROVIDER}
- Total earned with current provider: ₪${CURRENT_EARNED}
- Best provider found (Sellecom): ₪${WINNING_EARNED}
- Gap: ₪${GAP} (+${GAP_PCT}%)
- Solar generation pattern: peak 10:00-15:00, avg 18.4 kWh/day
- Battery: 20 kWh, charges during day, exports 9.8 kWh avg nightly

Write a SHORT personalized Hebrew insight (2-3 sentences max) explaining WHY Sellecom pays more for this specific usage pattern (hint: better net metering tariff for midday export + better SMP rate for evening battery discharge). Be specific, financial, and persuasive.`,
        response_json_schema: {
          type: 'object',
          properties: {
            insight: { type: 'string' },
          },
        },
      });
      setInsight(result.insight);
    } catch {
      setInsight('Sellecom מציעה תעריף נטו-מטרינג גבוה ב-12% בשעות שיא הצהרים, שבהן המערכת שלך מייצאת את מרבית החשמל. בנוסף, תעריף פריקת הסוללה בשעות הערב גבוה ב-8% מ-Electra.');
    }
    setAnalyzing(false);
  };

  const handleSwitch = async () => {
    setSwitching(true);
    await new Promise(r => setTimeout(r, 2200));
    setSwitching(false);
    setSwitched(true);
    toast.success('הבקשה נשלחה ל-Sellecom! נציג יצור איתך קשר תוך 24 שעות. VPP Active Optimization הופעל.');
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl border border-destructive/40 bg-destructive/5 overflow-hidden"
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">⚡</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">אופטימיזציה</span>
              </div>
              <p className="text-sm font-black text-foreground">האנרגיה שלך מניבה פחות מהפוטנציאל</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                ב-90 יום האחרונים הרווחת <span className="text-foreground font-bold">₪{CURRENT_EARNED.toLocaleString()}</span>.
                עם <span className="text-primary font-bold">{WINNING_PROVIDER}</span> היית מרוויח{' '}
                <span className="text-primary font-bold">₪{WINNING_EARNED.toLocaleString()} (+{GAP_PCT}%)</span>.
              </p>
            </div>
          </div>
          <button onClick={() => { setExpanded(v => !v); if (!insight && !expanded) handleAnalyze(); }}
            className="p-2 rounded-xl bg-card border border-border shrink-0">
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
        </div>

        {/* Quick CTA */}
        {!switched && (
          <button
            onClick={() => { setExpanded(true); if (!insight) handleAnalyze(); }}
            className="mt-3 w-full py-2.5 bg-primary text-primary-foreground text-sm font-black rounded-xl active:scale-95 transition-all">
            עבור ל-{WINNING_PROVIDER} וצבור +₪{GAP} נוספים
          </button>
        )}
        {switched && (
          <div className="mt-3 flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-xl px-3 py-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">הבקשה נשלחה! VPP Active Optimization פעיל</span>
          </div>
        )}
      </div>

      {/* Expanded Analysis */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-4 space-y-4">

              {/* Provider Comparison Bars */}
              <div>
                <p className="text-xs font-bold text-muted-foreground mb-2">השוואת ספקים – 90 יום אחרונים</p>
                <div className="space-y-2">
                  {providerComparison.map(p => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className={`text-xs font-bold w-24 text-right ${p.color}`}>{p.name}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.bar}%` }}
                          transition={{ duration: 0.7, delay: 0.1 }}
                          className={`h-full rounded-full ${p.name === WINNING_PROVIDER ? 'bg-primary' : 'bg-muted-foreground/40'}`}
                        />
                      </div>
                      <span className={`text-xs font-black w-16 ${p.name === WINNING_PROVIDER ? 'text-primary' : 'text-foreground'}`}>
                        ₪{p.earned.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insight */}
              <div className="bg-card border border-border rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">🤖</span>
                  <p className="text-xs font-bold text-muted-foreground">ניתוח AI – למה Sellecom מנצחת?</p>
                </div>
                {analyzing ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">מנתח את פרופיל הצריכה שלך...</span>
                  </div>
                ) : (
                  <p className="text-xs text-foreground leading-relaxed">{insight}</p>
                )}
              </div>

              {/* Switch CTA */}
              {!switched && (
                <div className="space-y-2">
                  <button
                    onClick={handleSwitch}
                    disabled={switching}
                    className="w-full py-3 bg-primary text-primary-foreground font-black text-sm rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                    {switching ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> מחבר ל-Sellecom...</>
                    ) : (
                      <><Zap className="w-4 h-4" /> אשר מעבר ל-Sellecom עכשיו</>
                    )}
                  </button>
                  <p className="text-[10px] text-muted-foreground text-center">
                    VPP Active Optimization יופעל אוטומטית · עמלת הצלחה 20% על רווח עודף בלבד
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}