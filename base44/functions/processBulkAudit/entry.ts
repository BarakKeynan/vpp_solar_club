import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { job_id } = await req.json();
  if (!job_id) return Response.json({ error: 'Missing job_id' }, { status: 400 });

  // Get job
  const jobs = await base44.asServiceRole.entities.BulkAuditJob.filter({ id: job_id });
  const job = jobs[0];
  if (!job) return Response.json({ error: 'Job not found' }, { status: 404 });

  // Mark as processing
  await base44.asServiceRole.entities.BulkAuditJob.update(job_id, { status: 'processing' });

  try {
    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are an expert Israeli energy analyst. Analyze this ${job.report_type === 'roi_report' ? 'ROI report' : 'electricity bill'} document and extract key financial data.

Return a JSON with this exact structure:
{
  "summary": "2-3 sentence summary in Hebrew",
  "extracted": {
    "billing_period": "string or null",
    "total_kwh": number or null,
    "total_amount_ils": number or null,
    "tariff_per_kwh": number or null,
    "provider": "string or null",
    "meter_id": "string or null"
  },
  "revenue_analysis": {
    "actual_revenue_ils": number,
    "optimized_revenue_ils": number,
    "missing_roi_ils": number,
    "missing_roi_pct": number
  },
  "recommendations": [
    { "title_he": "string", "priority": "high|medium|low", "estimated_gain_ils": number }
  ]
}`,
      file_urls: [job.file_url],
      response_json_schema: {
        type: "object",
        properties: {
          summary: { type: "string" },
          extracted: { type: "object" },
          revenue_analysis: { type: "object" },
          recommendations: { type: "array", items: { type: "object" } }
        }
      }
    });

    await base44.asServiceRole.entities.BulkAuditJob.update(job_id, {
      status: 'completed',
      analysis_result: result
    });

    return Response.json({ success: true, result });
  } catch (err) {
    await base44.asServiceRole.entities.BulkAuditJob.update(job_id, {
      status: 'failed',
      error_msg: err.message
    });
    return Response.json({ error: err.message }, { status: 500 });
  }
});