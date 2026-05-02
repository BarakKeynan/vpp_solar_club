import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/i18n';
import { GUIDE_HE } from './guide/guideHe';
import { GUIDE_EN } from './guide/guideEn';
import NogaConnectCard from '@/components/noga/NogaConnectCard';
import SolarEdgeConnectCard from '@/components/solaredge/SolarEdgeConnectCard';
import PaymentSetupCard from '@/components/billing/PaymentSetupCard';

// ─── Sub-components ───────────────────────────────────────────────────────────

function PrereqCard({ item }) {
  return (
    <div className="rounded-2xl p-4 space-y-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{item.icon}</span>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-black text-white">{item.title}</p>
          <p className="text-xs text-white/60 leading-relaxed">{item.body}</p>
          {item.link && (
            <a href={item.link.url} target="_blank" rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-cyan-400 underline underline-offset-2 mt-1">
              🔗 {item.link.label}
            </a>
          )}
          <div className="mt-2 rounded-xl px-3 py-2"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <p className="text-[11px] text-emerald-400 leading-relaxed">💡 {item.note}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ step }) {
  return (
    <div className="rounded-2xl p-4 space-y-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${step.color}30` }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
          style={{ background: `${step.color}15`, color: step.color, border: `1px solid ${step.color}40` }}>
          {step.num}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{step.icon}</span>
            <p className="text-sm font-black text-white">{step.title}</p>
          </div>
          <p className="text-xs text-white/65 leading-relaxed">{step.desc}</p>
          {step.link && (
            <Link to={step.link.path}
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 underline underline-offset-2 mt-1">
              🔗 {step.link.label}
            </Link>
          )}
          <div className="mt-1 rounded-lg px-2.5 py-1.5"
            style={{ background: `${step.color}10`, border: `1px solid ${step.color}25` }}>
            <p className="text-[11px] font-bold" style={{ color: step.color }}>{step.why}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDF generator ────────────────────────────────────────────────────────────

async function buildPDF(g, userName) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 15;

    // Hero section
    doc.setFillColor(16, 185, 129);
    doc.rect(10, yPosition, pageWidth - 20, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('VPP Solar Club', pageWidth / 2, yPosition + 12, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`${g.welcomePrefix} ${userName} 👋`, pageWidth / 2, yPosition + 21, { align: 'center' });

    yPosition += 40;

    // Prerequisites
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.prereqTitle, 15, yPosition);
    yPosition += 8;

    g.prereqs.filter(p => !p.isNoga && !p.isSolarEdge && !p.isPayment).forEach(p => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${p.icon} ${p.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const bodyLines = doc.splitTextToSize(p.body, pageWidth - 30);
      doc.text(bodyLines, 20, yPosition);
      yPosition += bodyLines.length * 3.5 + 2;

      doc.setFontSize(8);
      doc.setTextColor(52, 211, 153);
      const noteLines = doc.splitTextToSize(`💡 ${p.note}`, pageWidth - 30);
      doc.text(noteLines, 20, yPosition);
      yPosition += noteLines.length * 3 + 3;
      doc.setTextColor(0, 0, 0);
    });

    // Steps
    yPosition += 3;
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.stepsTitle, 15, yPosition);
    yPosition += 8;

    g.steps.forEach((s, idx) => {
      if (yPosition > pageHeight - 25) {
        doc.addPage();
        yPosition = 15;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text(`${idx + 1}. ${s.icon} ${s.title}`, 15, yPosition);
      yPosition += 5;

      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const descLines = doc.splitTextToSize(s.desc, pageWidth - 30);
      doc.text(descLines, 20, yPosition);
      yPosition += descLines.length * 3.5 + 2;

      doc.setFontSize(8);
      const whyLines = doc.splitTextToSize(s.why, pageWidth - 30);
      doc.text(whyLines, 20, yPosition);
      yPosition += whyLines.length * 3 + 3;
    });

    // Tips
    yPosition += 3;
    if (yPosition > pageHeight - 35) {
      doc.addPage();
      yPosition = 15;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(g.tipsTitle, 15, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    g.tips.forEach(tip => {
      if (yPosition > pageHeight - 15) {
        doc.addPage();
        yPosition = 15;
      }
      const tipLines = doc.splitTextToSize(`✦ ${tip}`, pageWidth - 30);
      doc.text(tipLines, 20, yPosition);
      yPosition += tipLines.length * 3.5 + 2;
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('VPP Solar Club © 2026 · support@vppsolarclub.com', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Download PDF
    const filename = `VPP_Solar_Club_${g.lang === 'he' ? 'מדריך' : 'Guide'}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('PDF error:', error);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserGuide() {
  const { user } = useAuth();
  const { lang } = useLang();
  const g = lang === 'he' ? GUIDE_HE : GUIDE_EN;
  const userName = user?.full_name || (lang === 'he' ? 'משתמש יקר' : 'Valued User');

  return (
    <div className="min-h-screen pb-28 bg-background" dir={g.dir}>

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: 'hsl(222 47% 6% / 0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-sm font-black text-foreground">{g.pageTitle}</span>
          <button onClick={() => buildPDF(g, userName)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ml-2"
            style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
            <Download className="w-3.5 h-3.5" />
            {g.downloadBtn}
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-4 mt-5 mb-6 rounded-2xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.07))', border: '1px solid rgba(16,185,129,0.3)' }}>
        <p className="text-xs font-bold text-primary mb-1">{g.welcomePrefix} {userName} 👋</p>
        <h1 className="text-2xl font-black text-white">VPP Solar Club</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">{g.pdfTitle} · 2026</p>
        <p className="text-xs text-white/60 leading-relaxed mt-3">{g.appDesc}</p>
      </div>

      <div className="px-4 space-y-8">

        {/* Prerequisites */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.prereqTitle}</h2>
          <div className="space-y-3">
            {g.prereqs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                {item.isNoga ? <NogaConnectCard /> : item.isSolarEdge ? <SolarEdgeConnectCard /> : item.isPayment ? <PaymentSetupCard /> : <PrereqCard item={item} />}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.stepsTitle}</h2>
          <div className="space-y-3">
            {g.steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StepCard step={step} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section>
          <h2 className="text-base font-black text-white mb-3">{g.tipsTitle}</h2>
          <div className="rounded-2xl p-4 space-y-2"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
            {g.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 py-2 border-b border-white/5 last:border-0">
                <span className="text-primary font-black text-xs mt-0.5">✦</span>
                <p className="text-xs text-white/70 leading-relaxed">{tip}</p>
              </div>
            ))}
            {g.ecoTip && (
              <div className="flex items-start gap-2 py-2">
                <span className="text-primary font-black text-xs mt-0.5">✦</span>
                <p className="text-xs text-white/70 leading-relaxed">
                  {g.ecoTip.split('ECO Profit Mode')[0]}
                  <Link to={g.ecoTipLink} className="font-black text-primary underline underline-offset-2">ECO Profit Mode</Link>
                  {g.ecoTip.split('ECO Profit Mode')[1]}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[11px] text-muted-foreground">VPP Solar Club © 2026 · {g.rights}</p>
          <p className="text-[11px] text-primary/60 mt-1">support@vppsolarclub.com</p>
        </div>

      </div>
    </div>
  );
}