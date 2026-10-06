import React, { useState } from 'react';
import { Building2, FileText, Calendar, UploadCloud, File, Trash2, CheckCircle2, ArrowRight, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContractorRegistration = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '',
    contractNumber: '',
    jobDescription: '',
    regNumber: '',
    address: '',
    contactName: '',
    contactMobile: '',
    contactEmail: '',
    remarks: '',
    contractStart: '',
    contractExpiry: '',
    gatePassStart: '',
    gatePassEnd: '',
  });

  const [documents, setDocuments] = useState([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const addDocument = () => {
    if (documents.length >= 4) return;
    setDocuments([...documents, { id: Date.now() + Math.random(), title: '', file: null, fileName: '', size: '' }]);
  };

  const removeDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDocTitleChange = (id, title) => {
    setDocuments(documents.map(doc => doc.id === id ? { ...doc, title } : doc));
    setErrorMsg('');
  };

  const handleDocUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments(documents.map(doc => doc.id === id ? {
        ...doc,
        file,
        fileName: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
      } : doc));
      setErrorMsg('');
    }
  };

  const validateDates = () => {
    const start = new Date(formData.contractStart);
    const end = new Date(formData.contractExpiry);
    const passStart = new Date(formData.gatePassStart);
    const passEnd = new Date(formData.gatePassEnd);

    if (start >= end) {
      return "Contract Expiry Date must be later than Contract Start Date.";
    }
    if (passStart < start) {
      return "Gate Pass Validity From cannot be before the contract start date.";
    }
    if (passEnd > end) {
      return "Gate Pass validity cannot exceed the contract expiry date.";
    }
    if (passStart > passEnd) {
      return "Gate Pass Validity From cannot be after Gate Pass Validity To.";
    }
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      // Basic validation
      if (!formData.companyName || !formData.contractNumber || !formData.jobDescription || 
          !formData.contractStart || !formData.contractExpiry || !formData.gatePassStart || !formData.gatePassEnd) {
        setErrorMsg("Please fill in all mandatory fields (*)");
        return;
      }
      if (documents.length === 0) {
        setErrorMsg("Please add at least one contract document.");
        return;
      }
      for (const doc of documents) {
        if (!doc.title || !doc.file) {
          setErrorMsg("Please provide a name and upload a file for all documents.");
          return;
        }
      }

      const dateError = validateDates();
      if (dateError) {
        setErrorMsg(dateError);
        return;
      }

      setStep(2);
    }
  };

  const submitRegistration = () => {
    setSubmittedId(`CON-2026-${Math.floor(Math.random() * 900) + 100}`);
    setStep(3);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-5xl mx-auto"
    >
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Contractor Company Registration</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Submit your company and contract details for approval.</p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-white/10 overflow-hidden p-6 md:p-8">
        
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                <p className="font-bold text-sm">{errorMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><Building2 className="w-5 h-5 text-hct-blue" /> Company Details</h3>
                <div>
                  <label className="text-sm font-bold mb-1 block">Contract Company Name *</label>
                  <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Contract Number *</label>
                  <input type="text" name="contractNumber" value={formData.contractNumber} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Job Description *</label>
                  <input type="text" name="jobDescription" value={formData.jobDescription} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>
              </div>

              {/* Dates & Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2 flex items-center gap-2"><Calendar className="w-5 h-5 text-hct-blue" /> Contract & Validity Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold mb-1 block">Contract Start *</label>
                    <input type="date" name="contractStart" value={formData.contractStart} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1 block">Contract Expiry *</label>
                    <input type="date" name="contractExpiry" value={formData.contractExpiry} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1 block">Gate Pass Valid From *</label>
                    <input type="date" name="gatePassStart" value={formData.gatePassStart} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-sm font-bold mb-1 block">Gate Pass Valid To *</label>
                    <input type="date" name="gatePassEnd" value={formData.gatePassEnd} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-end mb-2">
                    <label className="text-sm font-bold block">Contract Documents * (PDF, JPG, PNG)</label>
                    {documents.length < 4 && (
                      <button onClick={addDocument} className="text-sm font-bold text-hct-blue hover:underline flex items-center gap-1"><Plus className="w-4 h-4" /> Add Document</button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={doc.id} className="border border-slate-200 dark:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-full md:w-1/3">
                          <input type="text" placeholder="Document Name (e.g. Trade License)" value={doc.title} onChange={(e) => handleDocTitleChange(doc.id, e.target.value)} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-hct-blue text-sm" />
                        </div>
                        <div className="flex-1 w-full">
                          {!doc.file ? (
                            <div className="border border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-2.5 flex items-center justify-center text-slate-500 hover:bg-white dark:hover:bg-slate-700 transition-colors relative cursor-pointer bg-transparent">
                              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(doc.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <UploadCloud className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="font-bold text-sm">Upload File</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-white dark:bg-slate-700 p-2.5 rounded-lg border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <File className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">{doc.fileName}</span>
                                <span className="text-xs text-slate-500 shrink-0">({doc.size})</span>
                              </div>
                              <div className="relative cursor-pointer text-slate-400 hover:text-hct-blue transition-colors shrink-0" title="Replace">
                                <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocUpload(doc.id, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                <RefreshCw className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </div>
                        {documents.length > 1 && (
                          <button onClick={() => removeDocument(doc.id)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0 p-2" title="Remove Document">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
            
            <div className="mt-8 flex justify-end pt-6 border-t border-slate-200 dark:border-slate-800">
               <button onClick={handleNext} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-blue-500/30 flex items-center gap-2">Review Registration <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in">
            <h3 className="text-2xl font-bold text-center border-b pb-4">Review Contractor Registration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-sm">
                  <h4 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">Company Details</h4>
                  <div className="space-y-3">
                    <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Company Name:</span> <span className="font-bold text-base">{formData.companyName}</span></p>
                    <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Contract No:</span> <span className="font-medium">{formData.contractNumber}</span></p>
                    <p className="grid grid-cols-2 gap-2"><span className="text-slate-500">Job Description:</span> <span className="font-medium">{formData.jobDescription}</span></p>

                  </div>
                </div>

              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 text-sm">
                  <h4 className="font-bold text-hct-blue uppercase tracking-wider mb-4 border-b border-blue-200 pb-2">Contract Details</h4>
                  <div className="space-y-3">
                    <p className="grid grid-cols-2 gap-2"><span className="text-slate-600">Start Date:</span> <span className="font-bold text-slate-800">{formData.contractStart}</span></p>
                    <p className="grid grid-cols-2 gap-2"><span className="text-slate-600">Expiry Date:</span> <span className="font-bold text-slate-800">{formData.contractExpiry}</span></p>
                    <div className="pt-2">
                       <span className="text-slate-600 block mb-2">Contract Documents:</span>
                       <div className="space-y-2">
                         {documents.map(doc => (
                           <div key={doc.id} className="flex items-center gap-2 bg-white px-3 py-2 rounded border border-blue-200">
                             <FileText className="w-4 h-4 text-blue-500 shrink-0" /> 
                             <span className="font-bold text-slate-700 text-xs">{doc.title}:</span>
                             <span className="font-medium text-xs truncate">{doc.fileName}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 text-sm">
                  <h4 className="font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-200 pb-2">Gate Pass Validity</h4>
                  <div className="space-y-3">
                    <p className="grid grid-cols-2 gap-2"><span className="text-emerald-700">Valid From:</span> <span className="font-bold text-emerald-900 dark:text-emerald-300">{formData.gatePassStart}</span></p>
                    <p className="grid grid-cols-2 gap-2"><span className="text-emerald-700">Valid To:</span> <span className="font-bold text-emerald-900 dark:text-emerald-300">{formData.gatePassEnd}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
               <button onClick={() => setStep(1)} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 transition-colors">Edit</button>
               <button onClick={submitRegistration} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all">Submit for Approval</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-12 animate-in zoom-in-95">
             <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
             <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Registration Submitted</h3>
             <p className="text-slate-500 max-w-md mx-auto mb-6">Your company registration has been submitted and routed through our approval hierarchy. You will receive an email once approved.</p>
             <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-sm mx-auto">
               <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Contractor ID</p>
               <p className="text-2xl font-bold text-hct-blue">{submittedId}</p>
             </div>
             <p className="text-sm font-bold text-amber-500 mt-6 bg-amber-50 p-2 inline-block rounded-lg">Status: Pending Approval (Level 1)</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractorRegistration;
