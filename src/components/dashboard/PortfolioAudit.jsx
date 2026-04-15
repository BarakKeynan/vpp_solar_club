import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, Zap, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, RotateCcw, ShieldCheck, Sparkles,
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// ─── Processing steps ───────────────────────────────────────────────────────
const STEPS = [
  { icon: '📂', labelHe: 'מעלה קובץ...',    labelEn: 'Uploading file...' },
  { icon: '🔍', labelHe: 'OCR סורק...',      labelEn: 'Scanning document...' },
  { icon: '🤖', labelHe: 'AI מנתח נתונים...', labelEn: 'AI analyzing data...' },
  { icon: '💾', labelHe: 'שומר תוצאות...',   labelEn: 'Saving results...' },
];

function ProcessingView({ step, fileName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.18)' }}
    >
      {/* File name banner */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
        <FileText className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <p className="text-[11px] text-white/50 truncate">{fileName}</p>
      </div>

      {/* Pulse orb */}
      <div className="flex flex-col items-center py-8 gap-5">
        <div className="relative flex items-center justify-center">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="absolute rounded-full border border-emerald-400/30"
              animate={{ scale: [1, 2.4 + i * 0.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
              style={{ width: 48, height: 48 }}
            />
          ))}
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.25),rgba(59,130,246,0.2))' }}>
            {STEPS[step]?.icon || '⚡'}
          </div>
        </div>

        {/* Step labels */}
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-white">
            {STEPS[step]?.labelHe || 'מעבד...'}
          </p>
          <p className="text-[10px] text-white/35">שלב {step + 1} מתוך {STEPS.length}</p>
        </div>

        {/* Segmented progress */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <motion.div key={i}
              className="h-1 rounded-full"
              style={{ width: 28 }}
              animate={{
                background: i < step
                  ? 'rgba(16,185,129,1)'
                  : i === step
                    ? undefined
                    : 'rgba(255,255,255,0.1)',
              }}
            >
              {i === step && (
                <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1, repeat: Infinity }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ label, value, color }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-xs font-bold" style={{ color }}>{value}</span>
      <span className="text-[11px] text-white/45">{label}</span>
    </div>
  );
}

// ─── Recharts custom bar (fix: use fill prop correctly) ──────────────────────
function ArbitrageBar(props) {
  const { x, y, width, height, loss_kwh } = props;
  const color = loss_kwh > 3 ? '#ef4444' : loss_kwh > 1.5 ? '#f59e0b' : '#10b981';
  return <rect x={x} y={y} width={width} height={Math.max(height, 2)} fill={color} rx={3} />;
}

// ─── Priority badge ──────────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  high:   { bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.3)',   dot: '#ef4444', label: 'גבוהה' },
  medium: { bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)',  dot: '#f59e0b', label: 'בינונית' },
  low:    { bg: 'rgba(16,185,129,0.10)',  border: 'rgba(16,185,129,0.25)', dot: '#10b981', label: 'נמוכה' },
};

