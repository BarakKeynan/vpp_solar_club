import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Zap, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const lossData = [
  { hour: '06', loss: 0.2 }, { hour: '08', loss: 0.8 }, { hour: '10', loss: 1.4 },
  { hour: '12', loss: 3.1 }, { hour: '14', loss: 2.6 }, { hour: '16', loss: 1.9 },
  { hour: '18', loss: 4.2 }, { hour: '20', loss: 3.8 }, { hour: '22', loss: 1.1 },
];

const mockResult = {
  meterId: 'IL-32-0041-8821',
  peakConsumption: '14.8 kWh',
  currentTariff: '₪0.61/kWh',
  actualRevenue: 1240,
  optimizedRevenue: 2180,
  lossPct: 43,
};

function AIPulse() {
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
        <p className="text-sm font-black text-white">OCR Scanning...</p>
        <p className="text-[11px] text-white/40">מחלץ נתוני מונה, תעריף ושיאי צריכה</p>
      </div>
      <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
          animate={{ width: ['0%', '100%'] }} transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {['Meter ID', 'Peak Load', 'Tariff'].map((s, i) => (
          <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.5 }}
            className="rounded-xl px-3 py-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-[9px] text-emerald-400/60 uppercase tracking-wide">{s}</p>
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}>
              <p className="text-xs font-bold text-emerald-400">---</p>
            </motion.div>
          </motion.div>
        ))}
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
  const [state, setState] = useState('idle'); // idle | processing | result
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileRef = useRef();
  const { lang } = useLang();
  const isHe = lang === 'he';

  const processFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setState('processing');
    // Simulate OCR + AI analysis
    await new Promise(r => setTimeout(r, 3000));
    setState('result');
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

  const gap = mockResult.optimizedRevenue - mockResult.actualRevenue;

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
                      {isHe ? 'גרור חשבון חשמל לכאן' : 'Drag & Drop Energy Bill'}
                    </p>
                    <p className="text-[11px] text-white/40 mt-1">{isHe ? 'PDF · JPG · PNG — חינם, מאובטח' : 'PDF · JPG · PNG — Free, Secure'}</p>
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
              {state === 'processing' && (
                <div className="rounded-2xl border border-emerald-500/20 overflow-hidden"
                  style={{ background: 'rgba(16,185,129,0.04)' }}>
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                    <FileText className="w-4 h-4 text-white/40" />
                    <p className="text-xs text-white/60 truncate">{fileName}</p>
                  </div>
                  <AIPulse />
                </div>
              )}

              {/* Result */}
              {state === 'result' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                  {/* Extracted Data */}
                  <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">{isHe ? 'נתונים שחולצו' : 'Extracted Data'}</p>
                    {[
                      { label: 'Meter ID', value: mockResult.meterId, color: '#a78bfa' },
                      { label: isHe ? 'שיא צריכה' : 'Peak Consumption', value: mockResult.peakConsumption, color: '#f59e0b' },
                      { label: isHe ? 'תעריף נוכחי' : 'Current Tariff', value: mockResult.currentTariff, color: '#60a5fa' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-white/50">{item.label}</span>
                        <span className="text-xs font-black" style={{ color: item.color }}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Comparison Table */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">{isHe ? 'השוואת הכנסות — חודש אחרון' : 'Revenue Comparison — Last Month'}</p>
                    </div>
                    <div className="divide-y divide-white/5">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <span className="text-xs text-white/70">{isHe ? 'הכנסה בפועל' : 'Actual Revenue'}</span>
                        </div>
                        <span className="text-sm font-black text-red-400">₪{mockResult.actualRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs text-white/70">{isHe ? 'הכנסה מותאמת AI' : 'VPP AI Optimized'}</span>
                        </div>
                        <span className="text-sm font-black text-emerald-400">₪{mockResult.optimizedRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(245,158,11,0.06)' }}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs font-bold text-amber-400">{isHe ? 'ROI שאבדת' : 'Missing ROI'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-amber-400">+₪{gap.toLocaleString()}</span>
                          <p className="text-[10px] text-amber-400/60">{mockResult.lossPct}% {isHe ? 'פוטנציאל בלתי מנוצל' : 'untapped'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loss Breakdown Chart */}
                  <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[9px] text-white/40">{isHe ? 'מכירה זולה' : 'Undersold'}</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] text-white/40">{isHe ? 'סוללה חלקית' : 'Under-stored'}</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] text-white/40">{isHe ? 'אופטימלי' : 'Optimal'}</span></div>
                      </div>
                      <p className="text-[11px] font-black text-white/40 uppercase tracking-widest">{isHe ? 'אובדן לפי שעה' : 'Loss by Hour'}</p>
                    </div>
                    <ResponsiveContainer width="100%" height={100}>
                      <BarChart data={lossData} barSize={14}>
                        <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 11 }}
                          formatter={(v) => [`${v} kWh`, isHe ? 'אובדן' : 'Loss']}
                        />
                        <Bar dataKey="loss" shape={<CustomBar />} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => toast.success(isHe ? '📊 הדוח נשלח לאימייל שלך!' : '📊 Full report sent to your email!')}
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

                  {/* Reset */}
                  <button onClick={() => { setState('idle'); setFileName(''); }}
                    className="w-full text-xs text-white/30 py-2 hover:text-white/60 transition-colors">
                    {isHe ? 'העלה קובץ אחר' : 'Upload another file'}
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