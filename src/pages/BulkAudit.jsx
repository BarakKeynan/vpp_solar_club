import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Download, FileText, Trash2, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';
import RecommendationsPanel from '@/components/audit/RecommendationsPanel';

const CONCURRENCY = 5; // process 5 files at once

const STATUS_COLOR = {
  queued: '#60a5fa',
  processing: '#f59e0b',
  completed: '#10b981',
  failed: '#ef4444',
};

const STATUS_ICON = {
  queued: <div className="w-3 h-3 rounded-full bg-blue-400 opacity-60" />,
  processing: <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />,
  completed: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  failed: <AlertCircle className="w-3 h-3 text-red-400" />,
};

export default function BulkAudit() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const fileRef = useRef();
  const [files, setFiles] = useState([]); // { file, name, status, id, result, error }
  const [running, setRunning] = useState(false);
  const [reportType, setReportType] = useState('electricity_bill');
  const [dragOver, setDragOver] = useState(false);
  const processingRef = useRef(false);

  const addFiles = useCallback((newFiles) => {
    const filtered = Array.from(newFiles).filter(f =>
      ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(f.type) && f.size <= 15 * 1024 * 1024
    );
    if (filtered.length < newFiles.length) {
      toast.error(isHe ? 'חלק מהקבצים נדחו (סוג לא נתמך או גדול מ-15MB)' : 'Some files rejected (unsupported type or >15MB)');
    }
    setFiles(prev => [...prev, ...filtered.map(f => ({ file: f, name: f.name, status: 'queued', id: null, result: null, error: null }))]);
  }, [isHe]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const processFile = async (idx, user) => {
    const entry = files[idx];
    // Upload file
    setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: 'processing' } : f));
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: entry.file });

      // Create job record
      const job = await base44.entities.BulkAuditJob.create({
        user_email: user.email,
        file_url,
        file_name: entry.name,
        report_type: reportType,
        status: 'processing',
        batch_id: window._batchId,
      });

      // Process via backend
      await base44.functions.invoke('processBulkAudit', { job_id: job.id });

      // Fetch updated job
      const jobs = await base44.entities.BulkAuditJob.filter({ id: job.id });
      const updated = jobs[0];

      // Send anomaly alert if missing ROI > ₪500
      const missingROI = updated?.analysis_result?.revenue_analysis?.missing_roi_ils;
      if (missingROI > 500) {
        base44.functions.invoke('sendAnomalyAlert', {
          type: 'ROI גבוה שאבד',
          value: `₪${Math.round(missingROI).toLocaleString()}`,
          threshold: '₪500',
          file_name: entry.name,
        }).catch(() => {});
      }

      setFiles(prev => prev.map((f, i) => i === idx ? {
        ...f,
        status: updated?.status || 'completed',
        id: job.id,
        result: updated?.analysis_result,
        error: updated?.error_msg,
      } : f));
    } catch (err) {
      setFiles(prev => prev.map((f, i) => i === idx ? { ...f, status: 'failed', error: err.message } : f));
    }
  };

  const runAll = async () => {
    if (running) return;
    setRunning(true);
    processingRef.current = true;
    window._batchId = `batch_${Date.now()}`;

    const user = await base44.auth.me();
    const queued = files.map((f, i) => i).filter(i => files[i].status === 'queued' || files[i].status === 'failed');

    // Process in chunks of CONCURRENCY
    for (let i = 0; i < queued.length; i += CONCURRENCY) {
      if (!processingRef.current) break;
      const chunk = queued.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(idx => processFile(idx, user)));
    }

    setRunning(false);
    processingRef.current = false;
    toast.success(isHe ? '✅ כל הקבצים עובדו!' : '✅ All files processed!');
  };

  const stopAll = () => {
    processingRef.current = false;
    setRunning(false);
    toast(isHe ? 'עצירה...' : 'Stopping...');
  };

  const exportCSV = () => {
    const completed = files.filter(f => f.status === 'completed' && f.result);
    const rows = [
      ['שם קובץ', 'תקופת חיוב', 'סה"כ kWh', 'סה"כ ₪', 'תעריף', 'ספק', 'הכנסה בפועל', 'מותאם VPP', 'ROI שאבד', 'סיכום'],
      ...completed.map(f => {
        const e = f.result?.extracted || {};
        const r = f.result?.revenue_analysis || {};
        return [
          f.name,
          e.billing_period || '',
          e.total_kwh || '',
          e.total_amount_ils || '',
          e.tariff_per_kwh || '',
          e.provider || '',
          r.actual_revenue_ils || '',
          r.optimized_revenue_ils || '',
          r.missing_roi_ils || '',
          (f.result?.summary || '').replace(/,/g, ' '),
        ];
      })
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_audit_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const stats = {
    total: files.length,
    queued: files.filter(f => f.status === 'queued').length,
    processing: files.filter(f => f.status === 'processing').length,
    completed: files.filter(f => f.status === 'completed').length,
    failed: files.filter(f => f.status === 'failed').length,
  };

  const totalMissingROI = files
    .filter(f => f.status === 'completed')
    .reduce((sum, f) => sum + (f.result?.revenue_analysis?.missing_roi_ils || 0), 0);

  return (
    <div className="p-4 pb-28 space-y-4 max-w-2xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">
            {isHe ? '📊 ניתוח חשבונות בקבוצה' : '📊 Bulk Bill Analysis'}
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            {isHe ? `עד ${CONCURRENCY} קבצים במקביל · PDF/JPG/PNG · 15MB לקובץ` : `Up to ${CONCURRENCY} files in parallel · PDF/JPG/PNG · 15MB each`}
          </p>
        </div>
        {stats.completed > 0 && (
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}>
            <Download className="w-3.5 h-3.5" />
            {isHe ? 'ייצוא CSV' : 'Export CSV'}
          </button>
        )}
      </div>

      {/* Report type selector */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { key: 'electricity_bill', emoji: '⚡', label: isHe ? 'חשבון חשמל' : 'Electricity Bill' },
          { key: 'roi_report', emoji: '📈', label: isHe ? 'דוח ROI' : 'ROI Report' },
        ].map(({ key, emoji, label }) => (
          <button key={key} onClick={() => setReportType(key)}
            className="py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: reportType === key ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${reportType === key ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.08)'}`,
              color: reportType === key ? '#c4b5fd' : 'rgba(255,255,255,0.35)',
            }}>
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Drop zone */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        animate={{ scale: dragOver ? 1.01 : 1 }}
        className="rounded-2xl border-2 border-dashed cursor-pointer p-8 text-center"
        style={{
          borderColor: dragOver ? 'rgba(124,58,237,0.9)' : 'rgba(124,58,237,0.3)',
          background: dragOver ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.04)',
        }}>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden"
          onChange={e => addFiles(e.target.files)} />
        <Upload className="w-8 h-8 text-violet-400 mx-auto mb-2" />
        <p className="text-sm font-black text-white">{isHe ? 'גרור קבצים לכאן' : 'Drag files here'}</p>
        <p className="text-xs text-white/35 mt-1">{isHe ? 'או לחץ לבחירת קבצים מרובים' : 'or click to select multiple files'}</p>
      </motion.div>

      {/* Stats bar */}
      {stats.total > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: isHe ? 'סה"כ' : 'Total', value: stats.total, color: '#60a5fa' },
            { label: isHe ? 'ממתין' : 'Queued', value: stats.queued, color: '#94a3b8' },
            { label: isHe ? 'הושלם' : 'Done', value: stats.completed, color: '#10b981' },
            { label: isHe ? 'נכשל' : 'Failed', value: stats.failed, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-white/35">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Total missing ROI */}
      {totalMissingROI > 0 && (
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.35)' }}>
          <p className="text-[10px] text-amber-400/60 uppercase tracking-widest mb-1">
            {isHe ? 'סה"כ ROI שאבד בכל הקבצים' : 'Total Missing ROI Across All Files'}
          </p>
          <p className="text-3xl font-black text-amber-400">+₪{Math.round(totalMissingROI).toLocaleString()}</p>
        </div>
      )}

      {/* Action buttons */}
      {files.length > 0 && (
        <div className="flex gap-2">
          {!running ? (
            <button onClick={runAll}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 0 20px rgba(124,58,237,0.4)' }}>
              <Play className="w-4 h-4" />
              {isHe ? `הפעל ניתוח (${stats.queued + stats.failed} קבצים)` : `Run Analysis (${stats.queued + stats.failed} files)`}
            </button>
          ) : (
            <button onClick={stopAll}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white"
              style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)' }}>
              <X className="w-4 h-4 text-red-400" />
              {isHe ? 'עצור' : 'Stop'}
            </button>
          )}
          {!running && (
            <button onClick={() => setFiles([])}
              className="px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Trash2 className="w-4 h-4 text-white/30" />
            </button>
          )}
        </div>
      )}

      {/* File list */}
      <div className="space-y-2">
        <AnimatePresence>
          {files.map((f, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className="rounded-xl p-3 flex flex-col gap-2"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${STATUS_COLOR[f.status]}33`,
              }}>
              {/* Top row: icon + name + status */}
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">{f.name}</p>
                  {f.status === 'completed' && f.result?.revenue_analysis?.missing_roi_ils > 0 && (
                    <p className="text-[10px] text-amber-400 mt-0.5">
                      +₪{Math.round(f.result.revenue_analysis.missing_roi_ils).toLocaleString()} {isHe ? 'ROI שאבד' : 'missing ROI'}
                    </p>
                  )}
                  {f.status === 'failed' && (
                    <p className="text-[10px] text-red-400 mt-0.5 truncate">{f.error}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {STATUS_ICON[f.status]}
                  <span className="text-[10px]" style={{ color: STATUS_COLOR[f.status] }}>
                    {isHe
                      ? { queued: 'ממתין', processing: 'מעבד...', completed: 'הושלם', failed: 'נכשל' }[f.status]
                      : f.status}
                  </span>
                  {!running && (
                    <button onClick={() => removeFile(idx)} className="p-0.5 hover:text-red-400 text-white/20 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              {/* Recommendations panel */}
              {f.status === 'completed' && f.result?.recommendations?.length > 0 && (
                <RecommendationsPanel recommendations={f.result.recommendations} fileName={f.name} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}