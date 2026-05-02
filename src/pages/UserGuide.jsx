import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
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
    const response = await base44.functions.invoke('generateUserGuidePDF', { lang: g.lang });
    const { pdf, filename } = response.data;
    
    if (!pdf) throw new Error('PDF data not received');
    
    const binaryString = atob(pdf);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'VPP-Solar-Club-Guide.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF download error:', error);
    alert('שגיאה בהורדת PDF - נסה שוב');
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