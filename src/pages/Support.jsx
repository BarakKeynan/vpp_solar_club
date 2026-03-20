import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ChevronDown, Send } from 'lucide-react';
import { toast } from 'sonner';

const faqs = [
  { q: 'איך מחברים את הסוללה?', a: 'ניתן לחבר את הסוללה דרך הגדרות > מכשירים מחוברים. נדרש טכנאי מוסמך להתקנה.' },
  { q: 'מתי מוכרים אנרגיה לרשת?', a: 'המערכת מוכרת אוטומטית בשעות שיא הצריכה (18:00–22:00) כשהסוללה מעל 50%.' },
  { q: 'מה זה Solar Club?', a: 'מועדון סולארי וירטואלי לדיירים ללא גג. קונים מניות בחווה משותפת ומקבלים זיכוי בחשבון החשמל.' },
  { q: 'האם הנתונים שלי מאובטחים?', a: 'כל הנתונים מוצפנים ב-AES-256 ומאוחסנים בשרתים בישראל בהתאם לחוק הגנת הפרטיות.' },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error('נא למלא את כל השדות'); return; }
    toast.success('הפנייה נשלחה! נחזור אליך תוך 24 שעות');
    setForm({ subject: '', message: '' });
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        תמיכה
      </motion.h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => toast.success('מעביר לשיחה...')}
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors">
          <div className="p-2 rounded-xl bg-primary/20">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">שיחה</p>
            <p className="text-xs text-muted-foreground">א-ה 08:00–18:00</p>
          </div>
        </button>
        <button onClick={() => toast.success('פותח צ\'אט חי...')}
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-secondary/50 transition-colors">
          <div className="p-2 rounded-xl bg-secondary/20">
            <MessageCircle className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">צ'אט חי</p>
            <p className="text-xs text-muted-foreground">24/7 זמין</p>
          </div>
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground p-4 pb-2">שאלות נפוצות</p>
        {faqs.map((faq, i) => (
          <div key={i} className="border-t border-border">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-right"
            >
              <span className="text-sm font-semibold text-foreground">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mr-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">שלח פנייה</p>
        <input
          placeholder="נושא הפנייה"
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <textarea
          placeholder="תאר את הבעיה..."
          rows={3}
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
        />
        <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all">
          <Send className="w-4 h-4" />
          שלח פנייה
        </button>
      </form>
    </div>
  );
}