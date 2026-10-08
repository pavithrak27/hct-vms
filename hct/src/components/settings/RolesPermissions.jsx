import React, { useState } from 'react';
import { ShieldCheck, Search, Users, Check, Save, Plus, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const INITIAL_ROLES = ['Superadmin', 'Campus Admin', 'Host', 'Security', 'Reception', 'Visitor', 'Contractor', 'Approver'];

const WEB_MODULES = [
  { name: 'Visitor Management', perms: ['web_View Visitors', 'web_Create Visitor', 'web_Edit Visitor', 'web_Delete Visitor'] },
  { name: 'Check-in / Check-out', perms: ['web_QR Check-in', 'web_Manual Check-in', 'web_Force Check-out', 'web_View Active Visits'] },
  { name: 'Contractor Management', perms: ['web_View Contractors', 'web_Approve Contractor', 'web_Approve Pass Request'] },
  { name: 'Restricted Visitors', perms: ['web_View Restricted List', 'web_Add Restricted Visitor', 'web_Security Review', 'web_Permanent Release'] },
  { name: 'Reports', perms: ['web_View Reports', 'web_Export Reports'] },
  { name: 'Configuration', perms: ['web_Manage Campuses', 'web_Manage Integrations', 'web_Manage Roles'] },
];

const MOBILE_MODULES = [
  { name: 'Mobile Dashboard', perms: ['mob_View Dashboard', 'mob_View Summary', 'mob_View Notifications'] },
  { name: 'Mobile Visitor Management', perms: ['mob_View Visitors', 'mob_Create Visitor', 'mob_View Visitor Details', 'mob_View Visitor History'] },
  { name: 'Mobile QR & Gate Access', perms: ['mob_QR Scanner', 'mob_QR Check-in', 'mob_QR Check-out', 'mob_Manual Check-in', 'mob_Force Check-out'] },
  { name: 'Mobile Active Visits', perms: ['mob_View Active Visits', 'mob_View Visit Details', 'mob_View Visit History'] },
  { name: 'Mobile Approvals', perms: ['mob_View Pending Requests', 'mob_Approve Visitor Request', 'mob_Reject Visitor Request', 'mob_View Contractor Requests', 'mob_Approve Contractor Request', 'mob_Approve Employee Request', 'mob_Approve Pass Request'] },
  { name: 'Mobile Restricted Visitors', perms: ['mob_View Restricted Visitors', 'mob_Security Review', 'mob_Temporary Release', 'mob_Permanent Release'] },
  { name: 'Mobile Notifications', perms: ['mob_View Notifications', 'mob_Receive Push Notifications'] },
  { name: 'Mobile Profile', perms: ['mob_View Profile', 'mob_Edit Profile', 'mob_Change Password'] },
  { name: 'Mobile Reports', perms: ['mob_View Reports', 'mob_View Report Details', 'mob_Export Reports'] }
];

const RolesPermissions = () => {
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState(roles[1]);
  
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  
  const [editingRole, setEditingRole] = useState(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [platformTab, setPlatformTab] = useState('web');

  // Just simulating a toggle map. In real app, this would be a deep object.
  const [activePerms, setActivePerms] = useState({
    'web_View Visitors': true, 'web_Create Visitor': true, 'web_QR Check-in': true, 'web_View Active Visits': true, 'web_View Restricted List': true, 'web_Security Review': true,
    'mob_Access Mobile Application': true, 'mob_View Dashboard': true, 'mob_QR Scanner': true, 'mob_QR Check-in': true, 'mob_View Active Visits': true
  });

  const togglePerm = (perm) => {
    setActivePerms(prev => ({...prev, [perm]: !prev[perm]}));
  };

  const allWebSelected = WEB_MODULES.every(mod => mod.perms.every(p => activePerms[p]));
  const toggleAllWeb = () => {
    const newState = !allWebSelected;
    setActivePerms(prev => {
      const next = { ...prev };
      WEB_MODULES.forEach(mod => {
        mod.perms.forEach(p => {
          next[p] = newState;
        });
      });
      return next;
    });
  };

  const handleAddRole = () => {
    if (newRoleName.trim() && !roles.includes(newRoleName.trim())) {
      const updatedRoles = [...roles, newRoleName.trim()];
      setRoles(updatedRoles);
      setSelectedRole(newRoleName.trim());
    }
    setNewRoleName('');
    setIsAddingRole(false);
  };

  const saveEditedRole = (oldRole) => {
    if (editingRoleName.trim() && !roles.includes(editingRoleName.trim())) {
      const updatedRoles = roles.map(r => r === oldRole ? editingRoleName.trim() : r);
      setRoles(updatedRoles);
      if (selectedRole === oldRole) {
        setSelectedRole(editingRoleName.trim());
      }
    }
    setEditingRole(null);
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
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-2"><Users className="w-4 h-4"/> System Roles</span>
              <button onClick={() => setIsAddingRole(true)} className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1"><Plus className="w-3 h-3"/> Add</button>
            </div>
            <div className="divide-y divide-slate-100">
              {roles.map(r => (
                <div key={r} className={`w-full text-left p-4 font-bold text-sm transition-colors relative group cursor-pointer ${selectedRole === r ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'}`} onClick={() => { if (editingRole !== r) setSelectedRole(r); }}>
                  {editingRole === r ? (
                    <div className="flex items-center gap-2">
                       <input autoFocus value={editingRoleName} onChange={(e) => setEditingRoleName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEditedRole(r)} onBlur={() => saveEditedRole(r)} className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 outline-none font-bold" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{r}</span>
                      {r !== 'Superadmin' && (
                        <div className="hidden group-hover:flex items-center gap-2">
                          <button onClick={(e) => { e.stopPropagation(); setEditingRole(r); setEditingRoleName(r); }} className="text-slate-400 hover:text-emerald-600"><Edit2 className="w-3.5 h-3.5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); const newRoles = roles.filter(x => x !== r); setRoles(newRoles); if (selectedRole === r) setSelectedRole(newRoles[0]); }} className="text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isAddingRole && (
                <div className="p-4 border-l-4 border-transparent">
                  <input autoFocus placeholder="Role Name" value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddRole()} onBlur={() => { if (newRoleName.trim()) handleAddRole(); else setIsAddingRole(false); }} className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold text-slate-800 outline-none" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedRole} Permissions</h3>
                <p className="text-sm text-slate-500 mt-1">Select which actions this role is permitted to execute. Access is also restricted by Campus mapping.</p>
              </div>
            </div>

            <div className="flex border-b border-slate-200 mb-6 gap-6">
               <button onClick={() => setPlatformTab('web')} className={`pb-3 text-sm font-bold transition-colors border-b-2 ${platformTab === 'web' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Web Application</button>
               <button onClick={() => setPlatformTab('mobile')} className={`pb-3 text-sm font-bold transition-colors border-b-2 ${platformTab === 'mobile' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Mobile Application</button>
            </div>

            {platformTab === 'web' && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-800">Select All Web Permissions</h4>
                  <p className="text-sm text-emerald-600">Quickly enable or disable all web application permissions for this role.</p>
                </div>
                <label className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border ${(selectedRole === 'Superadmin' || allWebSelected) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                  {(selectedRole === 'Superadmin' || allWebSelected) && <Check className="w-5 h-5"/>}
                  <input type="checkbox" className="hidden" checked={selectedRole === 'Superadmin' || allWebSelected} onChange={() => selectedRole !== 'Superadmin' && toggleAllWeb()} disabled={selectedRole === 'Superadmin'} />
                </label>
              </div>
            )}

            {platformTab === 'mobile' && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-emerald-800">Access Mobile Application</h4>
                  <p className="text-sm text-emerald-600">If disabled, the user must not be able to log into or use the Pro-Visit mobile application.</p>
                </div>
                <label className={`flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer border ${(selectedRole === 'Superadmin' || activePerms['mob_Access Mobile Application']) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                  {(selectedRole === 'Superadmin' || activePerms['mob_Access Mobile Application']) && <Check className="w-5 h-5"/>}
                  <input type="checkbox" className="hidden" checked={selectedRole === 'Superadmin' || !!activePerms['mob_Access Mobile Application']} onChange={() => selectedRole !== 'Superadmin' && togglePerm('mob_Access Mobile Application')} disabled={selectedRole === 'Superadmin'} />
                </label>
              </div>
            )}
            
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${(platformTab === 'mobile' && selectedRole !== 'Superadmin' && !activePerms['mob_Access Mobile Application']) ? 'opacity-50 pointer-events-none' : ''}`}>
              {(platformTab === 'web' ? WEB_MODULES : MOBILE_MODULES).map(mod => (
                <div key={mod.name} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b border-slate-200 font-bold text-slate-700 text-sm">{mod.name}</div>
                  <div className="p-2 space-y-1">
                    {mod.perms.map(p => {
                      // Superadmin gets everything
                      const isChecked = selectedRole === 'Superadmin' ? true : !!activePerms[p];
                      const disabled = selectedRole === 'Superadmin';
                      const displayName = p.replace('web_', '').replace('mob_', '');
                      
                      return (
                        <label key={p} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${isChecked ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}>
                          <span className={`text-sm font-bold ${isChecked ? 'text-emerald-700' : 'text-slate-600'}`}>{displayName}</span>
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
