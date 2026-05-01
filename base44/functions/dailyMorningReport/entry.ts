import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function formatCurrency(n) {
  return `₪${(n || 0).toFixed(2)}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Admin-only
    const user = await base44.auth.me().catch(() => null);
    // Allow scheduled calls (no user) or admin users
    if (user && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all connected users
    const allUsers = await base44.asServiceRole.entities.User.list();
    const connectedUsers = allUsers.filter(u => u.system_connected && u.email);

    // Get latest fleet status
    const fleet = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 1);
    const fleetStatus = fleet[0] || {};

    // Get last 24h prices for stats
    const prices = await base44.asServiceRole.entities.NogaPrice.list('-created_date', 96); // 15min intervals = 96/day
    const avgPrice = prices.length
      ? prices.reduce((s, p) => s + p.price, 0) / prices.length
      : 0.55;
    const maxPrice = prices.length ? Math.max(...prices.map(p => p.price)) : 0.72;
    const minPrice = prices.length ? Math.min(...prices.map(p => p.price)) : 0.42;

    const now = new Date();
    const dateStr = now.toLocaleDateString('he-IL', { timeZone: 'Asia/Jerusalem', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    let emailsSent = 0;

    for (const recipient of connectedUsers) {
      // Personalized estimated savings (mock based on battery capacity or default)
      const capacityKwh = recipient.battery_capacity_kwh || 10;
      const estDailySavings = Math.round(capacityKwh * avgPrice * 0.6 * 100) / 100;
      const estMonthlySavings = Math.round(estDailySavings * 30);

      const subject = `☀️ דוח בוקר VPP — ${dateStr}`;
      const body = `
שלום ${recipient.full_name || recipient.email}!

☀️ דוח בוקר יומי — VPP Solar Club
─────────────────────────────────
📅 ${dateStr}

⚡ מחירי חשמל אתמול:
  • ממוצע: ${formatCurrency(avgPrice)}/kWh
  • שיא:   ${formatCurrency(maxPrice)}/kWh  
  • שפל:   ${formatCurrency(minPrice)}/kWh

🔋 מצב הצי (VPP Fleet):
  • אנרגיה זמינה:  ${fleetStatus.fleet_kwh_available || '—'} kWh
  • ייצור כולל:    ${fleetStatus.total_power_kw || '—'} kW
  • SoC ממוצע:    ${fleetStatus.avg_soc_pct || '—'}%
  • אתרים פעילים: ${fleetStatus.total_sites || '—'}

💰 הערכת חיסכון שלך:
  • יומי:  ${formatCurrency(estDailySavings)}
  • חודשי: ₪${estMonthlySavings}

🤖 המלצת AI להיום:
  ${maxPrice > 0.65
    ? `שעות השיא (17:00–21:00) יהיו רווחיות במיוחד. מכור ${Math.round(capacityKwh * 0.4 * 10) / 10} kWh לרשת.`
    : `מחיר יציב היום. טען את הסוללה עד 90% בבוקר ושמור לערב.`
  }

🔗 https://vpp-solar.app/Dashboard

בהצלחה ויום טוב ☀️
צוות VPP Solar Club
      `.trim();

      await base44.asServiceRole.integrations.Core.SendEmail({
        to: recipient.email,
        subject,
        body,
        from_name: 'VPP Solar Club',
      }).catch(() => {});

      emailsSent++;
    }

    return Response.json({ success: true, emails_sent: emailsSent, users_total: connectedUsers.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});