import React from 'react';
import { useRole } from '../../context/RoleContext';
import SuperadminDashboard from './dashboards/SuperadminDashboard';
import CampusAdminDashboard from './dashboards/CampusAdminDashboard';
import HostDashboard from './dashboards/HostDashboard';
import VisitorDashboard from './dashboards/VisitorDashboard';
import SecurityDashboard from './dashboards/SecurityDashboard';
import ContractorDashboard from './dashboards/ContractorDashboard';
import ApproverDashboard from './dashboards/ApproverDashboard';
import ReceptionDashboard from './dashboards/ReceptionDashboard';
import { Shield } from 'lucide-react';

export default function DashboardView() {
  const { currentRole } = useRole();

  if (!currentRole) return null;

  switch (currentRole.id) {
    case 'superadmin':
      return <SuperadminDashboard />;
    case 'campusadmin':
      return <SuperadminDashboard />;
    case 'host':
      return <HostDashboard />;
    case 'visitor':
      return <VisitorDashboard />;
    case 'security':
      return <SecurityDashboard />;
    case 'contractor':
      return <ContractorDashboard />;
    case 'approver':
      return <HostDashboard />;
    case 'reception':
      return <ReceptionDashboard />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Access Restricted</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Your current simulated role ({currentRole.label}) does not have an assigned dashboard.
          </p>
        </div>
      );
  }
}
