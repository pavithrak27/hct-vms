import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Users, FileSignature, CheckCircle2, UploadCloud, Camera, Search, UserPlus, Trash2, ArrowRight, Video, FileText, CheckSquare, Plus, AlertCircle, Clock, ShieldCheck, QrCode, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PassViewer from './PassViewer';
import { useContractor } from '../../context/ContractorContext';

const ContractorPortal = () => {
  const { tab } = useParams();
  const navigate = useNavigate();
  const activeTab = tab || 'dashboard';
  
  const companyInfo = {
    name: 'Tech Solutions LLC',
    id: 'CON-2026-101',
    contractNumber: 'CT-2025-9981',
    status: 'Approved',
    contractStart: '2026-11-01',
    contractExpiry: '2027-11-01',
    gatePassValidity: '2026-11-01 to 2027-10-31'
  };

  const { employees, addEmployee, updateEmployee, deleteEmployee, passRequests, addPassRequest, generatedPasses } = useContractor();
  const [editingEmp, setEditingEmp] = useState(null);

  // Add Employee State
  const [addStep, setAddStep] = useState(1);
  const [empForm, setEmpForm] = useState({ name: '', nationality: '', mobile: '', jobTitle: '', docExpiry: '' });
  const [empDocs, setEmpDocs] = useState([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
  const [empPhoto, setEmpPhoto] = useState(null);

  // Create Pass Request State
  const [passStep, setPassStep] = useState(0); // 0=list, 1=select emp, 2=period, 3=hse, 4=review
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState({ startDate: '', endDate: '' });
  const [periodError, setPeriodError] = useState('');
  const [hseStatus, setHseStatus] = useState('Not Started'); // Not Started, In Progress, Completed
  const [declaration, setDeclaration] = useState(false);
  const [signature, setSignature] = useState('');
  
  const [viewingRequest, setViewingRequest] = useState(null);
  const [selectedPass, setSelectedPass] = useState(null);
  const [viewEmployee, setViewEmployee] = useState(null);

  const addDocument = () => {
    if (empDocs.length >= 4) return;
    setEmpDocs([...empDocs, { id: Date.now() + Math.random(), title: '', file: null, fileName: '', size: '' }]);
  };

  const removeDocument = (id) => {
    setEmpDocs(empDocs.filter(doc => doc.id !== id));
  };

  const handleDocTitleChange = (id, title) => {
    setEmpDocs(empDocs.map(doc => doc.id === id ? { ...doc, title } : doc));
  };

  const handleDocFileUpload = (id, file) => {
    if (file) {
      setEmpDocs(empDocs.map(doc => doc.id === id ? {
        ...doc, file, fileName: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      } : doc));
    }
  };

  const submitEmployee = () => {
    addEmployee({
      id: `EMP-CT-2026-${Math.floor(Math.random() * 900) + 100}`,
      ...empForm,
      company: companyInfo.name,
      status: 'Pending Approval',
      photo: 'https://i.pravatar.cc/300?img=' + (Math.floor(Math.random() * 70) + 1),
      document: empDocs[0]?.fileName || 'Uploaded_Doc.pdf',
      submissionDate: new Date().toISOString().split('T')[0]
    });
    navigate('/contractor/employees');
    setAddStep(1);
    setEmpForm({ name: '', nationality: '', mobile: '', jobTitle: '', docExpiry: '' });
    setEmpDocs([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
    setEmpPhoto(null);
  };

  const toggleEmpSelect = (id) => {
    if (selectedEmps.includes(id)) {
      setSelectedEmps(selectedEmps.filter(e => e !== id));
    } else {
      setSelectedEmps([...selectedEmps, id]);
    }
  };

  const handlePeriodNext = () => {
    if (!visitPeriod.startDate || !visitPeriod.endDate) { setPeriodError('Please fill in all date fields.'); return; }
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
      company: companyInfo.name,
      contractId: companyInfo.id,
      contractNumber: companyInfo.contractNumber,
      employees: selectedEmps, // array of IDs
      start: visitPeriod.startDate,
      end: visitPeriod.endDate,
      status: 'Pending Level 1 Approval',
      approvalLevel: 1,
      submissionDate: new Date().toISOString().split('T')[0]
    };
    addPassRequest(newReq);
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
                      <button onClick={() => setEditingEmp({...emp})} className="flex-1 text-xs font-bold py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors text-slate-700">Edit Details</button>
                      <button onClick={() => { if(window.confirm('Are you sure you want to delete this employee?')) deleteEmployee(emp.id); }} className="p-2 text-slate-400 border border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <label className="text-sm font-bold block">Identity Documents * (PDF, JPG, PNG)</label>
                      {empDocs.length < 4 && (
                        <button onClick={addDocument} className="text-xs font-bold text-hct-blue bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-1 transition-colors">
                          <Plus className="w-4 h-4"/> Add Document
                        </button>
                      )}
                    </div>
                    {empDocs.map((doc, index) => (
                      <div key={doc.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {empDocs.length > 1 && (
                           <button onClick={() => removeDocument(doc.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600 p-1 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                        )}
                        <div className="flex-1 w-full">
                           <input type="text" placeholder="Document Name (e.g. Passport, EID)" value={doc.title} onChange={(e) => handleDocTitleChange(doc.id, e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue text-sm font-bold text-slate-700 bg-white" />
                        </div>
                        <div className="flex-1 w-full">
                           {doc.fileName ? (
                             <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-emerald-200 text-sm">
                               <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>
                               <div className="flex-1 min-w-0">
                                 <p className="font-bold text-slate-700 truncate">{doc.fileName}</p>
                                 <p className="text-xs text-slate-500">{doc.size}</p>
                               </div>
                               <button onClick={() => handleDocFileUpload(doc.id, null)} className="text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
                             </div>
                           ) : (
                             <label className="flex items-center justify-center gap-2 bg-white border border-slate-300 border-dashed rounded-lg p-2.5 cursor-pointer hover:bg-slate-50 hover:border-hct-blue transition-colors text-sm font-bold text-slate-600">
                               <UploadCloud className="w-5 h-5"/> Browse File
                               <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocFileUpload(doc.id, e.target.files[0])} />
                             </label>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm font-bold block mb-1">Document Expiry Date *</label>
                    <input type="date" value={empForm.docExpiry} onChange={e => setEmpForm({...empForm, docExpiry: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t">
                    <button onClick={() => setAddStep(1)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                    <button onClick={() => {
                       const allDocsValid = empDocs.every(d => d.title && d.fileName);
                       if (!allDocsValid) {
                         alert("Please provide a name and upload a file for all documents.");
                         return;
                       }
                       setAddStep(3);
                    }} disabled={!empForm.docExpiry || empDocs.length === 0} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold disabled:opacity-50">Next: Photo <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                  </div>
                </div>
              )}

              {addStep === 3 && (
                <div className="space-y-6">
                  {empPhoto ? (
                     <div className="bg-slate-50 p-6 rounded-xl border border-emerald-200 text-center flex flex-col items-center">
                       <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3"/>
                       <p className="font-bold text-slate-700 truncate mb-1">{empPhoto.fileName}</p>
                       <p className="text-xs text-slate-500 mb-4">{empPhoto.size}</p>
                       <button type="button" onClick={() => setEmpPhoto(null)} className="px-6 py-2 bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-colors rounded-xl text-sm font-bold shadow-sm inline-flex items-center gap-2"><Trash2 className="w-4 h-4"/> Remove Photo</button>
                     </div>
                  ) : (
                    <label className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-dashed text-center block cursor-pointer hover:border-hct-blue transition-colors">
                       <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-slate-100 shadow-sm">
                         <Camera className="w-8 h-8 text-slate-300" />
                       </div>
                       <p className="font-bold text-slate-700 mb-4">Upload Photograph</p>
                       <span className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm inline-flex items-center gap-2"><UploadCloud className="w-4 h-4"/> Browse Photo</span>
                       <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => {
                         const file = e.target.files[0];
                         if(file) {
                           setEmpPhoto({ file, fileName: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });
                         }
                       }} />
                    </label>
                  )}
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
              {passStep === 0 && !viewingRequest && (
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
                            <td className="p-4 font-medium">{req.employees.length} Staff</td>
                            <td className="p-4"><p className="text-xs">{req.start}</p><p className="text-xs">{req.end}</p></td>
                            <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span></td>
                            <td className="p-4 text-right">
                              {req.status === 'Approved' ? (
                                <button onClick={() => setViewingRequest(req)} className="text-emerald-700 font-bold bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors flex items-center gap-2 ml-auto shadow-sm"><QrCode className="w-4 h-4"/> View Passes</button>
                              ) : (
                                <span className="text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 inline-block">Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* View Generated Passes for Request */}
              {viewingRequest && (
                <div className="animate-in fade-in space-y-6">
                  <div className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Passes for Request {viewingRequest.id}</h3>
                      <button onClick={() => setViewingRequest(null)} className="text-sm font-bold text-blue-600 hover:underline mt-1">&larr; Back to Requests</button>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search by Pass ID, Name, Company..." className="pl-9 p-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue text-sm w-72 bg-white" />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors border border-slate-200 text-sm">
                        <UploadCloud className="w-4 h-4 rotate-180" /> Download PDFs
                      </button>
                    </div>
                    
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-4 w-12"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" /></th>
                          <th className="p-4 font-bold uppercase tracking-wider text-xs">Pass ID & Status</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-xs">Employee</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-xs">Company</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-xs">Validity Period</th>
                          <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingRequest.employees.map((empId, index) => {
                          const emp = employees.find(e => e.id === empId);
                          const passId = `PASS-0012${5 + index}`;
                          const isExpired = index === 1; // Just to show different statuses like in screenshot
                          return (
                            <tr key={empId} className="hover:bg-slate-50 bg-white">
                              <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded border-slate-300" /></td>
                              <td className="p-4">
                                <p className="font-bold text-slate-800">{passId}</p>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                  {isExpired ? 'Expired' : 'Active'}
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img src={emp?.photo || 'https://i.pravatar.cc/150'} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                  <div>
                                    <p className="font-bold text-slate-800">{emp?.name}</p>
                                    <p className="text-xs text-slate-500">{emp?.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-slate-600 font-medium">{viewingRequest.company}</td>
                              <td className="p-4 text-slate-500 text-xs space-y-0.5">
                                <p>From: {isExpired ? '01-Jan-2023 08:00 AM' : `${viewingRequest.start}`}</p>
                                <p>To: {isExpired ? '31-Dec-2023 06:00 PM' : `${viewingRequest.end}`}</p>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex justify-end items-center gap-3 text-slate-400">
                                  {isExpired && <button className="text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline"><ArrowRight className="w-3 h-3" /> Renew</button>}
                                  <button onClick={() => setSelectedPass({passId, empName: emp?.name, validFrom: viewingRequest.start, validTo: viewingRequest.end, status: isExpired ? 'Expired' : 'Active'})} className="hover:text-hct-blue transition-colors"><FileText className="w-5 h-5" /></button>
                                  <button className="hover:text-hct-blue transition-colors"><UploadCloud className="w-5 h-5 rotate-180" /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
                           <label className="text-sm font-bold block mb-1">End Date *</label>
                           <input type="date" value={visitPeriod.endDate} onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-hct-blue" />
                         </div>
                       </div>
                       
                       <div className="flex justify-between pt-6 border-t">
                         <button onClick={() => setPassStep(1)} className="px-6 py-3 bg-slate-100 rounded-xl font-bold">Back</button>
                         <button onClick={handlePeriodNext} disabled={!visitPeriod.startDate || !visitPeriod.endDate} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold disabled:opacity-50">Next: HSE <ArrowRight className="inline w-4 h-4 ml-1"/></button>
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
                           <h5 className="font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Requested Visit Details</h5>
                           <div className="text-sm space-y-2">
                             <p className="grid grid-cols-2"><span className="text-slate-600">Campus</span><strong className="text-slate-800">{visitPeriod.campus}</strong></p>
                             <p className="grid grid-cols-2"><span className="text-slate-600">Start</span><strong className="text-slate-800">{visitPeriod.startTime}</strong></p>
                             <p className="grid grid-cols-2"><span className="text-slate-600">End</span><strong className="text-slate-800">{visitPeriod.endTime}</strong></p>
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
                   <button onClick={() => {setPassStep(0); navigate('/contractor/passes');}} className="px-8 py-3 bg-slate-100 rounded-xl font-bold hover:bg-slate-200">Return to Requests</button>
                 </div>
              )}
            </div>
          )}
          
          {/* GENERATED PASSES TAB */}
          {activeTab === 'generated-passes' && (
            <div className="animate-in fade-in space-y-6">
              <h3 className="text-xl font-bold border-b pb-4">Generated QR Passes</h3>
              {generatedPasses.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No passes have been generated yet.</div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr><th className="p-4 font-bold uppercase">Employee</th><th className="p-4 font-bold uppercase">Pass ID</th><th className="p-4 font-bold uppercase">Valid From</th><th className="p-4 font-bold uppercase">Valid To</th><th className="p-4 font-bold uppercase">Status</th><th className="p-4 font-bold uppercase text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {generatedPasses.map(pass => (
                        <tr key={pass.passId} className="hover:bg-slate-50">
                          <td className="p-4 font-bold">{pass.empName}</td>
                          <td className="p-4">{pass.passId}</td>
                          <td className="p-4">{pass.validFrom}</td>
                          <td className="p-4">{pass.validTo}</td>
                          <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">{pass.status}</span></td>
                          <td className="p-4 text-right flex justify-end gap-2">
                            <button onClick={() => setSelectedPass(pass)} className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100"><QrCode className="w-4 h-4 inline mr-1"/> View</button>
                            <button onClick={() => alert('Downloading PDF pass...')} className="text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100"><FileText className="w-4 h-4 inline mr-1"/> PDF</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          
        </div>
      </div>
      
      <AnimatePresence>
        {selectedPass && <PassViewer pass={selectedPass} onClose={() => setSelectedPass(null)} />}
        {editingEmp && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold mb-4">Edit Employee</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold block mb-1">Full Name</label>
                  <input type="text" value={editingEmp.name} onChange={e => setEditingEmp({...editingEmp, name: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">Job Title</label>
                  <input type="text" value={editingEmp.jobTitle} onChange={e => setEditingEmp({...editingEmp, jobTitle: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">Mobile</label>
                  <input type="text" value={editingEmp.mobile} onChange={e => setEditingEmp({...editingEmp, mobile: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1">ID Expiry</label>
                  <input type="date" value={editingEmp.docExpiry} onChange={e => setEditingEmp({...editingEmp, docExpiry: e.target.value})} className="w-full p-2 border rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button onClick={() => setEditingEmp(null)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold text-slate-600">Cancel</button>
                <button onClick={() => { updateEmployee(editingEmp); setEditingEmp(null); }} className="px-4 py-2 bg-hct-blue text-white rounded-lg font-bold">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ContractorPortal;
