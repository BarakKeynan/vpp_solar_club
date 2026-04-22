import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Home, Zap, Edit2, Check, LogOut, CheckCircle2, FileText, ExternalLink, Battery, Camera, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';

export default function Profile() {
  const { t, lang } = useLang();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setName(u?.full_name || ''); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    await base44.auth.updateMe({ full_name: name });
    setUser(u => ({ ...u, full_name: name }));
    setEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    await base44.auth.updateMe({ profile_picture: file_url });
    setUser(u => ({ ...u, profile_picture: file_url }));
    setUploadingPhoto(false);
  };

  const stats = [
    { label: t('savings_this_month'), value: '+4,230 ₪', color: 'text-primary' },
    { label: t('production_year'), value: '2,840 kWh', color: 'text-accent' },
    { label: t('carbon_saved'), value: t('profile_carbon_val'), color: 'text-secondary' },
    { label: t('club_shares'), value: t('profile_shares_val'), color: 'text-primary' },
  ];

  const INTEGRATIONS = [
    { label: t('profile_provider'), value: 'Cellcom Energy', status: t('profile_connected'), color: '#8B5CF6' },
    { label: t('profile_smart_meter'), value: 'Noga Data Hub', status: t('profile_active_sync'), color: '#10B981' },
    { label: t('profile_solar_system'), value: 'SolarEdge API', status: t('profile_connected'), color: '#3B82F6' },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {t('profile_title')}
      </motion.h1>

      {/* Avatar & Name */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
        {/* Avatar with upload */}
        <div className="relative flex-shrink-0">
          <div
            className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-primary" />
            )}
            {uploadingPhoto && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            )}
          </div>
          {/* Camera badge */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-card"
            style={{ background: 'hsl(var(--primary))' }}
          >
            <Camera className="w-3 h-3 text-primary-foreground" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name} onChange={e => setName(e.target.value)}
                className="flex-1 bg-muted border border-primary rounded-lg px-3 py-1 text-sm text-foreground focus:outline-none"
              />
              <button onClick={handleSave} className="p-1.5 rounded-lg bg-primary">
                <Check className="w-4 h-4 text-primary-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-foreground">{user?.full_name || t('user_default')}</p>
              <button onClick={() => setEditing(true)}>
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">{user?.email || ''}</p>
        </div>
      </motion.div>

      {/* Integrations Status */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.13 }}
        className="rounded-2xl border border-border p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="text-xs font-bold text-muted-foreground">{t('active_connections')}</p>
        {INTEGRATIONS.map(item => (
          <div key={item.label} className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-bold text-foreground">{item.value}</p>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black"
              style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}30` }}
            >
              <CheckCircle2 className="w-3 h-3" />
              {item.status}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Community / Syndicate */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.16 }}
        className="rounded-2xl border p-4 space-y-3"
        style={{
          background: 'linear-gradient(135deg,rgba(30,58,138,0.2),rgba(17,24,39,0.6))',
          border: '1px solid rgba(59,130,246,0.2)',
        }}
      >
        <p className="text-xs font-bold" style={{ color: 'rgba(147,197,253,0.7)' }}>{t('community')}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t('neighborhood')}</span>
            <span className="text-xs font-bold text-white">{t('profile_neighborhood_val')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{t('syndicate_status')}</span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              84% {t('autopilot_active')}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-3">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Account Info */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}
        className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('account_info')}</p>
        {[
          { icon: Mail, label: t('email_label'), value: user?.email || '—' },
          { icon: Home, label: t('system_type'), value: 'VPP Home + Solar Club' },
          { icon: Zap, label: t('tariff'), value: '0.61 ₪/kWh' },
          { icon: Battery, label: lang === 'he' ? 'סוג סוללה' : 'Battery Type', value: 'LFP 10 kWh · SolarEdge' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <item.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Contract Docs */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border p-4 space-y-2"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="text-xs font-bold text-muted-foreground">{t('documents')}</p>
        {[
          { label: t('doc_terms'), icon: FileText },
          { label: t('doc_revenue'), icon: ExternalLink },
        ].map(doc => (
          <button key={doc.label} className="w-full flex items-center gap-3 py-2 text-right group">
            <div className="p-2 rounded-lg bg-muted">
              <doc.icon className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-foreground group-hover:text-primary transition-colors">{doc.label}</span>
            <ChevronLeft className="w-4 h-4 text-muted-foreground mr-auto" />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <button
        onClick={() => base44.auth.logout('/')}
        className="w-full py-3 rounded-2xl border border-destructive/40 text-destructive font-semibold text-sm flex items-center justify-center gap-2 hover:bg-destructive/10 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        {t('logout')}
      </button>
    </div>
  );
}

function ChevronLeft({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}