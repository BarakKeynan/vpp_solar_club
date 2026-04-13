import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Zap, TrendingUp, TrendingDown, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const weatherData = {
  current: { temp: 32, humidity: 45, wind: 14, uv: 8, irradiance: 620, icon: 'sun', conditionHe: 'שמשי חלקית', conditionEn: 'Partly Sunny' },
  forecast: [
    { dayHe: 'היום', dayEn: 'Today', icon: 'sun', high: 32, low: 22, irradiance: 620, yieldEst: 18.4 },
    { dayHe: 'מחר', dayEn: 'Tomorrow', icon: 'cloud', high: 27, low: 19, irradiance: 310, yieldEst: 8.1 },
    { dayHe: 'יום ג׳', dayEn: 'Wed', icon: 'rain', high: 23, low: 17, irradiance: 180, yieldEst: 4.2 },
    { dayHe: 'יום ד׳', dayEn: 'Thu', icon: 'sun', high: 30, low: 21, irradiance: 580, yieldEst: 16.9 },
  ],
};

const recommendations = {
  he: [
    { icon: '⚡', color: '#10b981', title: 'שעת שיא מחר 18:00–20:00', desc: 'מכור עודפים לרשת — מחיר MCP צפוי ₪1.12/kWh', action: 'הגדר מכירה אוטומטית' },
    { icon: '🔋', color: '#3b82f6', title: 'טען סוללה לפני הגשם', desc: 'מחר ייצור נמוך — טעינה מהרשת עכשיו תבטיח 100% SoC', action: 'הפעל טעינה חכמה' },
    { icon: '🌞', color: '#f59e0b', title: 'חלון ייצור שיא — היום 11:00–14:00', desc: '620 W/m² צפוי. PR מקסימלי. אל תבזבז על חשמל ביתי.', action: 'נהל צריכה' },
  ],
  en: [
    { icon: '⚡', color: '#10b981', title: 'Peak Hour Tomorrow 18:00–20:00', desc: 'Sell surplus to grid — MCP price expected ₪1.12/kWh', action: 'Set Auto-Sell' },
    { icon: '🔋', color: '#3b82f6', title: 'Charge Before Rain', desc: 'Tomorrow low yield — grid charge now ensures 100% SoC', action: 'Enable Smart Charge' },
    { icon: '🌞', color: '#f59e0b', title: 'Peak Production Window Today 11–14', desc: '620 W/m² expected. Max PR. Minimize home usage.', action: 'Manage Consumption' },
  ],
};

function WeatherIcon({ type, size = 5 }) {
  const cls = `w-${size} h-${size}`;
  if (type === 'sun') return <Sun className={`${cls} text-amber-400`} />;
  if (type === 'cloud') return <Cloud className={`${cls} text-slate-400`} />;
  return <CloudRain className={`${cls} text-blue-400`} />;
}

export default function WeatherWidget() {
  const [open, setOpen] = useState(false);
  const { lang } = useLang();
  const isHe = lang === 'he';
  const recs = isHe ? recommendations.he : recommendations.en;
  const w = weatherData.current;

  return (
    <>
      {/* Compact Weather Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between rounded-2xl border border-border px-4 py-3 active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.05))' }}
      >
        <div className="flex items-center gap-3">
          <WeatherIcon type={w.icon} size={6} />
          <div className="text-right">
            <p className="text-sm font-black text-white">{isHe ? w.conditionHe : w.conditionEn}</p>
            <p className="text-[10px] text-white/50">{isHe ? `${w.irradiance} W/m² · UV ${w.uv}` : `${w.irradiance} W/m² · UV ${w.uv}`}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-xl font-black text-white">{w.temp}°C</p>
            <p className="text-[10px] text-emerald-400 font-bold">{isHe ? '3 המלצות AI' : '3 AI Recs'}</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </motion.button>

      {/* Full Weather Modal */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setOpen(false)}>
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-full rounded-t-3xl max-h-[88vh] overflow-y-auto"
              style={{ background: '#0D1420', border: '1px solid rgba(255,255,255,0.08)' }}
              onClick={e => e.stopPropagation()}>
              <div className="p-5 space-y-5">
                {/* Handle */}
                <div className="flex justify-center -mt-1 mb-1">
                  <div className="w-10 h-1 rounded-full bg-white/15" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white">{isHe ? 'תחזית מזג אוויר סולארית' : 'Solar Weather Forecast'}</h2>
                  <button onClick={() => setOpen(false)} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* Current Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { icon: <Thermometer className="w-4 h-4 text-red-400" />, val: `${w.temp}°`, label: isHe ? 'טמפ׳' : 'Temp' },
                    { icon: <Wind className="w-4 h-4 text-blue-400" />, val: `${w.wind}`, label: isHe ? 'רוח km/h' : 'Wind' },
                    { icon: <Sun className="w-4 h-4 text-amber-400" />, val: `${w.irradiance}`, label: 'W/m²' },
                    { icon: <Zap className="w-4 h-4 text-emerald-400" />, val: '18.4', label: isHe ? 'kWh' : 'kWh' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="flex justify-center mb-1">{s.icon}</div>
                      <p className="text-sm font-black text-white">{s.val}</p>
                      <p className="text-[9px] text-white/40">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* 4-Day Forecast */}
                <div>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">{isHe ? 'תחזית 4 ימים' : '4-Day Forecast'}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {weatherData.forecast.map((d, i) => (
                      <div key={i} className={`rounded-xl p-3 text-center space-y-1.5 ${i === 0 ? 'border border-emerald-500/30' : ''}`}
                        style={{ background: d.irradiance < 400 ? 'rgba(245,158,11,0.07)' : 'rgba(16,185,129,0.06)' }}>
                        <p className="text-[10px] font-bold text-white/50">{isHe ? d.dayHe : d.dayEn}</p>
                        <div className="flex justify-center"><WeatherIcon type={d.icon} size={4} /></div>
                        <p className="text-xs font-black text-white">{d.high}°</p>
                        <p className="text-[9px] font-bold" style={{ color: d.irradiance < 400 ? '#f59e0b' : '#10b981' }}>{d.yieldEst} kWh</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recommendations */}
                <div>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-widest mb-3">{isHe ? 'המלצות AI לפי מזג אוויר' : 'AI Weather Recommendations'}</p>
                  <div className="space-y-3">
                    {recs.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="rounded-xl p-4"
                        style={{ background: `${r.color}10`, border: `1px solid ${r.color}30` }}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl mt-0.5">{r.icon}</span>
                          <div className="flex-1">
                            <p className="text-sm font-black text-white mb-1">{r.title}</p>
                            <p className="text-[11px] text-white/55 leading-relaxed mb-2">{r.desc}</p>
                            <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-black active:scale-95 transition-transform"
                              style={{ background: r.color }}>
                              {r.action}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}