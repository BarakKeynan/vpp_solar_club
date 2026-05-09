import React, { useState, useEffect } from 'react';
import { Zap, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/i18n';

export default function NogaConnectCard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [isConnected, setIsConnected] = useState(false);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    if (user?.noga_synced) setIsConnected(true);
  }, [user]);

  const handleActivate = async () => {
    setActivating(true);
    try {
      await base44.functions.invoke('syncEnergyPrices', {});
      setIsConnected(true);
    } catch (_) {}
    setActivating(false);
  };

  return (
    <div className="rounded-2xl p-4 space-y-4"
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)' }}>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-black text-white">
          {isHe ? 'סנכרון תעריפי בורסה (Noga ISO)' : 'Exchange Rate Sync (Noga ISO)'}
        </p>
        {isConnected && (
          <span className="mr-auto text-[10px] font-black px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
            🟢 {isHe ? 'פעיל' : 'Active'}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed">
        {isHe
          ? 'כדי למקסם רווחים, המערכת מתחברת לנתוני "נגה" ומזהה את שעות השפל והשיא בזמן אמת.'
          : 'To maximize profits, the system connects to Noga data and identifies peak and off-peak hours in real time.'}
      </p>

      {/* Already done note */}
      <div className="rounded-xl px-3 py-2.5 flex items-start gap-2"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/55 leading-relaxed">
          {isHe
            ? 'ביצענו עבורך את החיבור הטכני. כל שנותר הוא להפעיל:'
            : 'We\'ve handled the technical connection for you. All that\'s left is to activate:'}
        </p>
      </div>

      {/* Activate button */}
      {!isConnected ? (
        <button
          onClick={handleActivate}
          disabled={activating}
          className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
          style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.5)', color: '#fbbf24' }}>
          {activating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {activating
            ? (isHe ? 'מפעיל...' : 'Activating...')
            : (isHe ? 'הפעלת סנכרון אוטומטי' : 'Activate Auto Sync')}
        </button>
      ) : (
        <div className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)', color: '#34d399' }}>
          <CheckCircle2 className="w-4 h-4" />
          {isHe ? 'סנכרון אוטומטי פעיל' : 'Auto Sync Active'}
        </div>
      )}

      {/* Security note */}
      <div className="flex items-start gap-2">
        <Lock className="w-3 h-3 text-white/25 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-white/30 leading-relaxed">
          {isHe
            ? 'החיבור מאובטח ברמת השרת ואינו דורש הזנת מפתחות מצדך.'
            : 'Connection is secured at the server level and requires no keys from you.'}
        </p>
      </div>
    </div>
  );
}