/**
 * getAuditHistory
 * Returns the current user's past energy audit records.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const audits = await base44.entities.EnergyAudit.filter(
      { user_email: user.email },
      '-created_date',
      20
    );

    return Response.json({ audits });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});