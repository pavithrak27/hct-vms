import React, { useState, useRef, useEffect } from 'react';
import { Camera, Car, FileText, UserCheck, QrCode, CheckCircle2, UserPlus, Search, Shield, Trash2, Edit2, Play, Check, Signature, ShieldAlert, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const VisitorPortal = () => {
  const location = useLocation();
  const isPreScheduled = location.state?.preScheduled || false;
  const visitData = location.state?.visitData || null;

  const [step, setStep] = useState(isPreScheduled ? 2 : 1);
  const [entryMode, setEntryMode] = useState(isPreScheduled ? 'pre-scheduled' : null); 
  const [activeTab, setActiveTab] = useState(isPreScheduled ? 'preapproved' : 'walkin'); 

  // Step 2 & 3: Visitors & Host
  const [visitors, setVisitors] = useState([
    {
      id: Date.now(),
      fullName: visitData?.visitorName || '',
      mobileNumber: visitData?.mobileNumber || '',
      email: visitData?.visitorEmail || '',
      visitorType: '',
      nationality: '',
      company: visitData?.company || '',
      docType: '',
      docNumber: '',
      docExpiry: '',
      docScanned: false
    }
  ]);
  
  const [hostDetails, setHostDetails] = useState({
    hostName: visitData?.hostName || '',
    department: visitData?.hostDepartment || '',
    campus: visitData?.campus || '',
    visitDate: visitData?.visitDate || '',
    arrivalTime: visitData?.arrivalTime || ''
  });

  // Step 4: Vehicle
  const [vehicleDetails, setVehicleDetails] = useState({
    hasVehicle: 'No',
    vehicleNumber: '',
    vehicleType: '',
    vehicleMake: '',
    vehicleColor: ''
  });

  // Step 5 & 6: Photo & Declaration
  const [livePhotoCaptured, setLivePhotoCaptured] = useState(false);
  const [declarationAccepted, setDeclarationAccepted] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  // Signature Pad State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Step 8: Submission
  const [visitRequestId, setVisitRequestId] = useState(null);
  const [hostAction, setHostAction] = useState('pending'); // pending, approved, rejected
  const [rejectionReason, setRejectionReason] = useState('');

  // Form Handlers
  const handleVisitorChange = (index, field, value) => {
    const newVisitors = [...visitors];
    newVisitors[index][field] = value;
    setVisitors(newVisitors);
  };

  const addVisitor = () => {
    setVisitors([...visitors, {
      id: Date.now(), fullName: '', mobileNumber: '', email: '', visitorType: '', nationality: '', company: '', docType: '', docNumber: '', docExpiry: '', docScanned: false
    }]);
  };

  const removeVisitor = (index) => {
    if (visitors.length > 1) {
      const newVisitors = [...visitors];
      newVisitors.splice(index, 1);
      setVisitors(newVisitors);
    }
  };

  const simulateScan = (index) => {
    const newVisitors = [...visitors];
    newVisitors[index].docScanned = true;
    newVisitors[index].fullName = 'John Smith';
    newVisitors[index].docNumber = '784-1990-1234567-1';
    newVisitors[index].docExpiry = '2030-12-31';
    setVisitors(newVisitors);
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

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Navigation
  const nextStep = () => {
    // Basic validation before moving next
    if (step === 2) {
      const v = visitors[0];
      if (!v.fullName || !v.mobileNumber || !hostDetails.hostName) {
        alert("Please fill all mandatory fields (*)");
        return;
      }
    }
    if (step === 3) {
      const v = visitors[0];
      if (!v.docType || !v.docNumber) {
        alert("Please provide identity documents.");
        return;
      }
    }
    if (step === 4 && vehicleDetails.hasVehicle === 'Yes' && !vehicleDetails.vehicleNumber) {
      alert("Please provide the Vehicle Number.");
      return;
    }
    if (step === 5 && !livePhotoCaptured) {
      alert("Please capture a live photograph.");
      return;
    }
    if (step === 6 && (!declarationAccepted || !hasSignature)) {
      alert("Please accept the declaration and provide a signature.");
      return;
    }
    setStep(s => s + 1);
  };
  const prevStep = () => setStep(s => s - 1);

  const submitRequest = () => {
    setVisitRequestId('VR-2026-00125');
    setStep(8);
  };

  return (
    <div className="w-full max-w-5xl mx-auto min-h-[80vh] flex flex-col">
      {/* Header & Tabs */}
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Visitor Management</h2>
        
        <div className="flex justify-center mb-2">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex shadow-inner">
            <button 
              onClick={() => { setActiveTab('walkin'); setStep(1); }} 
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'walkin' ? 'bg-white dark:bg-slate-700 text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Walk-In
            </button>
            <button 
              onClick={() => { setActiveTab('preapproved'); setStep(1); }} 
              className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'preapproved' ? 'bg-white dark:bg-slate-700 text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Pre-Approved
            </button>
          </div>
        </div>
        
        {visitRequestId && step === 8 && (
          <p className="text-hct-blue dark:text-blue-400 font-bold mt-2">Visit Request: {visitRequestId}</p>
        )}
      </div>

      {/* Progress Indicator */}
      {step > 1 && step < 8 && (
        <div className="flex justify-between items-center mb-8 px-4 overflow-x-auto pb-4 gap-4">
          {['Details', 'Identity', 'Vehicle', 'Photo', 'Declaration', 'Review'].map((label, i) => {
            const stepNum = i + 2;
            const isActive = step === stepNum;
            const isPast = step > stepNum;
            return (
              <div key={label} className="flex flex-col items-center min-w-[80px] gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isActive ? 'bg-hct-blue text-white ring-4 ring-blue-100 dark:ring-blue-900/50' : isPast ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                  {isPast ? <Check className="w-4 h-4" /> : stepNum - 1}
                </div>
                <span className={`text-xs font-bold ${isActive ? 'text-hct-blue dark:text-blue-400' : 'text-slate-500'}`}>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8"
        >
          {/* STEP 1: Modes */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center mb-8">
                {activeTab === 'walkin' ? 'Walk-In Registration Method' : 'Pre-Approved Entry Method'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button onClick={() => { setEntryMode('qr'); setStep(2); }} className="p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-hct-blue hover:bg-blue-50 dark:hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-hct-blue group-hover:scale-110 transition-transform"><QrCode className="w-8 h-8" /></div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">Scan QR Code</h4>
                  <p className="text-sm text-slate-500 mt-2">Self-registration via mobile</p>
                </button>
                <button onClick={() => { setEntryMode('kiosk'); setStep(2); }} className="p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-hct-blue hover:bg-blue-50 dark:hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform"><UserCheck className="w-8 h-8" /></div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">Register at Kiosk</h4>
                  <p className="text-sm text-slate-500 mt-2">Use the gate tablet</p>
                </button>
                <button onClick={() => { setEntryMode('security'); setStep(2); }} className="p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-hct-blue hover:bg-blue-50 dark:hover:bg-slate-800 transition-all text-center group flex flex-col items-center">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform"><Shield className="w-8 h-8" /></div>
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white">Security Assisted</h4>
                  <p className="text-sm text-slate-500 mt-2">Staff registers visitor</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Details */}
          {step === 2 && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold border-b pb-2">Primary Visitor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Full Name *</label>
                  <input type="text" value={visitors[0].fullName} onChange={(e) => handleVisitorChange(0, 'fullName', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number *</label>
                  <input type="tel" value={visitors[0].mobileNumber} onChange={(e) => handleVisitorChange(0, 'mobileNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Email Address</label>
                  <input type="email" value={visitors[0].email} onChange={(e) => handleVisitorChange(0, 'email', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nationality</label>
                  <input type="text" value={visitors[0].nationality} onChange={(e) => handleVisitorChange(0, 'nationality', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Host *</label>
                  <div className="relative">
                    {isPreScheduled && <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />}
                    {isPreScheduled ? (
                      <input type="text" value={hostDetails.hostName} readOnly className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                    ) : (
                      <select value={hostDetails.hostName} onChange={(e) => setHostDetails({...hostDetails, hostName: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none">
                        <option value="">Select a Host</option>
                        {["Dr. Ahmed", "Jane Doe", "Prof. Tariq", "Sarah Parker", "Michael Chang", "Facilities Dept"].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  {isPreScheduled && <p className="text-xs text-slate-500 mt-1">Host assignment is locked by invitation.</p>}
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus / Location</label>
                  <div className="relative">
                     {isPreScheduled && <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />}
                     {isPreScheduled ? (
                       <input type="text" value={hostDetails.department || ''} readOnly className="w-full pl-10 p-3 rounded-xl border border-slate-300 dark:border-slate-700 outline-none bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                     ) : (
                       <select value={hostDetails.department || ''} onChange={(e) => setHostDetails({...hostDetails, department: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none">
                         <option value="">Select Campus</option>
                         {["Abu Dhabi Men's Campus", "Abu Dhabi Women's Campus", "Dubai Men's Campus", "Dubai Women's Campus", "Sharjah Men's Campus", "Sharjah Women's Campus"].map(camp => (
                           <option key={camp} value={camp}>{camp}</option>
                         ))}
                       </select>
                     )}
                  </div>
                </div>
                
                {isPreScheduled && (
                  <div className="md:col-span-2 grid grid-cols-2 gap-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                    <div>
                      <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider mb-1">Scheduled Visit Date</label>
                      <strong className="text-hct-blue dark:text-blue-400">{hostDetails.visitDate}</strong>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block uppercase tracking-wider mb-1">Arrival Time</label>
                      <strong className="text-hct-blue dark:text-blue-400">{hostDetails.arrivalTime}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Identity & Multi Visitor */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xl font-bold">Identity Verification</h3>
              </div>

              {visitors.map((visitor, index) => (
                <div key={visitor.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                  {index > 0 && (
                    <button onClick={() => removeVisitor(index)} className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                  )}
                  <h4 className="font-bold text-lg mb-4">Visitor {index + 1} {visitor.fullName ? `- ${visitor.fullName}` : ''}</h4>
                  
                  {index > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <input type="text" placeholder="Full Name" value={visitor.fullName} onChange={(e) => handleVisitorChange(index, 'fullName', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                      <input type="tel" placeholder="Mobile Number" value={visitor.mobileNumber} onChange={(e) => handleVisitorChange(index, 'mobileNumber', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold mb-1 block">Document Type *</label>
                        <select value={visitor.docType} onChange={(e) => handleVisitorChange(index, 'docType', e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
                          <option value="">Select ID Type</option>
                          <option value="Emirates ID">Emirates ID</option>
                          <option value="Passport">Passport</option>
                          <option value="Other">Other supported ID</option>
                        </select>
                      </div>
                      
                      
                    </div>

                    <div className="flex flex-col justify-center">
                      {visitor.docScanned ? (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-6 text-center">
                           <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                           <p className="font-bold text-emerald-700 dark:text-emerald-400">Document Scanned Successfully</p>
                           <p className="text-sm mt-2 text-slate-600 dark:text-slate-400">Details extracted via OCR</p>
                           <button onClick={() => handleVisitorChange(index, 'docScanned', false)} className="mt-4 text-xs font-bold text-emerald-700 underline">Rescan</button>
                        </div>
                      ) : (
                        <button onClick={() => simulateScan(index)} disabled={!visitor.docType} className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-hct-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                          <Camera className="w-10 h-10 mb-2" />
                          <span className="font-bold">Scan Document (OCR)</span>
                          <span className="text-xs mt-1">Open camera to extract details</span>
                        </button>
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
          )}

          {/* STEP 4: Vehicle */}
          {step === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold border-b pb-2 text-center">Vehicle Information</h3>
              
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
                    <label className="text-sm font-bold mb-1 block">Vehicle Number *</label>
                    <input type="text" placeholder="e.g. Dubai A 12345" value={vehicleDetails.vehicleNumber} onChange={(e) => setVehicleDetails({...vehicleDetails, vehicleNumber: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none uppercase font-mono text-lg tracking-wider" />
                  </div>

                  {vehicleDetails.vehicleNumber && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                      <Shield className="w-5 h-5" /> Vehicle number linked to ANPR system for automated gate access.
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* STEP 5: Photo */}
          {step === 5 && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <h3 className="text-xl font-bold border-b pb-2">Live Photograph Capture</h3>
              <p className="text-slate-500 mb-6">Security policy requires a live photograph of the visitor.</p>
              
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
            <div className="space-y-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold border-b pb-2 text-center">Declaration & Digital Signature</h3>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input type="checkbox" checked={declarationAccepted} onChange={(e) => setDeclarationAccepted(e.target.checked)} className="mt-1 w-5 h-5 text-hct-blue rounded border-slate-300" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong>I confirm that the information provided is correct and I agree to comply with the visitor management and security policies of Higher Colleges of Technology (HCT).</strong>
                  </span>
                </label>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-sm font-bold block">Digital Signature *</label>
                  {hasSignature && <button onClick={clearSignature} className="text-xs text-slate-500 hover:text-red-500">Clear</button>}
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 overflow-hidden relative">
                  {!hasSignature && !isDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-slate-500">
                      <Signature className="w-16 h-16" />
                    </div>
                  )}
                  <canvas 
                    ref={canvasRef}
                    width={600}
                    height={200}
                    className="w-full h-48 cursor-crosshair touch-none"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Review & Submit */}
          {step === 7 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center border-b pb-4">Review Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visitor Summary */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex justify-between items-center">
                    Visitor Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-sm">
                    {visitors.map((v, i) => (
                      <div key={v.id} className={`${i > 0 ? 'mt-4 pt-4 border-t border-slate-200' : ''}`}>
                        <p className="font-bold text-base mb-2">{v.fullName}</p>
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Type:</span> <span className="font-medium">{v.visitorType}</span></p>
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Mobile:</span> <span className="font-medium">{v.mobileNumber}</span></p>
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Document:</span> <span className="font-medium">{v.docType} ({v.docNumber})</span></p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Host Summary */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex justify-between items-center">
                      Host Details <button onClick={() => setStep(2)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                    </h4>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-sm">
                      <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Name:</span> <span className="font-bold text-base">{hostDetails.hostName}</span></p>
                      <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Location:</span> <span className="font-medium">{hostDetails.campus || hostDetails.department || '-'}</span></p>
                      {isPreScheduled && (
                        <>
                          <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Date:</span> <span className="font-medium">{hostDetails.visitDate}</span></p>
                          <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Time:</span> <span className="font-medium">{hostDetails.arrivalTime}</span></p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Vehicle Summary */}
                  {vehicleDetails.hasVehicle === 'Yes' && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-500 uppercase tracking-wider text-sm flex justify-between items-center">
                        Vehicle Details <button onClick={() => setStep(4)} className="text-hct-blue normal-case flex items-center gap-1"><Edit2 className="w-3 h-3"/> Edit</button>
                      </h4>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 text-sm">
                        <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Number Plate:</span> <span className="font-bold text-base uppercase">{vehicleDetails.vehicleNumber}</span></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Success */}
          {step === 8 && (
            <div className="text-center space-y-8 max-w-2xl mx-auto py-8">
              {hostAction === 'pending' && (
                <div className="animate-pulse">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6"><ClockIcon className="w-10 h-10 text-amber-500" /></div>
                  <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Registration Submitted Successfully</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 mt-6 text-left max-w-md mx-auto">
                    <p className="mb-2"><strong className="text-slate-500">Visit Request ID:</strong> <span className="font-bold text-slate-800 dark:text-white">{visitRequestId}</span></p>
                    <p className="mb-4"><strong className="text-slate-500">Status:</strong> <span className="font-bold text-amber-600">Pending Host Approval</span></p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Your visit request has been submitted successfully. The selected Host has been notified and will review your request.</p>
                  </div>
                </div>
              )}
              {hostAction === 'approved' && (
                <div>
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                  <h3 className="text-3xl font-bold text-emerald-600 mb-2">Visit Approved</h3>
                  <p className="text-lg text-slate-500 mb-6">Your visit request has been approved.</p>
                  <div className="bg-white p-6 rounded-2xl border shadow-lg max-w-sm mx-auto">
                    <div className="border-b pb-4 mb-4 text-left flex justify-between items-center">
                       <div>
                         <p className="font-bold">Visitor Pass</p>
                         <p className="text-sm text-slate-500">VP-{visitRequestId?.split('-')[1]}-{visitRequestId?.split('-')[2]}</p>
                       </div>
                       <button className="text-hct-blue text-xs font-bold px-3 py-1 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Download</button>
                    </div>
                    <QrCode className="w-48 h-48 mx-auto text-slate-800" />
                    <div className="mt-4 text-left text-sm space-y-1">
                      <p className="font-bold text-lg mb-2 text-center">{visitors[0].fullName}</p>
                      <p className="grid grid-cols-3 gap-2"><span className="text-slate-500">Host:</span> <span className="col-span-2 font-medium">{hostDetails.hostName}</span></p>
                      <p className="grid grid-cols-3 gap-2"><span className="text-slate-500">Campus:</span> <span className="col-span-2 font-medium">{hostDetails.campus || hostDetails.department || '-'}</span></p>
                      <p className="grid grid-cols-3 gap-2"><span className="text-slate-500">Date:</span> <span className="col-span-2 font-medium">{hostDetails.visitDate || 'Today'}</span></p>
                    </div>
                  </div>
                </div>
              )}
              {hostAction === 'rejected' && (
                <div>
                  <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"><ShieldAlert className="w-12 h-12 text-red-500" /></div>
                  <h3 className="text-3xl font-bold text-red-600 mb-2">Visit Rejected</h3>
                  <p className="text-lg text-slate-500">Your visitor request has been rejected by the Host.</p>
                  <div className="bg-red-50 p-6 rounded-xl border border-red-200 mt-6 text-left max-w-md mx-auto">
                    <p className="text-sm text-red-800 mb-1 font-bold uppercase tracking-wider">Rejection Reason</p>
                    <p className="text-red-700">{rejectionReason || 'No reason provided.'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer Navigation */}
      {step > 1 && step < 8 && (
        <div className="mt-6 flex justify-between items-center">
          <button onClick={prevStep} className="px-6 py-3 rounded-full font-bold text-slate-600 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
            Back
          </button>
          
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
  );
};

// Quick mock for Clock icon since it's not imported directly in the main list above
const ClockIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

export default VisitorPortal;
