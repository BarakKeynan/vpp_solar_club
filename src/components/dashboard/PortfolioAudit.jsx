import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Zap, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, RotateCcw, CheckCircle2,
  ShieldCheck, ArrowRight, Sparkles,
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ─── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => (n != null && !isNaN(n) ? Number(n).toLocaleString('he-IL') : '—');
const fmtPct = (n) => (n != null && !isNaN(n) ? `${Number(n).toFixed(0)}%` : '—');

const PRIORITY_STYLE = {
  high:   { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',   dot: '#ef4444' },
  medium: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b' },
  low:    { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.3)',  dot: '#10b981' },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function ProcessingOverlay({ step, fileName }) {
  const steps = [
    { label: 'מעלה קובץ', sub: 'מצפין ומאבטח...', icon: '🔒' },
    { label: 'OCR סורק', sub: 'מחלץ נתוני מונה ותעריף...', icon: '📄' },
    { label: 'AI מנתח', sub: 'מחשב ארביטראז׳ ו-ROI...', icon: '🧠' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)' }}
    >
      {/* File row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <FileText className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
        <p className="text-xs text-white/50 truncate flex-1">{fileName}</p>
        <span className="text-[10px] text-emerald-400 font-bold animate-pulse">עיבוד...</span>
      </div>

      {/* Steps */}
      <div className="px-5 py-6 space-y-4">
        {steps.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: done || active ? 1 : 0.3, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{
                  background: done ? 'rgba(16,185,129,0.2)' : active ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : active ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                }}>
                {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : s.icon}
                {active && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{ background: 'rgba(139,92,246,0.4)' }}
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">{s.label}</p>
                <p className="text-[10px] text-white/40">{s.sub}</p>
              </div>
              {active && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-400 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="mx-5 mb-5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #10b981, #7C3AED)' }}
          animate={{ width: `${Math.min(100, (step / 2) * 100)}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function StatRow({ label, value, color, large }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={`font-black ${large ? 'text-base' : 'text-sm'}`} style={{ color: color || '#fff' }}>
        {value}
      </span>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  );
}

function RecommendationCard({ rec, index }) {
  const s = PRIORITY_STYLE[rec.priority] || PRIORITY_STYLE.low;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-xl p-3.5"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-xs font-black text-white text-right leading-snug flex-1">{rec.title_he}</p>
            {rec.estimated_gain_ils != null && (
              <span className="text-xs font-black text-emerald-400 flex-shrink-0 whitespace-nowrap">
                +₪{fmt(rec.estimated_gain_ils)}
              </span>
            )}
          </div>
          <p className="text-[10px] text-white/50 leading-relaxed text-right">{rec.desc_he}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PortfolioAudit() {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState('idle'); // idle | loading | result | error
  const [step, setStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [reportType, setReportType] = useState('electricity_bill');
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef();
  const { lang } = useLang();
  const isHe = lang === 'he';

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setState('loading');
    setStep(0);
    setErrorMsg('');

    try {
      // Step 0 → upload
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Step 1 → OCR signal
      setStep(1);

      // Step 2 → analyze
      setStep(2);
      const response = await base44.functions.invoke('analyzeEnergyReport', {
        file_url,
        report_type: reportType,
      });

      const data = response?.data;
      if (!data?.success) throw new Error(data?.error || 'Analysis failed');

      setResult(data);
      setState('result');
      toast.success(isHe ? '✅ ניתוח AI הושלם!' : '✅ AI Analysis complete!');
    } catch (err) {
      setErrorMsg(err.message || 'Unknown error');
      setState('error');
    }
  }, [reportType, isHe]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  const reset = () => { setState('idle'); setResult(null); setFileName(''); setErrorMsg(''); setStep(0); };

  // Derived data — safe access
  const analysis = result?.analysis || {};
  const extracted = result?.extracted || analysis.extracted || {};
  const rev = analysis.revenue_analysis || {};
  const hourly = Array.isArray(analysis.hourly_loss_profile) ? analysis.hourly_loss_profile : [];
  const recs = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];
  const flags = Array.isArray(analysis.risk_flags) ? analysis.risk_flags : [];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

      {/* ── Header toggle ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl p-4 transition-all active:scale-[0.98]"
        style={{
          background: state === 'result'
            ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(124,58,237,0.08))'
            : 'rgba(124,58,237,0.07)',
          border: `1px solid ${state === 'result' ? 'rgba(16,185,129,0.35)' : 'rgba(124,58,237,0.35)'}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white">
              {isHe ? 'ביקורת פורטפוליו מיידית' : 'Instant Portfolio Audit'}
            </p>
            <p className="text-[10px] text-white/40">
              {state === 'result'
                ? (isHe ? `ניתחנו: ${fileName}` : `Analyzed: ${fileName}`)
                : (isHe ? 'העלה חשבון · AI OCR · גלה ROI שאבדת' : 'Upload bill · AI OCR · Find missing ROI')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state === 'idle' && (
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
              {isHe ? '📊 העלה דו״ח' : '📊 Upload'}
            </motion.span>
          )}
          {state === 'result' && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
              <CheckCircle2 className="w-3 h-3" />
              {isHe ? 'הושלם' : 'Done'}
            </span>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* ── IDLE: type selector + dropzone ────────────────────────── */}
              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">

                    {/* Type Pills */}
                    <div className="flex gap-2">
                      {[
                        { key: 'electricity_bill', he: '⚡ חשבון חשמל', en: '⚡ Electricity Bill' },
                        { key: 'roi_report',       he: '📈 דוח ROI',   en: '📈 ROI Report' },
                      ].map(({ key, he, en }) => (
                        <button key={key} onClick={() => setReportType(key)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                          style={{
                            background: reportType === key ? 'rgba(124,58,237,0.22)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${reportType === key ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.08)'}`,
                            color: reportType === key ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
                          }}>
                          {isHe ? he : en}
                        </button>
                      ))}
                    </div>

                    {/* Drop Zone */}
                    <motion.div
                      animate={dragOver ? { scale: 1.015 } : { scale: 1 }}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className="rounded-2xl cursor-pointer transition-colors py-10 text-center space-y-4"
                      style={{
                        background: dragOver ? 'rgba(124,58,237,0.13)' : 'rgba(124,58,237,0.04)',
                        border: `2px dashed ${dragOver ? 'rgba(167,139,250,0.8)' : 'rgba(124,58,237,0.3)'}`,
                      }}
                    >
                      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => processFile(e.target.files[0])} />

                      <motion.div
                        animate={dragOver ? { y: -4, scale: 1.1 } : { y: 0, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(124,58,237,0.16)', border: '1px solid rgba(124,58,237,0.3)' }}
                      >
                        <Upload className="w-7 h-7 text-violet-400" />
                      </motion.div>

                      <div className="space-y-1 px-4">
                        <p className="text-sm font-black text-white">
                          {isHe ? 'גרור חשבון חשמל / דוח ROI לכאן' : 'Drop your energy bill / ROI report here'}
                        </p>
                        <p className="text-[11px] text-white/35">
                          {isHe ? 'PDF · JPG · PNG — מוצפן ומאובטח לחלוטין' : 'PDF · JPG · PNG — Fully encrypted'}
                        </p>
                      </div>

                      <div className="flex justify-center gap-2">
                        {['PDF', 'JPG', 'PNG'].map(t => (
                          <span key={t} className="text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                            style={{ background: 'rgba(124,58,237,0.18)', color: '#a78bfa' }}>{t}</span>
                        ))}
                      </div>

                      <p className="text-xs font-bold text-violet-400/70">
                        {isHe ? 'או לחץ לבחירה מהמכשיר' : 'or tap to browse files'}
                      </p>
                    </motion.div>

                  </motion.div>
                )}

                {/* ── LOADING ──────────────────────────────────────────────── */}
                {state === 'loading' && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ProcessingOverlay step={step} fileName={fileName} />
                  </motion.div>
                )}

                {/* ── ERROR ────────────────────────────────────────────────── */}
                {state === 'error' && (
                  <motion.div key="error" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="rounded-2xl p-5 text-center space-y-3"
                    style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
                    <p className="text-2xl">😕</p>
                    <p className="text-sm font-black text-red-400">
                      {isHe ? 'שגיאה בניתוח הקובץ' : 'Analysis failed'}
                    </p>
                    {errorMsg && (
                      <p className="text-[10px] text-white/30 px-4 leading-relaxed">{errorMsg}</p>
                    )}
                    <button onClick={reset}
                      className="flex items-center justify-center gap-1.5 mx-auto px-4 py-2 rounded-xl text-xs font-bold text-white/70 transition-all active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      <RotateCcw className="w-3 h-3" />
                      {isHe ? 'נסה שוב' : 'Try again'}
                    </button>
                  </motion.div>
                )}

                {/* ── RESULT ───────────────────────────────────────────────── */}
                {state === 'result' && result && (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="space-y-3">

                    {/* AI Summary Banner */}
                    {analysis.summary && (
                      <div className="rounded-2xl p-4"
                        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(16,185,129,0.06))', border: '1px solid rgba(124,58,237,0.22)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <Sparkles className="w-3 h-3 text-violet-400" />
                          </div>
                          <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest">
                            {isHe ? 'סיכום AI' : 'AI Summary'}
                          </p>
                        </div>
                        <p className="text-xs text-white/80 leading-relaxed">{analysis.summary}</p>
                      </div>
                    )}

                    {/* Extracted KPIs */}
                    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="px-4 pt-3 pb-1">
                        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">
                          {isHe ? 'נתונים שחולצו מהמסמך' : 'Extracted Data'}
                        </p>
                      </div>
                      <div className="divide-y divide-white/5 px-4">
                        {[
                          { label: isHe ? 'מספר מונה' : 'Meter ID',       val: extracted.meter_id,                                         color: '#a78bfa' },
                          { label: isHe ? 'תקופת חיוב' : 'Billing Period',  val: extracted.billing_period,                                    color: '#60a5fa' },
                          { label: isHe ? 'סה"כ kWh' : 'Total kWh',        val: extracted.total_kwh ? `${fmt(extracted.total_kwh)} kWh` : null, color: '#f59e0b' },
                          { label: isHe ? 'תעריף' : 'Tariff',              val: extracted.tariff_per_kwh ? `₪${extracted.tariff_per_kwh}/kWh` : null, color: '#34d399' },
                          { label: isHe ? 'סה"כ לתשלום' : 'Total Billed',  val: extracted.total_amount_ils ? `₪${fmt(extracted.total_amount_ils)}` : null, color: '#f87171' },
                          { label: isHe ? 'ספק' : 'Provider',             val: extracted.provider,                                          color: '#94a3b8' },
                        ].filter(r => r.val).map((row, i) => (
                          <StatRow key={i} label={row.label} value={row.val} color={row.color} />
                        ))}
                      </div>
                    </div>

                    {/* Revenue Gap Card */}
                    {rev.actual_revenue_ils != null && (
                      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="grid grid-cols-2 divide-x divide-white/5">
                          <div className="p-4 text-center">
                            <p className="text-[10px] text-white/40 mb-1">{isHe ? 'הכנסה בפועל' : 'Actual Revenue'}</p>
                            <p className="text-xl font-black text-red-400">₪{fmt(rev.actual_revenue_ils)}</p>
                          </div>
                          <div className="p-4 text-center">
                            <p className="text-[10px] text-white/40 mb-1">{isHe ? 'מותאם VPP AI' : 'VPP AI Optimized'}</p>
                            <p className="text-xl font-black text-emerald-400">₪{fmt(rev.optimized_revenue_ils)}</p>
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between"
                          style={{ background: 'rgba(245,158,11,0.08)', borderTop: '1px solid rgba(245,158,11,0.2)' }}>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400">
                              {isHe ? 'ROI שאבדת' : 'Missing ROI'}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="text-lg font-black text-amber-400">+₪{fmt(rev.missing_roi_ils)}</p>
                            <p className="text-[10px] text-amber-400/60">{fmtPct(rev.missing_roi_pct)} {isHe ? 'בלתי מנוצל' : 'untapped'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hourly Loss Chart */}
                    {hourly.length > 0 && (
                      <div className="rounded-2xl p-4"
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-3 text-right">
                          {isHe ? 'אובדן ארביטראז׳ לפי שעה' : 'Arbitrage Loss by Hour'}
                        </p>
                        <ResponsiveContainer width="100%" height={90}>
                          <BarChart data={hourly} barSize={12} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
                            <XAxis dataKey="hour"
                              tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }}
                              axisLine={false} tickLine={false} />
                            <Tooltip
                              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                              contentStyle={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                              formatter={(v) => [`${Number(v).toFixed(2)} kWh`, isHe ? 'אובדן' : 'Loss']}
                            />
                            <Bar dataKey="loss_kwh" radius={[3, 3, 0, 0]}>
                              {hourly.map((entry, i) => (
                                <Cell key={i}
                                  fill={entry.loss_kwh > 3 ? '#ef4444' : entry.loss_kwh > 1.5 ? '#f59e0b' : '#10b981'}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Recommendations */}
                    {recs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-white/35 uppercase tracking-widest">
                          {isHe ? '💡 המלצות AI' : '💡 AI Recommendations'}
                        </p>
                        {recs.map((r, i) => <RecommendationCard key={i} rec={r} index={i} />)}
                      </div>
                    )}

                    {/* Risk Flags */}
                    {flags.length > 0 && (
                      <div className="rounded-2xl p-4 space-y-1.5"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <p className="text-[10px] font-black text-red-400/70 uppercase tracking-widest mb-2">
                          ⚠️ {isHe ? 'דגלים אדומים' : 'Risk Flags'}
                        </p>
                        {flags.map((f, i) => (
                          <p key={i} className="text-[11px] text-red-300/80 leading-relaxed">• {f}</p>
                        ))}
                      </div>
                    )}

                    {/* Compliance Notes */}
                    {analysis.compliance_notes && (
                      <div className="rounded-2xl p-4 flex items-start gap-3"
                        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">
                            {isHe ? 'תקנות רלוונטיות' : 'Compliance Notes'}
                          </p>
                          <p className="text-[11px] text-white/55 leading-relaxed">{analysis.compliance_notes}</p>
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <button
                      onClick={() => toast.success(isHe ? '📊 הדוח המלא ישלח לאימייל!' : '📊 Full report will be sent to your email!')}
                      className="w-full py-4 rounded-2xl font-black text-sm text-white flex flex-col items-center gap-1 active:scale-[0.97] transition-transform"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 0 28px rgba(124,58,237,0.3)' }}
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {isHe ? 'הפק דוח ארביטראז׳ מלא' : 'Generate Full Arbitrage Report'}
                      </div>
                      <span className="text-[11px] text-violet-300/60 font-normal">
                        {isHe ? 'ניתוח מלא + תכנית פעולה אישית' : 'Full analysis + personalized action plan'}
                      </span>
                    </button>

                    {/* Reset */}
                    <button onClick={reset}
                      className="w-full text-[11px] text-white/25 py-1.5 hover:text-white/50 transition-colors flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-3 h-3" />
                      {isHe ? 'העלה קובץ נוסף' : 'Analyze another file'}
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}