import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

// ─── Content ──────────────────────────────────────────────────────────────────

const GUIDE = {
  he: {
    dir: 'rtl',
    appName: 'VPP Solar Club',
    appDesc: 'פלטפורמה חכמה לניהול אנרגיה סולארית — שאוספת את האנרגיה שלך, מנהלת אותה בצורה חכמה ומוכרת אותה ברגע הנכון כדי למקסם את הרווח שלך.',
    prereqTitle: '📋 הכנה מוקדמת — לפני שמתחילים',
    prereqs: [
      {
        icon: '🏢',
        title: 'הגשת בקשה לתעריף תעו"ז (זמן שימוש)',
        body: 'יש לפנות לחברת החשמל ולבקש מעבר לתעריף דינמי (תעו"ז). פנייה דיגיטלית דרך:',
        link: { label: 'טופס פנייה — חברת החשמל', url: 'https://www.iec.co.il/content/lobbies/pniot' },
        note: 'לאחר המעבר תמצאו בחשבון שלכם שעות שפל (מחיר נמוך) ושעות שיא (מחיר גבוה) — הבסיס לכל האסטרטגיה.',
      },
      {
        icon: '☀️',
        title: 'חיבור SolarEdge API',
        body: 'כנסו לפורטל SolarEdge > Account > API Access > צרו API Key. הזינו אותו ב-VPP Settings באפליקציה יחד עם מספר/י ה-Site ID שלכם.',
        note: 'זה מאפשר לאפליקציה לראות בזמן אמת כמה חשמל הפאנלים מייצרים ומה מצב הסוללה הפיזית.',
      },
      {
        icon: '⚡',
        title: 'אישורי Noga Energy (API)',
        body: 'לקבלת Client ID + Secret של Noga ISO פנו לצוות VPP Solar Club. הם מספקים גישה למחירי חשמל בזמן אמת.',
        note: 'ללא חיבור זה האפליקציה פועלת ב-Simulation Mode — כלומר הכל עובד, אבל עם נתוני מחיר מדומים.',
      },
      {
        icon: '📱',
        title: 'הגדרת אמצעי תשלום',
        body: 'בפרופיל > ניהול תשלומים — הוסיפו כרטיס אשראי. נדרש כדי לקבל תשלומים על אנרגיה שנמכרת לרשת.',
        note: 'ניתן להתחיל בסימולציה ללא תשלום — אך לקבלת הכנסות אמיתיות נדרש חיבור.',
      },
    ],
    stepsTitle: '🚀 שלבי שימוש — צעד אחר צעד',
    steps: [
      {
        num: '01',
        title: 'כניסה ופרופיל',
        icon: '👤',
        desc: 'היכנסו לאפליקציה עם אימייל או טלפון. בכרטיסיית פרופיל מלאו את פרטי המשק הביתי שלכם — גודל מערכת סולארית, סוג סוללה וכתובת.',
        why: 'למה? האפליקציה מחשבת המלצות בהתאם לגודל המערכת שלכם.',
        color: '#10b981',
      },
      {
        num: '02',
        title: 'דשבורד ראשי — VPP Home',
        icon: '🏠',
        desc: 'בלשונית "בית" תראו: זרימת אנרגיה בזמן אמת (פאנלים → בית → רשת), מצב הסוללה, מחיר החשמל הנוכחי ומדד הרווחיות.',
        why: 'למה? זהו "לוח המחוונים" — בדקו אותו בבוקר כדי לתכנן את היום.',
        color: '#3b82f6',
      },
      {
        num: '03',
        title: 'טעינת הסוללה חכמה',
        icon: '🔋',
        desc: 'לחצו על "טען סוללה" (Actions). בחרו מקור אנרגיה (סולארי / חווה / רשת) ויעד אחוז טעינה. לחצו "יישם המלצת AI" לאסטרטגיה אוטומטית.',
        why: 'למה? מומלץ לטעון בשעות 10:00–16:00 כשהשמש בשיא ומחיר הרשת נמוך.',
        color: '#10b981',
      },
      {
        num: '04',
        title: 'מכירה לרשת',
        icon: '📤',
        desc: 'לחצו על "מכור לרשת". בחרו כמות kWh ומתי — מיידית או מתוזמן. האפליקציה ממליצה אוטומטית לתזמן בשעות שיא (20:00–23:00).',
        why: 'למה? מחיר החשמל בשעות שיא גבוה פי 3–5 מאשר בשעות שפל — כאן מרוויחים.',
        color: '#f59e0b',
      },
      {
        num: '05',
        title: 'הגדרת תזמונים אוטומטיים',
        icon: '⏰',
        desc: 'בכרטיסיית "תזמון" הגדירו חוקים קבועים: "בכל יום ב-11:00 — טען עד 90%", "בכל יום ב-21:00 — מכור 10 kWh". האפליקציה תפעל לבד.',
        why: 'למה? אוטומציה מבטיחה שלא תפספסו שעות שיא גם כשאתם עסוקים.',
        color: '#8b5cf6',
      },
      {
        num: '06',
        title: 'מעקב חיסכון ורווח',
        icon: '📊',
        desc: 'בכרטיסיית "חיסכון" עקבו אחר הרווח החודשי, חיסכון בחשבון החשמל, וביצועי כל חווה סולארית. ניתן להוריד דוח PDF חודשי.',
        why: 'למה? ניטור שבועי מאפשר לכם לשפר את האסטרטגיה ולהגדיל רווחים.',
        color: '#10b981',
      },
      {
        num: '07',
        title: 'VPP Command Center',
        icon: '🖥️',
        desc: 'לחצו "עוד" > VPP Command Center. כאן תראו מחירי חשמל בזמן אמת, גרף מחירים ל-24 שעות וסטטוס כל הסוללות בצי.',
        why: 'למה? מידע זה עוזר לקבל החלטות מושכלות — מתי לטעון ומתי למכור.',
        color: '#06b6d4',
      },
      {
        num: '08',
        title: 'הגדרות מתקדמות (VPP Settings)',
        icon: '⚙️',
        desc: 'לאדמינים: עוד > VPP Settings. הזינו API Keys של SolarEdge ו-Noga, בחרו Simulation/Live Mode, ובדקו סטטוס החיבורים.',
        why: 'למה? מעבר ל-Live Mode חיוני כדי לסחור עם כסף אמיתי ולהגיע למחירי שוק.',
        color: '#f59e0b',
      },
      {
        num: '09',
        title: 'Solar Club — קהילה ורווח משותף',
        icon: '🌞',
        desc: 'בכרטיסיית "SolarClub": הצטרפו לחוות סולאריות וירטואליות, עקבו אחר ביצועי הקהילה ורכשו פאנלים וירטואליים נוספים.',
        why: 'למה? פאנלים וירטואליים מייצרים הכנסה פסיבית גם ללא גג אישי.',
        color: '#f59e0b',
      },
      {
        num: '10',
        title: 'הפניית חברים',
        icon: '🤝',
        desc: 'עוד > חבר מביא חבר. שתפו קוד הפניה. עם 1 חבר — חודש חינם. 3 חברים — 3 חודשים + ניקוי פאנלים. 5 חברים — Founder Circle VIP.',
        why: 'למה? כל חבר שמצטרף מגדיל את כוח הצי הקולקטיבי ומשפר מחירי מכירה.',
        color: '#eab308',
      },
    ],
    tipsTitle: '💡 טיפים לשימוש אופטימלי',
    tips: [
      'בדקו את הדשבורד כל בוקר — 30 שניות מספיקות להחלטת היום.',
      'תזמנו מכירות לשעות 20:00–23:00 בימי חול — שעות השיא של חברת החשמל.',
      'טענו סוללה ב-10:00–16:00 כשהפאנלים מייצרים מקסימום.',
      'הפעילו ECO Profit Mode (בדשבורד) לאוטומציה מלאה ללא התערבות.',
      'עקבו אחר התראות — האפליקציה מתריעה על אנומליות בייצור.',
      'בחורף השמש חלשה — הסתמכו יותר על חוות הקהילה.',
    ],
  },

  en: {
    dir: 'ltr',
    appName: 'VPP Solar Club',
    appDesc: 'A smart solar energy management platform — it collects your energy, manages it intelligently, and sells it at the right moment to maximize your profit.',
    prereqTitle: '📋 Prerequisites — Before You Start',
    prereqs: [
      {
        icon: '🏢',
        title: 'Apply for Time-of-Use (ToU) Tariff',
        body: 'Contact the Israel Electric Corporation and request a switch to dynamic pricing (ToU). Submit a digital request via:',
        link: { label: 'IEC Customer Service Form', url: 'https://www.iec.co.il/content/lobbies/pniot' },
        note: 'After switching, your bill will show off-peak (low price) and peak (high price) hours — this is the foundation of the entire strategy.',
      },
      {
        icon: '☀️',
        title: 'Connect SolarEdge API',
        body: 'Log in to the SolarEdge portal > Account > API Access > Create an API Key. Enter it in VPP Settings along with your Site ID(s).',
        note: 'This allows the app to see in real-time how much electricity your panels produce and what the physical battery status is.',
      },
      {
        icon: '⚡',
        title: 'Noga Energy API Credentials',
        body: 'To obtain a Noga ISO Client ID + Secret, contact the VPP Solar Club team. This provides access to real-time electricity prices.',
        note: 'Without this connection the app runs in Simulation Mode — everything works, but with simulated price data.',
      },
      {
        icon: '📱',
        title: 'Set Up Payment Method',
        body: 'Go to Profile > Payment Management and add a credit card. Required to receive payments for energy sold to the grid.',
        note: 'You can start in simulation mode without payment — but real income requires a connection.',
      },
    ],
    stepsTitle: '🚀 Step-by-Step Usage Guide',
    steps: [
      {
        num: '01',
        title: 'Login & Profile',
        icon: '👤',
        desc: 'Log in with your email or phone. In the Profile tab, fill in your household details — solar system size, battery type and address.',
        why: 'Why? The app calculates recommendations based on the size of your system.',
        color: '#10b981',
      },
      {
        num: '02',
        title: 'Main Dashboard — VPP Home',
        icon: '🏠',
        desc: 'In the "Home" tab you will see: real-time energy flow (panels → home → grid), battery status, current electricity price and profitability index.',
        why: 'Why? This is your "control panel" — check it every morning to plan your day.',
        color: '#3b82f6',
      },
      {
        num: '03',
        title: 'Smart Battery Charging',
        icon: '🔋',
        desc: 'Tap "Charge Battery" (Actions). Choose an energy source (solar / farm / grid) and a target charge percentage. Tap "Apply AI Recommendation" for an automatic strategy.',
        why: 'Why? Charge between 10:00–16:00 when the sun is at its peak and grid prices are low.',
        color: '#10b981',
      },
      {
        num: '04',
        title: 'Sell to Grid',
        icon: '📤',
        desc: 'Tap "Sell to Grid". Choose how many kWh and when — immediately or scheduled. The app automatically recommends scheduling during peak hours (20:00–23:00).',
        why: 'Why? Electricity prices during peak hours are 3–5× higher than off-peak — this is where you earn.',
        color: '#f59e0b',
      },
      {
        num: '05',
        title: 'Set Automatic Schedules',
        icon: '⏰',
        desc: 'In the "Schedule" tab, set recurring rules: "Every day at 11:00 — charge to 90%", "Every day at 21:00 — sell 10 kWh". The app runs on autopilot.',
        why: 'Why? Automation ensures you never miss peak hours even when you\'re busy.',
        color: '#8b5cf6',
      },
      {
        num: '06',
        title: 'Track Savings & Revenue',
        icon: '📊',
        desc: 'In the "Savings" tab, track monthly revenue, electricity bill savings, and performance of each solar farm. Download a monthly PDF report.',
        why: 'Why? Weekly monitoring lets you refine your strategy and grow profits.',
        color: '#10b981',
      },
      {
        num: '07',
        title: 'VPP Command Center',
        icon: '🖥️',
        desc: 'Tap "More" > VPP Command Center. See real-time electricity prices, a 24-hour price chart and the status of all batteries in the fleet.',
        why: 'Why? This data helps you make informed decisions — when to charge and when to sell.',
        color: '#06b6d4',
      },
      {
        num: '08',
        title: 'Advanced Settings (VPP Settings)',
        icon: '⚙️',
        desc: 'For admins: More > VPP Settings. Enter SolarEdge & Noga API Keys, toggle Simulation/Live Mode, and check connection status.',
        why: 'Why? Switching to Live Mode is essential to trade with real money and reach market prices.',
        color: '#f59e0b',
      },
      {
        num: '09',
        title: 'Solar Club — Community & Shared Profit',
        icon: '🌞',
        desc: 'In the "SolarClub" tab: join virtual solar farms, track community performance and purchase additional virtual panels.',
        why: 'Why? Virtual panels generate passive income even without a personal rooftop.',
        color: '#f59e0b',
      },
      {
        num: '10',
        title: 'Refer Friends',
        icon: '🤝',
        desc: 'More > Refer a Friend. Share your referral code. 1 friend — free month. 3 friends — 3 months + panel cleaning. 5 friends — Founder Circle VIP.',
        why: 'Why? Every friend who joins increases collective fleet power and improves selling prices.',
        color: '#eab308',
      },
    ],
    tipsTitle: '💡 Tips for Optimal Use',
    tips: [
      'Check the dashboard every morning — 30 seconds is enough to decide for the day.',
      'Schedule sales for 20:00–23:00 on weekdays — IEC peak hours.',
      'Charge battery 10:00–16:00 when panels produce maximum output.',
      'Enable ECO Profit Mode (on dashboard) for full automation with zero intervention.',
      'Watch alerts — the app notifies you about production anomalies.',
      'In winter, sunshine is weaker — rely more on community farms.',
    ],
  },
};

