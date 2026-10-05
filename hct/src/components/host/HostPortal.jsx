import React, { useState } from 'react';
import { User, Calendar, Check, X, Bell, UserCheck, ArrowRight, FileText, Send, Mail, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HostPortal = () => {
  const navigate = useNavigate();

  // Mock initial requests
  const [requests, setRequests] = useState([
    { id: 'REQ-1002', name: 'John Doe', type: 'Walk-in', time: 'Just now', status: 'pending' },
    { id: 'REQ-1003', name: 'Jane Smith', type: 'Pre-Scheduled', time: '2 hours ago', status: 'approved' },
  ]);

  const [activeTab, setActiveTab] = useState('pending');
  
  // Approval Flow State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Invite Flow State
  const [inviteStep, setInviteStep] = useState(0); // 0 = hidden, 1 = form, 2 = review
  const [inviteData, setInviteData] = useState({ 
    campus: 'Dubai Men\'s', 
    visitorName: '', 
    visitorEmail: '',
    mobileNumber: '',
    visitDate: '',
    arrivalTime: '',
    departureTime: '',
    purpose: '',
    company: '',
    remarks: ''
  });

  // Email Simulation State
  const [showEmailSimulation, setShowEmailSimulation] = useState(false);
  const [emailType, setEmailType] = useState('invite'); // 'invite' or 'approved'
  const [generatedRequestId, setGeneratedRequestId] = useState(null);

  // Mock Host Data (Read-only)
  const hostDetails = {
    hostName: "Dr. Ahmed Ali",
    hostEmail: "ahmed.ali@hct.ac.ae",
    department: "Engineering Faculty"
  };

  const handleAction = (id, action) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const filteredRequests = requests.filter(r => r.status === activeTab);

  const startInvite = () => {
    setInviteData({ 
      campus: 'Dubai Men\'s', visitorName: '', visitorEmail: '', mobileNumber: '', visitDate: '', arrivalTime: '', departureTime: '', purpose: '', company: '', remarks: '' 
    });
    setInviteStep(1);
  };

  const proceedToReview = () => {
    if (!inviteData.campus || !inviteData.visitorName || !inviteData.visitorEmail || !inviteData.visitDate || !inviteData.arrivalTime) {
      alert("Please fill all mandatory fields (*)");
      return;
    }
    setInviteStep(2);
  };

  const sendInvitation = () => {
    const newId = `PS-2026-${Math.floor(Math.random() * 900) + 100}`;
    setGeneratedRequestId(newId);
    
    // Add to pending requests list
    setRequests([{
      id: newId, name: inviteData.visitorName, type: 'Pre-Scheduled (Sent)', time: 'Just now', status: 'pending'
    }, ...requests]);

    setInviteStep(0);
    // Show email simulation immediately
    setEmailType('invite');
    setTimeout(() => setShowEmailSimulation(true), 500);
  };

  const completeRegistration = () => {
    setShowEmailSimulation(false);
    // Navigate to visitor portal with state
    navigate('/visitor', { 
      state: { 
        preScheduled: true, 
        visitData: {
          ...inviteData,
          hostName: hostDetails.hostName,
          hostEmail: hostDetails.hostEmail,
          hostDepartment: hostDetails.department
        }
      }
    });
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
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Host Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage your visitor requests and schedule upcoming visits.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-white/10 overflow-hidden">
        <div className="flex p-2 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-md border-b border-white/40 dark:border-white/5">
          <div className="flex gap-2 bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-hct-blue dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending Requests ({requests.filter(r => r.status === 'pending').length})
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'approved' ? 'bg-white dark:bg-slate-700 text-hct-blue dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              onClick={() => setActiveTab('approved')}
            >
              Approved
            </button>
            <button 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'rejected' ? 'bg-white dark:bg-slate-700 text-hct-blue dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'}`}
              onClick={() => setActiveTab('rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        <div className="p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-700">No {activeTab} requests</h4>
              <p className="text-slate-500">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(req => (
                <div key={req.id} className="flex items-center justify-between p-5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-[20px] hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center shadow-inner">
                      <User className="w-7 h-7 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white">{req.name}</h4>
                      <div className="flex gap-3 text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {req.time}</span>
                        <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-hct-blue dark:text-blue-400 rounded-lg text-xs font-bold">{req.type}</span>
                        <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">{req.id}</span>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === 'pending' && !req.type.includes('Sent') && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => {
                          setActiveRequest(req);
                          setRejectionReason('');
                          setRejectModalOpen(true);
                        }}
                        className="px-5 py-2.5 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl font-bold flex items-center gap-2 transition-all hover:shadow-md"
                      >
                        <X className="w-5 h-5" /> Reject
                      </button>
                      <button 
                        onClick={() => {
                          setActiveRequest(req);
                          setAcceptModalOpen(true);
                        }}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
                      >
                        <Check className="w-5 h-5" /> Accept
                      </button>
                    </div>
                  )}
                  {activeTab === 'pending' && req.type.includes('Sent') && (
                     <span className="px-4 py-2 rounded-xl text-sm font-bold shadow-sm bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                       Invitation Sent (Awaiting Registration)
                     </span>
                  )}
                  {activeTab !== 'pending' && (
                    <div>
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm border ${
                        activeTab === 'approved' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                      }`}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Flow Modals */}
      <AnimatePresence>
        {inviteStep > 0 && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-slate-800 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              
              {inviteStep === 1 && (
                <div>
                  <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><UserPlus className="w-6 h-6 text-hct-blue" /> Create Visitor Invite</h3>
                    <button onClick={() => setInviteStep(0)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-6 h-6" /></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Campus *</label>
                      <select value={inviteData.campus} onChange={(e) => setInviteData({...inviteData, campus: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none font-medium shadow-sm">
                        <option>Dubai Men's</option>
                        <option>Abu Dhabi Women's</option>
                        <option>Sharjah Men's</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Visitor Name *</label>
                      <input type="text" value={inviteData.visitorName} onChange={(e) => setInviteData({...inviteData, visitorName: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" placeholder="e.g. John Smith" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Visitor Email Address *</label>
                      <input type="email" value={inviteData.visitorEmail} onChange={(e) => setInviteData({...inviteData, visitorEmail: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" placeholder="john@example.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Mobile Number</label>
                      <input type="tel" value={inviteData.mobileNumber} onChange={(e) => setInviteData({...inviteData, mobileNumber: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" placeholder="+971 50 123 4567" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Organization</label>
                      <select value={inviteData.company} onChange={(e) => setInviteData({...inviteData, company: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm">
                        <option value="">Select Company</option>
                        {["Tech Solutions LLC", "Global Services", "Ministry of Education", "ABC Cleaning Services", "Al Futtaim Group", "Independent Contractor"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2 grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Visit Date *</label>
                        <input type="date" value={inviteData.visitDate} onChange={(e) => setInviteData({...inviteData, visitDate: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Arrival Time *</label>
                        <input type="time" value={inviteData.arrivalTime} onChange={(e) => setInviteData({...inviteData, arrivalTime: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Departure Time</label>
                        <input type="time" value={inviteData.departureTime} onChange={(e) => setInviteData({...inviteData, departureTime: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Visit Purpose</label>
                      <input type="text" value={inviteData.purpose} onChange={(e) => setInviteData({...inviteData, purpose: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm" placeholder="Meeting / Training" />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Additional Remarks</label>
                      <textarea value={inviteData.remarks} onChange={(e) => setInviteData({...inviteData, remarks: e.target.value})} className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none shadow-sm h-24 resize-none" placeholder="Any instructions for security or visitor..."></textarea>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button onClick={() => setInviteStep(0)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                    <button onClick={proceedToReview} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 shadow-md flex items-center gap-2 transition-all">Review Invite <ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              )}

              {inviteStep === 2 && (
                <div>
                  <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-200 dark:border-slate-800">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2"><FileText className="w-6 h-6 text-hct-blue" /> Review Invitation</h3>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/50">
                      <h4 className="font-bold text-hct-blue dark:text-blue-400 uppercase text-sm mb-4">Host Details (Auto-Assigned)</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500 block mb-1">Host Name</span><strong className="text-slate-800 dark:text-white">{hostDetails.hostName}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Host Email</span><strong className="text-slate-800 dark:text-white">{hostDetails.hostEmail}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Department</span><strong className="text-slate-800 dark:text-white">{hostDetails.department}</strong></div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-600 dark:text-slate-400 uppercase text-sm mb-4 flex justify-between">Visitor Details <button onClick={() => setInviteStep(1)} className="text-hct-blue normal-case text-xs hover:underline">Edit</button></h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500 block mb-1">Visitor Name</span><strong className="text-slate-800 dark:text-white">{inviteData.visitorName}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Visitor Email</span><strong className="text-slate-800 dark:text-white">{inviteData.visitorEmail}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Mobile Number</span><strong className="text-slate-800 dark:text-white">{inviteData.mobileNumber || '-'}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Campus</span><strong className="text-slate-800 dark:text-white">{inviteData.campus}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Visit Date</span><strong className="text-slate-800 dark:text-white">{inviteData.visitDate}</strong></div>
                        <div><span className="text-slate-500 block mb-1">Arrival Time</span><strong className="text-slate-800 dark:text-white">{inviteData.arrivalTime}</strong></div>
                        <div className="col-span-2"><span className="text-slate-500 block mb-1">Visit Purpose</span><strong className="text-slate-800 dark:text-white">{inviteData.purpose || '-'}</strong></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button onClick={() => setInviteStep(1)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Back</button>
                    <button onClick={sendInvitation} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all hover:scale-105"><Send className="w-4 h-4" /> Send Invitation</button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Email Inbox Simulation */}
      <AnimatePresence>
        {showEmailSimulation && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-2xl w-full border border-slate-200 flex flex-col"
            >
              {/* Fake Email Browser Bar */}
              <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"></div><div className="w-3 h-3 rounded-full bg-amber-400"></div><div className="w-3 h-3 rounded-full bg-green-400"></div></div>
                <div className="bg-white rounded border border-slate-200 text-xs px-3 py-1 flex-1 text-slate-500 text-center font-medium">mail.example.com/inbox/{emailType === 'invite' ? inviteData.visitorEmail : 'visitor@example.com'}</div>
              </div>
              
              {/* Email Content */}
              <div className="p-8 bg-slate-50 flex-1">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-800 mb-2">{emailType === 'invite' ? 'Visitor Invitation to HCT' : 'Your Visitor Request Has Been Approved'}</h1>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="w-4 h-4" /> From: noreply@hct.ac.ae
                      </div>
                    </div>
                    <img src="/hct-logo.png" alt="HCT" className="h-10 opacity-80" onError={(e) => e.target.style.display='none'} />
                  </div>
                  
                  <div className="prose prose-slate max-w-none text-slate-700">
                    <p>Dear <strong>{emailType === 'invite' ? inviteData.visitorName : activeRequest?.name}</strong>,</p>
                    
                    {emailType === 'invite' ? (
                      <>
                        <p>You have been invited to visit <strong>{inviteData.campus}</strong> by <strong>{hostDetails.hostName}</strong>.</p>
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 my-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mt-0 mb-3">Visit Details</h3>
                          <p className="mb-2"><strong>Date:</strong> {inviteData.visitDate}</p>
                          <p className="mb-2"><strong>Time:</strong> {inviteData.arrivalTime}</p>
                          <p className="mb-2"><strong>Campus:</strong> {inviteData.campus}</p>
                          <p className="mb-0"><strong>Purpose:</strong> {inviteData.purpose || 'General Visit'}</p>
                        </div>
                        <p>To access the campus, you must complete your visitor registration by providing your ID document and vehicle details prior to arrival.</p>
                        <div className="mt-8 text-center">
                          <button onClick={completeRegistration} className="bg-hct-blue text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all hover:scale-105 inline-block">
                            Complete Visitor Registration
                          </button>
                          <p className="text-xs text-slate-400 mt-4">Visit ID: {generatedRequestId}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>Your visitor request has been approved by the Host.</p>
                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 my-6">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mt-0 mb-3">Visit Details</h3>
                          <p className="mb-2"><strong>Host:</strong> {hostDetails.hostName}</p>
                          <p className="mb-2"><strong>Campus:</strong> HCT Campus</p>
                          <p className="mb-2"><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                          <p className="mb-0"><strong>Pass ID:</strong> {generatedRequestId}</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100 text-center flex flex-col items-center">
                          <p className="font-bold text-emerald-800 mb-4">Please present this QR code to security upon arrival.</p>
                          <div className="w-40 h-40 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-2 shadow-sm mb-4">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedRequestId}`} alt="QR Code" className="w-full h-full" />
                          </div>
                          <div className="flex gap-4 w-full justify-center">
                            <button onClick={() => setShowEmailSimulation(false)} className="bg-white border border-slate-200 text-slate-700 px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors">Close</button>
                            <button className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-emerald-600 transition-colors">Download Pass</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Accept & Reject Modals */}
      <AnimatePresence>
        {acceptModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800">
               <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Approve Visitor Request?</h3>
               <p className="text-slate-600 dark:text-slate-400 mb-8">Are you sure you want to approve this visitor request for <strong className="text-slate-800 dark:text-white">{activeRequest?.name}</strong>?</p>
               <div className="flex justify-end gap-4">
                 <button onClick={() => setAcceptModalOpen(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                 <button onClick={() => {
                    handleAction(activeRequest?.id, 'approved');
                    setAcceptModalOpen(false);
                    setGeneratedRequestId(`VP-2026-${Math.floor(Math.random() * 900) + 100}`);
                    setEmailType('approved');
                    setTimeout(() => setShowEmailSimulation(true), 500);
                 }} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-md">Approve Request</button>
               </div>
             </motion.div>
          </div>
        )}
        
        {rejectModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl p-8 max-w-md w-full border border-slate-200 dark:border-slate-800">
               <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Reject Visitor Request</h3>
               <div className="mb-6">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rejection Reason *</label>
                 <textarea 
                   value={rejectionReason} 
                   onChange={(e) => setRejectionReason(e.target.value)} 
                   className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none resize-none h-32 text-slate-800 dark:text-slate-200" 
                   placeholder="E.g., Requested visit time is outside the permitted schedule."
                 />
                 {rejectionReason.trim() === '' && (
                   <p className="text-red-500 text-xs font-bold mt-2">Rejection reason is required.</p>
                 )}
               </div>
               <div className="flex justify-end gap-4">
                 <button onClick={() => setRejectModalOpen(false)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                 <button onClick={() => {
                    if (rejectionReason.trim() === '') return;
                    handleAction(activeRequest?.id, 'rejected');
                    setRejectModalOpen(false);
                 }} disabled={rejectionReason.trim() === ''} className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed">Confirm Rejection</button>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default HostPortal;
