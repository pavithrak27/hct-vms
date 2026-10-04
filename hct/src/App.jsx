import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, UserCheck, Shield, Briefcase, Activity, CheckCircle, Clock, Building2, FileSignature, AlertTriangle, Camera, Calendar, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import VisitorPortal from './components/visitor/VisitorPortal';
import HostPortal from './components/host/HostPortal';
import SecurityPortal from './components/security/SecurityPortal';
import ContractorApprovals from './components/security/ContractorApprovals';
import EmployeeApprovals from './components/security/EmployeeApprovals';
import PassApprovals from './components/security/PassApprovals';
import AdminPassRequests from './components/security/AdminPassRequests';
import AdminGeneratedPasses from './components/security/AdminGeneratedPasses';
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
import { useRole } from './context/RoleContext';

const DashboardView = () => {
  const { currentRole } = useRole();

  if (!currentRole.portals.includes('dashboard')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Restricted</h2>
        <p className="text-slate-500 max-w-md">Your current simulated role ({currentRole.label}) does not have access to the administrative dashboard. Please select an available module from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{currentRole.label} Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Overview of system modules and current campus activity.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Total Visitors', val: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', b1: '^ +14.2%', b1c: 'text-emerald-500', b2: 'vs last 24h' },
          { title: 'Active On-Site', val: '84', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', b1: 'Real-time occupancy', b1c: 'text-slate-500', b2: 'Cap: 78%' },
          { title: 'Pending Approvals', val: '12', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', b1: 'Requires host action', b1c: 'text-slate-500', b2: 'Avg. wait: 4m' },
          { title: 'Restricted Hits', val: '3', icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', b1: 'Intercepted at Gate 1', b1c: 'text-slate-500 font-bold text-red-500 flex items-center gap-1', b2: 'Flagged list' },
          { title: 'Active Contractors', val: '45', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', b1: '8 active work zones', b1c: 'text-purple-500 font-bold', b2: 'Shift #1' },
          { title: 'Contractor Passes', val: '320', icon: FileSignature, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', b1: 'Total digital permits issued', b1c: 'text-slate-500', b2: 'Valid', b2c: 'text-blue-500 font-bold' },
          { title: 'Security Alerts', val: '5', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', b1: '2 critical, 3 tailgating', b1c: 'text-amber-600 font-bold', b2: 'Review' },
          { title: 'Vehicles Logged', val: '128', icon: Camera, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-500/10', b1: 'ANPR Barrier Gates #1 & #2', b1c: 'text-slate-500', b2: '99.8% match', b2c: 'text-emerald-500 font-bold' }
        ].map((card, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -12, scale: 1.03, rotateX: 2, rotateY: -2 }} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15,
              delay: i * 0.05 // stagger effect on load
            }} 
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-tr-[32px] rounded-bl-[32px] rounded-tl-xl rounded-br-xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all flex flex-col relative overflow-hidden group cursor-pointer"
          >
            {/* Massive Glowing blur that expands heavily on hover */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 ${card.bg} rounded-full blur-[50px] opacity-40 pointer-events-none group-hover:w-72 group-hover:h-72 group-hover:opacity-80 transition-all duration-700 ease-out z-0`}></div>
            
            {/* Interactive Color overlay that washes over the card on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/40 dark:group-hover:from-white/5 transition-all duration-500 z-0`}></div>

            <div className="flex justify-between items-start mb-3 relative z-10">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors duration-300">{card.title}</span>
              <div className={`w-10 h-10 rounded-tr-[16px] rounded-bl-[16px] rounded-tl-md rounded-br-md flex items-center justify-center shadow-sm ${card.bg} group-hover:scale-110 group-hover:rotate-[15deg] group-hover:shadow-lg transition-all duration-300 ease-out`}>
                 <card.icon className={`w-5 h-5 ${card.color} group-hover:animate-pulse`} />
              </div>
            </div>
            
            <div className="text-3xl font-medium tracking-tight text-slate-700 dark:text-white mt-0 mb-5 relative z-10 flex items-center gap-2">
              {card.val}
              {/* Little animated ping indicating live data on hover */}
              <span className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></span>
            </div>
            
            <div className="mt-auto flex justify-between items-center text-[11px] relative z-10 pt-3 border-t border-slate-100 dark:border-slate-800/50">
               {/* Animated Progress Line that shoots across the border on hover */}
               <div className={`absolute top-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700 ease-in-out ${card.bg.split(' ')[0].replace('bg-', 'bg-').replace('-50', '-500')}`}></div>
               
               <span className={`flex items-center gap-1 ${card.b1c || 'text-slate-500'} group-hover:translate-x-1 transition-transform duration-300`}>
                 {card.b1.includes('Intercepted') && <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1"></div>}
                 {card.b1}
               </span>
               <span className={`font-medium ${card.b2c || 'text-slate-400'} group-hover:-translate-x-1 transition-transform duration-300`}>{card.b2}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Quick Access Modules */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Quick Access Modules
            </h3>
            <span className="text-xs font-medium text-slate-400">4 Core Systems</span>
          </div>
          <div className="space-y-4">
            {[
              { id: 'visitor', title: 'Visitor Management', desc: 'Walk-in & Pre-Scheduled registration', to: '/visitor', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', badge: 'Fast Pass', badgeColor: 'text-blue-500 border-blue-200 dark:border-blue-500/30' },
              { id: 'host', title: 'Host Approvals', desc: 'Manage visitor approvals', to: '/host', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', badge: '12 Pending', badgeColor: 'text-emerald-500 border-emerald-200 dark:border-emerald-500/30' },
              { id: 'security', title: 'Gate Security', desc: 'Live barrier & access control', to: '/security', icon: Shield, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', badge: 'Active Lockout', badgeColor: 'text-red-500 border-red-200 dark:border-red-500/30' },
              { id: 'contractor', title: 'Contractor Desk', desc: 'Pass validation & induction logs', to: '/contractor', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', badge: '45 On-Site', badgeColor: 'text-purple-500 border-purple-200 dark:border-purple-500/30' }
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                <Link to={item.to} className="flex items-center gap-4 p-4 border border-white/50 dark:border-white/10 rounded-2xl hover:border-white dark:hover:border-white/20 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-md hover:shadow-lg group">
                  <div className={`p-3 rounded-xl border border-white/50 dark:border-white/5 shadow-sm group-hover:scale-110 transition-transform ${item.bg}`}>
                     <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1">
                     <div className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</div>
                     <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </div>
                  <span className="text-slate-300 dark:text-slate-600 font-bold ml-2">{`>`}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Recent Live Activity Timeline */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-lg shadow-black/5">
           <div className="flex justify-between items-end mb-8">
             <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
               <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
               Recent Live Activity
             </h3>
             <button className="text-xs font-bold text-blue-500 hover:underline">View full log →</button>
           </div>
           
           <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-2.5 before:w-px before:bg-slate-200 dark:before:bg-white/10">
             {[
               { time: 'Just now', title: 'Walk-in visitor checked in', msg: 'Location: Dubai Men\'s Campus • Badge #WK-9021 issued', type: 'text-emerald-500 border-emerald-500', badge: 'bg-emerald-50 text-emerald-600' },
               { time: '5m ago', title: 'Contractor passes submitted', msg: 'Contractor XYZ Corp submitted 5 employee passes for Zone 4 maintenance', type: 'text-blue-500 border-blue-500', badge: 'bg-blue-50 text-blue-600' },
               { time: '14m ago', title: 'Host approval granted', msg: 'Approved by Dr. Tariq for VIP guest arrival at Innovation Hall', type: 'text-purple-500 border-purple-500', badge: 'bg-purple-50 text-purple-600' },
               { time: '28m ago', title: 'Vehicle camera recognition', msg: 'Plate DXB-8941 logged at Gate 2 Barrier. Clear access authorized.', type: 'text-cyan-500 border-cyan-500', badge: 'bg-cyan-50 text-cyan-600' }
             ].map((log, i) => (
               <div key={i} className="relative">
                  {/* Timeline node */}
                  <div className={`absolute -left-6 mt-1 w-3.5 h-3.5 rounded-full border-2 bg-white/80 dark:bg-slate-900 ${log.type}`}></div>
                  
                  <div className="flex items-start justify-between">
                     <div>
                       <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-1">{log.title}</h4>
                       <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">{log.msg}</p>
                     </div>
                     <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.badge} dark:bg-white/5`}>{log.time}</span>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="mt-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-8 shadow-lg shadow-black/5 transition-colors duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-hct-blue dark:text-blue-400" /> Today's Expected Visitors (Pre-Scheduled)
          </h3>
          <button className="text-sm font-bold text-hct-blue dark:text-blue-400 hover:underline dark:hover:text-blue-300">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/40 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-white/30 dark:border-white/10">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider">Visitor Name</th>
                <th className="p-4 font-bold uppercase tracking-wider">Company/Org</th>
                <th className="p-4 font-bold uppercase tracking-wider">Host</th>
                <th className="p-4 font-bold uppercase tracking-wider">Time Window</th>
                <th className="p-4 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-bold text-slate-800 dark:text-white">Michael Chang</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Tech Solutions LLC</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Dr. Ahmed</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">09:00 AM - 11:00 AM</td>
                <td className="p-4"><span className="px-3 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-transparent dark:border dark:border-green-500/30 rounded-full font-bold text-xs dark:shadow-[0_0_10px_rgba(34,197,94,0.2)]">Arrived</span></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-bold text-slate-800 dark:text-white">Sarah Parker</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Ministry of Education</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Jane Doe</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">01:00 PM - 03:00 PM</td>
                <td className="p-4"><span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-transparent dark:border dark:border-amber-500/30 rounded-full font-bold text-xs dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]">Expected</span></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-bold text-slate-800 dark:text-white">Ali Hassan</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Global Services</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">Facilities Dept</td>
                <td className="p-4 text-slate-600 dark:text-slate-300">02:30 PM - 05:00 PM</td>
                <td className="p-4"><span className="px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-transparent dark:border dark:border-amber-500/30 rounded-full font-bold text-xs dark:shadow-[0_0_10px_rgba(245,158,11,0.2)]">Expected</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Auto-redirect helper if user navigates to a portal they don't have access to
const ProtectedRoute = ({ portalId, children }) => {
  const { currentRole, isAuthenticated } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (portalId && currentRole && !currentRole.portals.includes(portalId)) {
      // Find the first available portal they do have access to
      const firstAvailable = currentRole.portals[0] === 'dashboard' ? '/' : `/${currentRole.portals[0]}`;
      navigate(firstAvailable, { replace: true });
    }
  }, [currentRole, portalId, navigate, location, isAuthenticated]);

  if (!isAuthenticated) return null;
  if (portalId && !currentRole.portals.includes(portalId)) return null;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardView />} />
        <Route path="visitor" element={<ProtectedRoute portalId="visitor"><VisitorPortal /></ProtectedRoute>} />
        <Route path="host" element={<ProtectedRoute portalId="host"><HostPortal /></ProtectedRoute>} />
        <Route path="security" element={<ProtectedRoute portalId="security"><SecurityPortal /></ProtectedRoute>} />
        <Route path="contractor-approvals" element={<ProtectedRoute portalId="security"><ContractorApprovals /></ProtectedRoute>} />
        <Route path="employee-approvals" element={<ProtectedRoute portalId="security"><EmployeeApprovals /></ProtectedRoute>} />
        <Route path="pass-approvals" element={<ProtectedRoute portalId="security"><PassApprovals /></ProtectedRoute>} />
        <Route path="admin-pass-requests" element={<ProtectedRoute portalId="security"><AdminPassRequests /></ProtectedRoute>} />
        <Route path="admin-generated-passes" element={<ProtectedRoute portalId="security"><AdminGeneratedPasses /></ProtectedRoute>} />
        <Route path="check-in-out" element={<ProtectedRoute portalId="security"><CheckInOut /></ProtectedRoute>} />
        <Route path="active-visits" element={<ProtectedRoute portalId="security"><ActiveVisits /></ProtectedRoute>} />
        <Route path="visit-history" element={<ProtectedRoute portalId="security"><VisitHistory /></ProtectedRoute>} />
        <Route path="blocked-visitors" element={<ProtectedRoute portalId="security"><BlockedVisitors /></ProtectedRoute>} />
        <Route path="security-reviews" element={<ProtectedRoute portalId="security"><SecurityReviews /></ProtectedRoute>} />
        <Route path="contractor" element={<ProtectedRoute portalId="contractor"><ContractorPortal /></ProtectedRoute>} />
        <Route path="contractor/:tab" element={<ProtectedRoute portalId="contractor"><ContractorPortal /></ProtectedRoute>} />
        <Route path="contractor-registration" element={<ContractorRegistration />} />
        <Route path="reporting" element={<ProtectedRoute portalId="reporting"><ReportingPortal /></ProtectedRoute>} />
        
        {/* Reports */}
        <Route path="reports/visitor" element={<ProtectedRoute portalId="security"><VisitorReport /></ProtectedRoute>} />
        <Route path="reports/directory" element={<ProtectedRoute portalId="security"><VisitorDirectoryReport /></ProtectedRoute>} />
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
      </Route>
    </Routes>
  );
}

export default App;
