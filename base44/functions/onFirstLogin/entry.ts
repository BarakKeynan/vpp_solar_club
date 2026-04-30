import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAILS = ['barak@vppsolarclub.com', 'liav@vppsolarclub.com'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin = ADMIN_EMAILS.includes(user.email);
    const correctRole = isAdmin ? 'admin' : 'client';

    // Build update payload — ensure role is correct
    const update = {};
    if (user.role !== correctRole) update.role = correctRole;

    // If admin pre-entered data under this email, it's already on the user record.
    // Just confirm the role is set and return current state.
    if (Object.keys(update).length > 0) {
      await base44.auth.updateMe(update);
    }

    return Response.json({
      success: true,
      role: correctRole,
      site_id: user.site_id || null,
      battery_capacity_kwh: user.battery_capacity_kwh || null,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});