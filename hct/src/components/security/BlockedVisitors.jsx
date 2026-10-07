import React, { useState } from 'react';
import { Search, ShieldAlert, Plus, X, Lock, Unlock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const BlockedVisitors = () => {
  const { restrictedVisitors, addRestrictedVisitor } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Restricted Visitor Form State
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    docType: 'Emirates ID',
    docNumber: '',
    mobile: '',
    type: 'Security Concern',
    reason: '',
  });

  const handleAdd = () => {
    if (!newVisitor.name || !newVisitor.docNumber || !newVisitor.reason) {
      alert("Name, Document Number, and Reason are mandatory.");
      return;
    }

    addRestrictedVisitor({
      id: `BR-2026-${Math.floor(Math.random()*900)+100}`,
      ...newVisitor,
      restrictedDate: new Date().toISOString().split('T')[0],
      restrictedBy: 'Admin User',
      status: 'Restricted',
      releaseType: '-',
      expiry: '-'
    });

    setShowAddModal(false);
    setNewVisitor({ name: '', docType: 'Emirates ID', docNumber: '', mobile: '', type: 'Security Concern', reason: '' });
  };

  const filteredList = restrictedVisitors.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.docNumber.includes(searchQuery));

  return (
    <>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-red-500" /> Blocked & Restricted Visitors
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage the centralized blocklist. Automatic interception active.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
         <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm"><p className="text-slate-500 text-xs font-bold uppercase mb-1">Total Restricted</p><p className="text-2xl font-black text-slate-800">{restrictedVisitors.filter(r=>r.status === 'Restricted').length}</p></div>
         <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center shadow-sm"><p className="text-amber-700 text-xs font-bold uppercase mb-1">Under Review</p><p className="text-2xl font-black text-amber-600">1</p></div>
         <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm"><p className="text-blue-700 text-xs font-bold uppercase mb-1">Temporarily Released</p><p className="text-2xl font-black text-blue-600">{restrictedVisitors.filter(r=>r.status === 'Temporarily Released').length}</p></div>
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm"><p className="text-emerald-700 text-xs font-bold uppercase mb-1">Permanently Released</p><p className="text-2xl font-black text-emerald-600">{restrictedVisitors.filter(r=>r.status === 'Permanently Released').length}</p></div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Name or ID..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">Visitor Info</th>
              <th className="p-4 font-bold uppercase">Restriction Details</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase">Current Release</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredList.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800 text-base">{v.name}</p>
                  <p className="text-xs text-slate-500">{v.docType}: <strong>{v.docNumber}</strong></p>
                  <p className="text-xs text-slate-400">{v.mobile}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-700 mb-1">{v.id} • {v.type}</p>
                  <div className="flex items-start gap-1 max-w-xs">
                    <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-slate-600 truncate" title={v.reason}>{v.reason}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Added: {v.restrictedDate} by {v.restrictedBy}</p>
                </td>
                <td className="p-4">
                  {v.status === 'Restricted' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold flex items-center gap-1 w-max"><Lock className="w-3 h-3"/> Restricted</span>}
                  {v.status === 'Temporarily Released' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold flex items-center gap-1 w-max"><Unlock className="w-3 h-3"/> Temp Released</span>}
                  {v.status === 'Permanently Released' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold flex items-center gap-1 w-max"><Unlock className="w-3 h-3"/> Perm Released</span>}
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-700">{v.releaseType}</p>
                  {v.expiry !== '-' && <p className="text-xs text-slate-500">Exp: {v.expiry}</p>}
                </td>
              </tr>
            ))}
            {filteredList.length === 0 && (
              <tr><td colSpan="4" className="p-8 text-center text-slate-500 font-bold">No restricted visitors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>

      {/* Add Restricted Visitor Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-2xl w-full border-t-8 border-red-500">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="text-2xl font-black text-slate-800">Add Restricted Visitor</h3>
                   <p className="text-sm text-slate-500">This individual will be flagged by the security system automatically.</p>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-6 h-6"/></button>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                   <input type="text" value={newVisitor.name} onChange={(e)=>setNewVisitor({...newVisitor, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number</label>
                   <input type="text" value={newVisitor.mobile} onChange={(e)=>setNewVisitor({...newVisitor, mobile: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400" />
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Document Type *</label>
                   <select value={newVisitor.docType} onChange={(e)=>setNewVisitor({...newVisitor, docType: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400">
                     <option>Emirates ID</option><option>Passport</option><option>Other ID</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Document Number *</label>
                   <input type="text" value={newVisitor.docNumber} onChange={(e)=>setNewVisitor({...newVisitor, docNumber: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400" />
                 </div>
               </div>

               <div className="border-t border-slate-200 pt-6 mb-6">
                 <h4 className="font-bold text-slate-800 mb-4">Restriction Details</h4>
                 <div className="mb-4">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Restriction Type *</label>
                   <select value={newVisitor.type} onChange={(e)=>setNewVisitor({...newVisitor, type: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400">
                     <option>Security Concern</option><option>Policy Violation</option><option>Previous Incident</option><option>Unauthorized Access</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-bold text-slate-700 mb-1">Restriction Reason * <span className="text-xs font-normal text-slate-400 ml-2">(Visible to Admin/Security only)</span></label>
                   <textarea value={newVisitor.reason} onChange={(e)=>setNewVisitor({...newVisitor, reason: e.target.value})} placeholder="Detailed reason for the restriction..." className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400 min-h-[100px]"></textarea>
                 </div>
               </div>

               <div className="flex justify-end gap-3">
                 <button onClick={() => setShowAddModal(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">Cancel</button>
                 <button onClick={handleAdd} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-md">Add to Blocklist</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlockedVisitors;

