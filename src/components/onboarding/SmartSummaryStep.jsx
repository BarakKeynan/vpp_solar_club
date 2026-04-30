import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Plus, X, Zap, Car, Droplets, Wind, Cpu, Lightbulb, Battery, ChevronRight } from 'lucide-react';

// Simulated auto-detected smart devices from SolarEdge inverter
const AUTO_DETECTED = [
  { id: 'ev', icon: Car,      label: 'EV Charger',           kwh: 40,  type: 'ev',           color: '#38bdf8', detected: true },
  { id: 'hw', icon: Droplets, label: 'Hot Water Controller',  kwh: 4,   type: 'water_heater', color: '#34d399', detected: true },
];

const MANUAL_OPTIONS = [
  { id: 'ac',      icon: Wind,      label: 'מזגן חכם',         kwh: 2,   type: 'ac' },
  { id: 'washer',  icon: Cpu,       label: 'מכונת כביסה',       kwh: 1.5, type: 'washer' },
  { id: 'fridge',  icon: Lightbulb, label: 'מקרר חכם',          kwh: 0.5, type: 'fridge' },
  { id: 'battery', icon: Battery,   label: 'סוללה ביתית',        kwh: 10,  type: 'battery' },
];

function DeviceCard({ device, selected, onToggle, isAuto }) {
  const Icon = device.icon;
  const color = device.color || '#8b5cf6';
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      onClick={() => onToggle(device.id)}
      className="flex items-center gap-3 p-3 rounded-2xl w-full text-right transition-all active:scale-[0.97]"
      style={{
        background: selected ? `${color}14` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${selected ? color + '55' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: selected ? `${color}20` : 'rgba(255,255,255,0.05)' }}>
        <Icon className="w-5 h-5" style={{ color: selected ? color : 'rgba(255,255,255,0.3)' }} />
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-bold text-white">{device.label}</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          ~{device.kwh} kWh {isAuto ? <span style={{ color: '#34d399' }}>· זוהה אוטומטית ✓</span> : 'קיבולת וירטואלית'}
        </p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-transparent' : 'border-white/20'}`}
        style={{ background: selected ? color : 'transparent' }}>
        {selected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
      </div>
    </motion.button>
  );
}

export default function SmartSummaryStep({ userName, siteId, onConfirm }) {
  const [autoDevices, setAutoDevices] = useState(AUTO_DETECTED.map(d => d.id));
  const [manualDevices, setManualDevices] = useState([]);
  const [showManual, setShowManual] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    // Simulate device discovery delay
    const t = setTimeout(() => setScanning(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const toggleAuto = (id) => setAutoDevices(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );
  const toggleManual = (id) => setManualDevices(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const selectedAutoDevices = AUTO_DETECTED.filter(d => autoDevices.includes(d.id));
  const selectedManualDevices = MANUAL_OPTIONS.filter(d => manualDevices.includes(d.id));
  const allSelected = [...selectedAutoDevices, ...selectedManualDevices];

  const totalKwh = allSelected.reduce((sum, d) => sum + d.kwh, 0);
  const hasBattery = selectedManualDevices.some(d => d.type === 'battery');
  const isVirtualBESS = !hasBattery && allSelected.length > 0;

  const handleConfirm = () => {
    onConfirm({
      devices: allSelected.map(d => ({ id: d.id, label: d.label, kwh: d.kwh, type: d.type })),
      totalKwh,
      isVirtualBESS,
      hasBattery,
    });
  };

  return (
    <motion.div
      key="summary"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
      className="flex flex-col px-5 pt-6 gap-5 w-full pb-10"
      dir="rtl"
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'rgba(52,211,153,0.7)' }}>
          🔍 סריקת מכשירים חכמים
        </p>
        <h2 className="text-xl font-black text-white">מה זיהינו במערכת שלך?</h2>
        <p className="text-sm text-white/40">Site ID: <span className="text-cyan-400 font-bold">{siteId}</span></p>
      </div>

      {/* Scanning animation or detected devices */}
      <AnimatePresence mode="wait">
        {scanning ? (
          <motion.div key="scan-anim" exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 py-6">
            <div className="flex gap-2 items-center">
              {[0,1,2,3].map(i => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-cyan-400"
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }} />
              ))}
            </div>
            <p className="text-sm text-white/40">מזהה מכשירים מחוברים לממיר...</p>
          </motion.div>
        ) : (
          <motion.div key="devices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

            {/* Auto-detected */}
            <div className="space-y-2">
              <p className="text-xs font-black text-white/40 uppercase tracking-widest">✅ זוהו אוטומטית מה-SolarEdge</p>
              {AUTO_DETECTED.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <DeviceCard device={d} selected={autoDevices.includes(d.id)} onToggle={toggleAuto} isAuto={true} />
                </motion.div>
              ))}
            </div>

            {/* Manual additions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button onClick={() => setShowManual(v => !v)}
                  className="flex items-center gap-2 text-sm font-bold px-3 py-2 rounded-xl transition-all active:scale-95"
                  style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                  <Plus className="w-4 h-4" />
                  הוסף מכשירים נוספים
                </button>
                <p className="text-xs text-white/30">לדיוק הקיבולת הוירטואלית</p>
              </div>

              <AnimatePresence>
                {showManual && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden">
                    {MANUAL_OPTIONS.map((d, i) => (
                      <motion.div key={d.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                        <DeviceCard device={{ ...d, color: '#8b5cf6' }} selected={manualDevices.includes(d.id)} onToggle={toggleManual} isAuto={false} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Virtual BESS Summary */}
            {allSelected.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 space-y-3"
                style={{
                  background: isVirtualBESS ? 'rgba(52,211,153,0.07)' : 'rgba(245,158,11,0.07)',
                  border: `1px solid ${isVirtualBESS ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)'}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4" style={{ color: isVirtualBESS ? '#34d399' : '#fbbf24' }} />
                    <p className="text-sm font-black" style={{ color: isVirtualBESS ? '#34d399' : '#fbbf24' }}>
                      {isVirtualBESS ? `הסוללה הוירטואלית של ${userName?.split(' ')[0] || 'המשתמש'}` : 'מערך אנרגיה הכולל סוללה'}
                    </p>
                  </div>
                  <span className="text-lg font-black text-white">{totalKwh.toFixed(1)} kWh</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allSelected.map(d => (
                    <span key={d.id} className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
                      {d.label}
                    </span>
                  ))}
                </div>
                {isVirtualBESS && (
                  <p className="text-xs text-white/40 leading-relaxed">
                    לא זוהתה סוללה פיזית — כל המכשירים שנבחרו יאוחדו ל-Virtual BESS אחד המנוהל ע"י הפלטפורמה.
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      {!scanning && (
        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          onClick={handleConfirm}
          disabled={allSelected.length === 0}
          className="w-full py-5 rounded-2xl font-black text-white text-lg transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
          style={{
            background: 'linear-gradient(135deg, hsl(160 84% 38%), hsl(160 84% 28%))',
            border: '1px solid rgba(52,211,153,0.5)',
            boxShadow: allSelected.length > 0 ? '0 0 40px rgba(52,211,153,0.25)' : 'none',
          }}
        >
          אשר וקבע API Key
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      )}
      {!scanning && (
        <button onClick={() => onConfirm({ devices: [], totalKwh: 0, isVirtualBESS: false, hasBattery: false })}
          className="text-sm text-white/20 text-center w-full active:opacity-50">
          דלג — אמשיך לאחר מכן
        </button>
      )}
    </motion.div>
  );
}