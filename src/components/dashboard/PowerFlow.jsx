import React from 'react';
import { Sun, Battery, Home, Car, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

function FlowNode({ icon: Icon, label, value, color, glowing }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-1"
    >
      <div className={`relative p-3 rounded-2xl border-2 ${color}`}>
        {glowing && (
          <div className={`absolute -inset-1 rounded-2xl opacity-30 blur-md ${color.includes('primary') ? 'bg-primary' : color.includes('secondary') ? 'bg-secondary' : 'bg-accent'}`} />
        )}
        <Icon className="w-6 h-6 relative z-10" />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">{label}</span>
      {value && <span className="text-xs font-bold">{value}</span>}
    </motion.div>
  );
}

function FlowArrow({ direction = 'left', active }) {
  return (
    <div className="flex items-center px-1">
      <div className={`flex items-center gap-0.5 ${active ? 'text-primary' : 'text-muted-foreground/30'}`}>
        {direction === 'left' ? (
          <>
            <motion.div
              animate={{ opacity: active ? [0.3, 1, 0.3] : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-0.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </motion.div>
            <span className="text-xs">◂</span>
          </>
        ) : (
          <>
            <span className="text-xs">▸</span>
            <motion.div
              animate={{ opacity: active ? [0.3, 1, 0.3] : 0.3 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex gap-0.5"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
              <div className="w-1.5 h-1.5 rounded-full bg-current" />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PowerFlow() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">זרימת אנרגיה</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-medium">פעיל</span>
        </div>
      </div>

      {/* Top Row: Sun → Panels → Battery */}
      <div className="flex items-center justify-center mb-4">
        <FlowNode
          icon={Sun}
          label="שמש"
          value="4.2 kW"
          color="border-accent text-accent"
          glowing
        />
        <FlowArrow direction="left" active />
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-md animate-pulse" />
            <div className="relative p-4 rounded-2xl border-2 border-primary text-primary bg-primary/5">
              <Battery className="w-8 h-8" />
            </div>
          </div>
          <span className="text-[10px] text-muted-foreground font-medium">סוללה</span>
          <span className="text-lg font-black text-primary">82%</span>
        </div>
        <FlowArrow direction="right" active />
        <FlowNode
          icon={Home}
          label="בית"
          value="1.8 kW"
          color="border-secondary text-secondary"
          glowing
        />
      </div>

      {/* Bottom Row: EV + Grid */}
      <div className="flex items-center justify-center gap-6">
        <FlowNode
          icon={Car}
          label="רכב חשמלי"
          value="טוען"
          color="border-accent text-accent"
        />
        <FlowNode
          icon={Zap}
          label="רשת"
          value="מייצא"
          color="border-secondary text-secondary"
        />
      </div>
    </div>
  );
}