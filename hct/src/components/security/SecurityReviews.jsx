import React, { useState } from 'react';
import { Search, FileSearch, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, X, Clock, Unlock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const SecurityReviews = () => {
  const { securityReviews, actionSecurityReview } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  
  // Action Modals State
  const [actionModal, setActionModal] = useState(null); // 'DENY', 'TEMP_RELEASE', 'PERM_RELEASE'
  const [actionDetails, setActionDetails] = useState({ expiry: '', reason: '' });

  const handleAction = () => {
    if ((actionModal === 'DENY' || actionModal === 'PERM_RELEASE') && !actionDetails.reason) {
      alert("Reason is mandatory."); return;
    }
    if (actionModal === 'TEMP_RELEASE' && (!actionDetails.expiry || !actionDetails.reason)) {
      alert("Expiry Date and Reason are mandatory for Temporary Release."); return;
    }

    actionSecurityReview(selectedReview.id, actionModal, actionDetails);
    
    // Reset
    setActionModal(null);
    setSelectedReview(null);
    setActionDetails({ expiry: '', reason: '' });
  };

  const filteredReviews = securityReviews.filter(r => r.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || r.docNumber.includes(searchQuery));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <FileSearch className="w-8 h-8 text-amber-500" /> Security Reviews
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage pending reviews triggered by the Restricted Visitor blocklist.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search reviews by Name or ID..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">Review ID & Time</th>
              <th className="p-4 font-bold uppercase">Visitor Info</th>
              <th className="p-4 font-bold uppercase">Restriction Matched</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredReviews.map(r => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-mono font-bold text-slate-800">{r.id}</p>
                  <p className="text-xs text-slate-500">{r.matchTime}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={r.photo} alt={r.visitorName} className="w-10 h-10 rounded-full border border-slate-200" />
                    <div>
                      <p className="font-bold text-slate-800">{r.visitorName}</p>
                      <p className="text-xs text-slate-500">{r.docNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-bold text-red-600 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> {r.reason}</p>
                  <p className="text-xs text-slate-500">Host: {r.host}</p>
                </td>
                <td className="p-4">
                  {r.status === 'Pending Security Review' && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-bold flex items-center gap-1 w-max"><AlertTriangle className="w-3 h-3"/> Pending Review</span>}
                  {r.status === 'Denied' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full font-bold flex items-center gap-1 w-max"><XCircle className="w-3 h-3"/> Denied</span>}
                  {r.status === 'Temporarily Released' && <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold flex items-center gap-1 w-max"><Clock className="w-3 h-3"/> Temp Released</span>}
                  {r.status === 'Permanently Released' && <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold flex items-center gap-1 w-max"><Unlock className="w-3 h-3"/> Perm Released</span>}
                </td>
                <td className="p-4 text-right">
                  {r.status === 'Pending Security Review' ? (
                    <button onClick={() => setSelectedReview(r)} className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold shadow-md text-xs">Review Now</button>
                  ) : (
                    <span className="text-slate-400 text-xs font-bold">Review Completed</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-bold">No security reviews found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Security Review Modal */}
      <AnimatePresence>
        {selectedReview && !actionModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] overflow-hidden max-w-2xl w-full shadow-2xl">
               <div className="bg-amber-50 border-b border-amber-200 p-6 flex justify-between items-start">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><AlertTriangle className="w-6 h-6"/></div>
                   <div>
                     <h3 className="text-2xl font-black text-amber-900 mb-1">Security Review Required</h3>
                     <p className="text-amber-700 font-medium text-sm">Visitor intercepted during Check-in attempt.</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedReview(null)} className="text-amber-400 hover:text-amber-700"><X className="w-6 h-6"/></button>
               </div>
               
               <div className="p-8">
                 <div className="flex gap-8 mb-8 border-b border-slate-200 pb-8">
                   <img src={selectedReview.photo} alt={selectedReview.visitorName} className="w-32 h-32 rounded-2xl object-cover shadow-md border border-slate-200" />
                   <div>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Visitor Details</p>
                     <h4 className="text-3xl font-black text-slate-800 mb-2">{selectedReview.visitorName}</h4>
                     <p className="font-mono text-slate-600 mb-1">ID: <strong>{selectedReview.docNumber}</strong></p>
                     <p className="text-slate-600">Host: <strong>{selectedReview.host}</strong></p>
                     <p className="text-slate-600">Attempt Time: <strong>{selectedReview.matchTime}</strong></p>
                   </div>
                 </div>

                 <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                   <p className="text-sm font-bold text-red-800 uppercase tracking-widest mb-3 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Restriction Matched</p>
                   <p className="font-bold text-red-900 text-lg mb-1">{selectedReview.reason}</p>
                   <p className="text-red-700 text-sm font-medium">Restriction ID: {selectedReview.restrictionId}</p>
                 </div>

                 <p className="font-bold text-slate-800 mb-4 text-center">Select Security Action</p>
                 <div className="grid grid-cols-3 gap-4">
                   <button onClick={() => setActionModal('DENY')} className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-red-200 hover:border-red-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors"><XCircle className="w-5 h-5"/></div>
                     <span className="font-bold text-red-700">Deny Visit</span>
                   </button>
                   <button onClick={() => setActionModal('TEMP_RELEASE')} className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-blue-200 hover:border-blue-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors"><Clock className="w-5 h-5"/></div>
                     <span className="font-bold text-blue-700 text-center">Temporary Release</span>
                   </button>
                   <button onClick={() => setActionModal('PERM_RELEASE')} className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-emerald-200 hover:border-emerald-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Unlock className="w-5 h-5"/></div>
                     <span className="font-bold text-emerald-700 text-center">Permanent Release</span>
                   </button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Configuration Modal */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className={`bg-white rounded-[24px] p-8 max-w-md w-full border-t-8 ${actionModal === 'DENY' ? 'border-red-500' : actionModal === 'TEMP_RELEASE' ? 'border-blue-500' : 'border-emerald-500'}`}>
               <h3 className="text-2xl font-black mb-6">
                 {actionModal === 'DENY' && 'Confirm Denial'}
                 {actionModal === 'TEMP_RELEASE' && 'Configure Temporary Release'}
                 {actionModal === 'PERM_RELEASE' && 'Confirm Permanent Release'}
               </h3>
               
               {actionModal === 'TEMP_RELEASE' && (
                 <div className="mb-4">
                   <label className="block text-sm font-bold text-slate-700 mb-1">Release Expiry Date/Time *</label>
                   <input type="datetime-local" value={actionDetails.expiry} onChange={(e)=>setActionDetails({...actionDetails, expiry: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-blue-400" />
                 </div>
               )}

               <div className="mb-6">
                 <label className="block text-sm font-bold text-slate-700 mb-1">Authorization Reason *</label>
                 <textarea value={actionDetails.reason} onChange={(e)=>setActionDetails({...actionDetails, reason: e.target.value})} placeholder="Provide justification for this security decision..." className="w-full p-3 rounded-xl border border-slate-300 outline-none min-h-[100px]"></textarea>
               </div>

               <div className="flex justify-end gap-3">
                 <button onClick={() => setActionModal(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">Cancel</button>
                 <button onClick={handleAction} className={`px-8 py-3 text-white rounded-xl font-bold shadow-md ${actionModal === 'DENY' ? 'bg-red-600 hover:bg-red-700' : actionModal === 'TEMP_RELEASE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                   Confirm Action
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SecurityReviews;
