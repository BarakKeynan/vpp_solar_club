import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Battery, Zap, Car, Sun, Home, TrendingUp, Wifi, Bot, Bell, Wrench, Store, ChevronLeft, CheckCircle2, AlertTriangle } from 'lucide-react';
import ProviderInsightCard from '@/components/dashboard/ProviderInsightCard';
import CommunitySynergyHub from '@/components/dashboard/CommunitySynergyHub';
import LiveTradingMetrics from '@/components/dashboard/LiveTradingMetrics';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useLang } from '@/lib/i18n';

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
    tag: t('lang') === 'en' ? 'Maintenance' : 'תחזוקה',
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
    tag: t('lang') === 'en' ? 'Investment' : 'השקעה',
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
    tag: t('lang') === 'en' ? 'Hardware' : 'חומרה',
    tagColor: 'bg-destructive/20 text-destructive',
  },
];

export default function VPPHome() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [autoPilot, setAutoPilot] = useState(false);
  const [tradeCount, setTradeCount] = useState(0);
  const [surplusProfit, setSurplusProfit] = useState(0);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const alerts = getAlerts(t);

  // Simulate autonomous trades when auto-pilot is ON
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
    if (v) {
      toast.success(t('autopilot_on_msg'));
    } else {
      toast(t('autopilot_off_msg'));
      setTradeCount(0);
      setSurplusProfit(0);
    }
  };

  const handleAlertAction = (alert) => {
    if (alert.type === 'maintenance') navigate('/smart-care');
    else if (alert.type === 'investment') navigate('/farm-detail');
    else toast.success('פנייתך נשלחה – טכנאי יחזור אליך תוך 24 שעות');
    setDismissedAlerts(d => [...d, alert.id]);
  };

  const activeAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div className="p-4 space-y-4 pb-28">
      {/* Header */}
      <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-foreground">{t('vpp_home_title')}</h1>
          <p className="text-xs text-muted-foreground">{t('vpp_home_subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${autoPilot ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span className={`text-xs font-medium ${autoPilot ? 'text-primary' : 'text-muted-foreground'}`}>
            {autoPilot ? t('autopilot_active') : t('autopilot_manual')}
          </span>
          <Wifi className={`w-4 h-4 ${autoPilot ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
      </motion.div>

      {/* Auto-Pilot Toggle */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}
        className={`rounded-2xl border p-4 transition-all ${autoPilot ? 'border-primary/60 bg-primary/10' : 'border-border bg-card'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${autoPilot ? 'bg-primary/20' : 'bg-muted'}`}>
              <Bot className={`w-5 h-5 ${autoPilot ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <p className="text-sm font-black text-foreground">{t('autopilot_label')}</p>
              <p className="text-xs text-muted-foreground">{t('autopilot_subtitle')}</p>
            </div>
          </div>
          <Switch checked={autoPilot} onCheckedChange={handleAutoPilot} />
        </div>

        <AnimatePresence>
          {autoPilot && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-primary/20 space-y-2">
              <p className="text-xs text-primary font-bold">{t('autopilot_active_msg')}</p>
              <p className="text-xs text-muted-foreground">{t('autopilot_managing')}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-primary/10 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-primary">{tradeCount}</p>
                  <p className="text-[10px] text-muted-foreground">{t('autopilot_auto_trades')}</p>
                </div>
                <div className="bg-primary/10 rounded-xl p-3 text-center">
                  <p className="text-lg font-black text-primary">+{surplusProfit.toFixed(0)} ₪</p>
                  <p className="text-[10px] text-muted-foreground">{t('autopilot_surplus')}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Savings Counter */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
        className="bg-gradient-to-l from-primary/20 via-primary/10 to-card rounded-2xl border border-primary/30 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/20">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('savings_today')}</p>
              <p className="text-3xl font-black text-primary">+187 ₪</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">{t('savings_month')}</p>
            <p className="text-lg font-bold text-foreground">+4,230 ₪</p>
          </div>
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

      {/* Community Synergy Hub */}
      <CommunitySynergyHub />

      {/* Live Trading Metrics */}
      <LiveTradingMetrics />

      {/* Provider Insight – Profit Gap Analysis */}
      <ProviderInsightCard />

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

      {/* Action Buttons */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: t('charge_battery'), icon: Battery, color: 'bg-primary text-primary-foreground shadow-primary/30', path: '/charge-battery' },
          { label: t('sell_grid'), icon: Zap, color: 'bg-secondary text-secondary-foreground shadow-secondary/30', path: '/sell-to-grid' },
          { label: t('charge_ev'), icon: Car, color: 'bg-accent text-accent-foreground shadow-accent/30', path: '/charge-ev' },
        ].map(({ label, icon: Icon, color, path }) => (
          <motion.button key={path} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.04 }}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-2 py-5 rounded-2xl font-bold text-xs shadow-lg transition-all ${color}`}>
            <Icon className="w-6 h-6" />
            <span className="leading-tight text-center">{label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Row */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3">
        {[
          { label: t('production_today'), value: '18.4 kWh', color: 'text-accent' },
          { label: t('consumption'), value: '6.2 kWh', color: 'text-secondary' },
          { label: t('sold_to_grid'), value: '9.8 kWh', color: 'text-primary' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl border border-border p-3 text-center">
            <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

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