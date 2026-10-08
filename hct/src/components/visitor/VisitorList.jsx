import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, MoreVertical, Eye, CheckCircle2, UserPlus, Camera, Car, UserCheck, Shield, Trash2, Edit2, Check, Signature, ShieldAlert, Lock, Mail, Send, RefreshCw, XCircle, Clock, ChevronLeft, FileText, ShieldCheck } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

const initialVisitors = [
  { id: 'V-1021', name: 'John Smith', company: 'Tech Solutions LLC', host: 'Dr. Ahmed Al-Maktoum', type: 'Walk-In', date: '2026-10-05', time: '09:00 AM', status: 'Pending', phone: '+971 50 123 4567', docId: '784-1990-1234567-1', isBlocked: false,
    emiratesId: { idNumber: '784-1990-1234567-1', cardNumber: '102834761', fullName: 'John Smith', dob: '1990-03-15', nationality: 'United States', gender: 'M', issueDate: '2022-01-10', expiryDate: '2027-01-09', occupation: 'Software Engineer', employer: 'Tech Solutions LLC', issuingPlace: 'Abu Dhabi', country: 'United Arab Emirates' } },
  { id: 'V-1023', name: 'Michael Chang', company: 'Global Services', host: 'Prof. Tariq', type: 'Pre-approved', date: '2026-10-05', time: '11:15 AM', status: 'Pending', phone: '+971 52 555 1234', docId: '784-1985-7654321-9', isBlocked: false,
    emiratesId: { idNumber: '784-1985-7654321-9', cardNumber: '209183746', fullName: 'Michael Chang', dob: '1985-08-22', nationality: 'China', gender: 'M', issueDate: '2021-06-15', expiryDate: '2026-06-14', occupation: 'Contractor', employer: 'Global Services', issuingPlace: 'Dubai', country: 'United Arab Emirates' } },
  { id: 'V-1024', name: 'Emma Wilson', company: 'Ministry of Education', host: 'Prof. Tariq', type: 'Walk-In', date: '2026-10-05', time: '01:00 PM', status: 'Pending', phone: '+971 54 333 9999', docId: '784-1992-1112223-4', isBlocked: false,
    emiratesId: { idNumber: '784-1992-1112223-4', cardNumber: '317294851', fullName: 'Emma Wilson', dob: '1992-11-05', nationality: 'United Kingdom', gender: 'F', issueDate: '2023-03-20', expiryDate: '2028-03-19', occupation: 'Education Specialist', employer: 'Ministry of Education', issuingPlace: 'Sharjah', country: 'United Arab Emirates' } },
  { id: 'V-1025', name: 'David Lee', company: 'ABC Cleaning', host: 'Jane Doe', type: 'Walk-In', date: '2026-10-05', time: '02:45 PM', status: 'Pending', phone: '+971 56 777 8888', docId: 'P-11223344', isBlocked: true,
    emiratesId: { idNumber: '784-2002-4977006-4', cardNumber: '129647381', fullName: 'David Lee', dob: '2002-07-05', nationality: 'India', gender: 'M', issueDate: '2023-06-07', expiryDate: '2025-06-06', occupation: 'Building Labourer', employer: 'ABC Cleaning LLC', issuingPlace: 'Dubai', country: 'United Arab Emirates' } },
];

