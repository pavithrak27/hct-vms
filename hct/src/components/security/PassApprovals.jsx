import React, { useState } from 'react';
import { FileSignature, Search, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PassApprovals = () => {
  const [requests, setRequests] = useState([
    {
      id: 'CPR-2026-0002',
      company: 'Tech Solutions LLC',
      contractId: 'CON-2026-101',
      contractNumber: 'CT-2025-9981',
      employees: [
        { name: 'John Smith', id: 'EMP-CT-2026-001', nationality: 'UK', status: 'Approved' },
        { name: 'Ravi Kumar', id: 'EMP-CT-2026-002', nationality: 'India', status: 'Approved' }
      ],
      requestedStart: '2026-11-05 08:00',
      requestedEnd: '2026-11-10 18:00',
      modifiedStart: null,
      modifiedEnd: null,
      hseCompleted: true,
      declaration: true,
      submissionDate: '2026-10-04 09:15 AM',
      approvalLevel: 1,
      status: 'Pending Level 1 Approval'
    }
  ]);

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [isEditingPeriod, setIsEditingPeriod] = useState(false);
  const [editPeriod, setEditPeriod] = useState({ start: '', end: '' });

  const [showSuccessSim, setShowSuccessSim] = useState(false);

  const filteredRequests = requests.filter(r => 
    activeTab === 'pending' ? r.status.includes('Pending') : r.status === 'Approved' || r.status === 'Rejected'
  );

  const openReq = (req) => {
    setSelectedReq(req);
    setEditPeriod({ start: req.modifiedStart || req.requestedStart, end: req.modifiedEnd || req.requestedEnd });
    setIsEditingPeriod(false);
  };

  const saveEditPeriod = () => {
    setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, modifiedStart: editPeriod.start, modifiedEnd: editPeriod.end } : r));
    setSelectedReq({ ...selectedReq, modifiedStart: editPeriod.start, modifiedEnd: editPeriod.end });
    setIsEditingPeriod(false);
  };

  const handleApprove = (req) => {
    let newStatus = '';
    let newLevel = req.approvalLevel;
    let isFinal = false;

    if (req.approvalLevel === 1) {
      newStatus = 'Pending Level 2 Approval';
      newLevel = 2;
    } else if (req.approvalLevel === 2) {
      newStatus = 'Pending Final Approval';
      newLevel = 3;
    } else {
      newStatus = 'Approved';
      isFinal = true;
    }

    setRequests(requests.map(r => r.id === req.id ? { ...r, status: newStatus, approvalLevel: newLevel } : r));
    setSelectedReq(null);

    if (isFinal) {
      setShowSuccessSim(true);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) { alert("Rejection reason is mandatory."); return; }
    setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, status: 'Rejected', rejectionReason } : r));
    setShowRejectModal(false);
    setSelectedReq(null);
    setRejectionReason('');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Gate Pass Approvals</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Review requested visitor passes for contractor employees.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex p-2 bg-slate-50 border-b border-slate-200 justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('pending')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Pending ({requests.filter(r => r.status.includes('Pending')).length})</button>
            <button onClick={() => setActiveTab('history')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>History</button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.length === 0 ? (
               <div className="text-center py-12 text-slate-500">No requests found.</div>
            ) : filteredRequests.map(req => (
              <div key={req.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center bg-white" onClick={() => openReq(req)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><FileSignature className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-lg">{req.id} • {req.company}</h4>
                    <p className="text-sm text-slate-500">{req.employees.length} Employees • {req.requestedStart} to {req.requestedEnd}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${req.status.includes('Pending') ? 'bg-amber-100 text-amber-700' : req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{req.status}</span>
                  <ArrowRight className="w-5 h-5 text-slate-400" />
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
                     <div><p className="text-xs font-bold text-slate-500 uppercase">Requested Duration</p><p className={`font-bold text-base ${selectedReq.modifiedStart ? 'line-through text-slate-400' : 'text-slate-800'}`}>{selectedReq.requestedStart} <ArrowRight className="inline w-3 h-3"/> {selectedReq.requestedEnd}</p></div>
                     {selectedReq.modifiedStart && (
                       <div><p className="text-xs font-bold text-blue-600 uppercase">Approved/Modified Duration</p><p className="font-bold text-base text-blue-700">{selectedReq.modifiedStart} <ArrowRight className="inline w-3 h-3"/> {selectedReq.modifiedEnd}</p></div>
                     )}
                   </div>
                 )}
               </div>

               <div className="mb-8">
                 <h4 className="font-bold text-lg text-slate-800 mb-4">Selected Employees ({selectedReq.employees.length})</h4>
                 <div className="border border-slate-200 rounded-xl overflow-hidden">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-slate-50 border-b"><tr><th className="p-3">Name</th><th className="p-3">ID</th><th className="p-3">Status</th></tr></thead>
                     <tbody>{selectedReq.employees.map(e => <tr key={e.id} className="border-b last:border-b-0"><td className="p-3 font-bold">{e.name}</td><td className="p-3">{e.id}</td><td className="p-3 text-emerald-600 font-bold">{e.status}</td></tr>)}</tbody>
                   </table>
                 </div>
               </div>

               {selectedReq.status.includes('Pending') && (
                 <div className="flex justify-end gap-4 border-t pt-6 bg-slate-50 -mx-8 -mb-8 p-6 rounded-b-[24px]">
                   <button onClick={() => setShowRejectModal(true)} className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50">Reject Request</button>
                   <button onClick={() => handleApprove(selectedReq)} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">
                     {selectedReq.approvalLevel === 3 ? 'Confirm Final Approval' : 'Approve & Forward'}
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
