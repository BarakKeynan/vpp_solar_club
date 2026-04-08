import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Thermometer, Activity, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { toast } from 'sonner';

export default function BatteryDetailModal({ battery, open, onClose, onBookService }) {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [step, setStep] = useState(1); // 1=details, 2=booking

  if (!battery) return null;

  const getHealthStatus = () => {
    if (battery.soh >= 90) return { status: isHe ? 'תקין' : 'Optimal', color: '#10b981', severity: 'optimal' };
    if (battery.soh >= 75) return { status: isHe ? 'בדיקה מומלצת' : 'Check Recommended', color: '#f59e0b', severity: 'warning' };
    return { status: isHe ? 'דחוף - בדיקה נדרשת' : 'Urgent - Check Required', color: '#ef4444', severity: 'critical' };
  };

  const health = getHealthStatus();
  const issues = [];
  
  if (battery.temp > 35) issues.push({ type: 'temperature', label: isHe ? `טמפרטורה גבוהה (${battery.temp}°C)` : `High temperature (${battery.temp}°C)`, color: '#ef4444' });
  if (battery.soh < 85) issues.push({ type: 'degradation', label: isHe ? `ירידה בקיבולת (${battery.soh}%)` : `Capacity degradation (${battery.soh}%)`, color: '#f59e0b' });
  if (battery.cycles > 600) issues.push({ type: 'cycles', label: isHe ? `מחזורים גבוהים (${battery.cycles})` : `High cycle count (${battery.cycles})`, color: '#f59e0b' });

  const handleBook = () => {
    onBookService('battery_checkup');
    toast.success(isHe ? 'הזמנה לבדיקה חשמלאי' : 'Booked electrician checkup');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.78)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-3xl p-5 space-y-4"
            style={{ background: '#0D1420', border: '1px solid rgba(59,130,246,0.2)', borderBottom: 'none', maxHeight: '90vh', overflowY: 'auto', paddingBottom: '100px' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center -mt-1 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl" style={{ background: `${health.color}22` }}>
                  {health.severity === 'optimal' ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: health.color }} />
                  ) : (
                    <AlertTriangle className="w-5 h-5" style={{ color: health.color }} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{battery.brand} {battery.type}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{battery.model}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {step === 1 ? (
              <>
                {/* Health Status */}
                <div
                  className="rounded-xl px-4 py-3"
                  style={{ background: `${health.color}15`, border: `1px solid ${health.color}40` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        {isHe ? 'מצב בריאות' : 'Health Status'}
                      </p>
                      <p className="text-sm font-black text-white mt-1">{health.status}</p>
                    </div>
                    <p className="text-2xl font-black text-white">{battery.soh}%</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Thermometer className={`w-3.5 h-3.5 ${battery.temp > 32 ? 'text-amber-400' : 'text-blue-400'}`} />
                      <span className="text-[9px] text-white/50">{isHe ? 'טמפ' : 'Temp'}</span>
                    </div>
                    <p className="text-sm font-black text-white">{battery.temp}°C</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[9px] text-white/50">{isHe ? 'מחזורים' : 'Cycles'}</span>
                    </div>
                    <p className="text-sm font-black text-white">{battery.cycles}</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[9px] text-white/50">Voltage</span>
                    </div>
                    <p className="text-sm font-black text-white">{battery.voltage}</p>
                  </div>
                </div>

                {/* Issues List */}
                {issues.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {isHe ? 'בעיות זוהו' : 'Detected Issues'}
                    </p>
                    {issues.map(issue => (
                      <div key={issue.type} className="rounded-xl p-3 flex items-start gap-3" style={{ background: `${issue.color}12`, border: `1px solid ${issue.color}40` }}>
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: issue.color }} />
                        <p className="text-sm font-bold text-white">{issue.label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Capacity Info */}
                <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)' }}>
                  <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {isHe ? 'פירוט קיבולת' : 'Capacity Details'}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{isHe ? 'קיבולת נומינלית' : 'Nominal'}</span>
                      <span className="text-xs font-bold text-white">{battery.capacity} kWh</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/60">{isHe ? 'קיבולת פעעלית (SoH)' : 'Actual (SoH)'}</span>
                      <span className="text-xs font-bold text-white">{((battery.soh / 100) * battery.capacity).toFixed(1)} kWh</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${battery.soh}%` }}
                        transition={{ duration: 0.8 }}
                        className={`h-full rounded-full ${battery.soh >= 90 ? 'bg-green-500' : battery.soh >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="rounded-xl p-4 space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {isHe ? 'המלצות' : 'Recommendations'}
                  </p>
                  <ul className="text-xs space-y-1.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {battery.soh < 85 && (
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>{isHe ? 'קביעת בדיקה עם חשמלאי מוסמך' : 'Schedule checkup with certified electrician'}</span>
                      </li>
                    )}
                    {battery.temp > 35 && (
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>{isHe ? 'בדיקת מערכת הקירור' : 'Check cooling system'}</span>
                      </li>
                    )}
                    {battery.cycles > 600 && (
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>{isHe ? 'הערכת דגדוג הסוללה בקרוב' : 'Evaluate battery replacement soon'}</span>
                      </li>
                    )}
                    {battery.soh >= 85 && battery.temp <= 35 && (
                      <li className="flex gap-2">
                        <span>•</span>
                        <span>{isHe ? 'המערכת בתנאי טוב - המשך ניטור קביע' : 'System is in good condition - continue regular monitoring'}</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Book Service Button */}
                {health.severity !== 'optimal' && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBook}
                    className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                  >
                    <Zap className="w-5 h-5" />
                    {isHe ? 'הזמן בדיקה חשמלאי ←' : 'Book Electrician Checkup →'}
                  </motion.button>
                )}
              </>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}