import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Car, Sun, Home, Wifi, Bot, Bell, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import ProviderInsightCard from '@/components/dashboard/ProviderInsightCard';
import CommunitySynergyHub from '@/components/dashboard/CommunitySynergyHub';
import LiveTradingMetrics from '@/components/dashboard/LiveTradingMetrics';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';
import BatteryHealthCard from '@/components/dashboard/BatteryHealthCard';
import BatterySelectModal from '@/components/dashboard/BatterySelectModal';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import PortfolioAudit from '@/components/dashboard/PortfolioAudit';

function PowerNode({ icon: Icon, label, value, colorClass }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`p-3 rounded-2xl border-2 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {value && <span className="text-xs font-bold">{value}</span>}
    </div>
  );
}

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

const getAlerts = (t) => [
  {
    id: 'cleaning',
    icon: '🛠️',
    type: 'maintenance',
    title: t('alert_cleaning_title'),
    desc: t('alert_cleaning_desc'),
    action: t('alert_cleaning_action'),
    color: 'border-accent/40 bg-accent/5',
    tag: t('tag_maintenance'),
    tagColor: 'bg-accent/20 text-accent',
  },
  {
    id: 'farm',
    icon: '📈',
    type: 'investment',
    title: t('alert_farm_title'),
    desc: t('alert_farm_desc'),
    action: t('alert_farm_action'),
    color: 'border-secondary/40 bg-secondary/5',
    tag: t('tag_investment'),
    tagColor: 'bg-secondary/20 text-secondary',
  },
  {
    id: 'inverter',
    icon: '⚡',
    type: 'hardware',
    title: t('alert_inverter_title'),
    desc: t('alert_inverter_desc'),
    action: t('alert_inverter_action'),
    color: 'border-destructive/40 bg-destructive/5',
    tag: t('tag_hardware'),
    tagColor: 'bg-destructive/20 text-destructive',
  },
];

export default function VPPHome() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [autoPilot, setAutoPilot] = useState(false);
  const [showBatterySelect, setShowBatterySelect] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [tradeCount, setTradeCount] = useState(0);
  const [surplusProfit, setSurplusProfit] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const alerts = getAlerts(t);

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

  const handleAlertAction = (alert) => {
    if (alert.type === 'maintenance') navigate('/smart-care');
    else if (alert.type === 'investment') navigate('/farm-detail');
    else toast.success(t('alert_technician_sent'));
    setDismissedAlerts(d => [...d, alert.id]);
  };

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  const handleAutoOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(r => setTimeout(r, 1800));
    setAutoPilot(true);
    setIsOptimizing(false);
    toast.success(t('auto_optimized_msg'));
  };

  return (
    <div className="p-3 space-y-3 pb-28">
      {/* Header + Auto-Pilot inline */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className={`rounded-2xl border px-4 py-3 flex items-center justify-between transition-all ${autoPilot ? 'border-primary/50 bg-primary/8' : 'border-border bg-card'}`}>
        <div>
          <h1 className="text-base font-black text-foreground">{t('vpp_home_title')}</h1>
          <p className="text-[10px] text-muted-foreground">{t('vpp_home_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {autoPilot && (
            <div className="flex gap-2 text-center">
              <div className="bg-primary/10 rounded-lg px-2 py-1">
                <p className="text-xs font-black text-primary">{tradeCount}</p>
                <p className="text-[9px] text-muted-foreground">{t('autopilot_auto_trades')}</p>
              </div>
              <div className="bg-primary/10 rounded-lg px-2 py-1">
                <p className="text-xs font-black text-primary">+{surplusProfit.toFixed(0)}₪</p>
                <p className="text-[9px] text-muted-foreground">{t('autopilot_surplus')}</p>
              </div>
            </div>
          )}
          {!autoPilot && !isOptimizing && (
            <button onClick={handleAutoOptimize}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Sparkles className="w-3 h-3" />{t('auto_optimize_btn')}
            </button>
          )}
          {isOptimizing && (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold text-white opacity-60"
              style={{ background: 'linear-gradient(135deg,#7C3AED,#8B5CF6)' }}>
              <Loader2 className="w-3 h-3 animate-spin" />{t('auto_optimizing')}
            </div>
          )}
          <Switch checked={autoPilot} onCheckedChange={handleAutoPilot} />
        </div>
      </motion.div>

      {/* Savings + Stats compact row */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2">
        <div className="col-span-2 bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">{t('savings_today')}</p>
            <p className="text-2xl font-black text-primary">+187 ₪</p>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-muted-foreground">{t('savings_month')}</p>
            <p className="text-sm font-bold text-foreground">+4,230 ₪</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border px-3 py-3 flex flex-col justify-center text-center">
          <p className="text-sm font-black text-accent">18.4</p>
          <p className="text-[9px] text-muted-foreground">kWh {t('production_today')}</p>
          <div className="my-1 border-t border-border" />
          <p className="text-sm font-black text-primary">9.8</p>
          <p className="text-[9px] text-muted-foreground">kWh {t('sold_to_grid')}</p>
        </div>
      </motion.div>

      {/* Power Flow */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        className="bg-card rounded-2xl border border-border p-4 space-y-4">
        <p className="text-xs text-muted-foreground font-medium">{t('energy_flow')}</p>
        <div className="flex items-center justify-center gap-1">
          <PowerNode icon={Sun} label={t('sun')} value="4.2 kW" colorClass="border-accent text-accent" />
          <FlowDots active />
          <div className="flex flex-col items-center gap-1">
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-md animate-pulse" />
              <div className="relative p-4 rounded-2xl border-2 border-primary text-primary bg-primary/5">
                <Battery className="w-8 h-8" />
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground">{t('battery')}</span>
            <span className="text-2xl font-black text-primary">82%</span>
          </div>
          <FlowDots active />
          <PowerNode icon={Home} label={t('house')} value="1.8 kW" colorClass="border-secondary text-secondary" />
        </div>
        <div className="flex items-center justify-center gap-8">
          <PowerNode icon={Car} label={t('ev')} value={t('charging')} colorClass="border-accent text-accent" />
          <PowerNode icon={Zap} label={t('grid')} value={t('exporting')} colorClass="border-secondary text-secondary" />
        </div>
      </motion.div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Battery Health */}
      <BatteryHealthCard />

      {/* Community Synergy Hub */}
      <CommunitySynergyHub />

      {/* Live Trading Metrics */}
      <LiveTradingMetrics />

      {/* Portfolio Audit */}
      <PortfolioAudit />

      {/* Provider Insight */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.18 }}>
        <ProviderInsightCard />
      </motion.div>

      {/* Manual Approvals – Alerts */}
      {activeAlerts.length > 0 && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-accent" />
            <p className="text-xs font-bold text-muted-foreground">{t('alerts_title')}</p>
          </div>
          {activeAlerts.map(alert => (
            <div key={alert.id} className={`rounded-2xl border p-4 ${alert.color}`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{alert.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.tagColor}`}>{alert.tag}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                  <button
                    onClick={() => handleAlertAction(alert)}
                    className="mt-2 px-3 py-1.5 bg-card border border-border rounded-xl text-xs font-bold text-foreground hover:border-primary/50 transition-colors active:scale-95">
                    {alert.action} ←
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Selected Battery Card */}
      <motion.button
        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.27 }}
        onClick={() => setShowBatterySelect(true)}
        className="w-full bg-card border border-border rounded-2xl p-4 text-right active:scale-[0.98] transition-transform hover:border-primary/40"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {lang === 'he' ? 'לחץ לשינוי' : 'Tap to change'}
          </div>
          <p className="text-xs font-bold text-muted-foreground">
            {lang === 'he' ? 'סוללה למכירה לרשת' : 'Battery for Grid Sale'}
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
            <div
              className={`h-full rounded-full transition-all ${selectedBattery.level > 60 ? 'bg-primary' : selectedBattery.level > 30 ? 'bg-accent' : 'bg-destructive'}`}
              style={{ width: `${selectedBattery.level}%` }}
            />
          </div>
        )}
      </motion.button>

      {/* Action Buttons */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: t('charge_battery'), icon: Battery, color: 'bg-primary text-primary-foreground shadow-primary/30', path: '/charge-battery' },
          { label: selectedBattery ? `${t('sell_grid')}\n${selectedBattery.name}` : t('sell_grid'), icon: Zap, color: 'bg-secondary text-secondary-foreground shadow-secondary/30', path: '/sell-to-grid', batterySelect: true },
          { label: t('charge_ev'), icon: Car, color: 'bg-accent text-accent-foreground shadow-accent/30', path: '/charge-ev' },
        ].map(({ label, icon: Icon, color, path, batterySelect }) => (
          <motion.button key={path} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.04 }}
            onClick={() => batterySelect ? setShowBatterySelect(true) : navigate(path)}
            className={`flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-xs shadow-lg transition-all ${color}`}>
            <Icon className="w-6 h-6" />
            <span className="leading-tight text-center">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      <BatterySelectModal
        open={showBatterySelect}
        onClose={() => setShowBatterySelect(false)}
        onSelect={(bat) => { setSelectedBattery(bat); navigate('/sell-to-grid'); }}
      />

      {/* Farm Detail Link */}
      <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
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