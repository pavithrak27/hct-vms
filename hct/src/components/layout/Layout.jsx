import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, Users, UserCheck, Briefcase, BarChart3, ChevronDown, ChevronRight, Settings, Bell, Mail, MessageSquare, Smartphone, Sun, Moon, MapPin, LogOut, Plus, Building, Trash2, Menu, FileSignature, QrCode, CheckSquare, ScanLine, Clock, History, ShieldAlert, FileSearch, FileText, BookOpen, HardHat, FileSpreadsheet, Database, Building2, Sliders, ShieldCheck, Cpu, KeyRound, UserCog, UserPlus, Calendar , Camera } from 'lucide-react';
import { useRole, CAMPUSES } from '../../context/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import { useCampus } from '../../context/CampusContext';

const HctLogo = ({ className }) => (
  <img src="/hct-logo.png" alt="HCT Logo" className={className} style={{ width: "auto", height: "auto" }} />
);

const Layout = () => {
  const location = useLocation();
  const { currentRole, logout, sessionUser, userCampuses, activeCampus, setActiveCampus } = useRole();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showCampusMenu, setShowCampusMenu] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configTab, setConfigTab] = useState('notifications');
  const [newCampusName, setNewCampusName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('ALL');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'approval', category: 'Approvals', title: 'New Visitor Approval Request', desc: 'John Smith requested access for Abu Dhabi Men\'s Campus', time: '5 mins ago', read: false, link: '/visitor-approvals' },
    { id: 2, type: 'security', category: 'Security', title: 'Security Alert: Expired Pass', desc: 'Robert Taylor attempted turnstile entry with expired credentials', time: '20 mins ago', read: false, link: '/security-reviews' },
    { id: 3, type: 'contractor', category: 'Contractor', title: 'Gate Pass Request Submitted', desc: 'Tech Solutions LLC submitted pass request PR-102 for 3 technicians', time: '1 hour ago', read: false, link: '/pass-approvals' },
    { id: 4, type: 'system', category: 'System', title: 'Daily Audit Log Backup Complete', desc: 'System completed automated snapshot backup for all campuses', time: '3 hours ago', read: true, link: '/reports/audit' }
  ]);


  const toggleMenu = (menuName, currentlyExpanded) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !currentlyExpanded }));
  };

  const handleAddCampus = (e) => {
    e.preventDefault();
    alert('Campus management moved to Campus Configuration under Settings.');
    setNewCampusName('');
  };

  
  const ROLE_NAVIGATION = {
    host: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      
      { isHeader: true, name: 'Visitor', icon: Users },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText, isSubItem: true },
      { id: 'visitor-approvals', name: 'Visitor Approvals', href: '/visitor-approvals', icon: CheckSquare, isSubItem: true },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: ShieldCheck, isSubItem: true },
      
      { id: 'pass-approvals', name: 'Contractor Approvals', href: '/pass-approvals', icon: CheckSquare },
      
      { isHeader: true, name: 'Reports', icon: BarChart3 },
      { id: 'reports', name: 'Visitor Reports', href: '/reports/visitor', icon: BarChart3, isSubItem: true },
      { id: 'reports-contractor', name: 'Contractor Visitor Report', href: '/reports/contractor-visitor', icon: FileSpreadsheet, isSubItem: true },
    ],
    visitor: [
      { id: 'registration', name: 'Registration', href: '/visitor-list', icon: FileText },
      { id: 'my-visit', name: 'My Visit', href: '/', icon: Calendar },
      { id: 'my-pass', name: 'My Pass', href: '/visitor-list?pass=true', icon: QrCode },
      { id: 'profile', name: 'Profile', href: '/profile', icon: UserCog },
    ],
    security: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      
      { isHeader: true, name: 'Operations & Security', icon: ShieldCheck },
      { id: 'check-in-out', name: 'Check-in / Check-out', href: '/check-in-out', icon: CheckSquare, isSubItem: true },
      { id: 'security-reviews', name: 'Security Review', href: '/security-reviews', icon: ShieldAlert, isSubItem: true },
      
      { isHeader: true, name: 'Visitor', icon: Users },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText, isSubItem: true },
      { id: 'visitor-approvals', name: 'Visitor Approvals', href: '/visitor-approvals', icon: CheckSquare, isSubItem: true },
      
      { isHeader: true, name: 'Contractor', icon: Briefcase },
      { id: 'contractor-passes', name: 'Contractor Passes', href: '/admin/pass-requests', icon: Briefcase, isSubItem: true },
      
      { isHeader: true, name: 'Reports', icon: BarChart3 },
      { id: 'reports-visitor', name: 'Visitors Report', href: '/reports/visitor', icon: FileText, isSubItem: true },
      { id: 'reports-contractor', name: 'Contractor Visitor Report', href: '/reports/contractor-visitor', icon: FileSpreadsheet, isSubItem: true },
    ],
    contractor: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'contractor-hub', name: 'My Company', href: '/contractor', icon: Building },
      { id: 'reports-visitor', name: 'Contractor Visitor Report', href: '/reports/contractor-visitor', icon: FileSpreadsheet },
    ],
    reception: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'walk-in', name: 'Walk-in Registration', href: '/visitor-list?new=true', icon: Plus },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText },
      { id: 'visitor-approvals', name: 'Visitor Approvals', href: '/visitor-approvals', icon: CheckSquare },
      { id: 'qr-scanner', name: 'QR Scanner', href: '/qr-scanner', icon: ScanLine },
      { id: 'check-in-out', name: 'Check-in / Check-out', href: '/check-in-out', icon: CheckSquare },
      { id: 'security-reviews', name: 'Security Review', href: '/security-reviews', icon: ShieldAlert },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: Clock },
      { id: 'history', name: 'Visitor History', href: '/visit-history', icon: History },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    campusadmin: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      
      { isHeader: true, name: 'Visitor', icon: Users },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText, isSubItem: true },
      { id: 'visitor-approvals', name: 'Visitor Approvals', href: '/visitor-approvals', icon: CheckSquare, isSubItem: true },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: ShieldCheck, isSubItem: true },
      
      { isHeader: true, name: 'Contractor', icon: Briefcase },
      { id: 'contractor-hub', name: 'Contractor Management', href: '/contractors-hub', icon: Building, isSubItem: true },
      { id: 'pass-requests', name: 'Pass Request', href: '/admin/pass-requests', icon: FileSignature, isSubItem: true },
      { id: 'pass-approvals', name: 'Approvals', href: '/pass-approvals', icon: CheckSquare, isSubItem: true },

      { isHeader: true, name: 'Reports & Operations', icon: BarChart3 },
      { id: 'security-reviews', name: 'Security Review', href: '/security-reviews', icon: ShieldAlert, isSubItem: true },
      { id: 'reports', name: 'Reports', href: '/reporting', icon: BarChart3, isSubItem: true },
      { id: 'audit', name: 'Audit Logs', href: '/reports/audit', icon: Database, isSubItem: true },

      { isHeader: true, name: 'Settings', icon: Settings },
      { id: 'users', name: 'Users', href: '/settings/users', icon: UserCog, isSubItem: true },
      { id: 'roles', name: 'Roles & Permissions', href: '/settings/roles', icon: ShieldCheck, isSubItem: true },
      { id: 'campus-settings', name: 'Campus Settings', href: '/settings/campus', icon: Building2, isSubItem: true },
      { id: 'system-settings', name: 'System Settings', href: '/settings/system', icon: Settings, isSubItem: true },
      { id: 'profile', name: 'Profile', href: '/profile', icon: UserCog, isSubItem: true },
    ],
    superadmin: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      
      { isHeader: true, name: 'Visitor', icon: Users },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText, isSubItem: true },
      { id: 'visitor-approvals', name: 'Visitor Approvals', href: '/visitor-approvals', icon: CheckSquare, isSubItem: true },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: ShieldCheck, isSubItem: true },
      
      { isHeader: true, name: 'Contractor', icon: Briefcase },
      { id: 'contractor-hub', name: 'Contractor Management', href: '/contractors-hub', icon: Building, isSubItem: true },
      { id: 'pass-requests', name: 'Pass Request', href: '/admin/pass-requests', icon: FileSignature, isSubItem: true },
      { id: 'pass-approvals', name: 'Approvals', href: '/pass-approvals', icon: CheckSquare, isSubItem: true },

      { isHeader: true, name: 'Reports & Operations', icon: BarChart3 },
      { id: 'security-reviews', name: 'Security Review', href: '/security-reviews', icon: ShieldAlert, isSubItem: true },
      { id: 'reports', name: 'Reports', href: '/reporting', icon: BarChart3, isSubItem: true },
      { id: 'audit', name: 'Audit Logs', href: '/reports/audit', icon: Database, isSubItem: true },

      { isHeader: true, name: 'Settings', icon: Settings },
      { id: 'users', name: 'Users', href: '/settings/users', icon: UserCog, isSubItem: true },
      { id: 'roles', name: 'Roles & Permissions', href: '/settings/roles', icon: ShieldCheck, isSubItem: true },
      { id: 'campus-settings', name: 'Campus Settings', href: '/settings/campus', icon: Building2, isSubItem: true },
      { id: 'system-settings', name: 'System Settings', href: '/settings/system', icon: Settings, isSubItem: true },
      { id: 'profile', name: 'Profile', href: '/profile', icon: UserCog, isSubItem: true },
    ]
  };

  if (!currentRole) return null;

  Object.keys(ROLE_NAVIGATION).forEach(role => {
    if (!ROLE_NAVIGATION[role].find(item => item.id === 'profile')) {
      ROLE_NAVIGATION[role].push({ id: 'profile', name: 'Profile', href: '/profile', icon: UserCog });
    }
  });

  const navigation = ROLE_NAVIGATION[currentRole.id] || [];


  return (
    <div 
      className="min-h-screen text-slate-900 dark:text-slate-100 flex transition-colors duration-300 relative bg-slate-50 dark:bg-slate-950"
      style={{
        backgroundImage: "url('/light-visitor-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-slate-900/5 dark:bg-slate-950/80 backdrop-blur-sm z-0 pointer-events-none"></div>
      
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-[88px]' : 'w-[280px]'} transition-all duration-300 ease-in-out bg-gradient-to-b from-[#000a29] via-[#00144d] to-[#00249c] dark:bg-slate-950 backdrop-blur-xl border-r border-[#00249c]/30 dark:border-white/10 shrink-0 flex flex-col fixed h-full z-20 shadow-[10px_0_40px_rgba(0,20,77,0.15)] overflow-hidden`}>
        <div className={`p-6 ${isCollapsed ? 'px-4' : ''}`}>
          <div className={`flex flex-col items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="bg-white p-2 rounded-xl shadow-md w-full flex justify-center">
              <HctLogo className={`${isCollapsed ? 'h-8' : 'h-10'} w-auto object-contain`} />
            </div>

          </div>
        </div>
        
        <div className={`p-4 flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-2' : ''}`}>
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-4 px-4">
              <span className="text-xs font-bold text-blue-200/50">{currentRole.label} Menu</span>
              <div className="w-1.5 h-1.5 rounded-full bg-hct-blue shadow-[0_0_8px_rgba(0,36,156,0.8)]"></div>
            </div>
          )}
          <nav className="space-y-1 pb-4">
            {(() => {
              let currentHeader = null;
              return navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = item.href !== '#' && (
                  location.pathname === item.href || 
                  (item.href !== '/' && item.href !== '/contractor' && location.pathname.startsWith(item.href + '/'))
                );
                
                if (item.isHeader) {
                  currentHeader = item.name;
                  
                  // Determine if any child item under this header is currently active
                  let hasActiveChild = false;
                  for (let i = index + 1; i < navigation.length; i++) {
                    if (navigation[i].isHeader) break;
                    if (navigation[i].isSubItem) {
                      const subHref = navigation[i].href;
                      if (subHref && subHref !== '#' && (location.pathname === subHref || (subHref !== '/' && location.pathname.startsWith(subHref)))) {
                        hasActiveChild = true;
                        break;
                      }
                    }
                  }

                  const isExpanded = expandedMenus[item.name] !== undefined 
                    ? expandedMenus[item.name] 
                    : hasActiveChild; // Default collapsed unless a child item is active

                  return (
                    <button 
                      key={`header-${index}`} 
                      onClick={() => toggleMenu(item.name, isExpanded)}
                      className={`w-full pt-6 pb-2 flex items-center justify-between group outline-none ${isCollapsed ? 'justify-center px-4' : 'px-6'}`}
                    >
                      <div className="flex items-center gap-3">
                        {isCollapsed && <Icon className="w-5 h-5 text-blue-200/40 group-hover:text-blue-200/80 transition-colors" />}
                        {!isCollapsed && <span className="text-sm font-bold text-blue-200/50 group-hover:text-blue-200/90 transition-colors">{item.name}</span>}
                      </div>
                      {!isCollapsed && (
                        isExpanded ? <ChevronDown className="w-4 h-4 text-blue-200/40 group-hover:text-blue-200/80 transition-colors" /> : <ChevronRight className="w-4 h-4 text-blue-200/40 group-hover:text-blue-200/80 transition-colors" />
                      )}
                    </button>
                  );
                }

                // Check header expansion state for sub-items
                if (item.isSubItem && currentHeader && !isCollapsed) {
                  let hasActiveChild = false;
                  for (let i = 0; i < navigation.length; i++) {
                    if (navigation[i].isHeader && navigation[i].name === currentHeader) {
                      for (let j = i + 1; j < navigation.length; j++) {
                        if (navigation[j].isHeader) break;
                        if (navigation[j].isSubItem) {
                          const subHref = navigation[j].href;
                          if (subHref && subHref !== '#' && (location.pathname === subHref || (subHref !== '/' && location.pathname.startsWith(subHref)))) {
                            hasActiveChild = true;
                            break;
                          }
                        }
                      }
                      break;
                    }
                  }
                  
                  const isHeaderExpanded = expandedMenus[currentHeader] !== undefined 
                    ? expandedMenus[currentHeader] 
                    : hasActiveChild;

                  if (!isHeaderExpanded) {
                    return null;
                  }
                }



                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 py-2.5 transition-all group relative overflow-hidden ${isCollapsed ? 'justify-center px-4 mx-2 rounded-xl' : 'px-6'} ${item.isSubItem && !isCollapsed ? 'pl-10 text-sm' : ''} ${
                      isActive 
                        ? 'text-white bg-white/5' 
                        : 'text-blue-100/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {/* Active Left Border Indicator */}
                    {isActive && !isCollapsed && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                    )}
                    
                    {/* Active dot indicator for collapsed mode */}
                    {isActive && isCollapsed && (
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                    )}
                    
                    <Icon className={`${item.isSubItem ? 'w-[18px] h-[18px]' : 'w-5 h-5'} shrink-0 ${isActive ? 'text-blue-400' : 'text-blue-200/40 group-hover:text-blue-200/80 transition-colors'}`} />
                    
                    {!isCollapsed && <span className={`font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.name}</span>}
                  </Link>
                );
              });
            })()}
          </nav>
        </div>

        {/* User Profile / Logout */}
        <div className={`mt-auto p-6 ${isCollapsed ? 'px-3' : ''}`}>
          <div className={`flex items-center p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-sm group ${isCollapsed ? 'justify-center flex-col gap-4' : 'justify-between'}`}>
             <Link to="/profile" className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
               <div className="w-10 h-10 bg-hct-blue rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-xs tracking-wider shadow-[0_0_15px_rgba(0,36,156,0.8)]">
                 {currentRole.label.substring(0,2).toUpperCase()}
               </div>
               {!isCollapsed && (
                 <div className="whitespace-nowrap">
                   <div className="text-sm font-black text-white">{sessionUser?.name || currentRole.label}</div>
                   <div className="text-[10px] font-bold text-emerald-400 uppercase flex items-center gap-1 mt-0.5">
                     <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                     {sessionUser?.email || 'Active Session'}
                   </div>
                 </div>
               )}
             </Link>
             <button 
               onClick={logout}
               className="p-2 bg-white/5 hover:bg-hct-blue text-blue-200/50 hover:text-white rounded-xl transition-all border border-white/10 hover:border-transparent shadow-lg"
               title="Logout"
             >
               <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-[88px]' : 'ml-[280px]'}`}>
        <header className="h-[72px] mx-8 mt-6 mb-4 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-slate-700/50 shadow-[0_15px_40px_rgba(0,0,0,0.12)] rounded-[28px] flex items-center justify-between px-6 sticky top-6 z-40 transition-all duration-300">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsCollapsed(!isCollapsed)}
               className="p-2 -ml-2 rounded-xl text-slate-400 hover:bg-white/10 hover:text-white transition-all"
             >
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="text-xl font-bold text-white capitalize flex items-center gap-2 flex-wrap">
               <span className="text-slate-400 font-normal flex items-center gap-2">
                 {currentRole.label} View
                 <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1 normal-case">
                   <MapPin className="w-3 h-3 text-blue-400" />
                   {currentRole.id === 'campusadmin' ? (activeCampus !== 'ALL' ? (CAMPUSES.find(c => c.id === activeCampus)?.name || activeCampus) : "Abu Dhabi Men's Campus") : (activeCampus === 'ALL' ? 'All Campuses' : (CAMPUSES.find(c => c.id === activeCampus)?.name || activeCampus || "Abu Dhabi Men's Campus"))}
                 </span>
                 /
               </span>
               {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1].replace('-', ' ')}
             </h1>
           </div>
           
           <div className="flex items-center gap-4">
             {/* Campus Selector */}
             {currentRole.id !== 'campusadmin' && (userCampuses.length > 1 || userCampuses.includes('ALL')) && (
               <div className="relative">
                 <button 
                   onClick={() => setShowCampusMenu(!showCampusMenu)}
                   className="flex items-center gap-2 px-4 py-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-full text-sm font-bold text-slate-800 dark:text-slate-100 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm"
                 >
                   <MapPin className="w-4 h-4 text-hct-blue" />
                   <span className="max-w-[140px] truncate">{activeCampus === 'ALL' ? 'All Campuses' : (CAMPUSES.find(c => c.id === activeCampus)?.name || activeCampus)}</span>
                   <ChevronDown className="w-4 h-4 opacity-50" />
                 </button>
                 
                 {showCampusMenu && (
                   <div className="absolute top-full right-0 mt-2 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50 max-h-64 overflow-y-auto">
                     {userCampuses.includes('ALL') && (
                       <button onClick={() => { setActiveCampus('ALL'); setShowCampusMenu(false); }} className={`w-full text-left px-4 py-3 text-sm transition-colors ${activeCampus === 'ALL' ? 'bg-blue-50/80 text-hct-blue font-bold dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5'}`}>
                         All Campuses
                       </button>
                     )}
                     {CAMPUSES.filter(c => userCampuses.includes('ALL') || userCampuses.includes(c.id)).map(campus => (
                       <button
                         key={campus.id}
                         onClick={() => { setActiveCampus(campus.id); setShowCampusMenu(false); }}
                         className={`w-full text-left px-4 py-3 text-sm transition-colors ${campus.id === activeCampus ? 'bg-blue-50/80 text-hct-blue font-bold dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/5'}`}
                       >
                         {campus.name}
                       </button>
                     ))}
                   </div>
                 )}
               </div>
             )}
                            {/* Compact Notification Popover Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotificationPopover(!showNotificationPopover)}
                  className="relative p-2.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm flex items-center justify-center outline-none"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>

                {showNotificationPopover && (
                  <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden">
                    
                    {/* Popover Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-hct-blue" />
                        <h4 className="font-bold text-sm text-slate-800 dark:text-white">Notifications</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                          {notifications.filter(n => !n.read).length} New
                        </span>
                      </div>
                      <button
                        onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                        className="text-[11px] font-bold text-hct-blue hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>



                    {/* Notification Items */}
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notifications.map(item => (
                          <div
                            key={item.id}
                            onClick={() => setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n))}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                              !item.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              item.type === 'approval' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' :
                              item.type === 'security' ? 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400' :
                              item.type === 'contractor' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400' :
                              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                              {item.type === 'approval' && <CheckSquare className="w-4 h-4" />}
                              {item.type === 'security' && <ShieldAlert className="w-4 h-4" />}
                              {item.type === 'contractor' && <Briefcase className="w-4 h-4" />}
                              {item.type === 'system' && <Settings className="w-4 h-4" />}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <p className={`text-xs truncate ${!item.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                  {item.title}
                                </p>
                                {!item.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight mb-1">
                                {item.desc}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-semibold text-slate-400">{item.time}</span>
                                {item.link && (
                                  <Link
                                    to={item.link}
                                    onClick={() => setShowNotificationPopover(false)}
                                    className="text-[10px] font-bold text-hct-blue hover:underline"
                                  >
                                    View
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Popover Footer */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">{notifications.length} Total Alerts</span>
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[11px] font-bold text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>

                  </div>
                )}
              </div>

              <button
                onClick={toggleTheme}
               className="p-2.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-white/10 text-amber-500 dark:text-cyan-400 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm"
               aria-label="Toggle Dark Mode"
             >
               {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>


           </div>
        </header>
        <main className="p-8 flex-1 relative">
          <Outlet />
        </main>
      </div>

      {/* Global Configuration & Integration Modal (FR-CFG) */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl animate-in zoom-in-95 overflow-hidden flex h-[85vh]">
            
            {/* Modal Sidebar */}
            <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
               <div className="p-6 border-b border-slate-200">
                 <h3 className="text-xl font-bold text-slate-800">System Config</h3>
                 <p className="text-xs text-slate-500 mt-1">Superadmin (FR-CFG)</p>
               </div>
               <div className="flex-1 overflow-y-auto py-4">
                 <button 
                   onClick={() => setConfigTab('notifications')}
                   className={`w-full text-left px-6 py-3 font-medium transition-colors ${configTab === 'notifications' ? 'bg-blue-50 text-hct-blue border-r-4 border-hct-blue' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                   Notifications (FR-CFG-02, 03)
                 </button>
                 <button 
                   onClick={() => setConfigTab('identity')}
                   className={`w-full text-left px-6 py-3 font-medium transition-colors ${configTab === 'identity' ? 'bg-blue-50 text-hct-blue border-r-4 border-hct-blue' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                   Campus & Identity (FR-CFG-01, 04, 05)
                 </button>
                 <button 
                   onClick={() => setConfigTab('hardware')}
                   className={`w-full text-left px-6 py-3 font-medium transition-colors ${configTab === 'hardware' ? 'bg-blue-50 text-hct-blue border-r-4 border-hct-blue' : 'text-slate-600 hover:bg-slate-100'}`}
                 >
                   Hardware Integrations
                 </button>
               </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-8">
                
                {configTab === 'notifications' && (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">SMTP & SMS Gateways (FR-CFG-02, 03)</h4>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700">SMTP Server (FR-CFG-02)</label>
                           <input type="text" defaultValue="smtp.hct.ac.ae:587" className="w-full p-2 border rounded bg-slate-50" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-sm font-bold text-slate-700">SMS Gateway API (FR-CFG-03)</label>
                           <input type="text" defaultValue="https://api.sms-provider.com/v1/send" className="w-full p-2 border rounded bg-slate-50" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Event Subscriptions (FR-NT-01)</h4>
                      <table className="w-full text-left">
                        <thead className="border-b border-slate-200 text-sm font-bold text-slate-500 uppercase">
                          <tr>
                            <th className="pb-3">Event Type</th>
                            <th className="pb-3 text-center">Push App</th>
                            <th className="pb-3 text-center">Email</th>
                            <th className="pb-3 text-center">SMS</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                          <tr>
                            <td className="py-4">New Visit Request (FR-NT-02)</td>
                            <td className="py-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4" /></td>
                            <td className="py-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4" /></td>
                            <td className="py-4 text-center"><input type="checkbox" className="w-4 h-4" /></td>
                          </tr>
                          <tr>
                            <td className="py-4">Accept/Reject (FR-NT-03)</td>
                            <td className="py-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4" /></td>
                            <td className="py-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4" /></td>
                            <td className="py-4 text-center"><input type="checkbox" defaultChecked className="w-4 h-4" /></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {configTab === 'identity' && (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Active Directory Sync (FR-CFG-04)</h4>
                      <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
                         <Users className="w-8 h-8 text-blue-600" />
                         <div className="flex-1">
                           <p className="font-bold text-blue-900">Azure AD / LDAP Synchronized</p>
                           <p className="text-sm text-blue-700">Last sync: 2 hours ago. Users and departments are managed externally.</p>
                         </div>
                         <button className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded font-bold text-sm shadow-sm hover:bg-blue-50">Force Sync</button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                        <Building className="w-5 h-5 text-hct-blue" />
                        Campus Configuration (FR-CFG-01)
                      </h4>
                      <p className="text-sm text-slate-500 mb-4">Manage the centralized list of registered campuses across the HCT network.</p>
                      
                      {/* Add Campus Form */}
                      <form onSubmit={handleAddCampus} className="flex gap-2 mb-6">
                        <input 
                          type="text" 
                          value={newCampusName}
                          onChange={(e) => setNewCampusName(e.target.value)}
                          placeholder="e.g. Dubai Satellite Campus..." 
                          className="flex-1 p-3 border border-slate-200 rounded-lg bg-slate-50 font-medium focus:outline-none focus:ring-2 focus:ring-hct-blue/50" 
                        />
                        <button 
                          type="submit" 
                          disabled={!newCampusName.trim()}
                          className="px-6 py-3 bg-hct-blue text-white font-bold rounded-lg hover:bg-hct-blue/90 disabled:opacity-50 flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" /> Add Campus
                        </button>
                      </form>

                      {/* Campus List Grid */}
                      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
                        {CAMPUSES.map(campus => (
                          <div key={campus.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:border-slate-300 transition-colors">
                            <span className="font-medium text-slate-700">{campus.name}</span>
                            {campus.id === activeCampus && (
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Role Based Access Control (FR-CFG-05)</h4>
                      <p className="text-sm text-slate-500 mb-4">RBAC is configured automatically via AD Groups, but overrides can be mapped per user role (Host, Security, Approver, Superadmin) and per Campus.</p>
                      <div className="bg-slate-50 p-4 border rounded-xl text-center text-slate-400 font-medium border-dashed">
                        Role mapping interface goes here...
                      </div>
                    </div>
                  </div>
                )}

                {configTab === 'hardware' && (
                  <div className="space-y-8 animate-in fade-in">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Physical Access Control (FR-CFG-06)</h4>
                      <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-200">
                         <Shield className="w-8 h-8 text-green-600" />
                         <div className="flex-1">
                           <p className="font-bold text-green-900">Suprema Speed Gate Reader Integration</p>
                           <p className="text-sm text-green-700">Connection Status: ONLINE. Ready for dynamic QR validation.</p>
                         </div>
                         <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Vehicle Detection & Auditing (FR-CFG-07, FR-CFG-08)</h4>
                      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                         <LayoutDashboard className="w-8 h-8 text-slate-600" />
                         <div className="flex-1">
                           <p className="font-bold text-slate-800">ICT Access Controller Integration</p>
                           <p className="text-sm text-slate-600">FR-CFG-07: ANPR Camera stream active.</p>
                           <p className="text-sm text-slate-600">FR-CFG-08: Audit log capture listener active.</p>
                         </div>
                         <button className="px-4 py-2 border border-slate-300 rounded text-sm font-bold bg-white text-slate-600 hover:bg-slate-100 shadow-sm">Configure Endpoints</button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-4 shrink-0">
                <button onClick={() => setShowConfigModal(false)} className="px-6 py-2.5 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300">Close</button>
                <button onClick={() => { setShowConfigModal(false); alert("Configuration Saved successfully."); }} className="px-6 py-2.5 bg-hct-blue text-white rounded-lg font-bold hover:bg-blue-800 shadow-md">
                  Save All Changes
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;















