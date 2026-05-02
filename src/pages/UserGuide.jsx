import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLang } from '@/lib/i18n';
import { GUIDE_HE } from './guide/guideHe';
import { GUIDE_EN } from './guide/guideEn';
import NogaConnectCard from '@/components/noga/NogaConnectCard';

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

function buildPDF(g, userName) {
  const win = window.open('', '_blank');
  win.document.write(`
    <!DOCTYPE html>
    <html dir="${g.dir}" lang="${g.lang}">
    <head>
      <meta charset="UTF-8"/>
      <title>VPP Solar Club — ${g.pdfTitle}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Heebo', sans-serif; background: #0b1320; color: #e2e8f0;
               direction: ${g.dir}; padding: 32px; font-size: 13px; line-height: 1.6; }
        h1 { font-size: 28px; font-weight: 900; color: #10b981; margin-bottom: 4px; }
        h2 { font-size: 17px; font-weight: 900; color: #fff; margin: 28px 0 14px; }
        .hero { background: linear-gradient(135deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08));
                border: 1px solid rgba(16,185,129,0.3); border-radius: 16px; padding: 24px; margin-bottom: 32px; }
        .hero-sub { color: #94a3b8; font-size: 12px; margin-top: 4px; }
        .hero-desc { color: #cbd5e1; font-size: 13px; margin-top: 12px; line-height: 1.7; }
        .hero-welcome { font-size: 13px; color: #10b981; font-weight: 700; margin-bottom: 4px; }
        .card { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04);
                border-radius: 14px; padding: 14px; margin-bottom: 12px; break-inside: avoid; }
        .card-row { display: flex; gap: 12px; align-items: flex-start; }
        .step-num { display: inline-flex; align-items: center; justify-content: center;
                    width: 36px; height: 36px; border-radius: 10px; font-weight: 900; font-size: 13px; flex-shrink: 0; }
        .note-box { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 8px; padding: 6px 10px; margin-top: 6px; font-size: 11px; color: #34d399; }
        .why-box { border-radius: 8px; padding: 6px 10px; margin-top: 6px; font-size: 11px; font-weight: 700; }
        .link { color: #22d3ee; font-size: 11px; font-weight: 700; text-decoration: underline; display: block; margin-top: 4px; }
        .tips li { padding: 8px 12px; background: rgba(255,255,255,0.03);
                   border: 1px solid rgba(255,255,255,0.08); border-radius: 10px;
                   margin-bottom: 6px; font-size: 12px; color: #cbd5e1; list-style: none; }
        .tips li::before { content: "✦ "; color: #10b981; font-weight: 900; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);
                  text-align: center; font-size: 11px; color: #475569; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
    </head>
    <body>
      <div class="hero">
        <p class="hero-welcome">${g.welcomePrefix} ${userName} 👋</p>
        <h1>VPP Solar Club</h1>
        <p class="hero-sub">${g.pdfTitle} · 2026</p>
        <p class="hero-desc">${g.appDesc}</p>
      </div>

      <h2>${g.prereqTitle}</h2>
      ${g.prereqs.map(p => `
        <div class="card">
          <div class="card-row">
            <span style="font-size:22px;flex-shrink:0">${p.icon}</span>
            <div>
              <strong style="color:#fff;font-size:13px">${p.title}</strong>
              <p style="color:rgba(255,255,255,0.6);font-size:12px;margin-top:4px">${p.body}</p>
              ${p.link ? `<a class="link" href="${p.link.url}">${p.link.label}</a>` : ''}
              <div class="note-box">💡 ${p.note}</div>
            </div>
          </div>
        </div>`).join('')}

      <h2>${g.stepsTitle}</h2>
      ${g.steps.map(s => `
        <div class="card" style="border-color:${s.color}30">
          <div class="card-row">
            <div class="step-num" style="background:${s.color}18;color:${s.color};border:1px solid ${s.color}40">${s.num}</div>
            <div>
              <strong style="color:#fff;font-size:13px">${s.icon} ${s.title}</strong>
              <p style="color:rgba(255,255,255,0.65);font-size:12px;margin-top:4px">${s.desc}</p>
              <div class="why-box" style="background:${s.color}10;border:1px solid ${s.color}25;color:${s.color}">${s.why}</div>
            </div>
          </div>
        </div>`).join('')}

      <h2>${g.tipsTitle}</h2>
      <ul class="tips">
        ${g.tips.map(tip => `<li>${tip}</li>`).join('')}
      </ul>

      <div class="footer">
        VPP Solar Club © 2026 · ${g.rights} · support@vppsolarclub.com
      </div>
    </body>
    </html>
  `);
  win.document.close();
  setTimeout(() => { win.focus(); win.print(); }, 600);
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
        </div>
        <button onClick={() => buildPDF(g, userName)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95"
          style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}>
          <Download className="w-3.5 h-3.5" />
          {g.downloadBtn}
        </button>
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
                {item.isNoga ? <NogaConnectCard /> : <PrereqCard item={item} />}
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