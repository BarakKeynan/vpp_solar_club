import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = Date.now();
    const records = [];

    // Generate 96 records (24h at 15min intervals)
    for (let i = 95; i >= 0; i--) {
      const ts = new Date(now - i * 15 * 60 * 1000);
      const hour = ts.getHours();
      let base = 0.45 + Math.random() * 0.18;
      if (hour >= 17 && hour <= 21) base = 0.68 + Math.random() * 0.17;
      if (hour >= 7 && hour <= 10) base = 0.55 + Math.random() * 0.12;
      const price = Math.round(base * 1000) / 1000;
      records.push({ price, timestamp: ts.toISOString(), hour, is_mock: true });
    }

    for (const r of records) {
      await base44.asServiceRole.entities.NogaPrice.create(r);
    }

    return Response.json({ success: true, seeded: records.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});