import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { FileText, Download, ChevronDown, Zap, TrendingUp, DollarSign, Leaf } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const REPORT_DATA = {
  0:  { production: 210, sold: 62,  selfUse: 148, savings: 1290, income: 380, co2: 108 },
  1:  { production: 235, sold: 71,  selfUse: 164, savings: 1440, income: 430, co2: 121 },
  2:  { production: 310, sold: 98,  selfUse: 212, savings: 1900, income: 590, co2: 160 },
  3:  { production: 390, sold: 128, selfUse: 262, savings: 2380, income: 770, co2: 201 },
  4:  { production: 450, sold: 155, selfUse: 295, savings: 2740, income: 935, co2: 232 },
  5:  { production: 510, sold: 182, selfUse: 328, savings: 3100, income: 1095, co2: 263 },
  6:  { production: 530, sold: 190, selfUse: 340, savings: 3220, income: 1145, co2: 273 },
  7:  { production: 520, sold: 186, selfUse: 334, savings: 3160, income: 1120, co2: 268 },
  8:  { production: 420, sold: 138, selfUse: 282, savings: 2560, income: 830, co2: 217 },
  9:  { production: 320, sold: 100, selfUse: 220, savings: 1950, income: 600, co2: 165 },
  10: { production: 240, sold: 72,  selfUse: 168, savings: 1465, income: 435, co2: 124 },
  11: { production: 195, sold: 58,  selfUse: 137, savings: 1190, income: 350, co2: 101 },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="font-bold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {Number(p.value).toLocaleString()}</p>
      ))}
    </div>
  );
};

