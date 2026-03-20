import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Home, Zap, Edit2, Check, LogOut } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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
        פרופיל אישי
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

      {/* Account Info */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
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