import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle2, UserPlus, Camera, Car, UserCheck, Shield, Trash2, Edit2, Check, Signature, ShieldAlert, Lock, Mail, Send, RefreshCw, XCircle, Clock, ChevronLeft, FileText, ShieldCheck } from 'lucide-react';

const initialVisitors = [
  { id: 'V-1021', name: 'John Smith', company: 'Tech Solutions LLC', host: 'Dr. Ahmed', type: 'Walk-In', date: '2026-10-05', time: '09:00 AM', status: 'Checked In', phone: '+971 50 123 4567', docId: '784-1990-1234567-1', isBlocked: false },
  { id: 'V-1022', name: 'Sarah Parker', company: 'Independent', host: 'Jane Doe', type: 'Pre-Approved', date: '2026-10-05', time: '10:30 AM', status: 'Expected', phone: '+971 55 987 6543', docId: 'P-98765432', isBlocked: false },
  { id: 'V-1023', name: 'Michael Chang', company: 'Global Services', host: 'Prof. Tariq', type: 'Contractor', date: '2026-10-05', time: '11:15 AM', status: 'Completed', phone: '+971 52 555 1234', docId: '784-1985-7654321-9', isBlocked: false },
  { id: 'V-1024', name: 'Emma Wilson', company: 'Ministry of Education', host: 'Facilities Dept', type: 'Guest', date: '2026-10-05', time: '01:00 PM', status: 'Checked In', phone: '+971 54 333 9999', docId: '784-1992-1112223-4', isBlocked: false },
  { id: 'V-1025', name: 'David Lee', company: 'ABC Cleaning', host: 'Jane Doe', type: 'Delivery', date: '2026-10-05', time: '02:45 PM', status: 'Expected', phone: '+971 56 777 8888', docId: 'P-11223344', isBlocked: true },
];

