import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, ArrowRight, Zap, Clock, CheckCircle2, Gauge } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChargeEV() {
  const navigate = useNavigate();
  const [charging, setCharging] = useState(false);
  const [evPct, setEvPct] = useState(34);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!charging) return;
    if (evPct >= 80) { setDone(true); setCharging(false); return; }
    const t = setTimeout(() => setEvPct(p => Math.min(p + 1, 80)), 100);
    return () => clearTimeout(t);
  }, [charging, evPct]);

  const range = Math.round(evPct * 4.8);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">טעינת רכב חשמלי</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 overflow-y-auto pb-32">
        {/* Car Visual */}
        <motion.div
          className="relative bg-card rounded-3xl border-2 border-accent/30 p-6 flex flex-col items-center gap-5 overflow-hidden"
          animate={{ borderColor: charging ? 'hsl(var(--accent) / 0.6)' : 'hsl(var(--accent) / 0.3)' }}
        >
          {/* Background glow */}
          <motion.div
            animate={{ opacity: charging ? [0.15, 0.35, 0.15] : 0 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-accent rounded-3xl blur-2xl"
          />

          {/* Car icon big */}
          <div className="relative">
            <div className="p-6 rounded-full bg-accent/10 border-2 border-accent/30">
              <Car className="w-16 h-16 text-accent" />
            </div>
            {charging && (
              <motion.div
                animate={{ opacity: [1, 0.3, 1], y: [-2, 2, -2] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-accent rounded-full p-1"
              >
                <Zap className="w-4 h-4 text-accent-foreground fill-accent-foreground" />
              </motion.div>
            )}
          </div>

          {/* Gauge / Progress */}
          <div className="w-full relative">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>0%</span>
              <span className="font-bold text-accent text-base">{evPct}% טעון</span>
              <span>100%</span>
            </div>
            <div className="w-full h-5 rounded-full bg-muted overflow-hidden">
              <motion.div
                animate={{ width: `${evPct}%` }}
                transition={{ duration: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent relative overflow-hidden"
              >
                {charging && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                )}
              </motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-muted-foreground">מטווח: {range} ק"מ</p>
              <p className="text-xs text-accent font-bold">יעד: 80%</p>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'זמן משוער', value: `${Math.round((80 - evPct) * 1.2)} דק'`, icon: Clock, color: 'text-secondary' },
            { label: 'עצמה', value: '7.4 kW', icon: Zap, color: 'text-accent' },
            { label: 'עלות', value: '0.22 ₪', icon: Gauge, color: 'text-primary' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-1 ${s.color}`} />
              <p className={`text-sm font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Smart charging tip */}
        <div className="bg-primary/10 border border-primary/30 rounded-2xl p-4 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-primary/20 mt-0.5">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">טיפ חכם</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              אנרגיה מהפאנלים הסולאריים – עלות <span className="text-primary font-bold">0 ₪</span> במקום 0.61 ₪/kWh מהרשת. חיסכון של <span className="text-primary font-bold">~32 ₪</span> בטעינה מלאה.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-8 bg-background/95 backdrop-blur border-t border-border">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full py-4 rounded-2xl bg-accent/20 border border-accent flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              <span className="text-accent font-black text-lg">הרכב טעון ל-80%!</span>
            </motion.div>
          ) : (
            <motion.button key="btn"
              whileTap={{ scale: 0.96 }}
              onClick={() => setCharging(c => !c)}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                charging
                  ? 'bg-muted text-foreground border border-border'
                  : 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
              }`}
            >
              {charging ? '⏸ עצור טעינה' : '🚗 טען רכב עכשיו'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}