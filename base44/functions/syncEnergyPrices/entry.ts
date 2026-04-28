import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

function generateMockPrice(hour) {
  let base = 0.45 + Math.random() * 0.20;
  if (hour >= 17 && hour <= 21) base = 0.68 + Math.random() * 0.17;
  if (hour >= 7 && hour <= 10) base = 0.55 + Math.random() * 0.12;
  return Math.round(base * 1000) / 1000;
}

async function fetchRealNogaPrice(clientId, clientSecret, apiUrl) {
  const baseUrl = apiUrl || 'https://noga-iso.co.il';

  // Step 1: Get OAuth2 token
  const tokenRes = await fetch(`${baseUrl}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Noga token error: ${tokenRes.status}`);
  const { access_token } = await tokenRes.json();

  // Step 2: Fetch current price
  const priceRes = await fetch(`${baseUrl}/api/prices/current`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!priceRes.ok) throw new Error(`Noga price error: ${priceRes.status}`);
  const data = await priceRes.json();
  return data.price;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    const hour = now.getHours();

    // Load config from AppConfig entity
    const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'vpp_settings' });
    const cfg = configs[0] || {};
    const liveMode = cfg.live_mode === true;

    let price;
    let is_mock;

    if (liveMode && cfg.noga_client_id && cfg.noga_client_secret) {
      price = await fetchRealNogaPrice(cfg.noga_client_id, cfg.noga_client_secret, cfg.noga_api_url);
      is_mock = false;
    } else {
      price = generateMockPrice(hour);
      is_mock = true;
    }

    const record = { price, timestamp: now.toISOString(), hour, is_mock };
    await base44.asServiceRole.entities.NogaPrice.create(record);

    // Cleanup: keep only last 24 hours
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const old = await base44.asServiceRole.entities.NogaPrice.filter({ timestamp: { $lt: cutoff } });
    for (const rec of old) {
      await base44.asServiceRole.entities.NogaPrice.delete(rec.id);
    }

    return Response.json({ success: true, price, is_mock, live_mode: liveMode, timestamp: record.timestamp });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});