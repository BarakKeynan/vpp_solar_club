import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Battery, Sun, BarChart2, ShieldCheck, Settings, Store } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLang } from '@/lib/i18n';

const virtualBatteryLevel = 73; // %

const financialDataHe = [
  { month: 'ינו', savings: 320, revenue: 180 }, { month: 'פבר', savings: 410, revenue: 220 },
  { month: 'מרץ', savings: 380, revenue: 260 }, { month: 'אפר', savings: 520, revenue: 310 },
  { month: 'מאי', savings: 610, revenue: 390 }, { month: 'יונ', savings: 580, revenue: 420 },
];
const financialDataEn = [
  { month: 'Jan', savings: 320, revenue: 180 }, { month: 'Feb', savings: 410, revenue: 220 },
  { month: 'Mar', savings: 380, revenue: 260 }, { month: 'Apr', savings: 520, revenue: 310 },
  { month: 'May', savings: 610, revenue: 390 }, { month: 'Jun', savings: 580, revenue: 420 },
];

const getAssets = (isHe) => [
  { id: 'negev1', name: isHe ? 'נגב סולאר A' : 'Negev Solar A', icon: '☀️', shares: 3, income: isHe ? '₪427/חודש' : '₪427/mo', yield: '9.8%', status: 'active' },
  { id: 'carmel1', name: isHe ? 'כרמל גרין' : 'Carmel Green', icon: '🌿', shares: 1, income: isHe ? '₪77/חודש' : '₪77/mo', yield: '7.6%', status: 'active' },
  { id: 'galilee1', name: isHe ? 'גליל אנרגיה' : 'Galilee Energy', icon: '🌊', shares: 2, income: isHe ? '₪197/חודש' : '₪197/mo', yield: '8.4%', status: 'active' },
];

const getSmartTrades = (isHe) => [
  { label: isHe ? 'מכירה לרשת' : 'Grid Sales', active: true, color: '#10B981' },
  { label: isHe ? 'טעינת סוללה' : 'Battery Charge', active: false, color: '#3B82F6' },
  { label: isHe ? 'איזון עומסים' : 'Load Balancing', active: true, color: '#F59E0B' },
];

const getRegulations = (isHe) => [
  { label: isHe ? 'רישוי רשות החשמל' : 'Electricity Authority License', status: isHe ? 'תקין' : 'Valid', ok: true },
  { label: 'IEC 62109', status: isHe ? 'מאושר' : 'Approved', ok: true },
  { label: isHe ? 'חוזה VPP פעיל' : 'Active VPP Contract', status: isHe ? 'פעיל' : 'Active', ok: true },
  { label: isHe ? 'ביטוח מערכת' : 'System Insurance', status: isHe ? 'בתוקף' : 'Valid', ok: true },
];

const getNavItems = (isHe) => [
  { key: 'assets', icon: BarChart2, label: isHe ? 'נכסים' : 'Assets' },
  { key: 'marketplace', icon: Store, label: isHe ? 'מרקט' : 'Market' },
  { key: 'settings', icon: Settings, label: isHe ? 'הגדרות' : 'Settings' },
];

export default function VPPClubDashboard() {
  const { t, lang } = useLang();
  const isHe = lang === 'he';
  const [activeNav, setActiveNav] = useState('assets');

  const assets = getAssets(isHe);
  const smartTrades = getSmartTrades(isHe);
  const regulations = getRegulations(isHe);
  const NAV_ITEMS = getNavItems(isHe);
  const financialData = isHe ? financialDataHe : financialDataEn;

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
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'אנרגיה כנכס — לוח מחוונים מקצועי' : 'Energy as an Asset — Pro Dashboard'}</p>
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
            <span className="text-sm font-black text-white">{isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}</span>
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
            <span className="text-xs font-black" style={{ color: 'rgba(255,255,255,0.5)' }}>{isHe ? 'נכסי אנרגיה קהילתיים' : 'Community Energy Assets'}</span>
            <span className="text-xs font-black text-emerald-400">{isHe ? 'סה״כ' : 'Total'}: ₪{totalIncome}/{isHe ? 'חודש' : 'mo'}</span>
          </div>
          {assets.map((asset, i) => (
            <motion.div key={asset.id} initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-2xl">{asset.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{asset.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{asset.shares} {isHe ? 'מניות' : 'shares'} · {isHe ? 'תשואה' : 'yield'} {asset.yield}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{asset.income}</p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{isHe ? 'פעיל' : 'Active'}</p>
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
          <p className="text-sm font-bold text-white mb-1">{isHe ? 'מרקטפלייס אנרגיה' : 'Energy Marketplace'}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'עבור לדף המרקטפלייס לרכישת מניות' : 'Go to the Marketplace to buy shares'}</p>
        </motion.div>
      )}

      {activeNav === 'settings' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Settings className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.2)' }} />
          <p className="text-sm font-bold text-white mb-1">{isHe ? 'הגדרות VPP' : 'VPP Settings'}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'עבור להגדרות לניהול העדפות המערכת' : 'Go to settings to manage system preferences'}</p>
        </motion.div>
      )}

      {/* Financial Analytics */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-black text-white">{isHe ? 'ניתוח פיננסי — חיסכון vs הכנסת רשת' : 'Financial Analytics — Savings vs Grid Revenue'}</span>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /><span style={{ color: 'rgba(255,255,255,0.5)' }}>{isHe ? 'חיסכון' : 'Savings'}</span></div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span style={{ color: 'rgba(255,255,255,0.5)' }}>{isHe ? 'הכנסת רשת' : 'Grid Revenue'}</span></div>
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
          <span className="text-xs font-black text-white">{isHe ? 'סטטוס רגולטורי' : 'Regulatory Status'}</span>
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