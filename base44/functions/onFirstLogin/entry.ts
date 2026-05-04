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

    const isNewUser = !user.welcome_email_sent;

    if (Object.keys(update).length > 0 || isNewUser) {
      if (isNewUser) update.welcome_email_sent = true;
      await base44.auth.updateMe(update);
    }

    // Send welcome email only on first login
    if (isNewUser && user.email) {
      const firstName = (user.full_name || '').split(' ')[0] || 'משתמש יקר';
      await base44.asServiceRole.functions.invoke('sendWelcomeEmail', {
        data: { email: user.email, full_name: user.full_name || '' }
      }).catch(e => console.error('Welcome email failed:', e.message));
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