import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Eye, EyeOff, CheckCircle2, Loader2, MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

const WHATSAPP_SUPPORT = '972526000000'; // ← replace with Barak's number
const SUPPORT_MSG = 'היי ברק, אני צריך עזרה בהוצאת ה-API מול נגה';

export default function NogaConnectCard() {
  const { user } = useAuth();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user?.noga_client_id) {
      setClientId(user.noga_client_id);
      setIsConnected(true);
    }
    if (user?.noga_client_secret) setClientSecret(user.noga_client_secret);
  }, [user]);

  const handleConnect = async () => {
    if (!clientId.trim() || !clientSecret.trim()) return;
    setSaving(true);
    await base44.auth.updateMe({
      noga_client_id: clientId.trim(),
      noga_client_secret: clientSecret.trim(),
    });
    setSaving(false);
    setSaved(true);
    setIsConnected(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleHelpWhatsApp = () => {
    window.open(
      `https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(SUPPORT_MSG)}`,
      '_blank'
    );
  };

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)' }}>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-black text-white">אישורי Noga Energy (API)</p>
        {isConnected && !saving && (
          <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
            ✓ מחובר
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-white/55 leading-relaxed">
        לקבלת <strong className="text-white/80">Client ID + Secret</strong> של Noga ISO, פנו לצוות VPP Solar Club.
        הם מספקים גישה למחירי חשמל בזמן אמת.
      </p>

      {/* Note box */}
      <div className="rounded-xl px-3 py-2.5"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-[11px] text-emerald-400 leading-relaxed">
          💡 ללא חיבור זה האפליקציה פועלת ב-Simulation Mode — הכל עובד, אבל עם נתוני מחיר מדומים.
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40">Client ID</label>
          <input
            type="text"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            placeholder="noga-client-xxxxx"
            className="w-full px-3 py-2.5 rounded-xl text-xs text-white outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            dir="ltr"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40">Client Secret</label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3 py-2.5 pr-10 rounded-xl text-xs text-white outline-none font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              dir="ltr"
            />
            <button type="button" onClick={() => setShowSecret(v => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {/* Primary: Connect */}
        <button
          onClick={handleConnect}
          disabled={saving || !clientId.trim() || !clientSecret.trim()}
          className="flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
          style={{
            background: saved ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
            border: `1px solid ${saved ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}`,
            color: saved ? '#34d399' : '#fbbf24',
          }}>
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
           saved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
           <Zap className="w-3.5 h-3.5" />}
          {saving ? 'מאמת...' : saved ? '✓ נשמר!' : 'אימות וחיבור'}
        </button>

        {/* Secondary: WhatsApp help */}
        <button
          onClick={handleHelpWhatsApp}
          className="px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95"
          style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}>
          <MessageCircle className="w-3.5 h-3.5" />
          עזרה בחיבור
        </button>
      </div>
    </div>
  );
}