const VisitorList = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'walkin', 'preapproved'
  
  // --- VISITOR LIST STATE ---
  const [visitorsList, setVisitorsList] = useState(initialVisitors);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // --- FORM STATE ---
  const [step, setStep] = useState(2); // Starting at 2 to skip the "3 methods" step
  const [formVisitors, setFormVisitors] = useState([{
    id: Date.now(), fullName: '', mobileNumber: '', email: '', visitorType: '', nationality: '', company: '', docType: '', docNumber: '', docExpiry: '', docScanned: false
  }]);
  
  const [hostDetails, setHostDetails] = useState({ hostName: '', department: '', campus: '', visitDate: '', arrivalTime: '' });
  const [vehicleDetails, setVehicleDetails] = useState({ hasVehicle: 'No', vehicleNumber: '', vehicleType: '', vehicleMake: '', vehicleColor: '' });
  const [livePhotoCaptured, setLivePhotoCaptured] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [visitRequestId, setVisitRequestId] = useState(null);
  const [hostAction, setHostAction] = useState('pending');
  
  // Send Link Modal State
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [sendLinkData, setSendLinkData] = useState({ hostName: '', hostEmail: '' });

  // Security Action Modal State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [visitorToBlock, setVisitorToBlock] = useState(null);
  const [securityActionType, setSecurityActionType] = useState('temp'); // 'temp', 'perm'
  const [securityReleaseDate, setSecurityReleaseDate] = useState('');

  // --- LIST HANDLERS ---
  const getStatusBadge = (visitor) => {
    if (visitor.isBlocked) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm">Blocked</span>;
    }
    switch(visitor.status) {
      case 'Checked In': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Checked In</span>;
      case 'Expected': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Expected</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Completed</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Unknown</span>;
    }
  };

  const handleCheckInOut = (id) => {
    setVisitorsList(visitorsList.map(v => {
      if (v.id === id) {
        if (v.status === 'Expected') return { ...v, status: 'Checked In' };
        if (v.status === 'Checked In') return { ...v, status: 'Completed' };
      }
      return v;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this visitor record?")) {
      setVisitorsList(visitorsList.filter(v => v.id !== id));
      setActiveMenuId(null);
    }
  };

  const handleBlockConfirm = () => {
    setVisitorsList(visitorsList.map(v => 
      v.id === visitorToBlock.id ? { ...v, isBlocked: securityActionType === 'deny' } : v
    ));
    if (securityActionType === 'temp' && securityReleaseDate) {
      alert(`${visitorToBlock.name} has been temporarily unblocked until ${securityReleaseDate}.`);
    } else if (securityActionType === 'perm') {
      alert(`${visitorToBlock.name} has been permanently unblocked.`);
    } else {
      alert(`${visitorToBlock.name} has been blocked.`);
    }
    setShowBlockModal(false);
    setVisitorToBlock(null);
    setSecurityActionType('temp');
    setSecurityReleaseDate('');
  };

  const handleUnblock = (id) => {
    if (window.confirm("Are you sure you want to unblock this visitor?")) {
      setVisitorsList(visitorsList.map(v => 
        v.id === id ? { ...v, isBlocked: false } : v
      ));
    }
  };

  const filteredVisitors = visitorsList.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (statusFilter === 'Blocked') {
      matchesFilter = v.isBlocked;
    } else if (statusFilter !== 'All') {
      matchesFilter = !v.isBlocked && v.status === statusFilter;
    } else {
      // If 'All', we can decide whether to include blocked visitors or not. 
      // Typically 'All' would include everyone, or maybe just non-blocked. We'll include everyone.
      matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  // --- FORM HANDLERS ---
  const handleVisitorChange = (index, field, value) => {
    const newVisitors = [...formVisitors];
    newVisitors[index][field] = value;
    setFormVisitors(newVisitors);
  };

  const addVisitor = () => {
    setFormVisitors([...formVisitors, {
      id: Date.now(), fullName: '', mobileNumber: '', email: '', visitorType: '', nationality: '', company: '', docType: '', docNumber: '', docExpiry: '', docScanned: false
    }]);
  };

  const removeVisitor = (index) => {
    if (formVisitors.length > 1) {
      const newVisitors = [...formVisitors];
      newVisitors.splice(index, 1);
      setFormVisitors(newVisitors);
    }
  };

  const simulateScan = (index) => {
    const newVisitors = [...formVisitors];
    newVisitors[index].docScanned = true;
    newVisitors[index].fullName = 'John Smith';
    newVisitors[index].docNumber = '784-1990-1234567-1';
    newVisitors[index].docExpiry = '2030-12-31';
    setFormVisitors(newVisitors);
  };

  // Signature logic
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left || e.touches?.[0].clientX - rect.left;
    const y = e.clientY - rect.top || e.touches?.[0].clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left || e.touches?.[0].clientX - rect.left;
    const y = e.clientY - rect.top || e.touches?.[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const nextStep = () => {
    if (step === 2) {
      const v = formVisitors[0];
      if (!v.fullName || !v.mobileNumber || !hostDetails.hostName) {
        alert("Please fill all mandatory fields (*)");
        return;
      }
    }
    if (step === 3 && (!formVisitors[0].docType || !formVisitors[0].docNumber)) { alert("Please provide identity documents."); return; }
    if (step === 4 && vehicleDetails.hasVehicle === 'Yes' && !vehicleDetails.vehicleNumber) { alert("Please provide the Vehicle Number."); return; }
    if (step === 5 && !livePhotoCaptured) { alert("Please capture a live photograph."); return; }
    if (step === 6 && (!declarationAccepted)) { alert("Please accept the declaration to proceed."); return; }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const submitRequest = () => {
    setVisitRequestId('VR-2026-00125');
    setStep(8);
  };

  const handleSendLink = (e) => {
    e.preventDefault();
    if (!sendLinkData.hostName || !sendLinkData.hostEmail) {
      alert("Please enter both Host Name and Email.");
      return;
    }
    alert(`Registration link sent successfully to ${sendLinkData.hostEmail}!`);
    setShowSendLinkModal(false);
    setSendLinkData({ hostName: '', hostEmail: '' });
  };

  const isPreScheduled = activeTab === 'preapproved';

  return (
    <div className="w-full animate-in fade-in flex flex-col min-h-[80vh]">
      {/* Header & Main Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-white">Visitor Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage all registered visitors and new registrations.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {activeTab === 'list' ? (
            <button 
              onClick={() => { 
                setActiveTab('walkin'); 
                setStep(2); 
                setVisitRequestId(null);
              }} 
              className="px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border-2 border-hct-blue bg-hct-blue text-white shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:bg-[#001a66]"
            >
              <UserPlus className="w-4 h-4" /> Add New Visitor
            </button>
          ) : (
            <button 
              onClick={() => { setActiveTab('list'); }} 
              className="px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
          )}
        </div>
      </div>

      {/* --- VISITOR LIST VIEW --- */}
      {activeTab === 'list' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex justify-between items-center mb-6 gap-4">
               <div className="relative flex-1 max-w-md">
                 <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search visitors..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-9 pr-4 py-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-hct-blue shadow-sm"
                 />
               </div>
               <div className="flex items-center gap-3">
                 <div className="relative">
                   <button 
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                     className={`p-2.5 backdrop-blur-md border rounded-xl transition-colors shadow-sm flex items-center gap-2 ${statusFilter !== 'All' ? 'bg-hct-blue text-white border-blue-600' : 'bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-hct-blue'}`}
                   >
                      <Filter className="w-4 h-4" />
                      {statusFilter !== 'All' && <span className="text-xs font-bold">{statusFilter}</span>}
                   </button>
                   {isFilterOpen && (
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                       {['All', 'Expected', 'Checked In', 'Completed', 'Blocked'].map(status => (
                         <button 
                           key={status} 
                           onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                           className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${statusFilter === status ? 'text-hct-blue bg-blue-50 dark:bg-blue-900/30' : 'text-slate-700 dark:text-slate-300'}`}
                         >
                           {status}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-hct-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm">
                    <Download className="w-4 h-4" /> Export
                 </button>
               </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">
                    <tr>
                      <th className="px-6 py-4 font-bold">ID</th>
                      <th className="px-6 py-4 font-bold">Visitor Name</th>
                      <th className="px-6 py-4 font-bold">Host</th>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th className="px-6 py-4 font-bold">Date & Time</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500">No visitors found matching your criteria.</td>
                      </tr>
                    ) : filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors relative">
                        <td className="px-6 py-4 font-medium text-slate-500">{visitor.id}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-white">{visitor.name}</p>
                          <p className="text-xs text-slate-500">{visitor.company}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{visitor.host}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{visitor.type}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-700 dark:text-slate-300">{visitor.date}</p>
                          <p className="text-xs text-slate-500">{visitor.time}</p>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(visitor)}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex justify-end items-center gap-2">
                             <button onClick={() => setSelectedVisitor(visitor)} className="p-1.5 text-slate-400 hover:text-hct-blue bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View Details">
                               <Eye className="w-4 h-4" />
                             </button>
                             <div className="relative">
                               <button 
                                 onClick={() => setActiveMenuId(activeMenuId === visitor.id ? null : visitor.id)}
                                 className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                               >
                                 <MoreVertical className="w-4 h-4" />
                               </button>
                               {activeMenuId === visitor.id && (
                                 <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                                     <button 
                                       onClick={() => { 
                                         setVisitorToBlock(visitor);
                                         setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny');
                                         setShowBlockModal(true);
                                         setActiveMenuId(null); 
                                       }} 
                                       className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 ${visitor.isBlocked ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                                     >
                                       <ShieldAlert className="w-4 h-4"/> {visitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                                     </button>
                                 </div>
                               )}
                             </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-slate-200 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredVisitors.length} entries</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Prev</button>
                  <button className="px-3 py-1 rounded bg-hct-blue text-white font-bold">1</button>
                  <button className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50" disabled>Next</button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* --- FORM VIEW (Walk-in or Pre-Approved) --- */}
      {(activeTab === 'walkin' || activeTab === 'preapproved') && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col max-w-5xl w-full mx-auto">
            
            {/* Progress Indicator */}
            {step >= 2 && step < 8 && (
              <div className="flex justify-between items-center mb-8 px-4 overflow-x-auto pb-4 gap-4">
                {['Details', 'Identity', 'Vehicle', 'Photo', 'Declaration', 'Review'].map((label, i) => {
                  const stepNum = i + 2;
                  const isActive = step === stepNum;
                  const isPast = step > stepNum;
                  return (
                    <div key={label} className="flex flex-col items-center min-w-[80px] gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${isActive ? 'bg-hct-blue text-white ring-4 ring-blue-100 dark:ring-blue-900/50' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                        {isPast ? <Check className="w-4 h-4" /> : stepNum - 1}
                      </div>
                      <span className={`text-xs font-bold ${isActive ? 'text-hct-blue dark:text-blue-400' : 'text-slate-500'}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 relative">
              
              {/* Send Link Button Floating Top Right */}
              {step < 8 && (
                <button 
                  onClick={() => setShowSendLinkModal(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-indigo-100"
                >
                  <Send className="w-4 h-4" /> Send Link
                </button>
              )}

              {/* Registration Type Selector */}
              {step < 8 && (
                <div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex shadow-inner">
                    <button 
                      onClick={() => setActiveTab('walkin')} 
                      className={`px-6 py-2 rounded-lg font-bold text-xs transition-colors ${activeTab === 'walkin' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Walk-In
                    </button>
                    <button 
                      onClick={() => setActiveTab('preapproved')} 
                      className={`px-6 py-2 rounded-lg font-bold text-xs transition-colors ${activeTab === 'preapproved' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Pre-Approved
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Details */}
              {step === 2 && (
                <div className="space-y-8 mt-2">
                  <h3 className="text-base font-bold border-b pb-2">Primary Visitor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Full Name *</label>
                      <input type="text" value={formVisitors[0].fullName} onChange={(e) => handleVisitorChange(0, 'fullName', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number *</label>
                      <input type="tel" value={formVisitors[0].mobileNumber} onChange={(e) => handleVisitorChange(0, 'mobileNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                      <input type="email" value={formVisitors[0].email} onChange={(e) => handleVisitorChange(0, 'email', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nationality</label>
                      <input type="text" value={formVisitors[0].nationality} onChange={(e) => handleVisitorChange(0, 'nationality', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Host *</label>
                      <div className="relative">
                        {isPreScheduled && <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />}
                        {isPreScheduled ? (
                          <input type="text" value={hostDetails.hostName || "Jane Doe (Locked)"} readOnly className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                        ) : (
                          <select value={hostDetails.hostName} onChange={(e) => setHostDetails({...hostDetails, hostName: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none">
                            <option value="">Select a Host</option>
                            {["Dr. Ahmed", "Jane Doe", "Prof. Tariq", "Sarah Parker"].map(h => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus / Location</label>
                      <div className="relative">
                         {isPreScheduled && <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />}
                         {isPreScheduled ? (
                           <input type="text" value={hostDetails.department || "Dubai Women's Campus"} readOnly className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                         ) : (
                           <select value={hostDetails.department} onChange={(e) => setHostDetails({...hostDetails, department: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none">
                             <option value="">Select Campus</option>
                             {["Abu Dhabi Men's Campus", "Dubai Men's Campus", "Dubai Women's Campus", "Sharjah Men's Campus"].map(camp => (
                               <option key={camp} value={camp}>{camp}</option>
                             ))}
                           </select>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Identity */}
              {step === 3 && (
                <div className="space-y-8 mt-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-base font-bold">Identity Verification</h3>
                    <button onClick={addVisitor} className="flex items-center gap-2 text-xs font-bold text-hct-blue bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                      <UserPlus className="w-4 h-4" /> Add Another Visitor
                    </button>
                  </div>

                  {formVisitors.map((visitor, index) => (
                    <div key={visitor.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                      {index > 0 && (
                        <button onClick={() => removeVisitor(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                      )}
                      <h4 className="font-bold text-base mb-4">Visitor {index + 1} {visitor.fullName ? `- ${visitor.fullName}` : ''}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold mb-1 block">Document Type *</label>
                            <select value={visitor.docType} onChange={(e) => handleVisitorChange(index, 'docType', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
                              <option value="">Select ID Type</option>
                              <option value="Emirates ID">Emirates ID</option>
                              <option value="Passport">Passport</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs font-bold mb-1 block">Document Number</label>
                            <input type="text" value={visitor.docNumber} onChange={(e) => handleVisitorChange(index, 'docNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="text-xs font-bold mb-1 block">Document Expiry Date</label>
                            <input type="date" value={visitor.docExpiry} onChange={(e) => handleVisitorChange(index, 'docExpiry', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-center">
                          {visitor.docScanned ? (
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
                               <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                               <p className="font-bold text-emerald-700 dark:text-emerald-400">Document Scanned</p>
                               <button onClick={() => handleVisitorChange(index, 'docScanned', false)} className="mt-4 text-xs font-bold text-emerald-700 underline">Rescan</button>
                            </div>
                          ) : (
                            <button onClick={() => simulateScan(index)} disabled={!visitor.docType} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-hct-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                              <Camera className="w-10 h-10 mb-2" />
                              <span className="font-bold">Scan Document (OCR)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 4: Vehicle */}
              {step === 4 && (
                <div className="space-y-6 max-w-2xl mx-auto mt-2">
                  <h3 className="text-base font-bold border-b pb-2 text-center">Vehicle Information</h3>
                  <div className="flex justify-center gap-8 py-6">
                    <label className="flex flex-col items-center gap-2 cursor-pointer group">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${vehicleDetails.hasVehicle === 'Yes' ? 'border-hct-blue bg-blue-50 text-hct-blue' : 'border-slate-200 text-slate-400 group-hover:border-blue-200'}`}>
                        <Car className="w-8 h-8" />
                      </div>
                      <input type="radio" name="hasVehicle" value="Yes" checked={vehicleDetails.hasVehicle === 'Yes'} onChange={(e) => setVehicleDetails({...vehicleDetails, hasVehicle: e.target.value})} className="hidden" />
                      <span className="font-bold">Arriving by vehicle</span>
                    </label>
                    <label className="flex flex-col items-center gap-2 cursor-pointer group">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${vehicleDetails.hasVehicle === 'No' ? 'border-slate-800 bg-slate-50 text-slate-800 dark:border-slate-400 dark:text-white' : 'border-slate-200 text-slate-400 group-hover:border-slate-300'}`}>
                        <UserCheck className="w-8 h-8" />
                      </div>
                      <input type="radio" name="hasVehicle" value="No" checked={vehicleDetails.hasVehicle === 'No'} onChange={(e) => setVehicleDetails({...vehicleDetails, hasVehicle: e.target.value})} className="hidden" />
                      <span className="font-bold">No Vehicle</span>
                    </label>
                  </div>
                  {vehicleDetails.hasVehicle === 'Yes' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="text-xs font-bold mb-1 block">Vehicle Number *</label>
                        <input type="text" placeholder="e.g. Dubai A 12345" value={vehicleDetails.vehicleNumber} onChange={(e) => setVehicleDetails({...vehicleDetails, vehicleNumber: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none uppercase font-mono text-base tracking-wider" />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 5: Photo */}
              {step === 5 && (
                <div className="space-y-6 max-w-xl mx-auto text-center mt-2">
                  <h3 className="text-base font-bold border-b pb-2">Live Photograph Capture</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl h-80 flex flex-col items-center justify-center relative overflow-hidden border-4 border-slate-200 dark:border-slate-700 shadow-inner">
                    {livePhotoCaptured ? (
                      <>
                        <img src="https://i.pravatar.cc/300" alt="Captured" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <button onClick={() => setLivePhotoCaptured(false)} className="bg-white text-slate-800 px-6 py-2 rounded-full font-bold shadow-lg">Retake Photo</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center mb-4">
                           <Camera className="w-10 h-10 text-slate-400" />
                        </div>
                        <button onClick={() => setLivePhotoCaptured(true)} className="bg-hct-blue text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">Open Camera & Capture</button>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 6: Declaration */}
              {step === 6 && (
                <div className="space-y-8 max-w-2xl mx-auto mt-2">
                  <h3 className="text-base font-bold border-b pb-2 text-center">Visitor Declaration</h3>
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input type="checkbox" checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)} className="mt-1 w-5 h-5 text-hct-blue rounded border-slate-300" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        <strong>I confirm that the information provided is correct and I agree to comply with the visitor management and security policies of Higher Colleges of Technology (HCT).</strong>
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 7: Review & Submit */}
              {step === 7 && (
                <div className="space-y-8 mt-2">
                  <h3 className="text-base font-bold text-center border-b pb-4">Review Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs flex justify-between items-center">
                        Visitor Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-xs">
                        {formVisitors.map((v, i) => (
                          <div key={v.id} className={`${i > 0 ? 'mt-4 pt-4 border-t border-slate-200' : ''}`}>
                            <p className="font-bold text-base mb-2">{v.fullName}</p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Type:</span> <span className="font-medium">{v.visitorType}</span></p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Mobile:</span> <span className="font-medium">{v.mobileNumber}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs flex justify-between items-center">
                          Host Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                        </h4>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-xs">
                          <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Name:</span> <span className="font-bold text-base">{hostDetails.hostName || (isPreScheduled ? 'Jane Doe' : '-')}</span></p>
                          <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Location:</span> <span className="font-medium">{hostDetails.campus || hostDetails.department || '-'}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Success */}
              {step === 8 && (
                <div className="text-center space-y-8 max-w-2xl mx-auto py-8">
                  <div className="animate-pulse">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-amber-500" /></div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Registration Submitted</h3>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mt-6 text-left max-w-md mx-auto">
                      <p className="mb-2"><strong className="text-slate-500">Visit Request ID:</strong> <span className="font-bold text-slate-800 dark:text-white">{visitRequestId}</span></p>
                      <p className="mb-4"><strong className="text-slate-500">Status:</strong> <span className="font-bold text-amber-600">Pending Host Approval</span></p>
                    </div>
                    <button onClick={() => { setActiveTab('list'); setStep(2); }} className="mt-8 px-6 py-3 bg-hct-blue text-white font-bold rounded-xl hover:bg-blue-700">
                      Return to Visitor List
                    </button>
                  </div>
                </div>
              )}

              {/* Form Footer Navigation */}
              {step >= 2 && step < 8 && (
                <div className="mt-8 flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-6">
                  {step > 2 ? (
                    <button onClick={prevStep} className="px-6 py-3 rounded-full font-bold text-slate-600 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                      Back
                    </button>
                  ) : (
                    <div />
                  )}
                  
                  {step < 7 ? (
                    <button onClick={nextStep} className="px-8 py-3 rounded-full font-bold text-white bg-hct-blue hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                      Continue
                    </button>
                  ) : (
                    <button onClick={submitRequest} className="px-8 py-3 rounded-full font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Submit Visit Request
                    </button>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* View Details Modal for List */}
      {selectedVisitor && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            <button 
              onClick={() => setSelectedVisitor(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
            <div className="p-8">
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-6">Visitor Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Name</span>
                  <span className="font-bold text-slate-800 dark:text-white">{selectedVisitor.name}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Phone</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.phone}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Host</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.host}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Company</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.company}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Visitor Type</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.type}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Document ID</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.docId}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Date & Time</span>
                  <span className="font-medium text-slate-800 dark:text-white">{selectedVisitor.date} at {selectedVisitor.time}</span>
                </div>
                <div className="flex justify-between items-center pt-2 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Status</span>
                  {getStatusBadge(selectedVisitor.status)}
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button onClick={() => alert('Viewing document...')} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4"/> View Document
                  </button>
                  <button onClick={() => {
                    setVisitorToBlock(selectedVisitor);
                    setSecurityActionType(selectedVisitor.isBlocked ? 'temp' : 'deny');
                    setShowBlockModal(true);
                    setSelectedVisitor(null);
                  }} className={`flex-1 ${selectedVisitor.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2`}>
                    <ShieldAlert className="w-4 h-4"/> {selectedVisitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Link Modal */}
      {showSendLinkModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95">
            <button 
              onClick={() => setShowSendLinkModal(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
            <form onSubmit={handleSendLink} className="p-8">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-2">Send Registration Link</h3>
              <p className="text-xs text-slate-500 mb-6">Send an email with a unique registration link to the host or visitor.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Visitor Type *</label>
                    <select 
                      required
                      value={sendLinkData.visitorType || 'Pre-Approved'} 
                      onChange={(e) => setSendLinkData({...sendLinkData, visitorType: e.target.value})} 
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    >
                      <option value="Pre-Approved">Pre-Approved</option>
                      <option value="Walk-In">Walk-In</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus *</label>
                    <select 
                      required
                      value={sendLinkData.campus || 'Men\'s College'} 
                      onChange={(e) => setSendLinkData({...sendLinkData, campus: e.target.value})} 
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    >
                      <option value="Men's College">Men's College</option>
                      <option value="Women's College">Women's College</option>
                      <option value="Main Campus">Main Campus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Host Name *</label>
                  <input 
                    type="text" 
                    required
                    value={sendLinkData.hostName || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, hostName: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. Dr. Ahmed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Visitor Name *</label>
                  <input 
                    type="text" 
                    required
                    value={sendLinkData.visitorName || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, visitorName: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Visitor Email Address *</label>
                  <input 
                    type="email" 
                    required
                    value={sendLinkData.visitorEmail || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, visitorEmail: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. visitor@example.com"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setShowSendLinkModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Action Modal */}
      {showBlockModal && visitorToBlock && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative animate-in zoom-in-95">
            <button 
              onClick={() => { setShowBlockModal(false); setVisitorToBlock(null); }}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              ✕
            </button>
            <div className="p-8">
              <h3 className="text-base font-bold text-slate-800 dark:text-white text-center mb-6">
                {visitorToBlock.isBlocked ? 'Select Unblock Action' : 'Block Visitor'}
              </h3>
              
              {visitorToBlock.isBlocked ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {/* Temporary Unblock */}
                  <button
                    onClick={() => setSecurityActionType('temp')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${securityActionType === 'temp' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-blue-200 dark:border-blue-900/40 hover:border-blue-300 bg-white dark:bg-slate-800'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${securityActionType === 'temp' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <Clock className={`w-6 h-6 ${securityActionType === 'temp' ? 'text-blue-600' : 'text-blue-400'}`} />
                    </div>
                    <span className={`font-bold ${securityActionType === 'temp' ? 'text-blue-700 dark:text-blue-400' : 'text-blue-500 dark:text-blue-600'}`}>Temporary Unblock</span>
                  </button>

                  {/* Permanent Unblock */}
                  <button
                    onClick={() => setSecurityActionType('perm')}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${securityActionType === 'perm' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-emerald-200 dark:border-emerald-900/40 hover:border-emerald-300 bg-white dark:bg-slate-800'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${securityActionType === 'perm' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                      <Lock className={`w-6 h-6 ${securityActionType === 'perm' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    </div>
                    <span className={`font-bold ${securityActionType === 'perm' ? 'text-emerald-700 dark:text-emerald-400' : 'text-emerald-500 dark:text-emerald-600'}`}>Permanent Unblock</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center mb-8">
                  <button
                    className="w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all border-red-500 bg-red-50 dark:bg-red-900/20 cursor-default"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-red-100 dark:bg-red-900/50">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="font-bold text-red-700 dark:text-red-400">Block Visitor</span>
                    <p className="text-xs text-red-600 mt-2">This visitor will be prevented from entering the campus.</p>
                  </button>
                </div>
              )}

              {securityActionType === 'temp' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Release Until (Custom Date)</label>
                  <input 
                    type="date"
                    value={securityReleaseDate}
                    onChange={(e) => setSecurityReleaseDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </motion.div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-400 block mb-1">Reason / Notes</label>
                <textarea 
                  placeholder="Provide a brief explanation..."
                  className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500 text-xs resize-none"
                  rows={2}
                ></textarea>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => { setShowBlockModal(false); setVisitorToBlock(null); }} 
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockConfirm}
                  className="px-6 py-3 bg-slate-800 dark:bg-hct-blue text-white rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-blue-700 transition-colors"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VisitorList;
