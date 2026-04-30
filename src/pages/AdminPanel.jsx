import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Plus, Save, Loader2, CheckCircle2, ChevronLeft, UserPlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useIsAdmin } from '@/lib/useIsAdmin';
import { useNavigate } from 'react-router-dom';

const SUPER_ADMINS = [
  { email: 'barak@vppsolarclub.com', name: 'Barak Keynan' },
  { email: 'liav@vppsolarclub.com', name: 'Liav' },
];

function UserRow({ u, onSave }) {
  const [siteId, setSiteId] = useState(u.site_id || '');
  const [capacity, setCapacity] = useState(u.battery_capacity_kwh || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.User.update(u.id, {
      site_id: siteId,
      battery_capacity_kwh: capacity ? Number(capacity) : null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave && onSave();
  };

  return (
    <div className="rounded-xl p-4 space-y-3"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-white">{u.full_name || '(No name)'}</p>
          <p className="text-xs text-white/40">{u.email}</p>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-primary/15 text-primary border border-primary/30">
          {u.role || 'client'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 font-bold">Site ID</label>
          <input
            type="text"
            value={siteId}
            onChange={e => setSiteId(e.target.value)}
            placeholder="e.g. SE12345"
            className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-white/40 font-bold">Battery (kWh)</label>
          <input
            type="number"
            value={capacity}
            onChange={e => setCapacity(e.target.value)}
            placeholder="e.g. 10"
            className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
        style={{
          background: saved ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.1)',
          color: saved ? '#34d399' : '#38bdf8',
          border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.25)'}`
        }}
      >
        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Customer Data'}
      </button>
    </div>
  );
}

function InviteButton({ role, label, color }) {
  const handleInvite = async () => {
    const email = window.prompt(`Enter ${role} email to invite:`);
    if (!email) return;
    await base44.users.inviteUser(email, role === 'admin' ? 'admin' : 'user');
    alert(`Invitation sent to ${email}`);
  };

  return (
    <button
      onClick={handleInvite}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
      style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
    >
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await base44.entities.User.list('-created_date', 100);
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!adminLoading && !isAdmin) navigate('/more', { replace: true });
    if (!adminLoading && isAdmin) fetchUsers();
  }, [isAdmin, adminLoading]);

  if (adminLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  if (!isAdmin) return null;

  // Clients = anyone NOT in the super admin list
  const superAdminEmails = SUPER_ADMINS.map(a => a.email);
  const clients = users.filter(u => !superAdminEmails.includes(u.email));

  return (
    <div className="min-h-screen pb-28 p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/more')}
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ChevronLeft className="w-4 h-4 text-white/60" />
        </button>
        <div>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-violet-400" /> Admin Panel
          </h1>
          <p className="text-xs text-white/30">Super-Admin only · Hidden from clients</p>
        </div>
      </div>

      {/* Admins — hardcoded super admins, always visible */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <p className="text-xs font-bold text-violet-400">Super Admins ({SUPER_ADMINS.length})</p>
          </div>
          <InviteButton role="admin" label="הזמן אדמין" color="#a78bfa" />
        </div>
        <div className="divide-y divide-white/5">
          {SUPER_ADMINS.map(admin => (
            <div key={admin.email} className="flex items-center gap-3 px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-black text-violet-400">
                {admin.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">{admin.name}</p>
                <p className="text-[10px] text-white/35">{admin.email}</p>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">
                Super Admin
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <p className="text-xs font-bold text-white/60">Clients ({clients.length})</p>
          </div>
          <InviteButton role="user" label="הזמן לקוח" color="#38bdf8" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <UserPlus className="w-8 h-8 text-white/10 mx-auto" />
            <p className="text-xs text-white/30">אין לקוחות עדיין. לחץ "הזמן לקוח" להוספה.</p>
          </div>
        ) : (
          clients.map(u => <UserRow key={u.id} u={u} onSave={fetchUsers} />)
        )}
      </div>
    </div>
  );
}