// ─── PDF Print Styles ─────────────────────────────────────────────────────────

const printStyle = `
@media print {
  body { background: white !important; color: black !important; }
  .no-print { display: none !important; }
  .print-page { background: white !important; color: black !important; }
  .print-card { border: 1px solid #e5e7eb !important; background: white !important; color: black !important; break-inside: avoid; }
  .print-step-num { color: #059669 !important; }
}
`;

// ─── Section Components ───────────────────────────────────────────────────────

function PrereqCard({ item }) {
  return (
    <div className="print-card rounded-2xl p-4 space-y-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{item.icon}</span>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-black text-white">{item.title}</p>
          <p className="text-xs text-white/60 leading-relaxed">{item.body}</p>
          {item.link && (
            <a href={item.link.url} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-cyan-400 underline underline-offset-2 mt-1">
              🔗 {item.link.label}
            </a>
          )}
          <div className="mt-2 rounded-xl px-3 py-2"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-[11px] text-emerald-400 leading-relaxed">💡 {item.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }) {
  return (
    <div className="print-card rounded-2xl p-4 space-y-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${step.color}30` }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
          style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}40` }}>
          {step.num}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{step.icon}</span>
            <p className="text-sm font-black text-white">{step.title}</p>
          </div>
          <p className="text-xs text-white/65 leading-relaxed">{step.desc}</p>
          <div className="mt-1 rounded-lg px-2.5 py-1.5"
            style={{ background: `${step.color}10`, border: `1px solid ${step.color}25` }}>
            <p className="text-[11px] font-bold" style={{ color: step.color }}>{step.why}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserGuide() {
  const { user } = useAuth();
  const [lang, setLang] = useState('he');
  const printRef = useRef(null);
  const g = GUIDE[lang];
  const userName = user?.full_name || (lang === 'he' ? 'משתמש יקר' : 'Valued User');

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html dir="${g.dir}" lang="${lang}">
      <head>
        <meta charset="UTF-8"/>
        <title>VPP Solar Club — User Guide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700;900&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: 'Heebo', sans-serif; background: #0b1320; color: #e2e8f0; direction: ${g.dir}; padding: 32px; font-size: 13px; line-height: 1.6; }
          h1 { font-size: 28px; font-weight: 900; color: #10b981; margin-bottom: 4px; }
          h2 { font-size: 18px; font-weight: 900; color: #fff; margin: 32px 0 16px; }
          h3 { font-size: 14px; font-weight: 900; color: #fff; margin-bottom: 6px; }
          .hero { background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08)); border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
          .hero-sub { color: #94a3b8; font-size: 12px; margin-top: 4px; }
          .hero-desc { color: #cbd5e1; font-size: 13px; margin-top: 12px; line-height: 1.7; }
          .hero-welcome { font-size: 13px; color: #10b981; font-weight: 700; margin-bottom: 4px; }
          .card { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); border-radius: 14px; padding: 14px; margin-bottom: 12px; break-inside: avoid; }
          .step-card { border-radius: 14px; padding: 14px; margin-bottom: 12px; break-inside: avoid; }
          .step-num { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; font-weight: 900; font-size: 13px; flex-shrink: 0; }
          .step-row { display: flex; gap: 12px; align-items: flex-start; }
          .why-box { border-radius: 8px; padding: 6px 10px; margin-top: 6px; font-size: 11px; font-weight: 700; }
          .note-box { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25); border-radius: 8px; padding: 6px 10px; margin-top: 6px; font-size: 11px; color: #34d399; }
          .link-box { color: #22d3ee; font-size: 11px; font-weight: 700; text-decoration: underline; display: block; margin-top: 4px; }
          .tips-list { list-style: none; space-y: 4px; }
          .tips-list li { padding: 8px 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; margin-bottom: 6px; font-size: 12px; color: #cbd5e1; }
          .tips-list li::before { content: "✦ "; color: #10b981; font-weight: 900; }
          .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; font-size: 11px; color: #475569; }
          .tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 99px; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="hero">
          <p class="hero-welcome">${lang === 'he' ? `ברוכים הבאים,` : 'Welcome,'} ${userName} 👋</p>
          <h1>VPP Solar Club</h1>
          <p class="hero-sub">${lang === 'he' ? 'מדריך שימוש מלא · גרסה 1.0 · 2026' : 'Complete User Guide · Version 1.0 · 2026'}</p>
          <p class="hero-desc">${g.appDesc}</p>
        </div>
        ${printContents}
        <div class="footer">
          VPP Solar Club © 2026 · ${lang === 'he' ? 'כל הזכויות שמורות' : 'All rights reserved'} · support@vppsolarclub.com
        </div>
      </body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.focus(); win.print(); }, 600);
  };

  return (
    <div className="min-h-screen pb-28 bg-background" dir={g.dir}>
      <style>{printStyle}</style>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 no-print"
        style={{ background: 'hsl(222 47% 6% / 0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-black text-foreground">
            {lang === 'he' ? 'מדריך שימוש' : 'User Guide'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Lang Toggle */}
          <button onClick={() => setLang(l => l === 'he' ? 'en' : 'he')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }}>
            <Globe className="w-3.5 h-3.5" />
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          {/* Download PDF */}
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
            <Download className="w-3.5 h-3.5" />
            {lang === 'he' ? 'הורד PDF' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-5 mb-6 rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.07))', border: '1px solid rgba(16,185,129,0.3)' }}>
        <p className="text-xs font-bold text-primary mb-1">
          {lang === 'he' ? `ברוכים הבאים, ${userName} 👋` : `Welcome, ${userName} 👋`}
        </p>
        <h1 className="text-2xl font-black text-white">VPP Solar Club</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {lang === 'he' ? 'מדריך שימוש מלא · 2026' : 'Complete User Guide · 2026'}
        </p>
        <p className="text-xs text-white/60 leading-relaxed mt-3">{g.appDesc}</p>
      </div>

      {/* Printable area */}
      <div ref={printRef} className="px-4 space-y-8 print-page">

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.prereqTitle}</h2>
          <div className="space-y-3">
            {g.prereqs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <PrereqCard item={item} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.stepsTitle}</h2>
          <div className="space-y-3">
            {g.steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.tipsTitle}</h2>
          <div className="rounded-2xl p-4 space-y-2"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
            {g.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0">
                <span className="text-primary font-black text-xs mt-0.5">✦</span>
                <p className="text-xs text-white/70 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px] text-muted-foreground">
            VPP Solar Club © 2026 · {lang === 'he' ? 'כל הזכויות שמורות' : 'All rights reserved'}
          </p>
          <p className="text-[11px] text-primary/60 mt-1">support@vppsolarclub.com</p>
        </div>

      </div>
    </div>
  );
}