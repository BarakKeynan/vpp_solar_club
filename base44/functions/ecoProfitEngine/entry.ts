import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// TOU tariff thresholds (IEC Israel)
const PEAK_THRESHOLD_NIS = 0.60;   // above this = peak → discharge & sell
const OFFPEAK_THRESHOLD_NIS = 0.48; // below this = off-peak → charge

function decideBatteryMode(price, hour) {
  // Peak hours: 17:00-22:00 and 07:00-10:00
  const isPeakHour = (hour >= 17 && hour <= 21) || (hour >= 7 && hour <= 9);
  const isOffPeakHour = hour >= 23 || hour <= 6;

  if (price >= PEAK_THRESHOLD_NIS || isPeakHour) {
    return { mode: 'discharging', reason: 'peak_tariff', soc_target: 20 };
  }
  if (price <= OFFPEAK_THRESHOLD_NIS || isOffPeakHour) {
    return { mode: 'charging', reason: 'offpeak_tariff', soc_target: 95 };
  }
  return { mode: 'standby', reason: 'neutral', soc_target: null };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get latest Noga price
    const prices = await base44.asServiceRole.entities.NogaPrice.list('-created_date', 1);
    const latestPrice = prices[0];

    if (!latestPrice) {
      return Response.json({ error: 'No price data available' }, { status: 404 });
    }

    const now = new Date();
    const hour = now.getHours();
    const decision = decideBatteryMode(latestPrice.price, hour);

    // Get fleet status
    const fleet = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 1);
    const fleetStatus = fleet[0] || {};

    // Calculate estimated profit for this cycle (15 min = 0.25h)
    const avgBatteryKwh = (fleetStatus.fleet_kwh_available || 0);
    const sellableKwh = decision.mode === 'discharging' ? Math.min(avgBatteryKwh * 0.3, 5) : 0;
    const estimatedProfit = Math.round(sellableKwh * latestPrice.price * 100) / 100;

    // Store Eco-Profit decision in AppConfig for UI to read
    const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'eco_profit_state' });
    const stateRecord = {
      key: 'eco_profit_state',
      live_mode: true,
      // store extra fields as JSON in noga_api_url field (reusing for state)
      noga_api_url: JSON.stringify({
        mode: decision.mode,
        reason: decision.reason,
        current_rate: latestPrice.price,
        peak_hour: (hour >= 17 && hour <= 21) || (hour >= 7 && hour <= 9),
        profit_cycle_nis: estimatedProfit,
        soc_target: decision.soc_target,
        next_check: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
        updated_at: now.toISOString(),
        is_mock: latestPrice.is_mock,
      }),
    };

    if (configs.length > 0) {
      await base44.asServiceRole.entities.AppConfig.update(configs[0].id, stateRecord);
    } else {
      await base44.asServiceRole.entities.AppConfig.create(stateRecord);
    }

    return Response.json({
      success: true,
      price: latestPrice.price,
      mode: decision.mode,
      reason: decision.reason,
      estimated_profit_nis: estimatedProfit,
      is_mock: latestPrice.is_mock,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});