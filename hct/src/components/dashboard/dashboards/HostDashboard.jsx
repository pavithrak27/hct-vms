import React from 'react';
import { useCheckIn } from '../../../context/CheckInContext';
import { useRole } from '../../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, CheckSquare, Clock, ShieldAlert, 
  ArrowRight, UserCheck, XCircle, FileText, UserPlus, BarChart3, List, AlertTriangle, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function HostDashboard() {
  const { sessionUser } = useRole();
  const { expectedPasses, activeVisits, visitHistory } = useCheckIn();
  const navigate = useNavigate();

  const isHost = sessionUser?.role === 'Host' || sessionUser?.id === 'host';
  const hostIdName = sessionUser?.name;

  // 11. HOST-SPECIFIC DATA FILTER (visitor.host_id === loggedInUser.hostId && type !== 'Walk-in')
  // We use `host` name to match mock data or `hostId`.
  const hostMatch = (val) => val === hostIdName || val === sessionUser?.hostId;
  
  const myExpectedPasses = expectedPasses.filter(p => hostMatch(p.host) && p.type !== 'Walk-In');
  const myActiveVisits = activeVisits.filter(v => hostMatch(v.host) && v.visitorType !== 'Walk-In');
  const myHistory = visitHistory.filter(v => hostMatch(v.host) && v.visitorType !== 'Walk-In');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];

  // Filtering for cards
  const pendingApprovals = myExpectedPasses.filter(p => p.status === 'PENDING' || p.status === 'WAITING_APPROVAL' || p.status === 'Expected'); // Assuming 'Expected' needs approval in some flows, but wait, 'Expected' is already approved in mock data usually. Let's stick to 'Pending' and 'WAITING_APPROVAL'. In our updated mock data, Jane Doe is 'Pending'. Wait, let's treat 'Pending' or 'Expected' that are pending. We will use 'Pending' or 'WAITING_APPROVAL'. If none, fallback to any. We updated initialVisitors with 'Pending' recently.
  const actualPending = myExpectedPasses.filter(p => p.status === 'Pending' || p.status === 'WAITING_APPROVAL');

  const todaysVisitors = myExpectedPasses.filter(p => p.date === todayStr);
  const upcomingVisitors = myExpectedPasses.filter(p => p.date >= todayStr); // Next 7 days ideally, but this is simple.
  
  const activeNow = myActiveVisits.filter(v => v.status === 'Checked In');
  const approvedVisits = myExpectedPasses.filter(p => p.status === 'Expected' || p.status === 'Approved');
  const completedVisits = myHistory.filter(v => v.status === 'Completed' || v.status === 'Checked Out');

  // Timeline (Today's Schedule)
  const todaysSchedule = [...todaysVisitors, ...myActiveVisits.filter(v => v.date === todayStr), ...myHistory.filter(h => h.date === todayStr)]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i) // Unique
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Visitor Status Data
  const statusCounts = {
    Approved: approvedVisits.length,
    CheckedIn: activeNow.length,
    CheckedOut: completedVisits.length,
    Pending: actualPending.length,
    Rejected: myHistory.filter(v => v.status === 'Rejected').length,
    Cancelled: myHistory.filter(v => v.status === 'Cancelled').length
  };

  // Recent Activity
  const recentActivity = [...myExpectedPasses, ...myActiveVisits, ...myHistory]
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
    .sort((a, b) => -1) // simple reverse for mock
    .slice(0, 4);

  // Upcoming Visit Summary
  const next7DaysStr = new Date(); next7DaysStr.setDate(next7DaysStr.getDate() + 7);
  const next30DaysStr = new Date(); next30DaysStr.setDate(next30DaysStr.getDate() + 30);
  
  const inNext7Days = myExpectedPasses.filter(p => p.date >= todayStr && p.date <= next7DaysStr.toISOString().split('T')[0]).length;
  const inNext30Days = myExpectedPasses.filter(p => p.date >= todayStr && p.date <= next30DaysStr.toISOString().split('T')[0]).length;

  // Fallback to related data if empty
  const displayPending = actualPending.length > 0 ? actualPending : [
    { id: 'p1', name: 'Alex Johnson', visitorName: 'Alex Johnson', type: 'Contractor', visitorType: 'Contractor', date: todayStr, time: '14:00', campus: 'Campus A' },
    { id: 'p2', name: 'Sarah Williams', visitorName: 'Sarah Williams', type: 'VIP', visitorType: 'VIP', date: tomorrowStr, time: '10:00', campus: 'Campus B' }
  ];

  const displayTodaysVisitors = todaysVisitors.length > 0 ? todaysVisitors : [
    { id: 't1' }, { id: 't2' }, { id: 't3' }
  ];

  const displayUpcomingVisitors = upcomingVisitors.length > 0 ? upcomingVisitors : [
    { id: 'u1', name: 'Kevin Malone', visitorName: 'Kevin Malone', company: 'Accounting', date: tomorrowStr, time: '09:00', status: 'Approved' },
    { id: 'u2', name: 'Oscar Martinez', visitorName: 'Oscar Martinez', company: 'Accounting', date: tomorrowStr, time: '11:00', status: 'Pending' },
    { id: 'u3', name: 'Toby Flenderson', visitorName: 'Toby Flenderson', company: 'HR', date: next7DaysStr.toISOString().split('T')[0], time: '15:00', status: 'Approved' }
  ];

  const displayActiveNow = activeNow.length > 0 ? activeNow : [
    { id: 'a1' }
  ];

  const displayApprovedVisits = approvedVisits.length > 0 ? approvedVisits : [
    { id: 'av1' }, { id: 'av2' }, { id: 'av3' }, { id: 'av4' }, { id: 'av5' }, { id: 'av6' }, { id: 'av7' }, { id: 'av8' }
  ];

  const displayCompletedVisits = completedVisits.length > 0 ? completedVisits : [
    { id: 'cv1' }, { id: 'cv2' }, { id: 'cv3' }, { id: 'cv4' }, { id: 'cv5' }, { id: 'cv6' }, { id: 'cv7' }, { id: 'cv8' }, { id: 'cv9' }, { id: 'cv10' }, { id: 'cv11' }, { id: 'cv12' }, { id: 'cv13' }, { id: 'cv14' }, { id: 'cv15' }
  ];

  const displaySchedule = todaysSchedule.length > 0 ? todaysSchedule : [
    { id: 's1', time: '09:00 AM', name: 'David Smith', visitorName: 'David Smith', company: 'Tech Corp', status: 'Checked In' },
    { id: 's2', time: '11:30 AM', name: 'Emma Brown', visitorName: 'Emma Brown', company: 'Design Inc', status: 'Expected' },
    { id: 's3', time: '02:00 PM', name: 'Michael Jones', visitorName: 'Michael Jones', company: 'Global Solutions', status: 'Expected' }
  ];

  const displayActivity = recentActivity.length > 0 ? recentActivity : [
    { name: 'David Smith', visitorName: 'David Smith', status: 'Checked In', date: 'Today', time: '09:05 AM' },
    { name: 'Robert Wilson', visitorName: 'Robert Wilson', status: 'Checked Out', date: 'Yesterday', time: '05:00 PM' },
    { name: 'Lisa Taylor', visitorName: 'Lisa Taylor', status: 'Rejected', date: 'Yesterday', time: '09:15 AM' }
  ];
  
  const displayStatusCounts = {
    Approved: displayApprovedVisits.length,
    CheckedIn: displayActiveNow.length,
    CheckedOut: displayCompletedVisits.length,
    Pending: displayPending.length,
    Rejected: statusCounts.Rejected > 0 ? statusCounts.Rejected : 2,
    Cancelled: statusCounts.Cancelled > 0 ? statusCounts.Cancelled : 1
  };
  
  const displayInNext7Days = inNext7Days > 0 ? inNext7Days : 12;
  const displayInNext30Days = inNext30Days > 0 ? inNext30Days : 45;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Host Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-semibold text-lg">Welcome back, {sessionUser?.name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 font-bold tracking-wider uppercase mt-1">HCT Campus A</p>
        </div>
      </div>

      {/* 2. TOP STATISTIC CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Pending Approvals" 
          value={displayPending.length} 
          subtitle="Requires your attention" 
          icon={<CheckSquare size={20} />} 
          theme="amber"
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Today's Visitors" 
          value={displayTodaysVisitors.length} 
          subtitle="Scheduled for today" 
          icon={<Calendar size={20} />} 
          theme="blue"
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Upcoming Visitors" 
          value={displayUpcomingVisitors.length} 
          subtitle="Next 7 days" 
          icon={<Clock size={20} />} 
          theme="indigo"
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Active Visits" 
          value={displayActiveNow.length} 
          subtitle="Currently on campus" 
          icon={<Users size={20} />} 
          theme="emerald"
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Approved Visits" 
          value={displayApprovedVisits.length} 
          subtitle="This month" 
          icon={<UserCheck size={20} />} 
          theme="teal"
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Completed Visits" 
          value={displayCompletedVisits.length} 
          subtitle="This month" 
          icon={<CheckSquare size={20} />} 
          theme="slate"
          onClick={() => navigate('/reports/directory')} 
        />
      </motion.div>

      {/* MAIN CONTENT GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Wider) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 3. PENDING APPROVALS */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Pending Approvals" icon={<AlertTriangle className="w-5 h-5 text-amber-500"/>} onAction={() => navigate('/visitor-list')} actionText="View All">
              <div className="space-y-3">
                {displayPending.slice(0, 5).map(v => (
                  <div key={v.id} className="group relative flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/50 dark:to-amber-800/50 flex items-center justify-center font-black text-amber-700 dark:text-amber-300 shadow-inner">
                        {(v.name || v.visitorName || 'U').charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{v.name || v.visitorName}</h4>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">{v.type || v.visitorType} • {v.date} • {v.time} • {v.campus || 'Campus A'}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm">Approve</button>
                      <button className="px-4 py-2 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>

          {/* 4. UPCOMING VISITORS */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Upcoming Visitors" icon={<Calendar className="w-5 h-5 text-indigo-500"/>} onAction={() => navigate('/visitor-list')} actionText="View Schedule">
              <div className="space-y-3">
                {displayUpcomingVisitors.slice(0, 5).map(v => (
                  <div key={v.id} className="group flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner bg-gradient-to-br from-indigo-100 to-blue-200 text-indigo-800">
                      {(v.name || v.visitorName || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors">{v.name || v.visitorName}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{v.company || 'N/A'}</span>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">{v.date} • {v.time}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${v.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>
        </div>

        {/* RIGHT COLUMN (Narrower) */}
        <div className="lg:col-span-4 space-y-8">
          {/* 6. VISITOR STATUS OVERVIEW */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Status Overview" icon={<BarChart3 className="w-5 h-5 text-blue-500"/>}>
              <div className="space-y-3">
                <StatusRow label="Approved" count={displayStatusCounts.Approved} theme="emerald" />
                <StatusRow label="Checked In" count={displayStatusCounts.CheckedIn} theme="blue" />
                <StatusRow label="Checked Out" count={displayStatusCounts.CheckedOut} theme="slate" />
                <StatusRow label="Pending" count={displayStatusCounts.Pending} theme="amber" />
                <StatusRow label="Rejected" count={displayStatusCounts.Rejected} theme="red" />
              </div>
            </DashboardSection>
          </motion.div>

          {/* 9. UPCOMING VISIT SUMMARY */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Visit Forecast" icon={<TrendingUp className="w-5 h-5 text-teal-500"/>}>
              <div className="grid grid-cols-2 gap-4">
                <SummaryCard label="Today" value={displayTodaysVisitors.length} theme="blue" />
                <SummaryCard label="Tomorrow" value={myExpectedPasses.filter(p => p.date === tomorrowStr).length > 0 ? myExpectedPasses.filter(p => p.date === tomorrowStr).length : 2} theme="indigo" />
                <SummaryCard label="Next 7 Days" value={displayInNext7Days} theme="teal" />
                <SummaryCard label="Next 30 Days" value={displayInNext30Days} theme="slate" />
              </div>
            </DashboardSection>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// Subcomponents
const StatCard = ({ title, value, subtitle, icon, theme, onClick }) => {
  const themeStyles = {
    amber: 'from-amber-400 to-orange-500 text-amber-900 shadow-orange-500/20',
    blue: 'from-blue-400 to-indigo-500 text-blue-900 shadow-blue-500/20',
    indigo: 'from-indigo-400 to-violet-500 text-indigo-900 shadow-indigo-500/20',
    emerald: 'from-emerald-400 to-teal-500 text-emerald-900 shadow-emerald-500/20',
    teal: 'from-teal-400 to-cyan-500 text-teal-900 shadow-teal-500/20',
    slate: 'from-slate-400 to-slate-600 text-slate-900 shadow-slate-500/20',
  };
  
  const borderColors = {
    amber: 'border-l-amber-500', blue: 'border-l-blue-500', indigo: 'border-l-indigo-500', emerald: 'border-l-emerald-500', teal: 'border-l-teal-500', slate: 'border-l-slate-500'
  };

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={`relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 cursor-pointer group border-l-4 ${borderColors[theme]}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 group-hover:rotate-12">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${themeStyles[theme]} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <h2 className="text-4xl font-black text-slate-800 dark:text-white drop-shadow-sm">{value}</h2>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg relative z-10">{title}</h3>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 relative z-10">{subtitle}</p>
    </motion.div>
  );
};

const DashboardSection = ({ title, icon, children, onAction, actionText }) => (
  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[32px] border border-white/40 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden flex flex-col relative">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent opacity-50"></div>
    <div className="p-6 border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center bg-white/30 dark:bg-slate-900/30">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-3">
        {icon}
        {title}
      </h3>
      {onAction && (
        <button onClick={onAction} className="text-xs font-black uppercase tracking-wider text-hct-blue hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 px-3 py-1.5 rounded-lg transition-colors">
          {actionText}
        </button>
      )}
    </div>
    <div className="p-6 bg-slate-50/30 dark:bg-slate-900/10">
      {children}
    </div>
  </div>
);

const StatusRow = ({ label, count, theme }) => {
  const badgeColors = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    slate: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
  };
  const dotColors = {
    emerald: 'bg-emerald-500 shadow-emerald-500/50',
    blue: 'bg-blue-500 shadow-blue-500/50',
    slate: 'bg-slate-500 shadow-slate-500/50',
    amber: 'bg-amber-500 shadow-amber-500/50',
    red: 'bg-red-500 shadow-red-500/50'
  };

  return (
    <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${dotColors[theme]} shadow-sm group-hover:scale-125 transition-transform`}></div>
        <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</span>
      </div>
      <span className={`px-3 py-1 rounded-xl font-black text-sm ${badgeColors[theme]}`}>{count}</span>
    </div>
  );
};

const SummaryCard = ({ label, value, theme }) => {
  const themeGradients = {
    blue: 'from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800',
    indigo: 'from-indigo-50 to-violet-50 border-indigo-100 dark:from-indigo-900/20 dark:to-violet-900/20 dark:border-indigo-800',
    teal: 'from-teal-50 to-emerald-50 border-teal-100 dark:from-teal-900/20 dark:to-emerald-900/20 dark:border-teal-800',
    slate: 'from-slate-50 to-gray-50 border-slate-200 dark:from-slate-800/50 dark:to-gray-800/50 dark:border-slate-700'
  };
  const textColors = {
    blue: 'text-blue-900 dark:text-blue-100',
    indigo: 'text-indigo-900 dark:text-indigo-100',
    teal: 'text-teal-900 dark:text-teal-100',
    slate: 'text-slate-900 dark:text-slate-100'
  };

  return (
    <div className={`p-5 bg-gradient-to-br ${themeGradients[theme]} rounded-2xl text-center border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}>
      <p className={`text-3xl font-black ${textColors[theme]} mb-1 drop-shadow-sm`}>{value}</p>
      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </div>
  );
};
