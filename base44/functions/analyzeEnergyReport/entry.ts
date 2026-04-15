/**
 * analyzeEnergyReport
 * Accepts an uploaded file URL (PDF/JPG/PNG) of an electricity bill or ROI report.
 * Steps:
 *   1. ExtractDataFromUploadedFile (OCR)
 *   2. InvokeLLM for structured analysis + arbitrage recommendation
 *   3. Returns coherent JSON output ready for the frontend
 */
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { file_url, report_type } = await req.json(); // report_type: 'electricity_bill' | 'roi_report'
    if (!file_url) return Response.json({ error: 'file_url is required' }, { status: 400 });

    // ── Step 1: OCR / Data Extraction ──────────────────────────────────────────
    const extractSchema = {
      type: 'object',
      properties: {
        meter_id:            { type: 'string', description: 'Electricity meter identifier' },
        billing_period:      { type: 'string', description: 'e.g. Jan 2025 - Feb 2025' },
        total_kwh:           { type: 'number', description: 'Total electricity consumption in kWh' },
        peak_kwh:            { type: 'number', description: 'Peak-hour consumption kWh' },
        off_peak_kwh:        { type: 'number', description: 'Off-peak consumption kWh' },
        tariff_per_kwh:      { type: 'number', description: 'Price per kWh in ILS' },
        total_amount_ils:    { type: 'number', description: 'Total bill amount in ILS' },
        provider:            { type: 'string', description: 'Electricity provider name' },
        system_capacity_kw:  { type: 'number', description: 'Solar system capacity in kW (ROI reports)' },
        annual_yield_kwh:    { type: 'number', description: 'Annual solar yield in kWh (ROI reports)' },
        actual_revenue_ils:  { type: 'number', description: 'Actual revenue in ILS (ROI reports)' },
        irr_percent:         { type: 'number', description: 'Internal rate of return % (ROI reports)' },
        co2_saved_kg:        { type: 'number', description: 'CO2 savings in kg (ROI reports)' },
      },
      required: ['meter_id'],
    };

    const extraction = await base44.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: extractSchema,
    });

    if (extraction.status !== 'success') {
      return Response.json({ error: 'OCR extraction failed', details: extraction.details }, { status: 422 });
    }

    const extracted = extraction.output;

    // ── Step 2: AI Analysis ────────────────────────────────────────────────────
    const isRoi = report_type === 'roi_report';

    const prompt = `
You are an expert Israeli energy & VPP (Virtual Power Plant) financial analyst.
The user uploaded their ${isRoi ? 'ROI / solar performance report' : 'electricity bill'}.

Extracted data from OCR:
${JSON.stringify(extracted, null, 2)}

Perform a comprehensive analysis and return a JSON object with:
1. "summary" (string, 2-3 sentences in Hebrew, professional tone)
2. "extracted" (cleaned/validated version of the input data, fill nulls with best estimates)
3. "benchmarks": compare against Israeli market averages:
   - average tariff: ₪0.58/kWh (residential), ₪0.62/kWh (commercial)
   - average VPP arbitrage potential: ₪0.95–₪1.20/kWh peak hours
   - average solar system yield: 1,450 kWh/kWp/year (Israel)
4. "revenue_analysis":
   - actual_revenue_ils (from extracted or calculated)
   - optimized_revenue_ils (with VPP arbitrage + battery optimization)
   - missing_roi_ils (gap)
   - missing_roi_pct (percentage)
5. "hourly_loss_profile": array of 9 objects {hour: string (e.g. "08"), loss_kwh: number}
   representing hours where arbitrage opportunities were missed
6. "recommendations": array of 3-5 actionable objects:
   {priority: "high"|"medium"|"low", title_he: string, desc_he: string, estimated_gain_ils: number}
7. "risk_flags": array of strings (any anomalies detected)
8. "compliance_notes": string (relevant IEC/Noga grid standards applicable)

Be precise, data-driven, and realistic. Base all numbers on the extracted data.
If data is missing, use Israeli market averages and mark estimates clearly.
All monetary values in ILS (₪). All energy in kWh.
`;

    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary:              { type: 'string' },
          extracted:            { type: 'object' },
          benchmarks:           { type: 'object' },
          revenue_analysis:     { type: 'object' },
          hourly_loss_profile:  { type: 'array' },
          recommendations:      { type: 'array' },
          risk_flags:           { type: 'array' },
          compliance_notes:     { type: 'string' },
        },
      },
    });

    // ── Step 3: Save audit record to DB ───────────────────────────────────────
    await base44.entities.EnergyAudit.create({
      user_email:       user.email,
      file_url,
      report_type:      report_type || 'electricity_bill',
      extracted_data:   extracted,
      analysis_result:  analysis,
      status:           'completed',
    });

    return Response.json({
      success: true,
      extracted,
      analysis,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});