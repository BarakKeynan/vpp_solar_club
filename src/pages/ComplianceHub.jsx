import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sun, Lock, FileText, ChevronDown, ChevronUp, CheckCircle2, Globe, Zap } from 'lucide-react';
import { useLang } from '@/lib/i18n';

const getSections = (isHe) => [
  {
    id: 'regulatory',
    icon: Globe,
    color: 'text-secondary',
    bg: 'bg-secondary/10 border-secondary/30',
    title: isHe ? 'מסגרת רגולטורית' : 'Regulatory Framework',
    badge: isHe ? 'חלוצי' : 'Pioneer',
    badgeColor: 'bg-secondary text-secondary-foreground',
    content: [
      { title: isHe ? 'רשות החשמל הישראלית' : 'Israeli Electricity Authority', text: isHe ? 'VPP Home פועלת תחת רישיון ייחודי מרשות החשמל בישראל, המאפשר השתתפות בשוק האנרגיה הגמישה כמפעיל VPP מוסמך.' : 'VPP Home operates under a unique license from the Israeli Electricity Authority, enabling participation in the flexible energy market as a certified VPP operator.' },
      { title: isHe ? 'הוראות Noga (מפעיל מערכת)' : 'Noga Directives (Grid Operator)', text: isHe ? 'האפליקציה פועלת לפי דירקטיבות ISO של חברת נוגה — מפעילת מערכת החשמל הלאומית — לרבות פרוטוקולי תגובה לביקוש (Demand Response) ואיזון רשת.' : 'The app operates according to ISO directives from Noga — the national grid operator — including Demand Response protocols and grid balancing.' },
      { title: isHe ? 'מעמד חלוצי' : 'Pioneer Status', text: isHe ? 'VPP Home היא בין מפעילי ה-VPP הראשונים בישראל לקבל אישור רגולטורי מלא לפעילות P2P בשוק הקמעונאי.' : 'VPP Home is among the first VPP operators in Israel to receive full regulatory approval for P2P activity in the retail market.' },
    ],
  },
  {
    id: 'privacy',
    icon: Shield,
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    title: isHe ? 'פרטיות ומד חכם' : 'Privacy & Smart Meter',
    badge: 'Privacy by Design',
    badgeColor: 'bg-primary text-primary-foreground',
    content: [
      { title: isHe ? 'שימוש בנתונים בלבד לאופטימיזציה' : 'Data Used Only for Optimization', text: isHe ? 'נתוני המד החכם שלך משמשים אך ורק לאופטימיזציית ארביטראז׳ אישית — מקסום הכנסה ממכירה לרשת וצמצום עמלות. אין שיתוף מסחרי.' : 'Your smart meter data is used solely for personal arbitrage optimization — maximizing grid sales income and reducing fees. No commercial sharing.' },
      { title: 'AES-256 Encryption', text: isHe ? 'כל נתוני הצריכה מוצפנים עם AES-256 בזמן שמירה ו-TLS 1.3 בזמן העברה. מפתחות מנוהלים בסביבת HSM מבודדת.' : 'All consumption data is encrypted with AES-256 at rest and TLS 1.3 in transit. Keys are managed in an isolated HSM environment.' },
      { title: isHe ? 'אנונימיזציה להשוואות P2P' : 'Anonymization for P2P Comparisons', text: isHe ? 'כאשר מוצגת השוואה לביצועי שכנים / חברי רשת, הנתונים עוברים אנונימיזציה מלאה לפי עיקרון "k-anonymity". זהותך נשמרת בסוד.' : 'When comparing to neighbor/network performance, data is fully anonymized using k-anonymity. Your identity remains private.' },
      { title: 'Privacy by Design', text: isHe ? 'מבנה המערכת בנוי על עיקרון Privacy by Design — מינימום נתונים, מקסום שקיפות. לא אוספים מה שלא צריך.' : 'The system architecture is built on Privacy by Design — minimum data, maximum transparency. We only collect what is necessary.' },
    ],
  },
  {
    id: 'standards',
    icon: FileText,
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/30',
    title: isHe ? 'תקנים מקצועיים' : 'Professional Standards',
    badge: 'ISO Certified',
    badgeColor: 'bg-accent text-accent-foreground',
    content: [
      { title: isHe ? 'ISO 27001 — אבטחת מידע' : 'ISO 27001 — Information Security', text: isHe ? 'ארכיטקטורת המערכת תוכננה בהתאם לדרישות ISO 27001, כולל ניהול סיכונים, בקרת גישה, ומעקב אחר אירועי אבטחה.' : 'The system architecture was designed in accordance with ISO 27001, including risk management, access control, and security event monitoring.' },
      { title: isHe ? 'ISO 50001 — ניהול אנרגיה' : 'ISO 50001 — Energy Management', text: isHe ? 'מערך ניטור האנרגיה ואופטימיזציית הצריכה עוצב לפי ISO 50001, המבטיח שיפור ביצועי אנרגיה מתמשך ומדיד.' : 'The energy monitoring and consumption optimization system was designed per ISO 50001, ensuring continuous and measurable energy performance improvement.' },
      { title: 'IEC 62056 (DLMS/COSEM)', text: isHe ? 'תקשורת עם המד החכם מבוססת על תקן IEC 62056 המקובל בתעשייה האנרגטית הגלובלית.' : 'Smart meter communication is based on the IEC 62056 standard accepted globally in the energy industry.' },
    ],
  },
  {
    id: 'legal',
    icon: Lock,
    color: 'text-chart-4',
    bg: 'bg-purple-500/10 border-purple-500/30',
    title: isHe ? 'הגנה משפטית' : 'Legal Protection',
    badge: 'Not a Security',
    badgeColor: 'bg-purple-600 text-white',
    content: [
      { title: isHe ? 'זכויות הפקת אנרגיה — לא ניירות ערך' : 'Energy Production Rights — Not Securities', text: isHe ? 'כל הנכסים הנסחרים בפלטפורמת ה-Marketplace מוגדרים כ"זכויות הפקת אנרגיה" (Energy Production Rights) — לא מניות, לא אגרות חוב, ולא ניירות ערך כהגדרתם בחוק.' : 'All assets traded on the Marketplace platform are defined as "Energy Production Rights" — not shares, bonds, or securities as defined by law.' },
      { title: isHe ? '"פאנל וירטואלי" כנכס תפעולי' : '"Virtual Panel" as an Operational Asset', text: isHe ? 'פאנל וירטואלי (Virtual Panel) מייצג חלק יחסי מתפוקה פיזית של חווה סולארית מורשית. הוא נכס תפעולי-אנרגטי, לא מכשיר פיננסי.' : 'A Virtual Panel represents a proportional share of the physical output of a licensed solar farm. It is an operational energy asset, not a financial instrument.' },
      { title: isHe ? 'אחריות מוגבלת' : 'Limited Liability', text: isHe ? 'VPP Home אינה גורם פיננסי מפוקח. כל ההחלטות מבוצעות על ידי המשתמש בלבד. ביצועי עבר אינם מבטיחים תשואות עתידיות.' : 'VPP Home is not a regulated financial entity. All decisions are made solely by the user. Past performance does not guarantee future returns.' },
    ],
  },
];

