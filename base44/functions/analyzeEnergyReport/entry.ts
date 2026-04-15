/**
 * analyzeEnergyReport
 * 1. ExtractDataFromUploadedFile (OCR) — no hard required fields
 * 2. InvokeLLM — structured analysis + arbitrage recommendations
 * 3. Persist EnergyAudit record (even on partial failure)
 * 4. Return coherent JSON to frontend
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

    // Create a pending audit record first so we can update it on failure too
    const audit = await base44.entities.EnergyAudit.create({
      user_email: user.email,
      file_url,
      report_type: report_type || 'electricity_bill',
      status: 'processing',
    });
    auditId = audit.id;

    // ── Step 1: OCR ────────────────────────────────────────────────────────────
    const extractSchema = {
      type: 'object',
      properties: {
        meter_id:           { type: 'string',  description: 'Electricity meter identifier. Use null if not found.' },
        billing_period:     { type: 'string',  description: 'e.g. Jan 2025 – Feb 2025. Use null if not found.' },
        total_kwh:          { type: 'number',  description: 'Total electricity consumption in kWh' },
        peak_kwh:           { type: 'number',  description: 'Peak-hour consumption kWh' },
        off_peak_kwh:       { type: 'number',  description: 'Off-peak consumption kWh' },
        tariff_per_kwh:     { type: 'number',  description: 'Price per kWh in ILS' },
        total_amount_ils:   { type: 'number',  description: 'Total bill amount in ILS' },
        provider:           { type: 'string',  description: 'Electricity provider name' },
        system_capacity_kw: { type: 'number',  description: 'Solar system capacity kW (ROI only)' },
        annual_yield_kwh:   { type: 'number',  description: 'Annual solar yield kWh (ROI only)' },
        actual_revenue_ils: { type: 'number',  description: 'Actual revenue ILS (ROI only)' },
        irr_percent:        { type: 'number',  description: 'IRR % (ROI only)' },
        co2_saved_kg:       { type: 'number',  description: 'CO2 savings kg (ROI only)' },
      },
      // No required — OCR may miss fields; AI will fill gaps
    };

    const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: extractSchema,
    });

    if (extraction.status !== 'success') {
      await base44.entities.EnergyAudit.update(auditId, { status: 'failed' });
      return Response.json({ error: 'OCR extraction failed', details: extraction.details }, { status: 422 });
    }

    const ocrRaw = extraction.output || {};

    // ── Step 2: AI Analysis ────────────────────────────────────────────────────
    const prompt = `
You are an expert Israeli energy & VPP (Virtual Power Plant) financial analyst.
The user uploaded their ${isRoi ? 'ROI / solar performance report' : 'electricity bill'}.

Raw OCR-extracted data (may have nulls — fill gaps with Israeli market averages):
${JSON.stringify(ocrRaw, null, 2)}

Israeli market reference data (2025):
- Residential tariff: ₪0.58/kWh avg; Commercial: ₪0.62/kWh
- VPP arbitrage peak price: ₪0.95–₪1.20/kWh (18:00–21:00)
- Solar system avg yield: 1,450 kWh/kWp/year
- Battery round-trip efficiency: 92%
- Noga provider switch: ~60 days

Return a JSON with EXACTLY these keys:
{
  "summary": "2-3 sentences in Hebrew summarizing the financial situation and biggest opportunity",
  "extracted": {
    "meter_id": string or null,
    "billing_period": string or null,
    "total_kwh": number,
    "peak_kwh": number,
    "off_peak_kwh": number,
    "tariff_per_kwh": number,
    "total_amount_ils": number,
    "provider": string or null,
    "system_capacity_kw": number or null,
    "annual_yield_kwh": number or null,
    "actual_revenue_ils": number or null,
    "irr_percent": number or null,
    "co2_saved_kg": number or null
  },
  "revenue_analysis": {
    "actual_revenue_ils": number,
    "optimized_revenue_ils": number,
    "missing_roi_ils": number,
    "missing_roi_pct": number
  },
  "hourly_loss_profile": [
    { "hour": "06", "loss_kwh": number },
    { "hour": "07", "loss_kwh": number },
    { "hour": "08", "loss_kwh": number },
    { "hour": "09", "loss_kwh": number },
    { "hour": "10", "loss_kwh": number },
    { "hour": "17", "loss_kwh": number },
    { "hour": "18", "loss_kwh": number },
    { "hour": "19", "loss_kwh": number },
    { "hour": "20", "loss_kwh": number }
  ],
  "recommendations": [
    { "priority": "high", "title_he": string, "desc_he": string, "estimated_gain_ils": number },
    { "priority": "medium", "title_he": string, "desc_he": string, "estimated_gain_ils": number },
    { "priority": "low", "title_he": string, "desc_he": string, "estimated_gain_ils": number }
  ],
  "risk_flags": [string],
  "compliance_notes": string
}

All monetary values in ILS. All energy in kWh. Be data-driven and realistic.
`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt,
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

    // ── Step 3: Update audit record ────────────────────────────────────────────
    await base44.entities.EnergyAudit.update(auditId, {
      extracted_data:  ocrRaw,
      analysis_result: analysis,
      status:          'completed',
    });

    return Response.json({
      success:  true,
      audit_id: auditId,
      // Use AI-cleaned extracted (fills gaps) not raw OCR
      extracted: analysis.extracted || ocrRaw,
      analysis,
    });

  } catch (error) {
    // Best-effort: mark record as failed
    if (auditId) {
      try {
        const base44b = createClientFromRequest(req);
        await base44b.asServiceRole.entities.EnergyAudit.update(auditId, { status: 'failed' });
      } catch (_) { /* ignore */ }
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
});