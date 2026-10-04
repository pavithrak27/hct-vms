import React, { useState } from 'react';
import { Users, CheckCircle2, XCircle, Search, ShieldAlert, FileText, ArrowRight, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContractor } from '../../context/ContractorContext';

const EmployeeApprovals = () => {
  const { employees: requests, approveEmployee, rejectEmployee } = useContractor();

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const filteredRequests = requests.filter(r => 
    activeTab === 'pending' ? r.status === 'Pending Approval' : r.status !== 'Pending Approval'
  );

  const handleApprove = () => {
    approveEmployee(selectedReq.id);
    setSelectedReq(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Rejection reason is mandatory.");
      return;
    }
    rejectEmployee(selectedReq.id, rejectionReason);
    setShowRejectModal(false);
    setSelectedReq(null);
    setRejectionReason('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Employee Approvals</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Review and verify contractor employees before granting Gate Pass eligibility.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex p-2 bg-slate-50 border-b border-slate-200 justify-between items-center">
          <div className="flex gap-2">
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({requests.filter(r => r.status === 'Pending Approval').length})
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
          <div className="mr-4 relative">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search employees..." className="pl-9 p-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue text-sm w-64 bg-white" />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.length === 0 ? (
               <div className="col-span-2 text-center py-12 text-slate-500">No requests found.</div>
            ) : filteredRequests.map(req => (
              <div key={req.id} onClick={() => setSelectedReq(req)} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex gap-5 bg-white">
                <img src={req.photo} alt={req.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-lg leading-tight">{req.name}</h4>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      req.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {req.status === 'Approved' ? 'Eligible for Gate Pass' : req.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-2">{req.company}</p>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span>{req.id}</span>
                    <span>{req.nationality}</span>
                    <span>{req.jobTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReq && !showRejectModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6 border-b pb-4">
                 <div>
                   <h3 className="text-2xl font-bold flex items-center gap-3">
                     Employee Verification
                   </h3>
                   <p className="text-slate-500">Submitted: {selectedReq.submissionDate}</p>
                 </div>
                 <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-700">✕</button>
               </div>

               <div className="grid grid-cols-3 gap-8 mb-8">
                 {/* Visuals */}
                 <div className="col-span-1 space-y-4">
                   <div className="border border-slate-200 rounded-xl p-2 bg-slate-50">
                     <p className="text-xs font-bold text-slate-500 uppercase text-center mb-2 flex items-center justify-center gap-1"><Camera className="w-4 h-4"/> Live Photo</p>
                     <img src={selectedReq.photo} alt={selectedReq.name} className="w-full aspect-square object-cover rounded-lg" />
                   </div>
                 </div>

                 {/* Details */}
                 <div className="col-span-2 space-y-6">
                   <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                     <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-3">Company Link</h4>
                     <p className="font-bold text-slate-800 text-lg">{selectedReq.company}</p>
                     <p className="text-slate-600 text-sm">{selectedReq.contractId}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-y-4 text-sm">
                     <div><span className="text-slate-500 block mb-1">Full Name</span><strong className="text-base">{selectedReq.name}</strong></div>
                     <div><span className="text-slate-500 block mb-1">Employee ID</span><strong className="text-base">{selectedReq.id}</strong></div>
                     <div><span className="text-slate-500 block mb-1">Nationality</span><strong>{selectedReq.nationality}</strong></div>
                     <div><span className="text-slate-500 block mb-1">Mobile</span><strong>{selectedReq.mobile}</strong></div>
                     <div><span className="text-slate-500 block mb-1">Job Title</span><strong>{selectedReq.jobTitle}</strong></div>
                     
                     <div className="col-span-2 pt-4 border-t border-slate-100">
                       <span className="text-slate-500 block mb-2">Identity Document (Passport/EID)</span>
                       <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer">
                         <div className="p-2 bg-white rounded shadow-sm"><FileText className="w-6 h-6 text-blue-500"/></div>
                         <div>
                           <p className="font-bold text-slate-700">{selectedReq.document}</p>
                           <p className="text-xs text-slate-500">Click to preview document</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               {selectedReq.status === 'Pending Approval' && (
                 <div className="flex justify-end gap-4 border-t pt-6 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-[24px]">
                   <button onClick={() => setShowRejectModal(true)} className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors">Reject Registration</button>
                   <button onClick={handleApprove} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" /> Approve & Enable Gate Pass
                   </button>
                 </div>
               )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600"><ShieldAlert className="w-6 h-6" /> Reject Employee</h3>
               <p className="text-sm text-slate-600 mb-4">Please provide a reason for rejecting <strong className="text-slate-800">{selectedReq.name}</strong>. The contractor will be notified to correct the issue.</p>
               <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl mb-4 h-24 focus:ring-2 focus:ring-red-500 outline-none" placeholder="e.g., Passport copy is blurry."></textarea>
               <div className="flex justify-end gap-3">
                 <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold hover:bg-slate-200">Cancel</button>
                 <button onClick={handleReject} disabled={!rejectionReason.trim()} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-red-600">Reject Employee</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmployeeApprovals;
