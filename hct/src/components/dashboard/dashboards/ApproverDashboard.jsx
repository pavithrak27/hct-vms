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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Approver Dashboard</h1>
          <p className="text-slate-500 mt-1">Review and manage pending requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Contractor Approvals</h3>
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Building2 size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingContractors}</p>
          <p className="text-sm text-slate-500 mt-2">Companies pending review</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Employee Approvals</h3>
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <UserCheck size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingEmployees.length}</p>
          <p className="text-sm text-slate-500 mt-2">Staff pending clearance</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300">Pass Requests</h3>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileSignature size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{pendingPasses.length}</p>
          <p className="text-sm text-slate-500 mt-2">Requests pending issuance</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pass Requests List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-indigo-500" />
              Pending Pass Requests
            </h3>
          </div>
          <div className="p-4">
            {pendingPasses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No pending pass requests.</div>
            ) : (
              <div className="space-y-4">
                {pendingPasses.map(pass => (
                  <div key={pass.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 gap-4">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{pass.id}</p>
                      <p className="text-sm text-slate-500 mt-1">{pass.company} • {pass.employees.length} Employee(s)</p>
                      <p className="text-xs font-mono text-slate-400 mt-2">{pass.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 rounded transition-colors">
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded transition-colors">
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Employee Clearances List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-500" />
              Pending Employee Clearances
            </h3>
          </div>
          <div className="p-4">
            {pendingEmployees.length === 0 ? (
              <div className="text-center py-8 text-slate-500">No pending employee clearances.</div>
            ) : (
              <div className="space-y-4">
                {pendingEmployees.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={emp.photo || `https://ui-avatars.com/api/?name=${emp.name}`} alt={emp.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{emp.name}</p>
                        <p className="text-xs text-slate-500">{emp.company} • {emp.jobTitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1.5 text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 rounded hover:bg-emerald-200 transition-colors">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-1.5 text-red-600 bg-red-100 dark:bg-red-900/30 rounded hover:bg-red-200 transition-colors">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
