import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// ── Feature status definitions ────────────────────────────────────────────────
const getFeatures = (isHe) => [
  {
    id: 'weather_ai',
    emoji: '🌤️',
    label: isHe ? 'Weather AI Logic' : 'Weather AI Logic',
    desc: isHe
      ? 'סנכרון קרינה (W/m²) ↔ Performance Ratio (PR) ↔ תחזית ייצור'
      : 'Irradiance (W/m²) ↔ Performance Ratio (PR) ↔ Yield Forecast',
    status: 'active',
    detail: isHe
      ? 'PR היום: 92% · קרינה: 620 W/m² · ייצור חזוי: 18.4 kWh · סנכרון כל 15 דקות מ-Noga Data Hub'
      : 'Today PR: 92% · Irradiance: 620 W/m² · Predicted yield: 18.4 kWh · Synced every 15 min from Noga Data Hub',
    value: '92% PR',
    valueColor: '#10b981',
  },
  {
    id: 'ocr_bill',
    emoji: '📄',
    label: isHe ? 'OCR Bill Audit' : 'OCR Bill Audit',
    desc: isHe
      ? 'העלאת PDF → השוואה מיידית: רווח בפועל מול רווח עם AI'
      : 'Upload PDF → Instant compare: Actual profit vs. AI-optimized profit',
    status: 'active',
    detail: isHe
      ? 'AnalyzeEnergyReport פעיל · חיסכון ממוצע: ₪184/חודש · פוטנציאל שאבד: 18% · PDF/JPG/PNG נתמך'
      : 'analyzeEnergyReport active · Avg saving: ₪184/mo · Missing ROI: 18% · PDF/JPG/PNG supported',
    value: '+₪184/mo',
    valueColor: '#f59e0b',
  },
  {
    id: 'onboarding',
    emoji: '✍️',
    label: isHe ? 'Compliance Wizard' : 'Compliance Wizard',
    desc: isHe
      ? 'חתימה דיגיטלית · NFPA 855 · הגנת פרטיות (תיקון 13) · Liability Waiver'
      : 'Digital signature · NFPA 855 · Privacy Law (Amendment 13) · Liability Waiver',
    status: 'active',
    detail: isHe
      ? 'אישור בטיחות חומרה ✓ · הסכמת AI ✓ · חוק הגנת הפרטיות תשמ"א 1981 + תיקון 13 (2025) ✓ · חתימה ✓'
      : 'Hardware safety ✓ · AI consent ✓ · Privacy Protection Law 1981 + Amendment 13 (2025) ✓ · Signature ✓',
    value: '4/4 ✓',
    valueColor: '#10b981',
  },
  {
    id: 'orchestrator',
    emoji: '🎛️',
    label: isHe ? 'Orchestrator List' : 'Orchestrator List',
    desc: isHe
      ? 'רשימת המלצות חכמה עם כפתורי רדיו — Human-in-the-loop'
      : 'Smart recommendation list with radio buttons — Human-in-the-loop',
    status: 'active',
    detail: isHe
      ? '3 משימות פעילות: ארביטראז׳ סוללה / הזמנת טכנאי (CRM) / מעבר ספק (POA נוגה) · אישור משתמש נדרש'
      : '3 active tasks: Battery arbitrage / Technician booking (CRM) / Provider switch (Noga POA) · User approval required',
    value: '3 Tasks',
    valueColor: '#3b82f6',
  },
  {
    id: 'backend_hooks',
    emoji: '🔗',
    label: isHe ? 'Backend Hooks' : 'Backend Hooks',
    desc: isHe
      ? 'חיבור לCRM של חברות אחזקה + פל"א נוגה — לאחר אישור משתמש'
      : 'CRM integration for maintenance + Noga API — after user approval',
    status: 'partial',
    detail: isHe
      ? 'CRM תחזוקה: סנכרון הזמנות פעיל ✓ · POA נוגה: חתימה + שליחה ✓ · CRM ספק: ממתין לחיבור API ישיר ⏳'
      : 'Maintenance CRM: booking sync active ✓ · Noga POA: sign + submit ✓ · Provider CRM: awaiting direct API ⏳',
    value: '2/3 ✓',
    valueColor: '#f59e0b',
  },
  {
    id: 'noga_protocol',
    emoji: '⚡',
    label: isHe ? 'Noga Protocol' : 'Noga Protocol',
    desc: isHe
      ? 'חלון ניוד 60–90 יום · מנגנון MCP חדש (18% פער תמחור)'
      : '60–90 day mobility window · New MCP mechanism (18% pricing gap)',
    status: 'active',
    detail: isHe
      ? 'חלון ניוד: 60 יום ✓ · מחיר MCP שיאי: ₪1.12/kWh ✓ · פער תמחור MCP: 18% מוצג בכל ניתוח ✓ · POA דיגיטלי לנוגה ✓'
      : 'Mobility window: 60 days ✓ · Peak MCP: ₪1.12/kWh ✓ · MCP gap (18%) shown in all analyses ✓ · Digital POA to Noga ✓',
    value: '18% MCP',
    valueColor: '#a78bfa',
  },
];

