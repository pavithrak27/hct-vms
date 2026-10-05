import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, UserCheck, Shield, Briefcase, Activity, CheckCircle, Clock, Building2, FileSignature, AlertTriangle, Camera, Calendar, Smartphone, ChevronDown, BarChart3, TrendingUp, Zap, Server } from 'lucide-react';
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
                className="px-4 py-2 bg-indigo-50/50 dark:bg-slate-900 border-2 border-indigo-500 rounded-lg text-sm font-medium text-indigo-700 dark:text-indigo-400 outline-none flex items-center gap-6 shadow-sm cursor-pointer"
              >
                {dateFilter}
                <ChevronDown className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
              </button>
              
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-1 w-full min-w-[140px] bg-indigo-50/95 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-sm shadow-lg z-50 overflow-hidden">
                  {['Today', 'Last 7 Days', 'This Month', 'Custom Date'].map(option => (
                    <div 
                      key={option}
                      onClick={() => { setDateFilter(option); setIsFilterOpen(false); }}
                      className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${dateFilter === option ? 'bg-blue-300 text-slate-800' : 'text-indigo-700 dark:text-indigo-300 hover:bg-blue-300 hover:text-slate-800'}`}
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
                className="px-3 py-2 bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 shadow-sm"
              />
            )}
          </div>
          <button  
            onClick={() => handleExport('pdf')} 
            disabled={isExporting} 
            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
             {isExporting ? '...' : 'PDF'}
          </button>
          <button 
            onClick={() => handleExport('doc')} 
            disabled={isExporting} 
            className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
             {isExporting ? '...' : 'Document'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        
        {/* Core Entities - Left Column (Col span 3) */}
        <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-5">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-5 shadow-xl shadow-blue-900/20 text-white relative overflow-hidden h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl"><Server className="w-5 h-5 text-white"/></div>
            </div>
            <div className="mt-6 relative z-10">
              <p className="text-blue-100 font-medium text-xs mb-1 uppercase tracking-wider">Total Hosts</p>
              <h3 className="text-4xl font-black">15</h3>
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 relative overflow-hidden h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl"><Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400"/></div>
            </div>
            <div className="mt-6">
              <p className="text-slate-500 font-medium text-xs mb-1 uppercase tracking-wider">Total Contractors</p>
              <h3 className="text-4xl font-black text-slate-800 dark:text-white">13</h3>
            </div>
          </motion.div>
        </div>

        {/* Demographics Chart - Middle Large Section (Col span 6) */}
        <div className="md:col-span-12 lg:col-span-6 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><Users className="w-4 h-4 text-emerald-600"/></div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Registered Users by Role</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-[10px] font-bold">
               <Shield className="w-3.5 h-3.5"/> System Data
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-end mt-6 mb-2 relative z-10">
            <div className="flex items-end justify-between h-32 gap-3 sm:gap-6">
              {[
                { label: 'Hosts', val: 15, max: 20, color: 'from-blue-600 to-blue-400', hov: 'group-hover:from-blue-700 group-hover:to-blue-500' },
                { label: 'Contractors', val: 13, max: 20, color: 'from-emerald-500 to-emerald-400', hov: 'group-hover:from-emerald-600 group-hover:to-emerald-500' },
                { label: 'Guards', val: 8, max: 20, color: 'from-purple-600 to-purple-400', hov: 'group-hover:from-purple-700 group-hover:to-purple-500' },
                { label: 'Reception', val: 5, max: 20, color: 'from-orange-500 to-orange-400', hov: 'group-hover:from-orange-600 group-hover:to-orange-500' },
                { label: 'Admins', val: 2, max: 20, color: 'from-rose-500 to-rose-400', hov: 'group-hover:from-rose-600 group-hover:to-rose-500' },
              ].map((item, i) => (
                <div key={i} className="w-full relative group h-full flex items-end">
                   <div className="absolute inset-0 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg"></div>
                   <motion.div 
                     initial={{ height: 0 }} animate={{ height: `${(item.val / item.max) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                     className={`w-full bg-gradient-to-t ${item.color} rounded-t-lg relative z-10 ${item.hov} transition-all cursor-pointer`}
                   >
                     {/* Tooltip */}
                     <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.val} {item.label}
                     </div>
                   </motion.div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 px-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">
              <span className="w-full">Hosts</span>
              <span className="w-full">Contr.</span>
              <span className="w-full">Guards</span>
              <span className="w-full">Recept.</span>
              <span className="w-full">Admins</span>
            </div>
          </div>
        </div>

        {/* Requests & Approvals - Right Column (Col span 3) */}
        <div className="md:col-span-12 lg:col-span-3 flex flex-col gap-5">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 relative overflow-hidden flex-1">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Pending Requests</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-amber-500"/>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Requests</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white text-base">2</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-500"/>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Onboarding</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white text-base">0</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-rose-500"/>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Emp. Passes</span>
                </div>
                <span className="font-black text-slate-800 dark:text-white text-base">0</span>
              </div>
            </div>
          </div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-5 shadow-xl shadow-purple-900/20 text-white relative overflow-hidden">
             <div className="flex justify-between items-center relative z-10">
               <div>
                 <p className="text-purple-100 font-medium text-[10px] mb-1 uppercase tracking-wider">Pre-Approve</p>
                 <h3 className="text-2xl font-black">0</h3>
               </div>
               <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl"><Shield className="w-5 h-5 text-white"/></div>
             </div>
          </motion.div>
        </div>

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
