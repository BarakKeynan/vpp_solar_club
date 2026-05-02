import React, { useState, useEffect } from 'react';
import { Zap, Eye, EyeOff, CheckCircle2, Loader2, MessageCircle, Copy } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/i18n';

const TEMPLATE_TEXT_HE = 'שלום צוות נגה, אני מעוניין לקבל גישת API לנתוני המערכת שלי עבור אפליקציית ניהול האנרגיה VPP Solar Club. אודה לקבלת Client ID ו-Secret Key עבור המונה שלי.';
const TEMPLATE_TEXT_EN = 'Hello Noga team, I would like to obtain API access to my system data for the VPP Solar Club energy management application. I would appreciate receiving Client ID and Secret Key for my meter.';

function CopyTemplate({ lang }) {
  const [copied, setCopied] = useState(false);
  const templateText = lang === 'he' ? TEMPLATE_TEXT_HE : TEMPLATE_TEXT_EN;
  const handleCopy = () => {
    navigator.clipboard.writeText(templateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <div className="rounded-xl p-3 space-y-2"
      style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
        {lang === 'he' ? 'נוסח מומלץ לפנייה (להעתקה)' : 'Suggested Template (Copy)'}
      </p>
      <p className="text-[11px] text-white/55 leading-relaxed">{templateText}</p>
      <button onClick={handleCopy}
        className="flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-lg transition-all active:scale-95"
        style={{
          background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${copied ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.25)'}`,
          color: copied ? '#34d399' : '#6ee7b7',
        }}>
        {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? (lang === 'he' ? 'הועתק!' : 'Copied!') : (lang === 'he' ? 'העתק טקסט' : 'Copy Text')}
      </button>
    </div>
  );
}

const WHATSAPP_SUPPORT = '972526000000';
const SUPPORT_MSG_HE = 'היי ברק, אני צריך עזרה בהוצאת ה-API מול נגה';
const SUPPORT_MSG_EN = 'Hi Barak, I need help getting the API from Noga';

export default function NogaConnectCard() {
  const { user } = useAuth();
  const { lang } = useLang();
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
    const supportMsg = lang === 'he' ? SUPPORT_MSG_HE : SUPPORT_MSG_EN;
    window.open(
      `https://wa.me/${WHATSAPP_SUPPORT}?text=${encodeURIComponent(supportMsg)}`,
      '_blank'
    );
  };

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.25)' }}>

      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-400" />
        <p className="text-sm font-black text-white">
          {lang === 'he' ? 'חיבור לנתוני אמת (Noga ISO)' : 'Live Data Connection (Noga ISO)'}
        </p>
        {isConnected && !saving && (
          <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
            {lang === 'he' ? '✓ מחובר' : '✓ Connected'}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-white/55 leading-relaxed">
        {lang === 'he'
          ? <>כדי שהמערכת תוכל למקסם את הרווחים שלך, יש לחבר את נתוני המונה האישיים שלך מול <strong className="text-white/80">נגה - ניהול מערכת החשמל</strong>.</>
          : <>To maximize your profits, connect your personal meter data with <strong className="text-white/80">Noga — Power System Operator</strong>.</>
        }
      </p>

      {/* How to get keys */}
      <div className="rounded-xl px-3 py-2.5 space-y-1.5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-[11px] font-black text-white/60 mb-1">
          {lang === 'he' ? 'איך משיגים את הקודים?' : 'How to get the credentials?'}
        </p>
        {lang === 'he' ? (
          <>
            <p className="text-[11px] text-white/50 leading-relaxed">1. לחצו על הכפתור מטה למעבר לפורטל נגה.</p>
            <p className="text-[11px] text-white/50 leading-relaxed">2. הגישו בקשה לגישת API (SMP Price) עבור המונה שלכם.</p>
            <p className="text-[11px] text-white/50 leading-relaxed">3. העתיקו והדביקו כאן את ה-Client ID וה-Secret שתקבלו במייל.</p>
          </>
        ) : (
          <>
            <p className="text-[11px] text-white/50 leading-relaxed">1. Click the button below to go to Noga portal.</p>
            <p className="text-[11px] text-white/50 leading-relaxed">2. Request API access (SMP Price) for your meter.</p>
            <p className="text-[11px] text-white/50 leading-relaxed">3. Copy & paste the Client ID and Secret here when you receive them by email.</p>
          </>
        )}
        <a href="https://www.noga-iso.co.il/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all active:scale-95"
          style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}>
          ⚡ {lang === 'he' ? 'מעבור לפורטל נגה' : 'Go to Noga Portal'}
        </a>
      </div>

      {/* Copy template */}
      <CopyTemplate lang={lang} />

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
          {saving ? (lang === 'he' ? 'מאמת...' : 'Verifying...') :
           saved ? (lang === 'he' ? '✓ נשמר!' : '✓ Saved!') :
           (lang === 'he' ? 'אימות וחיבור' : 'Verify & Connect')}
        </button>

        {/* Secondary: WhatsApp help */}
        <button
          onClick={handleHelpWhatsApp}
          className="px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all active:scale-95"
          style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', color: '#25d366' }}>
          <MessageCircle className="w-3.5 h-3.5" />
          {lang === 'he' ? 'עזרה בחיבור' : 'Help'}
        </button>
      </div>
    </div>
  );
}