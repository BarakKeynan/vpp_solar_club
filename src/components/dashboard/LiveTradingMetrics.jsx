import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Package } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function LiveTradingMetrics() {
  const { t } = useLang();
  const [profit, setProfit] = useState(187);
  const [inventory, setInventory] = useState(9.8);

  useEffect(() => {
    const interval = setInterval(() => {
      setProfit(p => +(p + (Math.random() * 3.5 + 0.5)).toFixed(0));
      setInventory(v => +(Math.max(0, v - Math.random() * 0.1)).toFixed(1));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const inventoryValue = (inventory * 0.61).toFixed(2);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.12 }}
      className="grid grid-cols-2 gap-3"
    >
      {/* Inventory Meter */}
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{
          background: 'linear-gradient(135deg,rgba(59,130,246,0.1),rgba(59,130,246,0.04))',
          border: '1px solid rgba(59,130,246,0.25)',
        }}
      >
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4" style={{ color: '#3B82F6' }} />
          <p className="text-[10px] font-bold" style={{ color: 'rgba(147,197,253,0.7)' }}>{t('trading_inventory')}</p>
        </div>
        <p className="text-2xl font-black text-white">{inventory} <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>kWh</span></p>
        <p className="text-xs font-bold" style={{ color: '#93C5FD' }}>≈ ₪{inventoryValue}</p>
      </div>

      {/* Sales Ticker */}
      <div
        className="rounded-2xl p-4 space-y-2"
        style={{
          background: 'linear-gradient(135deg,rgba(245,158,11,0.1),rgba(245,158,11,0.04))',
          border: '1px solid rgba(245,158,11,0.25)',
        }}
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" style={{ color: '#F59E0B' }} />
          <p className="text-[10px] font-bold" style={{ color: 'rgba(253,211,77,0.7)' }}>{t('trading_profit_today')}</p>
        </div>
        <motion.p
          key={profit}
          initial={{ scale: 1.1, color: '#FCD34D' }}
          animate={{ scale: 1, color: '#ffffff' }}
          className="text-2xl font-black"
        >
          +{profit} <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>₪</span>
        </motion.p>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <p className="text-[10px]" style={{ color: 'rgba(52,211,153,0.8)' }}>{t('trading_realtime')}</p>
        </div>
      </div>

      {/* Profit Gap Table */}
      <div
        className="col-span-2 rounded-2xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs font-bold mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('trading_profit_gap')}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('trading_current_tariff')}</span>
            <span className="text-xs font-bold" style={{ color: '#6B7280' }}>0.48 ₪/kWh</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('trading_syndicate_tariff')}</span>
            <span className="text-xs font-bold" style={{ color: '#8B5CF6' }}>0.61 ₪/kWh</span>
          </div>
          <div
            className="flex items-center justify-between rounded-xl px-3 py-2 mt-1"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}
          >
            <span className="text-xs font-black" style={{ color: '#C4B5FD' }}>{t('trading_saved_month')}</span>
            <span className="text-sm font-black" style={{ color: '#A78BFA' }}>₪140 💜</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}