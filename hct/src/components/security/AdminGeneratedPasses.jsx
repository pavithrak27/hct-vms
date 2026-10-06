import React, { useState } from 'react';
import { Search, QrCode, Printer, Download, Eye, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminGeneratedPasses = () => {
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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Generated Passes</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">View and manage all active QR-coded contractor passes.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search by Pass ID, Name, Company..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"><Printer className="w-4 h-4"/> Print Selected</button>
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
            {passes.map(pass => (
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
                  {pass.status === 'Expired' && (
                    <button onClick={() => alert(`Renewal process started for pass ${pass.passId}`)} className="p-2 text-hct-blue hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold" title="Renew Pass">
                      <RefreshCw className="w-4 h-4"/> Renew
                    </button>
                  )}
                  <button onClick={() => setSelectedPass(pass)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-5 h-5"/></button>
                  <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download className="w-5 h-5"/></button>
                  <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Printer className="w-5 h-5"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
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
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminGeneratedPasses;

