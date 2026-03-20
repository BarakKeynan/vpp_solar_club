import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, ArrowRight, Sun, Zap, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChargeBattery() {
  const navigate = useNavigate();
  const [charging, setCharging] = useState(false);
  const [progress, setProgress] = useState(82);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!charging) return;
    if (progress >= 100) { setDone(true); setCharging(false); return; }
    const t = setTimeout(() => setProgress(p => Math.min(p + 1, 100)), 80);
    return () => clearTimeout(t);
  }, [charging, progress]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">טעינת סוללה</h1>
      </div>

      <div className="flex-1 p-6 flex flex-col items-center justify-center gap-8">
        {/* Battery Visual */}
        <motion.div className="relative flex flex-col items-center gap-4">
          {/* Glow */}
          <motion.div
            animate={{ opacity: charging ? [0.3, 0.8, 0.3] : 0.2, scale: charging ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary rounded-full blur-3xl"
          />

          {/* Big Battery Icon */}
          <div className="relative w-48 h-80 rounded-[2rem] border-4 border-primary bg-card flex flex-col-reverse overflow-hidden">
            {/* Top cap */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-3 bg-primary rounded-t-lg" />

            {/* Fill */}
            <motion.div
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="w-full bg-gradient-to-t from-primary via-primary/80 to-primary/60 rounded-b-[1.5rem]"
            />

            {/* Percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.p
                  key={progress}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-black text-foreground drop-shadow"
                >
                  {progress}%
                </motion.p>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(progress * 0.2 * 10) / 10} / 20 kWh
                </p>
              </div>
            </div>

            {/* Bolt when charging */}
            <AnimatePresence>
              {charging && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [1, 0.5, 1], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="absolute top-4 right-4"
                >
                  <Zap className="w-6 h-6 text-accent fill-accent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Source Info */}
        <div className="w-full max-w-sm flex items-center justify-center gap-4 bg-card rounded-2xl border border-border p-4">
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-xl bg-accent/20">
              <Sun className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">מקור</p>
            <p className="text-sm font-bold text-foreground">פאנלים סולאריים</p>
          </div>
          <div className="flex items-center gap-1">
            {[0,1,2].map(i => (
              <motion.div key={i}
                animate={{ opacity: charging ? [0.2,1,0.2] : 0.3 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 rounded-full bg-primary"
              />
            ))}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-xl bg-primary/20">
              <Battery className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">עצמה</p>
            <p className="text-sm font-bold text-foreground">4.2 kW</p>
          </div>
        </div>

        {/* Estimated time */}
        <p className="text-sm text-muted-foreground">
          {done ? '✓ הסוללה טעונה במלואה' : `זמן משוער: ${Math.round((100 - progress) * 0.08)} דקות`}
        </p>
      </div>

      {/* CTA */}
      <div className="p-6 pb-10">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-full py-4 rounded-2xl bg-primary/20 border border-primary flex items-center justify-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-primary font-black text-lg">הסוללה מלאה!</span>
            </motion.div>
          ) : (
            <motion.button key="btn"
              whileTap={{ scale: 0.96 }}
              onClick={() => setCharging(c => !c)}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${
                charging
                  ? 'bg-muted text-foreground border border-border'
                  : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
              }`}
            >
              {charging ? '⏸ עצור טעינה' : '⚡ התחל טעינה עכשיו'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}