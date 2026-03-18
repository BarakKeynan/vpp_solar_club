import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function SavingsCounter() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">חיסכון היום</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black text-primary"
            >
              +187 ₪
            </motion.p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-xs text-muted-foreground">החודש</p>
          <p className="text-lg font-bold text-foreground">+4,230 ₪</p>
        </div>
      </div>
    </motion.div>
  );
}