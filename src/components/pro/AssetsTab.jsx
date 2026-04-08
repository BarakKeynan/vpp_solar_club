import React from 'react';
import SmartAssetCard from './SmartAssetCard';
import { motion } from 'framer-motion';
import { MapPin, Sun, TrendingUp } from 'lucide-react';

const FARMS = (isHe) => [
  { name: isHe ? 'חווה גלבוע' : 'Gilboa Farm', location: isHe ? 'עמק יזרעאל' : 'Jezreel Valley', shares: 3, yield: '10.4%', income: '₪312', status: 'active' },
  { name: isHe ? 'חווה ערבה' : 'Arava Farm', location: isHe ? 'ערבה הדרומית' : 'Southern Arava', shares: 2, yield: '9.8%', income: '₪198', status: 'active' },
];

export default function AssetsTab({ isHe }) {
  return (
    <div className="p-5 space-y-5">
      <h1 className="text-xl font-black text-white">{isHe ? 'הנכסים שלי' : 'My Assets'}</h1>

      {/* Farm Holdings */}
      <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <p className="text-sm font-black text-white mb-3">{isHe ? 'החזקות בחוות סולאריות' : 'Solar Farm Holdings'}</p>
        <div className="space-y-3">
          {FARMS(isHe).map((farm, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <Sun className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">{farm.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-white/30" />
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{farm.location}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-emerald-400">{farm.income}<span className="text-[9px] text-white/30">/{isHe ? 'חודש' : 'mo'}</span></p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <TrendingUp className="w-2.5 h-2.5 text-blue-400" />
                  <span className="text-[10px] text-blue-400 font-bold">{farm.yield}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Battery Diagnostics */}
      <SmartAssetCard isHe={isHe} />
    </div>
  );
}