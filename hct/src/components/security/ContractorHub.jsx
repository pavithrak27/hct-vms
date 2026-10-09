import React, { useState, useEffect } from 'react';
import { Building2, Users, FileSignature, CheckCircle2, Search, ArrowRight, ShieldCheck, CheckSquare, Plus, FileText, ChevronLeft, QrCode, Mail, Send, RefreshCw, X, UploadCloud, Trash2, Camera, Calendar, History, Eye, Download, MapPin, Phone, Check, User, ArrowRightLeft, ShieldAlert, Lock, Unlock, Clock, Ban } from 'lucide-react';
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

const mockRenewalHistory = {
  'CON-2026-101': [
    {
      id: 'REN-2026-01',
      contractorId: 'CON-2026-101',
      contractorName: 'Tech Solutions LLC',
      contractNumber: 'CT-2025-9981',
      dateOfRenewal: '2026-09-15',
      previousExpiry: '2026-11-01',
      newExpiry: '2027-11-01',
      renewedBy: 'Ahmed Hassan (Security Admin)',
      status: 'Approved',
      documents: ['Trade_License_2026.pdf', 'Contract_Extension_v2.pdf']
    },
    {
      id: 'REN-2025-01',
      contractorId: 'CON-2026-101',
      contractorName: 'Tech Solutions LLC',
      contractNumber: 'CT-2025-9981',
      dateOfRenewal: '2025-08-22',
      previousExpiry: '2025-11-01',
      newExpiry: '2026-11-01',
      renewedBy: 'Security Admin',
      status: 'Approved',
      documents: ['Initial_Contract_2025.pdf']
    }
  ],
  'CON-2026-102': [
    {
      id: 'REN-2026-02',
      contractorId: 'CON-2026-102',
      contractorName: 'Global Facilities Mgt',
      contractNumber: 'FM-2026-1122',
      dateOfRenewal: '2026-10-01',
      previousExpiry: '2026-10-15',
      newExpiry: '2028-10-14',
      renewedBy: 'Sarah Jenkins (Facility Lead)',
      status: 'Pending Approval',
      documents: ['Renewal_Application_2026.pdf', 'Commercial_Register.pdf']
    }
  ],
  'CON-2026-103': [
    {
      id: 'REN-2023-01',
      contractorId: 'CON-2026-103',
      contractorName: 'Al Jaber Construction',
      contractNumber: 'AJC-2022-005',
      dateOfRenewal: '2023-11-20',
      previousExpiry: '2022-12-01',
      newExpiry: '2023-12-01',
      renewedBy: 'Mohammed Al Jaber',
      status: 'Expired',
      documents: ['Contract_Amendment_2023.pdf']
    }
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
  const [generatedPasses, setGeneratedPasses] = useState(generatedPassesData);

  // Transfer Flow State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTargetItem, setTransferTargetItem] = useState(null);
  const [transferTargetType, setTransferTargetType] = useState('employee'); // 'employee' | 'pass'
  const [transferCampus, setTransferCampus] = useState("Abu Dhabi Men's Campus");
  const [transferHost, setTransferHost] = useState('');
  const [transferDate, setTransferDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
  const [transferNotes, setTransferNotes] = useState('');
  const [showTransferSuccess, setShowTransferSuccess] = useState(false);

  // Block / Security Action State
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockTargetItem, setBlockTargetItem] = useState(null);
  const [blockTargetType, setBlockTargetType] = useState('employee'); // 'employee' | 'pass'
  const [securityActionType, setSecurityActionType] = useState('block'); // 'block' | 'temp' | 'perm'
  const [securityReleaseDate, setSecurityReleaseDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
  const [blockNotes, setBlockNotes] = useState('');

  const handleOpenTransfer = (item, type) => {
    setTransferTargetItem(item);
    setTransferTargetType(type);
    setTransferCampus("Abu Dhabi Men's Campus");
    setTransferHost('');
    setTransferDate(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
    setTransferNotes('');
    setShowTransferModal(true);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if (!transferTargetItem) return;
    const cid = selectedContractor?.id || 'CON-2026-101';

    if (transferTargetType === 'employee') {
      const updatedList = (employees[cid] || []).map(emp => 
        emp.id === transferTargetItem.id 
          ? { ...emp, campus: transferCampus, transferredTo: transferHost, transferNotes } 
          : emp
      );
      setEmployees({ ...employees, [cid]: updatedList });
    } else {
      const updatedList = (generatedPasses[cid] || []).map(pass => 
        pass.passId === transferTargetItem.passId 
          ? { ...pass, campus: transferCampus, transferredTo: transferHost, transferNotes } 
          : pass
      );
      setGeneratedPasses({ ...generatedPasses, [cid]: updatedList });
    }

    setShowTransferModal(false);
    setShowTransferSuccess(true);
    showToast(`Transferred ${transferTargetItem.name || transferTargetItem.empName} to ${transferCampus}`);
  };

  const handleOpenBlock = (item, type) => {
    setBlockTargetItem(item);
    setBlockTargetType(type);
    setSecurityActionType(item.status === 'Blocked' ? 'temp' : 'block');
    setBlockNotes('');
    setShowBlockModal(true);
  };

  const handleBlockConfirm = () => {
    if (!blockNotes.trim()) {
      alert("Mandatory reason / note required for security action.");
      return;
    }
    if (!blockTargetItem) return;
    const cid = selectedContractor?.id || 'CON-2026-101';

    let newStatus = 'Approved';
    if (securityActionType === 'block') newStatus = 'Blocked';
    if (securityActionType === 'temp') newStatus = 'Temporarily Released';
    if (securityActionType === 'perm') newStatus = blockTargetType === 'pass' ? 'Active' : 'Approved';

    if (blockTargetType === 'employee') {
      const updatedList = (employees[cid] || []).map(emp => 
        emp.id === blockTargetItem.id 
          ? { ...emp, status: newStatus, isBlocked: securityActionType === 'block', blockReason: blockNotes } 
          : emp
      );
      setEmployees({ ...employees, [cid]: updatedList });
    } else {
      const updatedList = (generatedPasses[cid] || []).map(pass => 
        pass.passId === blockTargetItem.passId 
          ? { ...pass, status: newStatus, isBlocked: securityActionType === 'block', blockReason: blockNotes } 
          : pass
      );
      setGeneratedPasses({ ...generatedPasses, [cid]: updatedList });
    }

    setShowBlockModal(false);
    setBlockTargetItem(null);
    showToast(`Security action updated: ${newStatus}`);
  };

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
    if (!visitPeriod.startDate || !visitPeriod.endDate || !visitPeriod.campus) {
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[150] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl font-bold text-sm border border-slate-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Contractors Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage contractors, employees, transfers, and security controls from one unified dashboard.</p>
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
                        <th className="p-4 font-bold uppercase">Contractor Employee ID</th>
                        <th className="p-4 font-bold uppercase">Nationality</th>
                        <th className="p-4 font-bold uppercase">Mobile Number</th>
                        <th className="p-4 font-bold uppercase">Role</th>
                        <th className="p-4 font-bold uppercase">Document</th>
                        <th className="p-4 font-bold uppercase">Status</th>
                        <th className="p-4 font-bold uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(employees[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="8" className="p-8 text-center text-slate-500">No employees found.</td></tr>
                      ) : (employees[selectedContractor.id] || []).map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random`} alt={emp.name} className="w-8 h-8 rounded-full border border-slate-200 shrink-0" />
                            <div>
                              <p>{emp.name}</p>
                              {emp.campus && <p className="text-[10px] text-blue-600 font-semibold">{emp.campus}</p>}
                            </div>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                              emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                              emp.status === 'Blocked' ? 'bg-red-100 text-red-700' :
                              emp.status === 'Temporarily Released' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenTransfer(emp, 'employee')}
                                title="Transfer Employee"
                                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-hct-blue bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5 text-hct-blue" />
                                Transfer
                              </button>
                              
                              {emp.status === 'Blocked' ? (
                                <button
                                  onClick={() => handleOpenBlock(emp, 'employee')}
                                  title="Unblock / Security Action"
                                  className="px-2.5 py-1 text-xs font-bold bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg flex items-center gap-1 border border-amber-200"
                                >
                                  <Unlock className="w-3.5 h-3.5" />
                                  Unblock
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleOpenBlock(emp, 'employee')}
                                  title="Block Employee"
                                  className="px-2.5 py-1 text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 rounded-lg flex items-center gap-1 border border-red-200"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Block
                                </button>
                              )}
                            </div>
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
                      {(generatedPasses[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-slate-500">No generated passes found.</td></tr>
                      ) : (generatedPasses[selectedContractor.id] || []).map(pass => (
                        <tr key={pass.passId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4"><input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-hct-blue focus:ring-hct-blue" /></td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800 dark:text-white">{pass.passId}</p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              pass.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                              pass.status === 'Blocked' ? 'bg-red-100 text-red-700' :
                              pass.status === 'Temporarily Released' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                            }`}>{pass.status}</span>
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
                            <button onClick={() => setShowQR(pass.passId)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="View Pass QR"><Eye className="w-5 h-5"/></button>
                            <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Download PDF"><Download className="w-5 h-5"/></button>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                      <History className="w-6 h-6 text-hct-blue"/> Renewal History
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Historical log of contractor renewal milestones and contract validity updates.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => showToast('Renewal History report exported successfully!')} 
                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-bold shadow-sm transition-all shrink-0 border border-slate-200 dark:border-slate-700"
                    >
                      <Download className="w-4 h-4 text-hct-blue"/> Export
                    </button>
                    {selectedContractor.status === 'Expired' && (
                      <button onClick={() => setShowRenewRequest(true)} className="flex items-center gap-2 px-5 py-2.5 bg-hct-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all shrink-0">
                        <RefreshCw className="w-4 h-4"/> Submit Renewal Request
                      </button>
                    )}
                  </div>
                </div>

                {/* Renewal Log Table */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-3">
                    <h4 className="font-bold text-slate-800 dark:text-white text-base">Renewal Audit Log</h4>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => showToast('Renewal History report exported successfully!')}
                        className="px-3.5 py-1.5 bg-hct-blue hover:bg-blue-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Export
                      </button>
                      <span className="text-xs font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                        {(mockRenewalHistory[selectedContractor.id] || []).length} Records Found
                      </span>
                    </div>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold uppercase">Contractor / ID</th>
                        <th className="p-4 font-bold uppercase">Date of Renewal</th>
                        <th className="p-4 font-bold uppercase">Previous Expiry</th>
                        <th className="p-4 font-bold uppercase">New Expiry</th>
                        <th className="p-4 font-bold uppercase">Renewed By</th>
                        <th className="p-4 font-bold uppercase">Status</th>
                        <th className="p-4 font-bold uppercase text-right">Documents</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(mockRenewalHistory[selectedContractor.id] || [
                        {
                          id: 'REN-DEFAULT-01',
                          contractorId: selectedContractor.id,
                          contractorName: selectedContractor.name,
                          contractNumber: selectedContractor.contractNumber,
                          dateOfRenewal: '2026-09-15',
                          previousExpiry: '2026-11-01',
                          newExpiry: selectedContractor.expiry,
                          renewedBy: selectedContractor.contactName || 'Admin User',
                          status: selectedContractor.status,
                          documents: ['Trade_License.pdf', 'Contract_Extension.pdf']
                        }
                      ]).map((ren, idx) => (
                        <tr key={ren.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-800 dark:text-white">{ren.contractorName}</div>
                            <div className="text-xs text-slate-500 font-mono">{ren.contractorId} • {ren.contractNumber}</div>
                          </td>
                          <td className="p-4 font-bold text-slate-800 dark:text-white">{ren.dateOfRenewal}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{ren.previousExpiry}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{ren.newExpiry}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{ren.renewedBy}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ren.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : ren.status === 'Expired' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'}`}>
                              {ren.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex flex-col items-end gap-1">
                              {(ren.documents || ['Document_v1.pdf']).map((docName, dIdx) => (
                                <button key={dIdx} onClick={() => alert(`Downloading/Viewing ${docName} for ${selectedContractor.name}`)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs font-bold transition-colors flex items-center gap-1">
                                  <FileText className="w-3 h-3"/> {docName}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
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
                            <label className="border border-slate-300 border-dashed rounded-xl p-4 text-center block cursor-pointer hover:border-hct-blue transition-colors bg-white">
                              <UploadCloud className="w-6 h-6 text-slate-300 mx-auto mb-1"/>
                              <span className="text-xs font-bold text-hct-blue">Upload File</span>
                              <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleDocFileUpload(doc.id, e.target.files[0])} />
                            </label>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                  <button type="button" onClick={() => setShowAddEmployee(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md">Add Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showSendLinkModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setShowSendLinkModal(false)}
                className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5"/>
              </button>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-hct-blue"/> Send Contractor Registration Link
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Send an onboarding invite link directly to the contractor representative.</p>

              <form onSubmit={handleSendLink} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus *</label>
                  <select 
                    value={sendLinkData.campus}
                    onChange={(e) => setSendLinkData({...sendLinkData, campus: e.target.value})}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-sm"
                  >
                    <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                    <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                    <option value="Dubai Women's Campus">Dubai Women's Campus</option>
                    <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contact Number *</label>
                  <input 
                    type="text" 
                    required 
                    value={sendLinkData.contactNumber}
                    onChange={(e) => setSendLinkData({...sendLinkData, contactNumber: e.target.value})}
                    placeholder="+971 50 123 4567" 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contractor Email *</label>
                  <input 
                    type="email" 
                    required 
                    value={sendLinkData.contractorEmail}
                    onChange={(e) => setSendLinkData({...sendLinkData, contractorEmail: e.target.value})}
                    placeholder="representative@contractor.com" 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-sm"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowSendLinkModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-700 shadow-md">Send Link</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Create Pass Request Modal */}
        {showCreatePass && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <FileSignature className="w-6 h-6 text-hct-blue" />
                    Create Gate Pass Request
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                    Company: <span className="text-slate-800 dark:text-white font-bold">{selectedContractor?.name}</span> ({selectedContractor?.contractNumber})
                  </p>
                </div>
                <button type="button" onClick={() => setShowCreatePass(false)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                if (selectedEmpsForPass.length === 0) {
                  alert("Please select at least one employee.");
                  return;
                }
                if (!visitPeriod.startDate || !visitPeriod.endDate) {
                  alert("Please specify the visit start and end dates.");
                  return;
                }
                const cid = selectedContractor?.id || 'CON-2026-101';
                const newReq = { 
                  id: `PR-${Math.floor(Math.random() * 900) + 100}`, 
                  date: new Date().toISOString().split('T')[0], 
                  employees: selectedEmpsForPass.length, 
                  status: 'Pending Approval', 
                  start: visitPeriod.startDate, 
                  end: visitPeriod.endDate 
                };
                setPassRequests({ ...passRequests, [cid]: [...(passRequests[cid] || []), newReq] });
                
                // Add generated pass preview entries for active table
                const selectedEmpsList = (employees[cid] || []).filter(e => selectedEmpsForPass.includes(e.id));
                const newGeneratedPasses = selectedEmpsList.map((emp, idx) => ({
                  passId: `PASS-${Math.floor(Math.random() * 90000) + 10000}`,
                  empName: emp.name,
                  empId: emp.id,
                  status: 'Active',
                  validFrom: `${visitPeriod.startDate} 08:00 AM`,
                  validTo: `${visitPeriod.endDate} 06:00 PM`,
                  photo: `https://i.pravatar.cc/150?u=${emp.id}`
                }));
                
                setGeneratedPasses({ ...generatedPasses, [cid]: [...(generatedPasses[cid] || []), ...newGeneratedPasses] });

                setShowCreatePass(false);
                setSelectedEmpsForPass([]);
                setVisitPeriod({ startDate: '', endDate: '' });
                showToast(`Pass Request (${newReq.id}) submitted successfully!`);
              }} className="space-y-6">

                {/* Employee Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">
                    Select Personnel / Employees *
                  </label>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 max-h-48 overflow-y-auto">
                    {(employees[selectedContractor?.id] || []).length === 0 ? (
                      <p className="text-xs text-slate-400 font-semibold text-center py-4">No registered employees found. Please add employees first.</p>
                    ) : (
                      (employees[selectedContractor?.id] || []).map(emp => {
                        const isChecked = selectedEmpsForPass.includes(emp.id);
                        return (
                          <label key={emp.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                              <input 
                                type="checkbox" 
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedEmpsForPass([...selectedEmpsForPass, emp.id]);
                                  else setSelectedEmpsForPass(selectedEmpsForPass.filter(id => id !== emp.id));
                                }}
                                className="w-4 h-4 rounded text-hct-blue focus:ring-hct-blue" 
                              />
                              <div>
                                <p className="font-bold text-xs text-slate-800 dark:text-white">{emp.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{emp.id} • {emp.role}</p>
                              </div>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                              {emp.status}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Dates & Campus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Pass Start Date *</label>
                    <input 
                      type="date" 
                      required 
                      value={visitPeriod.startDate} 
                      onChange={(e) => setVisitPeriod({...visitPeriod, startDate: e.target.value})} 
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Pass End Date *</label>
                    <input 
                      type="date" 
                      required 
                      value={visitPeriod.endDate} 
                      onChange={(e) => setVisitPeriod({...visitPeriod, endDate: e.target.value})} 
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Target Campus *</label>
                  <select 
                    required 
                    defaultValue="Abu Dhabi Men's Campus"
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-xs font-semibold"
                  >
                    <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                    <option value="Abu Dhabi Women's Campus">Abu Dhabi Women's Campus</option>
                    <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                    <option value="Dubai Women's Campus">Dubai Women's Campus</option>
                    <option value="Sharjah Campus">Sharjah Campus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Work Purpose / Notes</label>
                  <textarea 
                    rows="2" 
                    placeholder="Enter work details or job specifications..." 
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-hct-blue text-xs resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setShowCreatePass(false)} className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs">Cancel</button>
                  <button type="submit" className="px-8 py-2.5 bg-hct-blue hover:bg-blue-800 text-white rounded-xl font-bold transition-all shadow-md text-xs">Submit Pass Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      {showTransferModal && transferTargetItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                Transfer visitor <span className="font-bold text-slate-900 dark:text-white">{transferTargetItem.name || transferTargetItem.empName || transferTargetItem.id}</span> to another campus.
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferSuccess(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-sm p-8 text-center overflow-hidden z-10">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 dark:border-emerald-900/10">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Transfer Successful!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Contractor <span className="font-bold text-slate-700 dark:text-slate-300">{transferTargetItem?.name || transferTargetItem?.empName}</span> has been transferred to <span className="font-bold text-slate-700 dark:text-slate-300">{transferCampus}</span> effective <span className="font-bold text-slate-700 dark:text-slate-300">{transferDate}</span>.
            </p>
            <button onClick={() => setShowTransferSuccess(false)} className="w-full py-3 rounded-xl bg-hct-blue text-white font-bold hover:bg-blue-900 transition-colors">
              Done
            </button>
          </motion.div>
        </div>
      )}

      {/* Security Block / Unblock Modal */}
      {showBlockModal && blockTargetItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200 dark:border-slate-800 z-10">
            <button 
              onClick={() => { setShowBlockModal(false); setBlockTargetItem(null); }}
              className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center mb-6 flex items-center justify-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                {blockTargetItem.status === 'Blocked' ? 'Select Security Unblock Action' : 'Block Contractor Employee / Pass'}
              </h3>
              
              {blockTargetItem.status === 'Blocked' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Temporary Unblock */}
                  <button
                    type="button"
                    onClick={() => setSecurityActionType('temp')}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${securityActionType === 'temp' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${securityActionType === 'temp' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                      <Clock className={`w-5 h-5 ${securityActionType === 'temp' ? 'text-blue-600' : 'text-blue-400'}`} />
                    </div>
                    <span className={`font-bold text-sm ${securityActionType === 'temp' ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>Temporary Release</span>
                  </button>

                  {/* Permanent Unblock */}
                  <button
                    type="button"
                    onClick={() => setSecurityActionType('perm')}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all ${securityActionType === 'perm' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${securityActionType === 'perm' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-emerald-50 dark:bg-emerald-900/20'}`}>
                      <Unlock className={`w-5 h-5 ${securityActionType === 'perm' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                    </div>
                    <span className={`font-bold text-sm ${securityActionType === 'perm' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Permanent Unblock</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-center mb-6">
                  <div className="w-full flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-red-100 dark:bg-red-900/50">
                      <Ban className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-bold text-red-700 dark:text-red-400 text-sm">Block Contractor Access</span>
                    <p className="text-xs text-red-600 dark:text-red-300 mt-1 text-center font-medium">
                      This contractor will be flagged and denied entry across all campus gates.
                    </p>
                  </div>
                </div>
              )}

              {securityActionType === 'temp' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Release Expiry Date *</label>
                  <input 
                    type="date"
                    value={securityReleaseDate}
                    onChange={(e) => setSecurityReleaseDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">Contractor access is temporarily restored until this date.</p>
                </motion.div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-400 block mb-1">Reason / Notes *</label>
                <textarea 
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  placeholder="Provide a mandatory reason or explanation for this security action..."
                  className="w-full p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500 text-xs resize-none"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => { setShowBlockModal(false); setBlockTargetItem(null); }} 
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBlockConfirm}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-hct-blue text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm shadow-md"
                >
                  Confirm Action
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ContractorHub;
