import React from 'react';
import VirtualBatteryWidget from './VirtualBatteryWidget';
import RevenueDashboard from './RevenueDashboard';
import AIArbitrageTracker from './AIArbitrageTracker';
import AIOperatingStatus from './AIOperatingStatus';
import HardwareStatus from './HardwareStatus';
import ProHeader from './ProHeader';

export default function OverviewTab({ isHe }) {
  return (
    <div className="p-5 space-y-5">
      <ProHeader isHe={isHe} />

      {/* AI Operating Status - Top Priority */}
      <AIOperatingStatus isHe={isHe} />

      {/* Top grid */}
      <div className="grid grid-cols-2 gap-4">
        <VirtualBatteryWidget isHe={isHe} />
      </div>

      {/* Revenue cards */}
      <RevenueDashboard isHe={isHe} />

      {/* Arbitrage chart */}
      <div className="grid grid-cols-2 gap-4">
        <AIArbitrageTracker isHe={isHe} />
      </div>

      {/* Hardware */}
      <HardwareStatus isHe={isHe} />
    </div>
  );
}