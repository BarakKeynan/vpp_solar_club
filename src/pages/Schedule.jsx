import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Sun, Moon, Zap, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const timeLabels = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

export default function Schedule() {
  const [chargeRange, setChargeRange] = useState([8, 16]);
  const [sellRange, setSellRange] = useState([18, 22]);
  const [autoMode, setAutoMode] = useState(false);

  const formatTime = (val) => {
    const h = String(val).padStart(2, '0');
    return `${h}:00`;
  };

  const handleAutoToggle = (checked) => {
    setAutoMode(checked);
    if (checked) {
      toast.success('מצב אוטומטי הופעל! המערכת תנהל את האגירה.');
    } else {
      toast.info('מצב אוטומטי כובה.');
    }
  };

  return (
    <div className="px-4 pt-6 space-y-5">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-bold">תזמון אגירה</h1>
        <p className="text-sm text-muted-foreground mt-1">נהל מתי לטעון ומתי למכור</p>
      </motion.div>

      {/* Battery Status */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/15 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 rounded-full border-4 border-primary bg-primary/5">
            <Battery className="w-12 h-12 text-primary" />
          </div>
        </div>
        <p className="text-4xl font-black text-primary mt-3">82%</p>
        <p className="text-sm text-muted-foreground">נטען • 2.4 kWh</p>
      </motion.div>

      {/* Charge Schedule */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/20">
            <Sun className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-sm">טען ביום</h3>
            <p className="text-xs text-muted-foreground">אגור אנרגיה סולארית</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(chargeRange[0])}</span>
            <span className="font-bold text-primary">
              {formatTime(chargeRange[0])} - {formatTime(chargeRange[1])}
            </span>
            <span>{formatTime(chargeRange[1])}</span>
          </div>
          <Slider
            value={chargeRange}
            onValueChange={setChargeRange}
            min={6}
            max={20}
            step={1}
            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_[data-orientation=horizontal]>.bg-primary]:bg-primary"
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground px-1">
          {timeLabels.map(t => <span key={t}>{t}</span>)}
        </div>
      </motion.div>

      {/* Sell Schedule */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/20">
            <Moon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-sm">מכור בלילה</h3>
            <p className="text-xs text-muted-foreground">מכור אנרגיה כשהמחיר גבוה</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(sellRange[0])}</span>
            <span className="font-bold text-accent">
              {formatTime(sellRange[0])} - {formatTime(sellRange[1])}
            </span>
            <span>{formatTime(sellRange[1])}</span>
          </div>
          <Slider
            value={sellRange}
            onValueChange={setSellRange}
            min={16}
            max={24}
            step={1}
            className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
          />
        </div>
      </motion.div>

      {/* Auto Mode */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-secondary/20">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-sm">הפעל אוטומטי</h3>
              <p className="text-xs text-muted-foreground">המערכת תנהל הכול חכם</p>
            </div>
          </div>
          <Switch checked={autoMode} onCheckedChange={handleAutoToggle} />
        </div>
      </motion.div>
    </div>
  );
}