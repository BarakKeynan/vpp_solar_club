import React, { useState } from 'react';
import { motion } from 'framer-motion';
import VPPHome from './VPPHome.jsx';
import SolarClub from './SolarClub.jsx';

export default function Dashboard() {
  const [mode, setMode] = useState('home'); // 'home' | 'club'

  return (
    <div className="min-h-screen bg-background">
      {/* Mode Toggle */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 pt-4 pb-3">
        <div className="flex bg-muted rounded-2xl p-1 gap-1">
          <button
            onClick={() => setMode('home')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'home'
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🏠 VPP Home
          </button>
          <button
            onClick={() => setMode('club')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'club'
                ? 'bg-secondary text-secondary-foreground shadow-lg'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ☀️ Solar Club
          </button>
        </div>
      </div>

      {mode === 'home' ? <VPPHome /> : <SolarClub />}
    </div>
  );
}