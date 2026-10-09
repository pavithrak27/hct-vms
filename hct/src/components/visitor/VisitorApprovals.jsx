import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle2, XCircle, Clock, ShieldAlert, UserCheck, CheckSquare, X, FileText, Download } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

const initialVisitorsForApproval = [
  { 
    id: 'V-1021', name: 'John Smith', company: 'Tech Solutions LLC', host: 'Dr. Ahmed Al-Maktoum', type: 'Walk-In', date: '2026-10-05', time: '09:00 AM', status: 'Pending', phone: '+971 50 123 4567', email: 'john.smith@techsolutions.com', vehicleNumber: 'DXB A 48291', docId: '784-1990-1234567-1', docType: 'Emirates ID', isBlocked: false,
    photo: 'https://i.pravatar.cc/300?img=11',
    emiratesId: { idNumber: '784-1990-1234567-1', cardNumber: '102834761', fullName: 'John Smith', dob: '1990-03-15', nationality: 'United States', gender: 'M', issueDate: '2022-01-10', expiryDate: '2027-01-09', occupation: 'Software Engineer', employer: 'Tech Solutions LLC', issuingPlace: 'Abu Dhabi', country: 'United Arab Emirates' } 
  },
  { 
    id: 'V-1023', name: 'Michael Chang', company: 'Global Services', host: 'Prof. Tariq', type: 'Pre-approved', date: '2026-10-05', time: '11:15 AM', status: 'Pending', phone: '+971 52 555 1234', email: 'm.chang@globalservices.com', vehicleNumber: 'AUH B 12093', docId: '784-1985-7654321-9', docType: 'Emirates ID', isBlocked: false,
    photo: 'https://i.pravatar.cc/300?img=12',
    emiratesId: { idNumber: '784-1985-7654321-9', cardNumber: '209183746', fullName: 'Michael Chang', dob: '1985-08-22', nationality: 'China', gender: 'M', issueDate: '2021-06-15', expiryDate: '2026-06-14', occupation: 'Contractor', employer: 'Global Services', issuingPlace: 'Dubai', country: 'United Arab Emirates' } 
  },
  { 
    id: 'V-1024', name: 'Emma Wilson', company: 'Ministry of Education', host: 'Prof. Tariq', type: 'Walk-In', date: '2026-10-05', time: '01:00 PM', status: 'Pending', phone: '+971 54 333 9999', email: 'e.wilson@moe.gov.ae', vehicleNumber: 'SHJ C 77123', docId: '784-1992-1112223-4', docType: 'Emirates ID', isBlocked: false,
    photo: 'https://i.pravatar.cc/300?img=47',
    emiratesId: { idNumber: '784-1992-1112223-4', cardNumber: '317294851', fullName: 'Emma Wilson', dob: '1992-11-05', nationality: 'United Kingdom', gender: 'F', issueDate: '2023-03-20', expiryDate: '2028-03-19', occupation: 'Education Specialist', employer: 'Ministry of Education', issuingPlace: 'Sharjah', country: 'United Arab Emirates' } 
  },
  { 
    id: 'V-1025', name: 'David Lee', company: 'ABC Cleaning', host: 'Jane Doe', type: 'Walk-In', date: '2026-10-05', time: '02:45 PM', status: 'Approved', phone: '+971 56 777 8888', email: 'david.l@abccleaning.com', vehicleNumber: 'DXB M 90812', docId: 'P-11223344', docType: 'Passport', isBlocked: false,
    photo: 'https://i.pravatar.cc/300?img=33',
    emiratesId: { idNumber: '784-2002-4977006-4', cardNumber: '129647381', fullName: 'David Lee', dob: '2002-07-05', nationality: 'India', gender: 'M', issueDate: '2023-06-07', expiryDate: '2025-06-06', occupation: 'Building Labourer', employer: 'ABC Cleaning LLC', issuingPlace: 'Dubai', country: 'United Arab Emirates' } 
  },
  { 
    id: 'V-1026', name: 'Robert Taylor', company: 'Apex Logistics', host: 'Dr. Ahmed Al-Maktoum', type: 'Walk-In', date: '2026-10-05', time: '03:15 PM', status: 'Rejected', rejectionReason: 'Security clearances not met / expired document', phone: '+971 50 888 1234', email: 'r.taylor@apexlogistics.com', vehicleNumber: 'DXB K 55432', docId: '784-1988-9988776-5', docType: 'Emirates ID', isBlocked: false,
    photo: 'https://i.pravatar.cc/300?img=60',
    emiratesId: { idNumber: '784-1988-9988776-5', cardNumber: '456789123', fullName: 'Robert Taylor', dob: '1988-04-12', nationality: 'Canada', gender: 'M', issueDate: '2020-05-10', expiryDate: '2025-05-09', occupation: 'Logistics Manager', employer: 'Apex Logistics', issuingPlace: 'Dubai', country: 'United Arab Emirates' } 
  },
];

