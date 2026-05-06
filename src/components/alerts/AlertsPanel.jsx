import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Zap, AlertTriangle, Info, CheckCircle2, RefreshCw, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

const SEVERITY = {
  critical: {
    bg: 'rgba(239,68,68,0.09)',
    border: 'rgba(239,68,68,0.35)',
    badgeBg: 'rgba(239,68,68,0.2)',
    badgeColor: '#F87171',
    label: 'קריטי',
    Icon: Zap,
    iconColor: '#F87171',
  },
  warning: {
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.35)',
    badgeBg: 'rgba(245,158,11,0.2)',
    badgeColor: '#FCD34D',
    label: 'אזהרה',
    Icon: AlertTriangle,
    iconColor: '#FCD34D',
  },
  info: {
    bg: 'rgba(59,130,246,0.07)',
    border: 'rgba(59,130,246,0.3)',
    badgeBg: 'rgba(59,130,246,0.18)',
    badgeColor: '#93C5FD',
    label: 'מידע',
    Icon: Info,
    iconColor: '#93C5FD',
  },
};

const AlertItem = React.forwardRef(function AlertItem({ alert, onResolve }, ref) {
  const s = SEVERITY[alert.severity] || SEVERITY.warning;
  const Icon = s.Icon;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="rounded-2xl p-3.5 flex items-start gap-3"
      style={{ background: s.bg, border: `1px solid ${s.border}` }}
    >
      <div className="p-1.5 rounded-xl shrink-0 mt-0.5" style={{ background: `${s.iconColor}18` }}>
        <Icon className="w-3.5 h-3.5" style={{ color: s.iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: s.badgeBg, color: s.badgeColor }}>
            {s.label}
          </span>
          {alert.site_id && (
            <span className="text-[10px] text-white/40 font-mono">{alert.site_id}</span>
          )}
          <span className="text-[10px] text-white/30 mr-auto">
            {new Date(alert.created_date).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed">{alert.message}</p>
        {alert.value !== undefined && (
          <p className="text-[10px] text-white/40 mt-1">
            ערך: <span className="font-mono" style={{ color: s.badgeColor }}>{alert.value}</span>
            {alert.threshold !== undefined && <> / סף: <span className="font-mono">{alert.threshold}</span></>}
          </p>
        )}
      </div>
      <button
        onClick={() => onResolve(alert.id)}
        className="shrink-0 p-1.5 rounded-lg transition-all hover:bg-white/10 text-white/30 hover:text-white/60"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
});

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runningCheck, setRunningCheck] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.SystemAlert.filter(
      { is_resolved: false },
      '-created_date',
      20
    );
    setAlerts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleResolve = async (id) => {
    await base44.entities.SystemAlert.update(id, {
      is_resolved: true,
      resolved_at: new Date().toISOString(),
    });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const handleRunCheck = async () => {
    setRunningCheck(true);
    try {
      await base44.functions.invoke('anomalyDetection', {});
      await load();
    } catch { /* ignore */ }
    setRunningCheck(false);
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  if (loading) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-4 h-4 text-white/60" />
            {alerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black"
                style={{ background: criticalCount > 0 ? '#EF4444' : '#F59E0B', color: '#000' }}>
                {alerts.length}
              </span>
            )}
          </div>
          <span className="text-sm font-black text-white">התראות מערכת</span>
          {criticalCount > 0 && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171' }}>
              {criticalCount} קריטי
            </span>
          )}
        </div>
        <button
          onClick={handleRunCheck}
          disabled={runningCheck}
          className="flex items-center gap-1 text-[11px] text-white/40 hover:text-white/70 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3 h-3 ${runningCheck ? 'animate-spin' : ''}`} />
          {runningCheck ? 'בודק...' : 'בדוק עכשיו'}
        </button>
      </div>

      {/* Alerts list */}
      {alerts.length === 0 ? (
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <p className="text-xs font-black text-emerald-400">כל המערכות תקינות</p>
            <p className="text-[11px] text-white/40 mt-0.5">אין התראות פעילות כרגע</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {alerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} onResolve={handleResolve} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}