// ─── Main component ──────────────────────────────────────────────────────────
export default function PortfolioAudit() {
  const [open, setOpen]           = useState(true);
  const [state, setState]         = useState('idle'); // idle | loading | result | error
  const [step, setStep]           = useState(0);
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState('');
  const [fileSize, setFileSize]   = useState('');
  const [reportType, setReportType] = useState('electricity_bill');
  const [result, setResult]       = useState(null);
  const [errorMsg, setErrorMsg]   = useState('');
  const fileRef = useRef();
  const { lang } = useLang();
  const isHe = lang === 'he';

  const fmtSize = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const processFile = useCallback(async (file) => {
    if (!file) return;

    // Client-side validation
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error(isHe ? 'סוג קובץ לא נתמך. השתמש ב-PDF, JPG או PNG' : 'Unsupported file type. Use PDF, JPG or PNG.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      toast.error(isHe ? 'הקובץ גדול מדי (מקסימום 15MB)' : 'File too large (max 15MB)');
      return;
    }

    setFileName(file.name);
    setFileSize(fmtSize(file.size));
    setState('loading');
    setStep(0);
    setErrorMsg('');

    try {
      // Step 0 — Upload
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setStep(1);

      // Step 1–3 — Analyze (OCR + AI + save)
      const response = await base44.functions.invoke('analyzeEnergyReport', {
        file_url,
        report_type: reportType,
      });
      setStep(2);

      const data = response?.data;
      if (!data?.success) throw new Error(data?.error || 'ניתוח נכשל');

      setStep(3);
      // Small pause so user sees "Saving" step
      await new Promise(r => setTimeout(r, 600));

      setResult(data);
      setState('result');
      toast.success(isHe ? '✅ הניתוח הושלם — נמצאו הזדמנויות!' : '✅ Analysis complete!');
    } catch (err) {
      setErrorMsg(err.message);
      setState('error');
      toast.error(isHe ? `שגיאה: ${err.message}` : `Error: ${err.message}`);
    }
  }, [reportType, isHe]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  }, [processFile]);

  const handleFileInput = (e) => processFile(e.target.files[0]);
  const reset = () => { setState('idle'); setResult(null); setFileName(''); setFileSize(''); setErrorMsg(''); };

  // Safe derived values
  const analysis       = result?.analysis || {};
  const extracted      = result?.extracted || {};
  const rev            = analysis.revenue_analysis || {};
  const gap            = typeof rev.missing_roi_ils === 'number' ? rev.missing_roi_ils : 0;
  const lossPct        = typeof rev.missing_roi_pct === 'number' ? rev.missing_roi_pct : 0;
  const hourly         = Array.isArray(analysis.hourly_loss_profile) ? analysis.hourly_loss_profile : [];
  const monthlyTrend   = Array.isArray(analysis.monthly_trend)       ? analysis.monthly_trend       : [];
  const recs           = Array.isArray(analysis.recommendations)     ? analysis.recommendations     : [];
  const risks          = Array.isArray(analysis.risk_flags)          ? analysis.risk_flags           : [];
  const period         = analysis.analysis_period || {};
  const profileInsight = analysis.profile_insights || {};
  const roiSummary     = analysis.roi_summary || {};

  const PROFILE_LABELS = {
    private_residential: { emoji: '🏠', he: 'פרטי / מגורים',    en: 'Residential' },
    kibbutz_community:   { emoji: '🌾', he: 'קיבוץ / קהילה',    en: 'Kibbutz/Community' },
    solar_farm:          { emoji: '☀️', he: 'חווה סולארית',      en: 'Solar Farm' },
    investor:            { emoji: '📊', he: 'משקיע',              en: 'Investor' },
  };
  const profileLabel = PROFILE_LABELS[analysis.user_profile] || { emoji: '⚡', he: 'כללי', en: 'General' };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>

      {/* ── Header toggle ─────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
        style={{
          background: open
            ? 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(79,70,229,0.08))'
            : 'rgba(255,255,255,0.02)',
          border: `1px solid ${open ? 'rgba(124,58,237,0.45)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: open ? '0 0 28px rgba(124,58,237,0.15)' : 'none',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-xl"
              style={{ background: 'rgba(124,58,237,0.3)', filter: 'blur(6px)' }}
            />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.4)' }}>
              <Sparkles className="w-4 h-4 text-violet-400" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white leading-tight">
              {isHe ? 'ביקורת פורטפוליו AI' : 'AI Portfolio Audit'}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">
              {isHe ? 'העלה חשבון · OCR · ROI שאבדת' : 'Upload bill · OCR · Missing ROI'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {state === 'result' && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
              ✓ {isHe ? 'הושלם' : 'Done'}
            </span>
          )}
          {state === 'idle' && (
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.18)', color: '#10b981' }}>
              📊 {isHe ? 'העלה עכשיו' : 'Upload now'}
            </motion.span>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-white/30" />
            : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* ── IDLE: type selector + drop zone ─────────────────────── */}
              {state === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  {/* Type selector */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'electricity_bill', emoji: '⚡', labelHe: 'חשבון חשמל', labelEn: 'Electricity Bill' },
                      { key: 'roi_report',       emoji: '📈', labelHe: 'דוח ROI',    labelEn: 'ROI Report' },
                    ].map(({ key, emoji, labelHe, labelEn }) => {
                      const active = reportType === key;
                      return (
                        <button key={key} onClick={() => setReportType(key)}
                          className="py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95"
                          style={{
                            background: active ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.07)'}`,
                            color: active ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
                          }}>
                          {emoji} {isHe ? labelHe : labelEn}
                        </button>
                      );
                    })}
                  </div>

                  {/* Drop zone */}
                  <motion.div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                    animate={{ scale: dragOver ? 1.02 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="rounded-2xl border-2 border-dashed cursor-pointer p-7 text-center space-y-3 select-none"
                    style={{
                      borderColor: dragOver ? 'rgba(124,58,237,0.9)' : 'rgba(124,58,237,0.3)',
                      background:  dragOver
                        ? 'rgba(124,58,237,0.12)'
                        : 'linear-gradient(135deg,rgba(124,58,237,0.05),rgba(79,70,229,0.03))',
                    }}
                  >
                    <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFileInput} />

                    <motion.div
                      animate={dragOver ? { rotate: -8, scale: 1.15 } : { rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(124,58,237,0.18)', border: '1px solid rgba(124,58,237,0.35)' }}
                    >
                      <Upload className="w-6 h-6 text-violet-400" />
                    </motion.div>

                    <div>
                      <p className="text-sm font-black text-white">
                        {dragOver
                          ? (isHe ? 'שחרר כאן!' : 'Drop it!')
                          : (isHe ? 'גרור קובץ לכאן' : 'Drag & Drop here')}
                      </p>
                      <p className="text-[11px] text-white/35 mt-1">
                        {isHe ? 'PDF · JPG · PNG · עד 15MB' : 'PDF · JPG · PNG · up to 15MB'}
                      </p>
                    </div>

                    <div className="flex justify-center gap-2">
                      {['PDF', 'JPG', 'PNG'].map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                          style={{ background: 'rgba(124,58,237,0.18)', color: '#a78bfa' }}>{t}</span>
                      ))}
                    </div>

                    <p className="text-xs font-bold text-violet-400">
                      {isHe ? '← לחץ לבחירת קובץ' : 'or click to browse →'}
                    </p>
                  </motion.div>

                  {/* Trust strip */}
                  <div className="flex items-center justify-center gap-4">
                    {[
                      { icon: '🔒', text: isHe ? 'מוצפן AES-256' : 'AES-256 encrypted' },
                      { icon: '🗑️', text: isHe ? 'נמחק לאחר ניתוח' : 'Deleted after analysis' },
                      { icon: '⚡', text: isHe ? 'ניתוח תוך 20 שניות' : '~20 sec analysis' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-[10px]">{item.icon}</span>
                        <span className="text-[10px] text-white/30">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── LOADING ──────────────────────────────────────────────── */}
              {state === 'loading' && (
                <ProcessingView step={step} fileName={`${fileName} · ${fileSize}`} />
              )}

              {/* ── ERROR ────────────────────────────────────────────────── */}
              {state === 'error' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-2xl p-5 text-center space-y-4"
                  style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <div className="text-3xl">❌</div>
                  <div>
                    <p className="text-sm font-bold text-red-400 mb-1">
                      {isHe ? 'שגיאה בניתוח' : 'Analysis Failed'}
                    </p>
                    <p className="text-[11px] text-red-300/60 leading-relaxed">{errorMsg}</p>
                  </div>
                  <button onClick={reset}
                    className="flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-xs font-bold text-white/70 hover:text-white transition-colors"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <RotateCcw className="w-3 h-3" />
                    {isHe ? 'נסה שנית' : 'Try again'}
                  </button>
                </motion.div>
              )}

              {/* ── RESULT ───────────────────────────────────────────────── */}
              {state === 'result' && result && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

                  {/* Profile + Period banner */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
                      <p className="text-lg">{profileLabel.emoji}</p>
                      <p className="text-[10px] font-black text-violet-300 mt-0.5">{isHe ? profileLabel.he : profileLabel.en}</p>
                      <p className="text-[9px] text-white/30">{isHe ? 'פרופיל משתמש' : 'User Profile'}</p>
                    </div>
                    <div className="rounded-xl p-3 text-center"
                      style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
                      <p className="text-[11px] font-black text-blue-300">{period.detected_period || '—'}</p>
                      <p className="text-[9px] text-white/30 mt-0.5">{isHe ? 'תקופת ניתוח' : 'Analysis Period'}</p>
                      {period.months_count > 1 && (
                        <p className="text-[9px] font-bold text-blue-400 mt-1">
                          {period.months_count === 3 ? (isHe ? '📅 רבעוני' : '📅 Quarterly') :
                           period.months_count === 12 ? (isHe ? '📅 שנתי' : '📅 Annual') :
                           `${period.months_count} ${isHe ? 'חודשים' : 'months'}`}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* AI Summary */}
                  {analysis.summary && (
                    <div className="rounded-2xl p-4"
                      style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(79,70,229,0.07))', border: '1px solid rgba(124,58,237,0.25)' }}>
                      <p className="text-[10px] font-black text-violet-400/60 uppercase tracking-widest mb-2">
                        🤖 {isHe ? 'סיכום AI' : 'AI Summary'}
                      </p>
                      <p className="text-xs text-white/80 leading-relaxed">{analysis.summary}</p>
                    </div>
                  )}

                  {/* Extracted stats */}
                  <div className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-3">
                      {isHe ? 'נתונים שחולצו' : 'Extracted Data'}
                    </p>
                    <StatPill label="Meter ID"                                                              value={extracted.meter_id}                                                                   color="#a78bfa" />
                    <StatPill label={isHe ? 'תקופת חיוב' : 'Billing Period'}                               value={extracted.billing_period}                                                             color="#60a5fa" />
                    <StatPill label={isHe ? 'סה"כ צריכה' : 'Total Usage'}                                  value={extracted.total_kwh       ? `${extracted.total_kwh} kWh`                    : null}  color="#f59e0b" />
                    <StatPill label={isHe ? 'שיא / שפל' : 'Peak / Off-Peak'}                               value={(extracted.peak_kwh && extracted.off_peak_kwh) ? `${extracted.peak_kwh} / ${extracted.off_peak_kwh} kWh` : null} color="#f59e0b" />
                    <StatPill label={isHe ? 'תעריף ממוצע' : 'Avg Tariff'}                                  value={extracted.tariff_per_kwh  ? `₪${extracted.tariff_per_kwh}/kWh`               : null}  color="#34d399" />
                    <StatPill label={isHe ? 'סה"כ חשבון' : 'Total Billed'}                                 value={extracted.total_amount_ils ? `₪${Number(extracted.total_amount_ils).toLocaleString()}` : null} color="#f87171" />
                    <StatPill label={isHe ? 'ספק' : 'Provider'}                                            value={extracted.provider}                                                                   color="#94a3b8" />
                    <StatPill label={isHe ? 'הספק מערכת' : 'System Capacity'}                              value={extracted.system_capacity_kw ? `${extracted.system_capacity_kw} kWp`           : null}  color="#a78bfa" />
                    <StatPill label={isHe ? 'ייצור שנתי' : 'Annual Yield'}                                 value={extracted.annual_yield_kwh   ? `${extracted.annual_yield_kwh} kWh`             : null}  color="#34d399" />
                    <StatPill label={isHe ? 'חיוב דמנד' : 'Demand Charge'}                                 value={extracted.demand_charge_ils  ? `₪${extracted.demand_charge_ils}`               : null}  color="#f87171" />
                    {extracted.co2_saved_kg > 0 && (
                      <StatPill label={isHe ? '🌱 CO₂ שנחסך' : '🌱 CO₂ Saved'}
                        value={`${Number(extracted.co2_saved_kg).toLocaleString()} kg`} color="#10b981" />
                    )}
                  </div>

                  {/* Period projections */}
                  {(rev.monthly_avg_ils || rev.quarterly_projection_ils || rev.annual_projection_ils || period.annualized_cost_ils) && (
                    <div className="rounded-2xl p-4"
                      style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                      <p className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest mb-3">
                        📅 {isHe ? 'תחזית לתקופות' : 'Period Projections'}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {rev.monthly_avg_ils > 0 && (
                          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-sm font-black text-blue-300">₪{Number(rev.monthly_avg_ils).toLocaleString()}</p>
                            <p className="text-[9px] text-white/35">{isHe ? 'ממוצע חודשי' : 'Monthly avg'}</p>
                          </div>
                        )}
                        {rev.quarterly_projection_ils > 0 && (
                          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-sm font-black text-violet-300">₪{Number(rev.quarterly_projection_ils).toLocaleString()}</p>
                            <p className="text-[9px] text-white/35">{isHe ? 'רבעוני' : 'Quarterly'}</p>
                          </div>
                        )}
                        {rev.annual_projection_ils > 0 && (
                          <div className="rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-sm font-black text-emerald-300">₪{Number(rev.annual_projection_ils).toLocaleString()}</p>
                            <p className="text-[9px] text-white/35">{isHe ? 'שנתי' : 'Annual'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Revenue comparison */}
                  {rev.actual_revenue_ils > 0 && (
                    <div className="rounded-2xl overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <span className="text-[10px] font-black text-white/35 uppercase tracking-widest">
                          {isHe ? 'השוואת הכנסות' : 'Revenue Comparison'}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-base font-black text-red-400">₪{Number(rev.actual_revenue_ils).toLocaleString()}</span>
                          <span className="text-xs text-white/50">{isHe ? 'הכנסה בפועל' : 'Actual'}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.04]">
                          <span className="text-base font-black text-emerald-400">₪{Number(rev.optimized_revenue_ils).toLocaleString()}</span>
                          <span className="text-xs text-white/50">{isHe ? 'מותאם VPP AI' : 'VPP AI Optimized'}</span>
                        </div>
                        <div className="mx-3 mb-3 mt-1 rounded-xl px-4 py-3 flex items-center justify-between"
                          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                          <div>
                            <p className="text-xl font-black text-amber-400">+₪{Number(gap).toLocaleString()}</p>
                            <p className="text-[10px] text-amber-400/60 mt-0.5">{lossPct.toFixed(0)}% {isHe ? 'פוטנציאל בלתי מנוצל' : 'untapped potential'}</p>
                          </div>
                          <div className="text-right">
                            <AlertTriangle className="w-5 h-5 text-amber-400 ml-auto" />
                            <p className="text-[10px] text-amber-400 font-bold mt-1">{isHe ? 'ROI שאבדת' : 'Missing ROI'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Profile-specific insights */}
                  {profileInsight.insights_he?.length > 0 && (
                    <div className="rounded-2xl p-4 space-y-2"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <p className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest">
                        {profileLabel.emoji} {isHe ? (profileInsight.title_he || 'תובנות אישיות') : 'Profile Insights'}
                      </p>
                      {profileInsight.main_opportunity_he && (
                        <p className="text-xs font-bold text-emerald-300 text-right">{profileInsight.main_opportunity_he}</p>
                      )}
                      <div className="space-y-1.5 mt-1">
                        {profileInsight.insights_he.map((ins, i) => (
                          <p key={i} className="text-[11px] text-white/60 text-right leading-relaxed">• {ins}</p>
                        ))}
                      </div>
                      {profileInsight.benchmark_comparison_he && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <p className="text-[10px] text-white/35 text-right">📊 {profileInsight.benchmark_comparison_he}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ROI / Investment summary */}
                  {(roiSummary.irr_percent || roiSummary.payback_years || roiSummary.npv_ils) && (
                    <div className="rounded-2xl p-4"
                      style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <p className="text-[10px] font-black text-amber-400/70 uppercase tracking-widest mb-3">
                        📈 {isHe ? 'סיכום ROI' : 'Investment Summary'}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {roiSummary.irr_percent > 0 && (
                          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-base font-black text-amber-300">{roiSummary.irr_percent}%</p>
                            <p className="text-[9px] text-white/35">IRR</p>
                          </div>
                        )}
                        {roiSummary.payback_years > 0 && (
                          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-base font-black text-amber-300">{roiSummary.payback_years} {isHe ? 'שנים' : 'yrs'}</p>
                            <p className="text-[9px] text-white/35">{isHe ? 'החזר השקעה' : 'Payback'}</p>
                          </div>
                        )}
                        {roiSummary.npv_ils > 0 && (
                          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-base font-black text-emerald-300">₪{Number(roiSummary.npv_ils).toLocaleString()}</p>
                            <p className="text-[9px] text-white/35">NPV</p>
                          </div>
                        )}
                        {roiSummary.co2_saved_annual_kg > 0 && (
                          <div className="rounded-lg p-2.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <p className="text-base font-black text-green-300">{Number(roiSummary.co2_saved_annual_kg).toLocaleString()}</p>
                            <p className="text-[9px] text-white/35">kg CO₂/yr</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Hourly loss chart */}
                  {hourly.length > 0 && (
                    <div className="rounded-2xl p-4"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-3 text-right">
                        {isHe ? 'אובדן ארביטראז׳ לפי שעה' : 'Arbitrage Loss by Hour'}
                      </p>
                      <ResponsiveContainer width="100%" height={96}>
                        <BarChart data={hourly} barSize={16} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                          <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            contentStyle={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                            formatter={(v) => [`${v} kWh`, isHe ? 'אובדן' : 'Loss']} />
                          <Bar dataKey="loss_kwh" shape={<ArbitrageBar />} radius={[3, 3, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Monthly trend chart */}
                  {monthlyTrend.length > 1 && (
                    <div className="rounded-2xl p-4"
                      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest mb-3 text-right">
                        {isHe ? 'מגמה חודשית — kWh vs ₪' : 'Monthly Trend — kWh vs ₪'}
                      </p>
                      <ResponsiveContainer width="100%" height={96}>
                        <BarChart data={monthlyTrend} barSize={14} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                          <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            contentStyle={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                            formatter={(v, name) => [name === 'ils' ? `₪${v}` : `${v} kWh`, name === 'ils' ? '₪' : 'kWh']} />
                          <Bar dataKey="kwh" fill="#3b82f6" radius={[3, 3, 0, 0]} opacity={0.7} />
                          <Bar dataKey="ils" fill="#10b981" radius={[3, 3, 0, 0]} opacity={0.7} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Recommendations */}
                  {recs.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/35 uppercase tracking-widest px-1">
                        {isHe ? 'המלצות AI' : 'AI Recommendations'}
                      </p>
                      {recs.map((r, i) => {
                        const s = PRIORITY_STYLE[r.priority] || PRIORITY_STYLE.low;
                        return (
                          <motion.div key={i}
                            initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="rounded-xl p-3.5"
                            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                                <span className="text-[10px] text-white/40">{s.label}</span>
                                {r.timeline_he && <span className="text-[9px] text-white/25">· {r.timeline_he}</span>}
                              </div>
                              {r.estimated_gain_ils > 0 && (
                                <span className="text-xs font-black text-emerald-400">+₪{Number(r.estimated_gain_ils).toLocaleString()}</span>
                              )}
                            </div>
                            <p className="text-xs font-bold text-white text-right leading-snug">{r.title_he}</p>
                            <p className="text-[10px] text-white/45 mt-1 text-right leading-relaxed">{r.desc_he}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Risk Flags */}
                  {risks.length > 0 && (
                    <div className="rounded-xl p-3.5"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p className="text-[10px] font-black text-red-400/60 uppercase tracking-widest mb-2">
                        ⚠️ {isHe ? 'ממצאי סיכון' : 'Risk Flags'}
                      </p>
                      <div className="space-y-1">
                        {risks.map((flag, i) => (
                          <p key={i} className="text-[11px] text-red-300/70 leading-relaxed">• {flag}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Compliance */}
                  {analysis.compliance_notes && (
                    <div className="rounded-xl p-3.5 flex gap-3"
                      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)' }}>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] text-white/55 leading-relaxed">{analysis.compliance_notes}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toast.success(isHe ? '📊 הדוח המלא יישלח לאימייל בקרוב!' : '📊 Full report coming to your email!')}
                    className="w-full py-4 rounded-2xl font-black text-sm text-white"
                    style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isHe ? 'צור דוח ארביטראז׳ מלא' : 'Generate Full Arbitrage Report'}
                    </div>
                    <p className="text-[11px] text-violet-200/50 mt-1 font-normal">
                      {isHe ? 'תכנית פעולה אישית + תחזית הכנסות' : 'Personal action plan + revenue forecast'}
                    </p>
                  </motion.button>

                  <button onClick={reset}
                    className="w-full py-2 text-xs text-white/25 hover:text-white/50 transition-colors flex items-center justify-center gap-1.5">
                    <RotateCcw className="w-3 h-3" />
                    {isHe ? 'נתח קובץ נוסף' : 'Analyze another file'}
                  </button>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}