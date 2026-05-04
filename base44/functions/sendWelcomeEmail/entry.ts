import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const WELCOME_EMAIL_HTML = (firstName) => `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ברוכים הבאים ל-VPP Solar Club</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #0f172a; color: #e2e8f0; margin: 0; padding: 0; direction: rtl; }
    .container { max-width: 620px; margin: 0 auto; background: #1e293b; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #10b981, #059669); padding: 40px 32px; text-align: center; }
    .header h1 { margin: 0; color: #fff; font-size: 26px; font-weight: 900; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 15px; }
    .body { padding: 32px; }
    .welcome-text { font-size: 17px; line-height: 1.7; color: #cbd5e1; margin-bottom: 28px; }
    .welcome-text strong { color: #34d399; }
    .section-title { font-size: 16px; font-weight: 900; color: #f8fafc; margin: 28px 0 12px; padding-bottom: 8px; border-bottom: 1px solid #334155; }
    .prereq-item { background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; }
    .prereq-title { font-weight: 700; color: #f1f5f9; font-size: 14px; margin-bottom: 4px; }
    .prereq-body { color: #94a3b8; font-size: 13px; line-height: 1.6; margin-bottom: 6px; }
    .prereq-note { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 8px; padding: 8px 12px; color: #6ee7b7; font-size: 12px; }
    .step-item { display: flex; gap: 12px; margin-bottom: 14px; align-items: flex-start; }
    .step-num { min-width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 12px; background: rgba(16,185,129,0.15); color: #34d399; border: 1px solid rgba(16,185,129,0.3); text-align: center; line-height: 32px; }
    .step-content { flex: 1; }
    .step-title { font-weight: 700; color: #f1f5f9; font-size: 14px; margin-bottom: 3px; }
    .step-desc { color: #94a3b8; font-size: 13px; line-height: 1.6; }
    .step-why { color: #34d399; font-size: 12px; margin-top: 4px; font-weight: 600; }
    .tips-list { list-style: none; padding: 0; margin: 0; }
    .tips-list li { color: #94a3b8; font-size: 13px; padding: 7px 0; border-bottom: 1px solid #1e293b; line-height: 1.6; }
    .tips-list li::before { content: "✦ "; color: #10b981; font-weight: 900; }
    .cta-btn { display: block; text-align: center; background: linear-gradient(135deg, #10b981, #059669); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 900; font-size: 15px; margin: 28px 0; }
    .footer { background: #0f172a; padding: 20px 32px; text-align: center; color: #475569; font-size: 12px; }
  </style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <h1>VPP Solar Club</h1>
    <p>פלטפורמת ניהול האנרגיה הסולארית החכמה</p>
  </div>

  <div class="body">

    <!-- Welcome message -->
    <p class="welcome-text">
      שלום <strong>${firstName}</strong>,<br><br>
      ברוכים הבאים ל-<strong>VPP Solar Club</strong>! 🎉<br><br>
      אנחנו שמחים שהצטרפת אלינו. הפלטפורמה שלנו אוספת את האנרגיה הסולארית שלך, מנהלת אותה בצורה חכמה ומוכרת אותה ברגע הנכון — כדי <strong>למקסם את הרווח שלך</strong> מהמערכת הסולארית.<br><br>
      למטה תמצא את המדריך המלא שיעזור לך להתחיל נכון.
    </p>

    <!-- Prerequisites -->
    <div class="section-title">📋 הכנה מוקדמת — לפני שמתחילים</div>

    <div class="prereq-item">
      <div class="prereq-title">🏢 הגשת בקשה לתעריף תעו"ז (זמן שימוש)</div>
      <div class="prereq-body">יש לפנות לחברת החשמל ולבקש מעבר לתעריף דינמי (תעו"ז). פנייה דיגיטלית דרך האתר שלהם.</div>
      <div class="prereq-note">💡 לאחר המעבר תמצאו בחשבון שלכם שעות שפל (מחיר נמוך) ושעות שיא (מחיר גבוה) — הבסיס לכל האסטרטגיה.</div>
    </div>

    <div class="prereq-item">
      <div class="prereq-title">☀️ חיבור SolarEdge API</div>
      <div class="prereq-body">כנסו לפורטל SolarEdge > Account > API Access > צרו API Key. הזינו אותו בפרופיל שלכם יחד עם ה-Site ID.</div>
      <div class="prereq-note">💡 זה מאפשר לאפליקציה לראות בזמן אמת כמה חשמל הפאנלים מייצרים ומה מצב הסוללה הפיזית.</div>
    </div>

    <div class="prereq-item">
      <div class="prereq-title">⚡ אישורי Noga Energy (API)</div>
      <div class="prereq-body">כדי למקסם את הרווחים, המערכת צריכה אישורי גישה לנגה — Client ID ו-Secret. פנו אלינו לעזרה בהשגתם.</div>
      <div class="prereq-note">💡 ללא חיבור זה האפליקציה פועלת ב-Simulation Mode — הכל עובד, אבל עם נתוני מחיר מדומים.</div>
    </div>

    <div class="prereq-item">
      <div class="prereq-title">📱 הגדרת אמצעי תשלום</div>
      <div class="prereq-body">נדרש לקבלת תשלומים על אנרגיה שנמכרת לרשת. הוסיפו כרטיס אשראי בפרופיל.</div>
      <div class="prereq-note">💡 ניתן להתחיל בסימולציה ללא תשלום — אך לקבלת הכנסות אמיתיות נדרש חיבור.</div>
    </div>

    <!-- Steps -->
    <div class="section-title">🚀 שלבי שימוש — צעד אחר צעד</div>

    <div class="step-item">
      <div class="step-num">01</div>
      <div class="step-content">
        <div class="step-title">👤 כניסה ופרופיל</div>
        <div class="step-desc">בכרטיסיית פרופיל מלאו פרטי המשק הביתי — גודל מערכת, סוג סוללה וכתובת.</div>
        <div class="step-why">האפליקציה מחשבת המלצות בהתאם לגודל המערכת שלכם.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">02</div>
      <div class="step-content">
        <div class="step-title">🏠 דשבורד ראשי — VPP Home</div>
        <div class="step-desc">תראו זרימת אנרגיה בזמן אמת, מצב הסוללה, מחיר החשמל הנוכחי ומדד הרווחיות.</div>
        <div class="step-why">בדקו אותו בבוקר כדי לתכנן את היום.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">03</div>
      <div class="step-content">
        <div class="step-title">🔋 טעינת הסוללה חכמה</div>
        <div class="step-desc">לחצו על "טען סוללה". בחרו מקור אנרגיה ויעד אחוז טעינה. לחצו "יישם המלצת AI" לאסטרטגיה אוטומטית.</div>
        <div class="step-why">מומלץ לטעון בשעות 10:00–16:00 כשהשמש בשיא ומחיר הרשת נמוך.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">04</div>
      <div class="step-content">
        <div class="step-title">📤 מכירה לרשת</div>
        <div class="step-desc">לחצו "מכור לרשת". בחרו כמות kWh ומתי — מיידית או מתוזמן.</div>
        <div class="step-why">מחיר החשמל בשעות שיא (20:00–23:00) גבוה פי 3–5 — כאן מרוויחים.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">05</div>
      <div class="step-content">
        <div class="step-title">⏰ תזמונים אוטומטיים</div>
        <div class="step-desc">בכרטיסיית "תזמון" הגדירו חוקים: "כל יום ב-11:00 — טען עד 90%", "כל יום ב-21:00 — מכור 10 kWh".</div>
        <div class="step-why">אוטומציה מבטיחה שלא תפספסו שעות שיא.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">06</div>
      <div class="step-content">
        <div class="step-title">📊 מעקב חיסכון ורווח</div>
        <div class="step-desc">בכרטיסיית "חיסכון" עקבו אחר הרווח החודשי, חיסכון בחשבון החשמל וביצועי כל חווה.</div>
        <div class="step-why">ניטור שבועי מאפשר לשפר אסטרטגיה ולהגדיל רווחים.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">07</div>
      <div class="step-content">
        <div class="step-title">🖥️ VPP Command Center</div>
        <div class="step-desc">עוד > VPP Command Center — מחירי חשמל בזמן אמת, גרף 24 שעות וסטטוס כל הסוללות בצי.</div>
        <div class="step-why">מידע זה עוזר להחליט מתי לטעון ומתי למכור.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">08</div>
      <div class="step-content">
        <div class="step-title">⚙️ הגדרות מתקדמות</div>
        <div class="step-desc">עוד > VPP Settings — הזינו API Keys, בחרו Simulation/Live Mode ובדקו סטטוס החיבורים.</div>
        <div class="step-why">מעבר ל-Live Mode חיוני לסחור עם כסף אמיתי.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">09</div>
      <div class="step-content">
        <div class="step-title">🌞 Solar Club — קהילה</div>
        <div class="step-desc">בלשונית "SolarClub": הצטרפו לחוות וירטואליות ורכשו פאנלים נוספים לרווח פסיבי.</div>
        <div class="step-why">פאנלים וירטואליים מייצרים הכנסה פסיבית גם ללא גג אישי.</div>
      </div>
    </div>

    <div class="step-item">
      <div class="step-num">10</div>
      <div class="step-content">
        <div class="step-title">🤝 הפניית חברים</div>
        <div class="step-desc">עוד > חבר מביא חבר. 1 חבר — חודש חינם. 3 חברים — 3 חודשים + ניקוי פאנלים. 5 חברים — Founder Circle VIP.</div>
        <div class="step-why">כל חבר מגדיל את כוח הצי ומשפר מחירי מכירה.</div>
      </div>
    </div>

    <!-- Tips -->
    <div class="section-title">💡 טיפים לשימוש אופטימלי</div>
    <ul class="tips-list">
      <li>בדקו את הדשבורד כל בוקר — 30 שניות מספיקות להחלטת היום.</li>
      <li>תזמנו מכירות לשעות 20:00–23:00 בימי חול — שעות השיא של חברת החשמל.</li>
      <li>טענו סוללה ב-10:00–16:00 כשהפאנלים מייצרים מקסימום.</li>
      <li>עקבו אחר התראות — האפליקציה מתריעה על אנומליות בייצור.</li>
      <li>בחורף השמש חלשה — הסתמכו יותר על חוות הקהילה.</li>
      <li>הפעילו ECO Profit Mode לאוטומציה מלאה ללא התערבות.</li>
    </ul>

    <!-- CTA -->
    <a class="cta-btn" href="https://app.vppsolarclub.com">כניסה לאפליקציה &larr;</a>

  </div>

  <div class="footer">
    VPP Solar Club &copy; 2026 &nbsp;|&nbsp; support@vppsolarclub.com<br>
    כל הזכויות שמורות
  </div>

</div>
</body>
</html>
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    // Called from entity automation — payload contains event + data
    const userData = payload?.data || payload;
    const userEmail = userData?.email;
    const userFullName = userData?.full_name || '';
    const firstName = userFullName.split(' ')[0] || 'משתמש יקר';

    if (!userEmail) {
      return Response.json({ error: 'No email found in payload' }, { status: 400 });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: userEmail,
      subject: `ברוכים הבאים ל-VPP Solar Club, ${firstName}! 🌞`,
      body: WELCOME_EMAIL_HTML(firstName),
      from_name: 'VPP Solar Club',
    });

    return Response.json({ success: true, sent_to: userEmail });
  } catch (error) {
    console.error('Welcome email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});