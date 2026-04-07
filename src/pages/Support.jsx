import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, ChevronDown, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

export default function Support() {
  const { t } = useLang();
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ subject: '', message: '' });

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) { toast.error(t('contact_error')); return; }
    toast.success(t('contact_sent'));
    setForm({ subject: '', message: '' });
  };

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {t('support_title')}
      </motion.h1>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => toast.success(t('lang') === 'en' ? 'Connecting to call...' : 'מעביר לשיחה...')}
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors">
          <div className="p-2 rounded-xl bg-primary/20">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{t('support_call')}</p>
            <p className="text-xs text-muted-foreground">{t('support_call_hours')}</p>
          </div>
        </button>
        <button onClick={() => toast.success(t('lang') === 'en' ? 'Opening live chat...' : "פותח צ'אט חי...")}
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl hover:border-secondary/50 transition-colors">
          <div className="p-2 rounded-xl bg-secondary/20">
            <MessageCircle className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-foreground">{t('support_chat')}</p>
            <p className="text-xs text-muted-foreground">{t('support_chat_hours')}</p>
          </div>
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <p className="text-xs font-medium text-muted-foreground p-4 pb-2">{t('faq_title')}</p>
        {faqs.map((faq, i) => (
          <div key={i} className="border-t border-border">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full p-4 flex items-center justify-between text-right"
            >
              <span className="text-sm font-semibold text-foreground">{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 mr-2 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4 space-y-3">
        <p className="text-xs font-medium text-muted-foreground">{t('contact_title')}</p>
        <input
          placeholder={t('contact_subject')}
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
        />
        <textarea
          placeholder={t('contact_message')}
          rows={3}
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
          className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
        />
        <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-95 transition-all">
          <Send className="w-4 h-4" />
          {t('contact_send')}
        </button>
      </form>
    </div>
  );
}