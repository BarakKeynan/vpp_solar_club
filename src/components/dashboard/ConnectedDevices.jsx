import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Plus, Bluetooth, MapPin, Wifi, Battery, Zap, Car, Sun, Loader2, Check, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { toast } from 'sonner';

const DEVICES = [
  { id: 1, name: 'SolarEdge SE10K', type: 'inverter', icon: Sun, status: 'online', signal: 'wifi', power: '4.2 kW', color: '#f59e0b' },
  { id: 2, name: 'Tesla Powerwall 2', type: 'battery', icon: Battery, status: 'online', signal: 'wifi', power: '82%', color: '#10b981' },
  { id: 3, name: 'Wallbox Pulsar Plus', type: 'ev_charger', icon: Car, status: 'charging', signal: 'bluetooth', power: '11 kW', color: '#3b82f6' },
  { id: 4, name: 'Smart Meter IL-32', type: 'meter', icon: Zap, status: 'online', signal: 'wifi', power: '1.8 kW', color: '#a78bfa' },
  { id: 5, name: 'Fronius Symo 8.2', type: 'inverter', icon: Sun, status: 'offline', signal: 'wifi', power: '—', color: '#6b7280' },
];

const SCAN_RESULTS = [
  { id: 'scan1', name: 'Huawei SUN2000-5KTL', type: 'inverter', signal: 'bluetooth', distance: '3m' },
  { id: 'scan2', name: 'BYD Battery-Box HV', type: 'battery', signal: 'bluetooth', distance: '5m' },
  { id: 'scan3', name: 'SolarEdge SE7K', type: 'inverter', signal: 'gps', distance: '12m' },
];

function SignalIcon({ type }) {
  if (type === 'bluetooth') return <Bluetooth className="w-3 h-3 text-blue-400" />;
  if (type === 'gps') return <MapPin className="w-3 h-3 text-emerald-400" />;
  return <Wifi className="w-3 h-3 text-slate-400" />;
}

export default function ConnectedDevices() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [open, setOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [addedIds, setAddedIds] = useState([]);
  const [devices, setDevices] = useState(DEVICES);

  const handleScan = async () => {
    setScanResults([]);
    setScanning(true);
    await new Promise(r => setTimeout(r, 2200));
    setScanResults(SCAN_RESULTS);
    setScanning(false);
    toast.success(isHe ? `נמצאו ${SCAN_RESULTS.length} מכשירים חדשים` : `Found ${SCAN_RESULTS.length} new devices`);
  };

  const handleAdd = (device) => {
    setAddedIds(prev => [...prev, device.id]);
    setTimeout(() => {
      setDevices(prev => [...prev, {
        id: Date.now(),
        name: device.name,
        type: device.type,
        icon: device.type === 'battery' ? Battery : Sun,
        status: 'online',
        signal: device.signal,
        power: '—',
        color: '#10b981',
      }]);
      toast.success(isHe ? `${device.name} נוסף בהצלחה` : `${device.name} added`);
    }, 600);
  };

  const onlineCount = devices.filter(d => d.status !== 'offline').length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      {/* Header Card */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between rounded-2xl border p-4 transition-all active:scale-[0.98]"
        style={{
          background: open ? 'rgba(59,130,246,0.07)' : 'rgba(255,255,255,0.02)',
          border: open ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400">{onlineCount} {isHe ? 'פעיל' : 'online'}</span>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>

        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-sm font-black text-white">{isHe ? 'מכשירים מחוברים' : 'Connected Devices'}</p>
            <p className="text-[10px] text-white/40">{devices.length} {isHe ? 'מכשירים · לחץ לפרטים' : 'devices · tap for details'}</p>
          </div>
          <div className="p-2 rounded-xl" style={{ background: 'rgba(59,130,246,0.12)' }}>
            <Wifi className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">

              {/* Device List */}
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {devices.map((device, i) => {
                  const Icon = device.icon;
                  return (
                    <div key={device.id}
                      className="flex items-center gap-3 px-4 py-3"
                      style={{
                        background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
                        borderBottom: i < devices.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}>
                      <div className="flex flex-col items-end flex-1 gap-0.5 text-right">
                        <p className="text-xs font-bold text-white">{device.name}</p>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold ${device.status === 'online' || device.status === 'charging' ? 'text-emerald-400' : 'text-red-400/60'}`}>
                            {device.status === 'online' ? (isHe ? 'פעיל' : 'Online') :
                             device.status === 'charging' ? (isHe ? 'טוען' : 'Charging') :
                             (isHe ? 'לא מחובר' : 'Offline')}
                          </span>
                          <SignalIcon type={device.signal} />
                        </div>
                      </div>
                      <div className="text-center min-w-[40px]">
                        <p className="text-sm font-black" style={{ color: device.color }}>{device.power}</p>
                      </div>
                      <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${device.color}18` }}>
                        <Icon className="w-4 h-4" style={{ color: device.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scan Button */}
              <button
                onClick={handleScan}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95"
                style={{
                  background: scanning ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: scanning ? 'rgba(255,255,255,0.4)' : '#60a5fa',
                }}
              >
                {scanning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isHe ? 'סורק GPS & Bluetooth...' : 'Scanning GPS & Bluetooth...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    {isHe ? '+ הוסף חומרה חדשה' : '+ Add New Hardware'}
                  </>
                )}
              </button>

              {/* Scan Results */}
              <AnimatePresence>
                {scanResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest px-1">
                      {isHe ? 'מכשירים שזוהו בסביבה' : 'Devices detected nearby'}
                    </p>
                    {scanResults.map(device => {
                      const added = addedIds.includes(device.id);
                      return (
                        <motion.div key={device.id}
                          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <button
                            onClick={() => !added && handleAdd(device)}
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90"
                            style={{
                              background: added ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                              border: added ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(59,130,246,0.4)',
                            }}>
                            {added
                              ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                              : <Plus className="w-3.5 h-3.5 text-blue-400" />}
                          </button>
                          <div className="flex-1 text-right">
                            <p className="text-xs font-bold text-white">{device.name}</p>
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                              <span className="text-[10px] text-white/40">{device.distance}</span>
                              <SignalIcon type={device.signal} />
                              <span className="text-[10px] text-blue-400 capitalize">{device.signal}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}