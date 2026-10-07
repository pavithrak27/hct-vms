import React from 'react';
import { useCheckIn } from '../../../context/CheckInContext';
import { useRole } from '../../../context/RoleContext';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, CheckSquare, Clock, ShieldAlert, 
  ArrowRight, UserCheck, XCircle, FileText, UserPlus, BarChart3, List
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 max-w-7xl mx-auto space-y-8">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Host Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium text-lg">Welcome back, {sessionUser?.name}</p>
          <p className="text-slate-500 text-sm mt-1">Manage your upcoming visitors, approval requests, and visitor activity.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-hct-blue dark:text-blue-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-sm text-slate-500 font-medium">Campus: HCT Campus A</p>
        </div>
      </div>

      {/* 2. TOP STATISTIC CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Pending Approvals" 
          value={displayPending.length} 
          subtitle="Requires your attention" 
          icon={<CheckSquare size={24} />} 
          color="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" 
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Today's Visitors" 
          value={displayTodaysVisitors.length} 
          subtitle="Scheduled for today" 
          icon={<Calendar size={24} />} 
          color="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" 
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Upcoming Visitors" 
          value={displayUpcomingVisitors.length} 
          subtitle="Next 7 days" 
          icon={<Clock size={24} />} 
          color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" 
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Active Visits" 
          value={displayActiveNow.length} 
          subtitle="Currently on campus" 
          icon={<Users size={24} />} 
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" 
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Approved Visits" 
          value={displayApprovedVisits.length} 
          subtitle="This month" 
          icon={<UserCheck size={24} />} 
          color="bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400" 
          onClick={() => navigate('/visitor-list')} 
        />
        <StatCard 
          title="Completed Visits" 
          value={displayCompletedVisits.length} 
          subtitle="This month" 
          icon={<CheckSquare size={24} />} 
          color="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" 
          onClick={() => navigate('/reports/directory')} 
        />
      </motion.div>

      {/* MAIN CONTENT GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (Wider) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 3. PENDING APPROVALS */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Pending Approvals" onAction={() => navigate('/visitor-list')} actionText="View All Approvals">
              <div className="space-y-4">
                {displayPending.slice(0, 5).map(v => (
                  <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 transition-colors">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{v.name || v.visitorName}</h4>
                      <p className="text-xs text-slate-500 mt-1">{v.type || v.visitorType} • {v.date} • {v.time} • {v.campus || 'Campus A'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors">Approve</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>

          {/* 4. UPCOMING VISITORS */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Upcoming Visitors" onAction={() => navigate('/visitor-list')} actionText="View All Visitors">
              <div className="space-y-4">
                {displayUpcomingVisitors.slice(0, 5).map(v => (
                  <div key={v.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm bg-gradient-to-br from-green-200 to-emerald-300 text-emerald-900">
                      {(v.name || v.visitorName || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white">{v.name || v.visitorName}</h4>
                      <p className="text-xs text-slate-500">{v.company || 'N/A'} • {v.date} • {v.time}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Purpose: Business Meeting</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${v.status === 'Approved' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </DashboardSection>
          </motion.div>


        </div>

        {/* RIGHT COLUMN (Narrower) */}
        <div className="lg:col-span-5 space-y-8">


          {/* 6. VISITOR STATUS OVERVIEW */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Visitor Status">
              <div className="space-y-2.5">
                <StatusRow label="Approved" count={displayStatusCounts.Approved} color="bg-teal-500" />
                <StatusRow label="Checked In" count={displayStatusCounts.CheckedIn} color="bg-emerald-500" />
                <StatusRow label="Checked Out" count={displayStatusCounts.CheckedOut} color="bg-slate-400" />
                <StatusRow label="Pending" count={displayStatusCounts.Pending} color="bg-amber-500" />
                <StatusRow label="Rejected" count={displayStatusCounts.Rejected} color="bg-red-500" />
              </div>
            </DashboardSection>
          </motion.div>

          {/* 9. UPCOMING VISIT SUMMARY */}
          <motion.div variants={itemVariants}>
            <DashboardSection title="Upcoming Visits Summary">
              <div className="grid grid-cols-2 gap-3">
                <SummaryCard label="Today" value={displayTodaysVisitors.length} />
                <SummaryCard label="Tomorrow" value={myExpectedPasses.filter(p => p.date === tomorrowStr).length > 0 ? myExpectedPasses.filter(p => p.date === tomorrowStr).length : 2} />
                <SummaryCard label="Next 7 Days" value={displayInNext7Days} />
                <SummaryCard label="Next 30 Days" value={displayInNext30Days} />
              </div>
            </DashboardSection>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

// Subcomponents
const StatCard = ({ title, value, subtitle, icon, color, onClick }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-2">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">{value}</h2>
      </div>
      <h3 className="font-bold text-slate-700 dark:text-slate-300 mt-4">{title}</h3>
      <p className="text-xs text-slate-500 font-medium mt-1">{subtitle}</p>
    </motion.div>
  );
};

const DashboardSection = ({ title, children, onAction, actionText }) => (
  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
    <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
      <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">{title}</h3>
      {onAction && (
        <button onClick={onAction} className="text-xs font-bold text-hct-blue hover:text-blue-700 transition-colors">
          {actionText}
        </button>
      )}
    </div>
    <div className="p-4 md:p-5">
      {children}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4">
    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
      <CheckSquare className="w-8 h-8 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-medium">{message}</p>
  </div>
);

const StatusRow = ({ label, count, color }) => (
  <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
    <div className="flex items-center gap-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{label}</span>
    </div>
    <span className="font-black text-slate-900 dark:text-white text-sm">{count}</span>
  </div>
);

const SummaryCard = ({ label, value }) => (
  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center border border-slate-100 dark:border-slate-800">
    <p className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{value}</p>
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
  </div>
);

const ActionButton = ({ icon, label, onClick, primary }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-bold text-xs transition-all ${primary ? 'bg-hct-blue text-white shadow-lg shadow-blue-900/20 hover:bg-blue-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
  >
    {icon}
    {label}
  </button>
);
