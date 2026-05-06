import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap } from 'lucide-react';

export default function SavingsHero({ totalSaved, baseline, billWithout, billWith, loading }) {
  const pct = billWithout > 0 ? Math.round((totalSaved / billWithout) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(16,185,129,0.18) 0%, rgba(16,185,129,0.06) 60%, rgba(59,130,246,0.08) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
      }}
    >
      {/* Top label */}
      <div className="px-5 pt-4 flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-black text-emerald-400/80 uppercase tracking-widest">חיסכון החודש</span>
        </div>
        <div className="mr-auto flex items-center gap-1 text-[10px] text-white/30 font-bold">
          <Zap className="w-3 h-3" />
          ניהול אנרגיה חכם
        </div>
      </div>

      {/* Big number */}
      <div className="px-5 py-3">
        {loading ? (
          <div className="h-14 w-40 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-5xl font-black text-emerald-400 leading-none">
              +{totalSaved.toLocaleString('he-IL')}
            </span>
            <span className="text-2xl font-black text-emerald-400/70 mb-1">₪</span>
          </div>
        )}
        <p className="text-xs text-white/40 mt-1.5">
          חסכת <span className="text-white/70 font-bold">{pct}%</span> מחשבון החשמל שלך החודש
        </p>
      </div>

      {/* Comparison bar */}
      <div className="px-5 pb-4 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-white/40 font-bold">
          <span>חשבון ללא המערכת</span>
          <span className="text-white/60">{billWithout.toLocaleString('he-IL')} ₪</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #10b981, #34d399)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-white/40 font-bold">
          <span>שילמת בפועל</span>
          <span className="text-emerald-400 font-black">{billWith.toLocaleString('he-IL')} ₪</span>
        </div>
      </div>

      {/* Trend badge */}
      <div className="px-5 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-black text-emerald-400">+12% לעומת החודש הקודם</span>
        </div>
      </div>
    </motion.div>
  );
}