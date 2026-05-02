import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, Loader2, AlertCircle, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/i18n';
import PaymentSetup from './PaymentSetup';

export default function PaymentSetupCard() {
  const { lang } = useLang();
  const [status, setStatus] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  const fetchStatus = async () => {
    const res = await base44.functions.invoke('ypayBilling', { action: 'get_status' });
    setStatus(res.data);
  };

  useEffect(() => { fetchStatus(); }, []);

  const isActive = status?.has_billing_token;

  return (
    <>
      <div className="rounded-2xl p-4 space-y-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>

        {/* Header */}
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">📱</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white">
                {lang === 'he' ? 'הגדרת אמצעי תשלום' : 'Set Up Payment Method'}
              </p>
              {isActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                  {lang === 'he' ? '✓ פעיל' : '✓ Active'}
                </span>
              )}
            </div>
            <p className="text-xs text-white/60 leading-relaxed mt-1">
              {lang === 'he'
                ? 'נדרש לקבלת תשלומים על אנרגיה שנמכרת לרשת. הוסיפו כרטיס אשראי בלחיצה על הכפתור.'
                : 'Required to receive payments for energy sold to the grid. Add a credit card by tapping the button.'}
            </p>
          </div>
        </div>

        {/* Status / Note */}
        {isActive ? (
          <div className="rounded-xl px-3 py-2 flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-[11px] text-emerald-400 font-bold">
                  {status.billing_brand && status.billing_last4
                    ? (lang === 'he'
                      ? `${status.billing_brand} ···${status.billing_last4} — פעיל`
                      : `${status.billing_brand} ···${status.billing_last4} — Active`)
                    : (lang === 'he' ? 'אמצעי תשלום מחובר ופעיל' : 'Payment method connected & active')}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  {lang === 'he' ? 'מוכנים לקבל תשלומים על מכירות אנרגיה' : 'Ready to receive payments for energy sales'}
                </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl px-3 py-2"
            style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <p className="text-[11px] text-violet-300 leading-relaxed flex items-start gap-1.5">
               <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
               {lang === 'he'
                 ? 'ניתן להתחיל בסימולציה ללא תשלום — אך לקבלת הכנסות אמיתיות נדרש חיבור.'
                 : 'You can start in simulation mode without payment — but real income requires a connection.'}
             </p>
          </div>
        )}

        {/* Button */}
        {status !== null && (
          <button
            onClick={() => setShowSetup(true)}
            className="w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all active:scale-95"
            style={{
              background: isActive ? 'rgba(16,185,129,0.1)' : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))',
              border: `1px solid ${isActive ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.5)'}`,
              color: isActive ? '#34d399' : '#c4b5fd',
            }}>
            <CreditCard className="w-3.5 h-3.5" />
            {isActive
              ? (lang === 'he' ? 'עדכון אמצעי תשלום' : 'Update Payment Method')
              : (lang === 'he' ? 'הוספת כרטיס אשראי' : 'Add Credit Card')}
          </button>
        )}

        {status === null && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-4 h-4 animate-spin text-white/30" />
          </div>
        )}
      </div>

      {showSetup && (
        <PaymentSetup
          onClose={() => setShowSetup(false)}
          onSuccess={() => { setShowSetup(false); fetchStatus(); }}
        />
      )}
    </>
  );
}