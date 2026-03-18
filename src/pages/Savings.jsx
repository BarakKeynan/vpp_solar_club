import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Thermometer, Droplets, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const chartData = [
  { hour: '06:00', savings: 0 },
  { hour: '08:00', savings: 5 },
  { hour: '10:00', savings: 12 },
  { hour: '12:00', savings: 22 },
  { hour: '14:00', savings: 30 },
  { hour: '16:00', savings: 35 },
  { hour: '18:00', savings: 41 },
  { hour: '20:00', savings: 45 },
  { hour: '22:00', savings: 47 },
];

const movedDevices = [
  { name: 'מזגן סלון', from: '14:00', to: '11:00', saved: '12 ₪', icon: Thermometer },
  { name: 'דוד שמש', from: '17:00', to: '12:00', saved: '8 ₪', icon: Droplets },
  { name: 'מכונת כביסה', from: '19:00', to: '13:00', saved: '6 ₪', icon: ArrowDown },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 text-xs" dir="rtl">
        <p className="font-bold text-primary">+{payload[0].value} ₪</p>
      </div>
    );
  }
  return null;
};

export default function Savings() {
  return (
    <div className="px-4 pt-6 space-y-5">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-bold">חיסכון</h1>
        <p className="text-sm text-muted-foreground mt-1">סיכום החיסכון שלך</p>
      </motion.div>

      {/* Main Savings Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-l from-primary/25 via-primary/15 to-card rounded-2xl border border-primary/30 p-6"
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary/20">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">חסכת היום</p>
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-4xl font-black text-primary"
            >
              +47 ₪
            </motion.p>
            <p className="text-xs text-muted-foreground mt-1">החודש: +1,290 ₪</p>
          </div>
        </div>
      </motion.div>

      {/* Savings Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="text-sm font-bold mb-4">חיסכון במהלך היום</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="hsl(160, 84%, 44%)"
                strokeWidth={2.5}
                fill="url(#savingsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Moved Devices */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <h3 className="text-sm font-bold">מכשירים שהוזזו</h3>
        {movedDevices.map((device, i) => (
          <motion.div
            key={device.name}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-muted">
                <device.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-bold">{device.name}</p>
                <p className="text-xs text-muted-foreground">
                  {device.from} ← {device.to}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-primary">{device.saved}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}