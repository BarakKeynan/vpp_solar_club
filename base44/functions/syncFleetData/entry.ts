import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const USE_REAL_SOLAREDGE_API = false;

async function fetchSiteData(siteId, apiKey) {
  if (USE_REAL_SOLAREDGE_API) {
    const [powerRes, batteryRes] = await Promise.all([
      fetch(`https://monitoringapi.solaredge.com/site/${siteId}/currentPowerFlow?api_key=${apiKey}`),
      fetch(`https://monitoringapi.solaredge.com/site/${siteId}/storageData?api_key=${apiKey}&startTime=${new Date(Date.now() - 3600000).toISOString().slice(0,19)}&endTime=${new Date().toISOString().slice(0,19)}`)
    ]);
    const powerData = await powerRes.json();
    const batteryData = await batteryRes.json();

    const powerKw = powerData?.siteCurrentPowerFlow?.PV?.currentPower || 0;
    const soc = batteryData?.storageData?.batteries?.[0]?.telemetries?.slice(-1)?.[0]?.batteryPercentageState || 0;
    const capacityKwh = batteryData?.storageData?.batteries?.[0]?.nameplate || 10;

    return { siteId, powerKw, soc, capacityKwh, kwhAvailable: (soc / 100) * capacityKwh };
  } else {
    // Mock: generate realistic values
    const powerKw = 2 + Math.random() * 8;
    const soc = 30 + Math.random() * 60;
    const capacityKwh = 10;
    return {
      siteId,
      powerKw: Math.round(powerKw * 10) / 10,
      soc: Math.round(soc),
      capacityKwh,
      kwhAvailable: Math.round((soc / 100) * capacityKwh * 10) / 10,
      is_mock: true,
    };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // In production: fetch from a "sites" entity
    // For now use mock sites
    const mockSites = [
      { siteId: 'site-001', apiKey: 'mock-key-1' },
      { siteId: 'site-002', apiKey: 'mock-key-2' },
      { siteId: 'site-003', apiKey: 'mock-key-3' },
      { siteId: 'site-004', apiKey: 'mock-key-4' },
      { siteId: 'site-005', apiKey: 'mock-key-5' },
    ];

    const sitesData = await Promise.all(
      mockSites.map(s => fetchSiteData(s.siteId, s.apiKey))
    );

    const fleet_kwh_available = Math.round(
      sitesData.reduce((sum, s) => sum + s.kwhAvailable, 0) * 10
    ) / 10;

    const total_power_kw = Math.round(
      sitesData.reduce((sum, s) => sum + s.powerKw, 0) * 10
    ) / 10;

    const avg_soc_pct = Math.round(
      sitesData.reduce((sum, s) => sum + s.soc, 0) / sitesData.length
    );

    const record = {
      fleet_kwh_available,
      total_sites: sitesData.length,
      total_power_kw,
      avg_soc_pct,
      sites_data: sitesData,
      timestamp: new Date().toISOString(),
    };

    await base44.asServiceRole.entities.FleetStatus.create(record);

    // Keep only last 50 fleet snapshots
    const all = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 100);
    if (all.length > 50) {
      for (const old of all.slice(50)) {
        await base44.asServiceRole.entities.FleetStatus.delete(old.id);
      }
    }

    return Response.json({ success: true, fleet_kwh_available, total_power_kw, avg_soc_pct, sites: sitesData.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});