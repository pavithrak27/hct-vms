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
import { useRole } from './context/RoleContext';

const DashboardView = () => {
  const { currentRole } = useRole();
  const [dateFilter, setDateFilter] = React.useState('Today');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [customDate, setCustomDate] = React.useState('');
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`${format.toUpperCase()} export generated successfully!`);
    }, 1500);
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{currentRole.label} Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Overview of system modules and current campus activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)} 
                className="px-4 py-2 bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 dark:border-indigo-800 rounded-xl text-sm font-semibold text-indigo-700 dark:text-indigo-400 outline-none flex items-center gap-3 shadow-sm cursor-pointer transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {dateFilter}
                <ChevronDown className="w-4 h-4 opacity-70" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-1 w-full min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden">
                  {['Today', 'Last 7 Days', 'This Month', 'Custom Date'].map(option => (
                    <div 
                      key={option}
                      onClick={() => { setDateFilter(option); setIsFilterOpen(false); }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${dateFilter === option ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900'}`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {dateFilter === 'Custom Date' && (
              <input 
                type="date" 
                value={customDate} 
                onChange={(e) => setCustomDate(e.target.value)} 
                className="px-3 py-2 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 shadow-sm"
              />
            )}
          </div>
          <button  
            onClick={() => handleExport('pdf')} 
            disabled={isExporting} 
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
             {isExporting ? <span className="animate-pulse">Exporting...</span> : <><Download className="w-4 h-4" /> PDF</>}
          </button>
          <button 
            onClick={() => handleExport('doc')} 
            disabled={isExporting} 
            className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
             {isExporting ? <span className="animate-pulse">Exporting...</span> : <><FileText className="w-4 h-4" /> Document</>}
          </button>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {(() => {
          const dashboardCards = [
            { title: 'Total No of Host', value: '15', icon: UserCheck, color: 'blue' },
            { title: 'Total No of Contractor', value: '13', icon: Briefcase, color: 'emerald' },
            { title: 'Total No of Request', value: '2', icon: FileSignature, color: 'amber' },
            { title: 'Walkin Approved Count', value: '0', icon: CheckCircle, color: 'cyan' },
            { title: 'Pre-Approve Approved Count', value: '0', icon: Shield, color: 'indigo' },
            { title: 'Today Visitor Count', value: '0', icon: Users, color: 'purple' },
            { title: 'Today Checked In Count', value: '0', icon: Activity, color: 'green' },
            { title: 'Today Checked Out Count', value: '0', icon: Clock, color: 'slate' },
            { title: 'Contractor Onboard Request Count', value: '0', icon: Building2, color: 'orange' },
            { title: 'Contractor Employee Pass Request Count', value: '0', icon: FileSignature, color: 'rose' },
          ];

          const colorMap = {
            blue: { grad: 'from-blue-500 to-indigo-500', icon: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30' },
            emerald: { grad: 'from-emerald-500 to-teal-500', icon: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' },
            amber: { grad: 'from-amber-500 to-orange-500', icon: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/30' },
            cyan: { grad: 'from-cyan-500 to-blue-500', icon: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-900/30' },
            indigo: { grad: 'from-indigo-500 to-purple-500', icon: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/30' },
            purple: { grad: 'from-purple-500 to-pink-500', icon: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30' },
            green: { grad: 'from-green-500 to-emerald-500', icon: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30' },
            slate: { grad: 'from-slate-500 to-gray-500', icon: 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800' },
            orange: { grad: 'from-orange-500 to-amber-500', icon: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30' },
            rose: { grad: 'from-rose-500 to-pink-500', icon: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-900/30' },
          };

          return dashboardCards.map((card, i) => {
            const Icon = card.icon;
            const style = colorMap[card.color];

            return (
              <motion.div 
                key={i}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 }, hover: { y: -5 } }} 
                whileHover="hover" 
                className="relative group overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl rounded-tr-[3rem] p-6 shadow-xl hover:shadow-2xl border border-white/60 dark:border-slate-700/50 flex flex-col justify-between h-40 transition-all duration-300"
              >
                {/* Animated Glow Background */}
                <div className={`absolute -inset-4 bg-gradient-to-r ${style.grad} opacity-0 group-hover:opacity-[0.15] blur-2xl transition-opacity duration-700 pointer-events-none`} />
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <h4 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2 line-clamp-2 pr-2">{card.title}</h4>
                    <div className={`h-0.5 w-8 rounded-full mb-2 bg-gradient-to-r ${style.grad}`}></div>
                  </div>
                  
                  <motion.div 
                    variants={{ hover: { scale: 1.1, rotate: 5 } }} 
                    className={`p-3 rounded-2xl shadow-inner border border-white/50 dark:border-slate-700/50 ${style.icon}`}
                  >
                    <Icon className="w-5 h-5"/>
                  </motion.div>
                </div>
                
                <div className="relative z-10 flex items-end justify-between">
                  <h3 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tighter">
                    {card.value}
                  </h3>
                </div>
                
                {/* Animated Bottom Border Line */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${style.grad} w-0 group-hover:w-full transition-all duration-500 ease-out`}></div>
              </motion.div>
            );
          });
        })()}
      </motion.div>



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
                <Link to={item.to} className="flex items-center gap-4 p-4 border border-white/50 dark:border-white/10 rounded-2xl hover:border-white dark:hover:border-white/20 transition-all bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-md hover:shadow-lg group">
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
        <div className="bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-lg shadow-black/5">
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

      <div className="mt-8 bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-2xl p-8 shadow-lg shadow-black/5 transition-colors duration-300">
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
