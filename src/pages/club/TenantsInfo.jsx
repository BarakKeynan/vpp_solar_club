import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Home, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqs = [
  { q: 'אני גר בשכירות – זה מתאים לי?', a: 'בהחלט! המועדון הסולארי עובד ללא קשר לבעלות על הנכס. אתה חוסך על חשבון החשמל שלך, לא על בניין.' },
  { q: 'אין לי גג – איך מקבלים חשמל?', a: 'הפאנלים נמצאים בחוות גדולות בנגב. הזיכוי מחושב לפי חלקך בייצור ומנוכה ישירות מחשבון החשמל.' },
  { q: 'מה קורה אם אני עובר דירה?', a: 'המנוי עובר איתך לכתובת החדשה ללא עלות. גמישות מלאה.' },
];

export default function TenantsInfo() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">לדיירים ושוכרים</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 pb-16 overflow-y-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary/30 to-card rounded-3xl border border-secondary/40 p-6 text-center space-y-3">
          <div className="flex justify-center gap-3">
            <div className="p-3 rounded-2xl bg-secondary/20"><Building2 className="w-8 h-8 text-secondary" /></div>
            <div className="p-3 rounded-2xl bg-primary/20"><Home className="w-8 h-8 text-primary" /></div>
          </div>
          <h2 className="text-2xl font-black text-foreground">גג? לא חובה.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            עד היום רק בעלי בתים עם גג נהנו מאנרגיה סולארית.<br />
            <span className="text-foreground font-bold">עכשיו גם אתה יכול.</span>
          </p>
        </motion.div>

        {/* vs comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-bold text-muted-foreground">בלי המועדון</p>
              {['משלם מחיר מלא', 'תלוי ברשת', 'אין זיכוי', 'פחמן גבוה'].map(t => (
                <div key={t} className="flex items-center gap-2 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">{t}</span>
                </div>
              ))}
            </div>
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-bold text-primary">עם המועדון ✦</p>
              {['חיסכון עד 80 ₪', 'אנרגיה נקייה', 'זיכוי חודשי', 'אפס פחמן'].map(t => (
                <div key={t} className="flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span className="text-xs text-foreground font-medium">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Who is it for */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-sm font-black text-foreground mb-3">מיועד ל...</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏢', label: 'דיירי בניין', desc: 'גם ללא גג משותף' },
              { icon: '🏠', label: 'שוכרי דירה', desc: 'ללא אישור בעל הדירה' },
              { icon: '🏙️', label: 'תושבי ערים', desc: 'בכל רחבי ישראל' },
              { icon: '👨‍👩‍👧', label: 'משפחות', desc: 'מחיר אחיד לכולם' },
            ].map(b => (
              <div key={b.label} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-foreground">{b.label}</p>
                  <p className="text-[10px] text-muted-foreground">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="space-y-3">
          <p className="text-sm font-black text-foreground">שאלות נפוצות</p>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm font-bold text-foreground mb-1">{faq.q}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full py-4 bg-secondary text-secondary-foreground font-black text-base rounded-2xl hover:bg-secondary/90 active:scale-95 transition-all">
          הצטרף גם ללא גג ←
        </button>
      </div>
    </div>
  );
}