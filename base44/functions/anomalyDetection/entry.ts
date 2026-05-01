import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Thresholds for anomaly detection
const THRESHOLDS = {
  soc_min: 5,          // % — below this is critical
  soc_max: 100,
  power_kw_max: 15,    // kW — above this is suspicious
  temp_c_max: 45,      // °C — thermal runaway risk
  price_spike: 0.90,   // ₪/kWh — extreme price spike
  fleet_kwh_min: 5,    // kWh — fleet critically low
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const anomalies = [];

    // ── 1. Check latest fleet status ─────────────────────────────────────
    const fleet = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 1);
    const fleetStatus = fleet[0];

    if (fleetStatus) {
      if (fleetStatus.fleet_kwh_available < THRESHOLDS.fleet_kwh_min) {
        anomalies.push({
          type: 'fleet_low_energy',
          value: fleetStatus.fleet_kwh_available,
          threshold: THRESHOLDS.fleet_kwh_min,
          severity: 'warning',
          message: `צי הסוללות נמוך מאוד: ${fleetStatus.fleet_kwh_available} kWh (סף: ${THRESHOLDS.fleet_kwh_min} kWh)`,
        });
      }
      if (fleetStatus.avg_soc_pct < THRESHOLDS.soc_min) {
        anomalies.push({
          type: 'fleet_soc_critical',
          value: fleetStatus.avg_soc_pct,
          threshold: THRESHOLDS.soc_min,
          severity: 'critical',
          message: `SoC ממוצע קריטי: ${fleetStatus.avg_soc_pct}% (סף: ${THRESHOLDS.soc_min}%)`,
        });
      }
      if (fleetStatus.total_power_kw > THRESHOLDS.power_kw_max) {
        anomalies.push({
          type: 'power_spike',
          value: fleetStatus.total_power_kw,
          threshold: THRESHOLDS.power_kw_max,
          severity: 'warning',
          message: `צריכת הספק חריגה: ${fleetStatus.total_power_kw} kW (סף: ${THRESHOLDS.power_kw_max} kW)`,
        });
      }
    }

    // ── 2. Check latest Noga price ────────────────────────────────────────
    const prices = await base44.asServiceRole.entities.NogaPrice.list('-created_date', 1);
    const latestPrice = prices[0];

    if (latestPrice && latestPrice.price > THRESHOLDS.price_spike) {
      anomalies.push({
        type: 'price_spike',
        value: latestPrice.price,
        threshold: THRESHOLDS.price_spike,
        severity: 'info',
        message: `מחיר חשמל גבוה חריג: ₪${latestPrice.price}/kWh (סף: ₪${THRESHOLDS.price_spike})`,
      });
    }

    // ── 3. Check per-site data for thermal/power anomalies ────────────────
    if (fleetStatus?.sites_data) {
      for (const site of fleetStatus.sites_data) {
        if (site.tempC && site.tempC > THRESHOLDS.temp_c_max) {
          anomalies.push({
            type: 'thermal_warning',
            value: site.tempC,
            threshold: THRESHOLDS.temp_c_max,
            severity: 'critical',
            message: `⚠️ חום קריטי באתר ${site.siteId}: ${site.tempC}°C (סף: ${THRESHOLDS.temp_c_max}°C)`,
          });
        }
      }
    }

    // ── 4. Alert admins if critical anomalies found ───────────────────────
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical');
    if (criticalAnomalies.length > 0) {
      const adminUsers = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
      for (const admin of adminUsers) {
        const anomalyList = criticalAnomalies.map(a => `• ${a.message}`).join('\n');
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: admin.email,
          subject: `🚨 VPP Solar Club — ${criticalAnomalies.length} חריגות קריטיות`,
          body: `שלום ${admin.full_name || admin.email},\n\nזוהו החריגות הבאות:\n\n${anomalyList}\n\nנא לבדוק את המערכת בהקדם.\n\nhttps://vpp-solar.app/admin-panel\n\nצוות VPP Solar Club`,
          from_name: 'VPP Solar Club Alert System',
        }).catch(() => {});
      }
    }

    return Response.json({
      success: true,
      anomalies_found: anomalies.length,
      critical: criticalAnomalies.length,
      anomalies,
      checked_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});