const VisitorApprovals = () => {
  const { sessionUser } = useRole();
  const [visitorsList, setVisitorsList] = useState(initialVisitorsForApproval);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('Pending'); // 'Pending', 'Approved', 'Rejected', 'ALL'
  
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'Approve' | 'Reject', visitor }
  const [rejectionRemarks, setRejectionRemarks] = useState('');
  const [fullPhotoUrl, setFullPhotoUrl] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);

  const filteredVisitors = visitorsList.filter(visitor => {
    const matchesSearch = 
      visitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.company.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusTab === 'ALL') return true;
    return visitor.status === statusTab;
  });

  const handleApprove = (visitor) => {
    setConfirmAction({ type: 'Approve', visitor });
  };

  const handleReject = (visitor) => {
    setConfirmAction({ type: 'Reject', visitor });
  };

  const executeAction = () => {
    if (confirmAction.type === 'Reject' && !rejectionRemarks.trim()) {
      alert("Please provide rejection remarks before rejecting.");
      return;
    }

    setVisitorsList(visitorsList.map(v => {
      if (v.id === confirmAction.visitor.id) {
        return {
          ...v,
          status: confirmAction.type === 'Approve' ? 'Approved' : 'Rejected',
          rejectionReason: confirmAction.type === 'Reject' ? rejectionRemarks.trim() : v.rejectionReason
        };
      }
      return v;
    }));

    setConfirmAction(null);
    setRejectionRemarks('');
    setSelectedVisitor(null);
  };

  const pendingCount = visitorsList.filter(v => v.status === 'Pending').length;
  const approvedCount = visitorsList.filter(v => v.status === 'Approved').length;
  const rejectedCount = visitorsList.filter(v => v.status === 'Rejected').length;

  return (
    <div className="w-full animate-in fade-in flex flex-col min-h-[80vh] space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <CheckSquare className="w-8 h-8 text-emerald-500 shrink-0" /> Visitor Approvals
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Review pending visitor access requests, verify credentials, and approve or reject visitor entry.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Approval</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{pendingCount}</p>
        </div>
        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Approved Requests</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{approvedCount}</p>
        </div>
        <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Rejected Requests</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{rejectedCount}</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Requests</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white">{visitorsList.length}</p>
        </div>
      </div>

      {/* Main Approvals Table Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-800/40">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              placeholder="Search by Visitor Name, ID, Host, or Company..." 
              className="w-full pl-9 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-hct-blue" 
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {[
              { id: 'Pending', label: `Pending (${pendingCount})` },
              { id: 'Approved', label: `Approved (${approvedCount})` },
              { id: 'Rejected', label: `Rejected (${rejectedCount})` },
              { id: 'ALL', label: 'All Requests' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  statusTab === tab.id
                    ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Approvals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Request ID</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Visitor Details</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Host & Campus</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Visit Date & Time</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredVisitors.map(visitor => (
                <tr key={visitor.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  
                  {/* ID */}
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      {visitor.id}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{visitor.type}</p>
                  </td>

                  {/* Visitor Details */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={visitor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.name)}&background=0284c7&color=fff`} 
                        alt={visitor.name}
                        onClick={() => setFullPhotoUrl(visitor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.name)}&background=0284c7&color=fff`)}
                        className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm cursor-pointer hover:ring-2 hover:ring-blue-400 hover:scale-105 transition-all"
                        title="Click to view full photo"
                      />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{visitor.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{visitor.docType}: {visitor.docId}</p>
                        <p className="text-[11px] text-slate-400">{visitor.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Host */}
                  <td className="p-4">
                    <p className="font-bold text-slate-800 dark:text-white">{visitor.host}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{visitor.company}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 dark:text-white text-xs">{visitor.date}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{visitor.time}</p>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {visitor.status === 'Pending' && (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-amber-200 dark:border-amber-800">
                        <Clock className="w-3 h-3"/> Pending
                      </span>
                    )}
                    {visitor.status === 'Approved' && (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3"/> Approved
                      </span>
                    )}
                    {visitor.status === 'Rejected' && (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-red-200 dark:border-red-800">
                        <XCircle className="w-3 h-3"/> Rejected
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {visitor.status === 'Pending' ? (
                        <>
                          {/* <button
                            onClick={() => handleApprove(visitor)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(visitor)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button> */}
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Decision Recorded</span>
                      )}
                      
                      <button
                        onClick={() => setSelectedVisitor(visitor)}
                        className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-hct-blue dark:text-blue-400 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800/60 shadow-sm flex items-center gap-1.5 transition-all hover:shadow cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredVisitors.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                    No visitor approval requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visitor Details Drawer Modal */}
      <AnimatePresence>
        {selectedVisitor && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[24px] p-6 max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
              
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={selectedVisitor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVisitor.name)}&background=0284c7&color=fff`} 
                    alt={selectedVisitor.name}
                    onClick={() => setFullPhotoUrl(selectedVisitor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedVisitor.name)}&background=0284c7&color=fff`)}
                    className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200 cursor-pointer hover:ring-4 hover:ring-blue-400/40 hover:scale-105 transition-all"
                    title="Click to view full photo"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Visitor Approval Details</h3>
                    <p className="text-xs text-slate-500">Request ID: {selectedVisitor.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedVisitor(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  ['Visitor Name', selectedVisitor.name],
                  ['Document ID', `${selectedVisitor.docType} • ${selectedVisitor.docId}`],
                  ['Email', selectedVisitor.email || '-'],
                  ['Mobile Phone', selectedVisitor.phone || '-'],
                  ['Company / Org', selectedVisitor.company || '-'],
                  ['Host Person', selectedVisitor.host],
                  ['Vehicle Number', selectedVisitor.vehicleNumber || '-'],
                  ['Scheduled Date', selectedVisitor.date],
                  ['Scheduled Time', selectedVisitor.time],
                  ['Current Status', selectedVisitor.status],
                  ...(selectedVisitor.rejectionReason ? [['Rejection Reason', selectedVisitor.rejectionReason]] : [])
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium">{label}:</span>
                    <span className="font-bold text-slate-800 dark:text-white text-right">{value}</span>
                  </div>
                ))}
                
                {/* View Document row placed right after Status */}
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Identity Document:</span>
                  <button
                    onClick={() => setShowDocModal(true)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-hct-blue dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-blue-200 dark:border-blue-800 transition-colors shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Document
                  </button>
                </div>
              </div>

              {/* Action Buttons inside Drawer */}
              {selectedVisitor.status === 'Pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      const v = selectedVisitor;
                      setSelectedVisitor(null);
                      handleApprove(v);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Visitor
                  </button>
                  <button
                    onClick={() => {
                      const v = selectedVisitor;
                      setSelectedVisitor(null);
                      handleReject(v);
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Reject Visitor
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Document Viewer Modal */}
      {showDocModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[70] p-4"
          onClick={() => setShowDocModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Identity Document</p>
                  <p className="text-slate-400 text-[11px]">Emirates ID Card • Scanned Copy</p>
                </div>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4 bg-[#111]">
              <img
                src="/emirates_id_sample.png"
                alt="Emirates ID Document"
                onClick={() => setFullPhotoUrl('/emirates_id_sample.png')}
                className="w-full object-contain rounded-2xl shadow-xl border border-white/10 cursor-pointer hover:opacity-95"
                title="Click to view full photo"
              />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {confirmAction.type} Visitor Request
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Are you sure you want to {confirmAction.type.toLowerCase()} access for <strong>{confirmAction.visitor.name}</strong>?
              </p>
              
              {confirmAction.type === 'Reject' && (
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rejection Remarks *
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionRemarks}
                    onChange={(e) => setRejectionRemarks(e.target.value)}
                    placeholder="Enter reason for rejecting this visitor..."
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-red-500 outline-none"
                    autoFocus
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setConfirmAction(null);
                    setRejectionRemarks('');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={`flex-1 py-2.5 text-white rounded-xl font-bold text-xs transition-colors shadow-sm ${
                    confirmAction.type === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {confirmAction.type}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Photo Viewer Modal */}
      <AnimatePresence>
        {fullPhotoUrl && (
          <div 
            className="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setFullPhotoUrl(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-slate-900 p-2 flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setFullPhotoUrl(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <img 
                src={fullPhotoUrl} 
                alt="Full View" 
                className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-lg" 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default VisitorApprovals;
