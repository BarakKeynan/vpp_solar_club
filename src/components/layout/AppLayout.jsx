import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import WhatsAppButton from '../WhatsAppButton';
import LangToggle from '../LangToggle';
import { useLang } from '@/lib/i18n';

export default function AppLayout() {
  const { lang } = useLang();
  return (
    <div className={`min-h-screen bg-background font-heebo`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Language toggle – fixed top corner */}
      <div className={`fixed top-3 z-50 ${lang === 'he' ? 'left-3' : 'right-3'}`}>
        <LangToggle />
      </div>
      <main className="pb-20 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
      <WhatsAppButton />
    </div>
  );
}