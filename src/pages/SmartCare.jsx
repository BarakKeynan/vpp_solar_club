import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Cloud, Droplets, Wind, Wrench, AlertTriangle, CheckCircle2, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// --- Data ---
const weatherData = { temp: 24, humidity: 62, clouds: 18, wind: 12 };

// dustAccumulation: ימים מאז ניקוי אחרון
const dustAccumulation = 14; // ימים
const dustLevelLabel = dustAccumulation < 7 ? 'נמוך' : dustAccumulation < 14 ? 'בינוני' : 'גבוה';
const dustColor = dustAccumulation < 7 ? 'text-primary' : dustAccumulation < 14 ? 'text-accent' : 'text-destructive';
const dustBg = dustAccumulation < 7 ? 'bg-primary/10 border-primary/30' : dustAccumulation < 14 ? 'bg-accent/10 border-accent/30' : 'bg-destructive/10 border-destructive/30';
const dustEfficiencyLoss = dustAccumulation < 7 ? 2 : dustAccumulation < 14 ? 7 : 14;

const panelStatus = [
  { name: 'פאנל A', efficiency: 94, daysSinceCleaning: 14, status: 'ניקוי מומלץ', color: 'text-accent' },
  { name: 'פאנל B', efficiency: 87, daysSinceCleaning: 14, status: 'ניקוי מומלץ', color: 'text-accent' },
  { name: 'פאנל C', efficiency: 91, daysSinceCleaning: 14, status: 'תקין', color: 'text-primary' },
  { name: 'פאנל D', efficiency: 72, daysSinceCleaning: 14, status: 'דרוש טיפול', color: 'text-destructive' },
];

const overallEfficiency = Math.round(panelStatus.reduce((s, p) => s + p.efficiency, 0) / panelStatus.length);
const effData = [{ name: 'יעילות', value: overallEfficiency, fill: 'hsl(var(--primary))' }];

