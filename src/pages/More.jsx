import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plug, Wrench, Store, TrendingUp, Shield, Users, LayoutDashboard, FileText } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function More() {
  const { t } = useLang();

  const items = [
    {
      path: '/pro-dashboard',
      icon: LayoutDashboard,
      emoji: '🖥️',
      title: t('more_pro_dashboard_title'),
      subtitle: t('more_pro_dashboard_sub'),
      color: 'border-violet-400/30 bg-violet-400/5',
      accent: 'text-violet-400',
    },
    {
      path: '/monthly-report',
      icon: FileText,
      emoji: '📊',
      title: t('more_monthly_report_title'),
      subtitle: t('more_monthly_report_sub'),
      color: 'border-emerald-400/30 bg-emerald-400/5',
      accent: 'text-emerald-400',
    },
    {
      path: '/vpp-club-dashboard',
      icon: LayoutDashboard,
      emoji: '⚡',
      title: t('more_vpp_club_title'),
      subtitle: t('more_vpp_club_sub'),
      color: 'border-primary/30 bg-primary/5',
      accent: 'text-primary',
    },
    {
      path: '/referral',
      icon: Users,
      emoji: '🤝',
      title: t('more_referral_title'),
      subtitle: t('more_referral_sub'),
      color: 'border-yellow-400/30 bg-yellow-400/5',
      accent: 'text-yellow-400',
    },
    {
      path: '/compliance',
      icon: Shield,
      emoji: '🛡️',
      title: t('more_compliance_title'),
      subtitle: t('more_compliance_sub'),
      color: 'border-secondary/30 bg-secondary/5',
      accent: 'text-secondary',
    },
    {
      path: '/financial',
      icon: TrendingUp,
      emoji: '📈',
      title: t('more_financial_title'),
      subtitle: t('more_financial_sub'),
      color: 'border-primary/30 bg-primary/5',
      accent: 'text-primary',
    },
    {
      path: '/providers',
      icon: Plug,
      emoji: '⚡',
      title: t('more_providers_title'),
      subtitle: t('more_providers_sub'),
      color: 'border-primary/30 bg-primary/5',
      accent: 'text-primary',
    },
    {
      path: '/smart-care',
      icon: Wrench,
      emoji: '🔧',
      title: t('more_smartcare_title'),
      subtitle: t('more_smartcare_sub'),
      color: 'border-accent/30 bg-accent/5',
      accent: 'text-accent',
    },
    {
      path: '/marketplace',
      icon: Store,
      emoji: '☀️',
      title: t('more_marketplace_title'),
      subtitle: t('more_marketplace_sub'),
      color: 'border-secondary/30 bg-secondary/5',
      accent: 'text-secondary',
    },
  ];

  return (
    <div className="p-4 space-y-4 pb-28">
      <motion.h1 initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl font-black text-foreground">
        {t('more_title')}
      </motion.h1>

      {items.map((item, i) => (
        <motion.div key={item.path} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
          <Link to={item.path}
            className={`flex items-center gap-4 p-5 rounded-2xl border ${item.color} block active:scale-[0.98] transition-transform`}>
            <div className="text-4xl">{item.emoji}</div>
            <div className="flex-1">
              <p className={`text-base font-black ${item.accent}`}>{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
            </div>
            <div className="text-muted-foreground text-lg">›</div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}