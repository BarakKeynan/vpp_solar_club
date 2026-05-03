import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { jsPDF } from 'npm:jspdf@4.0.0';

const GUIDE_HE = {
  lang: 'he',
  dir: 'rtl',
  pageTitle: 'מדריך שימוש',
  downloadBtn: 'הורד PDF',
  pdfTitle: 'מדריך שימוש מלא',
  welcomePrefix: 'ברוכים הבאים,',
  rights: 'כל הזכויות שמורות',
  appDesc: 'פלטפורמה חכמה לניהול אנרגיה סולארית — שאוספת את האנרגיה שלך, מנהלת אותה בצורה חכמה ומוכרת אותה ברגע הנכון כדי למקסם את הרווח שלך.',
  prereqTitle: '📋 הכנה מוקדמת — לפני שמתחילים',
  prereqs: [
    {
      icon: '🏢',
      title: 'הגשת בקשה לתעריף תעו"ז (זמן שימוש)',
      body: 'יש לפנות לחברת החשמל ולבקש מעבר לתעריף דינמי (תעו"ז). פנייה דיגיטלית דרך הטופס המקוון.',
      note: 'לאחר המעבר תמצאו בחשבון שלכם שעות שפל (מחיר נמוך) ושעות שיא (מחיר גבוה) — הבסיס לכל האסטרטגיה.',
    },
    {
      icon: '☀️',
      title: 'חיבור SolarEdge API',
      body: 'כנסו לפורטל SolarEdge > Account > API Access > צרו API Key. הזינו אותו כאן יחד עם ה-Site ID שלכם.',
      note: 'זה מאפשר לאפליקציה לראות בזמן אמת כמה חשמל הפאנלים מייצרים ומה מצב הסוללה הפיזית.',
    },
    {
      icon: '⚡',
      title: 'אישורי Noga Energy (API)',
      body: 'כדי שנוכל למקסם את הרווחים מהגג שלך, המערכת צריכה אישורי גישה דיגיטליים לנגה — Client ID ו-Secret. אלו מאפשרים לאפליקציה לקבל מחירי חשמל בזמן אמת.',
      note: 'ללא חיבור זה האפליקציה פועלת ב-Simulation Mode — הכל עובד, אבל עם נתוני מחיר מדומים.',
    },
    {
      icon: '📱',
      title: 'הגדרת אמצעי תשלום',
      body: 'נדרש לקבלת תשלומים על אנרגיה שנמכרת לרשת. הוסיפו כרטיס אשראי בלחיצה על הכפתור.',
      note: 'ניתן להתחיל בסימולציה ללא תשלום — אך לקבלת הכנסות אמיתיות נדרש חיבור.',
    },
  ],
  stepsTitle: '🚀 שלבי שימוש — צעד אחר צעד',
  steps: [
    { num: '01', icon: '👤', title: 'כניסה ופרופיל', color: '#10b981',
      desc: 'היכנסו לאפליקציה עם אימייל או טלפון. בכרטיסיית פרופיל מלאו פרטי המשק הביתי — גודל מערכת, סוג סוללה וכתובת.',
      why: 'למה? האפליקציה מחשבת המלצות בהתאם לגודל המערכת שלכם.' },
    { num: '02', icon: '🏠', title: 'דשבורד ראשי — VPP Home', color: '#3b82f6',
      desc: 'בלשונית "בית" תראו: זרימת אנרגיה בזמן אמת, מצב הסוללה, מחיר החשמל הנוכחי ומדד הרווחיות.',
      why: 'למה? בדקו אותו בבוקר כדי לתכנן את היום.' },
    { num: '03', icon: '🔋', title: 'טעינת הסוללה חכמה', color: '#10b981',
      desc: 'לחצו על "טען סוללה". בחרו מקור אנרגיה ויעד אחוז טעינה. לחצו "יישם המלצת AI" לאסטרטגיה אוטומטית.',
      why: 'למה? מומלץ לטעון בשעות 10:00–16:00 כשהשמש בשיא ומחיר הרשת נמוך.' },
    { num: '04', icon: '📤', title: 'מכירה לרשת', color: '#f59e0b',
      desc: 'לחצו "מכור לרשת". בחרו כמות kWh ומתי — מיידית או מתוזמן. ההמלצה האוטומטית: תזמנו לשעות שיא (20:00–23:00).',
      why: 'למה? מחיר החשמל בשעות שיא גבוה פי 3–5 — כאן מרוויחים.' },
    { num: '05', icon: '⏰', title: 'תזמונים אוטומטיים', color: '#8b5cf6',
      desc: 'בכרטיסיית "תזמון" הגדירו חוקים: "כל יום ב-11:00 — טען עד 90%", "כל יום ב-21:00 — מכור 10 kWh".',
      why: 'למה? אוטומציה מבטיחה שלא תפספסו שעות שיא.' },
  ],
  tipsTitle: '💡 טיפים לשימוש אופטימלי',
  tips: [
    'בדקו את הדשבורד כל בוקר — 30 שניות מספיקות להחלטת היום.',
    'תזמנו מכירות לשעות 20:00–23:00 בימי חול — שעות השיא של חברת החשמל.',
    'טענו סוללה ב-10:00–16:00 כשהפאנלים מייצרים מקסימום.',
    'עקבו אחר התראות — האפליקציה מתריעה על אנומליות בייצור.',
    'בחורף השמש חלשה — הסתמכו יותר על חוות הקהילה.',
  ],
};

