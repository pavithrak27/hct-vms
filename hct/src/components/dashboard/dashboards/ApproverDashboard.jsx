import React from 'react';
import { useContractor } from '../../../context/ContractorContext';
import { useRole } from '../../../context/RoleContext';
import { Building2, UserCheck, FileSignature, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ApproverDashboard() {
  const { sessionUser } = useRole();
  const { employees, passRequests } = useContractor();

  // The context data is already scoped to the Approver's assigned companies.
  const pendingEmployees = employees.filter(e => e.status === 'Pending Approval');
  const pendingPasses = passRequests.filter(r => r.status && r.status.includes('Pending'));

  // Let's pretend contractors require approval too (mock data doesn't have a contractor list inside ContractorContext, but we can simulate a count)
  const pendingContractors = 0; 

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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Approver Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-semibold text-lg">Review and manage pending requests</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Contractor Approvals" 
          value={pendingContractors} 
          subtitle="Companies pending review"
          icon={<Building2 size={24} />} 
          theme="blue"
        />
        <StatCard 
          title="Employee Approvals" 
          value={pendingEmployees.length} 
          subtitle="Staff pending clearance"
          icon={<UserCheck size={24} />} 
          theme="emerald"
        />
        <StatCard 
          title="Pass Requests" 
          value={pendingPasses.length} 
          subtitle="Requests pending issuance"
          icon={<FileSignature size={24} />} 
          theme="indigo"
        />
      </div>

      {/* MAIN CONTENT GRIDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pass Requests List */}
        <motion.div variants={itemVariants}>
          <DashboardSection title="Pending Pass Requests" icon={<FileSignature className="w-5 h-5 text-indigo-500"/>}>
            {pendingPasses.length === 0 ? (
              <EmptyState message="No pending pass requests." />
            ) : (
              <div className="space-y-3">
                {pendingPasses.map(pass => (
                  <div key={pass.id} className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 gap-4">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 transition-colors">{pass.id}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{pass.company} • {pass.employees.length} Employee(s)</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 border border-slate-200 dark:border-slate-700">{pass.status}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>
        </motion.div>

        {/* Employee Clearances List */}
        <motion.div variants={itemVariants}>
          <DashboardSection title="Pending Employee Clearances" icon={<UserCheck className="w-5 h-5 text-emerald-500"/>}>
            {pendingEmployees.length === 0 ? (
              <EmptyState message="No pending employee clearances." />
            ) : (
              <div className="space-y-3">
                {pendingEmployees.map(emp => (
                  <div key={emp.id} className="group relative flex items-center justify-between p-4 bg-white/50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center gap-4">
                      <img src={emp.photo || `https://ui-avatars.com/api/?name=${emp.name}&background=random`} alt={emp.name} className="w-12 h-12 rounded-2xl shadow-inner border border-slate-200 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-base group-hover:text-emerald-600 transition-colors">{emp.name}</p>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">{emp.company} • {emp.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 text-emerald-600 bg-emerald-100 hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <CheckCircle size={18} />
                      </button>
                      <button className="p-2.5 text-red-600 bg-red-100 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DashboardSection>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Subcomponents
const StatCard = ({ title, value, subtitle, icon, theme }) => {
  const themeStyles = {
    blue: 'from-blue-400 to-indigo-500 text-blue-900 shadow-blue-500/20',
    indigo: 'from-indigo-400 to-violet-500 text-indigo-900 shadow-indigo-500/20',
    emerald: 'from-emerald-400 to-teal-500 text-emerald-900 shadow-emerald-500/20',
  };
  
  const borderColors = {
    blue: 'border-l-blue-500', indigo: 'border-l-indigo-500', emerald: 'border-l-emerald-500'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40 cursor-default group border-l-4 ${borderColors[theme]}`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 group-hover:rotate-12">
        {icon}
      </div>
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${themeStyles[theme]} text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <h2 className="text-5xl font-black text-slate-800 dark:text-white drop-shadow-sm">{value}</h2>
      </div>
      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xl relative z-10">{title}</h3>
      <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mt-1 relative z-10">{subtitle}</p>
    </motion.div>
  );
};

const DashboardSection = ({ title, icon, children }) => (
  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[32px] border border-white/40 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden flex flex-col relative h-full">
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-200 dark:via-emerald-800 to-transparent opacity-50"></div>
    <div className="p-6 border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center bg-white/30 dark:bg-slate-900/30">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-3">
        {icon}
        {title}
      </h3>
    </div>
    <div className="p-6 bg-slate-50/30 dark:bg-slate-900/10 flex-1">
      {children}
    </div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center px-4">
    <div className="w-16 h-16 bg-white/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
    </div>
    <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide">{message}</p>
  </div>
);
