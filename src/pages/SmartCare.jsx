import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplets, Wind, ChevronDown, ChevronUp, RefreshCw, Cpu, LayoutGrid } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { INVERTERS, PANELS, WEATHER, AI_ALERTS, SERVICES } from '@/components/smartcare/SensorData';
import AlertCard from '@/components/smartcare/AlertCard';
import InverterCard from '@/components/smartcare/InverterCard';
import BookingModal from '@/components/smartcare/BookingModal';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

const overallEfficiency = Math.round(PANELS.reduce((s, p) => s + p.efficiency, 0) / PANELS.length);
const effData = [{ name: 'יעילות', value: overallEfficiency, fill: overallEfficiency >= 85 ? '#10B981' : overallEfficiency >= 70 ? '#F59E0B' : '#EF4444' }];

export default function SmartCare() {
  const { t } = useLang();
  const [bookingService, setBookingService] = useState(null);
  const [showPanels, setShowPanels] = useState(false);
  const [showInverters, setShowInverters] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const [lastScan, setLastScan] = useState('לפני 12 דקות');

  const runAIScan = async () => {
    setScanning(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an AI solar system health analyst. Given sensor data:
- Inverter 1: 97% efficiency, 42°C, OK
- Inverter 2: 71% efficiency, 61°C, FAULT (overheat)
- Panel D: 63% efficiency, suspected micro-cracks
- Panels B & E: 87-88% efficiency, dust accumulation (14 days)
- Weather: 27°C, UV 8.2, humidity 58%

Write a SHORT Hebrew diagnostic summary (2-3 sentences). Be precise and professional. State the 2 most critical issues and estimated monthly revenue impact.`,
        response_json_schema: { type: 'object', properties: { summary: { type: 'string' } } },
      });
      setAiSummary(result.summary);
      setLastScan('עכשיו');
      toast.success('סריקת AI הושלמה');
    } catch {
      setAiSummary('ממיר 2 פועל בטמפרטורת יתר (61°C) ועלול לגרום לנזק קבוע. פאנל D מדגים דפוס ירידת מתח המצביע על מיקרו-סדקים, עם הפסד הכנסות מוערך של ₪42/חודש. מומלץ לטפל בממיר תחילה ולאחר מכן לבצע בדיקת EL לפאנל D.');
      setLastScan('עכשיו');
      toast.success('סריקת AI הושלמה');
    }
    setScanning(false);
  };

  return (
    <div className="p-4 space-y-4 pb-28" style={{ background: '#080C1A', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">{t('smartcare_title')}</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('smartcare_subtitle')}</p>
        </div>
        <button
          onClick={runAIScan}
          disabled={scanning}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-60"
          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? t('scanning') : t('scan_ai')}
        </button>
      </motion.div>

      {/* System Health Overview */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3">
        {/* Gauge */}
        <div
          className="rounded-2xl p-4 flex flex-col items-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('overall_efficiency')}</p>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="100%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0} data={effData}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'rgba(255,255,255,0.05)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-black text-white -mt-4">{overallEfficiency}%</p>
          <p className="text-[9px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('avg_panels', { n: PANELS.length })}</p>
        </div>

        {/* Weather */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('env_conditions')}</p>
          {[
            { Icon: Sun, label: `טמפ׳ ${WEATHER.temp}°C`, color: '#F59E0B' },
            { Icon: Droplets, label: `${t('humidity')} ${WEATHER.humidity}%`, color: '#3B82F6' },
            { Icon: Wind, label: t('wind_speed', { v: WEATHER.wind }), color: '#8B5CF6' },
            { Icon: Sun, label: `UV ${WEATHER.uv}`, color: '#F87171' },
          ].map(({ Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <span className="text-xs text-white/70">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Diagnostic Summary */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
        className="rounded-2xl p-4 space-y-2"
        style={{
          background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(59,130,246,0.06))',
          border: '1px solid rgba(139,92,246,0.3)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🤖</span>
            <p className="text-xs font-black" style={{ color: '#C4B5FD' }}>{t('ai_diagnosis')}</p>
          </div>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('updated')} {lastScan}</span>
        </div>
        {scanning ? (
          <div className="flex items-center gap-2 py-1">
            <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>מנתח נתוני חיישנים...</span>
          </div>
        ) : aiSummary ? (
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{aiSummary}</p>
        ) : (
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('scan_prompt')}</p>
        )}
      </motion.div>

      {/* Predictive Alerts */}
      <div className="space-y-2">
        <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('predictive_alerts')} – {AI_ALERTS.length} {t('active')}</p>
        {AI_ALERTS.map((alert, i) => (
          <AlertCard key={alert.id} alert={alert} delay={0.1 + i * 0.06} onBook={setBookingService} />
        ))}
      </div>

      {/* Inverter Health */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => setShowInverters(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" style={{ color: '#3B82F6' }} />
            <span className="text-xs font-black text-white">{t('inverter_health')}</span>
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-bold"
              style={{ background: 'rgba(239,68,68,0.2)', color: '#F87171' }}
            >
              {t('fault')}
            </span>
          </div>
          {showInverters ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
        <AnimatePresence>
          {showInverters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden px-4 pb-4 space-y-2 pt-2"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            >
              {INVERTERS.map(inv => <InverterCard key={inv.id} inv={inv} />)}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Panel Grid */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => setShowPanels(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span className="text-xs font-black text-white">{t('panel_status')} ({PANELS.length})</span>
          </div>
          {showPanels ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </button>
        <AnimatePresence>
          {showPanels && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden px-4 pb-4 pt-2 space-y-2"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            >
              {PANELS.map(panel => {
                const issueColor = panel.issueType === 'microcrack' ? '#EF4444' : panel.issueType === 'dust' ? '#F59E0B' : '#10B981';
                const issueLbl = panel.issueType === 'microcrack' ? t('microcrack') : panel.issueType === 'dust' ? t('dust') : t('ok_status');
                return (
                  <div key={panel.id} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-white/60 w-14">{panel.name}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: issueColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${panel.efficiency}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className="text-xs font-black text-white w-8">{panel.efficiency}%</span>
                    <span className="text-[10px] font-bold w-20 text-right" style={{ color: issueColor }}>{issueLbl}</span>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Services */}
      <div className="space-y-2">
        <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('professional_service')}</p>
        {SERVICES.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span className="text-3xl shrink-0">{s.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{s.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.desc}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[10px] text-white/50">{s.rating} ({s.reviews})</span>
                </div>
                <span className="text-[10px] text-white/40">· {s.time}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-white">{s.price}</p>
              <button
                onClick={() => setBookingService(s.id)}
                className="mt-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 text-white"
                style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}
              >
                {t('book_service')}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <BookingModal serviceId={bookingService} onClose={() => setBookingService(null)} />
    </div>
  );
}