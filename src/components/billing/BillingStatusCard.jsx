import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import PaymentSetup from './PaymentSetup';

export default function BillingStatusCard() {
  const { t } = useLang();
  const [status, setStatus] = useState(null); // null = loading
  const [showSetup, setShowSetup] = useState(false);

  const fetchStatus = async () => {
    const res = await base44.functions.invoke('ypayBilling', { action: 'get_status' });
    setStatus(res.data);
  };

  useEffect(() => { fetchStatus(); }, []);

  if (status === null) return null; // still loading, don't show anything

  if (status.has_billing_token) {
    // ── Active badge ──────────────────────────────────────────────────
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(16,185,129,0.25)' }}
      >
        <div className="px-4 py-2.5 flex items-center gap-2"
          style={{ background: 'rgba(16,185,129,0.07)' }}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <p className="text-[11px] font-black text-emerald-400 flex-1">{t('billing_active_label')}</p>
          {status.billing_last4 && (
            <span className="text-[10px] text-white/30 flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              {status.billing_brand} ···{status.billing_last4}
            </span>
          )}
        </div>
        <div className="px-4 py-1.5 flex items-center gap-1.5"
          style={{ background: 'rgba(139,92,246,0.06)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
          <Zap className="w-3 h-3 text-violet-400 flex-shrink-0" />
          <p className="text-[10px] text-violet-400/80 font-bold">{t('billing_active_status')}</p>
        </div>
      </motion.div>
    );
  }

  // ── Action Card — no billing token ───────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(139,92,246,0.4)' }}
      >
        {/* Welcome Banner */}
        <div className="px-4 py-3 text-right"
          style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(99,102,241,0.1))' }}>
          <p className="text-[11px] font-black text-violet-300 leading-relaxed">
            {t('billing_welcome')}
          </p>
        </div>
        {/* CTA Row */}
        <div className="px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: 'rgba(8,16,36,0.6)' }}>
          <button
            onClick={() => setShowSetup(true)}
            className="flex-shrink-0 text-[11px] font-black px-3 py-2.5 rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.4), rgba(99,102,241,0.3))', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.5)' }}
          >
            <CreditCard className="w-3 h-3" /> {t('billing_activate_btn')}
          </button>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
            <p className="text-[10px] text-white/30">{t('billing_inactive')}</p>
          </div>
        </div>
      </motion.div>

      {showSetup && (
        <PaymentSetup
          onClose={() => setShowSetup(false)}
          onSuccess={() => { setShowSetup(false); fetchStatus(); }}
        />
      )}
    </>
  );
}