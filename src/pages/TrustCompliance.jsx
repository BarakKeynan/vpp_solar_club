import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Lock, FileText, Building2, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const sections = [
  {
    icon: Building2,
    color: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/30',
    title: 'מסגרת רגולטורית',
    badge: 'פיוניר',
    content: [
      { label: 'רשות החשמל', text: 'האפליקציה פועלת בהתאם להנחיות רשות החשמל הישראלית (IEA) בנושא ניהול ביקוש וחוזים גמישים.' },
      { label: 'Noga – מפעיל מערכת', text: 'כל פעולות ה-VPP מבוצעות בתיאום מלא עם Noga (ISO – מפעיל מערכת החשמל), לרבות פרוטוקולי תגובה בזמן אמת.' },
      { label: 'מעמד חלוצי', text: 'אנו חברה ראשונה בישראל המפעילה VPP מגורים בהתאם לכללי שוק האנרגיה המתחדש תשפ"ג-2023.' },
    ],
  },
  {
    icon: Lock,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    title: 'פרטיות & הגנת מידע',
    badge: 'Privacy by Design',
    content: [
      { label: 'שימוש במידע', text: 'נתוני המונה החכם משמשים אך ורק לאופטימיזציית ארביטראז׳ אנרגטי. המידע לא נמכר ולא מועבר לצד שלישי לעולם.' },
      { label: 'הצפנה', text: 'כלל הנתונים מוצפנים ב-AES-256 הן בעת ​​העברה (TLS 1.3) והן באחסון. מפתחות מנוהלים ב-HSM ייעודי.' },
      { label: 'אנונימיזציה', text: 'השוואות ביצועים P2P מבוצעות על נתונים מאוחדים ואנונימיים בלבד. זהות המשתמש אינה נחשפת בשום שלב.' },
      { label: 'Privacy by Design', text: 'המערכת בנויה על עיקרון האיסוף המינימלי – נאסף רק המידע ההכרחי לפעולת השירות, בהתאם ל-GDPR ולחוק הגנת הפרטיות הישראלי.' },
    ],
  },
  {
    icon: Shield,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    title: 'תקנים בינלאומיים',
    badge: 'ISO Certified',
    content: [
      { label: 'ISO 27001 – אבטחת מידע', text: 'ארכיטקטורת המערכת מתוכננת לפי תקן ISO 27001 לניהול אבטחת מידע, כולל בקרת גישה, ניהול סיכונים וביקורת רציפה.' },
      { label: 'ISO 50001 – ניהול אנרגיה', text: 'מדיניות ניהול האנרגיה שלנו עוצבה לפי ISO 50001, עם יעדי יעילות מדידים וסקירות תקופתיות.' },
    ],
  },
  {
    icon: FileText,
    color: 'text-chart-4',
    bg: 'bg-purple-500/10 border-purple-500/30',
    title: 'מסגרת משפטית',
    badge: 'Legal Shield',
    content: [
      { label: 'הגדרת נכסי מרקטפלייס', text: 'כל הנכסים הנסחרים בפלטפורמה מוגדרים משפטית כ"זכויות הפקת אנרגיה" (Energy Production Rights) או "פאנלים וירטואליים" – ולא כניירות ערך.' },
      { label: 'אבחנה מניירות ערך', text: 'הגדרה זו מבוססת על חוות דעת משפטית ועל תקדים רגולטורי, ומבחינה בין השקעה בתפוקה אנרגטית ממשית לבין השקעה פיננסית מופשטת.' },
      { label: 'זכויות המשתמש', text: 'למחזיק "פאנל וירטואלי" זכות לתפוקת אנרגיה יחסית מחווה סולארית, הניתנת להעברה ולמכירה בתוך הפלטפורמה בלבד.' },
    ],
  },
];

function Section({ section, index }) {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.08 }}
      className={`rounded-2xl border overflow-hidden ${section.bg}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-right">
        <div className={`p-2.5 rounded-xl bg-background/50`}>
          <Icon className={`w-5 h-5 ${section.color}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-foreground">{section.title}</p>
            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${section.color} border-current opacity-70`}>{section.badge}</span>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            className="overflow-hidden px-4 pb-4 space-y-3">
            {section.content.map(item => (
              <div key={item.label} className="flex gap-2.5">
                <CheckCircle2 className={`w-4 h-4 ${section.color} flex-shrink-0 mt-0.5`} />
                <div>
                  <p className={`text-xs font-bold ${section.color}`}>{item.label}</p>
                  <p className="text-xs text-foreground/75 mt-0.5 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TrustCompliance() {
  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-black text-foreground">שקיפות ואמינות</h1>
        </div>
        <p className="text-xs text-muted-foreground">אנחנו מאמינים שאמון נבנה על שקיפות מלאה — בחוק, בטכנולוגיה ובאתיקה.</p>
      </motion.div>

      {/* Hero trust badge */}
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 }}
        className="bg-card border border-primary/30 rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-sm font-black text-foreground">חברה מורשית ומפוקחת</p>
          <p className="text-xs text-muted-foreground mt-0.5">רשות החשמל · Noga ISO · ISO 27001 · ISO 50001</p>
          <p className="text-xs text-primary font-bold mt-1">✓ פועלים בשקיפות מלאה מאז 2022</p>
        </div>
      </motion.div>

      {sections.map((s, i) => <Section key={s.title} section={s} index={i} />)}

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
        className="bg-muted rounded-2xl p-4 text-center">
        <p className="text-xs text-muted-foreground">לשאלות משפטיות ורגולטוריות: <span className="text-primary font-bold">legal@vpp-solar.co.il</span></p>
      </motion.div>
    </div>
  );
}