import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, UserCheck, Shield, Briefcase, Activity, CheckCircle, Clock, Building2, FileSignature, AlertTriangle, Camera, Calendar, Smartphone, ChevronDown, BarChart3, TrendingUp, Zap, Server, Download, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import VisitorList from './components/visitor/VisitorList';
import HostPortal from './components/host/HostPortal';
import SecurityPortal from './components/security/SecurityPortal';
import ContractorApprovals from './components/security/ContractorApprovals';
import EmployeeApprovals from './components/security/EmployeeApprovals';
import PassApprovals from './components/security/PassApprovals';
import AdminPassRequests from './components/security/AdminPassRequests';
import AdminGeneratedPasses from './components/security/AdminGeneratedPasses';
import ContractorHub from './components/security/ContractorHub';
import CheckInOut from './components/security/CheckInOut';
import ActiveVisits from './components/security/ActiveVisits';
import VisitHistory from './components/security/VisitHistory';
import BlockedVisitors from './components/security/BlockedVisitors';
import SecurityReviews from './components/security/SecurityReviews';
import ContractorPortal from './components/contractor/ContractorPortal';
import ContractorRegistration from './components/contractor/ContractorRegistration';
import ReportingPortal from './components/reporting/ReportingPortal';
import VisitorReport from './components/reporting/VisitorReport';
import VisitorDirectoryReport from './components/reporting/VisitorDirectoryReport';
import ContractorOnboardedReport from './components/reporting/ContractorOnboardedReport';
import ContractorVisitorReport from './components/reporting/ContractorVisitorReport';
import AuditLogReport from './components/reporting/AuditLogReport';
import CampusConfiguration from './components/settings/CampusConfiguration';
import SystemConfiguration from './components/settings/SystemConfiguration';
import RolesPermissions from './components/settings/RolesPermissions';
import IntegrationsDashboard from './components/settings/IntegrationsDashboard';
import UserManagement from './components/settings/UserManagement';
import SSOConfiguration from './components/settings/SSOConfiguration';
import Login from './components/Login';
import DashboardView from './components/dashboard/DashboardView';
import { useRole } from './context/RoleContext';
import AuthorizationService from './services/AuthorizationService';

// Auto-redirect helper if user navigates to a portal they don't have access to
const ProtectedRoute = ({ portalId, children }) => {
  const { sessionUser, isAuthenticated } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (portalId && sessionUser && !AuthorizationService.canView(sessionUser, portalId)) {
      // Find the first available portal they do have access to
      const firstAvailable = (sessionUser.portals && sessionUser.portals[0] === 'dashboard') 
        ? '/' 
        : (sessionUser.portals ? `/${sessionUser.portals[0]}` : '/');
      navigate(firstAvailable, { replace: true });
    }
  }, [sessionUser, portalId, navigate, location, isAuthenticated]);

  if (!isAuthenticated) return null;
  if (portalId && !AuthorizationService.canView(sessionUser, portalId)) return null;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardView />} />
        <Route path="visitor-list" element={<ProtectedRoute portalId="visitor"><VisitorList /></ProtectedRoute>} />
        <Route path="host" element={<ProtectedRoute portalId="host"><HostPortal /></ProtectedRoute>} />
        <Route path="security" element={<ProtectedRoute portalId="security"><SecurityPortal /></ProtectedRoute>} />
        <Route path="contractors-hub" element={<ProtectedRoute portalId="security"><ContractorHub /></ProtectedRoute>} />
        <Route path="admin/pass-requests" element={<ProtectedRoute portalId="security"><AdminPassRequests /></ProtectedRoute>} />
        <Route path="pass-approvals" element={<ProtectedRoute portalId="security"><PassApprovals /></ProtectedRoute>} />
        <Route path="check-in-out" element={<ProtectedRoute portalId="security"><CheckInOut /></ProtectedRoute>} />
        <Route path="active-visits" element={<ProtectedRoute portalId="security"><ActiveVisits /></ProtectedRoute>} />
        <Route path="visit-history" element={<ProtectedRoute portalId="security"><VisitHistory /></ProtectedRoute>} />
        <Route path="security-reviews" element={<ProtectedRoute portalId="security"><SecurityReviews /></ProtectedRoute>} />
        <Route path="contractor" element={<ProtectedRoute portalId="contractor"><ContractorHub /></ProtectedRoute>} />
        <Route path="contractor/:tab" element={<ProtectedRoute portalId="contractor"><ContractorHub /></ProtectedRoute>} />
        <Route path="contractor-registration" element={<ContractorRegistration />} />
        <Route path="reporting" element={<ProtectedRoute portalId="reporting"><ReportingPortal /></ProtectedRoute>} />
        
        {/* Reports */}
        <Route path="reports/visitor" element={<ProtectedRoute><VisitorReport /></ProtectedRoute>} />
        <Route path="reports/directory" element={<ProtectedRoute><VisitorDirectoryReport /></ProtectedRoute>} />
        <Route path="reports/contractor-onboarded" element={<ProtectedRoute portalId="security"><ContractorOnboardedReport /></ProtectedRoute>} />
        <Route path="reports/contractor-visitor" element={<ProtectedRoute portalId="security"><ContractorVisitorReport /></ProtectedRoute>} />
        <Route path="reports/audit" element={<ProtectedRoute portalId="security"><AuditLogReport /></ProtectedRoute>} />

        {/* Settings */}
        <Route path="settings/campus" element={<ProtectedRoute portalId="security"><CampusConfiguration /></ProtectedRoute>} />
        <Route path="settings/system" element={<ProtectedRoute portalId="security"><SystemConfiguration /></ProtectedRoute>} />
        <Route path="settings/roles" element={<ProtectedRoute portalId="security"><RolesPermissions /></ProtectedRoute>} />
        <Route path="settings/integrations" element={<ProtectedRoute portalId="security"><IntegrationsDashboard /></ProtectedRoute>} />
        <Route path="settings/users" element={<ProtectedRoute portalId="security"><UserManagement /></ProtectedRoute>} />
        <Route path="settings/sso" element={<ProtectedRoute portalId="security"><SSOConfiguration /></ProtectedRoute>} />

        {/* Global/Common Views */}
        <Route path="restricted" element={<ProtectedRoute portalId="security"><BlockedVisitors /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><div className="flex items-center justify-center min-h-[60vh]"><p className="text-slate-500 font-semibold">You have no new notifications.</p></div></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
