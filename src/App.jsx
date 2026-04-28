import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
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
import VPPCommandCenter from './pages/VPPCommandCenter.jsx';
import VPPSettings from './pages/VPPSettings.jsx';
import Onboarding from './pages/Onboarding.jsx';
import Register from './pages/Register.jsx';
import Accessibility from './pages/Accessibility.jsx';
import Landing from './pages/Landing.jsx';
import Auth from './pages/Auth.jsx';
import Terms from './pages/Terms.jsx';

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
    if (authError.type === 'auth_required') {
      // Redirect to our custom landing/auth pages instead of Base44's default login
      const path = window.location.pathname;
      if (path === '/auth' || path === '/landing' || path === '/register' || path === '/terms') {
        return null; // Let the public routes handle it
      }
      return <Navigate to="/landing" replace />;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/Dashboard" replace />} />
      <Route path="/landing" element={<Navigate to="/Dashboard" replace />} />
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
        <Route path="/vpp-command-center" element={<VPPCommandCenter />} />
        <Route path="/vpp-settings" element={<VPPSettings />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Route>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

// Public pages wrapper - always accessible, redirect to Dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();
  
  if (isLoadingPublicSettings || isLoadingAuth) return null;
  
  // If authenticated (no error = success), go to Dashboard
  if (!authError) {
    return <Navigate to="/Dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <LangProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<AuthenticatedApp />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </LangProvider>
  );
}

export default App;