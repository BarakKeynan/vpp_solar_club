import React from 'react';
import SimplifiedBatteryDashboard from './SimplifiedBatteryDashboard';

export default function OverviewTab({ isHe }) {
  return (
    <div style={{ background: '#080e1a', minHeight: '100vh' }}>
      <SimplifiedBatteryDashboard isHe={isHe} />
    </div>
  );
}