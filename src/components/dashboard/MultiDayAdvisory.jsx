import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Zap, Cloud, Sun, CloudRain } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLang } from '@/lib/i18n';

const forecast = [
  { day: 'היום', dayEn: 'Today', irradiance: 620, temp: 32, yield: 18.4, price: 0.89, icon: 'sun' },
  { day: 'מחר', dayEn: 'Tomorrow', irradiance: 310, temp: 27, yield: 8.1, price: 0.72, icon: 'cloud' },
  { day: 'יום ג׳', dayEn: 'Wed', irradiance: 180, temp: 23, yield: 4.2, price: 0.65, icon: 'rain' },
];

const chartData = [
  { time: '06:00', yield: 2.1, price: 0.54 },
  { time: '09:00', yield: 8.4, price: 0.61 },
  { time: '12:00', yield: 18.4, price: 0.89 },
  { time: '15:00', yield: 14.2, price: 0.95 },
  { time: '18:00', yield: 6.1, price: 1.12 },
  { time: '21:00', yield: 0.0, price: 0.78 },
];

function WeatherIcon({ type }) {
  if (type === 'sun') return <Sun className="w-5 h-5 text-amber-400" />;
  if (type === 'cloud') return <Cloud className="w-5 h-5 text-slate-400" />;
  return <CloudRain className="w-5 h-5 text-blue-400" />;
}

function PRGauge({ value }) {
  const pct = Math.min(100, Math.max(0, value));
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '45px 45px', transition: 'stroke-dasharray 1s ease' }} />
        <text x="45" y="49" textAnchor="middle" fill={color} fontSize="14" fontWeight="900">{pct}%</text>
      </svg>
      <p className="text-[10px] text-white/50 -mt-1">PR Index</p>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2 text-xs" style={{ background: '#0D1420', border: '1px solid rgba(16,185,129,0.3)' }}>
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name === 'yield' ? `⚡ ${p.value} kWh` : `₪ ${p.value}/kWh`}
        </p>
      ))}
    </div>
  );
};

export default function MultiDayAdvisory() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const isHe = lang === 'he';

  // Check if next 48h is cloudy
  const isLowYield = forecast[1].irradiance < 400 && forecast[2].irradiance < 400;

  // PR calculation: assuming ref irradiance 1000 W/m2, P0 = 20kWh peak
  const todayPR = Math.round(((forecast[0].yield / 20) / (forecast[0].irradiance / 1000)) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-xl border p-4 transition-all active:scale-[0.98]"
        style={{
          background: open ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.02)',
          border: open ? '1px solid rgba(16,185,129,0.35)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📡</span>
          <div className="text-right">
            <p className="text-sm font-black text-white">{isHe ? 'ייעוץ רב-יומי דינמי' : 'Dynamic Multi-Day Advisory'}</p>
            <p className="text-[10px] text-white/40">{isHe ? 'תחזית 3 ימים · מדד יעילות · המלצות AI' : '3-Day Forecast · PR Index · AI Actions'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLowYield && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b' }}>⚠️ Alert</span>}
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* 3-Day Weather Forecast */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[11px] font-black text-white/60 uppercase tracking-widest">{isHe ? 'תחזית סולארית' : 'Solar Forecast'}</p>
                <div className="grid grid-cols-3 gap-2">
                  {forecast.map((d, i) => (
                    <div key={i} className="rounded-xl p-3 text-center space-y-1.5"
                      style={{
                        background: d.irradiance < 400 ? 'rgba(245,158,11,0.07)' : 'rgba(16,185,129,0.07)',
                        border: d.irradiance < 400 ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(16,185,129,0.2)',
                      }}>
                      <p className="text-[10px] font-bold text-white/50">{isHe ? d.day : d.dayEn}</p>
                      <WeatherIcon type={d.icon} />
                      <p className="text-xs font-black" style={{ color: d.irradiance < 400 ? '#f59e0b' : '#10b981' }}>
                        {d.irradiance} <span className="text-[8px] font-normal text-white/40">W/m²</span>
                      </p>
                      <p className="text-[10px] text-white/50">{d.temp}°C</p>
                      <p className="text-[10px] font-bold text-white/70">{d.yield} kWh</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* PR Gauge + Stats */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-3">{isHe ? 'מדד יעילות (PR)' : 'Efficiency Index (PR)'}</p>
                <div className="flex items-center gap-4">
                  <PRGauge value={todayPR} />
                  <div className="flex-1 space-y-2">
                    {[
                      { label: 'E_out Today', value: `${forecast[0].yield} kWh`, color: '#10b981' },
                      { label: 'Irradiance', value: `${forecast[0].irradiance} W/m²`, color: '#f59e0b' },
                      { label: 'Reference (G_ref)', value: '1000 W/m²', color: 'rgba(255,255,255,0.4)' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-[10px] text-white/40">{s.label}</span>
                        <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3-Day Yield vs Price Chart */}
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[11px] font-black text-white/60 uppercase tracking-widest mb-3">{isHe ? 'ייצור מול מחיר — היום' : 'Yield vs. Price — Today'}</p>
                <ResponsiveContainer width="100%" height={110}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="yield" name="yield" stroke="#10b981" strokeWidth={1.5} fill="url(#yieldGrad)" dot={false} />
                    <Area type="monotone" dataKey="price" name="price" stroke="#f59e0b" strokeWidth={1.5} fill="url(#priceGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] text-white/40">kWh</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] text-white/40">₪/kWh</span></div>
                </div>
              </div>

              {/* Smart Action Advisory */}
              {isLowYield ? (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl p-4 space-y-2"
                  style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <p className="text-xs font-black text-amber-400 uppercase tracking-wide">Smart Action Advisory</p>
                  </div>
                  <p className="text-sm font-bold text-white leading-snug">
                    {isHe ? '⚠️ תשואה סולארית נמוכה צפויה ל-48 שעות' : '⚠️ Low Solar Yield Detected for 48h'}
                  </p>
                  <div className="rounded-lg px-3 py-2.5 mt-2" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="text-[11px] text-white/60 mb-1 font-bold">Recommended Action:</p>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {isHe
                        ? 'טעינה מהרשת בחלון MCP נמוך — הבטחת 100% SoC לשעת השיא הערבית (18:00–20:00)'
                        : 'Grid Charge at MCP window to secure 100% SoC for evening peak (18:00–20:00)'}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 py-2 rounded-lg text-xs font-black text-black transition-all active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                      {isHe ? 'הפעל טעינה אוטומטית' : 'Auto Grid Charge'}
                    </button>
                    <button className="px-3 py-2 rounded-lg text-xs font-bold text-white/50 transition-all active:scale-95"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {isHe ? 'התעלם' : 'Dismiss'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-wide">Smart Action Advisory</p>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {isHe ? '✅ תנאים אופטימליים לייצור מחר' : '✅ Optimal production conditions ahead'}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {isHe ? 'מכור עודפים לרשת בחלון 12:00–15:00 למחיר מרבי' : 'Sell surplus to grid at 12:00–15:00 window for peak pricing'}
                  </p>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}