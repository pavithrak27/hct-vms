import React, { useState } from 'react';
import { Building2, Search, Edit, Settings, X, Plus, AlertCircle, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HCT_CAMPUSES = [
  { id: 'CMP-01', name: 'Abu Dhabi Men\'s Campus', code: 'ADMC', city: 'Abu Dhabi', status: 'Active', gates: 3 },
  { id: 'CMP-02', name: 'Abu Dhabi Women\'s Campus', code: 'ADWC', city: 'Abu Dhabi', status: 'Active', gates: 4 },
  { id: 'CMP-03', name: 'Al Ain Men\'s Campus', code: 'AAMC', city: 'Al Ain', status: 'Active', gates: 2 },
  { id: 'CMP-04', name: 'Al Ain Women\'s Campus', code: 'AAWC', city: 'Al Ain', status: 'Active', gates: 2 },
  { id: 'CMP-05', name: 'Dubai Men\'s Campus', code: 'DMC', city: 'Dubai', status: 'Active', gates: 4 },
  { id: 'CMP-06', name: 'Dubai Women\'s Campus', code: 'DWC', city: 'Dubai', status: 'Active', gates: 5 },
  { id: 'CMP-07', name: 'Fujairah Men\'s Campus', code: 'FMC', city: 'Fujairah', status: 'Active', gates: 2 },
  { id: 'CMP-08', name: 'Fujairah Women\'s Campus', code: 'FWC', city: 'Fujairah', status: 'Active', gates: 2 },
  { id: 'CMP-09', name: 'Ras Al Khaimah Men\'s Campus', code: 'RKMC', city: 'Ras Al Khaimah', status: 'Active', gates: 2 },
  { id: 'CMP-10', name: 'Ras Al Khaimah Women\'s Campus', code: 'RKWC', city: 'Ras Al Khaimah', status: 'Active', gates: 2 },
  { id: 'CMP-11', name: 'Sharjah Men\'s Campus', code: 'SMC', city: 'Sharjah', status: 'Active', gates: 3 },
  { id: 'CMP-12', name: 'Sharjah Women\'s Campus', code: 'SWC', city: 'Sharjah', status: 'Active', gates: 3 },
  { id: 'CMP-13', name: 'Ruwais Women\'s Campus', code: 'RUWC', city: 'Ruwais', status: 'Active', gates: 1 },
  { id: 'CMP-14', name: 'CERT / Innovation Park', code: 'CERT', city: 'Abu Dhabi', status: 'Active', gates: 6 },
];

const CampusConfiguration = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [isAddingCampus, setIsAddingCampus] = useState(false);
  
  const [gates, setGates] = useState([
    { id: 1, name: 'Main Entrance', type: 'Entry & Exit', hardware: ['Suprema (x2)', 'ANPR (x1)'], status: 'Active' },
    { id: 2, name: 'Staff Gate B', type: 'Entry Only', hardware: ['Suprema (x1)'], status: 'Active' }
  ]);

  const handleAddGate = (e) => {
    e.preventDefault();
    const gateName = prompt("Enter new Gate Name (e.g. South Gate):");
    if (gateName) {
      setGates([...gates, {
        id: gates.length + 1,
        name: gateName,
        type: 'Entry & Exit',
        hardware: ['Suprema (x1)'],
        status: 'Active'
      }]);
    }
  };

  const filteredCampuses = HCT_CAMPUSES.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Building2 className="w-8 h-8 text-hct-blue" /> Campus Configuration
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage all 14 HCT campuses, configure independent security policies, and manage gates.</p>
        </div>
        <button onClick={() => setIsAddingCampus(true)} className="bg-hct-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-hct-blue-dark shadow-md">
          <Plus className="w-5 h-5"/> Add Campus
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Campus Name or Code..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">Campus Name</th>
              <th className="p-4 font-bold uppercase">Code</th>
              <th className="p-4 font-bold uppercase">City</th>
              <th className="p-4 font-bold uppercase">Configured Gates</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredCampuses.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedCampus(c)}>
                <td className="p-4">
                  <p className="font-bold text-slate-800">{c.name}</p>
                  <p className="text-[10px] text-slate-400">{c.id}</p>
                </td>
                <td className="p-4"><span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 font-bold">{c.code}</span></td>
                <td className="p-4 font-medium text-slate-600">{c.city}</td>
                <td className="p-4 font-black text-slate-700">{c.gates} <span className="font-normal text-slate-400 text-xs">Gates</span></td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase">{c.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={(e) => { e.stopPropagation(); setSelectedCampus(c); }} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-bold flex items-center gap-1 ml-auto">
                    <Settings className="w-3 h-3"/> Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Configuration Modal */}
      <AnimatePresence>
        {(selectedCampus || isAddingCampus) && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[24px] max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden border-t-8 border-hct-blue">
               
               <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                 <div>
                   <h3 className="text-2xl font-black text-slate-800 mb-1">{isAddingCampus ? 'Add New Campus' : `${selectedCampus?.name} Configuration`}</h3>
                   <p className="text-slate-500 font-medium text-sm">{isAddingCampus ? 'Provision a new campus into the central network.' : `Campus ID: ${selectedCampus?.id} • Code: ${selectedCampus?.code}`}</p>
                 </div>
                 <button onClick={() => { setSelectedCampus(null); setIsAddingCampus(false); }} className="text-slate-400 hover:text-slate-700"><X className="w-6 h-6"/></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                 
                 <div className="grid grid-cols-2 gap-8 mb-8">
                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-hct-blue"/> Basic Information</h4>
                     <div className="space-y-4">
                        <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Campus Name</label>
                         <input type="text" defaultValue={selectedCampus?.name || ''} placeholder="e.g. Fujairah New Campus" className="w-full p-2.5 rounded-lg border border-slate-300 outline-none focus:border-hct-blue" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                           <input type="text" defaultValue={selectedCampus?.city || ''} placeholder="e.g. Fujairah" className="w-full p-2.5 rounded-lg border border-slate-300 outline-none focus:border-hct-blue" />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timezone</label>
                           <input type="text" defaultValue="Asia/Dubai" disabled className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-100 outline-none text-slate-500" />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                         <select className="w-full p-2.5 rounded-lg border border-slate-300 outline-none focus:border-hct-blue">
                           <option>Active</option><option>Inactive</option>
                         </select>
                       </div>
                     </div>
                   </div>

                   <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                     <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-hct-blue"/> Security Policies</h4>
                     <div className="space-y-4">
                       <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                         <span className="font-bold text-slate-700 text-sm">Visitor Registration Enabled</span>
                         <input type="checkbox" defaultChecked className="w-4 h-4 accent-hct-blue" />
                       </div>
                       <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                         <span className="font-bold text-slate-700 text-sm">Contractor Access Enabled</span>
                         <input type="checkbox" defaultChecked className="w-4 h-4 accent-hct-blue" />
                       </div>
                       <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                         <span className="font-bold text-slate-700 text-sm">QR Check-in Enabled</span>
                         <input type="checkbox" defaultChecked className="w-4 h-4 accent-hct-blue" />
                       </div>
                       <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                         <span className="font-bold text-slate-700 text-sm">QR Check-out Enabled</span>
                         <input type="checkbox" defaultChecked className="w-4 h-4 accent-hct-blue" />
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-slate-800 text-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-hct-blue"/> Configured Gates</h4>
                      <button onClick={handleAddGate} className="text-hct-blue font-bold text-sm flex items-center gap-1 hover:underline"><Plus className="w-4 h-4"/> Add Gate</button>
                    </div>
                    
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="p-3 font-bold uppercase text-xs">Gate Name</th>
                          <th className="p-3 font-bold uppercase text-xs">Type</th>
                          <th className="p-3 font-bold uppercase text-xs">Hardware Assigned</th>
                          <th className="p-3 font-bold uppercase text-xs">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {gates.map(gate => (
                          <tr key={gate.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-800">{gate.name}</td>
                            <td className="p-3 text-slate-600">{gate.type}</td>
                            <td className="p-3">
                              {gate.hardware.map((hw, i) => (
                                <span key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded mr-1 ${hw.includes('ANPR') ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {hw}
                                </span>
                              ))}
                            </td>
                            <td className="p-3"><span className="text-emerald-600 font-bold text-xs uppercase">{gate.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>

               </div>

               <div className="p-6 border-t border-slate-200 flex justify-end gap-3 bg-white">
                 <button onClick={() => { setSelectedCampus(null); setIsAddingCampus(false); }} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold">Cancel</button>
                 <button onClick={() => { alert('Configuration saved to Audit Log.'); setSelectedCampus(null); setIsAddingCampus(false); }} className="px-8 py-3 bg-hct-blue hover:bg-hct-blue-dark text-white rounded-xl font-bold shadow-md flex items-center gap-2">
                   <Save className="w-5 h-5"/> Save Campus Configuration
                 </button>
               </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default CampusConfiguration;
