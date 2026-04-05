import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Home, Zap, Edit2, Check, LogOut, CheckCircle2, FileText, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const INTEGRATIONS = [
  { label: 'ספק אנרגיה', value: 'Cellcom Energy', status: 'מחובר', color: '#8B5CF6' },
  { label: 'מונה חכם', value: 'Noga Data Hub', status: 'סנכרון פעיל', color: '#10B981' },
  { label: 'מערכת סולארית', value: 'SolarEdge API', status: 'מחובר', color: '#3B82F6' },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setName(u?.full_name || ''); }).catch(() => {});
  }, []);

  const handleSave = async () => {
    await base44.auth.updateMe({ full_name: name });
    setUser(u => ({ ...u, full_name: name }));
    setEditing(false);
  };

  const stats = [
    { label: 'חיסכון החודש', value: '+4,230 ₪', color: 'text-primary' },
    { label: 'ייצור השנה', value: '2,840 kWh', color: 'text-accent' },
    { label: 'פחמן חסכתי', value: '1.4 טון', color: 'text-secondary' },
    { label: 'מניות Solar Club', value: '2 מניות', color: 'text-primary' },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        פרופיל טכני וחיבורים
      </motion.h1>

      {/* Avatar & Name */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
          <User className="w-8 h-8 text-primary" />
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
              <p className="text-base font-bold text-foreground">{user?.full_name || 'משתמש'}</p>
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
        <p className="text-xs font-bold text-muted-foreground">חיבורים פעילים</p>
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
        <p className="text-xs font-bold" style={{ color: 'rgba(147,197,253,0.7)' }}>קהילה וסינדיקט</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">שיוך שכונתי</span>
            <span className="text-xs font-bold text-white">מרכז הכרמל, חיפה</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">סטטוס סינדיקט</span>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black cursor-pointer"
              style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              84% פעיל
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
        <p className="text-xs font-medium text-muted-foreground">פרטי חשבון</p>
        {[
          { icon: Mail, label: 'דואל', value: user?.email || '—' },
          { icon: Home, label: 'סוג מערכת', value: 'VPP Home + Solar Club' },
          { icon: Zap, label: 'תעריף חשמל', value: '0.61 ₪/kWh' },
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
        <p className="text-xs font-bold text-muted-foreground">מסמכים וחוזים</p>
        {[
          { label: 'סיכום תנאי שירות', icon: FileText },
          { label: 'הסכם חלוקת הכנסות', icon: ExternalLink },
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
        התנתק
      </button>
    </div>
  );
}

// local helper — avoid import cycle
function ChevronLeft({ className }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6"/>
    </svg>
  );
}