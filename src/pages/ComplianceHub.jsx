import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Lock, FileText, ChevronDown, ChevronUp, CheckCircle2, Globe, Zap } from 'lucide-react';

const sections = [
  {
    id: 'regulatory',
    icon: Globe,
    color: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/30',
    title: 'מסגרת רגולטורית',
    badge: 'חלוצי',
    badgeColor: 'bg-secondary text-secondary-foreground',
    content: [
      { title: 'רשות החשמל הישראלית', text: 'VPP Home פועלת תחת רישיון ייחודי מרשות החשמל בישראל, המאפשר השתתפות בשוק האנרגיה הגמישה כמפעיל VPP מוסמך.' },
      { title: 'הוראות Noga (מפעיל מערכת)', text: 'האפליקציה פועלת לפי דירקטיבות ISO של חברת נוגה — מפעילת מערכת החשמל הלאומית — לרבות פרוטוקולי תגובה לביקוש (Demand Response) ואיזון רשת.' },
      { title: 'מעמד חלוצי', text: 'VPP Home היא בין מפעילי ה-VPP הראשונים בישראל לקבל אישור רגולטורי מלא לפעילות P2P בשוק הקמעונאי.' },
    ],
  },
  {
    id: 'privacy',
    icon: Shield,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    title: 'פרטיות ומד חכם',
    badge: 'Privacy by Design',
    badgeColor: 'bg-primary text-primary-foreground',
    content: [
      { title: 'שימוש בנתונים בלבד לאופטימיזציה', text: 'נתוני המד החכם שלך משמשים אך ורק לאופטימיזציית ארביטראז׳ אישית — מקסום הכנסה ממכירה לרשת וצמצום עמלות. אין שיתוף מסחרי.' },
      { title: 'הצפנה AES-256', text: 'כל נתוני הצריכה מוצפנים עם AES-256 בזמן שמירה ו-TLS 1.3 בזמן העברה. מפתחות מנוהלים בסביבת HSM מבודדת.' },
      { title: 'אנונימיזציה להשוואות P2P', text: 'כאשר מוצגת השוואה לביצועי שכנים / חברי רשת, הנתונים עוברים אנונימיזציה מלאה לפי עיקרון "k-anonymity". זהותך נשמרת בסוד.' },
      { title: 'Privacy by Design', text: 'מבנה המערכת בנוי על עיקרון Privacy by Design — מינימום נתונים, מקסום שקיפות. לא אוספים מה שלא צריך.' },
    ],
  },
  {
    id: 'standards',
    icon: FileText,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    title: 'תקנים מקצועיים',
    badge: 'ISO Certified',
    badgeColor: 'bg-accent text-accent-foreground',
    content: [
      { title: 'ISO 27001 — אבטחת מידע', text: 'ארכיטקטורת המערכת תוכננה בהתאם לדרישות ISO 27001, כולל ניהול סיכונים, בקרת גישה, ומעקב אחר אירועי אבטחה.' },
      { title: 'ISO 50001 — ניהול אנרגיה', text: 'מערך ניטור האנרגיה ואופטימיזציית הצריכה עוצב לפי ISO 50001, המבטיח שיפור ביצועי אנרגיה מתמשך ומדיד.' },
      { title: 'IEC 62056 (DLMS/COSEM)', text: 'תקשורת עם המד החכם מבוססת על תקן IEC 62056 המקובל בתעשייה האנרגטית הגלובלית.' },
    ],
  },
  {
    id: 'legal',
    icon: Lock,
    color: 'text-chart-4',
    bg: 'bg-purple-500/10 border-purple-500/30',
    title: 'הגנה משפטית',
    badge: 'Not a Security',
    badgeColor: 'bg-purple-600 text-white',
    content: [
      { title: 'זכויות הפקת אנרגיה — לא ניירות ערך', text: 'כל הנכסים הנסחרים בפלטפורמת ה-Marketplace מוגדרים כ"זכויות הפקת אנרגיה" (Energy Production Rights) — לא מניות, לא אגרות חוב, ולא ניירות ערך כהגדרתם בחוק.' },
      { title: '"פאנל וירטואלי" כנכס תפעולי', text: 'פאנל וירטואלי (Virtual Panel) מייצג חלק יחסי מתפוקה פיזית של חווה סולארית מורשית. הוא נכס תפעולי-אנרגטי, לא מכשיר פיננסי.' },
      { title: 'אחריות מוגבלת', text: 'VPP Home אינה גורם פיננסי מפוקח. כל ההחלטות מבוצעות על ידי המשתמש בלבד. ביצועי עבר אינם מבטיחים תשואות עתידיות.' },
    ],
  },
];

export default function ComplianceHub() {
  const [open, setOpen] = useState('regulatory');

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-black text-foreground">שקיפות ואמינות</h1>
        <p className="text-xs text-muted-foreground mt-1">מסגרת רגולטורית, פרטיות ותקנים מקצועיים</p>
      </motion.div>

      {/* Trust Score Banner */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-base font-black text-primary">Trust Score: 98/100</p>
          <p className="text-xs text-foreground/70 mt-0.5">מוסמך על ידי רשות החשמל, ISO 27001 ו-ISO 50001</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {['רגולציה ✓', 'AES-256 ✓', 'ISO 27001 ✓', 'Privacy by Design ✓'].map(t => (
              <span key={t} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{t}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Accordion Sections */}
      {sections.map((sec, i) => (
        <motion.div key={sec.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 * i + 0.1 }}
          className={`rounded-2xl border overflow-hidden ${open === sec.id ? sec.bg : 'border-border bg-card'}`}>
          <button onClick={() => setOpen(open === sec.id ? null : sec.id)}
            className="w-full flex items-center gap-3 p-4 text-right">
            <sec.icon className={`w-5 h-5 ${sec.color} flex-shrink-0`} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-foreground">{sec.title}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${sec.badgeColor}`}>{sec.badge}</span>
              </div>
            </div>
            {open === sec.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          <AnimatePresence>
            {open === sec.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden px-4 pb-4 space-y-3">
                {sec.content.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${sec.color} mt-0.5 flex-shrink-0`} />
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Footer note */}
      <p className="text-[10px] text-muted-foreground text-center leading-relaxed pb-2">
        VPP Home Ltd. | רישיון VPP מספר IL-VPP-2023-004 | כל הנכסים הם זכויות הפקת אנרגיה בלבד
      </p>
    </div>
  );
}