const VisitorList = () => {
  const { sessionUser } = useRole();
  const isHost = sessionUser?.role === 'host';
  const isSecurity = sessionUser?.role === 'security';
  const isAdmin = sessionUser?.role === 'superadmin' || sessionUser?.role === 'campusadmin';
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
    id: Date.now(), fullName: '', mobileNumber: '', email: '', visitorType: '', nationality: '', company: '', docType: '', docNumber: '', docExpiry: '', docScanned: false,
    emiratesId: null // populated after scan
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
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'Approve' | 'Reject', visitor }
  const [securityActionType, setSecurityActionType] = useState('temp'); // 'temp', 'perm'
  const [securityReleaseDate, setSecurityReleaseDate] = useState('');

  // Document Viewer Modal
  const [showDocModal, setShowDocModal] = useState(false);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [visitorToTransfer, setVisitorToTransfer] = useState(null);
  const [transferCampus, setTransferCampus] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if(!transferCampus || !transferDate) {
      alert("Please select campus and future date.");
      return;
    }
    // Update the visitor's date (and theoretically campus, though not displayed directly in list)
    setVisitorsList(visitorsList.map(v => 
      v.id === visitorToTransfer.id ? { ...v, date: transferDate } : v
    ));
    setShowTransferModal(false);
    setShowTransferSuccess(true);
  };

  const closeTransferSuccess = () => {
    setShowTransferSuccess(false);
    setVisitorToTransfer(null);
    setTransferCampus('');
    setTransferDate('');
    setTransferNotes('');
  };

  // --- LIST HANDLERS ---
  const getStatusBadge = (visitor) => {
    if (visitor.isBlocked) {
      return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800 shadow-sm">Blocked</span>;
    }
    switch(visitor.status) {
      case 'Checked In': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Checked In</span>;
      case 'Approved': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Approved</span>;
      case 'Rejected': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</span>;
      case 'Pending': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</span>;
      case 'Completed': return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">Completed</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">Unknown</span>;
    }
  };

  const handleCheckInOut = (id) => {
    setVisitorsList(visitorsList.map(v => {
      if (v.id === id) {
        if (v.status === 'Pending') return { ...v, status: 'Checked In' };
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
      id: Date.now(), fullName: '', mobileNumber: '', email: '', visitorType: '', nationality: '', company: '', docType: '', docNumber: '', docExpiry: '', docScanned: false,
      emiratesId: null
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
    newVisitors[index].fullName = 'Sandeep Vishwakarma';
    newVisitors[index].docNumber = '784-2002-4977006-4';
    newVisitors[index].docExpiry = '2025-06-06';
    newVisitors[index].nationality = 'India';
    newVisitors[index].emiratesId = {
      idNumber: '784-2002-4977006-4',
      cardNumber: '129647381',
      fullName: 'Sandeep Vishwakarma Sheshmani Vishwakarma',
      dob: '2002-07-05',
      nationality: 'India',
      gender: 'M',
      issueDate: '2023-06-07',
      expiryDate: '2025-06-06',
      occupation: 'Building Labourer',
      employer: 'Pinewood Interiors L.L.C',
      issuingPlace: 'Dubai',
      country: 'United Arab Emirates',
    };
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
    setStep(4);
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
            (isHost || isSecurity || isAdmin) ? (
              <button 
                onClick={() => { 
                  setActiveTab(isHost ? 'preapproved' : 'walkin'); 
                  setStep(2); 
                  setVisitRequestId(null);
                }} 
                className="px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border-2 border-hct-blue bg-hct-blue text-white shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:bg-[#001a66]"
              >
                <UserPlus className="w-4 h-4" /> Add New Visitor
              </button>
            ) : null
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

      
      {/* --- SUMMARY CARDS --- */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 animate-in fade-in slide-in-from-top-4">
          {/* Total */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-slate-400" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-slate-400/10 blur-xl" />
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total List</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{filteredVisitors.length}</p>
          </div>
          {/* Pending */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-amber-200/60 dark:border-amber-900/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-amber-400" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-amber-400/10 blur-xl" />
            <p className="text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pending</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => !v.isBlocked && v.status === 'Pending').length}</p>
          </div>
          {/* Approved */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-emerald-200/60 dark:border-emerald-900/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-emerald-500" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl" />
            <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Approved</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => !v.isBlocked && v.status === 'Approved').length}</p>
          </div>
          {/* Checked In */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-blue-200/60 dark:border-blue-900/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-blue-500" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-blue-500/10 blur-xl" />
            <p className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Checked In</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => v.status === 'Checked In').length}</p>
          </div>
          {/* Blocked */}
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-red-200/60 dark:border-red-900/30 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-red-500" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-red-500/10 blur-xl" />
            <p className="text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-widest mb-1">Blocked</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => v.isBlocked).length}</p>
          </div>
        </div>
      )}


      {/* --- VISITOR LIST VIEW --- */}
      {activeTab === 'list' && (
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* ── Toolbar ── */}
            <div className="flex justify-between items-center mb-4 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search visitors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200/80 dark:border-slate-700/60 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-hct-blue/50 shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                {/* Filter dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border shadow-sm transition-all ${
                      statusFilter !== 'All'
                        ? 'bg-hct-blue text-white border-hct-blue shadow-blue-500/20'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:border-hct-blue hover:text-hct-blue'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {statusFilter !== 'All' ? statusFilter : 'Filter'}
                  </button>
                  {isFilterOpen && (
                    <div className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                      {['All', 'Pending', 'Checked In', 'Completed', 'Blocked'].map(status => (
                        <button
                          key={status}
                          onClick={() => { setStatusFilter(status); setIsFilterOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors ${
                            statusFilter === status
                              ? 'text-hct-blue bg-blue-50 dark:bg-blue-900/30 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-hct-blue hover:bg-[#001a66] text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20 transition-all">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
            </div>

            {/* ── Table Card ── */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/70 dark:border-slate-700/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">

                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-slate-100/60 dark:from-slate-800/80 dark:to-slate-800/40 border-b border-slate-200 dark:border-slate-700">
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">ID</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Visitor</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Host</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Type</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Date &amp; Time</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                      <th className="px-5 py-3.5 font-bold text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                              <Search className="w-5 h-5 text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-bold">No visitors found</p>
                            <p className="text-slate-400 text-[11px]">Try adjusting your search or filter</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredVisitors.map((visitor, idx) => (
                      <tr
                        key={visitor.id}
                        className="group border-b border-slate-100/70 dark:border-slate-800/50 last:border-0 hover:bg-blue-50/30 dark:hover:bg-white/[0.03] transition-all duration-200"
                      >
                        {/* ID */}
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{visitor.id}</span>
                        </td>

                        {/* Visitor */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0 shadow-sm">
                              {visitor.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white text-xs">{visitor.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{visitor.company}</p>
                            </div>
                          </div>
                        </td>

                        {/* Host */}
                        <td className="px-5 py-3.5">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{visitor.host}</span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {visitor.type}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{visitor.date}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{visitor.time}</p>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          {getStatusBadge(visitor)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end items-center gap-1.5">
                            {((isHost || isAdmin) && visitor.status === 'Pending') && (
                              <>
                                <button onClick={() => setConfirmAction({ type: 'Approve', visitor })} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" /> Approve
                                </button>
                                <button onClick={() => setConfirmAction({ type: 'Reject', visitor })} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 border border-red-200 dark:border-red-800">
                                  <XCircle className="w-3 h-3" /> Reject
                                </button>
                              </>
                            )}
                            <button onClick={() => setSelectedVisitor(visitor)} className="p-1.5 text-slate-400 hover:text-hct-blue bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View Details">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === visitor.id ? null : visitor.id)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>
                              {activeMenuId === visitor.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                  {isHost && (visitor.status === 'Approved' || visitor.status === 'Pending') && (
                                    <button
                                      onClick={() => { setVisitorToTransfer(visitor); setShowTransferModal(true); setActiveMenuId(null); }}
                                      className="w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 text-hct-blue hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                      Transfer Visit
                                    </button>
                                  )}
                                  <button
                                    onClick={() => { setVisitorToBlock(visitor); setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny'); setShowBlockModal(true); setActiveMenuId(null); }}
                                    className={`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 ${
                                      visitor.isBlocked
                                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                                        : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    }`}
                                  >
                                    <ShieldAlert className="w-4 h-4" />
                                    {visitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
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

              {/* Footer */}
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/30">
                <span className="text-[11px] text-slate-400 font-semibold">Showing {filteredVisitors.length} entries</span>
                <div className="flex gap-1">
                  <button className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors" disabled>Prev</button>
                  <button className="px-3 py-1 rounded-lg bg-hct-blue text-white text-xs font-bold shadow-sm">1</button>
                  <button className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors" disabled>Next</button>
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
            
            <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 relative">
              
              {/* Send Link Button Floating Top Right */}
              {step < 4 && (
                <button 
                  onClick={() => setShowSendLinkModal(true)}
                  className="absolute top-6 right-6 flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-indigo-100"
                >
                  <Send className="w-4 h-4" /> Send Link
                </button>
              )}

              {/* Registration Type Selector */}
              {step < 4 && (
                <div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type</h3>
                  {isHost ? (
                    <div className="bg-blue-50 text-hct-blue px-6 py-2 rounded-lg font-bold text-sm shadow-sm border border-blue-200">
                      Pre-Approved Registration
                    </div>
                  ) : isSecurity ? (
                    <div className="bg-blue-50 text-hct-blue px-6 py-2 rounded-lg font-bold text-sm shadow-sm border border-blue-200">
                      Walk-In Registration
                    </div>
                  ) : (
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
                  )}
                </div>
              )}

                            {/* STEP 2: Unified Form */}
              {step === 2 && (
                <div className="space-y-12 mt-2 max-w-4xl mx-auto">
                  
                  {/* Host & Campus Info */}
                  <div className="space-y-6">
                    <h3 className="text-base font-bold border-b pb-2">Visit Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  {/* Visitors Information Loop */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="text-base font-bold">Visitor Information & Identity</h3>
                    </div>

                    {formVisitors.map((visitor, index) => (
                      <div key={visitor.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative space-y-6">
                        {index > 0 && (
                          <button onClick={() => removeVisitor(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                        )}
                        <h4 className="font-bold text-base">Visitor {index + 1} {visitor.fullName ? `- ${visitor.fullName}` : ''}</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Full Name *</label>
                            <input type="text" value={visitor.fullName} onChange={(e) => handleVisitorChange(index, 'fullName', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number *</label>
                            <input type="tel" value={visitor.mobileNumber} onChange={(e) => handleVisitorChange(index, 'mobileNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                            <input type="email" value={visitor.email} onChange={(e) => handleVisitorChange(index, 'email', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nationality</label>
                            <input type="text" value={visitor.nationality} onChange={(e) => handleVisitorChange(index, 'nationality', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                          </div>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="text-xs font-bold mb-1 block">Document Type *</label>
                              <select value={visitor.docType} onChange={(e) => handleVisitorChange(index, 'docType', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
                                <option value="">Select ID Type</option>
                                <option value="Emirates ID">Emirates ID</option>
                                <option value="Passport">Passport</option>
                              </select>
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

                        {/* Vehicle Information */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                          <h3 className="text-sm font-bold border-b pb-2 mb-4">Vehicle Information</h3>
                          <div className="flex flex-col gap-6">
                            <div className="flex justify-start gap-8">
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${visitor.hasVehicle === 'Yes' ? 'border-hct-blue bg-blue-50 text-hct-blue' : 'border-slate-200 text-slate-400 group-hover:border-blue-200'}`}>
                                  <Car className="w-6 h-6" />
                                </div>
                                <input type="radio" name={`hasVehicle-${index}`} value="Yes" checked={visitor.hasVehicle === 'Yes'} onChange={(e) => handleVisitorChange(index, 'hasVehicle', e.target.value)} className="hidden" />
                                <span className="font-bold text-sm">Arriving by vehicle</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${visitor.hasVehicle === 'No' ? 'border-slate-800 bg-slate-50 text-slate-800 dark:border-slate-400 dark:text-white' : 'border-slate-200 text-slate-400 group-hover:border-slate-300'}`}>
                                  <UserCheck className="w-6 h-6" />
                                </div>
                                <input type="radio" name={`hasVehicle-${index}`} value="No" checked={visitor.hasVehicle === 'No'} onChange={(e) => handleVisitorChange(index, 'hasVehicle', e.target.value)} className="hidden" />
                                <span className="font-bold text-sm">No Vehicle</span>
                              </label>
                            </div>
                            {visitor.hasVehicle === 'Yes' && (
                              <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div>
                                  <label className="text-xs font-bold mb-1 block">Vehicle Number *</label>
                                  <input type="text" placeholder="e.g. Dubai A 12345" value={visitor.vehicleNumber} onChange={(e) => handleVisitorChange(index, 'vehicleNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none uppercase font-mono text-sm tracking-wider" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Live Photograph */}
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                          <h3 className="text-sm font-bold border-b pb-2 mb-4">Live Photograph Capture</h3>
                          <div className="bg-white dark:bg-slate-800 rounded-2xl h-64 flex flex-col items-center justify-center relative overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                            {visitor.photoCaptured ? (
                              <>
                                <img src="https://i.pravatar.cc/300" alt="Captured" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <button onClick={() => handleVisitorChange(index, 'photoCaptured', false)} className="bg-white text-slate-800 px-6 py-2 rounded-full font-bold shadow-lg">Retake Photo</button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                                   <Camera className="w-8 h-8 text-slate-400" />
                                </div>
                                <button onClick={() => handleVisitorChange(index, 'photoCaptured', true)} className="bg-slate-800 dark:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-900 transition-colors">Start Camera</button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-center pt-2">
                      <button onClick={addVisitor} type="button" className="flex items-center gap-2 text-sm font-bold text-hct-blue bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 dark:border-blue-800 shadow-sm">
                        <UserPlus className="w-5 h-5" /> Add Another Visitor
                      </button>
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="space-y-6">
                    <h3 className="text-base font-bold border-b pb-2">Visitor Declaration</h3>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input type="checkbox" checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)} className="mt-1 w-5 h-5 text-hct-blue rounded border-slate-300" />
                        <span className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <strong>I confirm that the information provided is correct and I agree to comply with the visitor management and security policies of Higher Colleges of Technology (HCT).</strong>
                        </span>
                      </label>
                    </div>
                  </div>

                </div>
              )}

{/* STEP 3: Review & Submit */}
              {step === 3 && (
                <div className="space-y-8 mt-2">
                  <h3 className="text-base font-bold text-center border-b pb-4">Review Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs flex justify-between items-center">
                        Visitor Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        {formVisitors.map((v, i) => (
                          <div key={v.id} className={`${i > 0 ? 'mt-4 pt-4 border-t border-slate-200' : ''}`}>
                            <p className="font-bold text-sm mb-2">{v.fullName}</p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Type:</span> <span className="font-medium">{v.visitorType || '-'}</span></p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Mobile:</span> <span className="font-medium">{v.mobileNumber}</span></p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Email:</span> <span className="font-medium">{v.email || '-'}</span></p>
                            <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Nationality:</span> <span className="font-medium">{v.nationality || '-'}</span></p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs flex justify-between items-center">
                        Host Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Name:</span> <span className="font-bold">{hostDetails.hostName || (isPreScheduled ? 'Jane Doe' : '-')}</span></p>
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Location:</span> <span className="font-medium">{hostDetails.campus || hostDetails.department || '-'}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Emirates ID Extracted Details */}
                  {formVisitors.some(v => v.emiratesId) && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 text-hct-blue fill-current"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                        </span>
                        Emirates ID — Extracted Details
                      </h4>
                      {formVisitors.filter(v => v.emiratesId).map((v, i) => (
                        <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-xs">
                            {[
                              ['ID Number', v.emiratesId.idNumber],
                              ['Card Number', v.emiratesId.cardNumber],
                              ['Full Name', v.emiratesId.fullName],
                              ['Date of Birth', v.emiratesId.dob],
                              ['Nationality', v.emiratesId.nationality],
                              ['Gender', v.emiratesId.gender],
                              ['Issue Date', v.emiratesId.issueDate],
                              ['Expiry Date', v.emiratesId.expiryDate],
                              ['Occupation', v.emiratesId.occupation],
                              ['Employer', v.emiratesId.employer],
                              ['Issuing Place', v.emiratesId.issuingPlace],
                              ['Country', v.emiratesId.country],
                            ].map(([label, value]) => (
                              <div key={label} className="flex flex-col">
                                <span className="text-blue-500 dark:text-blue-400 font-semibold mb-0.5">{label}</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{value || '-'}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: Success */}
              {step === 4 && (
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
              {step >= 2 && step < 4 && (
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative flex flex-col max-h-[90vh]">
            <button
              onClick={() => setSelectedVisitor(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
            >
              ✕
            </button>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-8">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedVisitor.photo || `https://i.pravatar.cc/150?u=${selectedVisitor.id || 'visitor'}`} alt="Captured Photo" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Visitor Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">ID: {selectedVisitor.id}</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-3 mb-6">
                {[
                  ['Name', selectedVisitor.name],
                  ['Phone', selectedVisitor.phone],
                  ['Host', selectedVisitor.host],
                  ['Company', selectedVisitor.company],
                  ['Visitor Type', selectedVisitor.type],
                  ['Document ID', selectedVisitor.docId],
                  ['Date & Time', `${selectedVisitor.date} at ${selectedVisitor.time}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 font-medium text-sm">{label}</span>
                    <span className="font-semibold text-slate-800 dark:text-white text-sm text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium text-sm">Status</span>
                  {getStatusBadge(selectedVisitor)}
                </div>
              </div>

              {/* Emirates ID Details */}
              {selectedVisitor.emiratesId && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>
                    </div>
                    <h4 className="font-bold text-slate-700 dark:text-slate-200">Emirates ID Details</h4>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-5 space-y-2.5">
                    {[
                      ['Id Number', selectedVisitor.emiratesId.idNumber],
                      ['Card Number', selectedVisitor.emiratesId.cardNumber],
                      ['Full Name', selectedVisitor.emiratesId.fullName],
                      ['Date Of Birth', selectedVisitor.emiratesId.dob],
                      ['Nationality', selectedVisitor.emiratesId.nationality],
                      ['Gender', selectedVisitor.emiratesId.gender],
                      ['Issue Date', selectedVisitor.emiratesId.issueDate],
                      ['Expiry Date', selectedVisitor.emiratesId.expiryDate],
                      ['Occupation', selectedVisitor.emiratesId.occupation],
                      ['Employer', selectedVisitor.emiratesId.employer],
                      ['Issuing Place', selectedVisitor.emiratesId.issuingPlace],
                      ['Country', selectedVisitor.emiratesId.country],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start">
                        <span className="text-blue-500 dark:text-blue-400 font-semibold text-xs min-w-[110px]">{label}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-xs text-right">{value || '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons — pinned at bottom */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3">
              {((isHost || isAdmin) && selectedVisitor.status === 'Pending') && (
                <div className="flex gap-3 w-full">
                  <button onClick={() => {
                    setConfirmAction({ type: 'Approve', visitor: selectedVisitor });
                    setSelectedVisitor(null);
                  }} className="flex-1 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() => {
                    setConfirmAction({ type: 'Reject', visitor: selectedVisitor });
                    setSelectedVisitor(null);
                  }} className="flex-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowDocModal(true)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
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
      )}

      {/* Transfer Modal */}
      {showTransferModal && visitorToTransfer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-hct-blue dark:text-blue-400" />
                Transfer Visitor
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Transfer visitor <span className="font-bold text-slate-900 dark:text-white">{visitorToTransfer.name}</span> to another campus.
              </p>
              
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Campus *</label>
                <select required value={transferCampus} onChange={(e) => setTransferCampus(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm">
                  <option value="">Select Campus</option>
                  <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                  <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                  <option value="Dubai Women's Campus">Dubai Women's Campus</option>
                  <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Date *</label>
                <input required type="date" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Notes</label>
                <textarea rows="3" value={transferNotes} onChange={(e) => setTransferNotes(e.target.value)} placeholder="Add any specific instructions or reasons for transfer..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm resize-none"></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-hct-blue hover:bg-[#001a66] text-white font-bold transition-colors shadow-md shadow-blue-900/20">Transfer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Transfer Success Modal */}
      {showTransferSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeTransferSuccess} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-8 text-center overflow-hidden">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 dark:border-emerald-900/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Transfer Successful!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Visitor <span className="font-bold text-slate-700 dark:text-slate-300">{visitorToTransfer?.name}</span> has been transferred to <span className="font-bold text-slate-700 dark:text-slate-300">{transferCampus}</span> on <span className="font-bold text-slate-700 dark:text-slate-300">{transferDate}</span>.
            </p>
            <button onClick={closeTransferSuccess} className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold transition-colors">
              Done
            </button>
          </motion.div>
        </div>
      )}

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
            {/* Header */}
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
              <div className="flex items-center gap-2">
                <a
                  href="/emirates_id_sample.png"
                  download="emirates_id.png"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
                <button
                  onClick={() => setShowDocModal(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Image */}
            <div className="p-6 flex flex-col items-center gap-4 bg-[#111]">
              <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-white/10">
                <img
                  src="/emirates_id_sample.png"
                  alt="Emirates ID Document"
                  className="w-full object-contain"
                />
              </div>
              {/* Watermark strip */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldAlert className="w-3 h-3" />
                Confidential — For official use only. Do not distribute.
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
                  <select 
                    required
                    value={sendLinkData.hostName || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, hostName: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                  >
                    <option value="">Select a Host</option>
                    <option value="Dr. Ahmed">Dr. Ahmed</option>
                    <option value="Jane Doe">Jane Doe</option>
                    <option value="Prof. Tariq">Prof. Tariq</option>
                    <option value="Sarah Parker">Sarah Parker</option>
                  </select>
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

      
      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {confirmAction.type} Visitor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to {confirmAction.type.toLowerCase()} the visit for <strong>{confirmAction.visitor.name}</strong>?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setVisitorsList(visitorsList.map(v => v.id === confirmAction.visitor.id ? { ...v, status: confirmAction.type === 'Approve' ? 'Approved' : 'Rejected' } : v));
                    setConfirmAction(null);
                  }}
                  className={`flex-1 px-4 py-2 text-white rounded-xl font-bold text-sm transition-colors shadow-sm ${confirmAction.type === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Yes, {confirmAction.type}
                </button>
              </div>
            </div>
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
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-2 font-medium">This is temporarily unblocked from blocked date to selected date.</p>
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







