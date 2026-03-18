import React from 'react';
import { motion } from 'framer-motion';
import StatusBar from '../components/dashboard/StatusBar';
import PowerFlow from '../components/dashboard/PowerFlow';
import SavingsCounter from '../components/dashboard/SavingsCounter';
import ActionButtons from '../components/dashboard/ActionButtons';

export default function Dashboard() {
  return (
    <div className="px-4 pt-6 space-y-5">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-primary">VPP</span>{' '}
          <span className="text-foreground">הבית שלי</span>
        </h1>
      </motion.div>

      {/* Status */}
      <StatusBar />

      {/* Savings Counter */}
      <SavingsCounter />

      {/* Power Flow */}
      <PowerFlow />

      {/* Action Buttons */}
      <ActionButtons />
    </div>
  );
}