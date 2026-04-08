import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Loader2, CheckCircle2, X, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const BATTERIES = [
  { id: 'lfp_main', name: 'LFP Main', model: 'SolarEdge Home Battery', capacity: 10, soh: 96, level: 82, voltage: '48V' },
  { id: 'lfp_aux', name: 'LFP Aux', model: 'SolarEdge Home Battery', capacity: 5, soh: 91, level: 67, voltage: '48V' },
];

export default function BatterySelectModal({ open, onClose, onSelect }) {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [scanning, setScanning] = useState(false);
  const [discovered, setDiscovered] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) { setDiscovered([]); setSelected(null); setScanning(false); return; }
    setScanning(true);
    const t = setTimeout(() => {
      setDiscovered(BATTERIES);
      setScanning(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [open]);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-3xl p-5 max-h-[88vh] overflow-y-auto max-w-md mx-auto"
            style={{ paddingBottom: '100px' }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-base font-black text-foreground">
                {isHe ? 'בחר סוללה למכירה' : 'Select Battery to Sell From'}
              </p>
              <button onClick={onClose} className="p-1.5 rounded-xl bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {scanning ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {isHe ? 'מתחבר ל-API של הסוללה...' : 'Connecting to battery API...'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  {isHe ? `${discovered.length} סוללות זוהו` : `${discovered.length} batteries discovered`}
                </p>

                {discovered.map(bat => {
                  const isSelected = selected?.id === bat.id;
                  return (
                    <button
                      key={bat.id}
                      onClick={() => setSelected(bat)}
                      className={`w-full rounded-2xl border p-4 text-right transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted/30 hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                          <Battery className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-black ${isSelected ? 'text-primary' : 'text-foreground'}`}>{bat.name}</p>
                          <p className="text-[10px] text-muted-foreground">{bat.model} · {bat.voltage}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-foreground">{bat.level}%</p>
                          <p className="text-[10px] text-muted-foreground">{bat.capacity} kWh</p>
                        </div>
                      </div>
                      {/* Level bar */}
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${bat.level > 60 ? 'bg-primary' : bat.level > 30 ? 'bg-accent' : 'bg-destructive'}`}
                          style={{ width: `${bat.level}%` }}
                        />
                      </div>
                    </button>
                  );
                })}

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  disabled={!selected}
                  className={`w-full py-4 rounded-2xl font-black text-base mt-2 transition-all flex items-center justify-center gap-2 ${
                    selected
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                      : 'bg-muted text-muted-foreground opacity-50'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {isHe ? 'מכור מסוללה זו ←' : 'Sell from this battery →'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}