import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, MessageCircle, BookOpen, ChevronDown, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const faqs = [
  {
    q: 'איך אני מחבר את הסוללה למערכת?',
    a: 'היכנס להגדרות > חיבור מכשירים > סרוק את קוד ה-QR של הסוללה. המערכת תזהה אותה אוטומטית תוך דקות.',
  },
  {
    q: 'מתי כדאי למכור אנרגיה לרשת?',
    a: 'המערכת ממליצה למכור בשעות 17:00-22:00 כשתעריף החשמל גבוה. ניתן להפעיל מצב אוטומטי שינהל את זה בשבילך.',
  },
  {
    q: 'איך מחשבים את החיסכון?',
    a: 'החיסכון מחושב לפי ההפרש בין תעריף הרכישה מהרשת לעלות הייצור הסולארי, כולל הכנסות ממכירה לרשת.',
  },
  {
    q: 'האם המערכת עובדת בהפסקת חשמל?',
    a: 'כן! הסוללה עוברת אוטומטית למצב גיבוי ומספקת חשמל לבית. ודא שהסוללה טעונה מעל 20%.',
  },
];

export default function Support() {
  const [openFaq, setOpenFaq] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('הפנייה נשלחה! נחזור אליך בהקדם.');
    setName('');
    setMessage('');
  };

  return (
    <div className="px-4 pt-6 space-y-5 pb-4">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-bold">תמיכה</h1>
        <p className="text-sm text-muted-foreground mt-1">איך אפשר לעזור?</p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { icon: Phone, label: 'חייג אלינו', color: 'bg-primary/20 text-primary' },
          { icon: MessageCircle, label: 'צ׳אט חי', color: 'bg-secondary/20 text-secondary' },
          { icon: BookOpen, label: 'מדריך', color: 'bg-accent/20 text-accent' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => toast.info(`${item.label} - בקרוב!`)}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2"
          >
            <div className={`p-2 rounded-xl ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
          שאלות נפוצות
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-semibold text-right">{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 flex-shrink-0 ${
                    openFaq === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pr-11">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-5"
      >
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          צור קשר
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            placeholder="שם מלא"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted border-border text-sm"
            required
          />
          <Textarea
            placeholder="מה נוכל לעזור?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-muted border-border text-sm h-24 resize-none"
            required
          />
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
          >
            שלח פנייה
          </Button>
        </form>
      </motion.div>
    </div>
  );
}