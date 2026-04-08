import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OverviewTab from '@/components/pro/OverviewTab';
import { useLang } from '@/lib/i18n';

export default function ProDashboard() {
  const { lang } = useLang();
  const isHe = lang === 'he';

  return (
    <div style={{ background: '#080e1a', direction: isHe ? 'rtl' : 'ltr', minHeight: '100vh' }}>
      <main className="overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <OverviewTab isHe={isHe} />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}