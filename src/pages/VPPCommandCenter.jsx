import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Activity, Clock, Database, ToggleLeft, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import PriceChart from '@/components/vpp/PriceChart';
import FleetGauge from '@/components/vpp/FleetGauge';
import OptimizationBadge from '@/components/vpp/OptimizationBadge';

function SectionCard({ title, icon: Icon, iconColor, children, badge }) {
  return (
    <div className="rounded-2xl p-4 space-y-3"
      style={{ background: 'rgba(8,18,40,0.85)', border: '1px solid rgba(56,189,248,0.1)', backdropFilter: 'blur(12px)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ background: `${iconColor}18` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
          </div>
          <p className="text-xs font-black text-white uppercase tracking-wider">{title}</p>
        </div>
        {badge}
      </div>
      {children}
    </div>
  );
}

export default function VPPCommandCenter() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [prices, setPrices] = useState([]);
  const [fleet, setFleet] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [loadingFleet, setLoadingFleet] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => setUser(u));
  }, []);

  const fetchPrices = useCallback(async () => {
    const data = await base44.entities.NogaPrice.list('-timestamp', 96);
    setPrices([...data].reverse());
    setLoadingPrices(false);
  }, []);

  const fetchFleet = useCallback(async () => {
    const data = await base44.entities.FleetStatus.list('-created_date', 1);
    if (data?.length) setFleet(data[0]);
    setLoadingFleet(false);
  }, []);

  useEffect(() => {
    fetchPrices();
    fetchFleet();
    const interval = setInterval(() => {
      fetchPrices();
      fetchFleet();
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrices, fetchFleet]);

  // Real-time subscriptions
  useEffect(() => {
    const unsubPrices = base44.entities.NogaPrice.subscribe((event) => {
      if (event.type === 'create') {
        setPrices(prev => [...prev.slice(-95), event.data]);
      }
    });
    const unsubFleet = base44.entities.FleetStatus.subscribe((event) => {
      if (event.type === 'create') {
        setFleet(event.data);
        setLastUpdated(new Date());
      }
    });
    return () => { unsubPrices(); unsubFleet(); };
  }, []);

  const handleManualSync = async () => {
    setSyncing(true);
    await Promise.all([
      base44.functions.invoke('syncEnergyPrices', {}),
      base44.functions.invoke('syncFleetData', {}),
    ]);
    await Promise.all([fetchPrices(), fetchFleet()]);
    setLastUpdated(new Date());
    setSyncing(false);
  };

  // Compute chart data
  const chartData = prices.map(p => ({
    label: new Date(p.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    price: p.price,
    timestamp: p.timestamp,
  }));

  // Top 10% threshold
  const priceValues = prices.map(p => p.price).sort((a, b) => a - b);
  const peakThreshold = priceValues.length
    ? priceValues[Math.floor(priceValues.length * 0.9)]
    : null;

  const currentPrice = prices[prices.length - 1]?.price ?? null;
  const isVppActive = currentPrice !== null && peakThreshold !== null && currentPrice >= peakThreshold;

  const hasMockData = prices.some(p => p.is_mock);
  const isConnected = user?.system_connected === true;

  return (
    <div className="min-h-screen pb-28"
      style={{ background: 'radial-gradient(ellipse at top, rgba(6,18,42,1) 0%, rgba(3,8,20,1) 60%)' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-3"
        style={{ background: 'rgba(3,8,20,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(56,189,248,0.08)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-white tracking-tight">VPP Command Center</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {/* Connection status indicator */}
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <p className="text-[10px] font-bold" style={{ color: 'rgba(52,211,153,0.9)' }}>
                    מחובר · {user?.inverter_model || 'SolarEdge'}
                  </p>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <p className="text-[10px] text-amber-400/80 font-bold">לא מחובר</p>
                </>
              )}
              {hasMockData && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
                  MOCK DATA
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleManualSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)', color: '#38bdf8' }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Not Connected Banner */}
        {user !== null && !isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-4 flex items-start gap-3"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-black text-amber-300">המערכת הסולארית לא מחוברת</p>
              <p className="text-xs text-white/40 mt-0.5">הנתונים המוצגים הם סימולציה בלבד. חבר את המערכת שלך כדי לקבל נתונים אמיתיים.</p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="text-xs font-black px-3 py-2 rounded-xl flex-shrink-0 transition-all active:scale-95"
              style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)' }}
            >
              חבר עכשיו ←
            </button>
          </motion.div>
        )}

        {/* Optimization Status Badge */}
        <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <OptimizationBadge
            isActive={isVppActive}
            currentPrice={currentPrice}
            peakThreshold={peakThreshold}
          />
        </motion.div>

        {/* Fleet Gauge */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <SectionCard
            title="Fleet Battery Energy"
            icon={Activity}
            iconColor="#10b981"
            badge={
              <span className="text-[9px] px-2 py-1 rounded-full font-bold"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
                LIVE
              </span>
            }
          >
            {loadingFleet ? (
              <div className="h-48 flex items-center justify-center text-xs text-white/30">
                <div className="w-5 h-5 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin mr-2" />
                Loading fleet data...
              </div>
            ) : (
              <FleetGauge
                fleetKwh={fleet?.fleet_kwh_available}
                totalSites={fleet?.total_sites}
                totalPowerKw={fleet?.total_power_kw}
                avgSoc={fleet?.avg_soc_pct}
              />
            )}
          </SectionCard>
        </motion.div>

        {/* Price Chart */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <SectionCard
            title="Electricity Price — Last 24h"
            icon={Database}
            iconColor="#38bdf8"
            badge={
              currentPrice ? (
                <div className="text-right">
                  <p className="text-sm font-black" style={{ color: isVppActive ? '#f59e0b' : '#38bdf8' }}>
                    {currentPrice.toFixed(3)} ₪
                  </p>
                  <p className="text-[9px] text-white/30">NIS/kWh</p>
                </div>
              ) : null
            }
          >
            {loadingPrices ? (
              <div className="h-40 flex items-center justify-center text-xs text-white/30">
                <div className="w-5 h-5 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin mr-2" />
                Loading prices...
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center gap-3">
                <p className="text-xs text-white/30">No price data yet.</p>
                <button onClick={handleManualSync}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.25)' }}>
                  Run first sync →
                </button>
              </div>
            ) : (
              <PriceChart data={chartData} peakThreshold={peakThreshold} />
            )}
          </SectionCard>
        </motion.div>

        {/* Fleet Sites Breakdown */}
        {fleet?.sites_data?.length > 0 && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <SectionCard title="Sites Breakdown" icon={ToggleLeft} iconColor="#8b5cf6">
              <div className="space-y-2">
                {fleet.sites_data.map((site, i) => (
                  <div key={site.siteId || i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-black text-white/60"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold text-white/70">{site.siteId}</p>
                        <p className="text-[10px] text-white/40">{site.soc}% SoC</p>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${site.soc}%`,
                            background: site.soc > 60 ? '#10b981' : site.soc > 30 ? '#f59e0b' : '#ef4444'
                          }} />
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-white/50 w-14 text-right">{site.kwhAvailable} kWh</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        )}

        {/* Schedule info */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <div className="flex gap-3">
            {[
              { icon: Clock, label: 'Price Sync', interval: 'Every 15 min', color: '#38bdf8' },
              { icon: Activity, label: 'Fleet Sync', interval: 'Every 10 min', color: '#10b981' },
            ].map(({ icon: Icon, label, interval, color }) => (
              <div key={label} className="flex-1 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Icon className="w-3.5 h-3.5 mb-1.5" style={{ color }} />
                <p className="text-[10px] font-bold text-white/60">{label}</p>
                <p className="text-[9px] text-white/30">{interval}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}