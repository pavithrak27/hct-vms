import React, { useState } from 'react';
import { ShieldCheck, Search, Users, Check, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = ['Super Admin', 'Security Admin', 'Reception', 'Approver', 'Host'];

const MODULES = [
  { name: 'Visitor Management', perms: ['View Visitors', 'Create Visitor', 'Edit Visitor', 'Delete Visitor'] },
  { name: 'Check-in / Check-out', perms: ['QR Check-in', 'Manual Check-in', 'Force Check-out', 'View Active Visits'] },
  { name: 'Contractor Management', perms: ['View Contractors', 'Approve Contractor', 'Approve Pass Request'] },
  { name: 'Restricted Visitors', perms: ['View Restricted List', 'Add Restricted Visitor', 'Security Review', 'Permanent Release'] },
  { name: 'Reports', perms: ['View Reports', 'Export Reports'] },
  { name: 'Configuration', perms: ['Manage Campuses', 'Manage Integrations', 'Manage Roles'] },
];

const RolesPermissions = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES[1]);
  // Just simulating a toggle map. In real app, this would be a deep object.
  const [activePerms, setActivePerms] = useState({
    'View Visitors': true, 'Create Visitor': true, 'QR Check-in': true, 'View Active Visits': true, 'View Restricted List': true, 'Security Review': true
  });

  const togglePerm = (perm) => {
    setActivePerms(prev => ({...prev, [perm]: !prev[perm]}));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" /> Roles & Permissions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure Role-Based Access Control (RBAC) and map AD Groups to system roles.</p>
        </div>
        <button onClick={() => alert('Permissions Saved.')} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-md">
          <Save className="w-5 h-5"/> Save Role Matrix
        </button>
      </div>

      <div className="flex gap-8">
        
        {/* Roles List Sidebar */}
        <div className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4"/> System Roles
            </div>
            <div className="divide-y divide-slate-100">
              {ROLES.map(r => (
                <button 
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`w-full text-left p-4 font-bold text-sm transition-colors ${selectedRole === r ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedRole} Permissions</h3>
            <p className="text-sm text-slate-500 mb-6">Select which actions this role is permitted to execute. Access is also restricted by Campus mapping.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MODULES.map(mod => (
                <div key={mod.name} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-slate-700 text-sm">{mod.name}</div>
                  <div className="p-2 space-y-1">
                    {mod.perms.map(p => {
                      // Super admin gets everything
                      const isChecked = selectedRole === 'Super Admin' ? true : !!activePerms[p];
                      const disabled = selectedRole === 'Super Admin';
                      
                      return (
                        <label key={p} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                          <span className={`text-sm font-bold ${isChecked ? 'text-emerald-700' : 'text-slate-600'}`}>{p}</span>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                            {isChecked && <Check className="w-3.5 h-3.5"/>}
                          </div>
                          <input type="checkbox" className="hidden" checked={isChecked} onChange={() => !disabled && togglePerm(p)} disabled={disabled} />
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Active Directory Group Mapping</h3>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-1">Mapped AD Group (for Auto-Assignment)</label>
                <input type="text" defaultValue={selectedRole === 'Security Admin' ? 'CN=HCT-Security,OU=Groups,DC=hct,DC=ac,DC=ae' : ''} placeholder="e.g. CN=HCT-Reception,OU=Groups..." className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-emerald-400 font-mono text-sm" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default RolesPermissions;
