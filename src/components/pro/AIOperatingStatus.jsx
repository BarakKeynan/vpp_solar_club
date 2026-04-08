import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Radio, TrendingUp, Zap } from 'lucide-react';

const LIVE_LOGS = [
  { id: 1, time: '18:42', action: 'Selling peak rate', detail: 'Selling at ₪0.89/kWh', color: '#10b981' },
  { id: 2, time: '18:35', action: 'Buying low rate', detail: 'Acquired at ₪0.54/kWh', color: '#3b82f6' },
  { id: 3, time: '18:28', action: 'Portfolio rebalanced', detail: 'Battery health protected', color: '#f59e0b' },
];

export default function AIOperatingStatus({ isHe }) {
  const [isActive, setIsActive] = useState(true);
  const [todayProfit, setTodayProfit] = useState(847);
  const [liveLog, setLiveLog] = useState(LIVE_LOGS);

  useEffect(() => {
    // Simulate live updates every 8 seconds
    const interval = setInterval(() => {
      setTodayProfit(p => p + Math.floor(Math.random() * 15 + 5));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl p-5 mb-5"
      style={{
        background: isActive
          ? 'linear-gradient(145deg,rgba(16,185,129,0.1),rgba(16,185,129,0.04))'
          : 'linear-gradient(145deg,#0d1829,#0b1220)',
        border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(59,130,246,0.2)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-xl blur-lg"
              style={{ background: isActive ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.2)' }}
            />
            <div
              className="relative w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: isActive ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.15)' }}
            >
              <BrainCircuit className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-blue-400'}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white">
                {isHe ? 'סטטוס AI' : 'AI Operating Status'}
              </p>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: isActive ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.1)' }}>
                <Radio className={`w-2 h-2 ${isActive ? 'text-emerald-400 fill-emerald-400' : 'text-blue-400 fill-blue-400'} animate-pulse`} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-blue-400'}`}>
                  {isHe ? (isActive ? 'פעיל' : 'במצב המתנה') : (isActive ? 'Active' : 'Standby')}
                </span>
              </div>
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {isHe ? 'אופטימיזציה בזמן אמת לרוב ROI' : 'Real-time optimization for max ROI'}
            </p>
          </div>
        </div>

        {/* Today's profit */}
        <div className="text-right">
          <p className="flex items-center gap-1 justify-end text-xs font-black text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            +₪{todayProfit}
          </p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {isHe ? 'רווח היום' : "Today's profit"}
          </p>
        </div>
      </div>

      {/* Status bar */}
      {isActive && (
        <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(16,185,129,0.1)' }}>
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: ['20%', '90%', '20%'] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      )}

      {/* Live Log */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
          {isHe ? 'עסקאות בזמן אמת' : 'Live Trading Log'}
        </p>
        {liveLog.map((log, idx) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: isHe ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="rounded-lg px-3 py-2 flex items-center justify-between text-xs"
            style={{ background: `${log.color}12`, border: `1px solid ${log.color}30` }}
          >
            <div className="flex items-center gap-2 flex-1">
              <Zap className="w-3 h-3" style={{ color: log.color }} />
              <div className={isHe ? 'text-right' : 'text-left'}>
                <p style={{ color: log.color }} className="font-bold">
                  {log.action}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)' }}>{log.detail}</p>
              </div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)' }} className="text-[9px] ml-2">
              {log.time}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Footer badge */}
      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center gap-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
        <span>🔒 AES-256 Encrypted</span>
        <span>•</span>
        <span>📊 Real-time Data</span>
        <span>•</span>
        <span>⚡ Optimized ROI</span>
      </div>
    </motion.div>
  );
}