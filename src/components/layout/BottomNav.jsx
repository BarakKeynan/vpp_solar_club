import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, TrendingUp, User, MoreHorizontal } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLang();

  const navItems = [
    { path: '/Dashboard', label: t('nav_home') || 'בית', icon: Home },
    { path: '/Schedule', label: t('nav_schedule') || 'תזמון', icon: Clock },
    { path: '/Savings', label: t('nav_savings') || 'חיסכון', icon: TrendingUp },
    { path: '/Profile', label: t('nav_profile') || 'פרופיל', icon: User },
    { path: '/more', label: t('nav_more') || 'עוד', icon: MoreHorizontal },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: 'hsl(222 40% 8% / 0.97)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid hsl(222 30% 16% / 0.8)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.4)'
    }}>
      <div className="flex items-center justify-around px-2 py-2 pb-safe max-w-lg mx-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path || (path === '/Dashboard' && location.pathname === '/');
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all active:scale-90">
              <div className={`p-2 rounded-2xl transition-all duration-200 ${active ? 'bg-primary/15' : ''}`}
                style={active ? { boxShadow: '0 0 12px hsl(160 84% 44% / 0.2)' } : {}}>
                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}