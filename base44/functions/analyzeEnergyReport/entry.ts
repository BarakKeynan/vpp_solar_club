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

    let body;
    try { body = await req.json(); } catch { return Response.json({ error: 'Invalid JSON body' }, { status: 400 }); }
    const { file_url, report_type } = body || {};
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
Detect the user profile from the document: private_residential | kibbutz_community | solar_farm | investor

Produce a COMPREHENSIVE financial analysis using Israeli market benchmarks (2025):
- Residential tariff avg: ₪0.58/kWh  |  Commercial: ₪0.62/kWh  |  Kibbutz/community: ₪0.54/kWh
- VPP arbitrage peak price (18:00–21:00): ₪0.95–₪1.20/kWh
- Solar system avg yield: 1,450 kWh/kWp/year (Israel)
- Battery round-trip efficiency: 92%
- Noga provider switch time: ~60 days
- Solar farm typical IRR: 8–12%  |  Payback period: 6–9 years

Return EXACTLY this JSON (use null for fields not found, use Israeli market estimates for analysis fields):
{
  "summary": "3-4 sentences in Hebrew describing the financial situation, profile type, and biggest opportunity",
  "user_profile": "private_residential" | "kibbutz_community" | "solar_farm" | "investor",
  "analysis_period": {
    "detected_period": string (e.g. "ינואר–מרץ 2025" or "חודש אחד"),
    "period_type": "monthly" | "quarterly" | "annual" | "unknown",
    "months_count": number (1, 3, 12, etc.),
    "annualized_cost_ils": number (extrapolated annual cost),
    "annualized_revenue_ils": number (extrapolated annual revenue)
  },
  "extracted": {
    "meter_id": null or string,
    "billing_period": null or string,
    "total_kwh": number,
    "peak_kwh": number,
    "off_peak_kwh": number,
    "tariff_per_kwh": number,
    "total_amount_ils": number,
    "provider": null or string,
    "system_capacity_kw": null or number,
    "annual_yield_kwh": null or number,
    "actual_revenue_ils": null or number,
    "irr_percent": null or number,
    "co2_saved_kg": null or number,
    "num_consumers": null or number,
    "contract_end_date": null or string,
    "demand_charge_ils": null or number,
    "reactive_power_charge_ils": null or number
  },
  "revenue_analysis": {
    "actual_revenue_ils": number,
    "optimized_revenue_ils": number,
    "missing_roi_ils": number,
    "missing_roi_pct": number,
    "monthly_avg_ils": number,
    "quarterly_projection_ils": number,
    "annual_projection_ils": number
  },
  "profile_insights": {
    "title_he": string,
    "insights_he": [string] (3-5 specific insights relevant to this user profile),
    "main_opportunity_he": string,
    "benchmark_comparison_he": string (how they compare to similar users in Israel)
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
  "monthly_trend": [
    {"month": string, "kwh": number, "ils": number}
  ],
  "recommendations": [
    {"priority": "high",   "title_he": string, "desc_he": string, "estimated_gain_ils": number, "timeline_he": string},
    {"priority": "medium", "title_he": string, "desc_he": string, "estimated_gain_ils": number, "timeline_he": string},
    {"priority": "low",    "title_he": string, "desc_he": string, "estimated_gain_ils": number, "timeline_he": string}
  ],
  "risk_flags": [string],
  "compliance_notes": string,
  "roi_summary": {
    "payback_years": null or number,
    "irr_percent": null or number,
    "npv_ils": null or number,
    "co2_saved_annual_kg": null or number
  }
}
`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt,
      file_urls: [file_url],
      response_json_schema: {
        type: 'object',
        properties: {
          summary:             { type: 'string' },
          user_profile:        { type: 'string' },
          analysis_period:     { type: 'object' },
          extracted:           { type: 'object' },
          revenue_analysis:    { type: 'object' },
          profile_insights:    { type: 'object' },
          hourly_loss_profile: { type: 'array'  },
          monthly_trend:       { type: 'array'  },
          recommendations:     { type: 'array'  },
          risk_flags:          { type: 'array'  },
          compliance_notes:    { type: 'string' },
          roi_summary:         { type: 'object' },
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