import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { type, value, threshold, file_name } = await req.json();

  const subject = `⚠️ VPP Solar Club — התראת חריגה: ${type}`;
  const body = `
שלום ${user.full_name || user.email},

זוהתה חריגה במערכת VPP Solar Club שלך:

🔴 סוג חריגה: ${type}
📊 ערך שזוהה: ${value}
⚠️ סף התראה: ${threshold}
📄 קובץ: ${file_name || '—'}
🕐 זמן: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}

המלצה: היכנס למערכת לצפייה בדוח המלא ולפעולת תיקון.

https://vpp-solar.app/bulk-audit

בברכה,
צוות VPP Solar Club
  `.trim();

  await base44.integrations.Core.SendEmail({
    to: user.email,
    subject,
    body,
    from_name: 'VPP Solar Club',
  });

  return Response.json({ success: true });
});