import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Battery } from 'lucide-react';
import { useLang } from '@/lib/i18n';

// Sparkline component
function Sparkline({ data }) {
  const width = 80;
  const height = 30;
  const maxValue = Math.max(...data);
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (val / maxValue) * height * 0.8
  }));
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <svg width={width} height={height} className="stroke-emerald-400" strokeWidth="1.5" fill="none" viewBox={`0 0 ${width} ${height}`}>
      <path d={pathD} />
    </svg>
  );
}

export default function SimplifiedBatteryDashboard({ isHe }) {
  const [storageKwh, setStorageKwh] = useState(18.4);
  const [storagePercent, setStoragePercent] = useState(72);
  const [roiTrend, setRoiTrend] = useState([12, 14, 16, 18, 22, 24, 26, 28]);
  const [monthlySavings, setMonthlySavings] = useState(1240);
  const [assetValue, setAssetValue] = useState(12400);
  const [lastActivity, setLastActivity] = useState([
    { icon: '📉', label: isHe ? 'קניה בתעריף נמוך' : 'Buying Low', value: '₪0.54/kWh', time: '2 דק' },
    { icon: '📈', label: isHe ? 'מכירה בשיא' : 'Selling Peak', value: '₪0.89/kWh', time: 'עכשיו' }
  ]);

  // Simulate slight value updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMonthlySavings(prev => prev + Math.random() * 2);
      setAssetValue(prev => prev + Math.random() * 5);
      setRoiTrend(prev => [...prev.slice(1), prev[prev.length - 1] + (Math.random() * 2 - 0.5)]);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 54; // r=54
  const strokeDashoffset = circumference - (storagePercent / 100) * circumference;

  return (
    <div className="p-5 space-y-6 pb-28">
      {/* Header with AI Status */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {new Date().toLocaleDateString(isHe ? 'he-IL' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <h1 className="text-xl font-black text-white mt-1">
            {isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400">
            {isHe ? 'AI פעיל' : 'AI Active'}
          </span>
        </div>
      </motion.div>

      {/* Main Circular Battery Gauge */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-center mb-8"
      >
        <div className="relative w-48 h-48">
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent)' }}
          />
          
          {/* SVG Circle */}
          <svg className="w-full h-full" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-4xl font-black text-emerald-400">{storagePercent}%</p>
            <p className="text-sm text-white mt-1 font-bold">{storageKwh.toFixed(1)} kWh</p>
            <div className="flex items-center gap-1 mt-2 px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)' }}>
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-bold text-emerald-400">LIVE</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Status with Sparkline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div>
          <p className="text-xs text-white/60 mb-1">{isHe ? 'סטטוס AI' : 'AI Status'}</p>
          <p className="text-sm font-bold text-white">
            {isHe ? 'אסטרטגיית ארביטראז׳ פעילה' : 'Active Arbitrage Strategy'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkline data={roiTrend} />
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
      </motion.div>

      {/* Activity Feed - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {lastActivity.map((activity, idx) => (
          <div
            key={idx}
            className="rounded-lg px-3 py-2"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{activity.icon}</span>
              <span className="text-xs font-bold text-white/80">{activity.label}</span>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold">{activity.value}</p>
            <p className="text-[9px] text-white/40 mt-0.5">{activity.time}</p>
          </div>
        ))}
      </motion.div>

      {/* Financial Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Monthly Savings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl px-4 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
            border: '1px solid rgba(16,185,129,0.3)'
          }}
        >
          <p className="text-[10px] text-white/60 mb-2">{isHe ? 'חיסכון חודשי' : 'Monthly Savings'}</p>
          <p className="text-2xl font-black text-emerald-400">₪{monthlySavings.toFixed(0)}</p>
          <p className="text-[9px] text-white/40 mt-1.5">
            {isHe ? '+ ₪87 מסחר AI' : '+ ₪87 from AI'}
          </p>
        </motion.div>

        {/* Asset Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl px-4 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
            border: '1px solid rgba(59,130,246,0.3)'
          }}
        >
          <p className="text-[10px] text-white/60 mb-2">{isHe ? 'ערך הנכס' : 'Asset Value'}</p>
          <p className="text-2xl font-black text-blue-400">₪{assetValue.toFixed(0)}</p>
          <p className="text-[9px] text-white/40 mt-1.5">
            {isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}
          </p>
        </motion.div>
      </div>

      {/* Quick Action */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full rounded-xl px-4 py-3 font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))',
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981'
        }}
      >
        <Battery className="w-4 h-4" />
        {isHe ? 'צפה בהיסטוריית סחר' : 'View Trade History'}
      </motion.button>
    </div>
  );
}