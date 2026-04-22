import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, LogOut, User, HelpCircle, FileText, Shield, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const menuItems = [
    { icon: User, label: 'פרופיל', path: '/Profile' },
    { icon: Settings, label: 'הגדרות', path: '/Settings' },
    { icon: Bell, label: 'התראות', path: '/Schedule' },
    { icon: Shield, label: 'ציות ואבטחה', path: '/compliance' },
    { icon: HelpCircle, label: 'תמיכה', path: '/Support' },
    { icon: FileText, label: 'תנאי שימוש', path: '/terms' },
  ];

  return (
    <div ref={ref} className="relative z-50">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all active:scale-90 focus:outline-none"
        style={{
          border: open ? '2px solid hsl(160 84% 44%)' : '2px solid rgba(255,255,255,0.15)',
          boxShadow: open ? '0 0 12px hsl(160 84% 44% / 0.4)' : 'none',
          background: 'hsl(222 40% 14%)',
        }}
      >
        {user?.profile_picture ? (
          <img src={user.profile_picture} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-black text-primary">{initials}</span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-11 right-0 w-52 rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'hsl(222 40% 10%)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs font-black text-white truncate">{user?.full_name || 'משתמש'}</p>
              <p className="text-[10px] text-white/40 truncate mt-0.5">{user?.email || ''}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              {menuItems.map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => { setOpen(false); navigate(path); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-white/6 transition-colors"
                  dir="rtl"
                >
                  <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-white/80 font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Sign Out */}
            <div className="border-t border-white/10 py-1">
              <button
                onClick={() => { setOpen(false); base44.auth.logout('/landing'); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-right hover:bg-red-500/10 transition-colors"
                dir="rtl"
              >
                <LogOut className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400 font-bold">התנתקות</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}