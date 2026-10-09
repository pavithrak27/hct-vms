import React, { useState } from 'react';
import { Plus, Search, Building2, Users, FileSignature, CheckCircle2, ArrowRight, AlertCircle, Video, FileText, CheckSquare, ShieldCheck, Check, QrCode, Printer, Download, Eye, X, RefreshCw, MapPin, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../context/RoleContext';

const AdminPassRequests = () => {
  const { sessionUser } = useRole();
  const isSuperAdmin = sessionUser?.role === 'superadmin';
  const [activeView, setActiveView] = useState('list'); // 'list' or 'wizard'
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const isContractor = sessionUser?.role === 'contractor';
  // Dummy data for pass requests
  const [allRequests, setRequests] = useState([
    {
      id: 'CPR-2026-0001',
      company: 'Tech Solutions LLC',
      employees: 2,
      requestedStart: '10-Oct-2026 08:00 AM',
      requestedEnd: '15-Oct-2026 06:00 PM',
      approvedStart: '10-Oct-2026 08:00 AM',
      approvedEnd: '13-Oct-2026 06:00 PM',
      submissionDate: '2026-10-01',
      level: 2,
      status: 'Approved'
    },
    {
      id: 'CPR-2026-0002',
      company: 'Global Facilities Mgt',
      employees: 5,
      requestedStart: '12-Oct-2026 07:00 AM',
      requestedEnd: '20-Oct-2026 07:00 PM',
      approvedStart: '-',
      approvedEnd: '-',
      submissionDate: '2026-10-04',
      level: 1,
      status: 'Pending Level 1 Approval'
    }
  ]);

  const requests = isContractor 
    ? allRequests.filter(r => r.company === sessionUser.companyId)
    : allRequests;

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState({ startDate: '', endDate: '' });
  const [periodError, setPeriodError] = useState('');
  const [hseStatus, setHseStatus] = useState('Not Started');
  const [declaration, setDeclaration] = useState(false);

  // Generated passes state
  const [passes, setPasses] = useState([
    {
      passId: 'PASS-00125',
      reqId: 'CPR-2026-0001',
      empName: 'John Smith',
      empId: 'EMP-CT-001',
      company: 'Tech Solutions LLC',
      validFrom: '10-Oct-2026 08:00 AM',
      validTo: '13-Oct-2026 06:00 PM',
      status: 'Active',
      photo: 'https://i.pravatar.cc/300?img=11'
    },
    {
      passId: 'PASS-00126',
      reqId: 'CPR-2026-0001',
      empName: 'Ravi Kumar',
      empId: 'EMP-CT-002',
      company: 'Tech Solutions LLC',
      validFrom: '01-Jan-2023 08:00 AM',
      validTo: '31-Dec-2023 06:00 PM',
      status: 'Expired',
      photo: 'https://i.pravatar.cc/300?img=52'
    }
  ]);
  const [selectedPass, setSelectedPass] = useState(null);
  const [renewModalData, setRenewModalData] = useState(null); // holds pass to renew
  const [viewEmployee, setViewEmployee] = useState(null);
  
  // Transfer Visitor modal state
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferPassData, setTransferPassData] = useState(null);
  const [transferCampus, setTransferCampus] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [transferNotes, setTransferNotes] = useState('');
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);
  
  const contractors = [
    { id: 'CON-2026-101', name: 'Tech Solutions LLC', contractNumber: 'CT-2025-9981', expiry: '2027-11-01', valid: true },
    { id: 'CON-2026-102', name: 'Global Facilities Mgt', contractNumber: 'FM-2026-1122', expiry: '2028-10-14', valid: true }
  ];

  const employeesData = {
    'CON-2026-101': [
      { id: 'EMP-CT-001', name: 'John Smith', nationality: 'UK', docExpiry: '2027-12-31', status: 'Approved', role: 'Technician', mobile: '+971 50 123 4567', email: 'john@techsolutions.com', document: 'Passport.pdf' },
      { id: 'EMP-CT-002', name: 'Ravi Kumar', nationality: 'India', docExpiry: '2027-05-15', status: 'Approved', role: 'Engineer', mobile: '+971 55 987 6543', email: 'ravi@techsolutions.com', document: 'Emirates_ID.pdf' },
    ],
    'CON-2026-102': [
      { id: 'EMP-GF-001', name: 'Maria Garcia', nationality: 'Philippines', docExpiry: '2028-01-01', status: 'Approved', role: 'Cleaner', mobile: '+971 56 111 2222', email: 'maria@globalfm.com', document: 'Visa_Copy.pdf' },
      { id: 'EMP-GF-002', name: 'Ahmed Hassan', nationality: 'Egypt', docExpiry: '2028-01-01', status: 'Approved', role: 'Security', mobile: '+971 54 333 4444', email: 'ahmed@globalfm.com', document: 'Passport.pdf' }
    ]
  };

  const handlePeriodNext = () => {
    if (!visitPeriod.startDate || !visitPeriod.endDate || !visitPeriod.campus) { setPeriodError('Please fill in all date fields.'); return; }
    setPeriodError('');
    setWizardStep(4);
  };

  const submitPassRequest = () => {
    const newReq = {
      id: `CPR-2026-${Math.floor(Math.random()*900)+100}`,
      company: selectedCompany.name,
      employees: selectedEmps.length,
      requestedStart: visitPeriod.startDate,
      requestedEnd: visitPeriod.endDate,
      approvedStart: '-',
      approvedEnd: '-',
      submissionDate: new Date().toISOString().split('T')[0],
      level: 1,
      status: 'Pending Level 1 Approval'
    };
    setRequests([newReq, ...requests]);
    setActiveView('list');
    
    // reset wizard
    setWizardStep(1);
    setSelectedCompany(null);
    setSelectedEmps([]);
    setVisitPeriod({ startDate: '', endDate: '' });
    setHseStatus('Not Started');
    setDeclaration(false);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferCampus || !transferDate) {
      alert("Please select campus and effective date.");
      return;
    }
    setShowTransferModal(false);
    setShowTransferSuccess(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Pass Requests</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage and create gate pass requests on behalf of contractors.</p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setActiveView('wizard')} className="px-5 py-2.5 rounded-2xl font-bold text-xs transition-all border-2 border-hct-blue bg-hct-blue text-white shadow-lg shadow-blue-900/20 flex items-center gap-2 hover:bg-[#001a66]">
            <Plus className="w-4 h-4" /> Create Pass Request
          </button>
        )}
      </div>

      {activeView === 'list' ? (
        <div className="space-y-6">
          {!selectedRequest ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm"><p className="text-slate-500 text-xs font-bold uppercase mb-1">Total Requests</p><p className="text-2xl font-black text-slate-800">{requests.length}</p></div>
             <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center shadow-sm"><p className="text-amber-700 text-xs font-bold uppercase mb-1">Pending Approval</p><p className="text-2xl font-black text-amber-600">{requests.filter(r=>r.status.includes('Pending')).length}</p></div>
             <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm"><p className="text-emerald-700 text-xs font-bold uppercase mb-1">Approved</p><p className="text-2xl font-black text-emerald-600">{requests.filter(r=>r.status==='Approved').length}</p></div>
          </div>

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search pass requests..." className="pl-9 p-2 rounded-lg border border-slate-300 w-64 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>
             </div>
             
             <table className="w-full text-left text-sm">
               <thead className="bg-white border-b border-slate-200 text-slate-500">
                 <tr>
                   <th className="p-4 font-bold uppercase">Pass Request ID</th>
                   <th className="p-4 font-bold uppercase">Contractor Company</th>
                   <th className="p-4 font-bold uppercase text-center">Employees</th>
                   <th className="p-4 font-bold uppercase">Requested Period</th>
                   <th className="p-4 font-bold uppercase">Approved Period</th>
                   <th className="p-4 font-bold uppercase">Status</th>
                   <th className="p-4 font-bold uppercase"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 bg-white">
                 {requests.map(req => (
                   <tr key={req.id} onClick={() => setSelectedRequest(req)} className="hover:bg-slate-50 cursor-pointer">
                     <td className="p-4 font-bold text-slate-800">{req.id}<div className="text-xs text-slate-500 font-normal mt-1">Submitted: {req.submissionDate}</div></td>
                     <td className="p-4 font-medium text-slate-700">{req.company}</td>
                     <td className="p-4 text-center font-bold">{req.employees}</td>
                     <td className="p-4 text-xs text-slate-600 leading-tight">Start: {req.requestedStart}<br/>End: {req.requestedEnd}</td>
                     <td className="p-4 text-xs font-bold text-blue-700 leading-tight">{req.approvedStart !== '-' ? `Start: ${req.approvedStart}` : '-'}<br/>{req.approvedEnd !== '-' ? `End: ${req.approvedEnd}` : ''}</td>
                     <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span></td>
                     <td className="p-4 text-right"><ArrowRight className="w-5 h-5 text-slate-400 inline-block"/></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
          </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setSelectedRequest(null)} className="text-slate-500 hover:text-hct-blue font-bold flex items-center gap-1 transition-colors">
                  <ArrowRight className="w-4 h-4 rotate-180"/> Back to Requests
                </button>
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">Generated Passes: {selectedRequest.company}</h3>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search by Pass ID, Name, Company..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Download className="w-4 h-4"/> Download PDFs</button>
                  </div>
                </div>

                <table className="w-full text-left text-sm">
                  <thead className="bg-white border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="p-4 font-bold uppercase w-10"></th>
                      <th className="p-4 font-bold uppercase">Pass ID & Status</th>
                      <th className="p-4 font-bold uppercase">Employee</th>
                      <th className="p-4 font-bold uppercase">Company</th>
                      <th className="p-4 font-bold uppercase">Validity Period</th>
                      <th className="p-4 font-bold uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {passes.filter(p => p.company === selectedRequest.company).map(pass => (
                      <tr key={pass.passId} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4"><input type="checkbox" className="w-4 h-4" /></td>
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{pass.passId}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${pass.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{pass.status}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={pass.photo} alt={pass.empName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                            <div><p className="font-bold text-slate-800">{pass.empName}</p><p className="text-xs text-slate-500">{pass.empId}</p></div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{pass.company}</td>
                        <td className="p-4 text-xs text-slate-600 leading-tight">From: {pass.validFrom}<br/>To: {pass.validTo}</td>
                        <td className="p-4 text-right flex items-center justify-end gap-2">
                          <button onClick={() => setSelectedPass(pass)} title="View Pass" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-5 h-5"/></button>
                          <button title="Download PDF" className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download className="w-5 h-5"/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto min-h-[600px]">
           <div className="flex justify-between items-center mb-8 border-b pb-4">
             <h3 className="text-2xl font-bold flex items-center gap-2"><FileSignature className="w-6 h-6 text-hct-blue" /> Create Pass Request</h3>
             <button onClick={() => setActiveView('list')} className="text-slate-500 font-bold hover:underline">Cancel & Return</button>
           </div>
           
           {/* Step 1: Select Contractor */}
           {wizardStep === 1 && (
             <div className="space-y-6">
               <h4 className="font-bold text-lg text-slate-700 border-b pb-2">1. Select Contractor Company</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {contractors.map(c => (
                   <div key={c.id} onClick={() => setSelectedCompany(c)} className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${selectedCompany?.id === c.id ? 'border-hct-blue bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                     <div className="flex justify-between items-start mb-2">
                       <h5 className="font-bold text-slate-800 text-lg">{c.name}</h5>
                       {selectedCompany?.id === c.id && <CheckCircle2 className="w-6 h-6 text-hct-blue" />}
                     </div>
                     <p className="text-sm text-slate-500 mb-1">Contract No: {c.contractNumber}</p>
                     <p className="text-sm text-emerald-600 font-bold">Valid until {c.expiry}</p>
                   </div>
                 ))}
               </div>
               <div className="flex justify-end pt-6 border-t">
                 <button onClick={() => {if(selectedCompany) setWizardStep(2); else alert('Select a contractor');}} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold flex items-center gap-2">Select Employees <ArrowRight className="w-4 h-4"/></button>
               </div>
             </div>
           )}

           {/* Step 2: Select Employees */}
           {wizardStep === 2 && (
             <div className="space-y-6">
               <div className="flex justify-between items-center border-b pb-4">
                 <div>
                   <h4 className="font-bold text-lg text-slate-700">2. Select Employees</h4>
                   <p className="text-sm text-slate-500">{selectedCompany.name}</p>
                 </div>
                 <div className="flex gap-4">
                   <button onClick={() => setSelectedEmps(employeesData[selectedCompany.id].map(e=>e.id))} className="text-sm font-bold text-blue-600 hover:underline">Select All</button>
                   <button onClick={() => setSelectedEmps([])} className="text-sm font-bold text-slate-500 hover:underline">Clear All</button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {employeesData[selectedCompany.id].map(emp => (
                   <div key={emp.id} onClick={() => {
                     if(selectedEmps.includes(emp.id)) setSelectedEmps(selectedEmps.filter(id=>id!==emp.id));
                     else setSelectedEmps([...selectedEmps, emp.id]);
                   }} className={`border-2 rounded-xl p-4 cursor-pointer transition-all flex gap-4 items-center ${selectedEmps.includes(emp.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}>
                     <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${selectedEmps.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
                       {selectedEmps.includes(emp.id) && <Check className="w-4 h-4"/>}
                     </div>
                     <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-800 dark:text-white">{emp.name}</p>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 px-1.5 py-0.5 rounded font-bold">{emp.id}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1.5">
                          <div className="text-xs text-slate-500">
                            <p><span className="font-bold text-slate-400">Role:</span> {emp.role}</p>
                            <p><span className="font-bold text-slate-400">Nationality:</span> {emp.nationality}</p>
                          </div>
                          <div className="text-xs text-slate-500">
                            <p><span className="font-bold text-slate-400">Mobile:</span> {emp.mobile}</p>
                            <p><span className="font-bold text-slate-400">Email:</span> {emp.email}</p>
                          </div>
                        </div>
                     </div>
                     <div className="ml-auto shrink-0 self-start">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Viewing document: ${emp.document || 'Document.pdf'}`); }} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-100 shadow-sm">
                          <FileText className="w-3.5 h-3.5" /> View Document
                        </button>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="flex justify-between items-center pt-6 border-t">
                 <button onClick={() => setWizardStep(1)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                 <button onClick={() => {if(selectedEmps.length > 0) setWizardStep(3); else alert('Select at least one employee');}} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold flex items-center gap-2">Visit Period <ArrowRight className="w-4 h-4"/></button>
               </div>
             </div>
           )}

                      {/* Step 3: Visit Period */}
           {wizardStep === 3 && (
             <div className="space-y-6 max-w-2xl mx-auto">
               <h4 className="font-bold text-lg text-slate-700 border-b pb-4">3. Requested Visit Period</h4>
               {periodError && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3"><AlertCircle className="w-5 h-5 shrink-0" /><p className="font-bold text-sm">{periodError}</p></div>}
               
               <div className="space-y-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <div>
                   <label className="text-sm font-bold block mb-1 text-slate-700">Target Campus *</label>
                   <select 
                     value={visitPeriod.campus || "Dubai Men's College"} 
                     onChange={(e) => setVisitPeriod({...visitPeriod, campus: e.target.value})}
                     className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue bg-white font-semibold text-slate-800 text-sm"
                   >
                     <option value="Abu Dhabi Men's College">Abu Dhabi Men's College</option>
                     <option value="Abu Dhabi Women's College">Abu Dhabi Women's College</option>
                     <option value="Al Ain Men's College">Al Ain Men's College</option>
                     <option value="Al Ain Women's College">Al Ain Women's College</option>
                     <option value="Dubai Men's College">Dubai Men's College</option>
                     <option value="Dubai Women's College">Dubai Women's College</option>
                     <option value="Fujairah Men's College">Fujairah Men's College</option>
                     <option value="Fujairah Women's College">Fujairah Women's College</option>
                     <option value="Ras Al Khaimah Men's College">Ras Al Khaimah Men's College</option>
                     <option value="Ras Al Khaimah Women's College">Ras Al Khaimah Women's College</option>
                     <option value="Sharjah Men's College">Sharjah Men's College</option>
                     <option value="Sharjah Women's College">Sharjah Women's College</option>
                   </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div><label className="text-sm font-bold block mb-1">Start Date *</label><input type="date" value={visitPeriod.startDate} onChange={(e) => setVisitPeriod({...visitPeriod, startDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
                   <div><label className="text-sm font-bold block mb-1">End Date *</label><input type="date" value={visitPeriod.endDate} onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
                 </div>
               </div>
               
               <div className="flex justify-between pt-6 border-t">
                 <button onClick={() => setWizardStep(2)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                 <button onClick={handlePeriodNext} disabled={!visitPeriod.startDate || !visitPeriod.endDate || !visitPeriod.campus} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold">Next: HSE <ArrowRight className="inline w-4 h-4 ml-1"/></button>
               </div>
             </div>
           )}

            {/* Step 4: HSE & Declaration */}
           {wizardStep === 4 && (
             <div className="space-y-8 max-w-3xl mx-auto">
               <div>
                 <h4 className="font-bold text-lg text-slate-700 border-b pb-4 mb-4 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-600"/> 4. HSE Verification</h4>
                 <div className="bg-slate-900 rounded-2xl h-48 mb-4 flex flex-col items-center justify-center text-white">
                    {hseStatus === 'Completed' ? (
                      <div className="text-emerald-400 flex flex-col items-center"><CheckCircle2 className="w-12 h-12 mb-2"/> <p className="font-bold">Training Verified by Admin</p></div>
                    ) : (
                      <button onClick={() => setHseStatus('Completed')} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> Verify Contractor HSE Completion</button>
                    )}
                 </div>
               </div>

               <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                 <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5"/> Admin Override Declaration</h4>
                 <p className="text-sm text-amber-700 mb-4 italic">"I confirm that all employees included in this pass request are authorized to work under the registered contractor company and will comply with all site security and HSE requirements. <strong>This request is submitted by an Administrator on behalf of the contractor.</strong>"</p>
                 
                 <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${declaration ? 'bg-amber-100 border-amber-500' : 'bg-white border-amber-300'}`}>
                   <input type="checkbox" checked={declaration} onChange={() => setDeclaration(!declaration)} className="mt-1 w-5 h-5" />
                   <span className="font-bold text-amber-900 text-sm">I agree to the above declaration.</span>
                 </label>
               </div>

               <div className="flex justify-between pt-6 border-t">
                 <button onClick={() => setWizardStep(3)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                 <button onClick={() => {if(hseStatus === 'Completed' && declaration) setWizardStep(5); else alert('Complete HSE verification and accept declaration.');}} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold">Review Request <ArrowRight className="inline w-4 h-4 ml-1"/></button>
               </div>
             </div>
           )}

           {/* Step 5: Review */}
           {wizardStep === 5 && (
             <div className="space-y-6 max-w-4xl mx-auto">
               <h4 className="font-bold text-xl text-center border-b pb-4 mb-6">Review Pass Request</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                   <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Contractor Details</h5>
                   <p className="grid grid-cols-2 text-sm mb-2"><span className="text-slate-500">Company</span><strong className="text-slate-800">{selectedCompany.name}</strong></p>
                   <p className="grid grid-cols-2 text-sm"><span className="text-slate-500">Contract No</span><strong className="text-slate-800">{selectedCompany.contractNumber}</strong></p>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                   <h5 className="font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Requested Visit Period</h5>
                   <p className="grid grid-cols-2 text-sm mb-2"><span className="text-slate-600">Start</span><strong className="text-slate-800">{visitPeriod.startTime}</strong></p>
                   <p className="grid grid-cols-2 text-sm"><span className="text-slate-600">End</span><strong className="text-slate-800">{visitPeriod.endTime}</strong></p>
                 </div>
               </div>

               <div className="bg-white p-6 rounded-2xl border border-slate-200">
                 <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Selected Employees ({selectedEmps.length})</h5>
                 <table className="w-full text-sm text-left">
                   <thead><tr className="text-slate-500 border-b"><th>Name</th><th>ID</th></tr></thead>
                   <tbody>
                     {selectedEmps.map(id => {
                       const emp = employeesData[selectedCompany.id].find(e => e.id === id);
                       return <tr key={id} className="border-b last:border-0"><td className="py-2 font-bold">{emp.name}</td><td className="py-2">{emp.id}</td></tr>;
                     })}
                   </tbody>
                 </table>
               </div>

               <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-800 text-sm font-bold flex items-center gap-2">
                 <AlertCircle className="w-5 h-5"/> Submitted on behalf of contractor.
               </div>

               <div className="flex justify-end gap-4 pt-6 border-t">
                 <button onClick={() => setWizardStep(4)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Edit</button>
                 <button onClick={submitPassRequest} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">Submit Pass Request</button>
               </div>
             </div>
           )}
        </div>
      )}
      {/* Generated Pass Modal */}
      {selectedPass && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[100] p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl relative">
             <button onClick={() => setSelectedPass(null)} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/20 rounded-full p-1"><X className="w-5 h-5"/></button>
             
             <div className="bg-[#00249c] p-6 text-white text-center">
               <h2 className="text-xl font-black tracking-tight mb-1">VISITOR / CONTRACTOR PASS</h2>
               <p className="text-blue-200 font-medium tracking-widest text-[10px] uppercase">HCT Campus Security</p>
             </div>
             
             <div className="p-6">
               <div className="flex gap-4 items-center mb-6 border-b pb-4">
                  <img src={selectedPass.photo} alt={selectedPass.empName} className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200" />
                  <div>
                    <p className="text-xl font-black text-slate-800">{selectedPass.empName}</p>
                    <p className="text-sm font-bold text-slate-500">{selectedPass.empId}</p>
                    <p className="text-sm font-medium text-slate-600">{selectedPass.company}</p>
                  </div>
               </div>

               <div className="flex justify-center mb-6">
                  <div className="bg-slate-50 p-2 rounded-xl shadow-sm border border-slate-200"><QrCode className="w-40 h-40 text-slate-800" /></div>
               </div>

               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm mb-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div><p className="text-xs font-bold text-slate-400 uppercase">Pass ID</p><p className="font-bold">{selectedPass.passId}</p></div>
                   <div><p className="text-xs font-bold text-slate-400 uppercase">Status</p><p className="font-bold text-emerald-600">{selectedPass.status}</p></div>
                   <div className="col-span-2"><p className="text-xs font-bold text-slate-400 uppercase">Valid From</p><p className="font-bold">{selectedPass.validFrom}</p></div>
                   <div className="col-span-2"><p className="text-xs font-bold text-slate-400 uppercase">Valid Until</p><p className="font-bold">{selectedPass.validTo}</p></div>
                 </div>
               </div>
               
               <div className="flex gap-2">
                 
                 <button className="flex-1 bg-hct-blue hover:bg-blue-800 text-white py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Download PDF</button>
               </div>
             </div>
          </motion.div>
        </div>
      )}

      {/* Renew Modal */}
      <AnimatePresence>
        {renewModalData && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[24px] max-w-2xl w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Renew Pass / Contract</h2>
                  <p className="text-sm text-slate-500 mt-1">Select the new validity dates for {renewModalData.passId ? 'Pass ' + renewModalData.passId : 'the selected entity'}.</p>
                </div>
                <button onClick={() => setRenewModalData(null)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contract Start <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue focus:border-transparent text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contract Expiry <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue focus:border-transparent text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Gate Pass Valid From <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue focus:border-transparent text-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Gate Pass Valid To <span className="text-red-500">*</span></label>
                    <input type="date" className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue focus:border-transparent text-slate-700 font-medium" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setRenewModalData(null)} className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">Cancel</button>
                <button onClick={() => {
                  alert('Renewal dates saved successfully!');
                  setRenewModalData(null);
                }} className="px-6 py-2.5 rounded-xl font-bold text-white bg-hct-blue hover:bg-blue-800 shadow-sm transition-colors flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Save Renewal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* View Employee Details Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[120] p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setViewEmployee(null)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold mb-6">Employee Details</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src={viewEmployee.photo || `https://ui-avatars.com/api/?name=${viewEmployee.name}&background=random`} alt={viewEmployee.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
              <div>
                <p className="font-bold text-lg text-slate-800">{viewEmployee.name}</p>
                <p className="text-sm text-slate-500">{viewEmployee.id} • {viewEmployee.nationality || 'Nationality N/A'}</p>
                <p className="text-sm text-slate-500">{viewEmployee.mobile || 'Mobile N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Identity Documents</h4>
              {viewEmployee.document ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <FileText className="w-5 h-5 text-hct-blue" />
                  <span className="font-bold text-slate-700 flex-1">{viewEmployee.document}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Valid</span>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No documents available.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Transfer Visitor Modal */}
      {showTransferModal && transferPassData && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden z-10">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-hct-blue" />
                Transfer Visitor
              </h3>
              <button 
                type="button"
                onClick={() => setShowTransferModal(false)} 
                className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Transfer visitor <span className="font-bold text-slate-900 dark:text-white">{transferPassData.empName}</span> to another campus.
              </p>
              
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Select Campus *</label>
                <select 
                  required 
                  value={transferCampus} 
                  onChange={(e) => setTransferCampus(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm font-semibold"
                >
                  <option value="">Select Campus</option>
                  <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                  <option value="Abu Dhabi Women's Campus">Abu Dhabi Women's Campus</option>
                  <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                  <option value="Dubai Women's Campus">Dubai Women's Campus</option>
                  <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
                  <option value="Al Ain Campus">Al Ain Campus</option>
                  <option value="Fujairah Campus">Fujairah Campus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Select Date *</label>
                <input 
                  required 
                  type="date" 
                  min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} 
                  value={transferDate} 
                  onChange={(e) => setTransferDate(e.target.value)} 
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm font-medium" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Notes</label>
                <textarea 
                  rows="3" 
                  value={transferNotes} 
                  onChange={(e) => setTransferNotes(e.target.value)} 
                  placeholder="Add any specific instructions or reasons for transfer..." 
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm resize-none"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)} 
                  className="flex-1 py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold bg-white dark:bg-slate-800 hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 px-4 rounded-2xl bg-[#001a66] hover:bg-[#001144] text-white font-bold transition-colors shadow-md text-sm"
                >
                  Transfer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Transfer Success Modal */}
      {showTransferSuccess && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferSuccess(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-8 text-center overflow-hidden z-10">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 dark:border-emerald-900/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Transfer Successful!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Visitor <span className="font-bold text-slate-700 dark:text-slate-300">{transferPassData?.empName}</span> has been transferred to <span className="font-bold text-slate-700 dark:text-slate-300">{transferCampus}</span> on <span className="font-bold text-slate-700 dark:text-slate-300">{transferDate}</span>.
            </p>
            <button onClick={() => setShowTransferSuccess(false)} className="w-full py-3 rounded-xl bg-[#001a66] text-white font-bold hover:bg-[#001144] transition-colors">
              Done
            </button>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default AdminPassRequests;







