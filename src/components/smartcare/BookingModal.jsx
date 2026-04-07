import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Calendar, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import { SERVICES } from './SensorData';
import { useLang } from '@/lib/i18n';

const SLOTS = ['08:00–10:00', '10:00–12:00', '13:00–15:00', '15:00–17:00'];
const DATES = ['מחר, ד׳ 6 באפריל', 'חמישי, 7 באפריל', 'ראשון, 10 באפריל'];

export default function BookingModal({ serviceId, onClose }) {
  const { t } = useLang();
  const [step, setStep] = useState(1); // 1=choose, 2=schedule, 3=confirm
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState('');

  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) return null;

  const handleConfirm = () => {
    setStep(3);
    toast.success(`${service.title} הוזמן ל-${selectedDate} · ${selectedSlot}`);
  };

  return (
    <AnimatePresence>
      {serviceId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.78)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-3xl p-5 space-y-4"
            style={{ background: '#0D1420', border: '1px solid rgba(59,130,246,0.2)', borderBottom: 'none', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center -mt-1 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <p className="text-sm font-black text-white">{service.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{service.rating} ({service.reviews} {t('ratings')})</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>· {service.time}</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Price */}
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{service.desc}</p>
              <p className="text-lg font-black text-white shrink-0 mr-3">{service.price}</p>
            </div>

            {step === 3 ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-3 py-6"
              >
                <div className="p-4 rounded-full" style={{ background: 'rgba(16,185,129,0.15)' }}>
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-base font-black text-white">{t('booking_confirmed')}</p>
                <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {selectedDate} · {selectedSlot}<br />{t('booking_followup')}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
                  style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)' }}
                >
                  {t('close')}
                </button>
              </motion.div>
            ) : (
              <>
                {/* Date selection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4" style={{ color: '#3B82F6' }} />
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('booking_date')}</p>
                  </div>
                  <div className="space-y-2">
                    {DATES.map(d => (
                      <button
                        key={d}
                        onClick={() => setSelectedDate(d)}
                        className="w-full text-right px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                        style={{
                          background: selectedDate === d ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedDate === d ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: selectedDate === d ? '#93C5FD' : 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slot */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" style={{ color: '#F59E0B' }} />
                    <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>{t('booking_time')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SLOTS.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className="py-2.5 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: selectedSlot === slot ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${selectedSlot === slot ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.08)'}`,
                          color: selectedSlot === slot ? '#FCD34D' : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder={t('booking_note')}
                    rows={2}
                    className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none resize-none"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  />
                </div>

                <button
                  onClick={handleConfirm}
                  disabled={!selectedDate || !selectedSlot}
                  className="w-full py-4 rounded-2xl font-black text-sm text-white transition-all active:scale-95 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                >
                  {t('booking_confirm')}
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}