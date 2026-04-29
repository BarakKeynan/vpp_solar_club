import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const MORNING_API_KEY = Deno.env.get("MORNING_API_KEY");
const MORNING_BASE = "https://api.greeninvoice.co.il/api/v1";

// Simulate if no API key is set
const SIMULATE = !MORNING_API_KEY;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // ── GET BILLING STATUS ─────────────────────────────────────────────
    if (action === 'get_status') {
      return Response.json({
        has_billing_token: !!user.billing_token,
        billing_last4: user.billing_last4 || null,
        billing_brand: user.billing_brand || null,
      });
    }

    // ── CREATE TOKENIZATION LINK ───────────────────────────────────────
    if (action === 'create_tokenization_link') {
      if (SIMULATE) {
        // Simulation: return a fake redirect URL
        const simulatedUrl = `https://secure.greeninvoice.co.il/tokenize/demo?email=${encodeURIComponent(user.email)}&redirect=${encodeURIComponent(body.redirect_url || '')}`;
        return Response.json({
          url: simulatedUrl,
          simulated: true,
          message: 'Simulation mode — set MORNING_API_KEY to use real Morning API',
        });
      }

      // Step 1: Create or retrieve customer
      let customerId = user.morning_customer_id;

      if (!customerId) {
        const customerRes = await fetch(`${MORNING_BASE}/clients`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MORNING_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.full_name || user.email,
            emails: [{ email: user.email }],
          }),
        });
        const customer = await customerRes.json();
        customerId = customer.id;

        // Save customer ID to user profile
        await base44.auth.updateMe({ morning_customer_id: customerId });
      }

      // Step 2: Create tokenization (standing order) link
      const tokenRes = await fetch(`${MORNING_BASE}/payments/form`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MORNING_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client: { id: customerId },
          type: 'token',
          redirectUrl: body.redirect_url,
          successUrl: body.success_url,
          failureUrl: body.failure_url,
        }),
      });
      const tokenData = await tokenRes.json();

      return Response.json({ url: tokenData.url, simulated: false });
    }

    // ── SAVE TOKEN (called after redirect back from Morning) ───────────
    if (action === 'save_token') {
      const { token_id, last4, brand } = body;
      if (!token_id) return Response.json({ error: 'Missing token_id' }, { status: 400 });

      await base44.auth.updateMe({
        billing_token: token_id,
        billing_last4: last4 || '****',
        billing_brand: brand || 'Card',
      });

      return Response.json({ success: true });
    }

    // ── REMOVE TOKEN ───────────────────────────────────────────────────
    if (action === 'remove_token') {
      await base44.auth.updateMe({
        billing_token: null,
        billing_last4: null,
        billing_brand: null,
      });
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});