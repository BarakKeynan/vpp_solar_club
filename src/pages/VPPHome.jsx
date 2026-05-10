import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Car, Sun, Home, ChevronLeft, Sparkles, Loader2, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { ClickablePowerNode, ClickableBatteryNode } from '@/components/dashboard/EnergyNodeCard';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';
import BatterySelectModal from '@/components/dashboard/BatterySelectModal';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import UnifiedAIAdvisory from '@/components/dashboard/UnifiedAIAdvisory';
import ComplianceOnboarding, { useComplianceDone } from '@/components/onboarding/ComplianceOnboarding';
import InPlaceOnboarding from '@/components/onboarding/InPlaceOnboarding';
import BillingStatusCard from '@/components/billing/BillingStatusCard';
import PhysicalBatteryStatus from '@/components/dashboard/PhysicalBatteryStatus';
import EcoProfitMode from '@/components/dashboard/EcoProfitMode';
import StormGuardBanner from '@/components/dashboard/StormGuardBanner';
import SmartEnergyBanner from '@/components/dashboard/SmartEnergyBanner';
import CommunityImpactCard from '@/components/dashboard/CommunityImpactCard';
import GamificationBadge from '@/components/dashboard/GamificationBadge';

function FlowDots({ active }) {
  return (
    <div className="flex items-center gap-0.5 px-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ opacity: active ? [0.2, 1, 0.2] : 0.2 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          className="w-1.5 h-1.5 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}

export default function VPPHome() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const isHe = lang === 'he';
  const [complianceDone, complianceLoading] = useComplianceDone();
  const [showCompliance, setShowCompliance] = useState(false);
  const [user, setUser] = useState(undefined);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [autoPilot, setAutoPilot] = useState(false);
  const [showBatterySelect, setShowBatterySelect] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [tradeCount, setTradeCount] = useState(0);
  const [surplusProfit, setSurplusProfit] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!complianceLoading && !complianceDone) setShowCompliance(true);
  }, [complianceDone, complianceLoading]);

  useEffect(() => {
    if (!autoPilot) return;
    const interval = setInterval(() => {
      setTradeCount(c => c + 1);
      setSurplusProfit(p => +(p + (Math.random() * 8 + 2)).toFixed(2));
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPilot]);

  const handleAutoPilot = (v) => {
    setAutoPilot(v);
    if (v) toast.success(t('autopilot_on_msg'));
    else { toast(t('autopilot_off_msg')); setTradeCount(0); setSurplusProfit(0); }
  };

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(r => setTimeout(r, 1800));
    setAutoPilot(true);
    setIsOptimizing(false);
    toast.success(t('auto_optimized_msg'));
  };

  return (
    <div className="p-3 space-y-3 pb-28">
      <AnimatePresence>
        {showOnboarding && (
          <InPlaceOnboarding
            onDone={() => { setShowOnboarding(false); base44.auth.me().then(u => setUser(u)).catch(() => {}); }}
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showCompliance && (
          <ComplianceOnboarding onDone={async () => {
            setShowCompliance(false);
            const u = await base44.auth.me().catch(() => null);
            if (!u?.site_id && !u?.system_connected) navigate('/onboarding');
          }} />
        )}
      </AnimatePresence>

      {/* ── Welcome Header ── */}
      <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="rounded-2xl px-4 py-4"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.03))', border: '1px solid rgba(16,185,129,0.18)' }}>
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => navigate('/user-guide')}
            className="flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-xl active:scale-95 transition-all"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
            <BookOpen className="w-3.5 h-3.5" />
            {isHe ? 'הוראות שימוש' : 'User Guide'}
          </button>
          <div className="text-right">
            <p className="text-base font-black text-white">
              {isHe ? `שלום, ${user?.full_name?.split(' ')[0] || 'משתמש'} 👋` : `Hi, ${user?.full_name?.split(' ')[0] || 'User'} 👋`}
            </p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {isHe ? 'ברוך הבא ל-VPP Solar Club' : 'Welcome to VPP Solar Club'}
            </p>
          </div>
        </div>
        <p className="text-[11px] text-white/45 leading-relaxed text-right mt-2">
          {isHe
            ? 'האפליקציה מנהלת את המערכת הסולארית שלך בצורה אוטומטית — מוכרת אנרגיה בשיא, טוענת בשפל, וחוסכת בכל חודש.'
            : 'The app automatically manages your solar system — sells energy at peak, charges at off-peak, and saves money every month.'}
        </p>
      </motion.div>

      {/* Not Connected Banner */}
      {user && !user.system_connected && (
        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <div className="p-2 rounded-xl flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-amber-300">{isHe ? 'המערכת הסולארית לא מחוברת' : 'Solar system not connected'}</p>
            <p className="text-[10px] text-white/40 mt-0.5">{isHe ? 'הנתונים הם סימולציה. חבר למערכת אמיתית.' : 'Data is simulated. Connect to real system.'}</p>
          </div>
          <button onClick={() => setShowOnboarding(true)}
            className="text-[11px] font-black px-3 py-2 rounded-xl flex-shrink-0 active:scale-95 transition-all"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }}>
            {isHe ? 'חבר ←' : 'Connect →'}
          </button>
        </motion.div>
      )}

      {/* Billing */}
      <BillingStatusCard />

      {/* Smart Energy Banner */}
      <SmartEnergyBanner />

      {/* AI Advisory */}
      <UnifiedAIAdvisory />

      {/* ── Auto-Pilot Card ── */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className={`rounded-2xl border px-4 py-4 transition-all`}
        style={autoPilot
          ? { background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.4)' }
          : { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
        <div className="flex items-center justify-between">
          <Switch checked={autoPilot} onCheckedChange={handleAutoPilot} />
          <div className="text-right">
            <h1 className="text-base font-black text-foreground">{t('vpp_home_title')}</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">{t('vpp_home_subtitle')}</p>
          </div>
        </div>
        {autoPilot ? (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-2 mt-3 pt-3 border-t border-primary/20">
            {[
              { val: tradeCount, label: t('autopilot_auto_trades') },
              { val: `+${surplusProfit.toFixed(0)}₪`, label: t('autopilot_surplus') },
              { val: isHe ? 'פעיל' : 'Active', label: 'AI Pilot', green: true },
            ].map((s, i) => (
              <div key={i} className="flex-1 bg-primary/10 rounded-xl px-3 py-2 text-center">
                <p className={`text-sm font-black ${s.green ? 'text-emerald-400' : 'text-primary'}`}>{s.val}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3">
            {!isOptimizing ? (
              <button onClick={handleAutoOptimize}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.8),rgba(139,92,246,0.6))', border: '1px solid rgba(139,92,246,0.4)' }}>
                <Sparkles className="w-4 h-4" />{t('auto_optimize_btn')}
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white/60"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />{t('auto_optimizing')}
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* ── Savings Hero ── */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl border border-primary/30 px-5 py-4"
        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.04))' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/60 font-bold">Live</span>
          </div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('savings_today')}</p>
        </div>
        <p className="text-4xl font-black text-primary leading-none text-right">+187 ₪</p>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 justify-between">
          <div className="text-center">
            <p className="text-[10px] text-white/40">{t('sold_to_grid')}</p>
            <p className="text-sm font-black text-secondary">9.8 kWh</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-white/40">{t('production_today')}</p>
            <p className="text-sm font-black text-accent">18.4 kWh</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-white/40">{t('savings_month')}</p>
            <p className="text-sm font-black text-white">+4,230 ₪</p>
          </div>
        </div>
      </motion.div>

      {/* ── Power Flow ── */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <p className="text-xs text-muted-foreground font-medium text-right">{t('energy_flow')}</p>
        <div className="flex items-center justify-center gap-1">
          <ClickablePowerNode nodeKey="solar" icon={Sun} label={t('sun')} value="4.2 kW" colorClass="border-accent text-accent" isHe={isHe} />
          <FlowDots active />
          <ClickableBatteryNode label={t('battery')} value="82%" isHe={isHe} />
          <FlowDots active />
          <ClickablePowerNode nodeKey="home" icon={Home} label={t('house')} value="1.8 kW" colorClass="border-secondary text-secondary" isHe={isHe} />
        </div>
        <div className="flex items-center justify-center gap-8">
          <ClickablePowerNode nodeKey="ev" icon={Car} label={t('ev')} value={t('charging')} colorClass="border-accent text-accent" isHe={isHe} />
          <ClickablePowerNode nodeKey="grid" icon={Zap} label={t('grid')} value={t('exporting')} colorClass="border-secondary text-secondary" isHe={isHe} />
        </div>
      </motion.div>

      {/* ── Action Buttons ── */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: t('charge_battery'), icon: Battery, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.35)', path: '/charge-battery' },
          { label: t('sell_grid'), icon: Zap, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.35)', batterySelect: true },
          { label: t('charge_ev'), icon: Car, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)', path: '/charge-ev' },
        ].map(({ label, icon: BtnIcon, gradient, shadow, path, batterySelect }) => (
          <motion.button key={label} whileTap={{ scale: 0.93 }}
            onClick={() => batterySelect ? setShowBatterySelect(true) : navigate(path)}
            className="flex flex-col items-center gap-2.5 py-5 rounded-2xl font-bold text-xs text-white transition-all"
            style={{ background: gradient, boxShadow: `0 4px 20px ${shadow}` }}>
            <BtnIcon className="w-6 h-6" />
            <span className="leading-tight text-center text-[11px] font-black">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Physical Battery */}
      <PhysicalBatteryStatus />

      {/* ── Eco Profit Mode ── */}
      <EcoProfitMode />

      {/* Weather */}
      <WeatherWidget />

      {/* Storm Guard */}
      <StormGuardBanner />

      {/* Community & Gamification */}
      <CommunityImpactCard />
      <GamificationBadge />

      {/* Battery selector */}
      <motion.button
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        onClick={() => setShowBatterySelect(true)}
        className="w-full bg-card border border-border rounded-2xl p-4 text-right active:scale-[0.98] transition-transform hover:border-primary/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {isHe ? 'לחץ לשינוי' : 'Tap to change'}
          </div>
          <p className="text-xs font-bold text-muted-foreground">{isHe ? 'סוללה למכירה לרשת' : 'Battery for Grid Sale'}</p>
        </div>
        {selectedBattery ? (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30"><Battery className="w-5 h-5 text-primary" /></div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{selectedBattery.name}</p>
              <p className="text-[10px] text-muted-foreground">{selectedBattery.model} · {selectedBattery.capacity} kWh</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-primary">{selectedBattery.level}%</p>
              <p className="text-[10px] text-muted-foreground">{((selectedBattery.level / 100) * selectedBattery.capacity).toFixed(1)} kWh {isHe ? 'זמין' : 'available'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted border border-dashed border-border"><Battery className="w-5 h-5 text-muted-foreground" /></div>
            <div className="flex-1">
              <p className="text-sm font-bold text-muted-foreground">{isHe ? 'לא נבחרה סוללה' : 'No battery selected'}</p>
              <p className="text-[10px] text-muted-foreground">{isHe ? 'לחץ לבחירה' : 'Tap to select'}</p>
            </div>
            <span className="text-xs font-bold text-primary border border-primary/40 rounded-xl px-3 py-1.5">{isHe ? '+ בחר' : '+ Select'}</span>
          </div>
        )}
        {selectedBattery && (
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${selectedBattery.level > 60 ? 'bg-primary' : selectedBattery.level > 30 ? 'bg-accent' : 'bg-destructive'}`}
              style={{ width: `${selectedBattery.level}%` }} />
          </div>
        )}
      </motion.button>

      <BatterySelectModal
        open={showBatterySelect}
        onClose={() => setShowBatterySelect(false)}
        onSelect={(bat) => { setSelectedBattery(bat); navigate('/sell-to-grid'); }}
      />

      {/* Farm link */}
      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
        onClick={() => navigate('/farm-detail')}
        className="w-full flex items-center justify-between bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-transform">
        <div className="flex items-center gap-3">
          <span className="text-2xl">☀️</span>
          <div className="text-right">
            <p className="text-sm font-black text-foreground">{t('my_solar_farm')}</p>
            <p className="text-xs text-muted-foreground">{t('farm_subtitle')}</p>
          </div>
        </div>
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      </motion.button>
    </div>
  );
}