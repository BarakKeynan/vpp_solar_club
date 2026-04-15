/**
 * analyzeEnergyReport
 * Uses InvokeLLM with vision (file_urls) to read the document directly —
 * avoids the ExtractDataFromUploadedFile required-fields SDK bug.
 * Then runs a second LLM pass for financial analysis.
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  let auditId = null;

  try {
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { file_url, report_type } = await req.json();
    if (!file_url) return Response.json({ error: 'file_url is required' }, { status: 400 });

    const isRoi = report_type === 'roi_report';

    // Create pending audit record
    const audit = await base44.entities.EnergyAudit.create({
      user_email: user.email,
      file_url,
      report_type: report_type || 'electricity_bill',
      status: 'processing',
    });
    auditId = audit.id;

    // ── Single-pass: vision LLM reads the document AND produces analysis ─────
    const prompt = `
You are an expert Israeli energy & VPP (Virtual Power Plant) financial analyst.
The user uploaded their ${isRoi ? 'ROI / solar performance report' : 'electricity bill'}.

Look at the document image/PDF carefully and extract ALL available data from it.

Then produce a comprehensive financial analysis using these Israeli market benchmarks (2025):
- Residential tariff avg: ₪0.58/kWh  |  Commercial: ₪0.62/kWh
- VPP arbitrage peak price (18:00–21:00): ₪0.95–₪1.20/kWh
- Solar system avg yield: 1,450 kWh/kWp/year (Israel)
- Battery round-trip efficiency: 92%
- Noga provider switch time: ~60 days

Return EXACTLY this JSON structure (use null for fields not found in document, use Israeli market estimates for analysis fields):
{
  "summary": "2-3 sentences in Hebrew describing the financial situation and biggest opportunity",
  "extracted": {
    "meter_id": null or string,
    "billing_period": null or string,
    "total_kwh": number (estimate if not found),
    "peak_kwh": number (estimate if not found),
    "off_peak_kwh": number (estimate if not found),
    "tariff_per_kwh": number (estimate if not found),
    "total_amount_ils": number (estimate if not found),
    "provider": null or string,
    "system_capacity_kw": null or number,
    "annual_yield_kwh": null or number,
    "actual_revenue_ils": null or number,
    "irr_percent": null or number,
    "co2_saved_kg": null or number
  },
  "revenue_analysis": {
    "actual_revenue_ils": number,
    "optimized_revenue_ils": number,
    "missing_roi_ils": number,
    "missing_roi_pct": number
  },
  "hourly_loss_profile": [
    {"hour": "06", "loss_kwh": number},
    {"hour": "08", "loss_kwh": number},
    {"hour": "10", "loss_kwh": number},
    {"hour": "12", "loss_kwh": number},
    {"hour": "14", "loss_kwh": number},
    {"hour": "17", "loss_kwh": number},
    {"hour": "18", "loss_kwh": number},
    {"hour": "19", "loss_kwh": number},
    {"hour": "20", "loss_kwh": number}
  ],
  "recommendations": [
    {"priority": "high",   "title_he": string, "desc_he": string, "estimated_gain_ils": number},
    {"priority": "medium", "title_he": string, "desc_he": string, "estimated_gain_ils": number},
    {"priority": "low",    "title_he": string, "desc_he": string, "estimated_gain_ils": number}
  ],
  "risk_flags": [string],
  "compliance_notes": string
}
`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [file_url],
      response_json_schema: {
        type: 'object',
        properties: {
          summary:             { type: 'string' },
          extracted:           { type: 'object' },
          revenue_analysis:    { type: 'object' },
          hourly_loss_profile: { type: 'array'  },
          recommendations:     { type: 'array'  },
          risk_flags:          { type: 'array'  },
          compliance_notes:    { type: 'string' },
        },
      },
    });

    // Update audit as completed
    await base44.entities.EnergyAudit.update(auditId, {
      extracted_data:  analysis.extracted || {},
      analysis_result: analysis,
      status:          'completed',
    });

    return Response.json({
      success:   true,
      audit_id:  auditId,
      extracted: analysis.extracted || {},
      analysis,
    });

  } catch (error) {
    if (auditId) {
      try {
        await base44.asServiceRole.entities.EnergyAudit.update(auditId, { status: 'failed' });
      } catch (_) { /* ignore */ }
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});