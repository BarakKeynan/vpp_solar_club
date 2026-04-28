import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Save, Eye, EyeOff, Zap, Wifi, WifiOff, CheckCircle2, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CONFIG_KEY = 'vpp_settings';

const FIELD_DEFS = [
  {
    group: 'Noga Energy API',
    desc: 'אישורי OAuth2 לגישה למחירי חשמל בזמן אמת',
    fields: [
      { key: 'noga_client_id', label: 'Client ID', placeholder: 'noga-client-xxxxx', secret: false },
      { key: 'noga_client_secret', label: 'Client Secret', placeholder: '••••••••••••••••', secret: true },
      { key: 'noga_api_url', label: 'API Base URL', placeholder: 'https://noga-iso.co.il', secret: false },
    ],
  },
  {
    group: 'SolarEdge Monitoring',
    desc: 'מפתח API לניטור צי הסוללות',
    fields: [
      { key: 'solaredge_api_key', label: 'API Key', placeholder: 'XXXXXXXXXXXXXXXXXXXX', secret: true },
      { key: 'solaredge_site_ids', label: 'Site IDs (comma-separated)', placeholder: 'site-001,site-002,site-003', secret: false },
    ],
  },
];

function SecretInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-muted border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors font-mono"
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function VPPSettings() {
  const { toast } = useToast();
  const [config, setConfig] = useState({
    key: CONFIG_KEY,
    live_mode: false,
    noga_client_id: '',
    noga_client_secret: '',
    noga_api_url: 'https://noga-iso.co.il',
    solaredge_api_key: '',
    solaredge_site_ids: '',
  });
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const records = await base44.entities.AppConfig.filter({ key: CONFIG_KEY });
    if (records.length > 0) {
      const rec = records[0];
      setRecordId(rec.id);
      setConfig({
        key: CONFIG_KEY,
        live_mode: rec.live_mode ?? false,
        noga_client_id: rec.noga_client_id ?? '',
        noga_client_secret: rec.noga_client_secret ?? '',
        noga_api_url: rec.noga_api_url ?? 'https://noga-iso.co.il',
        solaredge_api_key: rec.solaredge_api_key ?? '',
        solaredge_site_ids: rec.solaredge_site_ids ?? '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (recordId) {
      await base44.entities.AppConfig.update(recordId, config);
    } else {
      const rec = await base44.entities.AppConfig.create(config);
      setRecordId(rec.id);
    }
    setSaving(false);
    toast({ title: 'הגדרות נשמרו', description: `מצב: ${config.live_mode ? 'Live 🟢' : 'Simulation 🔵'}` });
  };

  const set = (k) => (v) => setConfig(c => ({ ...c, [k]: v }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLive = config.live_mode;
  const hasNogaCreds = !!(config.noga_client_id && config.noga_client_secret);
  const hasSolarEdgeCreds = !!config.solaredge_api_key;
  const readyForLive = hasNogaCreds && hasSolarEdgeCreds;

  return (
    <div className="max-w-2xl mx-auto p-4 pb-28 space-y-6">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-2xl font-black text-foreground">⚙️ VPP Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">ניהול אישורי API ומצב הפעולה של המערכת</p>
      </motion.div>

      {/* Mode Toggle */}
      <motion.div
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className={`rounded-2xl border-2 p-5 transition-all ${isLive ? 'border-primary/50 bg-primary/5' : 'border-secondary/30 bg-secondary/5'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLive
              ? <Wifi className="w-6 h-6 text-primary" />
              : <WifiOff className="w-6 h-6 text-secondary" />
            }
            <div>
              <p className="font-black text-foreground text-base">
                {isLive ? '🟢 Live Mode' : '🔵 Simulation Mode'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isLive ? 'מחובר לממשקי API אמיתיים' : 'מחירים ונתוני צי מדומים'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isLive && !readyForLive) {
                toast({ title: 'חסרים אישורי API', description: 'יש להזין Noga + SolarEdge לפני מעבר ל-Live', variant: 'destructive' });
                return;
              }
              set('live_mode')(!isLive);
            }}
            className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${isLive ? 'bg-primary' : 'bg-muted'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all ${isLive ? 'left-7' : 'left-0.5'}`} />
          </button>
        </div>

        {/* Readiness indicators */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-border/40">
          <div className={`flex items-center gap-2 text-xs ${hasNogaCreds ? 'text-primary' : 'text-muted-foreground'}`}>
            {hasNogaCreds ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            Noga API
          </div>
          <div className={`flex items-center gap-2 text-xs ${hasSolarEdgeCreds ? 'text-primary' : 'text-muted-foreground'}`}>
            {hasSolarEdgeCreds ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            SolarEdge API
          </div>
          {!readyForLive && (
            <div className="flex items-center gap-2 text-xs text-accent ml-auto">
              <AlertCircle className="w-4 h-4" />
              נדרשים אישורים להפעלת Live Mode
            </div>
          )}
        </div>
      </motion.div>

      {/* Credential Groups */}
      {FIELD_DEFS.map((group, gi) => (
        <motion.div
          key={group.group}
          initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + gi * 0.05 }}
          className="rounded-2xl border border-border bg-card p-5 space-y-4"
        >
          <div>
            <h2 className="font-black text-foreground">{group.group}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{group.desc}</p>
          </div>
          {group.fields.map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">{f.label}</label>
              {f.secret ? (
                <SecretInput value={config[f.key]} onChange={set(f.key)} placeholder={f.placeholder} />
              ) : (
                <input
                  type="text"
                  value={config[f.key]}
                  onChange={e => set(f.key)(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors font-mono"
                />
              )}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Save Button */}
      <motion.button
        initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={handleSave}
        disabled={saving}
        className="w-full py-4 rounded-2xl font-black text-primary-foreground flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 30%))' }}
      >
        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {saving ? 'שומר...' : 'שמור הגדרות'}
      </motion.button>
    </div>
  );
}