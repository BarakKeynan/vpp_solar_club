import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const communityData = [
  { name: 'Jan', kwh: 1420 }, { name: 'Feb', kwh: 1580 }, { name: 'Mar', kwh: 2100 },
  { name: 'Apr', kwh: 2450 }, { name: 'May', kwh: 2890 }, { name: 'Jun', kwh: 3120 },
];

export default function CommunityTab({ isHe }) {
  return (
    <div className="p-5 space-y-5">
      <h1 className="text-xl font-black text-white">{isHe ? 'הקהילה שלי' : 'My Community'}</h1>

      {/* Syndicate card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(16,185,129,0.08))', border: '1px solid rgba(59,130,246,0.25)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-base font-black text-white">{isHe ? 'סינדיקט הכרמל' : 'Carmel Syndicate'}</p>
            <p className="text-[10px] text-blue-400">{isHe ? 'חיפה — 84% פעיל' : 'Haifa — 84% active'}</p>
          </div>
          <div className="px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span className="text-xs font-black text-emerald-400">#3 {isHe ? 'בדירוג' : 'Ranked'}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users, label: isHe ? 'חברים' : 'Members', value: '142', color: '#3b82f6' },
            { icon: Zap, label: isHe ? 'הוזרם היום' : 'Streamed Today', value: '18.4 kWh', color: '#10b981' },
            { icon: Award, label: isHe ? 'חיסכון קבוצתי' : 'Group Savings', value: '₪2,840', color: '#f59e0b' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <p className="text-sm font-black text-white">{value}</p>
              <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Community production chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{ background: 'linear-gradient(145deg,#0d1829,#0b1220)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-black text-white mb-4">{isHe ? 'ייצור קהילתי (kWh)' : 'Community Production (kWh)'}</p>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={communityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0d1829', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 12, fontSize: 11 }} />
            <Bar dataKey="kwh" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Referral */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex items-center justify-between"
        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <div>
          <p className="text-sm font-black text-white">{isHe ? 'הפנה חבר' : 'Refer a Friend'}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{isHe ? 'צבור פאנל וירטואלי + VIP' : 'Earn virtual panel + VIP access'}</p>
        </div>
        <div className="px-4 py-2 rounded-xl text-xs font-black text-white" style={{ background: 'rgba(167,139,250,0.2)' }}>
          {isHe ? 'שתף' : 'Share'}
        </div>
      </motion.div>
    </div>
  );
}