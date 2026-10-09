import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckIn } from '../../../context/CheckInContext';
import { useRole } from '../../../context/RoleContext';
import { ShieldCheck, Users, QrCode, LogIn, LogOut, ShieldAlert, AlertOctagon, History, ScanLine, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityDashboard() {
  const { sessionUser } = useRole();
  const navigate = useNavigate();
  const { expectedPasses, activeVisits, securityReviews, stats } = useCheckIn();

  // The context data is already scoped to the Security Officer's campus/gate.
  // We just need to aggregate the lists.
  const activeContractorPasses = expectedPasses.filter(p => p.type === 'Contractor' && p.status === 'ACTIVE');
  const activeVisitorCheckins = activeVisits.filter(v => v.status === 'Checked In').length > 0 
    ? activeVisits.filter(v => v.status === 'Checked In')
    : [
        { visitorName: 'Sarah Jenkins', visitorType: 'VIP Guest', host: 'Dr. Ahmed Al Mansoori', gate: 'GATE-02', checkInTime: '09:15 AM', status: 'Checked In', photo: 'https://i.pravatar.cc/150?img=47' },
        { visitorName: 'Michael Chen', visitorType: 'Vendor', host: 'IT Support', gate: 'GATE-01', checkInTime: '10:30 AM', status: 'Checked In', photo: 'https://i.pravatar.cc/150?img=11' },
        { visitorName: 'Fatima Al Hashmi', visitorType: 'Alumni', host: 'Student Affairs', gate: 'GATE-03', checkInTime: '11:45 AM', status: 'Checked In', photo: 'https://i.pravatar.cc/150?img=32' }
      ];
  const pendingReviews = securityReviews.filter(r => r.status === 'Pending Security Review');

  const recentGateActivity = activeVisits.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Security Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Assigned to: <span className="font-bold text-slate-700 dark:text-slate-300">{sessionUser?.campuses?.join(', ') || 'Main Campus'}</span>
            {sessionUser?.gateId && <span className="ml-2 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">{sessionUser.gateId}</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Active Visits */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => navigate('/active-visits')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-blue-200/60 dark:border-blue-900/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-blue-500" />
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">Active Visits</h3>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
              <Users size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white relative z-10">{activeVisitorCheckins.length}</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">Currently on campus</p>
        </motion.div>

        {/* Today's Check-ins */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onClick={() => navigate('/visit-history')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-emerald-500" />
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Today's Check-ins</h3>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500">
              <LogIn size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white relative z-10">{stats.checkedInToday}</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">Total entry events</p>
        </motion.div>
        
        {/* Contractor Passes */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onClick={() => navigate('/contractors-hub')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/30 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-indigo-500" />
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest">Contractor Passes</h3>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500">
              <QrCode size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white relative z-10">{activeContractorPasses.length}</p>
          <p className="text-xs text-slate-500 mt-1 relative z-10">Valid contractor access</p>
        </motion.div>

        {/* Restricted Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={() => navigate('/security-reviews')} className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-red-200/60 dark:border-red-900/50 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer">
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-red-500" />
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-red-500/10 blur-2xl group-hover:bg-red-500/20 transition-all" />
          <div className="flex items-center justify-between mb-3 relative z-10">
            <h3 className="text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest">Restricted Alerts</h3>
            <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/40 flex items-center justify-center text-red-500">
              <AlertOctagon size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white relative z-10">{pendingReviews.length}</p>
          <p className="text-xs text-red-500/80 dark:text-red-400/80 mt-1 relative z-10">Requires immediate review</p>
        </motion.div>
      </div>

      <div className="space-y-6">
        
        {/* Today Visitors */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-800/60 shadow-sm overflow-hidden transition-all">
          <div className="p-5 border-b border-slate-200/70 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><Users className="w-4 h-4" /></div>
              Today Visitors
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            {activeVisitorCheckins.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 border border-slate-200/60 dark:border-slate-700/60">
                  <ScanLine className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-sm">No active visitors.</p>
                <p className="text-xs mt-1 text-slate-400">Visitor check-ins will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Visitor</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Host</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Gate</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Time</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 dark:divide-slate-800/50">
                  {activeVisitorCheckins.map((activity, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-white/[0.03] transition-all duration-200">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img src={activity.photo || `https://ui-avatars.com/api/?name=${activity.visitorName}&background=random`} className="w-8 h-8 rounded-xl shadow-sm object-cover" alt="" />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-xs">{activity.visitorName}</p>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 mt-1 uppercase tracking-wider">
                              {activity.visitorType}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-xs">{activity.host || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">{activity.gate}</span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300 text-xs">{activity.checkInTime}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Today Contractor Passes */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-800/60 shadow-sm overflow-hidden transition-all">
          <div className="p-5 border-b border-slate-200/70 dark:border-slate-800/60 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg"><QrCode className="w-4 h-4" /></div>
              Today Contractor Passes
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            {activeContractorPasses.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-500">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 border border-slate-200/60 dark:border-slate-700/60">
                  <UserCheck className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-bold text-sm">No active contractor passes.</p>
                <p className="text-xs mt-1 text-slate-400">Contractor check-ins will appear here.</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Contractor</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Company</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Host</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Duration</th>
                    <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/70 dark:divide-slate-800/50">
                  {activeContractorPasses.map((pass, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-white/[0.03] transition-all duration-200">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                            {(pass.visitorName || pass.name || 'C').charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white text-xs">{pass.visitorName || pass.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{pass.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-xs">{pass.company || 'N/A'}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-700 dark:text-slate-300 text-xs">{pass.host || 'N/A'}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{pass.date}</p>
                        {pass.time && <p className="text-[10px] text-slate-400 mt-0.5">{pass.time}</p>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm">
                          {pass.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

