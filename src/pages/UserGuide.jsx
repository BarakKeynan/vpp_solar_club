import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, ChevronRight, Zap, Battery, Home, Clock, BarChart2, Settings, Users, Gift, ArrowLeftRight, Download, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import NogaConnectCard from '@/components/noga/NogaConnectCard';
import SolarEdgeConnectCard from '@/components/solaredge/SolarEdgeConnectCard';
import PaymentSetupCard from '@/components/billing/PaymentSetupCard';

// ─── Persona Quiz ──────────────────────────────────────────────────────────────
function PersonaQuiz({ onComplete }) {
  const [step, setStep] = useState(1);
  const [hasBattery, setHasBattery] = useState(null);
  const [manufacturer, setManufacturer] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [siteId, setSiteId] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleBattery = (val) => {
    setHasBattery(val);
    if (!val) {
      onComplete({ hasBattery: false, manufacturer: null });
    } else {
      setStep(2);
    }
  };

  const handleManufacturer = (mfr) => {
    setManufacturer(mfr);
    setStep(3);
  };

  const handleFinish = () => {
    onComplete({ hasBattery, manufacturer, apiKey, siteId, webhookUrl });
  };

  return (
    <div className="space-y-5">
      {/* Step 1 */}
      <AnimatePresence mode="wait">
        {step >= 1 && (
          <motion.div key="q1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm font-black text-white/80">מהו מבנה המערכת שלך?</p>
            <div className="grid grid-cols-2 gap-3">
              <QuizButton
                selected={hasBattery === true}
                icon="🔋"
                label="יש לי סוללה פיזית"
                sub="BESS"
                onClick={() => handleBattery(true)}
                color="#D4AF37"
              />
              <QuizButton
                selected={hasBattery === false}
                icon="⚡"
                label="אין לי סוללה"
                sub="סוללה וירטואלית"
                onClick={() => handleBattery(false)}
                color="#10b981"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2 — manufacturer */}
      <AnimatePresence>
        {step >= 2 && (
          <motion.div key="q2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <p className="text-sm font-black text-white/80">בחר את יצרן המערכת:</p>
            <div className="grid grid-cols-2 gap-3">
              <QuizButton
                selected={manufacturer === 'solaredge'}
                icon="☀️"
                label="SolarEdge"
                sub="פורטל רשמי"
                onClick={() => handleManufacturer('solaredge')}
                color="#3b82f6"
              />
              <QuizButton
                selected={manufacturer === 'other'}
                icon="🔧"
                label="אחר / Other"
                sub="API / Webhook"
                onClick={() => handleManufacturer('other')}
                color="#8b5cf6"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3 — credentials */}
      <AnimatePresence>
        {step >= 3 && manufacturer === 'solaredge' && (
          <motion.div key="q3se" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.25)' }}>
            <p className="text-xs font-black text-amber-300">🔑 פרטי SolarEdge</p>
            <input value={apiKey} onChange={e => setApiKey(e.target.value)}
              placeholder="API Key" dir="ltr"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50" />
            <input value={siteId} onChange={e => setSiteId(e.target.value)}
              placeholder="Site ID" dir="ltr"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-amber-500/50" />
            <button onClick={handleFinish}
              className="w-full py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b8962e)', color: '#121212' }}>
              שמור והמשך →
            </button>
          </motion.div>
        )}
        {step >= 3 && manufacturer === 'other' && (
          <motion.div key="q3other" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <p className="text-xs font-black text-purple-300">🔌 Webhook / API URL של היצרן</p>
            <input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)}
              placeholder="https://api.manufacturer.com/..." dir="ltr"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-400/50" />
            <button onClick={handleFinish}
              className="w-full py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff' }}>
              שמור והמשך →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizButton({ selected, icon, label, sub, onClick, color }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-4 px-3 rounded-2xl transition-all text-center"
      style={{
        background: selected ? `${color}18` : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${selected ? color : 'rgba(255,255,255,0.1)'}`,
        boxShadow: selected ? `0 0 16px ${color}30` : 'none',
      }}>
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-xs font-black text-white">{label}</p>
        <p className="text-[10px] mt-0.5" style={{ color: selected ? color : 'rgba(255,255,255,0.35)' }}>{sub}</p>
      </div>
    </motion.button>
  );
}

// ─── Comparison Widget ─────────────────────────────────────────────────────────
function ComparisonWidget({ lang }) {
  const isHe = lang === 'he';
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(212,175,55,0.2)' }}>
      <div className="px-4 py-3 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))' }}>
        <p className="text-xs font-black text-amber-300">
          {isHe ? '⚖️ השוואה: סוללה פיזית מול סוללה וירטואלית' : '⚖️ Physical vs Virtual Battery'}
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-white/5">
        {/* Physical */}
        <div className="p-4 space-y-3" dir={isHe ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <span className="text-2xl">🔋</span>
            <p className="text-xs font-black text-amber-300 mt-1">{isHe ? 'סוללה פיזית' : 'Physical Battery'}</p>
          </div>
          {[
            { icon: '✅', label: isHe ? 'יציבות גבוהה' : 'High Stability', color: '#10b981' },
            { icon: '✅', label: isHe ? 'שליטה מלאה' : 'Full Control', color: '#10b981' },
            { icon: '✅', label: isHe ? 'גיבוי חשמל' : 'Backup Power', color: '#10b981' },
            { icon: '⚠️', label: isHe ? 'עלות התקנה' : 'Installation Cost', color: '#f59e0b' },
            { icon: '⚠️', label: isHe ? 'תחזוקה שוטפת' : 'Maintenance', color: '#f59e0b' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs">{r.icon}</span>
              <p className="text-[11px]" style={{ color: r.color }}>{r.label}</p>
            </div>
          ))}
        </div>
        {/* Virtual */}
        <div className="p-4 space-y-3" dir={isHe ? 'rtl' : 'ltr'}>
          <div className="text-center">
            <span className="text-2xl">⚡</span>
            <p className="text-xs font-black text-emerald-300 mt-1">{isHe ? 'סוללה וירטואלית' : 'Virtual Battery'}</p>
          </div>
          {[
            { icon: '✅', label: isHe ? 'גמישות מלאה' : 'Full Flexibility', color: '#10b981' },
            { icon: '✅', label: isHe ? 'ללא עלות חומרה' : 'No Hardware Cost', color: '#10b981' },
            { icon: '✅', label: isHe ? 'הסטת עומסים חכמה' : 'Smart Load Shifting', color: '#10b981' },
            { icon: '⚠️', label: isHe ? 'תלות ברשת' : 'Grid Dependent', color: '#f59e0b' },
            { icon: '⚠️', label: isHe ? 'פחות שליטה' : 'Less Direct Control', color: '#f59e0b' },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs">{r.icon}</span>
              <p className="text-[11px]" style={{ color: r.color }}>{r.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
function buildSteps(hasBattery, lang) {
  const isHe = lang === 'he';
  const allSteps = [
    {
      num: '01', icon: '👤',
      title: isHe ? 'כניסה ופרופיל' : 'Login & Profile',
      desc: isHe
        ? 'היכנסו לאפליקציה עם אימייל. בכרטיסיית פרופיל מלאו פרטי המשק הביתי — גודל מערכת, סוג סוללה וכתובת.'
        : 'Log in with your email. In the Profile tab, fill in household details — system size, battery type and address.',
      why: isHe ? 'האפליקציה מחשבת המלצות לפי גודל המערכת שלכם.' : 'The app tailors recommendations to your system size.',
      link: { label: isHe ? 'עבור לפרופיל' : 'Go to Profile', path: '/Profile' },
      color: '#10b981',
    },
    {
      num: '02', icon: '🏠',
      title: isHe ? 'דשבורד ראשי — VPP Home' : 'Main Dashboard — VPP Home',
      desc: isHe
        ? 'בלשונית "בית": זרימת אנרגיה בזמן אמת, מצב הסוללה, מחיר החשמל הנוכחי ומדד הרווחיות.'
        : 'In the "Home" tab: real-time energy flow, battery status, current price and profitability index.',
      why: isHe ? 'בדקו בבוקר כדי לתכנן את היום.' : 'Check every morning to plan your day.',
      link: { label: isHe ? 'עבור לדשבורד' : 'Go to Dashboard', path: '/Dashboard' },
      color: '#3b82f6',
      alwaysShow: true,
    },
    ...(hasBattery ? [{
      num: '03', icon: '🔋',
      title: isHe ? 'טעינת הסוללה חכמה' : 'Smart Battery Charging',
      desc: isHe
        ? 'לחצו "טען סוללה". בחרו מקור אנרגיה ויעד טעינה. לחצו "יישם המלצת AI" לאסטרטגיה אוטומטית.'
        : 'Tap "Charge Battery". Choose source and charge target. Tap "Apply AI Recommendation" for automation.',
      why: isHe ? 'טענו ב-10:00–16:00 כשהשמש בשיא ומחיר הרשת נמוך.' : 'Charge 10:00–16:00 when solar is peak and grid prices are low.',
      link: { label: isHe ? 'עבור לטעינה' : 'Go to Charge Battery', path: '/charge-battery' },
      color: '#10b981',
    }] : []),
    ...(hasBattery ? [{
      num: '04', icon: '📤',
      title: isHe ? 'מכירה לרשת' : 'Sell to Grid',
      desc: isHe
        ? 'לחצו "מכור לרשת". בחרו כמות kWh ומועד. ההמלצה: שעות שיא 20:00–23:00.'
        : 'Tap "Sell to Grid". Choose kWh amount and time. Recommended: peak hours 20:00–23:00.',
      why: isHe ? 'מחיר השיא גבוה פי 3–5 — כאן מרוויחים.' : 'Peak prices are 3–5× higher — this is where you earn.',
      link: { label: isHe ? 'עבור למכירה לרשת' : 'Go to Sell to Grid', path: '/sell-to-grid' },
      color: '#f59e0b',
    }] : [{
      num: '03', icon: '🔌',
      title: isHe ? 'חיבור מכשירים חכמים' : 'Connect Smart Devices',
      desc: isHe
        ? 'חברו Shelly, עמדות טעינה ומשאבות חום. המערכת תשלוט בהם אוטומטית בשעות שפל.'
        : 'Connect Shelly devices, EV chargers and heat pumps. The system controls them automatically during off-peak hours.',
      why: isHe ? 'הסטת עומסים לשעות שפל חוסכת 30–50% בחשבון.' : 'Load shifting to off-peak saves 30–50% on your bill.',
      link: { label: isHe ? 'עבור לדשבורד' : 'Go to Dashboard', path: '/Dashboard' },
      color: '#06b6d4',
    }]),
    ...(!hasBattery ? [{
      num: '04', icon: '⏱️',
      title: isHe ? 'תזמון הסטת עומסים' : 'Load Shifting Schedules',
      desc: isHe
        ? 'הגדירו כללים: "כל יום ב-23:00 — טען רכב חשמלי", "ב-14:00 — הפעל מדיח". הכל אוטומטי.'
        : 'Set rules: "Every day at 23:00 — charge EV", "At 14:00 — run dishwasher". Fully automatic.',
      why: isHe ? 'אוטומציה מבטיחה שלא תפספסו שעות שפל.' : 'Automation ensures you never miss off-peak windows.',
      link: { label: isHe ? 'עבור לתזמונים' : 'Go to Schedules', path: '/Schedule' },
      color: '#8b5cf6',
    }] : []),
    {
      num: hasBattery ? '05' : '05', icon: '⏰',
      title: isHe ? 'תזמונים אוטומטיים' : 'Automatic Schedules',
      desc: isHe
        ? 'הגדירו חוקים חוזרים. "כל יום ב-11:00 — טען עד 90%", "כל יום ב-21:00 — מכור 10 kWh".'
        : 'Set recurring rules. "Every day at 11:00 — charge to 90%", "Every day at 21:00 — sell 10 kWh".',
      why: isHe ? 'אוטומציה מבטיחה שלא תפספסו שעות שיא.' : 'Automation ensures you never miss peak hours.',
      link: { label: isHe ? 'עבור לתזמונים' : 'Go to Schedules', path: '/Schedule' },
      color: '#8b5cf6',
    },
    {
      num: '06', icon: '📊',
      title: isHe ? 'מעקב חיסכון ורווח' : 'Track Savings & Revenue',
      desc: isHe
        ? 'בכרטיסיית "חיסכון" עקבו אחר הרווח החודשי, חיסכון בחשבון וביצועי החווה. הורידו דוח PDF.'
        : 'In "Savings" tab, track monthly revenue, bill savings and farm performance. Download PDF reports.',
      why: isHe ? 'ניטור שבועי מאפשר לשפר אסטרטגיה.' : 'Weekly monitoring helps refine your strategy.',
      link: { label: isHe ? 'עבור לחיסכון' : 'Go to Savings', path: '/Savings' },
      color: '#10b981',
    },
    {
      num: '07', icon: '🖥️',
      title: 'VPP Command Center',
      desc: isHe
        ? 'עוד > VPP Command Center. מחירי חשמל בזמן אמת, גרף 24 שעות וסטטוס כל הסוללות בצי.'
        : 'More > VPP Command Center. Real-time prices, 24h chart and full fleet battery status.',
      why: isHe ? 'מידע זה עוזר להחליט מתי לטעון ומתי למכור.' : 'Use this to decide when to charge and when to sell.',
      link: { label: isHe ? 'עבור ל-VPP Command Center' : 'Go to Command Center', path: '/vpp-command-center' },
      color: '#06b6d4',
    },
    {
      num: '08', icon: '⚙️',
      title: isHe ? 'הגדרות מתקדמות' : 'Advanced Settings',
      desc: isHe
        ? 'עוד > VPP Settings. הזינו API Keys, בחרו Live Mode ובדקו סטטוס החיבורים.'
        : 'More > VPP Settings. Enter API Keys, toggle Live Mode and check connection status.',
      why: isHe ? 'מעבר ל-Live Mode חיוני לסחור בכסף אמיתי.' : 'Live Mode is essential to trade with real money.',
      link: { label: isHe ? 'עבור להגדרות' : 'Go to Settings', path: '/vpp-settings' },
      color: '#f59e0b',
    },
    {
      num: '09', icon: '🌞',
      title: isHe ? 'Solar Club — קהילה' : 'Solar Club — Community',
      desc: isHe
        ? 'הצטרפו לחוות וירטואליות, עקבו אחר ביצועי הקהילה ורכשו פאנלים נוספים.'
        : 'Join virtual solar farms, track community performance and purchase additional virtual panels.',
      why: isHe ? 'פאנלים וירטואליים מייצרים הכנסה פסיבית.' : 'Virtual panels generate passive income without a personal rooftop.',
      link: { label: isHe ? 'עבור ל-Solar Club' : 'Go to Solar Club', path: '/vpp-club-dashboard' },
      color: '#f59e0b',
    },
    {
      num: '10', icon: '🤝',
      title: isHe ? 'הפניית חברים' : 'Refer Friends',
      desc: isHe
        ? '1 חבר — חודש חינם. 3 חברים — 3 חודשים + ניקוי פאנלים. 5 חברים — Founder Circle VIP.'
        : '1 friend — free month. 3 friends — 3 months + panel cleaning. 5 friends — Founder Circle VIP.',
      why: isHe ? 'כל חבר מגדיל את כוח הצי ומשפר מחירי מכירה.' : 'Every friend increases fleet power and improves selling prices.',
      link: { label: isHe ? 'עבור להפניות' : 'Go to Referrals', path: '/referral' },
      color: '#eab308',
    },
  ];

  // Ensure unique numbering
  return allSteps.map((s, i) => ({ ...s, num: String(i + 1).padStart(2, '0') }));
}

// ─── Checklist Step ────────────────────────────────────────────────────────────
function StepItem({ step, isDone, onToggle, lang }) {
  const isHe = lang === 'he';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: isDone ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${isDone ? 'rgba(212,175,55,0.3)' : `${step.color}25`}`,
        opacity: isDone ? 0.7 : 1,
      }}>
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs"
          style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}35` }}>
          {step.num}
        </div>
        <div className="flex-1 min-w-0 space-y-1" dir={isHe ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-2">
            <span>{step.icon}</span>
            <p className="text-sm font-black text-white">{step.title}</p>
          </div>
          <p className="text-[11px] text-white/55 leading-relaxed">{step.desc}</p>
          <div className="rounded-lg px-2.5 py-1.5 mt-1 inline-block"
            style={{ background: `${step.color}10`, border: `1px solid ${step.color}20` }}>
            <p className="text-[10px] font-bold" style={{ color: step.color }}>{step.why}</p>
          </div>
        </div>
      </div>
      {/* Footer actions */}
      <div className="flex items-center border-t px-3 py-2 gap-2"
        style={{ borderColor: isDone ? 'rgba(212,175,55,0.2)' : `${step.color}18` }}>
        <button
          onClick={onToggle}
          className="flex items-center gap-1.5 flex-1 transition-all active:scale-95">
          {isDone
            ? <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            : <Circle className="w-4 h-4 text-white/20 flex-shrink-0" />}
          <span className="text-[11px] font-black"
            style={{ color: isDone ? '#D4AF37' : 'rgba(255,255,255,0.3)' }}>
            {isDone ? (isHe ? 'בוצע ✓' : 'Done ✓') : (isHe ? 'סמן כבוצע' : 'Mark as done')}
          </span>
        </button>
        {step.link && (
          <Link to={step.link.path}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all active:scale-95 flex-shrink-0"
            style={{ background: `${step.color}18`, color: step.color, border: `1px solid ${step.color}30` }}>
            {isHe ? 'בצע עכשיו' : 'Do it now'} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
const STORAGE_KEY_PERSONA = 'vpp_guide_persona';
const STORAGE_KEY_CHECKED = 'vpp_guide_checked_v2';

export default function UserGuide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState('he');
  const isHe = lang === 'he';

  const [persona, setPersona] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PERSONA)); } catch { return null; }
  });

  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_CHECKED)) || {}; } catch { return {}; }
  });

  const handlePersonaComplete = (p) => {
    setPersona(p);
    localStorage.setItem(STORAGE_KEY_PERSONA, JSON.stringify(p));
  };

  const toggleCheck = (key) => {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(next));
      return next;
    });
  };

  const steps = persona ? buildSteps(persona.hasBattery, lang) : [];
  const doneCount = steps.filter((_, i) => checked[`step_${i}`]).length;
  const totalCount = steps.length;

  const downloadPDF = async () => {
    try {
      const response = await base44.functions.invoke('generateUserGuidePDF', { lang });
      const { pdf, filename } = response.data;
      if (!pdf) return;
      const bytes = new Uint8Array(atob(pdf).split('').map(c => c.charCodeAt(0)));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename || 'VPP-Guide.pdf';
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (_) { alert('שגיאה בהורדת PDF'); }
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: '#121212', direction: isHe ? 'rtl' : 'ltr' }}>

      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(18,18,18,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(l => l === 'he' ? 'en' : 'he')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
            <Globe className="w-3.5 h-3.5" />
            {lang === 'he' ? 'EN' : 'עב'}
          </button>
          <button onClick={downloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95"
            style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', color: '#D4AF37' }}>
            <Download className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>
        <p className="text-sm font-black" style={{ color: '#D4AF37' }}>
          {isHe ? 'מדריך שימוש' : 'User Manual'}
        </p>
      </div>

      <div className="px-4 space-y-6 pt-5">

        {/* Hero */}
        <div className="rounded-3xl p-6 text-center space-y-2"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.03) 60%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid rgba(212,175,55,0.3)',
            boxShadow: '0 0 40px rgba(212,175,55,0.08)',
          }}>
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))', border: '1px solid rgba(212,175,55,0.4)' }}>
              <span className="text-2xl">☀️</span>
            </div>
          </div>
          <h1 className="text-xl font-black text-white leading-snug">
            {isHe ? 'ברוכים הבאים למרכז' : 'Welcome to Your'}
            <br />
            <span style={{ color: '#D4AF37' }}>
              {isHe ? 'ניהול האנרגיה שלכם' : 'Energy Management Center'}
            </span>
          </h1>
          <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
            {isHe
              ? 'פלטפורמה חכמה לניהול אנרגיה סולארית — ממקסמת את הרווח שלך אוטומטית.'
              : 'Smart solar energy platform — automatically maximizing your profit.'}
          </p>
          {persona && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-[10px] px-2.5 py-1 rounded-full font-black"
                style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                {persona.hasBattery
                  ? (isHe ? `🔋 סוללה פיזית${persona.manufacturer === 'solaredge' ? ' · SolarEdge' : persona.manufacturer === 'other' ? ' · Custom API' : ''}` : `🔋 Physical Battery${persona.manufacturer === 'solaredge' ? ' · SolarEdge' : ''}`)
                  : (isHe ? '⚡ סוללה וירטואלית' : '⚡ Virtual Battery')}
              </span>
              <button onClick={() => { setPersona(null); localStorage.removeItem(STORAGE_KEY_PERSONA); }}
                className="text-[10px] text-white/30 underline">{isHe ? 'שנה' : 'Change'}</button>
            </div>
          )}
        </div>

        {/* Quiz or Progress */}
        {!persona ? (
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="text-center space-y-1">
              <p className="text-xs font-black" style={{ color: '#D4AF37' }}>
                {isHe ? '🎯 שאלון התאמה אישית' : '🎯 Personalization Quiz'}
              </p>
              <p className="text-[11px] text-white/40">
                {isHe ? '2 שאלות מהירות להתאמת המדריך עבורך' : '2 quick questions to tailor the guide for you'}
              </p>
            </div>
            <PersonaQuiz onComplete={handlePersonaComplete} />
          </div>
        ) : (
          /* Progress */
          <div className="rounded-2xl px-4 py-3 space-y-2"
            style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black" style={{ color: '#D4AF37' }}>
                {doneCount}/{totalCount} {isHe ? 'שלבים הושלמו' : 'steps completed'}
              </span>
              <span className="text-[11px] text-white/40">
                {totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4AF37, #10b981)' }}
                animate={{ width: `${totalCount ? (doneCount / totalCount) * 100 : 0}%` }}
                transition={{ duration: 0.5 }} />
            </div>
          </div>
        )}

        {/* Integrations (only if persona set) */}
        {persona && (
          <section className="space-y-3">
            <h2 className="text-sm font-black" style={{ color: '#D4AF37' }}>
              {isHe ? '🔌 חיבורים נדרשים' : '🔌 Required Connections'}
            </h2>
            {persona.hasBattery && persona.manufacturer === 'solaredge' && <SolarEdgeConnectCard />}
            <NogaConnectCard />
            <PaymentSetupCard />
          </section>
        )}

        {/* Steps checklist */}
        {persona && steps.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-black" style={{ color: '#D4AF37' }}>
              {isHe ? `🚀 שלבי ביצוע (${doneCount}/${totalCount})` : `🚀 Steps (${doneCount}/${totalCount})`}
            </h2>
            {steps.map((step, i) => (
              <StepItem
                key={i}
                step={step}
                isDone={!!checked[`step_${i}`]}
                onToggle={() => toggleCheck(`step_${i}`)}
                lang={lang}
              />
            ))}
          </section>
        )}

        {/* Comparison widget */}
        {persona && (
          <section className="space-y-3">
            <h2 className="text-sm font-black" style={{ color: '#D4AF37' }}>
              {isHe ? '⚖️ השוואת טכנולוגיות' : '⚖️ Technology Comparison'}
            </h2>
            <ComparisonWidget lang={lang} />
          </section>
        )}

        {/* Tips */}
        {persona && (
          <section className="space-y-3">
            <h2 className="text-sm font-black" style={{ color: '#D4AF37' }}>
              {isHe ? '💡 טיפים לשימוש אופטימלי' : '💡 Tips for Optimal Use'}
            </h2>
            <div className="rounded-2xl p-4 space-y-2"
              style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
              {(isHe ? [
                'בדקו את הדשבורד כל בוקר — 30 שניות מספיקות.',
                'תזמנו מכירות ל-20:00–23:00 בימי חול — שעות שיא.',
                persona.hasBattery ? 'טענו סוללה ב-10:00–16:00 כשהפאנלים בשיא.' : 'הסיטו עומסים כבדים לאחר 23:00 לתעריף שפל.',
                'עקבו אחר התראות — האפליקציה מתריעה על אנומליות.',
                'הפעילו ECO Profit Mode לאוטומציה מלאה.',
              ] : [
                'Check the dashboard every morning — 30 seconds is enough.',
                'Schedule sales for 20:00–23:00 on weekdays — peak hours.',
                persona.hasBattery ? 'Charge battery 10:00–16:00 when panels produce maximum.' : 'Shift heavy loads to after 23:00 for off-peak tariffs.',
                'Watch alerts — the app notifies you about production anomalies.',
                'Enable ECO Profit Mode for full automation.',
              ]).map((tip, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
                  <span style={{ color: '#D4AF37' }} className="font-black text-xs mt-0.5">✦</span>
                  <p className="text-xs text-white/65 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.12)' }}>
          <p className="text-[11px] text-white/30">VPP Solar Club © 2026 · {isHe ? 'כל הזכויות שמורות' : 'All rights reserved'}</p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(212,175,55,0.5)' }}>support@vppsolarclub.com</p>
        </div>
      </div>
    </div>
  );
}