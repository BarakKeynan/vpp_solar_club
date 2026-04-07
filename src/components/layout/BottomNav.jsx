import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, User, Clock, LayoutGrid } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLang();

  const navItems = [
    { path: '/Dashboard', label: t('nav_home'), icon: Home },
    { path: '/Schedule', label: t('nav_schedule'), icon: Clock },
    { path: '/Savings', label: t('nav_savings'), icon: TrendingUp },
    { path: '/Profile', label: t('nav_profile'), icon: User },
    { path: '/more', label: t('nav_more'), icon: LayoutGrid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path || (path === '/Dashboard' && location.pathname === '/');
          return (
            <Link key={path} to={path} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all">
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-primary/20' : ''}`}>
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
                  strokeWidth={active ? 2.5 : 1.5}
                />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}