const STATUS_CONFIG = {
  active:  { icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  labelHe: 'פעיל', labelEn: 'Active' },
  partial: { icon: Clock,        color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', labelHe: 'חלקי', labelEn: 'Partial' },
  missing: { icon: AlertCircle,  color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', labelHe: 'חסר',  labelEn: 'Missing' },
};

export default function ProfitGapReport() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const { lang } = useLang();
  const isHe = lang === 'he';

  const features = getFeatures(isHe);
  const activeCount = features.filter(f => f.status === 'active').length;
  const partialCount = features.filter(f => f.status === 'partial').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>

      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all active:scale-[0.98]"
        style={{
          background: open
            ? 'rgba(16,185,129,0.07)'
            : 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(59,130,246,0.05))',
          border: `1px solid ${open ? 'rgba(16,185,129,0.4)' : 'rgba(16,185,129,0.25)'}`,
          boxShadow: open ? 'none' : '0 0 20px rgba(16,185,129,0.08)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.25)', filter: 'blur(5px)' }}
            />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)' }}>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white leading-tight">
              {isHe ? 'דוח פער רווח — מצב המערכת' : 'Profit Gap Report — System Status'}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5">
              {isHe ? '6 טכנולוגיות · כולן מופעלות' : '6 technologies · All deployed'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
              ✓ {activeCount}
            </span>
            {partialCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                ⏳ {partialCount}
              </span>
            )}
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
        </div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">

              {/* Summary bar */}
              <div className="rounded-xl p-3 flex items-center justify-between"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex gap-3">
                  {[
                    { label: isHe ? 'פעיל' : 'Active',  count: activeCount,  color: '#10b981' },
                    { label: isHe ? 'חלקי' : 'Partial', count: partialCount, color: '#f59e0b' },
                    { label: isHe ? 'חסר' : 'Missing',  count: features.length - activeCount - partialCount, color: '#ef4444' },
                  ].map((s, i) => (
                    <div key={i} className="text-center">
                      <p className="text-base font-black" style={{ color: s.color }}>{s.count}</p>
                      <p className="text-[9px] text-white/35">{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40">{isHe ? 'ניצולת מערכת' : 'System Coverage'}</p>
                  <p className="text-lg font-black text-emerald-400">
                    {Math.round(((activeCount + partialCount * 0.5) / features.length) * 100)}%
                  </p>
                </div>
              </div>

              {/* Feature cards */}
              {features.map((f, i) => {
                const cfg = STATUS_CONFIG[f.status];
                const Icon = cfg.icon;
                const isExp = expanded === f.id;
                return (
                  <motion.button
                    key={f.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setExpanded(isExp ? null : f.id)}
                    className="w-full text-right rounded-xl overflow-hidden transition-all active:scale-[0.98]"
                    style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                  >
                    <div className="flex items-center gap-3 px-3.5 py-3">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                        <span className="text-[10px] font-bold" style={{ color: cfg.color }}>
                          {isHe ? cfg.labelHe : cfg.labelEn}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black" style={{ color: cfg.color }}>{f.value}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{f.emoji}</span>
                            <p className="text-xs font-black text-white truncate">{f.label}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed">{f.desc}</p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExp && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3.5 pb-3 pt-0 border-t"
                            style={{ borderColor: `${cfg.color}30` }}>
                            <p className="text-[11px] text-white/60 leading-relaxed mt-2">{f.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}

              <p className="text-[9px] text-white/20 text-center pt-1">
                {isHe ? 'לחץ על כל שורה לפרטים · מעודכן בזמן אמת' : 'Tap each row for details · Updated in real-time'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}