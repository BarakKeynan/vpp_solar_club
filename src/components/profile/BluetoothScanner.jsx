import React, { useState } from 'react';
import { Bluetooth, Loader2, CheckCircle2, XCircle, Zap } from 'lucide-react';

// Known device name patterns → brand + capacity
const DEVICE_DB = [
  { pattern: /solaredge/i,    brand: 'SolarEdge', capacity: 10 },
  { pattern: /lg\s?resu/i,    brand: 'LG Energy',  capacity: 10 },
  { pattern: /powerwall/i,    brand: 'Tesla Powerwall', capacity: 13.5 },
  { pattern: /byd/i,          brand: 'BYD',        capacity: 10 },
  { pattern: /sungrow/i,      brand: 'Sungrow',    capacity: 9.6 },
  { pattern: /huawei/i,       brand: 'Huawei',     capacity: 10 },
  { pattern: /se\d{4}/i,      brand: 'SolarEdge',  capacity: 10 },
];

function matchDevice(name) {
  for (const entry of DEVICE_DB) {
    if (entry.pattern.test(name)) return { brand: entry.brand, capacity: entry.capacity };
  }
  return null;
}

export default function BluetoothScanner({ onDetected }) {
  const [status, setStatus] = useState('idle'); // idle | scanning | found | error | unsupported
  const [deviceName, setDeviceName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isSupported = typeof navigator !== 'undefined' && !!navigator.bluetooth;

  const handleScan = async () => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }
    setStatus('scanning');
    setErrorMsg('');
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service', 'device_information'],
      });

      const name = device.name || 'Unknown';
      setDeviceName(name);

      const match = matchDevice(name);
      if (match) {
        setStatus('found');
        onDetected({ brand: match.brand, capacity: match.capacity, rawName: name });
      } else {
        // Unknown device — still report the name so user can confirm
        setStatus('found');
        onDetected({ brand: name, capacity: '', rawName: name });
      }
    } catch (err) {
      if (err.name === 'NotFoundError' || err.message?.includes('cancelled')) {
        setStatus('idle'); // user cancelled — no error
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'שגיאת Bluetooth');
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-xl px-3 py-2 flex items-center gap-2"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <XCircle className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
        <p className="text-[11px] text-white/35">
          סריקת Bluetooth אינה נתמכת בדפדפן זה (iOS/Safari). הזינו פרטים ידנית.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleScan}
        disabled={status === 'scanning'}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all active:scale-95 disabled:opacity-50"
        style={{
          background: status === 'found' ? 'rgba(16,185,129,0.15)' : 'rgba(56,189,248,0.1)',
          border: `1px solid ${status === 'found' ? 'rgba(16,185,129,0.4)' : 'rgba(56,189,248,0.3)'}`,
          color: status === 'found' ? '#34d399' : '#38bdf8',
        }}>
        {status === 'scanning'
          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
          : status === 'found'
          ? <CheckCircle2 className="w-3.5 h-3.5" />
          : <Bluetooth className="w-3.5 h-3.5" />}
        {status === 'scanning' ? 'מחפש מכשירים...' : status === 'found' ? `✓ זוהה: ${deviceName}` : '🔍 סרוק מכשיר Bluetooth'}
      </button>

      {status === 'scanning' && (
        <p className="text-[11px] text-white/40 text-center">
          בחרו מכשיר מהרשימה שתופיע על המסך ולחצו "צמד"
        </p>
      )}

      {status === 'error' && (
        <div className="rounded-lg px-3 py-2 flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-[11px] text-red-400">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}