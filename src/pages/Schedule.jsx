import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const fmt = (h) => `${String(h).padStart(2, '0')}:00`;

export default function Schedule() {
  const [chargeRange, setChargeRange] = useState([8, 14]);
  const [sellRange, setSellRange] = useState([20, 23]);
  const [auto, setAuto] = useState(false);

  const handleAuto = (v) => {
    setAuto(v);
    toast.success(v ? 'מצב אוטומטי הופעל – AI ינהל את האגירה' : 'מצב ידני הופעל');
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <h1 className="text-xl font-black text-foreground">תזמון אגירה</h1>
        <Settings className="w-5 h-5 text-muted-foreground" />
      </motion.div>

      {/* Battery Status */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-primary/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-foreground">סוללה ביתית</span>
          </div>
          <span className="text-2xl font-black text-primary">82%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }} animate={{ width: '82%' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">16.4 kWh נשאר</span>
          <span className="text-xs text-muted-foreground">קיבולת: 20 kWh</span>
        </div>
      </motion.div>

      {/* Auto Toggle */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className={`rounded-2xl border p-4 flex items-center justify-between transition-colors ${auto ? 'border-primary/50 bg-primary/10' : 'border-border bg-card'}`}>
        <div>
          <p className="text-sm font-bold text-foreground">מצב אוטומטי (AI)</p>
          <p className="text-xs text-muted-foreground">המערכת תנהל טעינה ומכירה אוטומטית</p>
        </div>
        <Switch checked={auto} onCheckedChange={handleAuto} />
      </motion.div>

      {/* Charge Schedule */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className={`bg-card rounded-2xl border border-border p-4 space-y-4 transition-opacity ${auto ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/20">
            <Battery className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-bold text-foreground">שעות טעינה</p>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-primary">{fmt(chargeRange[0])}</span>
          <span className="text-muted-foreground">עד</span>
          <span className="text-primary">{fmt(chargeRange[1])}</span>
        </div>
        <Slider min={0} max={23} step={1} value={chargeRange} onValueChange={setChargeRange} className="w-full" />
        <p className="text-xs text-muted-foreground">
          טעינה מהפאנלים בשעות שיא הייצור
        </p>
      </motion.div>

      {/* Sell Schedule */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className={`bg-card rounded-2xl border border-border p-4 space-y-4 transition-opacity ${auto ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-secondary/20">
            <Zap className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-sm font-bold text-foreground">שעות מכירה לרשת</p>
        </div>
        <div className="flex justify-between text-sm font-bold">
          <span className="text-secondary">{fmt(sellRange[0])}</span>
          <span className="text-muted-foreground">עד</span>
          <span className="text-secondary">{fmt(sellRange[1])}</span>
        </div>
        <Slider min={0} max={23} step={1} value={sellRange} onValueChange={setSellRange} className="w-full" />
        <p className="text-xs text-muted-foreground">
          מכירה לרשת בשעות שיא הצריכה (מחיר גבוה)
        </p>
      </motion.div>

      <button
        onClick={() => toast.success('הגדרות נשמרו בהצלחה!')}
        className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all"
      >
        שמור הגדרות
      </button>
    </div>
  );
}