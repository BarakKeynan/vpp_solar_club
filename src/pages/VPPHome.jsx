import React from 'react';
import { motion } from 'framer-motion';
import { Battery, Zap, Car, Sun, Home, TrendingUp, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PowerNode({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`p-3 rounded-2xl border-2 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {value && <span className="text-xs font-bold">{value}</span>}
    </div>
  );
}

function FlowDots({ active }) {
  return (
    <div className="flex items-center gap-0.5 px-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: active ? [0.2, 1, 0.2] : 0.2 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}

export default function VPPHome() {
  const navigate = useNavigate();
  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">VPP הבית שלי</h1>
          <p className="text-xs text-muted-foreground">מערכת אנרגיה ביתית</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">פעיל</span>
          <Wifi className="w-4 h-4 text-primary" />
        </div>
      </motion.div>

      {/* Savings Counter */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">חיסכון היום</p>
              <p className="text-3xl font-black text-primary">+187 ₪</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">החודש</p>
            <p className="text-lg font-bold text-foreground">+4,230 ₪</p>
          </div>
        </div>
      </motion.div>

      {/* Power Flow */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border p-4 space-y-4"
      >
        <p className="text-xs text-muted-foreground font-medium">זרימת אנרגיה</p>

        {/* Row 1: Sun → Battery → Home */}
        <div className="flex items-center justify-center gap-1">
          <PowerNode icon={Sun} label="שמש" value="4.2 kW" colorClass="border-accent text-accent" />
          <FlowDots active />
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-md animate-pulse" />
              <div className="relative p-4 rounded-2xl border-2 border-primary text-primary bg-primary/5">
                <Battery className="w-8 h-8" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">סוללה</span>
            <span className="text-2xl font-black text-primary">82%</span>
          </div>
          <FlowDots active />
          <PowerNode icon={Home} label="בית" value="1.8 kW" colorClass="border-secondary text-secondary" />
        </div>

        {/* Row 2: EV + Grid */}
        <div className="flex items-center justify-center gap-8">
          <PowerNode icon={Car} label="רכב חשמלי" value="טוען" colorClass="border-accent text-accent" />
          <PowerNode icon={Zap} label="רשת" value="מייצא" colorClass="border-secondary text-secondary" />
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3"
      >
        <button
          onClick={() => toast.success('הסוללה מתחילה להיטען...')}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 active:scale-95 transition-all"
        >
          <Battery className="w-6 h-6" />
          <span className="leading-tight text-center">טען סוללה עכשיו</span>
        </button>
        <button
          onClick={() => toast.success('מכירה אוטומטית הופעלה')}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-secondary text-secondary-foreground font-bold text-xs hover:bg-secondary/90 active:scale-95 transition-all"
        >
          <Zap className="w-6 h-6" />
          <span className="leading-tight text-center">מכור לרשת אוטומטית</span>
        </button>
        <button
          onClick={() => toast.success('הרכב מתחיל להיטען...')}
          className="flex flex-col items-center gap-2 py-5 rounded-2xl bg-accent text-accent-foreground font-bold text-xs hover:bg-accent/90 active:scale-95 transition-all"
        >
          <Car className="w-6 h-6" />
          <span className="leading-tight text-center">טען רכב</span>
        </button>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: 'ייצור היום', value: '18.4 kWh', color: 'text-accent' },
          { label: 'צריכה', value: '6.2 kWh', color: 'text-secondary' },
          { label: 'נמכר לרשת', value: '9.8 kWh', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}