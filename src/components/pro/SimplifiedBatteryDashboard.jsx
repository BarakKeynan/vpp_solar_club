import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Battery, Car, ChevronLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { useNavigate } from 'react-router-dom';

// Battery data
const BATTERIES = [
  { id: 1, brand: 'BYD', type: 'LFP', capacity: '10 kWh', soh: 96, temp: 28, cycles: 312, status: 'optimal' },
  { id: 2, brand: 'SolarEdge', type: 'Li-Ion', capacity: '9.7 kWh', soh: 83, temp: 34, cycles: 687, status: 'warning' },
];

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
  const navigate = useNavigate();
  const [storageKwh, setStorageKwh] = useState(18.4);
  const [storagePercent, setStoragePercent] = useState(72);
  const [roiTrend, setRoiTrend] = useState([12, 14, 16, 18, 22, 24, 26, 28]);
  const [monthlySavings, setMonthlySavings] = useState(1240);
  const [assetValue, setAssetValue] = useState(12400);
  const [panelHealth, setPanelHealth] = useState(92);
  const [defaultBattery, setDefaultBattery] = useState(BATTERIES[0].id);
  const [showBookTechnician, setShowBookTechnician] = useState(false);
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

  const circumference = 2 * Math.PI * 54;
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
          <div
            className="absolute inset-0 rounded-full blur-3xl opacity-30 animate-pulse"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent)' }}
          />
          
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
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

      {/* Activity Feed */}
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

      {/* ACTION BUTTONS - MAIN PRIORITY */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-3 gap-3"
      >
        <button
          onClick={() => navigate('/charge-battery')}
          className="flex flex-col items-center gap-2 py-4 rounded-lg font-bold text-xs text-white active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.3)' }}
        >
          <Battery className="w-5 h-5 text-emerald-400" />
          <span>{isHe ? 'טען' : 'Charge'}</span>
        </button>
        <button
          onClick={() => navigate('/sell-to-grid')}
          className="flex flex-col items-center gap-2 py-4 rounded-lg font-bold text-xs text-white active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <Zap className="w-5 h-5 text-blue-400" />
          <span>{isHe ? 'מכור' : 'Sell'}</span>
        </button>
        <button
          onClick={() => navigate('/charge-ev')}
          className="flex flex-col items-center gap-2 py-4 rounded-lg font-bold text-xs text-white active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <Car className="w-5 h-5 text-amber-400" />
          <span>{isHe ? 'רכב' : 'EV'}</span>
        </button>
      </motion.div>

      {/* Financial Cards */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
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

      {/* Battery Selection & Management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="text-xs font-bold text-white/60 mb-2">{isHe ? 'בחירת סוללה' : 'Battery Selection'}</p>
        
        {/* Default Battery Radio */}
        <div className="flex gap-2">
          {BATTERIES.map(bat => (
            <button
              key={bat.id}
              onClick={() => setDefaultBattery(bat.id)}
              className="flex-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all"
              style={{
                background: defaultBattery === bat.id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                border: defaultBattery === bat.id ? '1.5px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
                color: defaultBattery === bat.id ? '#93C5FD' : 'rgba(255,255,255,0.6)'
              }}
            >
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{
                borderColor: defaultBattery === bat.id ? '#3B82F6' : 'rgba(255,255,255,0.2)',
              }}>
                {defaultBattery === bat.id && <div className="w-2 h-2 rounded-full bg-blue-400" />}
              </div>
              <span>{bat.brand}</span>
            </button>
          ))}
        </div>

        {/* Battery Cards */}
        <div className="space-y-2 mt-3">
          {BATTERIES.map(bat => (
            <div
              key={bat.id}
              className="rounded-lg p-3 space-y-2 text-right"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Battery className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-white">{bat.brand} {bat.type}</span>
                </div>
                {bat.status === 'optimal' ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)' }}>
                    <span className="text-[9px] font-bold text-emerald-400">{isHe ? '✓ תקין' : '✓ OK'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBookTechnician(true)}
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full text-amber-400 hover:text-amber-300"
                  >
                    {isHe ? '⚠️ טכנאי' : '⚠️ Book'}
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/60">
                <span>{bat.capacity}</span>
                <span>SOH: {bat.soh}% · Temp: {bat.temp}°C</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Panel Health & Technician */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl border border-border p-4"
        style={{ background: 'rgba(255,255,255,0.02)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-white/60">{isHe ? 'בריאות פאנלים' : 'Panel Health'}</p>
          <span className="text-sm font-bold text-blue-400">{panelHealth}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-full rounded-full bg-blue-400" style={{ width: `${panelHealth}%` }} />
        </div>
        {panelHealth < 90 && (
          <button
            onClick={() => setShowBookTechnician(true)}
            className="w-full px-3 py-2 rounded-lg text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {isHe ? '📞 הזמן בדיקת טכנאי' : '📞 Book Technician'}
          </button>
        )}
      </motion.div>

      {/* Solar Farm Card */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => navigate('/farm-detail')}
        className="w-full flex items-center justify-between bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-2xl">☀️</span>
          <div>
            <p className="text-sm font-bold text-white">{isHe ? 'החווה הסולארית שלי' : 'My Solar Farm'}</p>
            <p className="text-xs text-white/40">{isHe ? 'גלבוע פאוור · 3 יחידות · ROI 10.4%' : 'Gilboa Power · 3 units · ROI 10.4%'}</p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-white/40" />
      </motion.button>

      {/* Technician Booking Modal */}
      {showBookTechnician && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end z-50"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="w-full rounded-t-2xl p-6 space-y-4"
            style={{ background: '#0d1829', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-white">
                {isHe ? 'הזמנת טכנאי' : 'Book Technician'}
              </h2>
              <button
                onClick={() => setShowBookTechnician(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <input
                type="date"
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <input
                type="time"
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <textarea
                placeholder={isHe ? 'הערה אופציונלית...' : 'Optional note...'}
                className="w-full rounded-lg px-4 py-3 text-white"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                rows="3"
              />
            </div>

            <button
              onClick={() => { setShowBookTechnician(false); }}
              className="w-full px-4 py-3 rounded-lg font-bold text-white"
              style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1))', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              {isHe ? 'אשר הזמנה' : 'Confirm Booking'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}