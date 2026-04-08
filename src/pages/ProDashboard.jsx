import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProSidebar from '@/components/pro/ProSidebar';
import OverviewTab from '@/components/pro/OverviewTab';
import AssetsTab from '@/components/pro/AssetsTab';
import CommunityTab from '@/components/pro/CommunityTab';
import ProSettingsTab from '@/components/pro/ProSettingsTab';
import { useLang } from '@/lib/i18n';

export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { lang } = useLang();
  const isHe = lang === 'he';

  const tabs = {
    overview: <OverviewTab isHe={isHe} />,
    assets: <AssetsTab isHe={isHe} />,
    community: <CommunityTab isHe={isHe} />,
    settings: <ProSettingsTab isHe={isHe} />,
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#080e1a', direction: isHe ? 'rtl' : 'ltr' }}>
      <ProSidebar activeTab={activeTab} setActiveTab={setActiveTab} isHe={isHe} />
      <main className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tabs[activeTab]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}