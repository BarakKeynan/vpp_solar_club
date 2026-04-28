import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Simulate OAuth token generation
function generateMockToken(userId, inverterModel) {
  const payload = btoa(JSON.stringify({ userId, inverterModel, iat: Date.now() }));
  const sig = btoa(`sig-${userId}-${Date.now()}`).slice(0, 16);
  return `vpp_${payload}.${sig}`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { inverter_model } = await req.json();

    const token = generateMockToken(user.id, inverter_model || 'SolarEdge Smart Inverter');

    await base44.auth.updateMe({
      system_connected: true,
      inverter_model: inverter_model || 'SolarEdge Smart Inverter',
      inverter_token: token,
      onboarding_completed_at: new Date().toISOString(),
    });

    return Response.json({ success: true, token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});