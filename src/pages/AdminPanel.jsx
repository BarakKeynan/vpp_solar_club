import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Save, Loader2, CheckCircle2, ChevronLeft, ChevronDown, ChevronUp, Phone, Wifi, Bluetooth, MapPin, Cpu } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useIsAdmin } from '@/lib/useIsAdmin';
import { useNavigate } from 'react-router-dom';

const BESS_BRANDS = ['SolarEdge', 'Tesla Powerwall', 'BYD', 'LG Energy', 'Sungrow', 'Huawei', 'Other'];

const CONNECTION_METHODS = [
  { key: 'internet_api', icon: Wifi,      label: 'Internet API' },
  { key: 'bluetooth',    icon: Bluetooth,  label: 'Bluetooth'    },
  { key: 'gps',          icon: MapPin,     label: 'GPS'          },
  { key: 'wifi_local',   icon: Wifi,       label: 'WiFi Local'   },
  { key: 'modbus',       icon: Cpu,        label: 'Modbus'       },
];

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-white/40 font-bold block">{label}</label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none"
      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
    />
  );
}

function UserRow({ u, onSave }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone:                u.phone || '',
    site_id:              u.site_id || '',
    battery_capacity_kwh: u.battery_capacity_kwh || '',
    bess_brand:           u.bess_brand || '',
    bess_api_key:         u.bess_api_key || '',
    bess_connection_method: u.bess_connection_method || 'internet_api',
    bess_serial_number:   u.bess_serial_number || '',
  });

  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.User.update(u.id, {
      phone:                form.phone || null,
      site_id:              form.site_id || null,
      battery_capacity_kwh: form.battery_capacity_kwh ? Number(form.battery_capacity_kwh) : null,
      bess_brand:           form.bess_brand || null,
      bess_api_key:         form.bess_api_key || null,
      bess_connection_method: form.bess_connection_method || null,
      bess_serial_number:   form.bess_serial_number || null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    onSave && onSave();
  };

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>

      {/* Header row — always visible */}
      <button onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary">
            {(u.full_name || u.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-white">{u.full_name || '(No name)'}</p>
            <p className="text-[10px] text-white/35">{u.email}</p>
            {u.phone && <p className="text-[10px] text-white/30 flex items-center gap-1"><Phone className="w-2.5 h-2.5" />{u.phone}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {u.bess_brand && (
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
              {u.bess_brand}
            </span>
          )}
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">

          {/* Contact */}
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">📞 Contact</div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Mobile Phone">
              <TextInput value={form.phone} onChange={set('phone')} placeholder="050-0000000" type="tel" />
            </Field>
            <Field label="Site ID (SolarEdge)">
              <TextInput value={form.site_id} onChange={set('site_id')} placeholder="SE12345" />
            </Field>
          </div>

          {/* BESS System */}
          <div className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-2 mb-1">🔋 BESS System</div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Battery Brand">
              <select value={form.bess_brand} onChange={e => set('bess_brand')(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <option value="">בחר מותג</option>
                {BESS_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Capacity (kWh)">
              <TextInput value={form.battery_capacity_kwh} onChange={set('battery_capacity_kwh')} placeholder="e.g. 10" type="number" />
            </Field>
          </div>

          <Field label="API Key (SolarEdge / BESS)">
            <TextInput value={form.bess_api_key} onChange={set('bess_api_key')} placeholder="API key from monitoring portal" />
          </Field>

          <Field label="Serial Number">
            <TextInput value={form.bess_serial_number} onChange={set('bess_serial_number')} placeholder="Inverter / Battery S/N" />
          </Field>

          {/* Connection method */}
          <Field label="אמצעי חיבור למערכת">
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {CONNECTION_METHODS.map(({ key, icon: Icon, label }) => (
                <button key={key} type="button"
                  onClick={() => set('bess_connection_method')(key)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                  style={{
                    background: form.bess_connection_method === key ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${form.bess_connection_method === key ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: form.bess_connection_method === key ? '#34d399' : 'rgba(255,255,255,0.35)',
                  }}>
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </Field>

          {/* Save */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 mt-1"
            style={{
              background: saved ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.1)',
              color: saved ? '#34d399' : '#38bdf8',
              border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.25)'}`,
            }}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? 'Saving...' : saved ? '✅ Saved!' : 'Save Customer Data'}
          </button>
        </div>
      )}
    </div>
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

  const clients = users.filter(u => u.role !== 'admin');
  const admins = users.filter(u => u.role === 'admin');

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
          <p className="text-xs text-white/30">Admin-only · Hidden from clients</p>
        </div>
      </div>

      {/* Cloud Connection Status */}
      <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
        <div>
          <p className="text-xs font-bold text-emerald-400">Cloud Connection: Secure (Static IP via Noga)</p>
          <p className="text-[10px] text-white/30">Simulation Mode Active · Morning/Grow API pending key</p>
        </div>
      </div>

      {/* Admins */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <Shield className="w-3.5 h-3.5 text-violet-400" />
          <p className="text-xs font-bold text-violet-400">Admins ({admins.length})</p>
        </div>
        <div className="divide-y divide-white/5">
          {admins.map(u => (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-black text-violet-400">
                {(u.full_name || u.email || '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{u.full_name || '—'}</p>
                <p className="text-[10px] text-white/35">{u.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <p className="text-xs font-bold text-white/60">Clients ({clients.length})</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <p className="text-xs text-white/30 text-center py-8">No clients yet. They'll appear here after first login.</p>
        ) : (
          clients.map(u => <UserRow key={u.id} u={u} onSave={fetchUsers} />)
        )}
      </div>
    </div>
  );
}