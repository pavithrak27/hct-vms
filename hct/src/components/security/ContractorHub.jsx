import React, { useState, useEffect } from 'react';
import { Building2, Users, FileSignature, CheckCircle2, Search, ArrowRight, ShieldCheck, CheckSquare, Plus, FileText, ChevronLeft, QrCode, Mail, Send, RefreshCw, X, UploadCloud, Trash2, Camera, Calendar, History, Eye, Download, MapPin, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContractorRegistration from '../contractor/ContractorRegistration';
import { useRole } from '../../context/RoleContext';

const contractorsList = [
  { id: 'CON-2026-101', name: 'Tech Solutions LLC', contractNumber: 'CT-2025-9981', status: 'Approved', expiry: '2027-11-01', contractStart: '2025-11-01', jobDescription: 'IT Infrastructure & Maintenance', contactName: 'Ahmed Hassan', contactEmail: 'ahmed@techsolutions.com', contactMobile: '+971 50 111 2222', address: 'Dubai Silicon Oasis, Dubai' },
  { id: 'CON-2026-102', name: 'Global Facilities Mgt', contractNumber: 'FM-2026-1122', status: 'Pending', expiry: '2028-10-14', contractStart: '2026-10-15', jobDescription: 'General Cleaning & FM Services', contactName: 'Sarah Jenkins', contactEmail: 'sarah.j@globalfm.com', contactMobile: '+971 55 333 4444', address: 'Al Quoz Industrial Area, Dubai' },
  { id: 'CON-2026-103', name: 'Al Jaber Construction', contractNumber: 'AJC-2022-005', status: 'Expired', expiry: '2023-12-01', contractStart: '2022-12-01', jobDescription: 'Campus Expansion Project', contactName: 'Mohammed Al Jaber', contactEmail: 'maljaber@aljaber.com', contactMobile: '+971 56 555 6666', address: 'Abu Dhabi Industrial City' }
];

const mockEmployees = {
  'CON-2026-101': [
    { id: 'EMP-001', name: 'John Smith', role: 'Technician', status: 'Approved', nationality: 'USA', mobile: '+971 50 123 4567', email: 'john@techsolutions.com', document: 'Passport.pdf' },
    { id: 'EMP-002', name: 'Sarah Jane', role: 'Engineer', status: 'Pending Approval', nationality: 'UK', mobile: '+971 55 987 6543', email: 'sarah@techsolutions.com', document: 'Emirates_ID.pdf' }
  ],
  'CON-2026-102': [
    { id: 'EMP-003', name: 'Mike Ross', role: 'Cleaner', status: 'Approved', nationality: 'India', mobile: '+971 56 111 2222', email: 'mike@globalfm.com', document: 'Visa_Copy.pdf' }
  ]
};

const mockPassRequests = {
  'CON-2026-101': [
    { id: 'PR-101', date: '2026-10-10', employees: 2, status: 'Approved' }
  ],
  'CON-2026-102': []
};
const generatedPassesData = {
  'CON-2026-101': [
    { passId: 'PASS-00125', empName: 'John Smith', empId: 'EMP-CT-001', status: 'Active', validFrom: '10-Oct-2026 08:00 AM', validTo: '13-Oct-2026 06:00 PM', photo: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { passId: 'PASS-00126', empName: 'Ravi Kumar', empId: 'EMP-CT-002', status: 'Expired', validFrom: '01-Jan-2023 08:00 AM', validTo: '31-Dec-2023 06:00 PM', photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
  ],
  'CON-2026-102': [
    { passId: 'PASS-00127', empName: 'Mike Ross', empId: 'EMP-CT-003', status: 'Active', validFrom: '01-Sep-2026 07:00 AM', validTo: '30-Nov-2026 05:00 PM', photo: 'https://i.pravatar.cc/150?u=a048581f4e29026701d' }
  ]
};

const ContractorHub = () => {
  const { currentRole, sessionUser } = useRole();
  const isAdmin = currentRole?.id === 'security' || currentRole?.id === 'superadmin' || currentRole?.portals?.includes('dashboard');

  const isContractor = sessionUser?.role === 'contractor';
  const availableContractors = isContractor 
    ? contractorsList.filter(c => c.name === sessionUser.companyId) 
    : contractorsList;

  const [selectedContractor, setSelectedContractor] = useState(null);

  useEffect(() => {
    if (isContractor) {
      const myCompany = availableContractors[0] || contractorsList[0];
      setSelectedContractor(myCompany);
    } else if (!isAdmin) {
      setSelectedContractor(contractorsList[0]);
    }
  }, [isAdmin, isContractor]);
  const [activeTab, setActiveTab] = useState('overview'); // overview, employees, passes
  const [search, setSearch] = useState('');
  const [isAddingContractor, setIsAddingContractor] = useState(false);
  const [renewModalData, setRenewModalData] = useState(null);
  const [showQR, setShowQR] = useState(null);
  
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // Add Employee Form State
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', nationality: '', mobile: '', role: '' });
  const [empDocs, setEmpDocs] = useState([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
  const [empPhoto, setEmpPhoto] = useState(null);

  // Create Pass Request State
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [passStep, setPassStep] = useState(1);
  const [selectedEmpsForPass, setSelectedEmpsForPass] = useState([]);
  const [visitPeriod, setVisitPeriod] = useState({ startDate: '', endDate: '' });
  const [periodError, setPeriodError] = useState('');

  // Renew Request State
  const [showRenewRequest, setShowRenewRequest] = useState(false);
  const [renewForm, setRenewForm] = useState({
    contractStart: '', contractExpiry: '', gatePassStart: '', gatePassEnd: ''
  });
  const [renewDocs, setRenewDocs] = useState([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
  const [hseStatus, setHseStatus] = useState('Not Started');
  const [declaration, setDeclaration] = useState(false);
  const [signature, setSignature] = useState('');
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [sendLinkData, setSendLinkData] = useState({ 
    campus: 'Men\'s College', 
    contactNumber: '', 
    contractorEmail: '' 
  });

  const handleSendLink = (e) => {
    e.preventDefault();
    if (!sendLinkData.contactNumber || !sendLinkData.contractorEmail) {
      alert("Please enter both Contact Number and Contractor Email.");
      return;
    }
    alert(`Registration link sent successfully to ${sendLinkData.contractorEmail}!`);
    setShowSendLinkModal(false);
    setSendLinkData({ campus: 'Men\'s College', contactNumber: '', contractorEmail: '' });
  };

  // Mock State
  const [employees, setEmployees] = useState(mockEmployees);
  const [passRequests, setPassRequests] = useState(mockPassRequests);

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

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.nationality || !newEmployee.mobile || !newEmployee.role) return;
    const cid = selectedContractor.id;
    const added = { id: `EMP-00${Math.floor(Math.random() * 900) + 100}`, name: newEmployee.name, role: newEmployee.role, status: 'Pending Approval' };
    setEmployees({ ...employees, [cid]: [...(employees[cid] || []), added] });
    setNewEmployee({ name: '', nationality: '', mobile: '', role: '' });
    setEmpDocs([{ id: Date.now(), title: '', file: null, fileName: '', size: '' }]);
    setEmpPhoto(null);
    setShowAddEmployee(false);
  };

  const handlePeriodNext = () => {
    if (!visitPeriod.startDate || !visitPeriod.endDate) {
      setPeriodError('Please fill in all date fields.');
      return;
    }
    setPeriodError('');
    setPassStep(3);
  };

  const simulateHseVideo = () => {
    setHseStatus('In Progress');
    setTimeout(() => setHseStatus('Completed'), 2000);
  };

  const handleCreatePassRequest = () => {
    if (selectedEmpsForPass.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    const cid = selectedContractor.id;
    const newReq = { id: `PR-${Math.floor(Math.random() * 900) + 100}`, date: new Date().toISOString().split('T')[0], employees: selectedEmpsForPass.length, status: 'Pending Approval', start: visitPeriod.startDate, end: visitPeriod.endDate };
    setPassRequests({ ...passRequests, [cid]: [...(passRequests[cid] || []), newReq] });
    setPassStep(5);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Contractors Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage contractors, employees, and pass requests from one unified dashboard.</p>
        </div>
        {isAdmin && !selectedContractor && !isAddingContractor && (
          <div className="flex gap-3">
            <button onClick={() => setShowSendLinkModal(true)} className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 shadow-sm transition-colors">
              <Mail className="w-5 h-5"/> Send Link
            </button>
            <button onClick={() => setIsAddingContractor(true)} className="bg-hct-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 shadow-md">
              <Plus className="w-5 h-5"/> Register Contractor
            </button>
          </div>
        )}
      </div>

      {isAddingContractor ? (
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-6 relative">
          <button onClick={() => setIsAddingContractor(false)} className="absolute top-6 left-6 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-hct-blue transition-colors z-10">
            <ChevronLeft className="w-4 h-4" /> Back to Hub
          </button>
          <div className="pt-10">
            <ContractorRegistration />
          </div>
        </div>
      ) : !selectedContractor ? (
        // List of Contractors
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <div className="mb-6 relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search contractors..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-hct-blue text-sm" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableContractors.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(contractor => (
              <div 
                key={contractor.id} 
                onClick={() => { setSelectedContractor(contractor); setActiveTab('overview'); }}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-1">{contractor.name}</h3>
                <p className="text-slate-500 text-sm mb-4">Contract No: {contractor.contractNumber}</p>
                <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${contractor.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : contractor.status === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>{contractor.status}</span>
                  <div className="flex items-center gap-3">
                    {contractor.status === 'Expired' && (
                      <button onClick={(e) => { e.stopPropagation(); showToast('Renewal email has been sent. Please check your mail.'); }} className="flex items-center gap-1 text-sm font-bold text-hct-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                        <RefreshCw className="w-3 h-3"/> Renew
                      </button>
                    )}
                    <span className="flex items-center gap-1 text-sm font-bold text-hct-blue group-hover:underline">Manage <ArrowRight className="w-4 h-4"/></span>
                  </div>
                </div>


              </div>
            ))}
          </div>
        </div>
      ) : (
        // Contractor Detail View
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              {isAdmin && (
                <button onClick={() => setSelectedContractor(null)} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-hct-blue mb-2 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Contractors
                </button>
              )}
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Building2 className="w-8 h-8 text-hct-blue" /> {selectedContractor.name}
              </h2>
              <p className="text-slate-500 mt-1">Contract No: {selectedContractor.contractNumber} • Valid until: {selectedContractor.expiry}</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedContractor.status === 'Expired' && (
                <button onClick={() => setShowRenewRequest(true)} className="flex items-center gap-2 px-4 py-2 bg-hct-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors">
                  <RefreshCw className="w-4 h-4"/> Renew Request
                </button>
              )}
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${selectedContractor.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : selectedContractor.status === 'Expired' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                Company Status: {selectedContractor.status}
              </span>
            </div>
          </div>

          <div className="flex px-6 border-b border-slate-200 dark:border-slate-700 gap-6">
             <button onClick={() => setActiveTab('overview')} className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-hct-blue text-hct-blue' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Overview</button>
             <button onClick={() => setActiveTab('employees')} className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'employees' ? 'border-hct-blue text-hct-blue' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Employees ({(employees[selectedContractor.id] || []).length})</button>
             <button onClick={() => setActiveTab('passes')} className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'passes' ? 'border-hct-blue text-hct-blue' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Pass Requests ({(passRequests[selectedContractor.id] || []).length})</button>
             <button onClick={() => setActiveTab('renewal')} className={`py-4 font-bold text-sm border-b-2 transition-colors ${activeTab === 'renewal' ? 'border-hct-blue text-hct-blue' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Renewal History</button>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Company Details</h3>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-inner">
                    <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Company Name</span><strong className="text-slate-800 dark:text-white text-lg">{selectedContractor.name}</strong></div>
                    <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Contract No</span><strong className="text-slate-800 dark:text-white text-lg">{selectedContractor.contractNumber}</strong></div>
                    <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Contract Start</span><strong className="text-slate-800 dark:text-white text-lg">{selectedContractor.contractStart}</strong></div>
                    <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Expiry Date</span><strong className="text-slate-800 dark:text-white text-lg">{selectedContractor.expiry}</strong></div>
                    
                    <div className="col-span-2 md:col-span-4 border-t border-slate-200 dark:border-slate-700 pt-6 mt-2 grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Job Description</span><strong className="text-slate-800 dark:text-white text-base">{selectedContractor.jobDescription}</strong></div>
                      <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Primary Contact</span><strong className="text-slate-800 dark:text-white text-base">{selectedContractor.contactName}</strong></div>
                      <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Contact Email</span><strong className="text-slate-800 dark:text-white text-base">{selectedContractor.contactEmail}</strong></div>
                      <div><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Contact Mobile</span><strong className="text-slate-800 dark:text-white text-base">{selectedContractor.contactMobile}</strong></div>
                    </div>

                    <div className="col-span-2 md:col-span-3"><span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Address</span><strong className="text-slate-800 dark:text-white text-base">{selectedContractor.address}</strong></div>
                    <div>
                      <span className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Status</span>
                      <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm inline-block ${selectedContractor.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : selectedContractor.status === 'Expired' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                        {selectedContractor.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Contract Documents</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {(selectedContractor.documents || [
                      { id: 1, title: 'Trade License', fileName: 'trade_license_2026.pdf', size: '1.2 MB' },
                      { id: 2, title: 'VAT Certificate', fileName: 'vat_certificate.pdf', size: '0.8 MB' },
                      { id: 3, title: 'Commercial Register', fileName: 'commercial_register.pdf', size: '2.1 MB' },
                      { id: 4, title: 'Company Profile', fileName: 'company_profile.pdf', size: '4.5 MB' }
                    ]).map(doc => (
                      <div key={doc.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-start gap-3 hover:shadow-lg transition-all group cursor-pointer hover:border-blue-300">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-500 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate mb-0.5 group-hover:text-hct-blue transition-colors">{doc.title}</h4>
                          <p className="text-[10px] text-slate-500 truncate mb-2">{doc.fileName}</p>
                          <div className="flex items-center gap-3">
                            <button className="text-xs font-bold text-hct-blue hover:text-blue-800 transition-colors">View</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {activeTab === 'employees' && (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Users className="w-6 h-6 text-slate-400"/> Registered Employees</h3>
                  <button onClick={() => setShowAddEmployee(true)} className="bg-hct-blue text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Add Employee</button>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold uppercase">Employee</th>
                        <th className="p-4 font-bold uppercase">ID Number</th>
                        <th className="p-4 font-bold uppercase">Nationality</th>
                        <th className="p-4 font-bold uppercase">Mobile Number</th>
                        <th className="p-4 font-bold uppercase">Role</th>
                        <th className="p-4 font-bold uppercase">Document</th>
                        <th className="p-4 font-bold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(employees[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="7" className="p-8 text-center text-slate-500">No employees found.</td></tr>
                      ) : (employees[selectedContractor.id] || []).map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt={emp.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
                            {emp.name}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.id}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.nationality || '-'}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.mobile || '-'}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.role}</td>
                          <td className="p-4">
                            {emp.document ? (
                              <button className="flex items-center gap-1.5 text-xs font-bold text-hct-blue bg-blue-50 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100 whitespace-nowrap">
                                <FileText className="w-3.5 h-3.5" />
                                {emp.document}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{emp.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'passes' && (
              <div className="animate-in fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold flex items-center gap-2"><FileSignature className="w-6 h-6 text-slate-400"/> Generated Passes: {selectedContractor.name}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => setShowCreatePass(true)} className="bg-hct-blue text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Create Pass Request</button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900/80 rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input type="text" placeholder="Search by Pass ID, Name, Company..." className="pl-9 p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Download className="w-4 h-4"/> Download PDFs</button>
                    </div>
                  </div>

                  <table className="w-full text-left text-sm">
                    <thead className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold uppercase w-10"></th>
                        <th className="p-4 font-bold uppercase">Pass ID & Status</th>
                        <th className="p-4 font-bold uppercase">Employee</th>
                        <th className="p-4 font-bold uppercase">Company</th>
                        <th className="p-4 font-bold uppercase">Validity Period</th>
                        <th className="p-4 font-bold uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                      {(generatedPassesData[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No generated passes found.</td></tr>
                      ) : (generatedPassesData[selectedContractor.id] || []).map(pass => (
                        <tr key={pass.passId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-hct-blue focus:ring-hct-blue" /></td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800 dark:text-white">{pass.passId}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${pass.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{pass.status}</span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img src={pass.photo} alt={pass.empName} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                              <div><p className="font-bold text-slate-800 dark:text-white">{pass.empName}</p><p className="text-xs text-slate-500">{pass.empId}</p></div>
                            </div>
                          </td>
                          <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{selectedContractor.name}</td>
                          <td className="p-4 text-xs text-slate-600 dark:text-slate-400 leading-tight">From: {pass.validFrom}<br/>To: {pass.validTo}</td>
                          <td className="p-4 text-right flex items-center justify-end gap-2">
                            <button onClick={() => setShowQR(pass.passId)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"><Eye className="w-5 h-5"/></button>
                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors"><Download className="w-5 h-5"/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'renewal' && (
              <div className="animate-in fade-in space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white"><History className="w-6 h-6 text-slate-400"/> Renewal History</h3>
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold uppercase">Date of Renewal</th>
                        <th className="p-4 font-bold uppercase">Previous Expiry</th>
                        <th className="p-4 font-bold uppercase">New Expiry</th>
                        <th className="p-4 font-bold uppercase">Renewed By</th>
                        <th className="p-4 font-bold uppercase text-right">Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 dark:text-white">2026-09-15</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">2026-11-01</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">2027-11-01</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">Ahmed Hassan</td>
                        <td className="p-4 text-right flex flex-col items-end justify-center gap-1.5">
                          <button className="text-blue-600 hover:underline text-xs font-bold transition-colors">View Document</button>
                          <button className="text-blue-600 hover:underline text-xs font-bold transition-colors">View Document</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 dark:text-white">2025-08-22</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">2025-11-01</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">2026-11-01</td>
                        <td className="p-4 text-slate-600 dark:text-slate-400">Admin</td>
                        <td className="p-4 text-right flex flex-col items-end justify-center gap-1.5">
                          <button className="text-blue-600 hover:underline text-xs font-bold transition-colors">View Document</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center">
              <button onClick={() => setShowQR(null)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
              <div className="mb-6 flex justify-center">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <QrCode className="w-40 h-40 text-slate-800" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Gate Pass QR</h3>
              <p className="text-slate-500 text-sm mb-6">Pass ID: {showQR}</p>
              <button onClick={() => setShowQR(null)} className="w-full py-3 bg-hct-blue hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-md">Close</button>
            </motion.div>
          </div>
        )}

        {showAddEmployee && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-2xl font-bold text-slate-800">Add New Employee</h3>
                <button type="button" onClick={() => setShowAddEmployee(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={(e) => {
                 e.preventDefault();
                 const allDocsValid = empDocs.every(d => d.title && d.fileName);
                 if (!allDocsValid) {
                   alert("Please provide a name and upload a file for all documents.");
                   return;
                 }
                 handleAddEmployee(e);
              }}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <h4 className="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2">Employee Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name *</label>
                        <input type="text" required value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nationality *</label>
                        <input type="text" required value={newEmployee.nationality} onChange={(e) => setNewEmployee({...newEmployee, nationality: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100" placeholder="e.g. UAE" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Mobile Number *</label>
                        <input type="text" required value={newEmployee.mobile} onChange={(e) => setNewEmployee({...newEmployee, mobile: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100" placeholder="+971 50 123 4567" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1">Job Role *</label>
                        <input type="text" required value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100" placeholder="Technician" />
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-slate-700 border-b border-slate-100 pb-2 pt-4">Live Photograph</h4>
                    {empPhoto ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-200 text-sm mt-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-700 truncate">{empPhoto.fileName}</p>
                          <p className="text-xs text-slate-500">{empPhoto.size}</p>
                        </div>
                        <button type="button" onClick={() => setEmpPhoto(null)} className="text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <label className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed text-center block cursor-pointer hover:border-hct-blue transition-colors mt-4">
                         <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                         <span className="px-6 py-2 bg-white border border-slate-300 hover:text-hct-blue transition-colors rounded-xl text-sm font-bold shadow-sm inline-block cursor-pointer">Upload Photo</span>
                         <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={(e) => {
                           const file = e.target.files[0];
                           if(file) {
                             setEmpPhoto({ file, fileName: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB' });
                           }
                         }} />
                      </label>
                    )}
                  </div>
                  
                  {/* Right Column: Documents */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h4 className="text-lg font-bold text-slate-700">Identity Documents</h4>
                      {empDocs.length < 4 && (
                        <button type="button" onClick={addDocument} className="text-xs font-bold text-hct-blue bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1 transition-colors">
                          <Plus className="w-4 h-4"/> Add Document
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {empDocs.map((doc, index) => (
                        <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative group hover:border-slate-300 transition-colors">
                          {empDocs.length > 1 && (
                            <button type="button" onClick={() => removeDocument(doc.id)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 p-1.5 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                          )}
                          <div className="mb-3 pr-10">
                            <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Document Name</label>
                            <input type="text" placeholder="e.g. Passport, Emirates ID" value={doc.title} onChange={(e) => handleDocTitleChange(doc.id, e.target.value)} className="w-full p-2.5 rounded-xl border border-slate-300 text-sm outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100 bg-white font-semibold" required />
                          </div>
                          
                          <label className="text-xs font-bold text-slate-500 mb-1 block uppercase tracking-wider">Upload File</label>
                          {doc.fileName ? (
                             <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-emerald-200 text-sm">
                               <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/>
                               <div className="flex-1 min-w-0">
                                 <p className="font-bold text-slate-700 truncate">{doc.fileName}</p>
                                 <p className="text-xs text-slate-500">{doc.size}</p>
                               </div>
                               <button type="button" onClick={() => handleDocFileUpload(doc.id, null)} className="text-slate-400 hover:text-red-500 shrink-0"><Trash2 className="w-4 h-4"/></button>
                             </div>
                           ) : (
                             <label className="flex items-center justify-center gap-2 bg-white border border-slate-300 border-dashed rounded-xl p-4 cursor-pointer hover:bg-slate-50 hover:border-hct-blue transition-colors text-sm font-bold text-slate-600">
                               <UploadCloud className="w-5 h-5 text-slate-400"/> <span>Browse File</span>
                               <input type="file" required={!doc.fileName} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocFileUpload(doc.id, e.target.files[0])} />
                             </label>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
                  <button type="button" onClick={() => setShowAddEmployee(false)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-3 bg-hct-blue hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center gap-2">Add Employee <ArrowRight className="w-4 h-4"/></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showCreatePass && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-[24px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 w-full max-w-4xl relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white"><FileSignature className="w-6 h-6 text-hct-blue" /> Create Pass Request</h3>
                <button onClick={() => {setShowCreatePass(false); setPassStep(1); setSelectedEmpsForPass([]);}} className="text-slate-500 font-bold hover:text-slate-800 transition-colors">Cancel & Return</button>
              </div>

              {passStep === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-4">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800 dark:text-white">1. Select Employees</h4>
                      <p className="text-slate-500 text-sm mt-1">{selectedContractor?.name}</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setSelectedEmpsForPass((employees[selectedContractor?.id] || []).filter(e => e.status === 'Approved').map(e => e.id))} className="text-sm font-bold text-blue-600 hover:underline">Select All</button>
                      <button onClick={() => setSelectedEmpsForPass([])} className="text-sm font-bold text-slate-500 hover:underline">Clear All</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(employees[selectedContractor?.id] || []).filter(e => e.status === 'Approved').map(emp => (
                      <label key={emp.id} className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 flex gap-4 items-center overflow-hidden border ${selectedEmpsForPass.includes(emp.id) ? 'border-hct-blue bg-blue-50/60 dark:bg-blue-900/30 shadow-lg shadow-blue-900/10 scale-[1.01]' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 hover:shadow-xl'}`}>
                        {selectedEmpsForPass.includes(emp.id) && <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-16 -mt-16 transition-all" />}
                        
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 transition-all z-10 ${selectedEmpsForPass.includes(emp.id) ? 'bg-hct-blue border-hct-blue text-white shadow-md' : 'border-slate-300 bg-slate-50 dark:bg-slate-700 dark:border-slate-600 hover:border-blue-300'}`}>
                          {selectedEmpsForPass.includes(emp.id) && <Check className="w-4 h-4"/>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selectedEmpsForPass.includes(emp.id)} onChange={(e) => {
                          if (e.target.checked) setSelectedEmpsForPass([...selectedEmpsForPass, emp.id]);
                          else setSelectedEmpsForPass(selectedEmpsForPass.filter(id => id !== emp.id));
                        }} />
                        
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 text-lg shadow-inner z-10 shrink-0">
                           {emp.name.split(' ').map(n=>n[0]).join('').substring(0,2)}
                        </div>

                        <div className="flex-1 z-10 min-w-0 pr-2">
                           <div className="flex items-center gap-2 mb-1.5">
                             <p className="font-bold text-[17px] text-slate-800 dark:text-white truncate">{emp.name}</p>
                             <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold shadow-sm">{emp.id}</span>
                           </div>
                           
                           <div className="flex flex-col gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                               <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 opacity-60 text-hct-blue"/> <span>{emp.role}</span></div>
                               <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 opacity-60 text-emerald-500"/> <span>{emp.nationality}</span></div>
                             </div>
                             <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 opacity-60 text-amber-500"/> <span>{emp.mobile}</span></div>
                             <div className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 opacity-60 text-purple-500"/> <span>{emp.email}</span></div>
                           </div>
                        </div>
                        
                        <div className="shrink-0 self-center z-10">
                           <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Viewing document: ${emp.document || 'Document.pdf'}`); }} 
                                   className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all duration-300 border border-slate-200 dark:border-slate-600 hover:border-blue-200 hover:scale-110 shadow-sm" title="View Document">
                             <FileText className="w-5 h-5" />
                           </button>
                        </div>
                      </label>
                    ))}
                    {(employees[selectedContractor?.id] || []).filter(e => e.status === 'Approved').length === 0 && <p className="text-slate-500 italic col-span-full">No approved employees available.</p>}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => {setShowCreatePass(false); setPassStep(1);}} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Back</button>
                    <button onClick={() => {if(selectedEmpsForPass.length > 0) setPassStep(2); else alert('Select at least one employee');}} className="px-8 py-3 bg-blue-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 shadow-md">Visit Period <ArrowRight className="w-4 h-4"/></button>
                  </div>
                </div>
              )}

              {passStep === 2 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">2. Requested Visit Period</h4>
                  {periodError && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl font-bold text-sm border border-red-200">{periodError}</div>}
                  
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div>
                      <label className="text-sm font-bold block mb-1 text-slate-700 dark:text-slate-300">Start Date *</label>
                      <input type="date" value={visitPeriod.startDate} onChange={(e) => setVisitPeriod({...visitPeriod, startDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-hct-blue bg-white dark:bg-slate-700 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1 text-slate-700 dark:text-slate-300">End Date *</label>
                      <input type="date" value={visitPeriod.endDate} onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 outline-none focus:ring-2 focus:ring-hct-blue bg-white dark:bg-slate-700 dark:text-white" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => setPassStep(1)} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Back</button>
                    <button onClick={handlePeriodNext} className="px-8 py-3 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 shadow-md">Next: HSE <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                  </div>
                </div>
              )}

              {passStep === 3 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">3. HSE Training & Acknowledgment</h4>
                  
                  <div className="bg-slate-900 rounded-2xl h-48 mb-4 flex flex-col items-center justify-center text-white relative">
                    {hseStatus === 'Completed' ? (
                      <div className="text-emerald-400 flex flex-col items-center"><CheckCircle2 className="w-12 h-12 mb-2"/> <p className="font-bold">Training Completed</p></div>
                    ) : hseStatus === 'In Progress' ? (
                      <div className="text-blue-400 flex flex-col items-center animate-pulse"><ShieldCheck className="w-12 h-12 mb-2"/> <p className="font-bold">Playing Video...</p></div>
                    ) : (
                      <button onClick={simulateHseVideo} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Watch HSE Video</button>
                    )}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5"/> Admin Declaration</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 italic">"I hereby confirm that I am authorized to request gate passes on behalf of the selected contractor company."</p>
                    
                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${declaration ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`}>
                      <input type="checkbox" checked={declaration} onChange={() => setDeclaration(!declaration)} className="mt-1 w-5 h-5" />
                      <span className="font-bold text-slate-800 dark:text-white text-sm">I agree to the above declaration.</span>
                    </label>
                    
                    {declaration && (
                      <div className="mt-4">
                        <label className="text-xs font-bold text-slate-500 uppercase">Digital Signature (Name)</label>
                        <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Type your full name" className="w-full p-3 border-b-2 border-slate-300 dark:border-slate-600 outline-none focus:border-hct-blue bg-transparent font-medium dark:text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => setPassStep(2)} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Back</button>
                    <button onClick={() => {if(hseStatus === 'Completed' && declaration && signature) setPassStep(4); else alert('Complete HSE, accept declaration and sign.');}} className="px-8 py-3 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 shadow-md">Review Request <ArrowRight className="inline w-4 h-4 ml-1"/></button>
                  </div>
                </div>
              )}

              {passStep === 4 && (
                <div className="space-y-6">
                  <h4 className="font-bold text-lg text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">4. Review Request</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b dark:border-slate-700 pb-2">Contractor Details</h5>
                      <div className="text-sm space-y-2">
                        <p className="grid grid-cols-2"><span className="text-slate-500">Company</span><strong className="text-slate-800 dark:text-white">{selectedContractor?.name}</strong></p>
                        <p className="grid grid-cols-2"><span className="text-slate-500">Contract No</span><strong className="text-slate-800 dark:text-white">{selectedContractor?.contractNumber}</strong></p>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                      <h5 className="font-bold text-blue-600 uppercase tracking-wider mb-4 border-b border-blue-200 dark:border-blue-800 pb-2">Visit Details</h5>
                      <div className="text-sm space-y-2">
                        <p className="grid grid-cols-2"><span className="text-slate-600 dark:text-slate-400">Start Date</span><strong className="text-slate-800 dark:text-white">{visitPeriod.startDate}</strong></p>
                        <p className="grid grid-cols-2"><span className="text-slate-600 dark:text-slate-400">End Date</span><strong className="text-slate-800 dark:text-white">{visitPeriod.endDate}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <h5 className="font-bold text-slate-500 uppercase tracking-wider mb-4 border-b dark:border-slate-700 pb-2">Selected Employees ({selectedEmpsForPass.length})</h5>
                    <div className="max-h-40 overflow-y-auto">
                      <table className="w-full text-sm text-left">
                        <thead><tr className="text-slate-500 border-b dark:border-slate-700"><th>Name</th><th>ID</th></tr></thead>
                        <tbody>
                          {selectedEmpsForPass.map(id => {
                            const emp = (employees[selectedContractor?.id] || []).find(e => e.id === id);
                            return <tr key={id} className="border-b dark:border-slate-700 last:border-0"><td className="py-2 font-bold dark:text-white">{emp?.name}</td><td className="py-2 dark:text-slate-300">{id}</td></tr>;
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={() => setPassStep(3)} className="px-6 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Edit</button>
                    <button onClick={handleCreatePassRequest} className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/30">Submit Pass Request</button>
                  </div>
                </div>
              )}

              {passStep === 5 && (
                 <div className="text-center py-12 animate-in zoom-in-95">
                   <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                   <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Pass Request Submitted!</h3>
                   <p className="text-slate-500 max-w-md mx-auto mb-6">Your pass request has been successfully submitted for {selectedEmpsForPass.length} employees and is pending approval.</p>
                   <button onClick={() => {setShowCreatePass(false); setPassStep(1); setSelectedEmpsForPass([]);}} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700">Close</button>
                 </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Send Registration Link</h3>
              <p className="text-sm text-slate-500 mb-6">Send an email with a unique registration link to the contractor.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus *</label>
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

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contact Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={sendLinkData.contactNumber || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, contactNumber: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. +971 50 123 4567"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contractor Email *</label>
                  <input 
                    type="email" 
                    required
                    value={sendLinkData.contractorEmail || ''} 
                    onChange={(e) => setSendLinkData({...sendLinkData, contractorEmail: e.target.value})} 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
                    placeholder="e.g. contact@example.com"
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

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl z-[200] flex items-center gap-3 font-bold"
          >
            <div className="w-8 h-8 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {showRenewRequest && selectedContractor && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[110] p-4">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-[24px] max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setShowRenewRequest(false)} className="absolute top-6 right-6 p-2 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors z-10"><X className="w-5 h-5"/></button>
            <div className="p-8 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Renew Contractor Registration</h2>
              <p className="text-slate-500 mt-1">Submit updated contract validity dates and documents.</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Left Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 border-b pb-2"><Building2 className="w-5 h-5 text-hct-blue"/> Company Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2"><label className="text-xs font-bold block mb-1">Contract Company Name *</label><input type="text" readOnly value={selectedContractor.name} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none" /></div>
                    <div className="col-span-2"><label className="text-xs font-bold block mb-1">Contract Number *</label><input type="text" defaultValue={selectedContractor.contractNumber} onChange={(e) => setRenewForm({...renewForm, contractNumber: e.target.value})} className="w-full p-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-hct-blue" /></div>
                    <div className="col-span-2"><label className="text-xs font-bold block mb-1">Job Description *</label><textarea readOnly value={selectedContractor.jobDescription || "General Maintenance and Facilities Management"} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none h-16" /></div>
                    <div><label className="text-xs font-bold block mb-1">Primary Contact</label><input type="text" readOnly value={selectedContractor.contactName || '-'} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none" /></div>
                    <div><label className="text-xs font-bold block mb-1">Contact Mobile</label><input type="text" readOnly value={selectedContractor.contactMobile || '-'} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none" /></div>
                    <div className="col-span-2"><label className="text-xs font-bold block mb-1">Contact Email</label><input type="text" readOnly value={selectedContractor.contactEmail || '-'} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none" /></div>
                    <div className="col-span-2"><label className="text-xs font-bold block mb-1">Address</label><input type="text" readOnly value={selectedContractor.address || '-'} className="w-full p-2 text-sm rounded-lg border border-slate-300 bg-slate-50 text-slate-600 font-bold outline-none" /></div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 border-b pb-2"><Calendar className="w-5 h-5 text-hct-blue"/> Contract & Validity Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-bold block mb-1">Contract Start *</label><input type="date" value={renewForm.contractStart} onChange={(e) => setRenewForm({...renewForm, contractStart: e.target.value})} className="w-full p-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-hct-blue" /></div>
                    <div><label className="text-xs font-bold block mb-1">Contract Expiry *</label><input type="date" value={renewForm.contractExpiry} onChange={(e) => setRenewForm({...renewForm, contractExpiry: e.target.value})} className="w-full p-2 text-sm rounded-lg border border-slate-300 outline-none focus:border-hct-blue" /></div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold block">Contract Documents * (PDF, JPG, PNG)</label>
                      <button onClick={() => setRenewDocs([...renewDocs, {id: Date.now(), title: '', file: null, fileName: '', size: ''}])} className="text-[10px] font-bold text-hct-blue hover:underline flex items-center gap-1"><Plus className="w-3 h-3"/> Add Document</button>
                    </div>
                    <div className="space-y-3">
                      {renewDocs.map((doc, idx) => (
                        <div key={doc.id} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                          <input type="text" placeholder="Document Name (e.g. Trade License)" value={doc.title} onChange={(e) => { const nd = [...renewDocs]; nd[idx].title = e.target.value; setRenewDocs(nd); }} className="flex-1 p-2 rounded-lg border border-slate-300 text-sm outline-none" />
                          <label className="cursor-pointer border border-slate-300 border-dashed rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:text-hct-blue hover:border-hct-blue transition-colors bg-white">
                            <UploadCloud className="w-4 h-4 inline mr-2"/> {doc.fileName ? 'Change' : 'Upload'} File
                            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const file = e.target.files[0]; if(file) { const nd = [...renewDocs]; nd[idx].file = file; nd[idx].fileName = file.name; nd[idx].size = (file.size/1024/1024).toFixed(2)+' MB'; setRenewDocs(nd); } }} />
                          </label>
                          {doc.fileName && <div className="text-xs text-emerald-600 font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1"/> {doc.fileName}</div>}
                          {renewDocs.length > 1 && <button onClick={() => setRenewDocs(renewDocs.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
            </div>
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button onClick={() => { alert('Renewal request submitted successfully!'); setShowRenewRequest(false); }} className="px-8 py-3 bg-blue-800 text-white rounded-xl font-bold shadow-md hover:bg-blue-900 transition-colors flex items-center gap-2">Submit Renew Request <ArrowRight className="w-4 h-4"/></button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

export default ContractorHub;









