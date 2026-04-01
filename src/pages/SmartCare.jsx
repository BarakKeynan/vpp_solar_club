import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Droplets, Wind, Wrench, AlertTriangle, CheckCircle2, Calendar, Star } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const weatherData = {
  temp: 24,
  humidity: 62,
  clouds: 18,
  wind: 12,
  dustLevel: 'בינוני',
};

const panelStatus = [
  { name: 'פאנל A', efficiency: 94, status: 'תקין', color: 'text-primary' },
  { name: 'פאנל B', efficiency: 87, status: 'ניקוי מומלץ', color: 'text-accent' },
  { name: 'פאנל C', efficiency: 91, status: 'תקין', color: 'text-primary' },
  { name: 'פאנל D', efficiency: 72, status: 'דרוש טיפול', color: 'text-destructive' },
];

const insights = [
  { icon: AlertTriangle, color: 'text-accent', bg: 'bg-accent/10', title: 'אבק מצטבר', text: 'רמת אבק בינונית זוהתה. ניקוי צפוי לשפר יעילות ב-12%.' },
  { icon: Cloud, color: 'text-secondary', bg: 'bg-secondary/10', title: 'עננות חלקית', text: '18% עננות — ייצור יורד ב-8% ביחס לאתמול.' },
  { icon: CheckCircle2, color: 'text-primary', bg: 'bg-primary/10', title: 'מערכת תקינה', text: 'כל החיבורים והאינוורטרים פועלים כנדרש.' },
];

const services = [
  { id: 'clean', title: 'ניקוי פאנלים', price: '₪280', time: '2–3 שעות', icon: '🧹', rating: 4.8 },
  { id: 'inspect', title: 'בדיקת מערכת מלאה', price: '₪490', time: 'יום עסקים', icon: '🔍', rating: 4.9 },
  { id: 'repair', title: 'תיקון ותחזוקה', price: 'מ-₪350', time: 'לפי צורך', icon: '🔧', rating: 4.7 },
];

const effData = [{ name: 'יעילות', value: 86, fill: 'hsl(var(--primary))' }];

export default function SmartCare() {
  const [ordered, setOrdered] = useState(null);

  const handleOrder = (id) => {
    setOrdered(id);
    toast.success('הזמנת שירות נשלחה! נציג יצור איתך קשר תוך 24 שעות.');
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        Smart Care & תחזוקה
      </motion.h1>

      {/* Weather & Overall Efficiency */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3">
        {/* Efficiency Gauge */}
        <div className="bg-card border border-border rounded-2xl p-3 flex flex-col items-center">
          <p className="text-xs text-muted-foreground mb-1">יעילות כוללת</p>
          <div className="h-20 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="100%" innerRadius="60%" outerRadius="100%" startAngle={180} endAngle={0} data={effData}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'hsl(var(--muted))' }} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-2xl font-black text-primary -mt-4">86%</p>
        </div>

        {/* Weather */}
        <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
          <p className="text-xs text-muted-foreground">מזג אוויר</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { Icon: Sun, label: `${weatherData.temp}°C`, color: 'text-accent' },
              { Icon: Droplets, label: `${weatherData.humidity}%`, color: 'text-secondary' },
              { Icon: Cloud, label: `${weatherData.clouds}%`, color: 'text-muted-foreground' },
              { Icon: Wind, label: `${weatherData.wind} קמ"ש`, color: 'text-primary' },
            ].map(({ Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1">
                <Icon className={`w-3 h-3 ${color}`} />
                <span className="text-xs text-foreground">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-1 px-2 py-1 bg-accent/10 rounded-lg">
            <p className="text-xs text-accent font-semibold">אבק: {weatherData.dustLevel}</p>
          </div>
        </div>
      </motion.div>

      {/* Panel Status */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">סטטוס פאנלים</p>
        <div className="space-y-2.5">
          {panelStatus.map(panel => (
            <div key={panel.name} className="flex items-center gap-3">
              <span className="text-xs font-bold text-muted-foreground w-14">{panel.name}</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${panel.efficiency}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${panel.efficiency >= 90 ? 'bg-primary' : panel.efficiency >= 80 ? 'bg-accent' : 'bg-destructive'}`}
                />
              </div>
              <span className="text-xs font-bold text-foreground w-8">{panel.efficiency}%</span>
              <span className={`text-xs font-semibold ${panel.color} w-24 text-right`}>{panel.status}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">תובנות AI</p>
        {insights.map((ins, i) => (
          <div key={i} className={`${ins.bg} border border-border rounded-2xl p-3 flex items-start gap-3`}>
            <ins.icon className={`w-4 h-4 ${ins.color} mt-0.5 flex-shrink-0`} />
            <div>
              <p className={`text-xs font-bold ${ins.color}`}>{ins.title}</p>
              <p className="text-xs text-foreground/80 mt-0.5">{ins.text}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Services */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">הזמנת שירות</p>
        {services.map((s, i) => (
          <div key={s.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="text-3xl">{s.icon}</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">{s.title}</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-muted-foreground">{s.time}</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-xs text-muted-foreground">{s.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-foreground">{s.price}</p>
              <button
                onClick={() => handleOrder(s.id)}
                disabled={ordered === s.id}
                className={`mt-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${ordered === s.id ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground'}`}
              >
                {ordered === s.id ? '✓ הוזמן' : 'הזמן'}
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}