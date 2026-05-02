import React, { useState } from 'react';
import { Bluetooth, Loader2, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';

const DEVICE_DB = [
  { pattern: /solaredge/i,    brand: 'SolarEdge',      capacity: 10   },
  { pattern: /lg\s?resu/i,    brand: 'LG Energy',      capacity: 10   },
  { pattern: /powerwall/i,    brand: 'Tesla Powerwall', capacity: 13.5 },
  { pattern: /byd/i,          brand: 'BYD',            capacity: 10   },
  { pattern: /sungrow/i,      brand: 'Sungrow',        capacity: 9.6  },
  { pattern: /huawei/i,       brand: 'Huawei',         capacity: 10   },
  { pattern: /se\d{4}/i,      brand: 'SolarEdge',      capacity: 10   },
];

function matchDevice(name) {
  for (const entry of DEVICE_DB) {
    if (entry.pattern.test(name)) return { brand: entry.brand, capacity: entry.capacity };
  }
  return null;
}

// ── Compatibility info panel ──────────────────────────────────────────────────
function CompatInfo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.18)' }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left">
        <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
        <span className="text-[11px] font-bold text-sky-400 flex-1">מתי סריקת Bluetooth עובדת?</span>
        {open ? <ChevronUp className="w-3 h-3 text-sky-400/60" /> : <ChevronDown className="w-3 h-3 text-sky-400/60" />}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5 text-[11px] leading-relaxed" dir="rtl">
          <div className="flex items-start gap-2">
            <span className="text-green-400 font-black flex-shrink-0">✅</span>
            <p className="text-white/60"><strong className="text-white/80">Android Chrome</strong> — עובד מלא.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-black flex-shrink-0">❌</span>
            <p className="text-white/60"><strong className="text-white/80">iOS / Safari</strong> — חסום Web Bluetooth. לא ניתן להפעיל.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-black flex-shrink-0">⚠️</span>
            <p className="text-white/60"><strong className="text-white/80">דורש אישור משתמש</strong> — חייב ללחוץ על כפתור (לא ניתן להפעיל ברקע).</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 font-black flex-shrink-0">⚠️</span>
            <p className="text-white/60"><strong className="text-white/80">מכשירי SolarEdge</strong> — חלקם חושפים BLE, חלקם לא. תלוי בגרסת Firmware.</p>
          </div>
          <p className="text-white/35 mt-1">אם הסריקה לא עובדת — הזינו פרטים ידנית בשדות למטה.</p>
        </div>
      )}
    </div>
  );
}

// ── Consent banner shown before first scan ────────────────────────────────────
function ConsentBanner({ onAllow, onDismiss }) {
  return (
    <div className="rounded-xl p-3 space-y-2.5"
      style={{ background: 'rgba(56,189,248,0.07)', border: '1px solid rgba(56,189,248,0.3)' }}>
      <div className="flex items-start gap-2">
        <Bluetooth className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/70 leading-relaxed">
          האפליקציה תבקש <strong className="text-white/90">אישור חד-פעמי</strong> מהדפדפן לגשת למכשירי Bluetooth בסביבה.
          הדפדפן יציג חלון בחירה — בחרו את המכשיר שלכם ולחצו "צמד".
        </p>
      </div>
      <div className="flex gap-2">
        <button onClick={onAllow}
          className="flex-1 py-2 rounded-lg text-[11px] font-black transition-all active:scale-95"
          style={{ background: 'rgba(56,189,248,0.18)', border: '1px solid rgba(56,189,248,0.4)', color: '#38bdf8' }}>
          אני מאשר — המשך לסריקה
        </button>
        <button onClick={onDismiss}
          className="px-3 py-2 rounded-lg text-[11px] font-bold text-white/35 transition-all active:scale-95"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          ביטול
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BluetoothScanner({ onDetected }) {
  const [status, setStatus] = useState('idle'); // idle | consent | scanning | found | error
  const [deviceName, setDeviceName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isSupported = typeof navigator !== 'undefined' && !!navigator.bluetooth;

  const doScan = async () => {
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
      setStatus('found');
      onDetected({ brand: match?.brand ?? name, capacity: match?.capacity ?? '', rawName: name });
    } catch (err) {
      if (err.name === 'NotFoundError' || err.message?.includes('cancelled')) {
        setStatus('idle');
      } else {
        setStatus('error');
        setErrorMsg(err.message || 'שגיאת Bluetooth');
      }
    }
  };

  return (
    <div className="space-y-2">

      <CompatInfo />

      {/* iOS — not supported */}
      {!isSupported && (
        <div className="rounded-xl px-3 py-2 flex items-center gap-2"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
          <p className="text-[11px] text-red-300/80">iOS/Safari לא תומך ב-Web Bluetooth. הזינו פרטים ידנית.</p>
        </div>
      )}

      {/* Consent step */}
      {isSupported && status === 'consent' && (
        <ConsentBanner onAllow={doScan} onDismiss={() => setStatus('idle')} />
      )}

      {/* Scan button */}
      {isSupported && status !== 'consent' && (
        <button
          onClick={() => status === 'idle' || status === 'error' ? setStatus('consent') : null}
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
          {status === 'scanning'
            ? 'ממתין לבחירת מכשיר...'
            : status === 'found'
            ? `✓ זוהה: ${deviceName}`
            : '🔍 סרוק מכשיר Bluetooth'}
        </button>
      )}

      {/* Error */}
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