/**
 * uploadAndAnalyze
 * Accepts multipart/form-data with a file + report_type.
 * Uploads to storage, then calls analyzeEnergyReport internally.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');
    const report_type = formData.get('report_type') || 'electricity_bill';

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

    // Validate type
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      return Response.json({ error: 'Unsupported file type. Use PDF, JPG or PNG.' }, { status: 415 });
    }

    // Upload file
    const { file_url } = await base44.integrations.Core.UploadFile({ file });

    // Delegate to analyzeEnergyReport
    const result = await base44.functions.invoke('analyzeEnergyReport', { file_url, report_type });

    return Response.json(result.data || result);

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});