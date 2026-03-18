import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, PiggyBank, User, Settings } from 'lucide-react';

const navItems = [
  { path: '/Settings', icon: Settings, label: 'הגדרות' },
  { path: '/Profile', icon: User, label: 'פרופיל' },
  { path: '/Savings', icon: PiggyBank, label: 'חיסכון' },
  { path: '/Schedule', icon: Clock, label: 'תזמון' },
  { path: '/Dashboard', icon: Home, label: 'בית' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`relative ${isActive ? '' : ''}`}>
                {isActive && (
                  <div className="absolute -inset-2 bg-primary/10 rounded-full blur-sm" />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}