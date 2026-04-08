import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '@/lib/i18n';

export default function TenantsInfo() {
  const navigate = useNavigate();
  const { t } = useLang();

  const withoutList = ['tenants_without_1', 'tenants_without_2', 'tenants_without_3', 'tenants_without_4'];
  const withList = ['tenants_with_1', 'tenants_with_2', 'tenants_with_3', 'tenants_with_4'];

  const blocks = [
    { icon: '🏢', labelKey: 'tenants_b1', descKey: 'tenants_b1_desc' },
    { icon: '🏠', labelKey: 'tenants_b2', descKey: 'tenants_b2_desc' },
    { icon: '🏙️', labelKey: 'tenants_b3', descKey: 'tenants_b3_desc' },
    { icon: '👨‍👩‍👧', labelKey: 'tenants_b4', descKey: 'tenants_b4_desc' },
  ];

  const faqs = [
    { qKey: 'tenants_faq_q1', aKey: 'tenants_faq_a1' },
    { qKey: 'tenants_faq_q2', aKey: 'tenants_faq_a2' },
    { qKey: 'tenants_faq_q3', aKey: 'tenants_faq_a3' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-black text-foreground">{t('tenants_info_title')}</h1>
      </div>

      <div className="flex-1 p-5 space-y-5 pb-16 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary/30 to-card rounded-3xl border border-secondary/40 p-6 text-center space-y-3">
          <div className="flex justify-center gap-3">
            <div className="p-3 rounded-2xl bg-secondary/20"><Building2 className="w-8 h-8 text-secondary" /></div>
            <div className="p-3 rounded-2xl bg-primary/20"><Home className="w-8 h-8 text-primary" /></div>
          </div>
          <h2 className="text-2xl font-black text-foreground">{t('tenants_info_hero_title')}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('tenants_info_hero_sub').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-x-reverse divide-border">
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-bold text-muted-foreground">{t('tenants_without_title')}</p>
              {withoutList.map(k => (
                <div key={k} className="flex items-center gap-2 justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-xs text-muted-foreground">{t(k)}</span>
                </div>
              ))}
            </div>
            <div className="p-4 text-center space-y-2">
              <p className="text-xs font-bold text-primary">{t('tenants_with_title')}</p>
              {withList.map(k => (
                <div key={k} className="flex items-center gap-2 justify-center">
                  <CheckCircle2 className="w-3 h-3 text-primary" />
                  <span className="text-xs text-foreground font-medium">{t(k)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <p className="text-sm font-black text-foreground mb-3">{t('tenants_for_title')}</p>
          <div className="grid grid-cols-2 gap-3">
            {blocks.map(b => (
              <div key={b.labelKey} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{b.icon}</span>
                <div>
                  <p className="text-xs font-bold text-foreground">{t(b.labelKey)}</p>
                  <p className="text-[10px] text-muted-foreground">{t(b.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <p className="text-sm font-black text-foreground">{t('tenants_faq_title')}</p>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border p-4">
              <p className="text-sm font-bold text-foreground mb-1">{t(faq.qKey)}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
            </div>
          ))}
        </motion.div>

        <button onClick={() => navigate(-1)}
          className="w-full py-4 bg-secondary text-secondary-foreground font-black text-base rounded-2xl hover:bg-secondary/90 active:scale-95 transition-all">
          {t('tenants_cta')}
        </button>
      </div>
    </div>
  );
}