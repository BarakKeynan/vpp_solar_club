import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Battery, Sun, BarChart2, ShieldCheck, Settings, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLang } from '@/lib/i18n';

const virtualBatteryLevel = 73; // %

const financialData = [
  { month: 'ינו', savings: 320, revenue: 180 },
  { month: 'פבר', savings: 410, revenue: 220 },
  { month: 'מרץ', savings: 380, revenue: 260 },
  { month: 'אפר', savings: 520, revenue: 310 },
  { month: 'מאי', savings: 610, revenue: 390 },
  { month: 'יונ', savings: 580, revenue: 420 },
];

const assets = [
  { id: 'negev1', name: 'נגב סולאר A', icon: '☀️', shares: 3, income: '₪427/חודש', yield: '9.8%', status: 'active' },
  { id: 'carmel1', name: 'כרמל גרין', icon: '🌿', shares: 1, income: '₪77/חודש', yield: '7.6%', status: 'active' },
  { id: 'galilee1', name: 'גליל אנרגיה', icon: '🌊', shares: 2, income: '₪197/חודש', yield: '8.4%', status: 'active' },
];

const smartTrades = [
  { label: 'מכירה לרשת', active: true, color: '#10B981' },
  { label: 'טעינת סוללה', active: false, color: '#3B82F6' },
  { label: 'איזון עומסים', active: true, color: '#F59E0B' },
];

const regulations = [
  { label: 'רישוי רשות החשמל', status: 'תקין', ok: true },
  { label: 'תקן IEC 62109', status: 'מאושר', ok: true },
  { label: 'חוזה VPP פעיל', status: 'פעיל', ok: true },
  { label: 'ביטוח מערכת', status: 'בתוקף', ok: true },
];

const NAV_ITEMS = [
  { key: 'assets', icon: BarChart2, label: 'נכסים' },
  { key: 'marketplace', icon: Store, label: 'מרקט' },
  { key: 'settings', icon: Settings, label: 'הגדרות' },
];

export default function VPPClubDashboard() {
  const { t } = useLang();
  const [activeNav, setActiveNav] = useState('assets');

  const totalIncome = assets.reduce((sum, a) => {
    const val = parseInt(a.income.replace(/[^0-9]/g, ''));
    return sum + val;
  }, 0);

  return (
    <div className="min-h-screen pb-28 p-4 space-y-4" style={{ background: '#080C1A' }}>
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-black text-white">VPP Solar Club</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>אנרגיה כנכס — לוח מחוונים מקצועי</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Autopilot ON
        </div>
      </motion.div>

      {/* Virtual Battery Gauge */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(8,12,26,0.9))', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-black text-white">סוללה וירטואלית</span>
          </div>
          <span className="text-2xl font-black text-emerald-400">{virtualBatteryLevel}%</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#10B981,#34D399)' }}
            initial={{ width: 0 }}
            animate={{ width: `${virtualBatteryLevel}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>0 kWh</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>12.5 kWh</span>
        </div>
      </motion.div>

      {/* Smart Trade Automations */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-white">Smart-Trade Automation</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {smartTrades.map(trade => (
            <div key={trade.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
              style={{
                background: trade.active ? `${trade.color}18` : 'rgba(255,255,255,0.05)',
                border: `1px solid ${trade.active ? trade.color + '40' : 'rgba(255,255,255,0.1)'}`,
                color: trade.active ? trade.color : 'rgba(255,255,255,0.35)',
              }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: trade.active ? trade.color : 'rgba(255,255,255,0.2)' }} />
              {trade.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sidebar Nav */}
      <div className="flex gap-2">
        {NAV_ITEMS.map(item => (
          <button key={item.key} onClick={() => setActiveNav(item.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: activeNav === item.key ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
              border: activeNav === item.key ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.08)',
              color: activeNav === item.key ? '#10B981' : 'rgba(255,255,255,0.4)',
            }}>
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Portfolio Assets */}
      {activeNav === 'assets' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>נכסי אנרגיה קהילתיים</span>
            <span className="text-xs font-black text-emerald-400">סה״כ: ₪{totalIncome}/חודש</span>
          </div>
          {assets.map((asset, i) => (
            <motion.div key={asset.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-2xl">{asset.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{asset.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{asset.shares} מניות · תשואה {asset.yield}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{asset.income}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>פעיל</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {activeNav === 'marketplace' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Store className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.2)' }} />
          <p className="text-sm font-bold text-white mb-1">מרקטפלייס אנרגיה</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>עבור לדף המרקטפלייס לרכישת מניות</p>
        </motion.div>
      )}

      {activeNav === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Settings className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.2)' }} />
          <p className="text-sm font-bold text-white mb-1">הגדרות VPP</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>עבור להגדרות לניהול העדפות המערכת</p>
        </motion.div>
      )}

      {/* Financial Analytics */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-black text-white">ניתוח פיננסי — חיסכון vs הכנסת רשת</span>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span style={{ color: 'rgba(255,255,255,0.5)' }}>חיסכון</span></div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span style={{ color: 'rgba(255,255,255,0.5)' }}>הכנסת רשת</span></div>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={financialData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
            />
            <Bar dataKey="savings" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Regulatory Status */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-black text-white">סטטוס רגולטורי</span>
        </div>
        {regulations.map(reg => (
          <div key={reg.label} className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{reg.label}</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}>
              ✓ {reg.status}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}