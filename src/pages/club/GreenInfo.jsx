import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Wind, Sun, Droplets } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const facts = [
  { icon: Sun, color: 'text-accent bg-accent/20', title: '100% אנרגיה מתחדשת', desc: 'כל הכסף שלך מייצר חשמל נקי מהשמש – ללא פחמן, ללא זיהום.' },
  { icon: Leaf, color: 'text-primary bg-primary/20', title: 'חיסכון של 1.2 טון CO₂', desc: 'כל מניה שנתית שווה ערך לנטיעת 60 עצים. אתה חלק מהפתרון.' },
  { icon: Wind, color: 'text-secondary bg-secondary/20', title: 'אנרגיה מהנגב', desc: 'החוות שלנו ממוקמות בנגב – שטחי שמש מרביים, יעילות מקסימלית.' },
  { icon: Droplets, color: 'text-secondary bg-secondary/20', title: 'ללא מים ללא פסולת', desc: 'אנרגיה סולארית אינה צורכת מים ואינה מייצרת פסולת רעילה.' },
];

export default function GreenInfo() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">100% אנרגיה ירוקה</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 pb-16 overflow-y-auto">
        {/* Hero visual */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-card rounded-3xl border border-primary/30 p-8 flex flex-col items-center gap-3 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full border border-primary/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-secondary/10"
          />
          <div className="text-6xl">🌱</div>
          <p className="text-3xl font-black text-primary text-center">הפלנטה מודה לך</p>
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            בחירה במועדון הסולארי היא לא רק חיסכון כלכלי –<br />
            זו בחירה לעתיד טוב יותר לדור הבא.
          </p>
        </motion.div>

        {/* Facts */}
        <div className="space-y-3">
          {facts.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="flex items-start gap-4 bg-card rounded-2xl border border-border p-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${f.color}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact counter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-primary/10 border border-primary/30 rounded-2xl p-5">
          <p className="text-xs text-muted-foreground mb-3 text-center">ההשפעה הקולקטיבית של חברי המועדון</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { value: '247', label: 'חברי מועדון', color: 'text-primary' },
              { value: '412 טון', label: 'CO₂ חסכנו', color: 'text-primary' },
              { value: '2.8 MW', label: 'הספק כולל', color: 'text-accent' },
            ].map(s => (
              <div key={s.label}>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full py-4 bg-primary text-primary-foreground font-black text-base rounded-2xl hover:bg-primary/90 active:scale-95 transition-all">
          הצטרף ותהיה חלק מהשינוי ←
        </button>
      </div>
    </div>
  );
}