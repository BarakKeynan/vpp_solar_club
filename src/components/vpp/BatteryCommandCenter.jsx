/**
 * BatteryCommandCenter — UI panel for:
 * - Real-time battery status (physical + virtual)
 * - Charge to virtual command
 * - Sell to grid (immediate or scheduled)
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Zap, TrendingUp, Battery, RefreshCw, CheckCircle2, Clock, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const STATUS_POLL_MS = 30000;

// AI recommendation based on current hour & conditions
function getAiAdvice(virtual) {
  const h = new Date().getHours();
  const solarHours = h >= 10 && h <= 16;
  const peakHours = h >= 20 && h <= 23;
  const offPeak = h >= 0 && h <= 6;
  const balance = virtual?.kwhBalance ?? 0;

  const charge = solarHours
    ? { tip: `☀️ שמש בשיא (${h}:00) — מומלץ לטעון עכשיו עד 95% ולאגור אנרגיה זולה ללילה.`, target: 95 }
    : offPeak
    ? { tip: `🌙 שעות שפל (${h}:00) — מחיר רשת נמוך, כדאי לטעון עד 80%.`, target: 80 }
    : { tip: `⏳ אין שמש כעת — טען מהחווה עד 70% לפני שעת שיא.`, target: 70 };

  const sell = peakHours
    ? { tip: `🔥 שעת שיא! (${h}:00) — מחיר מקסימלי. מכור עכשיו עד ${Math.min(balance, 15).toFixed(0)} kWh.`, kwh: Math.min(balance, 15), mode: 'now', time: '' }
    : { tip: `📅 שעת השיא הקרובה: 20:00–23:00 — תזמן מכירה של ${Math.min(balance, 12).toFixed(0)} kWh לשעה 20:30.`, kwh: Math.min(balance, 12), mode: 'scheduled', time: getTodayAt('20:30') };

  return { charge, sell };
}

function getTodayAt(hhmm) {
  const [hh, mm] = hhmm.split(':');
  const d = new Date();
  d.setHours(Number(hh), Number(mm), 0, 0);
  if (d < new Date()) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 16);
}

export default function BatteryCommandCenter() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cmdLoading, setCmdLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Charge form
  const [targetSoc, setTargetSoc] = useState(90);

  // Sell form
  const [kwhToSell, setKwhToSell] = useState(10);
  const [scheduledTime, setScheduledTime] = useState('');
  const [sellMode, setSellMode] = useState('now'); // 'now' | 'scheduled'

  const fetchStatus = async () => {
    const res = await base44.functions.invoke('batteryCommands', { action: 'get_status' });
    setStatus(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, STATUS_POLL_MS);
    return () => clearInterval(t);
  }, []);

  const showResult = (data, error) => {
    setResult({ data, error, ts: Date.now() });
    setTimeout(() => setResult(null), 5000);
  };

  const handleCharge = async () => {
    setCmdLoading(true);
    const currentSoc = status?.physical?.soc ?? 78;
    const res = await base44.functions.invoke('batteryCommands', {
      action: 'charge_to_virtual', targetSoc, currentSoc
    });
    setCmdLoading(false);
    showResult(res.data);
    fetchStatus();
  };

  const handleSell = async () => {
    setCmdLoading(true);
    const payload = { action: 'sell_to_grid', kwhToSell };
    if (sellMode === 'scheduled' && scheduledTime) payload.scheduledTime = scheduledTime;
    const res = await base44.functions.invoke('batteryCommands', payload);
    setCmdLoading(false);
    if (res.data?.error) showResult(null, res.data.error);
    else showResult(res.data);
    fetchStatus();
  };

  const physical = status?.physical;
  const virtual = status?.virtual;
  const isSimulation = status?.mode === 'simulation';
  const socColor = (soc) => soc > 70 ? '#10b981' : soc > 30 ? '#f59e0b' : '#ef4444';
  const aiAdvice = getAiAdvice(virtual);

  const applyChargeAdvice = () => {
    setTargetSoc(aiAdvice.charge.target);
  };

  const applySellAdvice = () => {
    setKwhToSell(Math.max(1, Math.round(aiAdvice.sell.kwh)));
    setSellMode(aiAdvice.sell.mode);
    if (aiAdvice.sell.mode === 'scheduled') setScheduledTime(aiAdvice.sell.time);
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-foreground">🔋 פקודות סוללה</h2>
          <p className="text-xs text-muted-foreground">
            {isSimulation ? '🔵 Simulation Mode' : '🟢 Live Mode'}
          </p>
        </div>
        <button onClick={fetchStatus} className="p-2 rounded-xl bg-muted active:scale-95 transition-transform">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Status Cards */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Physical Battery */}
          <div className="rounded-2xl p-4 space-y-2"
            style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-primary" />
              <p className="text-xs font-black text-white">סוללה פיזית</p>
            </div>
            <p className="text-2xl font-black" style={{ color: socColor(physical?.soc ?? 0) }}>
              {physical?.soc ?? '--'}%
            </p>
            <p className="text-[10px] text-white/40">{physical?.powerKw ?? '--'} kW · {physical?.status ?? '--'}</p>
          </div>

          {/* Virtual Wallet */}
          <div className="rounded-2xl p-4 space-y-2"
            style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <p className="text-xs font-black text-white">ארנק וירטואלי</p>
            </div>
            <p className="text-2xl font-black text-violet-400">
              {virtual?.kwhBalance ?? '--'}
            </p>
            <p className="text-[10px] text-white/40">kWh זמינים למכירה</p>
          </div>
        </div>
      )}

      {/* Result Banner */}
      <AnimatePresence>
        {result && (
          <motion.div key="result"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl px-4 py-3 text-xs"
            style={result.error
              ? { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
              : { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
            {result.error
              ? <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              : <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />}
            <span>
              {result.error
                ? result.error
                : result.data?.addedKwh
                  ? `✓ נוסף ${result.data.addedKwh} kWh לארנק הוירטואלי (יתרה: ${result.data.newBalance} kWh)`
                  : result.data?.soldKwh
                    ? `✓ ${result.data.soldKwh} kWh נמכרו${result.data.scheduledTime !== 'now' ? ` ב-${result.data.scheduledTime}` : ''} · הכנסה משוערת: ₪${result.data.estimatedRevenue}`
                    : '✓ הפקודה בוצעה'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMMAND 1: Charge to Virtual ─────────────────────────────── */}
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div className="flex items-center gap-2">
          <Battery className="w-4 h-4 text-primary" />
          <p className="text-sm font-black text-white">טעינה → ארנק וירטואלי</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          שלח פקודת טעינה לסוללה הפיזית וזכה את האנרגיה בארנק הוירטואלי לשימוש עתידי או מכירה.
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-primary">{targetSoc}%</span>
            <span className="text-[10px] text-white/40">יעד טעינה</span>
          </div>
          <input type="range" min={50} max={100} step={5} value={targetSoc}
            onChange={e => setTargetSoc(Number(e.target.value))}
            className="w-full accent-emerald-400" />
          <div className="flex justify-between text-[10px] text-white/25">
            <span>50%</span><span>100%</span>
          </div>
        </div>
        <button onClick={handleCharge} disabled={cmdLoading}
          className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.15))', border: '1px solid rgba(16,185,129,0.5)', color: '#34d399' }}>
          {cmdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Battery className="w-4 h-4" />}
          שלח פקודת טעינה ({targetSoc}%)
        </button>

        {/* AI Tip — Charge */}
        <div className="rounded-xl p-3 space-y-2"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-start gap-2">
            <span className="text-base">🤖</span>
            <p className="text-[11px] text-violet-300 leading-relaxed">{aiAdvice.charge.tip}</p>
          </div>
          <button onClick={applyChargeAdvice}
            className="w-full py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
            <Sparkles className="w-3.5 h-3.5" />
            יישם המלצה — טען עד {aiAdvice.charge.target}%
          </button>
        </div>
      </div>

      {/* ── COMMAND 2: Sell to Grid ───────────────────────────────────── */}
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <p className="text-sm font-black text-white">מכירה לרשת</p>
        </div>
        <p className="text-[11px] text-white/50 leading-relaxed">
          מכור אנרגיה מהארנק הוירטואלי חזרה לרשת — מיידית או בזמן מתוזמן לשעת שיא.
        </p>

        {/* kWh amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-accent">{kwhToSell} kWh</span>
            <span className="text-[10px] text-white/40">כמות למכירה · ~₪{(kwhToSell * 0.61).toFixed(2)}</span>
          </div>
          <input type="range" min={1} max={Math.min(virtual?.kwhBalance ?? 20, 50)} step={1} value={kwhToSell}
            onChange={e => setKwhToSell(Number(e.target.value))}
            className="w-full accent-amber-400" />
        </div>

        {/* Sell Mode Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-border">
          {['now', 'scheduled'].map(m => (
            <button key={m} onClick={() => setSellMode(m)}
              className="flex-1 py-2 text-xs font-bold transition-all"
              style={sellMode === m
                ? { background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }
                : { background: 'transparent', color: 'rgba(255,255,255,0.35)' }}>
              {m === 'now' ? '⚡ מיידית' : '⏰ מתוזמן'}
            </button>
          ))}
        </div>

        {sellMode === 'scheduled' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <Clock className="w-3.5 h-3.5 text-accent" />
              <input type="datetime-local" value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="flex-1 bg-transparent text-xs text-white outline-none" />
            </div>
            <p className="text-[10px] text-white/30 mt-1 pr-1">טיפ: שעות שיא (17:00–21:00) = מחיר גבוה יותר</p>
          </motion.div>
        )}

        <button onClick={handleSell} disabled={cmdLoading || (sellMode === 'scheduled' && !scheduledTime)}
          className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.15))', border: '1px solid rgba(245,158,11,0.5)', color: '#fbbf24' }}>
          {cmdLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
          {sellMode === 'now' ? `מכור ${kwhToSell} kWh עכשיו` : `תזמן מכירה ל-${scheduledTime ? new Date(scheduledTime).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) : '--:--'}`}
        </button>

        {/* AI Tip — Sell */}
        <div className="rounded-xl p-3 space-y-2"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="flex items-start gap-2">
            <span className="text-base">🤖</span>
            <p className="text-[11px] text-violet-300 leading-relaxed">{aiAdvice.sell.tip}</p>
          </div>
          <button onClick={applySellAdvice}
            className="w-full py-2 rounded-lg font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', color: '#c4b5fd' }}>
            <Sparkles className="w-3.5 h-3.5" />
            יישם המלצה — {aiAdvice.sell.mode === 'now' ? `מכור עכשיו ${Math.round(aiAdvice.sell.kwh)} kWh` : 'תזמן מכירה ל-20:30'}
          </button>
        </div>
      </div>

    </div>
  );
}