// Maintenance recommendation logic
function getMaintenanceRecommendation() {
  const needsUrgent = panelStatus.some(p => p.efficiency < 80);
  const needsCleaning = dustAccumulation >= 14;
  if (needsUrgent) return { level: 'urgent', label: 'נדרש טיפול דחוף', color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/40', emoji: '🚨' };
  if (needsCleaning) return { level: 'cleaning', label: 'זמן לניקוי!', color: 'text-accent', bg: 'bg-accent/10 border-accent/40', emoji: '🧹' };
  return { level: 'ok', label: 'המערכת תקינה', color: 'text-primary', bg: 'bg-primary/10 border-primary/40', emoji: '✅' };
}

const recommendation = getMaintenanceRecommendation();

const services = [
  { id: 'clean', title: 'ניקוי פאנלים', price: '₪280', time: '2–3 שעות', icon: '🧹', rating: 4.8, recommended: recommendation.level === 'cleaning' },
  { id: 'inspect', title: 'בדיקת מערכת מלאה', price: '₪490', time: 'יום עסקים', icon: '🔍', rating: 4.9, recommended: false },
  { id: 'repair', title: 'תיקון ותחזוקה', price: 'מ-₪350', time: 'לפי צורך', icon: '🔧', rating: 4.7, recommended: recommendation.level === 'urgent' },
];

// --- Component ---
export default function SmartCare() {
  const [ordered, setOrdered] = useState(null);
  const [showPanelDetails, setShowPanelDetails] = useState(false);

  const handleOrder = (id) => {
    setOrdered(id);
    toast.success('הזמנת שירות נשלחה! נציג יצור איתך קשר תוך 24 שעות.');
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        Smart Care
      </motion.h1>

      {/* Main Recommendation Banner */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className={`rounded-2xl border p-4 flex items-center gap-3 ${recommendation.bg}`}>
        <span className="text-3xl">{recommendation.emoji}</span>
        <div>
          <p className={`text-base font-black ${recommendation.color}`}>{recommendation.label}</p>
          {recommendation.level === 'cleaning' && (
            <p className="text-xs text-foreground/70 mt-0.5">לא בוצע ניקוי {dustAccumulation} ימים — הפסד יעילות של ~{dustEfficiencyLoss}%</p>
          )}
          {recommendation.level === 'urgent' && (
            <p className="text-xs text-foreground/70 mt-0.5">פאנל D יורד ל-72% — מומלץ לתאם תיקון בהקדם</p>
          )}
          {recommendation.level === 'ok' && (
            <p className="text-xs text-foreground/70 mt-0.5">הפאנלים נקיים ויעילים — המשיכו כך!</p>
          )}
        </div>
      </motion.div>

      {/* Overall Efficiency + Weather */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
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
          <p className="text-2xl font-black text-primary -mt-4">{overallEfficiency}%</p>
          <p className="text-[10px] text-muted-foreground mt-1">ממוצע 4 פאנלים</p>
        </div>

        {/* Environmental Metrics */}
        <div className="bg-card border border-border rounded-2xl p-3 space-y-2">
          <p className="text-xs text-muted-foreground">תנאי סביבה</p>
          <div className="space-y-1.5">
            {[
              { Icon: Sun, label: `טמפ׳ ${weatherData.temp}°C`, color: 'text-accent' },
              { Icon: Droplets, label: `לחות ${weatherData.humidity}%`, color: 'text-secondary' },
              { Icon: Cloud, label: `עננות ${weatherData.clouds}%`, color: 'text-muted-foreground' },
              { Icon: Wind, label: `רוח ${weatherData.wind} קמ"ש`, color: 'text-primary' },
            ].map(({ Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="text-xs text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dust Accumulation Card */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className={`rounded-2xl border p-4 ${dustBg}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💨</span>
            <p className="text-sm font-bold text-foreground">צבירת אבק</p>
          </div>
          <span className={`text-sm font-black ${dustColor}`}>{dustLevelLabel}</span>
        </div>
        {/* Accumulation bar */}
        <div className="h-2.5 bg-muted rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((dustAccumulation / 21) * 100, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`h-full rounded-full ${dustAccumulation < 7 ? 'bg-primary' : dustAccumulation < 14 ? 'bg-accent' : 'bg-destructive'}`}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>ניקוי אחרון: לפני {dustAccumulation} ימים</span>
          <span>הפסד יעילות: ~{dustEfficiencyLoss}%</span>
        </div>
      </motion.div>

      {/* Panel Status — Collapsible */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowPanelDetails(v => !v)}
          className="w-full flex items-center justify-between p-4 text-xs font-bold text-muted-foreground">
          <span>סטטוס פאנלים</span>
          {showPanelDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <AnimatePresence>
          {showPanelDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden px-4 pb-4 space-y-2.5"
            >
              {panelStatus.map(panel => (
                <div key={panel.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-14">{panel.name}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${panel.efficiency}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className={`h-full rounded-full ${panel.efficiency >= 90 ? 'bg-primary' : panel.efficiency >= 80 ? 'bg-accent' : 'bg-destructive'}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground w-8">{panel.efficiency}%</span>
                  <span className={`text-xs font-semibold ${panel.color} w-24 text-right`}>{panel.status}</span>
                </div>
              ))}
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-1">
                <Info className="w-3 h-3" />
                יעילות מחושבת ביחס לתפוקה מקסימלית בתנאי מעבדה
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Services */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
        className="space-y-2">
        <p className="text-xs font-bold text-muted-foreground">הזמנת שירות</p>
        {services.map(s => (
          <div key={s.id} className={`bg-card border rounded-2xl p-4 flex items-center gap-3 transition-all ${s.recommended ? 'border-primary/50 bg-primary/5' : 'border-border'}`}>
            <div className="text-3xl">{s.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{s.title}</p>
                {s.recommended && <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold">מומלץ</span>}
              </div>
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
                className={`mt-1 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${ordered === s.id ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground active:scale-95'}`}
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