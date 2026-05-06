import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import SavingsHero from '@/components/savings/SavingsHero';
import SavingsBreakdown from '@/components/savings/SavingsBreakdown';
import SavingsMonthChart from '@/components/savings/SavingsMonthChart';
import SavingsROI from '@/components/savings/SavingsROI';

export default function Savings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.functions.invoke('calculateMonthlySavings', {})
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const totalSaved = data?.total_savings ?? 0;
  const billWithout = data?.bill_without ?? 0;
  const billWith = data?.bill_with ?? 0;
  const breakdown = data?.breakdown ?? null;

  return (
    <div className="p-3 space-y-3 pb-28">
      <SavingsHero
        totalSaved={totalSaved}
        billWithout={billWithout}
        billWith={billWith}
        loading={loading}
      />
      <SavingsBreakdown data={breakdown} total={totalSaved} loading={loading} />
      <SavingsMonthChart totalSaved={totalSaved} />
      <SavingsROI monthlySaved={totalSaved} />
    </div>
  );
}