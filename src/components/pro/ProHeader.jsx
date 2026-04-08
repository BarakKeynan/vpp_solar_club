import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

export default function ProHeader({ isHe }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString(isHe ? 'he-IL' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{dateStr}</p>
        <h1 className="text-xl font-black text-white mt-0.5">
          {isHe ? 'לוח מחוונים פרו ⚡' : 'Pro Dashboard ⚡'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Bell className="w-4 h-4 text-white/60" />
          </button>
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#080e1a]" />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
          <span className="text-xs font-bold text-white">Omer</span>
          <ChevronDown className="w-3 h-3 text-white/40" />
        </div>
      </div>
    </div>
  );
}