import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const YPAY_API_KEY = Deno.env.get("YPAY_API_KEY");
const YPAY_BASE = "https://api.ypay.co.il/v1";

// Simulate if no API key is set
const SIMULATE = !YPAY_API_KEY;

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
      // Admin-only for critical billing operations
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
      if (SIMULATE) {
        // Simulation: return a fake redirect URL
        const simulatedUrl = `https://checkout.ypay.co.il/tokenize/demo?email=${encodeURIComponent(user.email)}&redirect=${encodeURIComponent(body.redirect_url || '')}`;
        return Response.json({
          url: simulatedUrl,
          simulated: true,
          message: 'Simulation mode — set YPAY_API_KEY to use real yPay API',
        });
      }

      // Step 1: Create or retrieve customer via yPay API
      let customerId = user.ypay_customer_id;

      if (!customerId) {
        const customerRes = await fetch(`${YPAY_BASE}/customers`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${YPAY_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.full_name || user.email,
            email: user.email,
          }),
        });
        const customer = await customerRes.json();
        customerId = customer.id;

        // Save customer ID to user profile
        await base44.auth.updateMe({ ypay_customer_id: customerId });
      }

      // Step 2: Create tokenization link
      const tokenRes = await fetch(`${YPAY_BASE}/tokenization/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${YPAY_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          success_url: body.success_url,
          failure_url: body.failure_url,
          cancel_url: body.cancel_url,
        }),
      });
      const tokenData = await tokenRes.json();

      return Response.json({ url: tokenData.url, simulated: false });
    }

    // ── SAVE TOKEN (called after redirect back from yPay) ───────────
    if (action === 'save_token') {
      // Admin-only - prevents unauthorized token modifications
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
      const { token_id, last4, brand } = body;
      if (!token_id) return Response.json({ error: 'Missing token_id' }, { status: 400 });

      // Billing starts 180 days from now (launch benefit period)
      const billingStartDate = new Date();
      billingStartDate.setDate(billingStartDate.getDate() + 180);

      await base44.auth.updateMe({
        billing_token: token_id,
        billing_last4: last4 || '****',
        billing_brand: brand || 'Card',
        billing_start_date: billingStartDate.toISOString(),
      });

      return Response.json({ success: true, billing_start_date: billingStartDate.toISOString() });
    }

    // ── REMOVE TOKEN ───────────────────────────────────────────────────
    if (action === 'remove_token') {
      // Admin-only for billing modifications
      if (user.role !== 'admin') {
        return Response.json({ error: 'Admin access required' }, { status: 403 });
      }
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