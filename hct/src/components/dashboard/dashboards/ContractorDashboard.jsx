import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import { 
  Building2, Users, FileSignature, CheckCircle2, Search, ArrowRight, 
  ShieldCheck, Plus, FileText, QrCode, RefreshCw, X, UploadCloud, 
  Trash2, Calendar, Clock, AlertCircle, Download, Check, User, Phone, Mail, MapPin, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shared Mock Data matching Contractor Hub
const contractorData = {
  id: 'CON-2026-101',
  name: 'Tech Solutions LLC',
  contractNumber: 'CT-2025-9981',
  status: 'Approved',
  expiry: '2027-11-01',
  contractStart: '2025-11-01',
  jobDescription: 'IT Infrastructure & Maintenance',
  contactName: 'Ahmed Hassan',
  contactEmail: 'ahmed@techsolutions.com',
  contactMobile: '+971 50 111 2222',
  address: 'Dubai Silicon Oasis, Dubai',
  campus: "Abu Dhabi Men's Campus"
};

const initialEmployees = [
  { id: 'EMP-001', name: 'John Smith', role: 'Technician', status: 'Approved', nationality: 'USA', mobile: '+971 50 123 4567', email: 'john@techsolutions.com', document: 'Passport.pdf' },
  { id: 'EMP-002', name: 'Sarah Jane', role: 'Engineer', status: 'Pending Approval', nationality: 'UK', mobile: '+971 55 987 6543', email: 'sarah@techsolutions.com', document: 'Emirates_ID.pdf' }
];

const initialPassRequests = [
  { id: 'PR-101', date: '2026-10-10', employees: 2, status: 'Pending', validFrom: '2026-10-10', validTo: '2026-10-13', campus: "Abu Dhabi Men's Campus" }
];

const initialGeneratedPasses = [
  { passId: 'PASS-00125', empName: 'John Smith', empId: 'EMP-001', status: 'Active', validFrom: '10-Oct-2026 08:00 AM', validTo: '13-Oct-2026 06:00 PM', photo: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
  { passId: 'PASS-00126', empName: 'Ravi Kumar', empId: 'EMP-002', status: 'Expired', validFrom: '01-Jan-2023 08:00 AM', validTo: '31-Dec-2023 06:00 PM', photo: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' }
];

export default function ContractorDashboard() {
  const { sessionUser } = useRole();
  const [employees, setEmployees] = useState(initialEmployees);
  const [passRequests, setPassRequests] = useState(initialPassRequests);
  const [generatedPasses, setGeneratedPasses] = useState(initialGeneratedPasses);

  // Search & Filter state
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedQRPass, setSelectedQRPass] = useState(null);

  // Modals
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showPassRequestModal, setShowPassRequestModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Add Employee Form State
  const [newEmp, setNewEmp] = useState({ id: '', name: '', nationality: '', mobile: '', role: '', document: '' });

  // Create Pass Request State
  const [passReqData, setPassReqData] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    campus: "Abu Dhabi Men's Campus",
    selectedEmpIds: ['EMP-001']
  });

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    if (!newEmp.name || !newEmp.role) return;
    const addedId = newEmp.id || `EMP-00${employees.length + 1}`;
    const added = {
      id: addedId,
      name: newEmp.name,
      role: newEmp.role,
      nationality: newEmp.nationality || 'UAE',
      mobile: newEmp.mobile || '+971 50 000 0000',
      status: 'Pending Approval',
      document: newEmp.document || 'Emirates_ID.pdf'
    };
    setEmployees([...employees, added]);
    setNewEmp({ id: '', name: '', nationality: '', mobile: '', role: '', document: '' });
    setShowAddEmployeeModal(false);
    triggerToast(`Employee ${added.name} registered successfully!`);
  };

  const handlePassRequestSubmit = (e) => {
    e.preventDefault();
    const newReq = {
      id: `PR-10${passRequests.length + 1}`,
      date: passReqData.startDate,
      employees: passReqData.selectedEmpIds.length,
      status: 'Pending Approval',
      validFrom: passReqData.startDate,
      validTo: passReqData.endDate,
      campus: passReqData.campus
    };
    setPassRequests([newReq, ...passRequests]);
    setShowPassRequestModal(false);
    triggerToast(`Gate Pass Request ${newReq.id} submitted for approval!`);
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    e.id.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    e.role.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  const approvedEmployeesCount = employees.filter(e => e.status === 'Approved').length;
  const pendingEmployeesCount = employees.filter(e => e.status.includes('Pending')).length;
  const activePassesCount = generatedPasses.filter(p => p.status === 'Active').length;

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-3 text-sm">
            <CheckCircle2 className="w-5 h-5"/> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Header & Company Profile Banner ── */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[28px] p-8 text-white shadow-xl relative overflow-hidden border border-blue-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hct-blue/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5"/> Approved Contractor Company
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5"/> Contract: {contractorData.contractNumber}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              {sessionUser?.companyId || contractorData.name}
            </h1>

            <p className="text-slate-300 text-sm font-medium flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-hct-blue"/> {contractorData.address}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400"/> Valid until {contractorData.expiry}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-blue-400"/> Rep: {contractorData.contactName} ({contractorData.contactMobile})</span>
            </p>
          </div>

          
        </div>
      </div>

      {/* ── Metric Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-hct-blue rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-7 h-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Employees</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{employees.length}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{approvedEmployeesCount} Approved • {pendingEmployeesCount} Pending</p>
          </div>
        </div>

        <div 
          onClick={() => {
            const element = document.getElementById('issued-passes-section');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <QrCode className="w-7 h-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Gate Passes</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{activePassesCount}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Valid Issued Passes</p>
          </div>
        </div>

        <div 
          className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileSignature className="w-7 h-7"/>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Requests</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{passRequests.length}</p>
            <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Submitted Requests</p>
          </div>
        </div>
      </div>

      {/* ── Grid Section: Issued Gate Passes & Pass Requests ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Issued Passes Card */}
        <div id="issued-passes-section" className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <QrCode className="w-5 h-5 text-hct-blue"/> Issued Employee Gate Passes
            </h3>
            <span className="text-xs font-bold text-slate-400">{generatedPasses.length} Total Passes</span>
          </div>

          <div className="space-y-3">
            {generatedPasses.map(pass => (
              <div key={pass.passId} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4 hover:border-blue-300 transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={pass.photo} alt={pass.empName} className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white text-xs truncate">{pass.empName}</p>
                    <p className="text-[10px] text-slate-400">ID: {pass.empId} • {pass.passId}</p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Valid: {pass.validFrom} - {pass.validTo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    pass.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {pass.status}
                  </span>
                  <button 
                    onClick={() => setSelectedQRPass(pass)}
                    className="p-2 bg-blue-50 hover:bg-blue-100 text-hct-blue dark:bg-slate-700 dark:hover:bg-slate-600 rounded-xl transition-colors"
                    title="View QR Code Pass"
                  >
                    <QrCode className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pass Requests Status Pipeline Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-hct-blue"/> Pass Requests Pipeline
            </h3>
            
          </div>

          <div className="space-y-3">
            {passRequests.map(req => (
              <div key={req.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-white">{req.id}</span>
                    <span className="text-xs text-slate-400">• {req.employees} Employees</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Campus: {req.campus}</p>
                  <p className="text-[10px] text-slate-400">Validity: {req.validFrom} to {req.validTo}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  req.status === 'Approved' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300' 
                    : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Registered Contractor Employees Table ── */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-hct-blue"/> Company Registered Employees
            </h3>
            <p className="text-xs text-slate-400 mt-1">Manage personnel authorized for gate pass issuance under {contractorData.name}.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                placeholder="Search employee or ID..." 
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium outline-none focus:ring-2 focus:ring-hct-blue"
              />
            </div>
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 text-slate-500 uppercase tracking-wider font-bold text-[10px]">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Contractor Employee ID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Nationality</th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4">Document</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 font-medium">No employees found matching search.</td>
                </tr>
              ) : filteredEmployees.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-hct-blue font-bold flex items-center justify-center shrink-0">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p>{emp.name}</p>
                      <p className="text-[10px] text-slate-400">{emp.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-600 dark:text-slate-300">{emp.id}</td>
                  <td className="p-4 font-medium text-slate-700 dark:text-slate-300">{emp.role}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{emp.nationality}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-400">{emp.mobile}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-[10px]">
                      <FileText className="w-3 h-3 text-hct-blue"/> {emp.document}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      emp.status === 'Approved' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Add Employee ── */}
      <AnimatePresence>
        {showAddEmployeeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-hct-blue"/> Register New Employee
                </h3>
                <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5"/></button>
              </div>

              <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Full Name *</label>
                  <input type="text" required value={newEmp.name} onChange={(e) => setNewEmp({...newEmp, name: e.target.value})} placeholder="e.g. John Doe" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Contractor Employee ID</label>
                    <input type="text" value={newEmp.id} onChange={(e) => setNewEmp({...newEmp, id: e.target.value})} placeholder="e.g. EMP-003" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Job Role *</label>
                    <input type="text" required value={newEmp.role} onChange={(e) => setNewEmp({...newEmp, role: e.target.value})} placeholder="e.g. Technician" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Nationality</label>
                    <input type="text" value={newEmp.nationality} onChange={(e) => setNewEmp({...newEmp, nationality: e.target.value})} placeholder="e.g. UAE" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Mobile Number</label>
                    <input type="text" value={newEmp.mobile} onChange={(e) => setNewEmp({...newEmp, mobile: e.target.value})} placeholder="+971 50 123 4567" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">ID Document (Emirates ID / Passport)</label>
                  <input type="text" value={newEmp.document} onChange={(e) => setNewEmp({...newEmp, document: e.target.value})} placeholder="Emirates_ID_Copy.pdf" className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-hct-blue text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md">Register Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: Gate Pass Request ── */}
      <AnimatePresence>
        {showPassRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-hct-blue"/> Request Gate Pass
                </h3>
                <button onClick={() => setShowPassRequestModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5"/></button>
              </div>

              <form onSubmit={handlePassRequestSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Campus *</label>
                  <select value={passReqData.campus} onChange={(e) => setPassReqData({...passReqData, campus: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-hct-blue">
                    <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                    <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                    <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Start Date *</label>
                    <input type="date" required value={passReqData.startDate} onChange={(e) => setPassReqData({...passReqData, startDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">End Date *</label>
                    <input type="date" required value={passReqData.endDate} onChange={(e) => setPassReqData({...passReqData, endDate: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs outline-none focus:ring-2 focus:ring-hct-blue" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">Include Employees</label>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    {employees.map(emp => (
                      <label key={emp.id} className="flex items-center gap-3 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={passReqData.selectedEmpIds.includes(emp.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPassReqData({...passReqData, selectedEmpIds: [...passReqData.selectedEmpIds, emp.id]});
                            } else {
                              setPassReqData({...passReqData, selectedEmpIds: passReqData.selectedEmpIds.filter(id => id !== emp.id)});
                            }
                          }}
                          className="w-4 h-4 text-hct-blue rounded"
                        />
                        {emp.name} ({emp.id})
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button type="button" onClick={() => setShowPassRequestModal(false)} className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-hct-blue text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-md">Submit Pass Request</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal: QR Code Pass Viewer ── */}
      <AnimatePresence>
        {selectedQRPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center border border-slate-200 dark:border-slate-800">
              <button onClick={() => setSelectedQRPass(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"><X className="w-5 h-5"/></button>
              
              <div className="mb-6 flex justify-center pt-2">
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <QrCode className="w-40 h-40 text-slate-800" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{selectedQRPass.empName}</h3>
              <p className="text-xs text-slate-400 font-mono mb-4">Pass ID: {selectedQRPass.passId} • {selectedQRPass.empId}</p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-6">
                Valid: {selectedQRPass.validFrom} to {selectedQRPass.validTo}
              </div>

              <button onClick={() => setSelectedQRPass(null)} className="w-full py-3 bg-hct-blue text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md">Close Pass</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
