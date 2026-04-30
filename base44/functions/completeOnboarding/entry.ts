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

    const body = await req.json();
    const { inverter_model, bess_brand, bess_api_key, site_id, bess_serial_number, bess_connection_method,
            virtual_bess_kwh, virtual_bess_devices, is_virtual_bess } = body;

    const token = generateMockToken(user.id, inverter_model || 'SolarEdge Smart Inverter');

    const updatePayload = {
      system_connected: true,
      inverter_model: inverter_model || 'SolarEdge Smart Inverter',
      inverter_token: token,
      onboarding_completed_at: new Date().toISOString(),
    };

    if (bess_brand)            updatePayload.bess_brand            = bess_brand;
    if (bess_api_key)          updatePayload.bess_api_key          = bess_api_key;
    if (site_id)               updatePayload.site_id               = site_id;
    if (bess_serial_number)    updatePayload.bess_serial_number    = bess_serial_number;
    if (bess_connection_method) updatePayload.bess_connection_method = bess_connection_method;
    if (is_virtual_bess)        updatePayload.is_virtual_bess        = true;
    if (virtual_bess_kwh)       updatePayload.virtual_bess_kwh       = virtual_bess_kwh;
    if (virtual_bess_devices?.length) updatePayload.virtual_bess_devices = virtual_bess_devices;

    await base44.auth.updateMe(updatePayload);

    return Response.json({ success: true, token });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});