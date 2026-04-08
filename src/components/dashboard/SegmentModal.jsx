import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Phone, Mail, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

export default function SegmentModal({ segmentKey, onClose }) {
  const { t, lang } = useLang();
  const [step, setStep] = useState('info'); // 'info' | 'register' | 'contact' | 'done'
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });

  const isHe = lang === 'he';

  const SEGMENTS = {
    renters: {
      emoji: '🏠',
      titleKey: 'solar_club_segment_renters',
      tagKey: 'solar_club_seg_desc_renters',
      headline: isHe ? 'חסכו עד ₪1,200 בשנה — גם בלי לרכוש פנלים!' : 'Save up to ₪1,200/year — no panels needed!',
      sub: isHe ? 'מודל PPA וירטואלי — מעבר ספק ללא חומרה, חיסכון מיידי של 10% בחשבון החשמל.' : 'Virtual PPA model — switch provider with no hardware. Immediate 10% savings on your bill.',
      perks: isHe
        ? ['⚡ אנרגיה ירוקה מהחווה שלנו', '📉 הפחתה ישירה בחשבון', '🔌 ללא התקנה, ללא ציוד', '✅ מתאים לכל שוכר']
        : ['⚡ Green energy from our farm', '📉 Direct bill reduction', '🔌 No installation needed', '✅ Works for any tenant'],
      ctaRegister: isHe ? 'הרשמה מהירה — תתחיל לחסוך!' : 'Quick Register — Start Saving!',
      ctaContact: isHe ? 'השאר פרטים ונחזור אליך' : 'Leave details & we\'ll call you',
    },
    apartment: {
      emoji: '🏢',
      titleKey: 'solar_club_segment_apartment',
      tagKey: 'solar_club_seg_desc_apartment',
      headline: isHe ? 'כל הבניין חוסך יחד — עד ₪500 לדירה בחודש!' : 'The whole building saves together — up to ₪500/apartment/month!',
      sub: isHe ? 'ניהול מונה משותף וצבירת אנרגיה קבוצתית. כל הדיירים נהנים יחד.' : 'Shared meter management and group energy accumulation. All residents benefit together.',
      perks: isHe
        ? ['🏢 פתרון לכל הבניין', '💡 אנרגיה חכמה ומנוהלת', '🤝 חיסכון קבוצתי', '📊 דו"ח חודשי לוועד הבית']
        : ['🏢 Full building solution', '💡 Smart managed energy', '🤝 Group savings', '📊 Monthly HOA report'],
      ctaRegister: null,
      ctaContact: isHe ? 'צרו קשר עם ועד הבית' : 'Contact via Building Committee',
    },
    families: {
      emoji: '👨‍👩‍👧',
      titleKey: 'solar_club_segment_families',
      tagKey: 'solar_club_seg_desc_families',
      headline: isHe ? 'הפכו את הבית למפיק אנרגיה — הרוויחו כל חודש!' : 'Turn your home into an energy producer — earn every month!',
      sub: isHe ? 'אופטימיזציה לסוללות ביתיות ומכירה בשעות שיא. מקסם את הרווח היומי שלך.' : 'Home battery optimization and peak-hour selling. Maximize your daily profit.',
      perks: isHe
        ? ['🔋 ניהול סוללה חכם', '📈 מכירה לרשת בשעות שיא', '🌿 פחות פחמן, יותר רווח', '👨‍👩‍👧 מושלם למשפחות']
        : ['🔋 Smart battery management', '📈 Grid selling at peak hours', '🌿 Less carbon, more profit', '👨‍👩‍👧 Perfect for families'],
      ctaRegister: isHe ? 'הרשמה — תתחילו להרוויח!' : 'Register — Start Earning!',
      ctaContact: isHe ? 'נשמח לדבר איתכם' : 'We\'d love to talk with you',
    },
    cities: {
      emoji: '🌆',
      titleKey: 'solar_club_segment_cities',
      tagKey: 'solar_club_seg_desc_cities',
      headline: isHe ? 'חברו לרשת VPP הלאומית — אנרגיה בקנה מידה עירוני!' : 'Join the national VPP grid — city-scale energy!',
      sub: isHe ? 'חיבור לרשת האנרגיה הלאומית וניהול עומסים חכם. השתתף ברשת ה-VPP הארצית.' : 'Connect to the national energy grid with smart load management. Join the national VPP network.',
      perks: isHe
        ? ['🌆 פתרון עירוני מקיף', '🔗 חיבור לרשת הלאומית', '📡 ניהול עומסים חכם', '🏆 השפיעו על כל העיר']
        : ['🌆 Comprehensive city solution', '🔗 National grid connection', '📡 Smart load management', '🏆 Impact your entire city'],
      ctaRegister: isHe ? 'הרשמה לתוכנית עירונית' : 'Register for City Program',
      ctaContact: isHe ? 'דברו עם המומחים שלנו' : 'Talk to our experts',
    },
  };

  const seg = SEGMENTS[segmentKey];
  if (!seg) return null;

  const handleRegister = () => {
    if (!form.name || !form.phone) { toast.error(isHe ? 'נא למלא שם וטלפון' : 'Please fill name and phone'); return; }
    setStep('done');
    toast.success(isHe ? '🎉 נרשמת בהצלחה! ניצור קשר בקרוב.' : '🎉 Registered! We\'ll contact you soon.');
  };

  const handleContact = () => {
    if (!form.phone && !form.email) { toast.error(isHe ? 'נא למלא טלפון או אימייל' : 'Please fill phone or email'); return; }
    setStep('done');
    toast.success(isHe ? '✅ קיבלנו את פרטיך, נחזור אליך!' : '✅ Got your details, we\'ll be in touch!');
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-blue-400";
  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' };

  return (
    <AnimatePresence>
      {segmentKey && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.75)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-full max-w-lg rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            style={{ background: '#0D1420', border: '1px solid rgba(59,130,246,0.2)', borderBottom: 'none' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center -mt-2 mb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step !== 'info' && (
                  <button onClick={() => setStep('info')} className="p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <ArrowLeft className="w-4 h-4 text-white/60" />
                  </button>
                )}
                <span className="text-3xl">{seg.emoji}</span>
                <div>
                  <p className="text-base font-black text-white">{t(seg.titleKey)}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.2)', color: '#93C5FD' }}>
                    {t(seg.tagKey)}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Step: Info */}
            {step === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Copywriting headline */}
                <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <p className="text-lg font-black text-white leading-snug">{seg.headline}</p>
                  <p className="text-sm text-white/65 mt-1 leading-relaxed">{seg.sub}</p>
                </div>

                {/* Perks */}
                <div className="space-y-2">
                  {seg.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span className="text-sm">{p}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="space-y-2 pt-1">
                  {seg.ctaRegister && (
                    <button onClick={() => setStep('register')}
                      className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                      style={{ background: 'linear-gradient(135deg,#10B981,#3B82F6)', boxShadow: '0 0 18px rgba(16,185,129,0.3)' }}>
                      {seg.ctaRegister}
                    </button>
                  )}
                  <button onClick={() => setStep('contact')}
                    className="w-full py-3.5 rounded-2xl font-black text-sm transition-all active:scale-95"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    {seg.ctaContact}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step: Register */}
            {step === 'register' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                <p className="text-sm font-bold text-white/80">{isHe ? 'פרטי הרשמה' : 'Registration Details'}</p>
                <input placeholder={isHe ? 'שם מלא *' : 'Full Name *'} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <input placeholder={isHe ? 'טלפון *' : 'Phone *'} value={form.phone} type="tel"
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <input placeholder={isHe ? 'אימייל (אופציונלי)' : 'Email (optional)'} value={form.email} type="email"
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <input placeholder={isHe ? 'כתובת (אופציונלי)' : 'Address (optional)'} value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <button onClick={handleRegister}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#10B981,#3B82F6)', boxShadow: '0 0 18px rgba(16,185,129,0.3)' }}>
                  {isHe ? '🚀 שלח הרשמה' : '🚀 Submit Registration'}
                </button>
              </motion.div>
            )}

            {/* Step: Contact */}
            {step === 'contact' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                <p className="text-sm font-bold text-white/80">{isHe ? 'השאר פרטים — ניצור קשר' : 'Leave details — we\'ll reach out'}</p>
                <input placeholder={isHe ? 'שם (אופציונלי)' : 'Name (optional)'} value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <input placeholder={isHe ? 'טלפון' : 'Phone'} value={form.phone} type="tel"
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <input placeholder={isHe ? 'אימייל' : 'Email'} value={form.email} type="email"
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className={inputClass} style={inputStyle} />
                <button onClick={handleContact}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-white transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', boxShadow: '0 0 18px rgba(59,130,246,0.35)' }}>
                  {isHe ? '✉️ שלח פרטים' : '✉️ Send Details'}
                </button>
              </motion.div>
            )}

            {/* Step: Done */}
            {step === 'done' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-3">
                <div className="text-5xl">🎉</div>
                <p className="text-xl font-black text-white">{isHe ? 'תודה!' : 'Thank you!'}</p>
                <p className="text-sm text-white/60">{isHe ? 'קיבלנו את פרטיך ונחזור אליך בהקדם.' : 'We received your details and will be in touch soon.'}</p>
                <button onClick={onClose}
                  className="mt-4 px-8 py-3 rounded-2xl font-black text-sm text-white"
                  style={{ background: 'rgba(255,255,255,0.1)' }}>
                  {isHe ? 'סגור' : 'Close'}
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}