export default function MonthlyReport() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [exporting, setExporting] = useState(false);
  const reportRef = useRef(null);

  const months = isHe ? MONTHS_HE : MONTHS_EN;
  const data = REPORT_DATA[selectedMonth];

  // Build 12-month chart data
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    name: isHe ? MONTHS_HE[i].slice(0, 3) : MONTHS_EN[i].slice(0, 3),
    [isHe ? 'ייצור' : 'Production']: REPORT_DATA[i].production,
    [isHe ? 'מכירה לרשת' : 'Grid Sales']: REPORT_DATA[i].sold,
    [isHe ? 'צריכה עצמית' : 'Self Use']: REPORT_DATA[i].selfUse,
  }));

  const incomeData = Array.from({ length: 12 }, (_, i) => ({
    name: isHe ? MONTHS_HE[i].slice(0, 3) : MONTHS_EN[i].slice(0, 3),
    [isHe ? 'חיסכון' : 'Savings']: REPORT_DATA[i].savings,
    [isHe ? 'הכנסה' : 'Income']: REPORT_DATA[i].income,
  }));

  const totalProduction = Object.values(REPORT_DATA).reduce((s, d) => s + d.production, 0);
  const totalSold = Object.values(REPORT_DATA).reduce((s, d) => s + d.sold, 0);
  const totalSavings = Object.values(REPORT_DATA).reduce((s, d) => s + d.savings, 0);
  const totalCO2 = Object.values(REPORT_DATA).reduce((s, d) => s + d.co2, 0);

  const exportPDF = async () => {
    setExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { backgroundColor: '#0b1120', scale: 1.5 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let y = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();
      while (y < imgHeight) {
        pdf.addImage(imgData, 'PNG', 0, -y, pageWidth, imgHeight);
        y += pageHeight;
        if (y < imgHeight) pdf.addPage();
      }
      pdf.save(`solar-report-${months[selectedMonth]}.pdf`);
    } finally {
      setExporting(false);
    }
  };

  const exportExcel = () => {
    const rows = [
      [isHe ? 'חודש' : 'Month', isHe ? 'ייצור (kWh)' : 'Production (kWh)', isHe ? 'מכירה לרשת (kWh)' : 'Grid Sales (kWh)', isHe ? 'צריכה עצמית (kWh)' : 'Self Use (kWh)', isHe ? 'חיסכון (₪)' : 'Savings (₪)', isHe ? 'הכנסה (₪)' : 'Income (₪)', isHe ? 'CO₂ (kg)' : 'CO₂ (kg)'],
      ...Array.from({ length: 12 }, (_, i) => [
        months[i],
        REPORT_DATA[i].production,
        REPORT_DATA[i].sold,
        REPORT_DATA[i].selfUse,
        REPORT_DATA[i].savings,
        REPORT_DATA[i].income,
        REPORT_DATA[i].co2,
      ]),
      [],
      [isHe ? 'סך הכל' : 'Total', totalProduction, totalSold, totalProduction - totalSold, totalSavings, Object.values(REPORT_DATA).reduce((s, d) => s + d.income, 0), totalCO2],
    ];

    const csv = rows.map(r => r.join(',')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solar-report-2025.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summaryCards = [
    { label: isHe ? 'ייצור שנתי' : 'Annual Production', value: `${totalProduction.toLocaleString()} kWh`, icon: Zap, color: 'text-primary', bg: 'border-primary/30 bg-primary/5' },
    { label: isHe ? 'מכירה לרשת' : 'Total Grid Sales', value: `${totalSold.toLocaleString()} kWh`, icon: TrendingUp, color: 'text-secondary', bg: 'border-secondary/30 bg-secondary/5' },
    { label: isHe ? 'חיסכון שנתי' : 'Annual Savings', value: `${totalSavings.toLocaleString()} ₪`, icon: DollarSign, color: 'text-accent', bg: 'border-accent/30 bg-accent/5' },
    { label: isHe ? 'CO₂ שנסוך' : 'CO₂ Avoided', value: `${(totalCO2 / 1000).toFixed(1)} טון`, icon: Leaf, color: 'text-emerald-400', bg: 'border-emerald-400/30 bg-emerald-400/5' },
  ];

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-black text-foreground">
            {isHe ? 'דו"ח ביצועים חודשי' : 'Monthly Performance Report'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={exportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold active:scale-95 transition-all">
            <Download className="w-3.5 h-3.5" />
            Excel
          </button>
          <button onClick={exportPDF} disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/15 border border-primary/30 text-primary text-xs font-bold active:scale-95 transition-all disabled:opacity-60">
            <Download className="w-3.5 h-3.5" />
            {exporting ? (isHe ? 'מייצא...' : 'Exporting...') : 'PDF'}
          </button>
        </div>
      </motion.div>

      {/* Month Selector */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="relative">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(Number(e.target.value))}
          className="w-full bg-card border border-border rounded-2xl px-4 py-3 text-sm font-bold text-foreground focus:outline-none focus:border-primary appearance-none"
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m} 2025</option>
          ))}
        </select>
        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      </motion.div>

      {/* Selected Month Summary */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
        className="grid grid-cols-2 gap-3">
        {[
          { label: isHe ? 'ייצור חודשי' : 'Monthly Production', value: `${data.production} kWh`, color: 'text-primary' },
          { label: isHe ? 'מכירה לרשת' : 'Grid Sales', value: `${data.sold} kWh`, color: 'text-secondary' },
          { label: isHe ? 'צריכה עצמית' : 'Self Consumption', value: `${data.selfUse} kWh`, color: 'text-accent' },
          { label: isHe ? 'חיסכון + הכנסה' : 'Savings + Income', value: `${(data.savings + data.income).toLocaleString()} ₪`, color: 'text-primary' },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Printable area */}
      <div ref={reportRef} className="space-y-5">

        {/* Annual Summary Cards */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3">
          {summaryCards.map((card, i) => (
            <div key={i} className={`rounded-2xl border p-3 ${card.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <card.icon className={`w-4 h-4 ${card.color}`} />
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
              <p className={`text-lg font-black ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Production vs Grid Sales Chart */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">
            {isHe ? 'ייצור לעומת מכירה לרשת (kWh)' : 'Production vs Grid Sales (kWh)'}
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey={isHe ? 'ייצור' : 'Production'} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey={isHe ? 'מכירה לרשת' : 'Grid Sales'} fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey={isHe ? 'צריכה עצמית' : 'Self Use'} fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Financial Performance Area Chart */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">
            {isHe ? 'ביצועים פיננסיים (₪)' : 'Financial Performance (₪)'}
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={incomeData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Area type="monotone" dataKey={isHe ? 'חיסכון' : 'Savings'} stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#savingsGrad)" />
              <Area type="monotone" dataKey={isHe ? 'הכנסה' : 'Income'} stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#incomeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Detailed Monthly Table */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-bold text-foreground mb-3">
            {isHe ? 'טבלת נתונים שנתית' : 'Annual Data Table'}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-2 pr-2 text-muted-foreground font-semibold">{isHe ? 'חודש' : 'Month'}</th>
                  <th className="text-center py-2 text-primary font-semibold">{isHe ? 'ייצור' : 'Prod.'}</th>
                  <th className="text-center py-2 text-secondary font-semibold">{isHe ? 'מכירה' : 'Sold'}</th>
                  <th className="text-center py-2 text-accent font-semibold">{isHe ? 'חיסכון' : 'Savings'}</th>
                  <th className="text-center py-2 text-emerald-400 font-semibold">CO₂</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, i) => {
                  const d = REPORT_DATA[i];
                  const isSelected = i === selectedMonth;
                  return (
                    <tr key={i} onClick={() => setSelectedMonth(i)}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}>
                      <td className={`py-2 pr-2 font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {months[i].slice(0, isHe ? 4 : 3)}
                      </td>
                      <td className="text-center py-2 text-foreground">{d.production}</td>
                      <td className="text-center py-2 text-foreground">{d.sold}</td>
                      <td className="text-center py-2 text-foreground">{d.savings.toLocaleString()} ₪</td>
                      <td className="text-center py-2 text-foreground">{d.co2} kg</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-primary/30">
                  <td className="py-2 pr-2 font-black text-foreground">{isHe ? 'סך הכל' : 'Total'}</td>
                  <td className="text-center py-2 font-black text-primary">{totalProduction.toLocaleString()}</td>
                  <td className="text-center py-2 font-black text-secondary">{totalSold.toLocaleString()}</td>
                  <td className="text-center py-2 font-black text-accent">{totalSavings.toLocaleString()} ₪</td>
                  <td className="text-center py-2 font-black text-emerald-400">{(totalCO2 / 1000).toFixed(1)}t</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}