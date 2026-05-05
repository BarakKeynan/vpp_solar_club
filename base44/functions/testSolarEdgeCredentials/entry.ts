import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { api_key, site_id } = await req.json();
    if (!api_key || !site_id) {
      return Response.json({ error: 'api_key and site_id are required' }, { status: 400 });
    }

    const testRes = await fetch(
      `https://monitoringapi.solaredge.com/site/${site_id}/details?api_key=${api_key}`
    );

    if (testRes.status === 403 || testRes.status === 401) {
      return Response.json({ success: false, error: 'invalid_api_key' }, { status: 200 });
    }
    if (testRes.status === 404) {
      return Response.json({ success: false, error: 'site_not_found' }, { status: 200 });
    }
    if (!testRes.ok) {
      return Response.json({ success: false, error: `server_error_${testRes.status}` }, { status: 200 });
    }

    const data = await testRes.json();
    const siteName = data?.details?.name || site_id;

    return Response.json({ success: true, site_name: siteName });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});