import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Battery, Zap, Wifi, AlertTriangle, CheckCircle2,
  RefreshCw, Plus, ChevronRight, Car, Droplets, Wind, Cpu
} from 'lucide-react';

// ─── Mock data ─────────────────────────────────────────────────────────────
const MOCK = {
  virtualKwh: 42.5,
  savedThisMonth: 187,
  smartMeterOk: true,
  smartMeterLastSync: '09:47',
  physicalBattery: {
    present: true,
    brand: 'Tesla Powerwall 2',
    soc: 85,
    powerKw: 2.4,
    tempC: 28,
    flowMode: 'charging', // 'charging' | 'full_to_virtual'
  },
  inverter: { connected: true, sn: 'SE-728341', deviation: 2.1 },
  tariffOk: true,
  devices: [
    { id: 'ev',  icon: Car,      label: 'EV Charger',          kwh: 40,  active: true  },
    { id: 'hw',  icon: Droplets, label: 'דוד חם',               kwh: 4,   active: true  },
    { id: 'ac',  icon: Wind,     label: 'מזגן חכם',             kwh: 2,   active: false },
    { id: 'cpu', icon: Cpu,      label: 'בקר מרכזי',            kwh: 0.5, active: true  },
  ],
};

// ─── Row component ─────────────────────────────────────────────────────────
function StatusRow({ label, value, status, action, onAction }) {
  const dot = status === 'ok'   ? '#10b981'
             : status === 'warn' ? '#f59e0b'
             : '#ef4444';
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-2">
        {action && (
          <button onClick={onAction}
            className="text-[10px] px-2 py-0.5 rounded-full font-bold transition-all active:scale-95"
            style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
            {action}
          </button>
        )}
        <span className="text-xs text-white/50">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 4px ${dot}` }} />
        <span className="text-xs font-bold text-white/80">{value}</span>
      </div>
    </div>
  );
}

// ─── Device chip ───────────────────────────────────────────────────────────
function DeviceChip({ device, onToggle }) {
  const Icon = device.icon;
  const color = device.active ? '#34d399' : 'rgba(255,255,255,0.2)';
  return (
    <button onClick={() => onToggle(device.id)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all active:scale-95"
      style={{
        background: device.active ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${device.active ? 'rgba(52,211,153,0.35)' : 'rgba(255,255,255,0.08)'}`,
      }}>
      <Icon className="w-3.5 h-3.5" style={{ color }} />
      <span className="text-[11px] font-bold" style={{ color }}>{device.label}</span>
      <span className="text-[10px] text-white/30">{device.kwh}k</span>
    </button>
  );
}

// ─── Energy flow indicator ─────────────────────────────────────────────────
function FlowIndicator({ mode, isHe }) {
  const isVirtual = mode === 'full_to_virtual';
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
      style={{
        background: isVirtual ? 'rgba(139,92,246,0.1)' : 'rgba(52,211,153,0.08)',
        border: `1px solid ${isVirtual ? 'rgba(139,92,246,0.3)' : 'rgba(52,211,153,0.2)'}`,
      }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2 h-2 rounded-full"
        style={{ background: isVirtual ? '#a78bfa' : '#34d399' }}
      />
      <span className="text-xs font-bold" style={{ color: isVirtual ? '#a78bfa' : '#34d399' }}>
        {isVirtual
          ? (isHe ? 'עודף → סוללה וירטואלית' : 'Overflow → Virtual BESS')
          : (isHe ? 'אנרגיה זורמת לסוללה פיזית' : 'Energy → Physical Battery')}
      </span>
    </div>
  );
}

