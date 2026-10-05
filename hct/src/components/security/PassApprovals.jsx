import React, { useState } from 'react';
import { FileSignature, Search, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Edit3, X, Building2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContractor } from '../../context/ContractorContext';

const mockContractors = [
  { id: 'CON-2026-102', name: 'Global Facilities Mgt', contractNumber: 'FM-2026-1122', status: 'Pending Approval', date: '2026-10-04' },
  { id: 'CON-2026-103', name: 'Apex Builders', contractNumber: 'AB-2026-3311', status: 'Pending Approval', date: '2026-10-05' }
];

const PassApprovals = () => {
  const { passRequests: requests, updatePassRequest, approvePassRequest, approvalConfig, employees, approveEmployee, rejectEmployee } = useContractor();

  const [mainTab, setMainTab] = useState('gate-passes'); // gate-passes, contractors, employees
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [editPeriod, setEditPeriod] = useState({ start: '', end: '' });

  const [showSuccessSim, setShowSuccessSim] = useState(false);
  const [finalDurationConfirmed, setFinalDurationConfirmed] = useState(false);

  const filteredRequests = requests.filter(r => 
    activeTab === 'pending' ? r.status.includes('Pending') : r.status === 'Approved' || r.status === 'Rejected'
  );

  const openReq = (req) => {
    setSelectedReq(req);
    setEditPeriod({ start: req.modifiedStart || req.start, end: req.modifiedEnd || req.end });
    setIsEditingPeriod(false);
    setFinalDurationConfirmed(false);
  };

  const saveEditPeriod = () => {
    updatePassRequest(selectedReq.id, editPeriod.start, editPeriod.end);
    setSelectedReq({ ...selectedReq, modifiedStart: editPeriod.start, modifiedEnd: editPeriod.end });
    setIsEditingPeriod(false);
  };

  const handleApprove = (req) => {
    // If it's a flow, check if it's the final level
    const isFinal = approvalConfig.mode === 'flow' ? (req.approvalLevel === approvalConfig.levels.length) : true;
    approvePassRequest(req.id, isFinal);
    setSelectedReq(null);

    if (isFinal) {
      setShowSuccessSim(true);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) { alert("Rejection reason is mandatory."); return; }
    approvePassRequest(selectedReq.id, false, rejectionReason);
    setShowRejectModal(false);
    setSelectedReq(null);
    setRejectionReason('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Approvals Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Review and manage all pending requests and registrations.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setMainTab('gate-passes')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mainTab === 'gate-passes' ? 'bg-hct-blue text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <FileSignature className="w-5 h-5"/> Gate Passes
        </button>
        <button onClick={() => setMainTab('contractors')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mainTab === 'contractors' ? 'bg-hct-blue text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Building2 className="w-5 h-5"/> Contractors
        </button>
        <button onClick={() => setMainTab('employees')} className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${mainTab === 'employees' ? 'bg-hct-blue text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}>
          <Users className="w-5 h-5"/> Employees
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex p-2 bg-slate-50 border-b border-slate-200 justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('pending')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pending ({requests.filter(r => r.status.includes('Pending')).length})</button>
            <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>History</button>
          </div>
        </div>

        <div className="p-6">
          {mainTab === 'gate-passes' && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in">
              {filteredRequests.length === 0 ? (
                 <div className="text-center py-12 text-slate-500">No requests found.</div>
              ) : filteredRequests.map(req => (
                <div key={req.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center bg-white" onClick={() => openReq(req)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><FileSignature className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{req.id} • {req.company}</h4>
                      <p className="text-sm text-slate-500">{Array.isArray(req.employees) ? req.employees.length : 1} Employees • {req.start} to {req.end}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${req.status.includes('Pending') ? 'bg-amber-100 text-amber-700' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {mainTab === 'contractors' && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in">
              {activeTab === 'history' ? (
                <div className="text-center py-12 text-slate-500">No history found.</div>
              ) : mockContractors.map(c => (
                <div key={c.id} className="border border-slate-200 rounded-xl p-5 bg-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{c.name}</h4>
                      <p className="text-sm text-slate-500">Contract: {c.contractNumber} • Submitted: {c.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200">Reject</button>
                    <button className="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-bold text-white hover:bg-emerald-600 shadow-md">Approve</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {mainTab === 'employees' && (
            <div className="grid grid-cols-1 gap-4 animate-in fade-in">
              {employees.filter(e => activeTab === 'pending' ? e.status.includes('Pending') : !e.status.includes('Pending')).length === 0 ? (
                <div className="text-center py-12 text-slate-500">No requests found.</div>
              ) : employees.filter(e => activeTab === 'pending' ? e.status.includes('Pending') : !e.status.includes('Pending')).map(e => (
                <div key={e.id} className="border border-slate-200 rounded-xl p-5 bg-white flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center"><Users className="w-6 h-6" /></div>
                    <div>
                      <h4 className="font-bold text-lg">{e.name} • {e.company}</h4>
                      <p className="text-sm text-slate-500">{e.jobTitle} • {e.id}</p>
                    </div>
                  </div>
                  {activeTab === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button onClick={() => rejectEmployee(e.id, 'Rejected by Admin')} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-200">Reject</button>
                      <button onClick={() => approveEmployee(e.id)} className="px-4 py-2 bg-emerald-500 rounded-lg text-sm font-bold text-white hover:bg-emerald-600 shadow-md">Approve</button>
                    </div>
                  ) : (
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${e.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{e.status}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReq && !showRejectModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6 border-b pb-4">
                 <div>
                   <h3 className="text-2xl font-bold flex items-center gap-2"><FileSignature className="text-hct-blue w-6 h-6"/> {selectedReq.id}</h3>
                   <p className="text-slate-500">Submitted: {selectedReq.submissionDate}</p>
                 </div>
                 <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-700"><X className="w-6 h-6"/></button>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                   <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-3">Contractor Info</h4>
                   <p className="mb-1"><span className="text-slate-500 inline-block w-24">Company</span><strong className="text-slate-800">{selectedReq.company}</strong></p>
                   <p className="mb-1"><span className="text-slate-500 inline-block w-24">Contract No</span><strong className="text-slate-800">{selectedReq.contractNumber}</strong></p>
                 </div>
                 
                 <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                   <h4 className="font-bold text-emerald-600 uppercase tracking-wider mb-3">Compliance Checks</h4>
                   <p className="flex items-center gap-2 text-emerald-800 font-bold mb-1"><CheckCircle2 className="w-4 h-4"/> HSE Training Completed</p>
                   <p className="flex items-center gap-2 text-emerald-800 font-bold"><CheckCircle2 className="w-4 h-4"/> Declaration Accepted</p>
                 </div>
               </div>

               <div className="mb-8">
                 <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-lg text-slate-800">Visit Period</h4>
                   {!isEditingPeriod && selectedReq.status.includes('Pending') && (
                     <button onClick={() => setIsEditingPeriod(true)} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"><Edit3 className="w-4 h-4"/> Edit Visit Period</button>
                   )}
                 </div>

                 {isEditingPeriod ? (
                   <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                     <p className="text-sm text-blue-700 font-bold mb-4">Modifying this period will update the approved pass validity for all selected employees.</p>
                     <div className="grid grid-cols-2 gap-4 mb-4">
                       <div><label className="text-xs font-bold text-blue-700 block mb-1">Start Date & Time</label><input type="text" value={editPeriod.start} onChange={(e) => setEditPeriod({...editPeriod, start: e.target.value})} className="w-full p-2 rounded border border-blue-300" /></div>
                       <div><label className="text-xs font-bold text-blue-700 block mb-1">End Date & Time</label><input type="text" value={editPeriod.end} onChange={(e) => setEditPeriod({...editPeriod, end: e.target.value})} className="w-full p-2 rounded border border-blue-300" /></div>
                     </div>
                     <div className="flex justify-end gap-2"><button onClick={() => setIsEditingPeriod(false)} className="px-4 py-2 bg-white rounded font-bold">Cancel</button><button onClick={saveEditPeriod} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Save Changes</button></div>
                   </div>
                 ) : (
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-8">
                     <div><p className="text-xs font-bold text-slate-500 uppercase">Requested Duration</p><p className={`font-bold text-base ${selectedReq.modifiedStart ? 'line-through text-slate-400' : 'text-slate-800'}`}>{selectedReq.start} <ArrowRight className="inline w-3 h-3"/> {selectedReq.end}</p></div>
                     {selectedReq.modifiedStart && (
                       <div><p className="text-xs font-bold text-blue-600 uppercase">Approved/Modified Duration</p><p className="font-bold text-base text-blue-700">{selectedReq.modifiedStart} <ArrowRight className="inline w-3 h-3"/> {selectedReq.modifiedEnd}</p></div>
                     )}
                   </div>
                 )}
               </div>

               <div className="mb-8">
                 <h4 className="font-bold text-lg text-slate-800 mb-4">Selected Employees ({Array.isArray(selectedReq.employees) ? selectedReq.employees.length : 1})</h4>
                 <div className="border border-slate-200 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b"><tr><th className="p-3">Employee ID</th><th className="p-3">Status</th></tr></thead>
                     <tbody>
                       {Array.isArray(selectedReq.employees) ? selectedReq.employees.map((e, idx) => (
                         <tr key={idx} className="border-b last:border-b-0"><td className="p-3 font-bold">{e}</td><td className="p-3 text-emerald-600 font-bold">Approved</td></tr>
                       )) : (
                         <tr className="border-b"><td className="p-3 font-bold text-red-500">Error: Invalid employee data</td><td className="p-3"></td></tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               </div>

               {selectedReq.status.includes('Pending') && (
                 <div className="flex flex-col border-t pt-6 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-[24px]">
                   {approvalConfig.mode === 'flow' && selectedReq.approvalLevel === approvalConfig.levels.length && (
                     <label className="flex items-center gap-3 mb-4 p-4 border border-blue-200 bg-blue-50 rounded-xl cursor-pointer">
                       <input type="checkbox" checked={finalDurationConfirmed} onChange={() => setFinalDurationConfirmed(!finalDurationConfirmed)} className="w-5 h-5" />
                       <span className="font-bold text-blue-900">I confirm the final approved visit duration is correct.</span>
                     </label>
                   )}
                   <div className="flex justify-end gap-4">
                     <button onClick={() => setShowRejectModal(true)} className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50">Reject Request</button>
                     <button 
                       onClick={() => handleApprove(selectedReq)} 
                       disabled={approvalConfig.mode === 'flow' && selectedReq.approvalLevel === approvalConfig.levels.length && !finalDurationConfirmed}
                       className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {(approvalConfig.mode === 'flow' && selectedReq.approvalLevel === approvalConfig.levels.length) || approvalConfig.mode !== 'flow' ? 'Confirm & Final Approve' : 'Approve & Forward'}
                     </button>
                   </div>
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-6 max-w-md w-full">
               <h3 className="text-xl font-bold mb-4 text-red-600">Reject Request</h3>
               <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl mb-4 h-24" placeholder="Mandatory rejection reason..."></textarea>
               <div className="flex justify-end gap-3"><button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button><button onClick={handleReject} disabled={!rejectionReason.trim()} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold">Reject</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Success Simulation */}
      <AnimatePresence>
        {showSuccessSim && (
          <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-10 h-10 text-emerald-500"/></div>
              <h2 className="text-2xl font-bold mb-2">Final Approval Complete</h2>
              <p className="text-slate-600 mb-6">The system has automatically generated {selectedReq?.employees?.length} unique QR-coded Gate Passes for the contractor.</p>
              <button onClick={() => setShowSuccessSim(false)} className="bg-hct-blue text-white px-8 py-3 rounded-xl font-bold w-full">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default PassApprovals;
