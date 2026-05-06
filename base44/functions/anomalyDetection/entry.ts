import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const THRESHOLDS = {
  soc_min: 5,           // % — below this is critical
  soc_site_min: 8,      // % — per-site SoC critical
  power_kw_max: 15,     // kW — above this is suspicious
  temp_c_max: 45,       // °C — thermal runaway risk
  price_spike: 0.90,    // ₪/kWh — extreme price spike
  fleet_kwh_min: 5,     // kWh — fleet critically low
  site_power_zero: 0.1, // kW — site producing nothing during daylight = fault
  cooldown_minutes: 60, // don't re-alert same type within this window
};

// Check if we already sent a similar alert recently (cooldown)
async function isInCooldown(base44, type, siteId) {
  const cutoff = new Date(Date.now() - THRESHOLDS.cooldown_minutes * 60 * 1000).toISOString();
  const recent = await base44.asServiceRole.entities.SystemAlert.filter({
    type,
    is_resolved: false,
    created_date: { $gt: cutoff },
  });
  if (siteId) return recent.some(a => a.site_id === siteId);
  return recent.length > 0;
}

async function sendAlertEmail(base44, anomalies) {
  const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
  const now = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' });
  const list = anomalies.map(a => `• [${a.severity.toUpperCase()}] ${a.message}`).join('\n');

  for (const admin of adminUsers) {
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: admin.email,
      subject: `🚨 VPP Solar Club — ${anomalies.length} התראות מערכת (${anomalies.filter(a => a.severity === 'critical').length} קריטיות)`,
      body: `שלום ${admin.full_name || admin.email},\n\nזוהו ההתראות הבאות ב-${now}:\n\n${list}\n\nנא לבדוק את המערכת בהקדם.\n\nhttps://vpp-solar.app/admin-panel\n\nצוות VPP Solar Club`,
      from_name: 'VPP Solar Club Alert System',
    }).catch(() => {});
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const newAlerts = [];

    // ── 1. Fleet-level checks ─────────────────────────────────────────────
    const fleet = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 1);
    const fleetStatus = fleet[0];

    if (fleetStatus) {
      // Fleet energy critically low
      if (fleetStatus.fleet_kwh_available < THRESHOLDS.fleet_kwh_min) {
        if (!await isInCooldown(base44, 'fleet_low_energy', null)) {
          newAlerts.push({
            type: 'fleet_low_energy',
            severity: 'warning',
            message: `צי הסוללות נמוך מאוד: ${fleetStatus.fleet_kwh_available} kWh (סף: ${THRESHOLDS.fleet_kwh_min} kWh)`,
            value: fleetStatus.fleet_kwh_available,
            threshold: THRESHOLDS.fleet_kwh_min,
          });
        }
      }

      // Average SoC critical
      if (fleetStatus.avg_soc_pct < THRESHOLDS.soc_min) {
        if (!await isInCooldown(base44, 'fleet_soc_critical', null)) {
          newAlerts.push({
            type: 'fleet_soc_critical',
            severity: 'critical',
            message: `SoC ממוצע קריטי בצי: ${fleetStatus.avg_soc_pct}% (סף: ${THRESHOLDS.soc_min}%)`,
            value: fleetStatus.avg_soc_pct,
            threshold: THRESHOLDS.soc_min,
          });
        }
      }

      // Power spike across fleet
      if (fleetStatus.total_power_kw > THRESHOLDS.power_kw_max) {
        if (!await isInCooldown(base44, 'power_spike', null)) {
          newAlerts.push({
            type: 'power_spike',
            severity: 'warning',
            message: `צריכת הספק חריגה בצי: ${fleetStatus.total_power_kw} kW (סף: ${THRESHOLDS.power_kw_max} kW)`,
            value: fleetStatus.total_power_kw,
            threshold: THRESHOLDS.power_kw_max,
          });
        }
      }

      // ── 2. Per-site checks ──────────────────────────────────────────────
      const nowHour = new Date().getHours();
      const isDaylight = nowHour >= 7 && nowHour <= 18;

      if (fleetStatus.sites_data) {
        for (const site of fleetStatus.sites_data) {
          // Thermal runaway warning
          if (site.tempC && site.tempC > THRESHOLDS.temp_c_max) {
            if (!await isInCooldown(base44, 'thermal_warning', site.siteId)) {
              newAlerts.push({
                type: 'thermal_warning',
                severity: 'critical',
                message: `חום קריטי באתר ${site.siteId}: ${site.tempC}°C (סף: ${THRESHOLDS.temp_c_max}°C) — סכנת runaway`,
                value: site.tempC,
                threshold: THRESHOLDS.temp_c_max,
                site_id: site.siteId,
              });
            }
          }

          // Per-site SoC critical
          if (site.soc !== undefined && site.soc < THRESHOLDS.soc_site_min) {
            if (!await isInCooldown(base44, 'site_soc_critical', site.siteId)) {
              newAlerts.push({
                type: 'site_soc_critical',
                severity: 'critical',
                message: `SoC קריטי באתר ${site.siteId}: ${site.soc}% (סף: ${THRESHOLDS.soc_site_min}%)`,
                value: site.soc,
                threshold: THRESHOLDS.soc_site_min,
                site_id: site.siteId,
              });
            }
          }

          // Site not producing during daylight = inverter/panel fault
          if (isDaylight && site.powerKw !== undefined && site.powerKw < THRESHOLDS.site_power_zero && !site.is_mock) {
            if (!await isInCooldown(base44, 'site_no_production', site.siteId)) {
              newAlerts.push({
                type: 'site_no_production',
                severity: 'critical',
                message: `תקלה חשודה באתר ${site.siteId}: אין ייצור ביום (${site.powerKw} kW) — בדקו אינוורטר/פאנלים`,
                value: site.powerKw,
                threshold: THRESHOLDS.site_power_zero,
                site_id: site.siteId,
              });
            }
          }
        }
      }
    }

    // ── 3. Price spike check ────────────────────────────────────────────────
    const prices = await base44.asServiceRole.entities.NogaPrice.list('-created_date', 1);
    const latestPrice = prices[0];
    if (latestPrice && latestPrice.price > THRESHOLDS.price_spike) {
      if (!await isInCooldown(base44, 'price_spike', null)) {
        newAlerts.push({
          type: 'price_spike',
          severity: 'info',
          message: `מחיר חשמל גבוה חריג: ₪${latestPrice.price}/kWh (סף: ₪${THRESHOLDS.price_spike}) — הזדמנות מכירה`,
          value: latestPrice.price,
          threshold: THRESHOLDS.price_spike,
        });
      }
    }

    // ── 4. Persist new alerts & send emails ────────────────────────────────
    let emailSent = false;
    for (const alert of newAlerts) {
      await base44.asServiceRole.entities.SystemAlert.create({
        ...alert,
        email_sent: false,
        is_resolved: false,
      });
    }

    const urgentAlerts = newAlerts.filter(a => a.severity !== 'info');
    if (urgentAlerts.length > 0) {
      await sendAlertEmail(base44, urgentAlerts);
      // Mark as email sent
      const recent = await base44.asServiceRole.entities.SystemAlert.filter({ email_sent: false });
      for (const a of recent) {
        await base44.asServiceRole.entities.SystemAlert.update(a.id, { email_sent: true });
      }
      emailSent = true;
    }

    // ── 5. Auto-resolve alerts that are no longer active ──────────────────
    const openAlerts = await base44.asServiceRole.entities.SystemAlert.filter({ is_resolved: false });
    for (const open of openAlerts) {
      const stillActive = newAlerts.some(n => n.type === open.type && (n.site_id || null) === (open.site_id || null));
      if (!stillActive) {
        await base44.asServiceRole.entities.SystemAlert.update(open.id, {
          is_resolved: true,
          resolved_at: new Date().toISOString(),
        });
      }
    }

    // ── 6. Cleanup: keep only last 500 alerts ─────────────────────────────
    const allAlerts = await base44.asServiceRole.entities.SystemAlert.list('-created_date', 600);
    if (allAlerts.length > 500) {
      for (const old of allAlerts.slice(500)) {
        await base44.asServiceRole.entities.SystemAlert.delete(old.id);
      }
    }

    return Response.json({
      success: true,
      new_alerts: newAlerts.length,
      email_sent: emailSent,
      alerts: newAlerts,
      checked_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});