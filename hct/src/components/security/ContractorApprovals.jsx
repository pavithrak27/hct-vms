import React, { useState } from 'react';
import { Building2, CheckCircle2, XCircle, FileText, Search, ShieldAlert, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContractorApprovals = () => {
  const [requests, setRequests] = useState([
    {
      id: 'CON-2026-101',
      companyName: 'Tech Solutions LLC',
      contractNumber: 'CT-2025-9981',
      jobDescription: 'IT Infrastructure Upgrade',
      contactPerson: 'Jane Doe',
      contractStart: '2026-11-01',
      contractExpiry: '2027-11-01',
      gatePassValidity: '2026-11-01 to 2027-10-31',
      document: 'Contract_Agreement_Signed.pdf',
      submissionDate: '2026-10-04 09:15 AM',
      approvalLevel: 1,
      status: 'Pending Level 1 Approval'
    },
    {
      id: 'CON-2026-102',
      companyName: 'Global Facilities Mgt',
      contractNumber: 'FM-2026-1122',
      jobDescription: 'Campus Cleaning Services',
      contactPerson: 'Ahmed Hassan',
      contractStart: '2026-10-15',
      contractExpiry: '2028-10-14',
      gatePassValidity: '2026-10-15 to 2028-10-14',
      document: 'Facilities_Contract_Final.pdf',
      submissionDate: '2026-10-03 14:30 PM',
      approvalLevel: 2,
      status: 'Pending Level 2 Approval'
    }
  ]);

  const [activeTab, setActiveTab] = useState('pending');
  const [selectedReq, setSelectedReq] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showEmailSim, setShowEmailSim] = useState(false);

  const filteredRequests = requests.filter(r => 
    activeTab === 'pending' ? r.status.includes('Pending') : r.status === 'Approved' || r.status === 'Rejected'
  );

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
      setShowEmailSim(true);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert("Rejection reason is mandatory.");
      return;
    }
    setRequests(requests.map(r => r.id === selectedReq.id ? { ...r, status: 'Rejected', rejectionReason } : r));
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
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Contractor Approvals</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Review and process contractor company registrations.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex p-2 bg-slate-50 border-b border-slate-200">
          <div className="flex gap-2">
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({requests.filter(r => r.status.includes('Pending')).length})
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              onClick={() => setActiveTab('history')}
            >
              History
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredRequests.length === 0 ? (
               <div className="text-center py-12 text-slate-500">No requests found.</div>
            ) : filteredRequests.map(req => (
              <div key={req.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center" onClick={() => setSelectedReq(req)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-lg">{req.companyName}</h4>
                    <p className="text-sm text-slate-500">{req.id} • {req.contractNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                    req.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                    req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-start mb-6 border-b pb-4">
                 <div>
                   <h3 className="text-2xl font-bold">{selectedReq.companyName}</h3>
                   <p className="text-slate-500">Submitted: {selectedReq.submissionDate}</p>
                 </div>
                 <button onClick={() => setSelectedReq(null)} className="text-slate-400 hover:text-slate-700">✕</button>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                 <div><span className="text-slate-500 block">Contract No</span><strong>{selectedReq.contractNumber}</strong></div>
                 <div><span className="text-slate-500 block">Contact Person</span><strong>{selectedReq.contactPerson}</strong></div>
                 <div className="col-span-2"><span className="text-slate-500 block">Job Description</span><strong>{selectedReq.jobDescription}</strong></div>
                 
                 <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                   <div><span className="text-slate-500 block">Contract Dates</span><strong>{selectedReq.contractStart} to {selectedReq.contractExpiry}</strong></div>
                   <div><span className="text-slate-500 block">Gate Pass Validity</span><strong>{selectedReq.gatePassValidity}</strong></div>
                   <div className="col-span-2 pt-2 border-t border-slate-200 mt-2">
                     <span className="text-slate-500 block mb-1">Contract Document</span>
                     <div className="flex items-center gap-2 text-blue-600 font-bold"><FileText className="w-4 h-4"/> {selectedReq.document}</div>
                   </div>
                 </div>
               </div>

               {selectedReq.status.includes('Pending') && (
                 <div className="flex justify-end gap-4 border-t pt-6">
                   <button onClick={() => setShowRejectModal(true)} className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100">Reject</button>
                   <button onClick={() => handleApprove(selectedReq)} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600">
                     {selectedReq.approvalLevel === 3 ? 'Final Approve' : 'Approve & Forward'}
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
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600"><ShieldAlert className="w-6 h-6" /> Reject Registration</h3>
               <p className="text-sm text-slate-500 mb-4">A mandatory rejection reason is required to notify the contractor.</p>
               <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-3 border border-slate-300 rounded-xl mb-4 h-24" placeholder="e.g., Contract document has expired."></textarea>
               <div className="flex justify-end gap-3">
                 <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
                 <button onClick={handleReject} disabled={!rejectionReason.trim()} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold disabled:opacity-50">Confirm Reject</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Simulation Modal */}
      <AnimatePresence>
        {showEmailSim && (
          <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white rounded-xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
              <div className="bg-slate-100 p-3 border-b flex gap-2"><div className="w-3 h-3 bg-red-400 rounded-full"></div><div className="w-3 h-3 bg-amber-400 rounded-full"></div><div className="w-3 h-3 bg-green-400 rounded-full"></div></div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4">Contractor Registration Approved</h2>
                <div className="prose text-sm text-slate-600">
                  <p>Your contractor company registration has been fully approved by HCT Security.</p>
                  <div className="bg-slate-50 p-4 rounded-lg my-4 border">
                    <p><strong>Portal URL:</strong> contractor.hct.ac.ae</p>
                    <p><strong>Username:</strong> admin@techsolutions.com</p>
                    <p><strong>Temporary Password:</strong> HCTTemp@2026</p>
                    <p><strong>Contractor ID:</strong> CON-2026-101</p>
                  </div>
                  <p className="text-red-500 font-bold mb-6">You will be required to change this temporary password upon first login.</p>
                  <button onClick={() => setShowEmailSim(false)} className="bg-hct-blue text-white px-6 py-2 rounded-lg font-bold w-full">Close Simulation</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default ContractorApprovals;