const GUIDE_EN = {
  lang: 'en',
  dir: 'ltr',
  pageTitle: 'User Manual',
  downloadBtn: 'Download PDF',
  pdfTitle: 'Complete User Manual',
  welcomePrefix: 'Welcome,',
  rights: 'All rights reserved',
  appDesc: 'A smart solar energy management platform — it collects your energy, manages it intelligently, and sells it at the right moment to maximize your profit.',
  prereqTitle: '📋 Prerequisites — Before You Start',
  prereqs: [
    {
      icon: '🏢',
      title: 'Apply for Time-of-Use (ToU) Tariff',
      body: 'Contact the Israel Electric Corporation and request a switch to dynamic pricing (ToU). Submit a digital request via their online form.',
      note: 'After switching, your bill will show off-peak (low price) and peak (high price) hours — the foundation of the entire strategy.',
    },
    {
      icon: '☀️',
      title: 'Connect SolarEdge API',
      body: 'Log in to the SolarEdge portal > Account > API Access > Create an API Key. Enter it here along with your Site ID.',
      note: 'This allows the app to see in real-time how much electricity your panels produce and what the physical battery status is.',
    },
    {
      icon: '⚡',
      title: 'Noga Energy API Credentials',
      body: 'To maximize your profits from your rooftop, the system needs digital access credentials for Noga — Client ID and Secret. These allow the app to receive real-time electricity prices.',
      note: 'Without this connection the app runs in Simulation Mode — everything works, but with simulated price data.',
    },
    {
      icon: '📱',
      title: 'Set Up Payment Method',
      body: 'Required to receive payments for energy sold to the grid. Add a credit card by tapping the button.',
      note: 'You can start in simulation mode without payment — but real income requires a connection.',
    },
  ],
  stepsTitle: '🚀 Step-by-Step Usage Guide',
  steps: [
    { num: '01', icon: '👤', title: 'Login & Profile', color: '#10b981',
      desc: 'Log in with your email or phone. In the Profile tab, fill in your household details — solar system size, battery type and address.',
      why: 'Why? The app calculates recommendations based on your system size.' },
    { num: '02', icon: '🏠', title: 'Main Dashboard — VPP Home', color: '#3b82f6',
      desc: 'In the "Home" tab: real-time energy flow (panels → home → grid), battery status, current electricity price and profitability index.',
      why: 'Why? Check it every morning to plan your day.' },
    { num: '03', icon: '🔋', title: 'Smart Battery Charging', color: '#10b981',
      desc: 'Tap "Charge Battery". Choose an energy source and a target charge percentage. Tap "Apply AI Recommendation" for an automatic strategy.',
      why: 'Why? Charge between 10:00–16:00 when the sun is at its peak and grid prices are low.' },
    { num: '04', icon: '📤', title: 'Sell to Grid', color: '#f59e0b',
      desc: 'Tap "Sell to Grid". Choose how many kWh and when — immediately or scheduled. The app recommends peak hours (20:00–23:00).',
      why: 'Why? Electricity prices during peak hours are 3–5× higher — this is where you earn.' },
    { num: '05', icon: '⏰', title: 'Automatic Schedules', color: '#8b5cf6',
      desc: 'In the "Schedule" tab, set recurring rules: "Every day at 11:00 — charge to 90%", "Every day at 21:00 — sell 10 kWh".',
      why: 'Why? Automation ensures you never miss peak hours.' },
  ],
  tipsTitle: '💡 Tips for Optimal Use',
  tips: [
    'Check the dashboard every morning — 30 seconds is enough to decide for the day.',
    'Schedule sales for 20:00–23:00 on weekdays — IEC peak hours.',
    'Charge battery 10:00–16:00 when panels produce maximum output.',
    'Watch alerts — the app notifies you about production anomalies.',
    'In winter, sunshine is weaker — rely more on community farms.',
  ],
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lang = 'he' } = await req.json();
    // jsPDF does not support Hebrew/RTL fonts — always use English content for PDF
    const g = GUIDE_EN;
    const userName = user?.full_name || 'Valued User';

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Hero section
    doc.setFillColor(16, 185, 129);
    doc.rect(10, yPosition, pageWidth - 20, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('VPP Solar Club', pageWidth / 2, yPosition + 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${g.welcomePrefix} ${userName}`, pageWidth / 2, yPosition + 21, { align: 'center' });

    yPosition += 40;

    // Prerequisites
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Prerequisites — Before You Start', 15, yPosition);
    yPosition += 8;

    g.prereqs.forEach(p => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${p.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const bodyLines = doc.splitTextToSize(p.body, pageWidth - 30);
      doc.text(bodyLines, 20, yPosition);
      yPosition += bodyLines.length * 3.5 + 3;
    });

    // Steps
    yPosition += 3;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Step-by-Step Usage Guide', 15, yPosition);
    yPosition += 8;

    g.steps.forEach((s, idx) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${idx + 1}. ${s.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(s.desc, pageWidth - 30);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 3.5 + 3;
    });

    // Tips
    yPosition += 3;
    if (yPosition > pageHeight - 35) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Tips for Optimal Use', 15, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    g.tips.forEach(tip => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }
      const tipLines = doc.splitTextToSize(`- ${tip}`, pageWidth - 30);
      doc.text(tipLines, 20, yPosition);
      yPosition += tipLines.length * 3.5 + 2;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('VPP Solar Club © 2026 · support@vppsolarclub.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Return as base64
    const pdfBytes = doc.output('arraybuffer');
    const binaryString = String.fromCharCode.apply(null, new Uint8Array(pdfBytes));
    const pdfBase64 = btoa(binaryString);
    
    return Response.json({
      success: true,
      pdf: pdfBase64,
      filename: 'VPP_Solar_Club_Guide.pdf'
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});