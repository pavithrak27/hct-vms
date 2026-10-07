import React from 'react';
import { useCheckIn } from '../../../context/CheckInContext';
import { useRole } from '../../../context/RoleContext';
import { ShieldCheck, Users, QrCode, LogIn, LogOut, ShieldAlert, AlertOctagon, History, ScanLine, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SecurityDashboard() {
  const { sessionUser } = useRole();
  const { expectedPasses, activeVisits, securityReviews, stats } = useCheckIn();

  // The context data is already scoped to the Security Officer's campus/gate.
  // We just need to aggregate the lists.
  const activeContractorPasses = expectedPasses.filter(p => p.type === 'Contractor' && p.status === 'ACTIVE');
  const activeVisitorCheckins = activeVisits.filter(v => v.status === 'Checked In');
  const pendingReviews = securityReviews.filter(r => r.status === 'Pending Security Review');

  const recentGateActivity = activeVisits.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Assigned to: <span className="font-semibold">{sessionUser?.campuses?.join(', ') || 'Main Campus'}</span>
            {sessionUser?.gateId && <span className="ml-2">({sessionUser.gateId})</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Active Visits</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeVisitorCheckins.length}</p>
          <p className="text-sm text-slate-500 mt-2">Currently on campus</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Today's Check-ins</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <LogIn size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.checkedInToday}</p>
          <p className="text-sm text-slate-500 mt-2">Total entry events</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Contractor Passes</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <QrCode size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{activeContractorPasses.length}</p>
          <p className="text-sm text-slate-500 mt-2">Valid contractor access</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 dark:bg-red-900/10 rounded-bl-full -mr-16 -mt-16 z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-red-800 dark:text-red-300">Restricted Alerts</h3>
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertOctagon size={20} />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-700 dark:text-red-400">{pendingReviews.length}</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-2">Requires immediate review</p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        
        {/* Today Visitors */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              Today Visitors
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            {activeVisitorCheckins.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active visitors.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Visitor</th>
                    <th className="px-6 py-4">Host</th>
                    <th className="px-6 py-4">Gate</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {activeVisitorCheckins.map((activity, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={activity.photo || `https://ui-avatars.com/api/?name=${activity.visitorName}`} className="w-8 h-8 rounded-full" alt="" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white text-sm">{activity.visitorName}</p>
                            <p className="text-xs text-slate-500">{activity.visitorType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{activity.host || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{activity.gate}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{activity.checkInTime}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-bold">
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
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-500" />
              Today Contractor Passes
            </h3>
          </div>
          <div className="p-0 overflow-x-auto">
            {activeContractorPasses.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No active contractor passes.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Contractor</th>
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Host</th>
                    <th className="px-6 py-4">Duration</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {activeContractorPasses.map((pass, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{pass.visitorName || pass.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{pass.id}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pass.company || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pass.host || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{pass.date} {pass.time && `- ${pass.time}`}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full text-xs font-bold">
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

