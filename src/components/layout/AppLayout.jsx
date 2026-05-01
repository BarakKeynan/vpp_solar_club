import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import WhatsAppButton from '../WhatsAppButton';
import LangToggle from '../LangToggle';
import AIAssistant from '../AIAssistant';
import ProfileMenu from './ProfileMenu';
import AccessibilityWidget from '../AccessibilityWidget';
import { useLang } from '@/lib/i18n';

export default function AppLayout() {
  const { lang } = useLang();
  return (
    <div className={`min-h-screen bg-background font-heebo`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* Top bar: LangToggle on one side, ProfileMenu on the other */}
      <div className="fixed top-3 left-3 z-50">
        <LangToggle />
      </div>
      <div className="fixed top-3 right-3 z-50">
        <ProfileMenu />
      </div>
      <main className="pb-20 max-w-lg mx-auto">
        <Outlet />
      </main>
      <BottomNav />
      <AIAssistant />
      <AccessibilityWidget />
      <WhatsAppButton />
    </div>
  );
}