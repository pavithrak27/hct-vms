import React, { useState } from 'react';
import { Plus, Search, Building2, Users, FileSignature, CheckCircle2, ArrowRight, AlertCircle, Video, FileText, CheckSquare, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPassRequests = () => {
  const [activeView, setActiveView] = useState('list'); // 'list' or 'wizard'
  
  // Dummy data for list view
  const [requests, setRequests] = useState([
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

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState({ startDate: '', startTime: '', endDate: '', endTime: '' });
  const [periodError, setPeriodError] = useState('');
  const [hseStatus, setHseStatus] = useState('Not Started');
  const [declaration, setDeclaration] = useState(false);
  
  const contractors = [
    { id: 'CON-2026-101', name: 'Tech Solutions LLC', contractNumber: 'CT-2025-9981', expiry: '2027-11-01', valid: true },
    { id: 'CON-2026-102', name: 'Global Facilities Mgt', contractNumber: 'FM-2026-1122', expiry: '2028-10-14', valid: true }
  ];

  const employeesData = {
    'CON-2026-101': [
      { id: 'EMP-CT-001', name: 'John Smith', nationality: 'UK', docExpiry: '2027-12-31', status: 'Approved' },
      { id: 'EMP-CT-002', name: 'Ravi Kumar', nationality: 'India', docExpiry: '2027-05-15', status: 'Approved' },
    ],
    'CON-2026-102': [
      { id: 'EMP-GF-001', name: 'Maria Garcia', nationality: 'Philippines', docExpiry: '2028-01-01', status: 'Approved' },
      { id: 'EMP-GF-002', name: 'Ahmed Hassan', nationality: 'Egypt', docExpiry: '2028-01-01', status: 'Approved' }
    ]
  };

  const handlePeriodNext = () => {
    const start = new Date(`${visitPeriod.startDate}T${visitPeriod.startTime}`);
    const end = new Date(`${visitPeriod.endDate}T${visitPeriod.endTime}`);
    const contractEnd = new Date(selectedCompany.expiry);
    
    if (start < new Date()) { setPeriodError('Start date cannot be in the past.'); return; }
    if (end <= start) { setPeriodError('End date must be after start date.'); return; }
    if (end > contractEnd) { setPeriodError('Visit period exceeds contract expiry.'); return; }
    
    setPeriodError('');
    setWizardStep(4);
  };

  const submitPassRequest = () => {
    const newReq = {
      id: `CPR-2026-${Math.floor(Math.random()*900)+100}`,
      company: selectedCompany.name,
      employees: selectedEmps.length,
      requestedStart: `${visitPeriod.startDate} ${visitPeriod.startTime}`,
      requestedEnd: `${visitPeriod.endDate} ${visitPeriod.endTime}`,
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
    setVisitPeriod({ startDate: '', startTime: '', endDate: '', endTime: '' });
    setHseStatus('Not Started');
    setDeclaration(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Admin Pass Requests</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage and create gate pass requests on behalf of contractors.</p>
        </div>
        {activeView === 'list' && (
          <button onClick={() => setActiveView('wizard')} className="bg-hct-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 shadow-md">
            <Plus className="w-5 h-5"/> Create Pass Request
          </button>
        )}
      </div>

      {activeView === 'list' ? (
        <div className="space-y-6">
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
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 bg-white">
                 {requests.map(req => (
                   <tr key={req.id} className="hover:bg-slate-50 cursor-pointer">
                     <td className="p-4 font-bold text-slate-800">{req.id}<div className="text-xs text-slate-500 font-normal mt-1">Submitted: {req.submissionDate}</div></td>
                     <td className="p-4 font-medium text-slate-700">{req.company}</td>
                     <td className="p-4 text-center font-bold">{req.employees}</td>
                     <td className="p-4 text-xs text-slate-600 leading-tight">Start: {req.requestedStart}<br/>End: {req.requestedEnd}</td>
                     <td className="p-4 text-xs font-bold text-blue-700 leading-tight">{req.approvedStart !== '-' ? `Start: ${req.approvedStart}` : '-'}<br/>{req.approvedEnd !== '-' ? `End: ${req.approvedEnd}` : ''}</td>
                     <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
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
                     <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${selectedEmps.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
                       {selectedEmps.includes(emp.id) && <Check className="w-4 h-4"/>}
                     </div>
                     <div><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.nationality}</p></div>
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
               
               <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                 <div><label className="text-sm font-bold block mb-1">Start Date *</label><input type="date" value={visitPeriod.startDate} onChange={(e) => setVisitPeriod({...visitPeriod, startDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
                 <div><label className="text-sm font-bold block mb-1">Start Time *</label><input type="time" value={visitPeriod.startTime} onChange={(e) => setVisitPeriod({...visitPeriod, startTime: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
                 <div><label className="text-sm font-bold block mb-1">End Date *</label><input type="date" value={visitPeriod.endDate} onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
                 <div><label className="text-sm font-bold block mb-1">End Time *</label><input type="time" value={visitPeriod.endTime} onChange={(e) => setVisitPeriod({...visitPeriod, endTime: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none" /></div>
               </div>
               
               <div className="flex justify-between pt-6 border-t">
                 <button onClick={() => setWizardStep(2)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                 <button onClick={handlePeriodNext} disabled={!visitPeriod.startDate || !visitPeriod.startTime || !visitPeriod.endDate || !visitPeriod.endTime} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold">Next: HSE <ArrowRight className="inline w-4 h-4 ml-1"/></button>
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
               <h4 className="font-bold text-xl text-center border-b pb-4 mb-6">Review Pass Request (Admin Mode)</h4>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                   <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Contractor Details</h5>
                   <p className="grid grid-cols-2 text-sm mb-2"><span className="text-slate-500">Company</span><strong className="text-slate-800">{selectedCompany.name}</strong></p>
                   <p className="grid grid-cols-2 text-sm"><span className="text-slate-500">Contract No</span><strong className="text-slate-800">{selectedCompany.contractNumber}</strong></p>
                 </div>
                 <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                   <h5 className="font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Requested Visit Period</h5>
                   <p className="grid grid-cols-2 text-sm mb-2"><span className="text-slate-600">Start</span><strong className="text-slate-800">{visitPeriod.startDate} {visitPeriod.startTime}</strong></p>
                   <p className="grid grid-cols-2 text-sm"><span className="text-slate-600">End</span><strong className="text-slate-800">{visitPeriod.endDate} {visitPeriod.endTime}</strong></p>
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
                 <AlertCircle className="w-5 h-5"/> Submitted by Admin on behalf of contractor.
               </div>

               <div className="flex justify-end gap-4 pt-6 border-t">
                 <button onClick={() => setWizardStep(4)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Edit</button>
                 <button onClick={submitPassRequest} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">Submit Pass Request</button>
               </div>
             </div>
           )}
        </div>
      )}
    </motion.div>
  );
};

export default AdminPassRequests;
