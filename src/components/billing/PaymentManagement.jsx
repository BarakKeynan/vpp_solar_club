import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Trash2, RefreshCw, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PaymentSetup from './PaymentSetup';

export default function PaymentManagement() {
  const [status, setStatus] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const fetchStatus = async () => {
    const res = await base44.functions.invoke('morningBilling', { action: 'get_status' });
    setStatus(res.data);
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleRemove = async () => {
    if (!window.confirm('Remove linked payment method?')) return;
    setRemoving(true);
    await base44.functions.invoke('morningBilling', { action: 'remove_token' });
    await fetchStatus();
    setRemoving(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex items-center gap-2 p-4 pb-2">
        <CreditCard className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold text-muted-foreground">Payment Management</p>
      </div>

      {status === null ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      ) : status.has_billing_token ? (
        <div className="px-4 pb-4 space-y-3">
          {/* Active card row */}
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.12)' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-emerald-400">Active ⚡️</p>
              <p className="text-[11px] text-white/40">
                {status.billing_brand || 'Card'} ···{status.billing_last4 || '****'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowSetup(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-foreground border border-border hover:border-primary/40 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Update Card
            </button>
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors disabled:opacity-50"
            >
              {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-muted-foreground">No payment method linked. Link a card to enable battery profit optimization.</p>
          <button
            onClick={() => setShowSetup(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black text-white active:scale-95 transition-all"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
          >
            <CreditCard className="w-4 h-4" /> Link Payment Method
          </button>
        </div>
      )}

      <AnimatePresence>
        {showSetup && (
          <PaymentSetup
            onClose={() => setShowSetup(false)}
            onSuccess={() => { setShowSetup(false); fetchStatus(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}