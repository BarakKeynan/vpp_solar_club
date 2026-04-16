import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2, Zap, ShieldCheck, Search } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useLang } from '@/lib/i18n';

const PROVIDERS = [
  { name: 'Cellcom Energy', monthlyYield: 840, stabilityBonus: { he: 'גבוה', en: 'High' }, netROI: 14.2, color: '#8B5CF6', bestMatch: true, switchable: true, curve: [2,2,2,3,3,4,5,7,9,12,14,15,15,14,13,11,9,8,10,12,10,7,4,3] },
  { name: 'Electra Power', monthlyYield: 815, stabilityBonus: { he: 'בינוני', en: 'Medium' }, netROI: 13.8, color: '#F59E0B', bestMatch: false, switchable: true, curve: [2,2,2,3,3,4,5,6,8,11,13,13,13,12,11,10,8,7,9,11,9,6,4,2] },
  { name: 'Bezeq Energy', monthlyYield: 770, stabilityBonus: { he: 'בינוני', en: 'Medium' }, netROI: 12.1, color: '#3B82F6', bestMatch: false, switchable: true, curve: [2,2,2,2,3,4,4,6,8,10,11,12,12,11,10,9,7,7,8,10,8,5,3,2] },
  { name: 'Amisragas', monthlyYield: 710, stabilityBonus: { he: 'נמוך', en: 'Low' }, netROI: 10.8, color: '#10B981', bestMatch: false, switchable: true, curve: [2,2,2,2,3,3,4,5,7,9,10,10,10,9,9,8,6,6,7,8,7,5,3,2] },
  { name: 'IEC', monthlyYield: 620, stabilityBonus: { he: 'לא רלוונטי', en: 'N/A' }, netROI: 9.5, color: '#6B7280', bestMatch: false, switchable: false, curve: [2,2,2,2,2,3,3,4,6,7,8,8,8,7,7,6,5,5,6,7,5,4,2,2] },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function SparkCard({ provider, t, lang }) {
  const data = HOURS.map((h, i) => ({ h, v: provider.curve[i] }));
  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: provider.bestMatch ? 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(139,92,246,0.04))' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${provider.bestMatch ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: provider.color }} />
          <span className="text-xs font-bold text-white">{provider.name}</span>
          {provider.bestMatch && (
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(139,92,246,0.25)', color: '#C4B5FD' }}>
              {t('provider_best_match')}
            </span>
          )}
        </div>
        <span className="text-xs font-black" style={{ color: provider.color }}>₪{provider.monthlyYield}/{lang === 'he' ? 'חודש' : 'mo'}</span>
      </div>
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="v" stroke={provider.color} strokeWidth={1.5} dot={false} />
            <XAxis dataKey="h" hide />
            <YAxis hide domain={[0, 16]} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-1 text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
        <span>00:00</span>
        <span>{t('provider_yield_by_hour')}</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

function ScanningOverlay({ onDone, t }) {
  React.useEffect(() => {
    const timer = setTimeout(onDone, 2200);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 rounded-t-3xl flex flex-col items-center justify-center gap-4 z-10"
      style={{ background: 'rgba(8,12,26,0.96)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="p-5 rounded-full"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(245,158,11,0.15))' }}
      >
        <Search className="w-8 h-8" style={{ color: '#3B82F6' }} />
      </motion.div>
      <div className="text-center space-y-1">
        <p className="text-sm font-black text-white">{t('provider_scanning')}</p>
        <p className="text-xs" style={{ color: 'rgba(147,197,253,0.7)' }}>{t('provider_scanning_sub')}</p>
      </div>
      <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(59,130,246,0.15)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#3B82F6,#F59E0B)' }}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function ProviderInsightCard() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ready, setReady] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState(null);
  const [switching, setSwitching] = useState(false);
  const [switched, setSwitched] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setScanning(true);
    if (!insight) {
      setAnalyzing(true);
      base44.integrations.Core.InvokeLLM({
        prompt: `You are an independent Israeli energy yield auditor AI.
A solar home user's 90-day profile:
- Current provider: IEC
- Solar peak: 10:00–15:00, avg 18.4 kWh/day
- Battery: 20 kWh, charges midday, exports ~9.8 kWh nightly
- Best match found: Cellcom Energy (₪840/month vs IEC ₪620/month)

Write a SHORT ${lang === 'en' ? 'English' : 'Hebrew'} insight (2–3 sentences) explaining objectively WHY Cellcom Energy yields more for THIS specific production/consumption signature. Reference net-metering tariff and SMP rates. Be neutral and data-driven.`,
        response_json_schema: { type: 'object', properties: { insight: { type: 'string' } } },
      }).then(r => {
        setInsight(r?.insight || r);
        setAnalyzing(false);
      }).catch(() => {
        setInsight(lang === 'en'
          ? 'Cellcom Energy offers a net-metering tariff 13% higher during midday peak hours – when your profile exports the most energy. Their battery discharge rate in evening hours is ~9% above IEC, significantly boosting total yield.'
          : 'Cellcom Energy מציעה תעריף נטו-מטרינג גבוה ב-13% בשעות שיא הצהרים – שבהן הפרופיל שלך מייצא את עיקר האנרגיה. תעריף פריקת הסוללה בשעות הערב גבוה בכ-9% מ-IEC, מה שמגדיל את התשואה הכוללת משמעותית.');
        setAnalyzing(false);
      });
    }
  };

  const handleScanDone = () => { setScanning(false); setReady(true); };

  const handleSwitch = async () => {
    setSwitching(true);
    await new Promise(r => setTimeout(r, 2000));
    setSwitching(false);
    setSwitched(true);
    toast.success(t('provider_switch_sent'));
  };

  const winner = PROVIDERS.find(p => p.bestMatch);
  const iec = PROVIDERS.find(p => p.name === 'IEC');
  const gap = winner.monthlyYield - iec.monthlyYield;

  return (
    <>
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        onClick={handleOpen}
        className="w-full rounded-2xl p-4 flex items-center gap-4 text-right transition-all active:scale-[0.97]"
        style={{
          background: 'linear-gradient(135deg,rgba(59,130,246,0.1) 0%,rgba(17,24,39,0.6) 60%,rgba(161,123,0,0.08) 100%)',
          border: '1px solid rgba(59,130,246,0.3)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 0 22px 0 rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="p-3 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.2),rgba(245,158,11,0.12))', boxShadow: '0 0 14px 0 rgba(59,130,246,0.3)' }}>
          <Search className="w-5 h-5" style={{ color: '#93C5FD' }} />
        </div>
        <div className="flex-1 text-right">
          <p className="text-sm font-black text-white">{t('provider_audit_title')}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(147,197,253,0.7)' }}>{t('provider_audit_subtitle')}</p>
        </div>
        <Zap className="w-4 h-4 shrink-0" style={{ color: '#F59E0B' }} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={() => { setOpen(false); setReady(false); }}
          >
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="relative w-full max-w-lg rounded-t-3xl max-h-[92vh] overflow-y-auto"
              style={{ background: '#0A0F1E', border: '1px solid rgba(59,130,246,0.2)', borderBottom: 'none' }}
              onClick={e => e.stopPropagation()}
            >
              <AnimatePresence>
                {scanning && <ScanningOverlay onDone={handleScanDone} t={t} />}
              </AnimatePresence>

              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
              </div>

              <div className="px-4 pb-8 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-black text-white">{t('provider_report_title')}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(147,197,253,0.6)' }}>{t('provider_report_sub')}</p>
                  </div>
                  <button onClick={() => { setOpen(false); setReady(false); }} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <span className="text-xl">⚡</span>
                  <div>
                    <p className="text-xs font-black" style={{ color: '#FCD34D' }}>{t('provider_synergy_bonus')}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(253,211,77,0.75)' }}>{t('provider_synergy_desc')}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_yield_comparison')}</p>
                  <div className="space-y-2">
                    {PROVIDERS.map(p => <SparkCard key={p.name} provider={p} t={t} lang={lang} />)}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_yield_table_title')}</p>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <th className="text-right px-3 py-2 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_col_provider')}</th>
                          <th className="text-center px-2 py-2 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_col_yield')}</th>
                          <th className="text-center px-2 py-2 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_col_stability')}</th>
                          <th className="text-center px-2 py-2 font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Net ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PROVIDERS.map(p => (
                          <tr key={p.name} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: p.bestMatch ? 'rgba(139,92,246,0.08)' : 'transparent' }}>
                            <td className="px-3 py-2.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                                <span className="font-bold" style={{ color: p.bestMatch ? '#C4B5FD' : 'rgba(255,255,255,0.85)' }}>{p.name}</span>
                                {p.bestMatch && <span className="text-[8px] px-1 rounded-full font-black" style={{ background: 'rgba(139,92,246,0.25)', color: '#C4B5FD' }}>★</span>}
                              </div>
                            </td>
                            <td className="text-center px-2 py-2.5 font-black" style={{ color: p.color }}>₪{p.monthlyYield}</td>
                            <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.stabilityBonus[lang] || p.stabilityBonus.he}</td>
                            <td className="text-center px-2 py-2.5 font-bold text-white">{p.netROI}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🤖</span>
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{t('provider_ai_analysis')}</p>
                  </div>
                  {analyzing ? (
                    <div className="flex items-center gap-2 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#3B82F6' }} />
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('provider_analyzing')}</span>
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{insight}</p>
                  )}
                </div>

                {!switched ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleSwitch}
                      disabled={switching}
                      className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)', color: '#fff', boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}
                    >
                      {switching ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t('provider_switching')}</>
                      ) : (
                        <><Zap className="w-4 h-4" /> {t('provider_switch_cta', { gap })}</>
                      )}
                    </button>
                    <p className="text-[10px] text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('provider_fee_note')}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">{t('provider_switched_ok')}</span>
                  </div>
                )}

                <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('provider_neutral_note')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}