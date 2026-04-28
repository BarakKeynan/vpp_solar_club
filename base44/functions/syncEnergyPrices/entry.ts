import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Toggle: false = mock prices, true = real Noga API
const USE_REAL_NOGA_API = false;

function generateMockPrice(hour) {
  // Base price: 0.45–0.65 NIS/kWh
  let base = 0.45 + Math.random() * 0.20;
  // Evening peak 17:00–21:00 → spike up to 0.85
  if (hour >= 17 && hour <= 21) {
    base = 0.68 + Math.random() * 0.17;
  }
  // Morning shoulder 07:00–10:00 → slight bump
  if (hour >= 7 && hour <= 10) {
    base = 0.55 + Math.random() * 0.12;
  }
  return Math.round(base * 1000) / 1000;
}

async function fetchRealNogaPrice() {
  // TODO: Implement Noga OAuth2 flow
  // const tokenRes = await fetch('https://noga-iso.co.il/oauth/token', { ... });
  // const { access_token } = await tokenRes.json();
  // const priceRes = await fetch('https://noga-iso.co.il/api/prices/current', {
  //   headers: { Authorization: `Bearer ${access_token}` }
  // });
  // const data = await priceRes.json();
  // return data.price;
  throw new Error('Real Noga API not yet configured');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const now = new Date();
    const hour = now.getHours();

    let price;
    let is_mock;

    if (USE_REAL_NOGA_API) {
      price = await fetchRealNogaPrice();
      is_mock = false;
    } else {
      price = generateMockPrice(hour);
      is_mock = true;
    }

    const record = {
      price,
      timestamp: now.toISOString(),
      hour,
      is_mock,
    };

    await base44.asServiceRole.entities.NogaPrice.create(record);

    // Cleanup: keep only last 24 hours of data (96 records at 15min intervals)
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const old = await base44.asServiceRole.entities.NogaPrice.filter({
      timestamp: { $lt: cutoff }
    });
    for (const rec of old) {
      await base44.asServiceRole.entities.NogaPrice.delete(rec.id);
    }

    return Response.json({ success: true, price, is_mock, timestamp: record.timestamp });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});