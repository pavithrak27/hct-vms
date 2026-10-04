import React, { useState } from 'react';
import { Building2, Users, FileSignature, CheckCircle2, UploadCloud, Camera, Search, UserPlus, Trash2, ArrowRight, Video, FileText, CheckSquare, Plus, AlertCircle, Clock, ShieldCheck, QrCode, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PassViewer from './PassViewer';

const ContractorPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const companyInfo = {
    name: 'Tech Solutions LLC',
    id: 'CON-2026-101',
    contractNumber: 'CT-2025-9981',
    status: 'Approved',
    contractStart: '2026-11-01',
    contractExpiry: '2027-11-01',
    gatePassValidity: '2026-11-01 to 2027-10-31'
  };

  const [employees, setEmployees] = useState([
    { id: 'EMP-CT-2026-001', name: 'John Smith', nationality: 'UK', mobile: '+971501234567', jobTitle: 'Site Engineer', status: 'Approved', docExpiry: '2027-12-31' },
    { id: 'EMP-CT-2026-002', name: 'Ravi Kumar', nationality: 'India', mobile: '+971509876543', jobTitle: 'Technician', status: 'Approved', docExpiry: '2027-05-15' },
    { id: 'EMP-CT-2026-003', name: 'Alex Johnson', nationality: 'Canada', mobile: '+971551122334', jobTitle: 'Safety Officer', status: 'Rejected', rejectionReason: 'Passport copy unclear' }
  ]);

  const [passRequests, setPassRequests] = useState([
    { id: 'CPR-2026-0001', employees: 2, start: '2026-11-05 08:00', end: '2026-11-10 18:00', status: 'Approved', submissionDate: '2026-10-01' }
  ]);

  // Add Employee State
  const [addStep, setAddStep] = useState(1);
  const [empForm, setEmpForm] = useState({ name: '', nationality: '', mobile: '', jobTitle: '', docExpiry: '' });
  const [empDoc, setEmpDoc] = useState(null);
  const [empPhoto, setEmpPhoto] = useState(false);

  // Create Pass Request State
  const [passStep, setPassStep] = useState(0); // 0=list, 1=select emp, 2=period, 3=hse, 4=review
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState({ startDate: '', startTime: '', endDate: '', endTime: '' });
  const [periodError, setPeriodError] = useState('');
  const [hseStatus, setHseStatus] = useState('Not Started'); // Not Started, In Progress, Completed
  const [declaration, setDeclaration] = useState(false);
  const [signature, setSignature] = useState('');

  const [showPassViewer, setShowPassViewer] = useState(false);

  const submitEmployee = () => {
    setEmployees([{
      id: `EMP-CT-2026-${Math.floor(Math.random() * 900) + 100}`,
      ...empForm,
      status: 'Pending Approval'
    }, ...employees]);
    setActiveTab('employees');
    setAddStep(1);
    setEmpForm({ name: '', nationality: '', mobile: '', jobTitle: '', docExpiry: '' });
  };

  const toggleEmpSelect = (id) => {
    if (selectedEmps.includes(id)) {
      setSelectedEmps(selectedEmps.filter(e => e !== id));
    } else {
      setSelectedEmps([...selectedEmps, id]);
    }
  };

  const handlePeriodNext = () => {
    const start = new Date(`${visitPeriod.startDate}T${visitPeriod.startTime}`);
    const end = new Date(`${visitPeriod.endDate}T${visitPeriod.endTime}`);
    const contractEnd = new Date(companyInfo.contractExpiry);
    const today = new Date();

    if (start < today) { setPeriodError('Start date/time cannot be in the past.'); return; }
    if (end <= start) { setPeriodError('End date/time must be after start date/time.'); return; }
    if (end > contractEnd) { setPeriodError('Visit period cannot exceed the contract expiry date.'); return; }
    
    // Check employee docs
    const invalidEmp = selectedEmps.map(id => employees.find(e => e.id === id)).find(e => new Date(e.docExpiry) < end);
    if (invalidEmp) {
      setPeriodError(`Employee ${invalidEmp.name}'s ID expires before the requested pass end date.`);
      return;
    }

    setPeriodError('');
    setPassStep(3);
  };

  const simulateHseVideo = () => {
    setHseStatus('In Progress');
    setTimeout(() => setHseStatus('Completed'), 2000);
  };

  const submitPassRequest = () => {
    const newReq = {
      id: `CPR-2026-${Math.floor(Math.random() * 900) + 100}`,
      employees: selectedEmps.length,
      start: `${visitPeriod.startDate} ${visitPeriod.startTime}`,
      end: `${visitPeriod.endDate} ${visitPeriod.endTime}`,
      status: 'Pending Approval',
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setPassRequests([newReq, ...passRequests]);
    setPassStep(5); // Success screen
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Contractor Portal</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage company profile, employees, and request gate passes.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl border border-emerald-200 font-bold flex items-center gap-2">
          <Building2 className="w-5 h-5" /> {companyInfo.name} ({companyInfo.id})
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-2 space-y-2">
             <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${activeTab === 'dashboard' ? 'bg-hct-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Building2 className="w-5 h-5" /> Dashboard
             </button>
             <button onClick={() => setActiveTab('employees')} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${activeTab === 'employees' ? 'bg-hct-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
               <Users className="w-5 h-5" /> My Employees
             </button>
             <button onClick={() => {setActiveTab('add-employee'); setAddStep(1);}} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${activeTab === 'add-employee' ? 'bg-hct-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
               <UserPlus className="w-5 h-5" /> Add Employee
             </button>
             <button onClick={() => {setActiveTab('passes'); setPassStep(0);}} className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold ${activeTab === 'passes' ? 'bg-hct-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
               <FileSignature className="w-5 h-5" /> Pass Requests
             </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-8 min-h-[600px]">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="animate-in fade-in space-y-8">
               <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div><p className="text-sm font-bold text-slate-500 uppercase">Contract No</p><p className="font-bold text-slate-800 text-lg">{companyInfo.contractNumber}</p></div>
                 <div><p className="text-sm font-bold text-slate-500 uppercase">Status</p><p className="font-bold text-emerald-600 text-lg flex items-center gap-1"><CheckCircle2 className="w-5 h-5"/> {companyInfo.status}</p></div>
                 <div><p className="text-sm font-bold text-slate-500 uppercase">Contract Validity</p><p className="font-bold text-slate-800">{companyInfo.contractStart} to {companyInfo.contractExpiry}</p></div>
                 <div><p className="text-sm font-bold text-slate-500 uppercase">Gate Pass Limits</p><p className="font-bold text-slate-800">{companyInfo.gatePassValidity}</p></div>
               </div>

               <h3 className="text-xl font-bold border-b pb-2">Employee Summary</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center"><p className="text-4xl font-bold text-slate-800 mb-1">{employees.length}</p><p className="text-sm font-bold text-slate-500 uppercase">Total Employees</p></div>
                 <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-center"><p className="text-4xl font-bold text-amber-600 mb-1">{employees.filter(e => e.status.includes('Pending')).length}</p><p className="text-sm font-bold text-amber-700 uppercase">Pending Approval</p></div>
                 <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center"><p className="text-4xl font-bold text-emerald-600 mb-1">{employees.filter(e => e.status === 'Approved').length}</p><p className="text-sm font-bold text-emerald-700 uppercase">Approved</p></div>
                 <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center"><p className="text-4xl font-bold text-red-600 mb-1">{employees.filter(e => e.status === 'Rejected').length}</p><p className="text-sm font-bold text-red-700 uppercase">Rejected</p></div>
               </div>
            </div>
          )}

          {/* MY EMPLOYEES TAB */}
          {activeTab === 'employees' && (
            <div className="animate-in fade-in space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold">My Employees</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search employees..." className="pl-9 p-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue text-sm w-64 bg-white" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map(emp => (
                  <div key={emp.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{emp.name}</h4>
                        <p className="text-xs text-slate-500">{emp.id}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                        emp.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600 mb-4">
                      <p><span className="font-semibold text-slate-400 w-20 inline-block">Role:</span> {emp.jobTitle}</p>
                      <p><span className="font-semibold text-slate-400 w-20 inline-block">Nationality:</span> {emp.nationality}</p>
                      <p><span className="font-semibold text-slate-400 w-20 inline-block">Mobile:</span> {emp.mobile}</p>
                      <p><span className="font-semibold text-slate-400 w-20 inline-block">ID Expiry:</span> <span className={new Date(emp.docExpiry) < new Date() ? 'text-red-600 font-bold' : ''}>{emp.docExpiry}</span></p>
                    </div>
                    {emp.status === 'Rejected' && (
                      <div className="bg-red-50 text-red-700 text-xs p-2 rounded-lg mb-4 font-medium border border-red-100">
                        Reason: {emp.rejectionReason}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button className="flex-1 text-xs font-bold py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors text-slate-700">Edit Details</button>
                      <button className="p-2 text-slate-400 border border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ADD EMPLOYEE TAB */}
          {activeTab === 'add-employee' && (
            <div className="animate-in fade-in max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold border-b pb-4 mb-6">Add New Employee</h3>
              
              {addStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold block mb-1">Full Name *</label>
                      <input type="text" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" placeholder="As per Passport" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1">Nationality *</label>
                      <input type="text" value={empForm.nationality} onChange={e => setEmpForm({...empForm, nationality: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1">Mobile Number *</label>
                      <input type="text" value={empForm.mobile} onChange={e => setEmpForm({...empForm, mobile: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1">Job Title *</label>
                      <input type="text" value={empForm.jobTitle} onChange={e => setEmpForm({...empForm, jobTitle: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <button onClick={() => setAddStep(2)} disabled={!empForm.name || !empForm.nationality || !empForm.mobile || !empForm.jobTitle} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold disabled:opacity-50">Next: Documents <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                  </div>
                </div>
              )}

              {addStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed text-center">
                     <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                     <p className="font-bold text-slate-700">Upload Identity Document (Passport/EID)</p>
                     <p className="text-xs text-slate-500 mb-4">PDF, JPG, PNG up to 5MB</p>
                     <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold shadow-sm">Browse Files</button>
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1">Document Expiry Date *</label>
                    <input type="date" value={empForm.docExpiry} onChange={e => setEmpForm({...empForm, docExpiry: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setAddStep(1)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                    <button onClick={() => setAddStep(3)} disabled={!empForm.docExpiry} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold disabled:opacity-50">Next: Photo <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                  </div>
                </div>
              )}

              {addStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-center">
                     <div className="w-32 h-32 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white shadow-md">
                       <Camera className="w-8 h-8 text-slate-400" />
                     </div>
                     <p className="font-bold text-slate-700 mb-4">Take Live Photo</p>
                     <button className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 mx-auto"><Camera className="w-4 h-4"/> Capture Now</button>
                  </div>
                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setAddStep(2)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                    <button onClick={submitEmployee} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Submit for Approval</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASS REQUESTS TAB */}
          {activeTab === 'passes' && (
            <div className="animate-in fade-in">
              {passStep === 0 && (
                <div>
                  <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-xl font-bold">Pass Requests</h3>
                    <button onClick={() => {setPassStep(1); setSelectedEmps([]); setPeriodError(''); setHseStatus('Not Started'); setDeclaration(false); setSignature('');}} className="bg-hct-blue text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800"><Plus className="w-5 h-5"/> Create Pass Request</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="border border-slate-200 rounded-xl p-4 bg-slate-50"><p className="text-sm text-slate-500 font-bold uppercase">Total Requests</p><p className="text-2xl font-bold">{passRequests.length}</p></div>
                     <div className="border border-amber-200 rounded-xl p-4 bg-amber-50"><p className="text-sm text-amber-600 font-bold uppercase">Pending</p><p className="text-2xl font-bold text-amber-700">{passRequests.filter(r => r.status.includes('Pending')).length}</p></div>
                     <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50"><p className="text-sm text-emerald-600 font-bold uppercase">Approved</p><p className="text-2xl font-bold text-emerald-700">{passRequests.filter(r => r.status === 'Approved').length}</p></div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr><th className="p-4 font-bold uppercase">Request ID</th><th className="p-4 font-bold uppercase">Employees</th><th className="p-4 font-bold uppercase">Visit Period</th><th className="p-4 font-bold uppercase">Status</th><th className="p-4 font-bold uppercase text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {passRequests.map(req => (
                          <tr key={req.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold">{req.id}<div className="text-xs text-slate-500 font-normal">Sub: {req.submissionDate}</div></td>
                            <td className="p-4 font-medium">{req.employees} Staff</td>
                            <td className="p-4"><p className="text-xs">{req.start}</p><p className="text-xs">{req.end}</p></td>
                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span></td>
                            <td className="p-4 text-right">
                              {req.status === 'Approved' ? (
                                <button onClick={() => setShowPassViewer(true)} className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1 ml-auto hover:bg-emerald-100"><QrCode className="w-4 h-4"/> View Passes</button>
                              ) : (
                                <button className="text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-200">View</button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Wizard Steps */}
              {passStep > 0 && passStep < 5 && (
                <div>
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-2xl font-bold flex items-center gap-2"><FileSignature className="w-6 h-6 text-hct-blue" /> New Pass Request</h3>
                     <button onClick={() => setPassStep(0)} className="text-slate-500 font-bold hover:underline">Cancel</button>
                   </div>
                   
                   {/* Step 1: Select Employees */}
                   {passStep === 1 && (
                     <div className="space-y-6">
                       <div className="flex justify-between items-center border-b pb-4">
                         <h4 className="font-bold text-lg text-slate-700">1. Select Approved Employees</h4>
                         <div className="flex gap-4">
                           <button onClick={() => setSelectedEmps(employees.filter(e => e.status === 'Approved').map(e => e.id))} className="text-sm font-bold text-blue-600 hover:underline">Select All</button>
                           <button onClick={() => setSelectedEmps([])} className="text-sm font-bold text-slate-500 hover:underline">Clear</button>
                         </div>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         {employees.filter(e => e.status === 'Approved').map(emp => (
                           <div key={emp.id} onClick={() => toggleEmpSelect(emp.id)} className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex gap-4 items-center ${selectedEmps.includes(emp.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                             <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${selectedEmps.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
                               {selectedEmps.includes(emp.id) && <Check className="w-4 h-4"/>}
                             </div>
                             <div><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.jobTitle}</p></div>
                           </div>
                         ))}
                         {employees.filter(e => e.status === 'Approved').length === 0 && <p className="text-slate-500 italic col-span-full">No approved employees available for pass request.</p>}
                       </div>

                       <div className="flex justify-between items-center pt-6 border-t">
                         <p className="font-bold text-slate-700">{selectedEmps.length} Employees Selected</p>
                         <button onClick={() => {if(selectedEmps.length > 0) setPassStep(2); else alert('Select at least one employee');}} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold flex items-center gap-2">Visit Period <ArrowRight className="w-4 h-4"/></button>
                       </div>
                     </div>
                   )}

                   {/* Step 2: Visit Period */}
                   {passStep === 2 && (
                     <div className="space-y-6 max-w-2xl mx-auto">
                       <h4 className="font-bold text-lg text-slate-700 border-b pb-4">2. Requested Visit Period</h4>
                       {periodError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 shrink-0" /><p className="font-bold text-sm">{periodError}</p></div>}
                       
                       <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                         <div>
                           <label className="text-sm font-bold block mb-1">Start Date *</label>
                           <input type="date" value={visitPeriod.startDate} onChange={(e) => setVisitPeriod({...visitPeriod, startDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                         </div>
                         <div>
                           <label className="text-sm font-bold block mb-1">Start Time *</label>
                           <input type="time" value={visitPeriod.startTime} onChange={(e) => setVisitPeriod({...visitPeriod, startTime: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                         </div>
                         <div>
                           <label className="text-sm font-bold block mb-1">End Date *</label>
                           <input type="date" value={visitPeriod.endDate} onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                         </div>
                         <div>
                           <label className="text-sm font-bold block mb-1">End Time *</label>
                           <input type="time" value={visitPeriod.endTime} onChange={(e) => setVisitPeriod({...visitPeriod, endTime: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                         </div>
                       </div>
                       
                       <div className="flex justify-between pt-6 border-t">
                         <button onClick={() => setPassStep(1)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                         <button onClick={handlePeriodNext} disabled={!visitPeriod.startDate || !visitPeriod.startTime || !visitPeriod.endDate || !visitPeriod.endTime} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold disabled:opacity-50">Next: HSE <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                       </div>
                     </div>
                   )}

                   {/* Step 3: HSE & Declaration */}
                   {passStep === 3 && (
                     <div className="space-y-8 max-w-3xl mx-auto">
                       <div>
                         <h4 className="font-bold text-lg text-slate-700 border-b pb-4 mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-600"/> 3. HSE Training & Acknowledgment</h4>
                         
                         <div className="bg-slate-900 rounded-2xl h-64 mb-4 flex flex-col items-center justify-center text-white relative">
                            {hseStatus === 'Completed' ? (
                              <div className="text-emerald-400 flex flex-col items-center"><CheckCircle2 className="w-16 h-16 mb-2"/> <p className="font-bold">Training Completed</p></div>
                            ) : hseStatus === 'In Progress' ? (
                              <div className="text-blue-400 flex flex-col items-center animate-pulse"><Video className="w-16 h-16 mb-2"/> <p className="font-bold">Playing Video...</p></div>
                            ) : (
                              <button onClick={simulateHseVideo} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold flex items-center gap-2"><Video className="w-5 h-5"/> Watch HSE Video</button>
                            )}
                         </div>
                         <button className="text-blue-600 font-bold hover:underline flex items-center gap-1 text-sm"><FileText className="w-4 h-4"/> Download HSE Document</button>
                       </div>

                       <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                         <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5"/> Contractor Declaration</h4>
                         <p className="text-sm text-slate-600 mb-4 italic">"I hereby confirm that all employees included in this pass request are authorized to work under the registered contractor company. I confirm that the information provided is accurate and that all employees will comply with the applicable site safety, security, and HSE requirements."</p>
                         
                         <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${declaration ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-300'}`}>
                           <input type="checkbox" checked={declaration} onChange={() => setDeclaration(!declaration)} className="mt-1 w-5 h-5" />
                           <span className="font-bold text-slate-800 text-sm">I agree to the above declaration and confirm I have read and understood the HSE guidelines.</span>
                         </label>
                         
                         {declaration && (
                           <div className="mt-4">
                             <label className="text-xs font-bold text-slate-500 uppercase">Digital Signature (Name)</label>
                             <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name to sign" className="w-full p-3 border-b-2 border-slate-300 outline-none focus:border-hct-blue bg-transparent font-medium" />
                           </div>
                         )}
                       </div>

                       <div className="flex justify-between pt-6 border-t">
                         <button onClick={() => setPassStep(2)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                         <button onClick={() => {if(hseStatus === 'Completed' && declaration && signature) setPassStep(4); else alert('Complete HSE, accept declaration and sign.');}} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold">Review Request <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                       </div>
                     </div>
                   )}

                   {/* Step 4: Review */}
                   {passStep === 4 && (
                     <div className="space-y-6 max-w-4xl mx-auto">
                       <h4 className="font-bold text-xl text-center border-b pb-4 mb-6">Review Pass Request</h4>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                           <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Contractor Details</h5>
                           <div className="text-sm space-y-2">
                             <p className="grid grid-cols-2"><span className="text-slate-500">Company</span><strong className="text-slate-800">{companyInfo.name}</strong></p>
                             <p className="grid grid-cols-2"><span className="text-slate-500">Contract No</span><strong className="text-slate-800">{companyInfo.contractNumber}</strong></p>
                           </div>
                         </div>
                         <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                           <h5 className="font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Requested Visit Period</h5>
                           <div className="text-sm space-y-2">
                             <p className="grid grid-cols-2"><span className="text-slate-600">Start</span><strong className="text-slate-800">{visitPeriod.startDate} {visitPeriod.startTime}</strong></p>
                             <p className="grid grid-cols-2"><span className="text-slate-600">End</span><strong className="text-slate-800">{visitPeriod.endDate} {visitPeriod.endTime}</strong></p>
                           </div>
                         </div>
                       </div>

                       <div className="bg-white p-6 rounded-2xl border border-slate-200">
                         <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Selected Employees ({selectedEmps.length})</h5>
                         <table className="w-full text-sm text-left">
                           <thead><tr className="text-slate-500 border-b"><th>Name</th><th>ID</th><th>Nationality</th></tr></thead>
                           <tbody>
                             {selectedEmps.map(id => {
                               const emp = employees.find(e => e.id === id);
                               return <tr key={id} className="border-b last:border-0"><td className="py-2 font-bold">{emp.name}</td><td className="py-2">{emp.id}</td><td className="py-2">{emp.nationality}</td></tr>;
                             })}
                           </tbody>
                         </table>
                       </div>

                       <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-center justify-between">
                         <div>
                           <p className="font-bold text-emerald-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> HSE & Declaration Completed</p>
                           <p className="text-sm text-emerald-600 mt-1">Signed by: {signature}</p>
                         </div>
                       </div>

                       <div className="flex justify-end gap-4 pt-6 border-t">
                         <button onClick={() => setPassStep(3)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold hover:bg-slate-200">Edit</button>
                         <button onClick={submitPassRequest} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">Submit Pass Request</button>
                       </div>
                     </div>
                   )}
                </div>
              )}

              {/* Success */}
              {passStep === 5 && (
                 <div className="text-center py-12 animate-in zoom-in-95">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                   <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Pass Request Submitted!</h3>
                   <p className="text-slate-500 max-w-md mx-auto mb-6">Your pass request has been successfully submitted for {selectedEmps.length} employees and is pending approval.</p>
                   <p className="text-2xl font-bold text-hct-blue mb-8">{passRequests[0].id}</p>
                   <button onClick={() => {setPassStep(0); setActiveTab('passes');}} className="px-8 py-3 bg-slate-100 rounded-xl font-bold hover:bg-slate-200">Return to Requests</button>
                 </div>
              )}
            </div>
          )}
          
        </div>
      </div>
      
      <AnimatePresence>
        {showPassViewer && <PassViewer onClose={() => setShowPassViewer(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContractorPortal;
