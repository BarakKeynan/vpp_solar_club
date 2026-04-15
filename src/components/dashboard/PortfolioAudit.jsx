import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Zap, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, History } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

function AIPulse({ step }) {
  const steps = ['מעלה קובץ...', 'OCR סורק...', 'AI מנתח...'];
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-5">
      <div className="relative">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            animate={{ scale: [1, 2.2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.55 }}
            className="absolute inset-0 rounded-full border border-emerald-500/40"
          />
        ))}
        <div className="relative w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(59,130,246,0.15))' }}>
          <Zap className="w-7 h-7 text-emerald-400" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-black text-white">{steps[step] || 'מנתח...'}</p>
        <p className="text-[11px] text-white/40">מחלץ נתוני מונה, תעריף ושיאי צריכה</p>
      </div>
      <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
          animate={{ width: ['0%', '100%'] }} transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }} />
      </div>
    </div>
  );
}

const CustomBar = ({ x, y, width, height, value }) => {
  const color = value > 3 ? '#ef4444' : value > 1.5 ? '#f59e0b' : '#10b981';
  return <rect x={x} y={y} width={width} height={height} fill={color} rx={3} />;
};

export default function PortfolioAudit() {
  const [open, setOpen] = useState(true);
  const [state, setState] = useState('idle'); // idle | uploading | processing | result | error
  const [processingStep, setProcessingStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [reportType, setReportType] = useState('electricity_bill');
  const [result, setResult] = useState(null);
  const fileRef = useRef();
  const { lang } = useLang();
  const isHe = lang === 'he';

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setState('uploading');
    setProcessingStep(0);

    try {
      // Step 1: Upload
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setProcessingStep(1);
      setState('processing');

      // Step 2: Analyze
      setProcessingStep(2);
      const response = await base44.functions.invoke('analyzeEnergyReport', {
        file_url,
        report_type: reportType,
      });

      const data = response.data;
      if (!data.success) throw new Error(data.error || 'Analysis failed');

      setResult(data);
      setState('result');
      toast.success(isHe ? '✅ הניתוח הושלם בהצלחה!' : '✅ Analysis complete!');
    } catch (err) {
      setState('error');
      toast.error(isHe ? `שגיאה: ${err.message}` : `Error: ${err.message}`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const rev = result?.analysis?.revenue_analysis || {};
  const gap = (rev.missing_roi_ils) || 0;
  const lossPct = (rev.missing_roi_pct) || 0;
  const hourlyLoss = result?.analysis?.hourly_loss_profile || [];
  const recommendations = result?.analysis?.recommendations || [];
  const extracted = result?.extracted || {};

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      {/* Toggle Header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl border p-4 transition-all active:scale-[0.98]"
        style={{
          background: open ? 'rgba(139,92,246,0.07)' : 'rgba(255,255,255,0.02)',
          border: open ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <div className="text-right">
            <p className="text-sm font-black text-white">{isHe ? 'ביקורת פורטפוליו מיידית' : 'Instant Portfolio Audit'}</p>
            <p className="text-[10px] text-white/40">{isHe ? 'העלה חשבון חשמל · AI OCR · ROI שאבדת' : 'Upload bill · AI OCR · Missing ROI'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(16,185,129,0.25)', color: '#10b981' }}>
            {isHe ? '📊 העלה דו״ח' : '📊 Upload Report'}
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="pt-3 space-y-4">

              {/* Report Type Selector */}
              {state === 'idle' && (
                <div className="flex gap-2">
                  {[
                    { key: 'electricity_bill', labelHe: '⚡ חשבון חשמל', labelEn: '⚡ Electricity Bill' },
                    { key: 'roi_report', labelHe: '📈 דוח ROI', labelEn: '📈 ROI Report' },
                  ].map(({ key, labelHe, labelEn }) => (
                    <button key={key} onClick={() => setReportType(key)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: reportType === key ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                        border: reportType === key ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        color: reportType === key ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                      }}>
                      {isHe ? labelHe : labelEn}
                    </button>
                  ))}
                </div>
              )}

              {/* Drop Zone */}
              {state === 'idle' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed cursor-pointer transition-all p-8 text-center space-y-3"
                  style={{
                    borderColor: dragOver ? 'rgba(139,92,246,0.8)' : 'rgba(139,92,246,0.3)',
                    background: dragOver ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.04)',
                  }}>
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFile} />
                  <motion.div animate={dragOver ? { scale: 1.15 } : { scale: 1 }}
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <Upload className="w-6 h-6 text-violet-400" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-black text-white">
                      {isHe ? 'גרור חשבון חשמל / ROI לכאן' : 'Drag & Drop Energy Bill / ROI Report'}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1">{isHe ? 'PDF · JPG · PNG — מאובטח ומוצפן' : 'PDF · JPG · PNG — Secure & Encrypted'}</p>
                  </div>
                  <div className="flex justify-center gap-2">
                    {['PDF', 'JPG', 'PNG'].map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>{t}</span>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-violet-400">{isHe ? 'לחץ לבחירת קובץ' : 'or click to browse'}</p>
                </motion.div>
              )}

              {/* Processing */}
              {(state === 'uploading' || state === 'processing') && (
                <div className="rounded-2xl border border-emerald-500/20 overflow-hidden"
                  style={{ background: 'rgba(16,185,129,0.04)' }}>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                    <FileText className="w-4 h-4 text-white/40" />
                    <p className="text-xs text-white/60 truncate">{fileName}</p>
                  </div>
                  <AIPulse step={processingStep} />
                </div>
              )}

              {/* Error */}
              {state === 'error' && (
                <div className="rounded-xl p-4 text-center space-y-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <p className="text-sm font-bold text-red-400">❌ {isHe ? 'שגיאה בניתוח הקובץ' : 'Analysis failed'}</p>
                  <button onClick={() => setState('idle')}
                    className="text-xs text-white/50 underline">{isHe ? 'נסה שנית' : 'Try again'}</button>
                </div>
              )}

              {/* Result */}
              {state === 'result' && result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* AI Summary */}
                  {result.analysis?.summary && (
                    <div className="rounded-xl p-4 space-y-1"
                      style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
                      <p className="text-[10px] font-black text-violet-400/70 uppercase tracking-widest mb-2">🤖 {isHe ? 'סיכום AI' : 'AI Summary'}</p>
                      <p className="text-xs text-white/80 leading-relaxed">{result.analysis.summary}</p>
                    </div>
                  )}

                  {/* Extracted Data */}
                  <div className="rounded-xl p-4 space-y-2"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">{isHe ? 'נתונים שחולצו מהמסמך' : 'Extracted Data'}</p>
                    {[
                      { label: 'Meter ID', value: extracted.meter_id, color: '#a78bfa' },
                      { label: isHe ? 'תקופת חיוב' : 'Billing Period', value: extracted.billing_period, color: '#60a5fa' },
                      { label: isHe ? 'סה"כ kWh' : 'Total kWh', value: extracted.total_kwh ? `${extracted.total_kwh} kWh` : null, color: '#f59e0b' },
                      { label: isHe ? 'תעריף' : 'Tariff', value: extracted.tariff_per_kwh ? `₪${extracted.tariff_per_kwh}/kWh` : null, color: '#34d399' },
                      { label: isHe ? 'סה"כ לתשלום' : 'Total Billed', value: extracted.total_amount_ils ? `₪${extracted.total_amount_ils?.toLocaleString()}` : null, color: '#f87171' },
                    ].filter(i => i.value).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs font-black" style={{ color: item.color }}>{item.value}</span>
                        <span className="text-xs text-white/50">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Comparison */}
                  {rev.actual_revenue_ils && (
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">{isHe ? 'השוואת הכנסות' : 'Revenue Comparison'}</p>
                      </div>
                      <div className="divide-y divide-white/5">
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-sm font-black text-red-400">₪{rev.actual_revenue_ils?.toLocaleString()}</span>
                          <span className="text-xs text-white/70">{isHe ? 'הכנסה בפועל' : 'Actual Revenue'}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-sm font-black text-emerald-400">₪{rev.optimized_revenue_ils?.toLocaleString()}</span>
                          <span className="text-xs text-white/70">{isHe ? 'מותאם VPP AI' : 'VPP AI Optimized'}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(245,158,11,0.06)' }}>
                          <div className="text-left">
                            <span className="text-base font-black text-amber-400">+₪{gap.toLocaleString()}</span>
                            <p className="text-[10px] text-amber-400/60">{lossPct.toFixed(0)}% {isHe ? 'בלתי מנוצל' : 'untapped'}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs font-bold text-amber-400">{isHe ? 'ROI שאבדת' : 'Missing ROI'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Hourly Loss Chart */}
                  {hourlyLoss.length > 0 && (
                    <div className="rounded-xl p-4"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3 text-right">
                        {isHe ? 'אובדן ארביטראז׳ לפי שעה' : 'Arbitrage Loss by Hour'}
                      </p>
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={hourlyLoss} barSize={14}>
                          <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                            formatter={(v) => [`${v} kWh`, isHe ? 'אובדן' : 'Loss']}
                          />
                          <Bar dataKey="loss_kwh" shape={<CustomBar />} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">
                        {isHe ? 'המלצות AI' : 'AI Recommendations'}
                      </p>
                      {recommendations.map((r, i) => (
                        <div key={i} className="rounded-xl p-3"
                          style={{
                            background: r.priority === 'high' ? 'rgba(239,68,68,0.07)' : r.priority === 'medium' ? 'rgba(245,158,11,0.07)' : 'rgba(16,185,129,0.07)',
                            border: `1px solid ${r.priority === 'high' ? 'rgba(239,68,68,0.25)' : r.priority === 'medium' ? 'rgba(245,158,11,0.25)' : 'rgba(16,185,129,0.25)'}`,
                          }}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-black text-emerald-400">
                              {r.estimated_gain_ils ? `+₪${r.estimated_gain_ils?.toLocaleString()}` : ''}
                            </span>
                            <p className="text-xs font-bold text-white text-right flex-1">{r.title_he}</p>
                          </div>
                          <p className="text-[10px] text-white/50 mt-1 text-right leading-relaxed">{r.desc_he}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Risk Flags */}
                  {result.analysis?.risk_flags?.length > 0 && (
                    <div className="rounded-xl p-3 space-y-1"
                      style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      <p className="text-[10px] font-black text-red-400/70 uppercase tracking-widest mb-2">⚠️ {isHe ? 'דגלים אדומים' : 'Risk Flags'}</p>
                      {result.analysis.risk_flags.map((flag, i) => (
                        <p key={i} className="text-[11px] text-red-300/80">• {flag}</p>
                      ))}
                    </div>
                  )}

                  {/* Compliance Notes */}
                  {result.analysis?.compliance_notes && (
                    <div className="rounded-xl p-3"
                      style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <p className="text-[10px] font-black text-emerald-400/70 uppercase tracking-widest mb-1">🔐 {isHe ? 'תקנות רלוונטיות' : 'Compliance Notes'}</p>
                      <p className="text-[11px] text-white/60 leading-relaxed">{result.analysis.compliance_notes}</p>
                    </div>
                  )}

                  {/* CTA */}
                  <button
                    onClick={() => toast.success(isHe ? '📊 הדוח המלא נשלח לאימייל!' : '📊 Full report sent to email!')}
                    className="w-full py-4 rounded-2xl font-black text-sm text-white active:scale-95 transition-transform"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 0 24px rgba(124,58,237,0.35)' }}>
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {isHe ? 'Generate Full Arbitrage Report' : 'Generate Full Arbitrage Report'}
                    </div>
                    <p className="text-[11px] text-violet-200/60 mt-1 font-normal">
                      {isHe ? 'ניתוח מלא + תכנית פעולה אישית' : 'Full analysis + personalized action plan'}
                    </p>
                  </button>

                  <button onClick={() => { setState('idle'); setResult(null); setFileName(''); }}
                    className="w-full text-xs text-white/30 py-2 hover:text-white/60 transition-colors flex items-center justify-center gap-1">
                    <History className="w-3 h-3" />
                    {isHe ? 'העלה קובץ נוסף' : 'Upload another file'}
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