import React from 'react';
import { LayoutDashboard, Cpu, Users, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV = [
  { id: 'overview',   icon: LayoutDashboard },
  { id: 'assets',     icon: Cpu },
  { id: 'community',  icon: Users },
  { id: 'settings',   icon: Settings },
];

const LABELS = {
  he: { overview: 'סקירה', assets: 'נכסים', community: 'קהילה', settings: 'הגדרות' },
  en: { overview: 'Overview', assets: 'My Assets', community: 'Community', settings: 'Settings' },
};

export default function ProSidebar({ activeTab, setActiveTab, isHe }) {
  const lang = isHe ? 'he' : 'en';
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen"
      style={{ background: '#0b1220', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#3b82f6)' }}>
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-black text-white leading-none">VPP Solar</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Pro Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {NAV.map(({ id, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                active ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              style={active ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' } : {}}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : ''}`} />
              {LABELS[lang][id]}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-4 py-5">
        <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <p className="text-[10px] font-black text-emerald-400 mb-0.5">AI Autopilot</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'מסחר אוטונומי פעיל' : 'Autonomous trading active'}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-bold">LIVE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}