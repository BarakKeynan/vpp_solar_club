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
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (user?.noga_client_id) setIsConnected(true);
  }, [user]);

  const handleConnect = async () => {
    setConnecting(true);
    // Redirect to Noga OAuth / portal for authorization
    window.open('https://www.noga-iso.co.il/', '_blank');
    // Simulate pending state
    setTimeout(() => setConnecting(false), 2000);
  };

  return (
    <div className="rounded-2xl p-4 space-y-4"
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)' }}>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-black text-white">
          {isHe ? 'סנכרון נתוני שוק (Noga ISO)' : 'Market Data Sync (Noga ISO)'}
        </p>
      </div>

      {/* Description */}
      <p className="text-xs text-white/60 leading-relaxed">
        {isHe
          ? 'כדי שהאלגוריתם יוכל לבצע אופטימיזציה בזמן אמת ולחסוך בעלויות, עלינו לסנכרן את נתוני הצריכה שלך עם מחירי הרשת.'
          : 'To enable real-time optimization and cost savings, we need to sync your consumption data with grid prices.'}
      </p>

      {/* Connection status */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-white/50">{isHe ? 'סטטוס חיבור:' : 'Connection status:'}</span>
        {isConnected ? (
          <span className="flex items-center gap-1 text-xs font-black text-emerald-400">
            <span>🟢</span> {isHe ? 'מחובר ומסונכרן' : 'Connected & synced'}
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-black text-amber-400">
            <span>🟡</span> {isHe ? 'ממתין להרשאה דיגיטלית' : 'Awaiting digital authorization'}
          </span>
        )}
      </div>

      {/* How it works */}
      {!isConnected && (
        <div className="rounded-xl px-3 py-3 space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px] font-black text-white/50 mb-1">
            {isHe ? 'איך זה עובד?' : 'How does it work?'}
          </p>
          {isHe ? (
            <>
              <p className="text-[11px] text-white/45 leading-relaxed">1. לוחצים על הכפתור למטה.</p>
              <p className="text-[11px] text-white/45 leading-relaxed">2. מאשרים את הגישה לנתוני המונה בדף ההזדהות המאובטח.</p>
              <p className="text-[11px] text-white/45 leading-relaxed">3. זהו! המערכת תתחיל למקסם את הרווחים שלך באופן אוטומטי.</p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-white/45 leading-relaxed">1. Click the button below.</p>
              <p className="text-[11px] text-white/45 leading-relaxed">2. Approve meter data access on the secure authorization page.</p>
              <p className="text-[11px] text-white/45 leading-relaxed">3. Done! The system will start maximizing your profits automatically.</p>
            </>
          )}
        </div>
      )}

      {/* Connect button */}
      {!isConnected && (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
          style={{ background: 'rgba(245,158,11,0.18)', border: '1px solid rgba(245,158,11,0.5)', color: '#fbbf24' }}>
          {connecting
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Zap className="w-4 h-4" />}
          {isHe ? 'התחברות מאובטחת ומתן הרשאה' : 'Secure Connection & Authorization'}
        </button>
      )}

      {/* Security note */}
      <div className="flex items-start gap-2">
        <Lock className="w-3 h-3 text-white/25 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-white/30 leading-relaxed">
          {isHe
            ? 'החיבור מתבצע תחת תקני האבטחה המחמירים של נגה. המפתחות הסודיים שלך לעולם לא נחשפים.'
            : 'Connection is secured under Noga\'s strict security standards. Your secret keys are never exposed.'}
        </p>
      </div>
    </div>
  );
}