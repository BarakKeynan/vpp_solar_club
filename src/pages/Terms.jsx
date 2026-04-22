import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using the VPP Solar Club platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you may not use the platform.',
  },
  {
    title: '2. Use of Service',
    body: 'VPP Solar Club provides AI-powered energy management, trading, and monitoring services. You agree to use these services only for lawful purposes and in compliance with all relevant energy regulations in your jurisdiction.',
  },
  {
    title: '3. Energy Trading',
    body: 'Automated and manual energy trading features are provided as tools only. VPP Solar Club does not guarantee any specific financial outcome. Past performance of energy markets does not guarantee future results.',
  },
  {
    title: '4. Data & Privacy',
    body: 'We collect energy usage data, device telemetry, and account information to provide and improve our services. Your data is encrypted in transit and at rest. We do not sell personal data to third parties.',
  },
  {
    title: '5. AI Advisory',
    body: 'AI-generated recommendations are informational only and do not constitute financial or engineering advice. Users are responsible for all decisions made based on AI-generated insights.',
  },
  {
    title: '6. Account Security',
    body: 'You are responsible for maintaining the confidentiality of your account credentials. Enable two-factor authentication for enhanced security. Notify us immediately of any unauthorized access.',
  },
  {
    title: '7. Limitation of Liability',
    body: 'To the maximum extent permitted by law, VPP Solar Club is not liable for any indirect, incidental, or consequential damages arising from your use of the platform or any interruption of service.',
  },
  {
    title: '8. Changes to Terms',
    body: 'We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of material changes via email.',
  },
  {
    title: '9. Contact',
    body: 'For questions about these terms, contact us at legal@vppsolarclub.com or through the Support section of the platform.',
  },
];

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#0B1120' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style={{ background: 'rgba(11,17,32,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <span className="text-sm font-semibold text-white">Terms of Service</span>
      </div>

      {/* Body */}
      <div className="max-w-2xl mx-auto px-6 py-10 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-black text-white mb-2">Terms of Service</h1>
          <p className="text-sm mb-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Last updated: April 2026 · VPP Solar Club Ltd.
          </p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <h2 className="text-base font-bold text-white mb-2">{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="mt-12 p-5 rounded-2xl text-center"
            style={{ background: 'rgba(255,140,0,0.06)', border: '1px solid rgba(255,140,0,0.15)' }}
          >
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © 2026 VPP Solar Club Ltd. · All rights reserved.
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,140,0,0.5)' }}>
              GDPR Compliant · ISO 27001 · Energy Sector Regulated
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}