// ─── Main Dashboard Sheet ──────────────────────────────────────────────────
function VirtualBatterySheet({ onClose, isHe }) {
  const [data] = useState(MOCK);
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [devices, setDevices] = useState(MOCK.devices);

  const runScan = () => {
    setScanning(true);
    setScanDone(false);
    setTimeout(() => { setScanning(false); setScanDone(true); }, 2200);
  };

  const toggleDevice = (id) =>
    setDevices(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));

  const totalVirtualKwh = devices.filter(d => d.active).reduce((s, d) => s + d.kwh, 0);
  const deviation = data.inverter.deviation;
  const deviationWarn = deviation > 5;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/75 flex items-end z-50"
      style={{ backdropFilter: 'blur(6px)' }}
      onClick={onClose}>
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full rounded-t-3xl pb-10 max-h-[92vh] overflow-y-auto"
        style={{ background: '#0b1525', border: '1px solid rgba(52,211,153,0.2)' }}
        onClick={e => e.stopPropagation()}
        dir="rtl"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/15" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <button onClick={onClose}><X className="w-5 h-5 text-white/30" /></button>
          <div className="text-center">
            <h2 className="text-sm font-black text-white">🔋 {isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}</h2>
            <p className="text-[10px] text-white/30">{isHe ? 'תמונת מצב מלאה' : 'Full system snapshot'}</p>
          </div>
          <button onClick={runScan} disabled={scanning}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all active:scale-95"
            style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? (isHe ? 'סורק...' : 'Scanning...') : (isHe ? 'סרוק' : 'Scan')}
          </button>
        </div>

        <div className="px-5 pt-4 space-y-5">

          {/* Scan success banner */}
          <AnimatePresence>
            {scanDone && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-400 font-bold">{isHe ? 'סריקה הושלמה — כל המערכות תקינות ✓' : 'Scan complete — all systems OK ✓'}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deviation warning */}
          {deviationWarn && (
            <div className="flex items-start gap-2.5 px-3 py-3 rounded-xl"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-400 leading-relaxed">
                {isHe
                  ? `סטייה של ${deviation}% בין נתוני הממיר למד החכם — מומלץ בדיקת תקשורת`
                  : `${deviation}% mismatch between inverter & meter — check communication`}
              </p>
            </div>
          )}

          {/* ① Core Metrics */}
          <section>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
              {isHe ? 'מאזן כולל' : 'Core Metrics'}
            </p>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <StatusRow
                label={isHe ? 'יתרה וירטואלית' : 'Virtual Balance'}
                value={`${totalVirtualKwh.toFixed(1)} kWh`}
                status="ok"
                action={isHe ? 'היסטוריה' : 'History'}
                onAction={() => {}}
              />
              <StatusRow
                label={isHe ? 'חיסכון החודש' : 'Saved this month'}
                value={`₪${data.savedThisMonth}`}
                status="ok"
              />
              <StatusRow
                label={isHe ? 'מונה חכם' : 'Smart Meter'}
                value={data.smartMeterOk ? `${isHe ? 'תקין' : 'OK'} · ${data.smartMeterLastSync}` : (isHe ? 'שגיאה' : 'Error')}
                status={data.smartMeterOk ? 'ok' : 'error'}
                action={isHe ? 'סנכרן' : 'Sync'}
                onAction={runScan}
              />
              <StatusRow
                label={isHe ? 'ממיר (API)' : 'Inverter (API)'}
                value={`${isHe ? 'מחובר' : 'Connected'} · S/N ${data.inverter.sn}`}
                status={deviationWarn ? 'warn' : 'ok'}
              />
              <StatusRow
                label={isHe ? 'תעו"ז (תעריף)' : 'ToU Tariff'}
                value={data.tariffOk ? (isHe ? 'מוגדר נכון ✓' : 'Configured ✓') : (isHe ? 'לא מוגדר' : 'Not set')}
                status={data.tariffOk ? 'ok' : 'warn'}
              />
            </div>
          </section>

          {/* ② Physical Battery */}
          <section>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-2">
              {isHe ? 'סוללה פיזית' : 'Physical Battery'}
            </p>
            {data.physicalBattery.present ? (
              <div className="rounded-2xl p-4 space-y-3"
                style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-400">{isHe ? 'מזוהה ✓' : 'Detected ✓'}</span>
                  <span className="text-sm font-black text-white">{data.physicalBattery.brand}</span>
                </div>
                {/* SoC bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>{isHe ? 'טעינה' : 'SoC'}</span>
                    <span className="font-bold text-emerald-400">{data.physicalBattery.soc}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${data.physicalBattery.soc}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-emerald-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center rounded-xl py-2"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-sm font-black text-blue-400">{data.physicalBattery.powerKw} kW</p>
                    <p className="text-[10px] text-white/35">{isHe ? 'הספק' : 'Power'}</p>
                  </div>
                  <div className="text-center rounded-xl py-2"
                    style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-sm font-black text-orange-400">{data.physicalBattery.tempC}°C</p>
                    <p className="text-[10px] text-white/35">{isHe ? 'טמפ׳' : 'Temp'}</p>
                  </div>
                </div>
                <FlowIndicator mode={data.physicalBattery.flowMode} isHe={isHe} />
              </div>
            ) : (
              <div className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs text-white/40 text-center mb-3">
                  {isHe ? 'לא זוהתה סוללה פיזית' : 'No physical battery detected'}
                </p>
                <button className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                  style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)' }}>
                  <Plus className="w-3.5 h-3.5" />
                  {isHe ? 'חבר סוללה פיזית' : 'Connect Physical Battery'}
                </button>
              </div>
            )}
          </section>

          {/* ③ Smart Devices */}
          <section>
            <div className="flex items-center justify-between mb-2">
              <button className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Plus className="w-3 h-3" />
                {isHe ? 'הוסף מכשיר' : 'Add Device'}
              </button>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                {isHe ? 'מכשירים מחוברים' : 'Smart Devices'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              {devices.map(d => (
                <DeviceChip key={d.id} device={d} onToggle={toggleDevice} />
              ))}
            </div>
            <p className="text-[10px] text-white/25 text-left mt-1.5">
              {isHe ? `קיבולת מחושבת: ${totalVirtualKwh.toFixed(1)} kWh` : `Calculated capacity: ${totalVirtualKwh.toFixed(1)} kWh`}
            </p>
          </section>

          {/* ④ Set discharge priority CTA */}
          {data.physicalBattery.present && (
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all active:scale-[0.98]"
              style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.2)' }}>
              <ChevronRight className="w-4 h-4 text-sky-400" style={{ transform: 'rotate(180deg)' }} />
              <div className="text-right">
                <p className="text-sm font-black text-sky-400">{isHe ? 'הגדר עדיפות פריקה' : 'Set Discharge Priority'}</p>
                <p className="text-[10px] text-white/30">{isHe ? 'בית → רשת → EV' : 'Home → Grid → EV'}</p>
              </div>
            </button>
          )}

        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Trigger Card (replaces old VirtualBattery) ────────────────────────────
export default function VirtualBatteryDashboard({ isHe }) {
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(72);
  const [kWh, setKwh] = useState(42.5);

  useEffect(() => {
    const t = setInterval(() => {
      setPercent(p => Math.min(100, Math.max(0, p + (Math.random() - 0.48) * 1.5)));
      setKwh(p => Math.max(0, p + (Math.random() - 0.5) * 0.3));
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-primary/25 p-4 text-right active:scale-[0.98] transition-transform"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.09), rgba(16,185,129,0.04))' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-400/70">{isHe ? 'משדרת' : 'Live'}</span>
          </div>
          <h3 className="text-sm font-black text-white">{isHe ? 'סוללה וירטואלית VPP' : 'VPP Virtual Battery'}</h3>
        </div>

        <div className="flex items-center gap-5">
          {/* Radial gauge */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
              <motion.circle cx="60" cy="60" r="54" fill="none" stroke="#10b981" strokeWidth="9"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-black text-primary">{Math.round(percent)}%</p>
              <p className="text-[10px] text-white/40">{kWh.toFixed(1)} kWh</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex-1 space-y-2">
            {[
              { label: isHe ? 'חיסכון החודש' : 'Saved', value: '₪187', color: '#10b981' },
              { label: isHe ? 'מכשירים' : 'Devices', value: '3 פעילים', color: '#38bdf8' },
              { label: isHe ? 'מונה חכם' : 'Meter', value: isHe ? 'תקין ✓' : 'OK ✓', color: '#a78bfa' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-[10px] text-white/35">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-sky-400">
            <ChevronRight className="w-3.5 h-3.5" style={{ transform: 'rotate(180deg)' }} />
            {isHe ? 'לחץ לתמונת מצב מלאה' : 'Tap for full snapshot'}
          </div>
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] text-emerald-400/60">API ✓</span>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {open && <VirtualBatterySheet onClose={() => setOpen(false)} isHe={isHe} />}
      </AnimatePresence>
    </>
  );
}