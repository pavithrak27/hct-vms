import React, { useState } from 'react';
import { Building2, Users, FileSignature, CheckCircle2, Search, ArrowRight, ShieldCheck, CheckSquare, Plus, FileText, ChevronLeft, QrCode, Mail, Send, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContractorRegistration from '../contractor/ContractorRegistration';
import { useRole } from '../../context/RoleContext';

const contractorsList = [
  { id: 'CON-2026-101', name: 'Tech Solutions LLC', contractNumber: 'CT-2025-9981', status: 'Approved', expiry: '2027-11-01' },
  { id: 'CON-2026-102', name: 'Global Facilities Mgt', contractNumber: 'FM-2026-1122', status: 'Pending', expiry: '2028-10-14' },
  { id: 'CON-2026-103', name: 'Al Jaber Construction', contractNumber: 'AJC-2022-005', status: 'Expired', expiry: '2023-12-01' }
];

const mockEmployees = {
  'CON-2026-101': [
    { id: 'EMP-001', name: 'John Smith', role: 'Technician', status: 'Approved' },
    { id: 'EMP-002', name: 'Sarah Jane', role: 'Engineer', status: 'Pending Approval' }
  ],
  'CON-2026-102': [
    { id: 'EMP-003', name: 'Mike Ross', role: 'Cleaner', status: 'Approved' }
  ]
};

const mockPassRequests = {
  'CON-2026-101': [
    { id: 'PR-101', date: '2026-10-10', employees: 2, status: 'Approved' }
  ],
  'CON-2026-102': []
};

const ContractorHub = () => {
  const { currentRole } = useRole();
  const isAdmin = currentRole?.id === 'security' || currentRole?.id === 'superadmin' || currentRole?.portals?.includes('dashboard');

  const [selectedContractor, setSelectedContractor] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, employees, passes
  const [search, setSearch] = useState('');
  const [isAddingContractor, setIsAddingContractor] = useState(false);
  const [renewModalData, setRenewModalData] = useState(null);

  // Add Employee Form State
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', role: '' });

  // Create Pass Request State
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [selectedEmpsForPass, setSelectedEmpsForPass] = useState([]);

  // Send Link Modal State
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

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.role) return;
    const cid = selectedContractor.id;
    const added = { id: `EMP-00${Math.floor(Math.random() * 900) + 100}`, name: newEmployee.name, role: newEmployee.role, status: 'Pending Approval' };
    setEmployees({ ...employees, [cid]: [...(employees[cid] || []), added] });
    setNewEmployee({ name: '', role: '' });
    setShowAddEmployee(false);
  };

  const handleCreatePassRequest = () => {
    if (selectedEmpsForPass.length === 0) {
      alert("Please select at least one employee.");
      return;
    }
    const cid = selectedContractor.id;
    const newReq = { id: `PR-${Math.floor(Math.random() * 900) + 100}`, date: new Date().toISOString().split('T')[0], employees: selectedEmpsForPass.length, status: 'Pending Approval' };
    setPassRequests({ ...passRequests, [cid]: [...(passRequests[cid] || []), newReq] });
    setSelectedEmpsForPass([]);
    setShowCreatePass(false);
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
            {contractorsList.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(contractor => (
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
                      <button onClick={(e) => { e.stopPropagation(); setRenewModalData(contractor); }} className="flex items-center gap-1 text-sm font-bold text-hct-blue bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
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
              <button onClick={() => setSelectedContractor(null)} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-hct-blue mb-2 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Contractors
              </button>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                <Building2 className="w-8 h-8 text-hct-blue" /> {selectedContractor.name}
              </h2>
              <p className="text-slate-500 mt-1">Contract No: {selectedContractor.contractNumber} • Valid until: {selectedContractor.expiry}</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedContractor.status === 'Expired' && (
                <button onClick={() => setRenewModalData(selectedContractor)} className="flex items-center gap-2 px-4 py-2 bg-hct-blue hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors">
                  <RefreshCw className="w-4 h-4"/> Renew Contract
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
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="max-w-2xl animate-in fade-in">
                <h3 className="text-xl font-bold mb-4">Company Details</h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-y-4">
                  <div><span className="block text-slate-500 text-sm mb-1">Company Name</span><strong className="text-slate-800 dark:text-white">{selectedContractor.name}</strong></div>
                  <div><span className="block text-slate-500 text-sm mb-1">Contract No</span><strong className="text-slate-800 dark:text-white">{selectedContractor.contractNumber}</strong></div>
                  <div><span className="block text-slate-500 text-sm mb-1">Expiry Date</span><strong className="text-slate-800 dark:text-white">{selectedContractor.expiry}</strong></div>
                  <div><span className="block text-slate-500 text-sm mb-1">Status</span><strong className="text-slate-800 dark:text-white">{selectedContractor.status}</strong></div>
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
                        <th className="p-4 font-bold uppercase">Employee Name</th>
                        <th className="p-4 font-bold uppercase">ID Number</th>
                        <th className="p-4 font-bold uppercase">Role</th>
                        <th className="p-4 font-bold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(employees[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-500">No employees found.</td></tr>
                      ) : (employees[selectedContractor.id] || []).map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-800 dark:text-white">{emp.name}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.id}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{emp.role}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{emp.status}</span>
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
                  <h3 className="text-xl font-bold flex items-center gap-2"><FileSignature className="w-6 h-6 text-slate-400"/> Pass Requests</h3>
                  <button onClick={() => setShowCreatePass(true)} className="bg-hct-blue text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/> Create Pass Request</button>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-500">
                      <tr>
                        <th className="p-4 font-bold uppercase">Request ID</th>
                        <th className="p-4 font-bold uppercase">Date Submitted</th>
                        <th className="p-4 font-bold uppercase">No. of Employees</th>
                        <th className="p-4 font-bold uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {(passRequests[selectedContractor.id] || []).length === 0 ? (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-500">No pass requests found.</td></tr>
                      ) : (passRequests[selectedContractor.id] || []).map(req => (
                        <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-4 font-bold text-slate-800 dark:text-white">{req.id}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{req.date}</td>
                          <td className="p-4 text-slate-600 dark:text-slate-400">{req.employees}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{req.status}</span>
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
        {showAddEmployee && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
              <form onSubmit={handleAddEmployee}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                    <input type="text" required value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:border-hct-blue" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Job Role</label>
                    <input type="text" required value={newEmployee.role} onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})} className="w-full p-3 rounded-lg border border-slate-300 outline-none focus:border-hct-blue" placeholder="Technician" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 border-t pt-4">
                  <button type="button" onClick={() => setShowAddEmployee(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-hct-blue text-white rounded-lg font-bold shadow-md">Add Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {showCreatePass && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
              <h3 className="text-xl font-bold mb-4 border-b pb-2">Create Pass Request</h3>
              <p className="text-sm text-slate-500 mb-4">Select employees to include in this pass request.</p>
              
              <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-xl mb-6 divide-y divide-slate-100">
                {(employees[selectedContractor?.id] || []).map(emp => (
                  <label key={emp.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" checked={selectedEmpsForPass.includes(emp.id)} onChange={(e) => {
                      if (e.target.checked) setSelectedEmpsForPass([...selectedEmpsForPass, emp.id]);
                      else setSelectedEmpsForPass(selectedEmpsForPass.filter(id => id !== emp.id));
                    }} className="w-4 h-4 text-hct-blue rounded" />
                    <div>
                      <p className="font-bold text-slate-800">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </label>
                ))}
                {(employees[selectedContractor?.id] || []).length === 0 && (
                   <p className="p-4 text-sm text-center text-slate-500">No employees available. Add employees first.</p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button onClick={() => setShowCreatePass(false)} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Cancel</button>
                <button onClick={handleCreatePassRequest} className="px-4 py-2 bg-hct-blue text-white rounded-lg font-bold shadow-md">Submit Request</button>
              </div>
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

      {/* Renew Modal */}
      <AnimatePresence>
        {renewModalData && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[110] p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[24px] max-w-2xl w-full overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Renew Contract</h2>
                  <p className="text-sm text-slate-500 mt-1">Select the new validity dates for {renewModalData.name}.</p>
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

    </motion.div>
  );
};

export default ContractorHub;
