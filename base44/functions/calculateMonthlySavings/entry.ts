import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Tariff constants (ILS/kWh) — Israel 2024 averages
const GRID_BUY_RATE = 0.62;   // what you'd pay buying from grid
const FIT_SELL_RATE = 0.48;   // feed-in tariff for solar export
const PEAK_PREMIUM = 0.22;    // extra cost per kWh in peak hours (17:00-22:00)

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    // Get latest fleet snapshot
    const fleetList = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 5);
    const fleet = fleetList[0];

    // Get prices for past 30 days
    const priceList = await base44.asServiceRole.entities.NogaPrice.list('-created_date', 720); // ~30 days of hourly

    // --- Derive user system params ---
    const batteryKwh = user.battery_capacity_kwh || 10;
    const panelKwp = user.panel_kwp || 8;

    // --- Simulate monthly production (if no real data) ---
    const avgSunHours = 5.5; // Israel average
    const daysInMonth = 30;
    const monthlyProduction = panelKwp * avgSunHours * daysInMonth; // kWh

    // --- Consumption split (typical Israeli home) ---
    const selfConsumptionRatio = 0.45;
    const gridSellRatio = 0.55;

    const selfConsumed = monthlyProduction * selfConsumptionRatio;
    const soldToGrid = monthlyProduction * gridSellRatio;

    // --- Savings components ---
    // 1. Solar self-consumption savings (avoided grid purchase)
    const solar_self = Math.round(selfConsumed * GRID_BUY_RATE * 100) / 100;

    // 2. FIT income from selling to grid
    const grid_sell = Math.round(soldToGrid * FIT_SELL_RATE * 100) / 100;

    // 3. Battery arbitrage (charge cheap, discharge expensive)
    const arbitrageCycles = daysInMonth * 0.8; // ~80% daily cycle usage
    const arbSpread = 0.18; // avg price diff between cheap/peak hours
    const battery_arb = Math.round(batteryKwh * arbitrageCycles * arbSpread * 100) / 100;

    // 4. VPP Club collective revenue (based on fleet avg SoC participation)
    const avgSoc = fleet?.avg_soc_pct || 65;
    const participationFactor = Math.min(avgSoc / 100, 1);
    const vpp_club = Math.round(batteryKwh * participationFactor * 4.2 * 100) / 100; // 4.2 ₪/kWh fleet avg

    // 5. Peak avoidance (shifted load × premium)
    const shiftableLoadKwh = 3.5 * daysInMonth; // ~3.5 kWh/day shiftable
    const peak_avoid = Math.round(shiftableLoadKwh * PEAK_PREMIUM * 100) / 100;

    const total = Math.round((solar_self + grid_sell + battery_arb + vpp_club + peak_avoid) * 100) / 100;

    // What bill would have been without the system
    const totalConsumption = selfConsumed + (panelKwp * avgSunHours * daysInMonth * 0.3); // incl. what battery handled
    const bill_without = Math.round(totalConsumption * GRID_BUY_RATE + shiftableLoadKwh * PEAK_PREMIUM);
    const bill_with = Math.max(0, bill_without - total);

    // Avg price from NogaPrice
    const avgPrice = priceList.length > 0
      ? priceList.reduce((s, p) => s + p.price, 0) / priceList.length
      : GRID_BUY_RATE;

    return Response.json({
      success: true,
      total,
      breakdown: { solar_self, grid_sell, battery_arb, vpp_club, peak_avoid },
      bill_without,
      bill_with,
      stats: {
        monthly_production_kwh: Math.round(monthlyProduction),
        self_consumed_kwh: Math.round(selfConsumed),
        sold_to_grid_kwh: Math.round(soldToGrid),
        avg_price: Math.round(avgPrice * 100) / 100,
        battery_cycles: Math.round(arbitrageCycles),
      },
      system: {
        battery_kwh: batteryKwh,
        panel_kwp: panelKwp,
      },
      is_live: fleet && !fleet.sites_data?.[0]?.is_mock,
      calculated_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});