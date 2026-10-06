import React, { useState } from 'react';
import { Search, LogOut, Clock, AlertTriangle, MessageSquare, Star, FileText, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const ActiveVisits = () => {
  const { activeVisits, checkOut } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [forceCheckoutVisit, setForceCheckoutVisit] = useState(null);
  const [viewVisitor, setViewVisitor] = useState(null);
  const [forceReason, setForceReason] = useState('');
  const [showFeedbackSimulator, setShowFeedbackSimulator] = useState(null); // The visit that was checked out

  const handleForceCheckout = () => {
    if (!forceReason.trim()) { alert('Reason is mandatory for Force Check-out.'); return; }
    const res = checkOut(forceCheckoutVisit.passId, 'Force Check-out', forceReason);
    
    if (res.success) {
      setForceCheckoutVisit(null);
      setForceReason('');
      // Trigger the feedback simulator for the checked out visitor
      setShowFeedbackSimulator(res.visit);
    }
  };

  const filteredVisits = activeVisits.filter(v => v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || v.passId.includes(searchQuery.toUpperCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Active Visits</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Monitor all visitors currently inside the premises.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search active visitors..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
          <div className="font-bold text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {activeVisits.length} Currently Inside
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">Visitor</th>
              <th className="p-4 font-bold uppercase">Pass ID</th>
              <th className="p-4 font-bold uppercase">Host</th>
              <th className="p-4 font-bold uppercase">Check-in Details</th>
              <th className="p-4 font-bold uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredVisits.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500 font-bold">No active visitors currently inside.</td></tr>
            ) : filteredVisits.map(visit => (
              <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={visit.photo} alt={visit.visitorName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div><p className="font-bold text-slate-800">{visit.visitorName}</p><p className="text-xs text-slate-500">{visit.visitorType}</p></div>
                  </div>
                </td>
                <td className="p-4"><span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-1 rounded">{visit.passId}</span></td>
                <td className="p-4">
                  <p className="font-bold text-slate-700">{visit.host}</p>
                  <p className="text-xs text-slate-500">{visit.company}</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-800 flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400"/> {visit.checkInTime}</p>
                  <p className="text-xs text-slate-500">{visit.gate} • {visit.checkInMethod}</p>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setForceCheckoutVisit(visit)} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-3 py-1.5 rounded-lg border border-red-200 transition-colors flex items-center gap-1 ml-auto">
                    <LogOut className="w-4 h-4"/> Force Check-out
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            {/* View Visitor Modal */}
      <AnimatePresence>
        {viewVisitor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 relative">
               <button onClick={() => setViewVisitor(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-white"><X className="w-6 h-6"/></button>
               <h3 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-3"><User className="w-6 h-6 text-hct-blue" /> Visitor Details</h3>
               
               <div className="space-y-4">
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                      <img src={viewVisitor.photo || "https://i.pravatar.cc/150"} alt="Visitor Photo" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Full Name</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{viewVisitor.visitorName}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Pass ID</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.passId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Company</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.company || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Host</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.host || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Visit Type</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.visitorType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Check-In Time</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.checkInTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Check-In Method</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.checkInMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Gate</p>
                        <p className="font-bold text-slate-800 dark:text-white">{viewVisitor.gate}</p>
                      </div>
                    </div>
                 </div>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Force Check-out Modal */}
      <AnimatePresence>
        {forceCheckoutVisit && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-md w-full border-t-8 border-red-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle className="w-32 h-32 text-red-500"/></div>
               
               <h3 className="text-2xl font-black text-slate-800 mb-2 relative z-10">Force Check-out</h3>
               <p className="text-slate-600 mb-6 relative z-10">You are about to manually force check-out <strong className="text-slate-800">{forceCheckoutVisit.visitorName}</strong>. Their QR pass will be immediately invalidated.</p>
               
               <div className="mb-6 relative z-10">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Mandatory Reason <span className="text-red-500">*</span></label>
                 <textarea value={forceReason} onChange={(e) => setForceReason(e.target.value)} placeholder="e.g. Visitor left without scanning at the exit gate." className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 min-h-[100px]"></textarea>
               </div>

               <div className="flex justify-end gap-3 relative z-10">
                 <button onClick={() => setForceCheckoutVisit(null)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                 <button onClick={handleForceCheckout} disabled={!forceReason.trim()} className="px-6 py-2.5 bg-red-600 disabled:bg-red-400 hover:bg-red-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center gap-2"><LogOut className="w-4 h-4"/> Confirm Check-out</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Email / Feedback Survey Modal */}
      <AnimatePresence>
        {showFeedbackSimulator && (
          <div className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[24px] p-8 max-w-lg w-full">
               <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-6 text-sm flex gap-3">
                 <MessageSquare className="w-5 h-5 text-blue-600 shrink-0"/>
                 <div>
                   <p className="font-bold text-blue-800 mb-1">Simulated Action: Automated Greeting Email Sent</p>
                   <p className="text-blue-600">The system has emailed {showFeedbackSimulator.visitorName} thanking them for their visit and requesting feedback.</p>
                 </div>
               </div>

               <h3 className="text-2xl font-black text-center mb-2">Visitor Feedback Survey</h3>
               <p className="text-center text-slate-500 mb-8">How was your visit to HCT Campus?</p>
               
               <div className="flex justify-center gap-2 mb-8">
                 {[1,2,3,4,5].map(star => (
                   <button key={star} className="p-2 hover:bg-amber-50 rounded-full transition-colors group">
                     <Star className="w-10 h-10 text-slate-200 group-hover:text-amber-400 transition-colors" />
                   </button>
                 ))}
               </div>

               <div className="mb-6">
                 <label className="block text-sm font-bold text-slate-700 mb-2">Optional Comments</label>
                 <textarea placeholder="Tell us about your experience..." className="w-full p-3 rounded-xl border border-slate-300 outline-none min-h-[100px]"></textarea>
               </div>

               <button onClick={() => setShowFeedbackSimulator(null)} className="w-full py-4 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 shadow-md">Submit Feedback & Close Simulator</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ActiveVisits;

