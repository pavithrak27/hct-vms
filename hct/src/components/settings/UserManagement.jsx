import React, { useState } from 'react';
import { UserCog, Search, Plus, Save, Edit, MapPin, ShieldCheck, Mail, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const USERS = [
  { id: 'USR-1001', name: 'Admin User', email: 'admin@hct.ac.ae', role: 'Superadmin', campuses: ['ALL'], status: 'Active' },
  { id: 'USR-1002', name: 'Khalid Al Hashmi', email: 'kalhashmi@hct.ac.ae', role: 'Campus Admin', campuses: ['CMP-01', 'CMP-02'], status: 'Active' },
  { id: 'USR-1003', name: 'Sarah Ahmed', email: 'sahmed@hct.ac.ae', role: 'Host', campuses: ['CMP-05'], status: 'Active' },
  { id: 'USR-1004', name: 'Security Gate 1', email: 'security1@hct.ac.ae', role: 'Security', campuses: ['CMP-01'], status: 'Active' },
  { id: 'USR-1005', name: 'Reception ADMC', email: 'reception.admc@hct.ac.ae', role: 'Reception', campuses: ['CMP-01'], status: 'Inactive' },
];

const CAMPUSES = [
  { id: 'ALL', name: 'All Campuses (Global)' },
  { id: 'CMP-01', name: 'Abu Dhabi Men\'s Campus' },
  { id: 'CMP-02', name: 'Abu Dhabi Women\'s Campus' },
  { id: 'CMP-05', name: 'Dubai Men\'s Campus' },
  { id: 'CMP-06', name: 'Dubai Women\'s Campus' },
];

const ROLES = ['Superadmin', 'Campus Admin', 'Host', 'Security', 'Reception', 'Approver', 'Contractor'];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const filteredUsers = USERS.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <UserCog className="w-8 h-8 text-hct-blue" /> User Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage user identities, assign roles, and map campus access scope.</p>
        </div>
        <button onClick={() => setIsAddingUser(true)} className="bg-hct-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#001a66] transition-colors shadow-md">
          <Plus className="w-5 h-5"/> Provision New User
        </button>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Name or Email..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
          <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500"/> Users provisioned automatically via SSO will appear here.
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">User</th>
              <th className="p-4 font-bold uppercase">System Role</th>
              <th className="p-4 font-bold uppercase">Campus Access Scope</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-600">{u.name.substring(0,2).toUpperCase()}</div>
                    <div>
                      <p className="font-bold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Mail className="w-3 h-3"/> {u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${u.role === 'Superadmin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {u.campuses.map(c => (
                      <span key={c} className={`px-2 py-0.5 rounded text-[10px] font-bold ${c === 'ALL' ? 'bg-hct-blue/10 text-hct-blue' : 'bg-slate-100 text-slate-600'}`}>
                        {c === 'ALL' ? 'Global Access' : CAMPUSES.find(cam => cam.id === c)?.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelectedUser(u)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors ml-auto">
                    <Edit className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add User Modal */}
      <AnimatePresence>
        {(selectedUser || isAddingUser) && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-200 bg-slate-50 shrink-0">
                <h3 className="text-xl font-bold text-slate-800">{isAddingUser ? 'Provision New User' : `Edit User Scope: ${selectedUser?.name}`}</h3>
                <p className="text-sm text-slate-500">{isAddingUser ? 'Configure RBAC and campus access for a new identity.' : selectedUser?.email}</p>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto">
                
                {isAddingUser && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                      <input type="text" placeholder="e.g. John Doe" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Email Address (AD Mapped)</label>
                      <input type="email" placeholder="e.g. jdoe@hct.ac.ae" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue font-medium" />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-hct-blue"/> System Role Assignment</label>
                  <select defaultValue={selectedUser?.role || 'Host'} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue font-medium">
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-hct-blue"/> Campus Access Scope</label>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {CAMPUSES.map(c => (
                      <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked={selectedUser ? (selectedUser.campuses.includes(c.id) || selectedUser.campuses.includes('ALL')) : false} className="w-4 h-4 accent-hct-blue" />
                        <span className="text-sm font-bold text-slate-700">{c.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Assigning 'All Campuses' overrides individual selections.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Account Status</label>
                  <select defaultValue={selectedUser?.status || 'Active'} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue font-medium">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                <button onClick={() => { setSelectedUser(null); setIsAddingUser(false); }} className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-slate-700">Cancel</button>
                <button onClick={() => { alert('User profile saved and synced to Audit Log.'); setSelectedUser(null); setIsAddingUser(false); }} className="px-6 py-2.5 bg-hct-blue hover:bg-[#001a66] transition-colors text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                  <Save className="w-4 h-4"/> Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default UserManagement;
