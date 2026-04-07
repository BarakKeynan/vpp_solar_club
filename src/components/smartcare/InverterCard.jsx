import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Zap, Activity } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function InverterCard({ inv }) {
  const { t } = useLang();
  const isOk = inv.status === 'ok';
  const tempHigh = inv.tempC > 55;

  return (
    <div
      className="rounded-xl p-3 space-y-2"
      style={{
        background: isOk ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.06)',
        border: `1px solid ${isOk ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.3)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white">{inv.name}</p>
        <div
          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{
            background: isOk ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.2)',
            color: isOk ? '#34D399' : '#F87171',
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-400' : 'bg-red-400'} ${!isOk && 'animate-pulse'}`} />
          {isOk ? t('ok_status') : t('fault_status')}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex justify-center mb-0.5"><Zap className="w-3 h-3 text-amber-400" /></div>
          <p className="text-sm font-black text-white">{inv.outputKw} kW</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('output')}</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-0.5">
            <Thermometer className={`w-3 h-3 ${tempHigh ? 'text-red-400' : 'text-blue-400'}`} />
          </div>
          <p className={`text-sm font-black ${tempHigh ? 'text-red-400' : 'text-white'}`}>{inv.tempC}°C</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('temperature')}</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-0.5"><Activity className="w-3 h-3 text-violet-400" /></div>
          <p className="text-sm font-black text-white">{inv.efficiency}%</p>
          <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{t('efficiency')}</p>
        </div>
      </div>

      {/* Efficiency bar */}
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{
            background: inv.efficiency >= 90 ? '#10B981' : inv.efficiency >= 75 ? '#F59E0B' : '#EF4444',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${inv.efficiency}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}