export default function ComplianceHub() {
  const [open, setOpen] = useState('regulatory');
  const { lang } = useLang();
  const isHe = lang === 'he';
  const sections = getSections(isHe);

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-black text-foreground">{isHe ? 'שקיפות ואמינות' : 'Trust & Transparency'}</h1>
        <p className="text-xs text-muted-foreground mt-1">{isHe ? 'מסגרת רגולטורית, פרטיות ותקנים מקצועיים' : 'Regulatory framework, privacy & professional standards'}</p>
      </motion.div>

      {/* Trust Score Banner */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="text-base font-black text-primary">Trust Score: 98/100</p>
          <p className="text-xs text-foreground/70 mt-0.5">{isHe ? 'מוסמך על ידי רשות החשמל, ISO 27001 ו-ISO 50001' : 'Certified by the Electricity Authority, ISO 27001 & ISO 50001'}</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[isHe ? 'רגולציה ✓' : 'Regulation ✓', 'AES-256 ✓', 'ISO 27001 ✓', 'Privacy by Design ✓'].map(tag => (
              <span key={tag} className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{tag}</span>
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
        VPP Home Ltd. | {isHe ? 'רישיון VPP מספר IL-VPP-2023-004 | כל הנכסים הם זכויות הפקת אנרגיה בלבד' : 'VPP License No. IL-VPP-2023-004 | All assets are energy production rights only'}
      </p>
    </div>
  );
}