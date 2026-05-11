import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Plug, Zap, Battery, Car, Thermometer, ChevronLeft, CheckCircle2, Loader2, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import { toast } from 'sonner';

const DEVICES_HE = [
  { id: 'smart_switch', icon: '🔌', label: 'מתג חכם', type: 'switch', status: 'connected', brand: 'Shelly 1PM' },
  { id: 'ev_charger', icon: '🚗', label: 'עמדת טעינה EV', type: 'ev', status: 'connected', brand: 'EV-Box' },
  { id: 'ac_unit', icon: '❄️', label: 'מזגן', type: 'ac', status: 'idle', brand: 'Tadiran Smart' },
  { id: 'water_heater', icon: '🚿', label: 'דוד שמש', type: 'heater', status: 'controlled', brand: 'Ariston' },
];

const DEVICES_EN = [
  { id: 'smart_switch', icon: '🔌', label: 'Smart Switch', type: 'switch', status: 'connected', brand: 'Shelly 1PM' },
  { id: 'ev_charger', icon: '🚗', label: 'EV Charger', type: 'ev', status: 'connected', brand: 'EV-Box' },
  { id: 'ac_unit', icon: '❄️', label: 'AC Unit', type: 'ac', status: 'idle', brand: 'Tadiran Smart' },
  { id: 'water_heater', icon: '🚿', label: 'Water Heater', type: 'heater', status: 'controlled', brand: 'Ariston' },
];

