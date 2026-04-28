import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function fetchSiteDataLive(siteId, apiKey) {
  const [powerRes, batteryRes] = await Promise.all([
    fetch(`https://monitoringapi.solaredge.com/site/${siteId}/currentPowerFlow?api_key=${apiKey}`),
    fetch(`https://monitoringapi.solaredge.com/site/${siteId}/storageData?api_key=${apiKey}&startTime=${new Date(Date.now() - 3600000).toISOString().slice(0,19)}&endTime=${new Date().toISOString().slice(0,19)}`)
  ]);
  const powerData = await powerRes.json();
  const batteryData = await batteryRes.json();
  const powerKw = powerData?.siteCurrentPowerFlow?.PV?.currentPower || 0;
  const soc = batteryData?.storageData?.batteries?.[0]?.telemetries?.slice(-1)?.[0]?.batteryPercentageState || 0;
  const capacityKwh = batteryData?.storageData?.batteries?.[0]?.nameplate || 10;
  return { siteId, powerKw, soc, capacityKwh, kwhAvailable: (soc / 100) * capacityKwh, is_mock: false };
}

function mockSiteData(siteId) {
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

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Load config
    const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'vpp_settings' });
    const cfg = configs[0] || {};
    const liveMode = cfg.live_mode === true;

    let sitesData;
    if (liveMode && cfg.solaredge_api_key && cfg.solaredge_site_ids) {
      const siteIds = cfg.solaredge_site_ids.split(',').map(s => s.trim()).filter(Boolean);
      sitesData = await Promise.all(siteIds.map(id => fetchSiteDataLive(id, cfg.solaredge_api_key)));
    } else {
      const mockIds = ['site-001', 'site-002', 'site-003', 'site-004', 'site-005'];
      sitesData = mockIds.map(id => mockSiteData(id));
    }

    const fleet_kwh_available = Math.round(sitesData.reduce((sum, s) => sum + s.kwhAvailable, 0) * 10) / 10;
    const total_power_kw = Math.round(sitesData.reduce((sum, s) => sum + s.powerKw, 0) * 10) / 10;
    const avg_soc_pct = Math.round(sitesData.reduce((sum, s) => sum + s.soc, 0) / sitesData.length);

    const record = {
      fleet_kwh_available,
      total_sites: sitesData.length,
      total_power_kw,
      avg_soc_pct,
      sites_data: sitesData,
      timestamp: new Date().toISOString(),
    };

    await base44.asServiceRole.entities.FleetStatus.create(record);

    // Keep only last 50 snapshots
    const all = await base44.asServiceRole.entities.FleetStatus.list('-created_date', 100);
    if (all.length > 50) {
      for (const old of all.slice(50)) {
        await base44.asServiceRole.entities.FleetStatus.delete(old.id);
      }
    }

    return Response.json({ success: true, fleet_kwh_available, total_power_kw, avg_soc_pct, sites: sitesData.length, live_mode: liveMode });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});