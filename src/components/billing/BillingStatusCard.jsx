import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PaymentSetup from './PaymentSetup';

export default function BillingStatusCard() {
  const [status, setStatus] = useState(null); // null = loading
  const [showSetup, setShowSetup] = useState(false);

  const fetchStatus = async () => {
    const res = await base44.functions.invoke('morningBilling', { action: 'get_status' });
    setStatus(res.data);
  };

  useEffect(() => { fetchStatus(); }, []);

  if (status === null) return null; // still loading, don't show anything

  if (status.has_billing_token) {
    // ── Active badge ──────────────────────────────────────────────────
    return (
      <motion.div
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl px-4 py-2.5 flex items-center gap-2"
        style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)' }}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <p className="text-[11px] font-black text-emerald-400 flex-1">System Status: Active ⚡️</p>
        {status.billing_last4 && (
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            {status.billing_brand} ···{status.billing_last4}
          </span>
        )}
      </motion.div>
    );
  }

  // ── Action Card — no billing token ───────────────────────────────────
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.35)' }}
      >
        <div className="p-2 rounded-xl flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)' }}>
          <AlertCircle className="w-4 h-4 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-red-400">Optimization Inactive</p>
          <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">
            Link a payment method to enable full battery profit ⚡️
          </p>
        </div>
        <button
          onClick={() => setShowSetup(true)}
          className="flex-shrink-0 text-[11px] font-black px-3 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1"
          style={{ background: 'rgba(239,68,68,0.18)', color: '#f87171', border: '1px solid rgba(239,68,68,0.4)' }}
        >
          <CreditCard className="w-3 h-3" /> Link Card
        </button>
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