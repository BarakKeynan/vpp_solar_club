import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import { LangProvider } from './lib/i18n';

// Pages
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Schedule from './pages/Schedule';
import Savings from './pages/Savings';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Support from './pages/Support';
import ChargeBattery from './pages/actions/ChargeBattery';
import SellToGrid from './pages/actions/SellToGrid';
import ChargeEV from './pages/actions/ChargeEV';
import SavingsInfo from './pages/club/SavingsInfo';
import GreenInfo from './pages/club/GreenInfo';
import TenantsInfo from './pages/club/TenantsInfo';
import Providers from './pages/Providers';
import SmartCare from './pages/SmartCare';
import Marketplace from './pages/Marketplace';
import More from './pages/More';
import FinancialPerformance from './pages/FinancialPerformance';
import ComplianceHub from './pages/ComplianceHub';
import Referral from './pages/Referral';
import FarmDetail from './pages/FarmDetail';
import VPPClubDashboard from './pages/VPPClubDashboard.jsx';
import MonthlyReport from './pages/MonthlyReport.jsx';
import ProDashboard from './pages/ProDashboard.jsx';
import BulkAudit from './pages/BulkAudit.jsx';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Schedule" element={<Schedule />} />
        <Route path="/Savings" element={<Savings />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Support" element={<Support />} />
        <Route path="/charge-battery" element={<ChargeBattery />} />
        <Route path="/sell-to-grid" element={<SellToGrid />} />
        <Route path="/charge-ev" element={<ChargeEV />} />
        <Route path="/club/savings" element={<SavingsInfo />} />
        <Route path="/club/green" element={<GreenInfo />} />
        <Route path="/club/tenants" element={<TenantsInfo />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/smart-care" element={<SmartCare />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/more" element={<More />} />
        <Route path="/financial" element={<FinancialPerformance />} />
        <Route path="/compliance" element={<ComplianceHub />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/farm-detail" element={<FarmDetail />} />
        <Route path="/vpp-club-dashboard" element={<VPPClubDashboard />} />
        <Route path="/monthly-report" element={<MonthlyReport />} />
        <Route path="/pro-dashboard" element={<ProDashboard />} />
        <Route path="/bulk-audit" element={<BulkAudit />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <LangProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <AnimatePresence>
          {showSplash && <SplashScreen key="splash" onDone={() => setShowSplash(false)} />}
        </AnimatePresence>
        {!showSplash && (
          <Router>
            <AuthenticatedApp />
          </Router>
        )}
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </LangProvider>
  );
}

export default App;