function DeviceSheet({ open, onClose, isHe, devices, onCommand }) {
  const [commanding, setCommanding] = useState(null);
  const [results, setResults] = useState({});

  if (!open) return null;

  const handleCommand = async (deviceId, action) => {
    setCommanding(`${deviceId}_${action}`);
    try {
      await base44.functions.invoke('batteryCommands', { device_id: deviceId, action });
      setResults(prev => ({ ...prev, [deviceId]: action }));
      toast.success(isHe ? `פקודה נשלחה ל-${deviceId}` : `Command sent to ${deviceId}`);
    } catch {
      toast.error(isHe ? 'שגיאה בשליחת הפקודה' : 'Command failed');
    }
    setCommanding(null);
  };

  const statusLabel = {
    connected: { he: 'מחובר', en: 'Connected', color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    idle: { he: 'ממתין', en: 'Idle', color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' },
    controlled: { he: 'בשליטה', en: 'Controlled', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end"
        style={{ background: 'rgba(0,0,0,0.65)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full rounded-t-3xl overflow-hidden"
          style={{ background: 'hsl(222 40% 10%)', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '85vh' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          <div className="overflow-y-auto px-4 pb-10" style={{ maxHeight: 'calc(85vh - 32px)' }}>
            {/* Header */}
            <div className="flex items-center justify-between py-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.35)' }}>
                  <Wifi className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-white">VPP Connect</p>
                  <p className="text-[10px] text-white/40">
                    {isHe ? 'שליטה על מכשירי הקצה' : 'End-device control center'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white/70">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* How it works */}
            <div className="rounded-2xl px-4 py-3 mb-4"
              style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-[11px] text-blue-300 font-bold mb-1">
                {isHe ? '🧠 איך VPP Connect עובד?' : '🧠 How VPP Connect works?'}
              </p>
              <div className="space-y-1">
                {(isHe ? [
                  '📡 מושכים מחיר חשמל מנגה בזמן אמת',
                  '☀️ מודדים ייצור סולארי מ-SolarEdge',
                  '🤖 המוח מחשב מתי כדאי להפעיל כל מכשיר',
                  '⚡ שולחים פקודה אוטומטית למכשירים החכמים',
                ] : [
                  '📡 Pulling live electricity prices from Noga',
                  '☀️ Measuring solar production from SolarEdge',
                  '🤖 AI decides optimal time for each device',
                  '⚡ Auto-commands sent to smart devices',
                ]).map((step, i) => (
                  <p key={i} className="text-[10px] text-white/50">{step}</p>
                ))}
              </div>
            </div>

            {/* Devices */}
            <p className="text-xs font-black text-white/60 mb-3">
              {isHe ? 'מכשירים מחוברים' : 'Connected Devices'} ({devices.length})
            </p>
            <div className="space-y-3">
              {devices.map(device => {
                const st = statusLabel[device.status] || statusLabel.idle;
                const isDone = results[device.id];
                return (
                  <div key={device.id} className="rounded-2xl p-4"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{device.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-black text-white">{device.label}</p>
                        <p className="text-[10px] text-white/40">{device.brand}</p>
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}>
                        {isHe ? st.he : st.en}
                      </span>
                    </div>

                    {isDone ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-black text-emerald-400">
                          {isHe ? `פקודה "${isDone}" בוצעה ✓` : `"${isDone}" command sent ✓`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {['on', 'off', 'schedule'].map(action => {
                          const key = `${device.id}_${action}`;
                          const isRunning = commanding === key;
                          return (
                            <button key={action}
                              onClick={() => handleCommand(device.id, action)}
                              disabled={!!commanding}
                              className="flex-1 py-2 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                              style={{
                                background: action === 'on' ? 'rgba(16,185,129,0.15)' : action === 'off' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                                border: `1px solid ${action === 'on' ? 'rgba(16,185,129,0.3)' : action === 'off' ? 'rgba(239,68,68,0.25)' : 'rgba(245,158,11,0.25)'}`,
                                color: action === 'on' ? '#34d399' : action === 'off' ? '#f87171' : '#fbbf24',
                              }}>
                              {isRunning
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : (isHe
                                  ? (action === 'on' ? '⚡ הפעל' : action === 'off' ? '✕ כבה' : '🕐 תזמן')
                                  : (action === 'on' ? '⚡ On' : action === 'off' ? '✕ Off' : '🕐 Schedule'))}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add device CTA */}
            <button
              className="mt-4 w-full py-3 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px dashed rgba(59,130,246,0.35)', color: '#93c5fd' }}
              onClick={() => toast(isHe ? '🔜 חיבור מכשיר חדש — בקרוב' : '🔜 Add new device — coming soon')}
            >
              <Plug className="w-4 h-4" />
              {isHe ? '+ חבר מכשיר חדש' : '+ Connect new device'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function VPPConnectCard() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [sheetOpen, setSheetOpen] = useState(false);
  const [price, setPrice] = useState(null);
  const [priceIsMock, setPriceIsMock] = useState(true);

  const devices = isHe ? DEVICES_HE : DEVICES_EN;
  const connectedCount = devices.filter(d => d.status === 'connected').length;

  useEffect(() => {
    base44.entities.NogaPrice.list('-created_date', 1).then(prices => {
      if (prices[0]) { setPrice(prices[0].price); setPriceIsMock(prices[0].is_mock); }
    }).catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const isPeak = (hour >= 17 && hour <= 21) || (hour >= 7 && hour <= 9);
  const aiDecision = isPeak
    ? (isHe ? '🔴 שעת שיא — מוכר לרשת' : '🔴 Peak — selling to grid')
    : (isHe ? '🟢 שעת שפל — טוען סוללה' : '🟢 Off-peak — charging battery');

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        onClick={() => setSheetOpen(true)}
        className="w-full rounded-2xl px-4 py-3.5 text-right transition-all active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.04))', border: '1px solid rgba(59,130,246,0.3)' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
            <span className="text-[11px] font-black text-blue-300">VPP Connect</span>
            {priceIsMock && <span className="text-[9px] text-white/25 font-normal">(demo)</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }}>
              {connectedCount} {isHe ? 'מכשירים' : 'devices'}
            </span>
            <ChevronLeft className="w-4 h-4 text-white/30" />
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-xs font-black text-white/70">{aiDecision}</p>
          </div>
          {price && (
            <span className="text-[10px] font-black text-blue-300">
              ₪{price.toFixed(3)}/kWh
            </span>
          )}
        </div>
      </motion.button>

      <DeviceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        isHe={isHe}
        devices={devices}
        onCommand={() => {}}
      />
    </>
  );
}