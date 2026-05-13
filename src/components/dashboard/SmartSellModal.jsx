import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, Brain, ArrowDown } from 'lucide-react';

export default function SmartSellModal({ open, onClose, nogaPrice, lang = 'he' }) {
  const isHe = lang === 'he';
  const marketPrice = nogaPrice?.price || 0.508;
  const sellPrice = +(marketPrice * 0.965).toFixed(3); // ~3.5% below market (provider agreement)
  const diff = +(marketPrice - sellPrice).toFixed(3);
  const batteryLevel = 82;
  const powerKw = 4.2;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl p-5 pb-28 overflow-y-auto"
            style={{
              maxHeight: '82vh',
              background: 'rgba(8,18,12,0.98)',
              border: '1px solid rgba(52,211,153,0.35)',
              borderBottom: 'none',
              boxShadow: '0 0 60px rgba(52,211,153,0.1), 0 -10px 40px rgba(0,0,0,0.6)',
              backdropFilter: 'blur(24px)',
              direction: isHe ? 'rtl' : 'ltr',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <button onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
              <div className={`flex-1 mx-3 ${isHe ? 'text-right' : 'text-left'}`}>
                <p className="text-sm font-black text-white">
                  {isHe ? 'מכירה חכמה — VPP Smart Sell' : 'Smart Sell — VPP Active'}
                </p>
                <p className="text-[10px] font-bold" style={{ color: 'rgba(52,211,153,0.7)' }}>
                  {isHe ? 'מכירה פעילה כרגע' : 'Currently selling'}
                </p>
              </div>
              {/* Live badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-400">Live</span>
              </div>
            </div>

            {/* Status Banner */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="rounded-2xl px-4 py-4 mb-4 flex items-center gap-3"
              style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.25)' }}
            >
              <div className="p-2.5 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div className={isHe ? 'text-right' : 'text-left'}>
                <p className="text-sm font-black text-white leading-snug">
                  {isHe ? 'המערכת מוכרת כעת חשמל לספק שלך' : 'System is currently selling power to your provider'}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: 'rgba(52,211,153,0.7)' }}>
                  {isHe ? `סלקום אנרגיה · ${powerKw} kW · בזמן אמת` : `Cellcom Energy · ${powerKw} kW · Real-time`}
                </p>
              </div>
            </motion.div>

            {/* Price Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl p-4 mb-4 space-y-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                {isHe ? 'מחיר — שוק מול מכירה' : 'Price — Market vs Your Sale'}
              </p>

              {/* Market price row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: '#f59e0b' }} />
                  <span className="text-[11px] text-white/50">
                    {isHe ? 'מחיר שוק נגה (SMP)' : 'Noga Market Price (SMP)'}
                  </span>
                </div>
                <span className="text-base font-black" style={{ color: '#f59e0b' }}>
                  ₪{marketPrice.toFixed(3)}
                </span>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-white/20" />
              </div>

              {/* Your sell price */}
              <div className="flex items-center justify-between rounded-xl px-3 py-2.5"
                style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">💰</span>
                  <span className="text-[11px] text-white/70 font-bold">
                    {isHe ? 'מחיר מכירה שלך (הסכם ספק)' : 'Your Sell Price (Provider Agreement)'}
                  </span>
                </div>
                <span className="text-lg font-black text-emerald-400">
                  ₪{sellPrice.toFixed(3)}
                </span>
              </div>

              {/* Spread */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-white/30">
                  {isHe ? `הפרש: ₪${diff} לקוט"ש` : `Spread: ₪${diff}/kWh`}
                </span>
                <span className="text-[10px] font-black" style={{ color: 'rgba(52,211,153,0.6)' }}>
                  {isHe ? `רווח שעתי מוערך: ₪${(sellPrice * powerKw).toFixed(2)}` : `Est. hourly revenue: ₪${(sellPrice * powerKw).toFixed(2)}`}
                </span>
              </div>
            </motion.div>

            {/* AI Brain Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl p-4 mb-4"
              style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div className="p-1.5 rounded-lg flex-shrink-0"
                  style={{ background: 'rgba(96,165,250,0.15)' }}>
                  <Brain className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-[11px] font-black text-blue-300">
                  {isHe ? 'למה המוח החליט למכור?' : 'Why did the AI decide to sell?'}
                </p>
              </div>
              <p className="text-[11px] text-white/55 leading-relaxed">
                {isHe
                  ? `המוח זיהה תעריף גבוה בנגה (₪${marketPrice.toFixed(3)}) וסוללה מלאה (${batteryLevel}%), ולכן מבצע מכירה אוטומטית לספק כדי למקסם רווח. הסוללה תיטען מחדש בשעות השפל.`
                  : `The AI detected a high Noga tariff (₪${marketPrice.toFixed(3)}) and a full battery (${batteryLevel}%), triggering automatic sale to maximize profit. Battery will recharge during off-peak hours.`}
              </p>
            </motion.div>

            {/* Battery + Power Stats */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-2.5"
            >
              <div className="rounded-2xl p-3.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] text-white/35 mb-1">
                  {isHe ? 'רמת סוללה' : 'Battery Level'}
                </p>
                <p className="text-2xl font-black text-emerald-400">{batteryLevel}%</p>
                <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: `${batteryLevel}%` }} />
                </div>
              </div>
              <div className="rounded-2xl p-3.5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[9px] text-white/35 mb-1">
                  {isHe ? 'הספק מכירה' : 'Sell Power'}
                </p>
                <p className="text-2xl font-black" style={{ color: '#60a5fa' }}>{powerKw} kW</p>
                <p className="text-[9px] text-white/30 mt-1">
                  {isHe ? 'יציאה לרשת' : 'Flowing to grid'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}