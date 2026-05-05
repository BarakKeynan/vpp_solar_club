import React, { useState, useEffect } from 'react';
import { Sun, Eye, EyeOff, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/i18n';

export default function SolarEdgeConnectCard() {
  const { user } = useAuth();
  const { lang } = useLang();
  const [apiKey, setApiKey] = useState('');
  const [siteId, setSiteId] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');
  const isConnected = !!(user?.bess_api_key && user?.site_id);

  useEffect(() => {
    if (user?.bess_api_key) setApiKey(user.bess_api_key);
    if (user?.site_id) setSiteId(user.site_id);
  }, [user]);

  const handleSave = async () => {
    if (!apiKey.trim() || !siteId.trim()) return;
    setSaving(true);
    setTestStatus('testing');
    setTestMessage('');

    // Test credentials via backend (avoids CORS)
    try {
      const res = await base44.functions.invoke('testSolarEdgeCredentials', {
        api_key: apiKey.trim(),
        site_id: siteId.trim(),
      });
      const data = res.data;

      if (data?.error && !data?.success) throw new Error(data.error);
      if (data?.success === false) {
        const errCode = data?.error || '';
        if (errCode === 'invalid_api_key') {
          throw new Error(lang === 'he' ? 'המפתח לא תקין — בדקו את ה-API Key' : 'Invalid API Key — please check your key');
        } else if (errCode === 'site_not_found') {
          throw new Error(lang === 'he' ? 'ה-Site ID לא נמצא — ודאו שהמספר נכון' : 'Site ID not found — verify the number is correct');
        } else {
          throw new Error(lang === 'he' ? `שגיאת שרת` : `Server error`);
        }
      }

      // Save credentials
      const configs = await base44.entities.AppConfig.filter({ key: 'vpp_settings' });
      const configData = {
        key: 'vpp_settings',
        solaredge_api_key: apiKey.trim(),
        solaredge_site_ids: siteId.trim(),
      };
      if (configs.length > 0) {
        await base44.entities.AppConfig.update(configs[0].id, configData);
      } else {
        await base44.entities.AppConfig.create(configData);
      }

      await base44.auth.updateMe({
        bess_api_key: apiKey.trim(),
        site_id: siteId.trim(),
      });

      const siteName = data?.site_name ? ` (${data.site_name})` : '';
      setTestStatus('success');
      setTestMessage((lang === 'he' ? `המערכת התחברה בהצלחה${siteName}! 🎉` : `Connected successfully${siteName}! 🎉`));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setTestStatus('error');
      setTestMessage(err.message || (lang === 'he' ? '❌ חיבור נכשל' : '❌ Connection failed'));
    }
    setSaving(false);
  };

  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>

      {/* Header */}
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">☀️</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
             <p className="text-sm font-black text-white">
               {lang === 'he' ? 'חיבור SolarEdge API' : 'Connect SolarEdge API'}
             </p>
             {isConnected && (
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                 style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                 {lang === 'he' ? '✓ מחובר' : '✓ Connected'}
               </span>
             )}
           </div>
           <p className="text-xs text-white/60 leading-relaxed mt-1">
             {lang === 'he' 
               ? <>כנסו לפורטל <span className="text-white/80 font-bold">SolarEdge › Account › API Access</span> וצרו API Key. הזינו אותו כאן יחד עם ה-Site ID שלכם — ותוכלו לראות בזמן אמת כמה חשמל הפאנלים מייצרים ומה מצב הסוללה הפיזית.</>
               : <>Log in to the SolarEdge portal <span className="text-white/80 font-bold">› Account › API Access</span> and create an API Key. Enter it here along with your Site ID — you'll see in real-time how much electricity your panels produce and the physical battery status.</>
             }
           </p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40">Site ID</label>
          <input
            type="text"
            value={siteId}
            onChange={e => setSiteId(e.target.value)}
            placeholder={lang === 'he' ? 'לדוגמה: 1234567' : 'e.g. 1234567'}
            className="w-full px-3 py-2.5 rounded-xl text-xs text-white outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            dir="ltr"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-white/40">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full px-3 py-2.5 pr-10 rounded-xl text-xs text-white outline-none font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              dir="ltr"
            />
            <button type="button" onClick={() => setShowKey(v => !v)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="rounded-xl px-3 py-2"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-[11px] text-emerald-400 leading-relaxed">
          {lang === 'he'
            ? '💡 זה מאפשר לאפליקציה לראות בזמן אמת כמה חשמל הפאנלים מייצרים ומה מצב הסוללה הפיזית.'
            : '💡 This allows the app to see in real-time how much electricity your panels produce and the physical battery status.'}
        </p>
      </div>

      {/* Test result banner */}
      {testStatus && testStatus !== 'testing' && (
        <div className="rounded-xl px-3 py-2.5 flex items-start gap-2"
          style={{
            background: testStatus === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${testStatus === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {testStatus === 'success'
            ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            : <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
          <p className="text-[11px] leading-relaxed font-semibold"
            style={{ color: testStatus === 'success' ? '#34d399' : '#f87171' }}>
            {testMessage}
          </p>
        </div>
      )}

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving || !apiKey.trim() || !siteId.trim()}
        className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-40"
        style={{
          background: saved ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
          border: `1px solid ${saved ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.3)'}`,
          color: saved ? '#34d399' : '#6ee7b7',
        }}>
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
         saved ? <CheckCircle2 className="w-3.5 h-3.5" /> :
         <Sun className="w-3.5 h-3.5" />}
        {saving ? (lang === 'he' ? 'בודק חיבור...' : 'Testing connection...') : 
         saved ? (lang === 'he' ? '✓ נשמר!' : '✓ Saved!') : 
         (lang === 'he' ? 'שמור וחבר' : 'Save & Connect')}
      </button>
    </div>
  );
}