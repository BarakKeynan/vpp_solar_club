import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CloudLightning, X } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { base44 } from '@/api/base44Client';
import InfoPopover, { InfoButton } from '@/components/ui/InfoPopover';
import { useInfoTour } from '@/lib/useInfoTour';

export default function StormGuardBanner() {
  const { lang } = useLang();
  const isHe = lang === 'he';
  const [dismissed, setDismissed] = useState(false);
  const [stormData, setStormData] = useState(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const btnRef = useRef(null);

  useEffect(() => {
    // Check if user has storm guard active (set by backend stormGuard function)
    base44.auth.me().then(user => {
      if (user?.storm_guard_active) {
        setStormData({
          active: true,
          socTarget: user.storm_guard_soc_target || 100,
          currentSoc: 85, // from physical battery mock
        });
      }
    }).catch(() => {});
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(139,92,246,0.12))', border: '1px solid rgba(139,92,246,0.4)' }}>
          
          <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)' }}>
            <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <Shield className="w-4 h-4 text-violet-400" />
            </motion.div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <CloudLightning className="w-3 h-3 text-violet-300 flex-shrink-0" />
              <p className="text-[10px] font-black text-violet-300 truncate">
                {isHe ? 'סופה זוהתה באזורך' : 'Storm detected in your area'}
              </p>
            </div>
            <p className="text-xs font-black text-white leading-snug">
              {isHe ? 'מגן סופה פעיל: הסוללה נטענת לגיבוי מלא' : 'Storm Guard Active: Battery charging to full backup'}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  initial={{ width: `${stormData?.currentSoc ?? 80}%` }}
                  animate={{ width: `${stormData?.socTarget ?? 100}%` }}
                  transition={{ duration: 3, ease: 'easeInOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}
                />
              </div>
              <span className="text-[9px] font-black text-violet-300 flex-shrink-0">
                {stormData?.currentSoc ?? 80}% → {stormData?.socTarget ?? 100}%
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            {/* (?) info button */}
            <div className="relative">
              <InfoButton
                id="storm_guard"
                onOpen={() => setPopoverOpen(true)}
                highlight={false}
                buttonRef={btnRef}
              />
              <InfoPopover
                open={popoverOpen}
                onClose={() => setPopoverOpen(false)}
                position="bottom"
                anchorRef={btnRef}
                content={isHe
                  ? 'כשהשמיים מתקדרים, המערכת נכנסת למצב הגנה. היא ממלאת את הסוללה בבית ל-100% כדי שגם אם הרשת תיפול בסופה – אצלך האור יישאר דולק.'
                  : 'When storms approach, the system enters protection mode. It charges your battery to 100% so that even if the grid goes down — your lights stay on.'}
              />
            </div>
            <button onClick={() => setDismissed(true)} className="text-white/25 hover:text-white/60 transition-colors p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-[10px] text-violet-400/60 text-center mt-1.5 font-bold px-2">
          {isHe
            ? '🛡️ אל תדאג מהפסקות חשמל בסופה — אנחנו דאגנו שהסוללה תהיה מלאה'
            : '🛡️ No worries about outages — we\'ve already secured your battery'}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}