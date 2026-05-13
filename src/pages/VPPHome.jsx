import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Car, Sun, Home, ChevronLeft, Sparkles, Loader2, AlertTriangle, TrendingUp } from 'lucide-react';
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
import SmartEnergyBanner from '@/components/dashboard/SmartEnergyBanner';
import SimpleSavingsCard from '@/components/dashboard/SimpleSavingsCard';
import InPlaceOnboarding from '@/components/onboarding/InPlaceOnboarding';
import BillingStatusCard from '@/components/billing/BillingStatusCard';
import StormGuardBanner from '@/components/dashboard/StormGuardBanner';
import EcoProfitMode from '@/components/dashboard/EcoProfitMode';
import ProviderInsightCard from '@/components/dashboard/ProviderInsightCard';
import VPPConnectCard from '@/components/dashboard/VPPConnectCard';

// PowerNode helper (kept for structure)

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
  const [complianceDone, complianceLoading] = useComplianceDone();
  const [showCompliance, setShowCompliance] = useState(false);

  const [user, setUser] = useState(undefined);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u)).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (!complianceLoading && !complianceDone) {
      setShowCompliance(true);
    }
  }, [complianceDone, complianceLoading]);

  const [nogaPrice, setNogaPrice] = useState(null);

  useEffect(() => {
    base44.entities.NogaPrice.list('-created_date', 1).then(p => {
      if (p[0]) setNogaPrice(p[0]);
    }).catch(() => {});
  }, []);

  const [autoPilot, setAutoPilot] = useState(false);
  const [showBatterySelect, setShowBatterySelect] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [tradeCount, setTradeCount] = useState(0);
  const [surplusProfit, setSurplusProfit] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);

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

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
    // Refresh user to remove banner
    base44.auth.me().then(u => setUser(u)).catch(() => {});
  };

  return (
    <div className="p-3 space-y-3 pb-28">
      {/* Modals */}
      <AnimatePresence>
        {showOnboarding && (
          <InPlaceOnboarding onDone={handleOnboardingDone} onClose={() => setShowOnboarding(false)} />
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

      {/* Not Connected Banner */}
      {user && !user.system_connected && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <div className="p-2 rounded-xl flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-amber-300">המערכת הסולארית לא מחוברת</p>
            <p className="text-[10px] text-white/40 mt-0.5">הנתונים הם סימולציה. חבר את המערכת לנתונים אמיתיים.</p>
          </div>
          <button
            onClick={() => setShowOnboarding(true)}
            className="text-[11px] font-black px-3 py-2 rounded-xl flex-shrink-0 active:scale-95 transition-all"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }}
          >
            חבר ←
          </button>
        </motion.div>
      )}

      {/* Billing Status */}
      <BillingStatusCard />

      {/* Smart Energy Push Banner */}
      <SmartEnergyBanner />

      {/* VPP Brain Status Row — moved to top */}
      {nogaPrice && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-2">
          {[
            {
              icon: '📡',
              label: lang === 'he' ? 'נגה' : 'Noga',
              value: `₪${nogaPrice.price?.toFixed(3)}`,
              color: nogaPrice.price >= 0.6 ? '#f59e0b' : '#34d399',
              sub: lang === 'he' ? 'מחיר חשמל' : 'Grid price',
            },
            {
              icon: '☀️',
              label: lang === 'he' ? 'סולאר' : 'Solar',
              value: '4.2 kW',
              color: '#f59e0b',
              sub: lang === 'he' ? 'ייצור עכשיו' : 'Producing now',
            },
            {
              icon: '🤖',
              label: lang === 'he' ? 'מוח VPP' : 'VPP Brain',
              value: (new Date().getHours() >= 17 && new Date().getHours() <= 21)
                ? (lang === 'he' ? 'מוכר' : 'Selling')
                : (lang === 'he' ? 'טוען' : 'Charging'),
              color: '#60a5fa',
              sub: lang === 'he' ? 'פעולה אוטומטית' : 'Auto action',
            },
          ].map((item, i) => (
            <div key={i} className="rounded-xl px-3 py-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-base">{item.icon}</span>
              <p className="text-[10px] text-white/40 mt-0.5">{item.label}</p>
              <p className="text-sm font-black mt-0.5" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[9px] text-white/30">{item.sub}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Power Flow */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">{t('energy_flow')}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
            {lang === 'he' ? 'זרימה חיה' : 'Live flow'}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1">
          <ClickablePowerNode nodeKey="solar" icon={Sun} label={t('sun')} value="4.2 kW" colorClass="border-accent text-accent" isHe={lang === 'he'} />
          <FlowDots active />
          <ClickableBatteryNode label={t('battery')} value="82%" isHe={lang === 'he'} />
          <FlowDots active />
          <ClickablePowerNode nodeKey="home" icon={Home} label={t('house')} value="1.8 kW" colorClass="border-secondary text-secondary" isHe={lang === 'he'} />
        </div>
        <div className="flex items-center justify-center gap-8">
          <ClickablePowerNode nodeKey="ev" icon={Car} label={t('ev')} value={t('charging')} colorClass="border-accent text-accent" isHe={lang === 'he'} />
          <ClickablePowerNode nodeKey="grid" icon={Zap} label={t('grid')} value={t('exporting')} colorClass="border-secondary text-secondary" isHe={lang === 'he'} />
        </div>
      </motion.div>

      {/* Savings Hero Card */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className="rounded-2xl px-5 py-4"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.25)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400/70 font-bold">Live</span>
          </div>
          <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('savings_today')}</p>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-4xl font-black text-primary leading-none">+187 ₪</p>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black text-emerald-400">+12% {lang === 'he' ? 'מאתמול' : 'vs yesterday'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
          <div>
            <p className="text-[10px] text-white/40">{t('savings_month')}</p>
            <p className="text-sm font-black text-white">+4,230 ₪</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <p className="text-[10px] text-white/40">{t('production_today')}</p>
            <p className="text-sm font-black text-accent">18.4 kWh ☀️</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div>
            <p className="text-[10px] text-white/40">{t('sold_to_grid')}</p>
            <p className="text-sm font-black text-secondary">9.8 kWh ⚡</p>
          </div>
          {nogaPrice && (
            <>
              <div className="w-px h-6 bg-white/10" />
              <div>
                <p className="text-[10px] text-white/40">{lang === 'he' ? 'מחיר נגה' : 'Noga Rate'}</p>
                <p className="text-sm font-black" style={{ color: nogaPrice.price >= 0.6 ? '#f59e0b' : '#34d399' }}>
                  ₪{nogaPrice.price?.toFixed(3)}
                  {nogaPrice.is_mock && <span className="text-[9px] text-white/30"> demo</span>}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>



      {/* Auto-Pilot Toggle */}
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.12 }}
        className={`rounded-2xl border px-4 py-4 transition-all ${autoPilot ? 'border-primary/40' : 'border-border bg-card'}`}
        style={autoPilot ? { background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.04))' } : {}}>
        <div className="flex items-center justify-between">
          <Switch checked={autoPilot} onCheckedChange={handleAutoPilot} />
          <div className="text-right">
            <h1 className="text-sm font-black text-foreground">{t('vpp_home_title')}</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">{t('vpp_home_subtitle')}</p>
          </div>
        </div>
        {autoPilot && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex gap-2 mt-3 pt-3 border-t border-primary/20">
            <div className="flex-1 bg-primary/10 rounded-xl px-3 py-2 text-center">
              <p className="text-sm font-black text-primary">{tradeCount}</p>
              <p className="text-[9px] text-muted-foreground">{t('autopilot_auto_trades')}</p>
            </div>
            <div className="flex-1 bg-primary/10 rounded-xl px-3 py-2 text-center">
              <p className="text-sm font-black text-primary">+{surplusProfit.toFixed(0)}₪</p>
              <p className="text-[9px] text-muted-foreground">{t('autopilot_surplus')}</p>
            </div>
            <div className="flex-1 bg-primary/10 rounded-xl px-3 py-2 text-center">
              <p className="text-sm font-black text-emerald-400">✓ {lang === 'he' ? 'פעיל' : 'Active'}</p>
              <p className="text-[9px] text-muted-foreground">AI Pilot</p>
            </div>
          </motion.div>
        )}
        {!autoPilot && (
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

      {/* VPP Connect — device control hub */}
      <VPPConnectCard />

      {/* Eco Profit Mode — opens bottom sheet */}
      <EcoProfitMode />

      {/* Unified AI Advisory */}
      <UnifiedAIAdvisory />

      {/* Storm Guard Banner */}
      <StormGuardBanner />

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Simple Savings Card */}
      <SimpleSavingsCard />

      {/* Action Buttons */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: t('charge_battery'), icon: Battery, gradient: 'linear-gradient(135deg,#10b981,#059669)', shadow: 'rgba(16,185,129,0.35)', path: '/charge-battery' },
          { label: t('sell_grid'), icon: Zap, gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)', shadow: 'rgba(59,130,246,0.35)', path: '/sell-to-grid', batterySelect: true },
          { label: t('charge_ev'), icon: Car, gradient: 'linear-gradient(135deg,#f59e0b,#d97706)', shadow: 'rgba(245,158,11,0.35)', path: '/charge-ev' },
        ].map(({ label, icon: BtnIcon, gradient, shadow, path, batterySelect }) => (
          <motion.button key={path} whileTap={{ scale: 0.93 }}
            onClick={() => batterySelect ? setShowBatterySelect(true) : navigate(path)}
            className="flex flex-col items-center gap-2.5 py-5 rounded-2xl font-bold text-xs text-white transition-all"
            style={{ background: gradient, boxShadow: `0 4px 20px ${shadow}` }}>
            <BtnIcon className="w-6 h-6" />
            <span className="leading-tight text-center text-[11px] font-black">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Battery for Grid Sale */}
      <motion.button
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.22 }}
        onClick={() => setShowBatterySelect(true)}
        className="w-full bg-card border border-border rounded-2xl p-4 text-right active:scale-[0.98] transition-transform hover:border-primary/40"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {lang === 'he' ? 'לחץ לשינוי' : 'Tap to change'}
          </div>
          <p className="text-xs font-bold text-muted-foreground">
            🔋 {lang === 'he' ? 'סוללה למכירה לרשת' : 'Battery for Grid Sale'}
          </p>
        </div>
        {selectedBattery ? (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/15 border border-primary/30">
              <Battery className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-foreground">{selectedBattery.name}</p>
              <p className="text-[10px] text-muted-foreground">{selectedBattery.model} · {selectedBattery.capacity} kWh</p>
            </div>
            <div className="text-left">
              <p className="text-xl font-black text-primary">{selectedBattery.level}%</p>
              <p className="text-[10px] text-muted-foreground">
                {((selectedBattery.level / 100) * selectedBattery.capacity).toFixed(1)} kWh {lang === 'he' ? 'זמין' : 'available'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-muted border border-dashed border-border">
              <Battery className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-muted-foreground">
                {lang === 'he' ? 'לא נבחרה סוללה' : 'No battery selected'}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {lang === 'he' ? 'לחץ לבחירה ממשק הסוללות' : 'Tap to discover batteries'}
              </p>
            </div>
            <span className="text-xs font-bold text-primary border border-primary/40 rounded-xl px-3 py-1.5">
              {lang === 'he' ? '+ בחר' : '+ Select'}
            </span>
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

      {/* Provider Insight */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
        <ProviderInsightCard />
      </motion.div>

      {/* Farm Detail Link */}
      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.28 }}
        onClick={() => navigate('/farm-detail')}
        className="w-full flex items-center justify-between bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-transform hover:border-primary/40">
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