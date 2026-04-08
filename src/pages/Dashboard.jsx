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
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3" style={{ background: 'hsl(222 47% 6% / 0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid hsl(222 30% 18% / 0.6)' }}>
        <div className="flex rounded-2xl p-1 gap-1" style={{ background: 'hsl(222 30% 10%)' }}>
          <button
            onClick={() => setMode('home')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              mode === 'home'
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={mode === 'home' ? {
              background: 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 30%))',
              boxShadow: '0 2px 12px hsl(160 84% 44% / 0.35)'
            } : {}}
          >
            {t('vpp_mode_home')}
          </button>
          <button
            onClick={() => setMode('club')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
              mode === 'club'
                ? 'text-secondary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
            style={mode === 'club' ? {
              background: 'linear-gradient(135deg, hsl(215 60% 44%), hsl(215 60% 36%))',
              boxShadow: '0 2px 12px hsl(215 60% 50% / 0.35)'
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