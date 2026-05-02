/**
 * batteryCommands — Backend function for:
 * 1. charge_to_virtual  — Send charge command to physical battery, credit energy to virtual wallet
 * 2. sell_to_grid       — Scheduled or immediate sell back to grid from virtual wallet
 * 3. get_status         — Fetch real-time battery + virtual wallet status
 *
 * Physical battery integration: SolarEdge StorEdge API (or Tesla Powerwall local REST)
 * Virtual battery: stored in AppConfig / user entity
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SOLAREDGE_BASE = 'https://monitoringapi.solaredge.com';

async function getSolarEdgeBatteryStatus(apiKey, siteId) {
  const url = `${SOLAREDGE_BASE}/site/${siteId}/storageData?api_key=${apiKey}&startTime=${getStartTime()}&endTime=${getNow()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SolarEdge API error: ${res.status}`);
  const data = await res.json();
  return data?.storageData?.batteries?.[0] ?? null;
}

async function sendSolarEdgeChargeCommand(apiKey, siteId, targetSoc) {
  // SolarEdge StorEdge — set charge/discharge profile via API
  // NOTE: Requires StorEdge profile control enabled in SolarEdge portal
  const url = `${SOLAREDGE_BASE}/site/${siteId}/storage/charge?api_key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'CHARGE', targetSoc }),
  });
  if (!res.ok) throw new Error(`SolarEdge charge command failed: ${res.status}`);
  return await res.json();
}

async function sendSolarEdgeSellCommand(apiKey, siteId, kwhToSell, scheduledTime) {
  // Discharge battery to grid at scheduled time
  const url = `${SOLAREDGE_BASE}/site/${siteId}/storage/discharge?api_key=${apiKey}`;
  const body = { mode: 'DISCHARGE_TO_GRID', kwhAmount: kwhToSell };
  if (scheduledTime) body.scheduledAt = scheduledTime; // ISO string
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`SolarEdge sell command failed: ${res.status}`);
  return await res.json();
}

function getNow() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}
function getStartTime() {
  const d = new Date(); d.setHours(d.getHours() - 1);
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, targetSoc, kwhToSell, scheduledTime, siteId: bodySiteId } = body;

    // Load config
    const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'vpp_settings' });
    const cfg = configs?.[0] ?? {};
    const apiKey = cfg.solaredge_api_key;
    const siteIds = (cfg.solaredge_site_ids || '').split(',').map(s => s.trim()).filter(Boolean);
    const siteId = bodySiteId || siteIds[0];
    const isLive = cfg.live_mode === true;

    // ── GET STATUS ──────────────────────────────────────────────────────
    if (action === 'get_status') {
      if (!isLive || !apiKey || !siteId) {
        // Return mock data in simulation mode
        return Response.json({
          mode: 'simulation',
          physical: { soc: 78, powerKw: 2.4, status: 'Charging', capacityKwh: 13.5 },
          virtual: { kwhBalance: user.virtual_kwh_balance ?? 42.5, lastUpdated: new Date().toISOString() },
        });
      }
      const battery = await getSolarEdgeBatteryStatus(apiKey, siteId);
      return Response.json({
        mode: 'live',
        physical: battery,
        virtual: { kwhBalance: user.virtual_kwh_balance ?? 0, lastUpdated: new Date().toISOString() },
      });
    }

    // ── CHARGE TO VIRTUAL ───────────────────────────────────────────────
    if (action === 'charge_to_virtual') {
      const target = targetSoc ?? 95;
      let result;
      if (!isLive || !apiKey || !siteId) {
        // Simulation: just update virtual balance
        result = { simulated: true, message: `Simulated: charge command sent to ${target}%` };
      } else {
        result = await sendSolarEdgeChargeCommand(apiKey, siteId, target);
      }
      // Credit virtual wallet: assume charging from current to target ~ (target-current)% * capacity kWh
      const currentSoc = body.currentSoc ?? 78;
      const capacityKwh = 13.5;
      const addedKwh = ((target - currentSoc) / 100) * capacityKwh;
      const newBalance = (user.virtual_kwh_balance ?? 0) + Math.max(0, addedKwh);
      await base44.auth.updateMe({ virtual_kwh_balance: Math.round(newBalance * 10) / 10 });
      return Response.json({ success: true, addedKwh: Math.max(0, addedKwh).toFixed(1), newBalance: newBalance.toFixed(1), result });
    }

    // ── SELL TO GRID ─────────────────────────────────────────────────────
    if (action === 'sell_to_grid') {
      const kwh = kwhToSell ?? 10;
      const currentBalance = user.virtual_kwh_balance ?? 0;
      if (kwh > currentBalance) {
        return Response.json({ error: `אין מספיק אנרגיה בסוללה הוירטואלית (${currentBalance} kWh)` }, { status: 400 });
      }
      let result;
      if (!isLive || !apiKey || !siteId) {
        result = { simulated: true, message: `Simulated: sell ${kwh} kWh to grid${scheduledTime ? ` at ${scheduledTime}` : ' now'}` };
      } else {
        result = await sendSolarEdgeSellCommand(apiKey, siteId, kwh, scheduledTime);
      }
      const newBalance = currentBalance - kwh;
      await base44.auth.updateMe({ virtual_kwh_balance: Math.round(newBalance * 10) / 10 });
      // Estimate revenue at current Noga peak price
      const pricePerKwh = 0.61;
      const estimatedRevenue = (kwh * pricePerKwh).toFixed(2);
      return Response.json({ success: true, soldKwh: kwh, newBalance: newBalance.toFixed(1), estimatedRevenue, scheduledTime: scheduledTime ?? 'now', result });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});