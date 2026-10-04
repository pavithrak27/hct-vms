import React from 'react';
import { Download, Printer, QrCode, Shield, CheckCircle2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PassViewer = ({ pass, onClose }) => {
  if (!pass) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 bg-slate-100 dark:bg-slate-900 z-[100] overflow-y-auto">
      
      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
        <button onClick={onClose} className="flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"><ChevronLeft className="w-5 h-5"/> Back to Passes</button>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-hct-blue hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-bold shadow-md transition-colors"><Download className="w-4 h-4"/> Download Pass (PDF)</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto py-8 px-4 space-y-12">
          <div className="bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden relative print:shadow-none print:border-none print:m-0 print:p-0">
            
            {/* Pass Header */}
            <div className="bg-[#00249c] p-6 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
               <div>
                 <h2 className="text-3xl font-black tracking-tight mb-1">VISITOR / CONTRACTOR PASS</h2>
                 <p className="text-blue-200 font-medium tracking-widest text-sm uppercase">HCT Campus Security</p>
               </div>
               <Shield className="w-12 h-12 text-white/20" />
            </div>

            {/* Pass Body */}
            <div className="p-8 grid grid-cols-3 gap-8">
               <div className="col-span-2 space-y-6">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Contractor Company</p>
                   <p className="text-xl font-black text-slate-800">{pass.company}</p>
                   <p className="text-sm text-slate-500 font-bold">{pass.contractId}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Employee Name</p>
                     <p className="text-lg font-bold text-slate-800">{pass.empName}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Employee ID</p>
                     <p className="text-lg font-bold text-slate-800">{pass.empId}</p>
                   </div>
                 </div>

                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-4">
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valid From</p>
                     <p className="font-bold text-emerald-600">{pass.validFrom}</p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Valid Until</p>
                     <p className="font-bold text-emerald-600">{pass.validTo}</p>
                   </div>
                 </div>
               </div>

               <div className="col-span-1 flex flex-col items-center justify-between border-l border-slate-200 pl-8">
                 <img src={pass.photo} alt={pass.empName} className="w-32 h-32 object-cover rounded-xl shadow-md border border-slate-200 mb-4" />
                 
                 <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                    <QrCode className="w-28 h-28 text-slate-800" />
                 </div>
                 <p className="text-xs font-bold text-slate-500 mt-2 tracking-widest">{pass.passId}</p>
               </div>
            </div>

            {/* Pass Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <div className="flex gap-4">
                <span className="flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> HSE Verified</span>
                <span className="flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Active Valid</span>
              </div>
              <p className="italic">Display this pass at all times while on campus.</p>
            </div>

          </div>
      </div>
    </motion.div>
  );
};

export default PassViewer;
