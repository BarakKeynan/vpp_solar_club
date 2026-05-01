import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VPPHome from './VPPHome.jsx';
import SolarClub from './SolarClub.jsx';
import { useLang } from '@/lib/i18n';

export default function Dashboard() {
  const [mode, setMode] = useState('home'); // 'home' | 'club'
  const { t } = useLang();

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Toggle */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: 'hsl(222 47% 6% / 0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setMode('home')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
              mode === 'home' ? 'text-white' : 'text-white/35 hover:text-white/60'
            }`}
            style={mode === 'home' ? {
              background: 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 28%))',
              boxShadow: '0 2px 16px hsl(160 84% 44% / 0.4)'
            } : {}}
          >
            {t('vpp_mode_home')}
          </button>
          <button
            onClick={() => setMode('club')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all duration-200 ${
              mode === 'club' ? 'text-white' : 'text-white/35 hover:text-white/60'
            }`}
            style={mode === 'club' ? {
              background: 'linear-gradient(135deg, hsl(215 60% 44%), hsl(215 60% 32%))',
              boxShadow: '0 2px 16px hsl(215 60% 50% / 0.4)'
            } : {}}
          >
            {t('vpp_mode_club')}
          </button>
        </div>
      </div>

      {mode === 'home' ? <VPPHome /> : <SolarClub />}
    </div>
  );
}