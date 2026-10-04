import React, { useState } from 'react';
import { Search, History, Clock, QrCode, FileSignature, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const VisitHistory = () => {
  const { visitHistory } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisit, setSelectedVisit] = useState(null);

  const filteredHistory = visitHistory.filter(v => v.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) || v.passId.includes(searchQuery.toUpperCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Visit History</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Complete audit log of all closed and completed visits.</p>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search visit history..." className="pl-9 p-2 rounded-lg border border-slate-300 w-80 text-sm outline-none focus:ring-2 focus:ring-hct-blue" />
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b border-slate-200 text-slate-500">
            <tr>
              <th className="p-4 font-bold uppercase">Visitor</th>
              <th className="p-4 font-bold uppercase">Pass ID</th>
              <th className="p-4 font-bold uppercase">Time Logs</th>
              <th className="p-4 font-bold uppercase">Methods</th>
              <th className="p-4 font-bold uppercase">Status</th>
              <th className="p-4 font-bold uppercase text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredHistory.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-slate-500 font-bold">No visit history found.</td></tr>
            ) : filteredHistory.map(visit => (
              <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-800">{visit.visitorName}</p>
                  <p className="text-xs text-slate-500">{visit.visitorType} • {visit.host}</p>
                </td>
                <td className="p-4"><span className="font-mono text-slate-700 font-bold">{visit.passId}</span></td>
                <td className="p-4">
                  <p className="font-medium text-slate-800 flex items-center gap-1 text-xs mb-1"><span className="w-4 inline-block text-slate-400">In:</span> {visit.checkInTime}</p>
                  <p className="font-medium text-slate-800 flex items-center gap-1 text-xs"><span className="w-4 inline-block text-slate-400">Out:</span> {visit.checkOutTime}</p>
                </td>
                <td className="p-4 text-xs font-bold text-slate-600">
                  <p className="mb-1">In: {visit.checkInMethod}</p>
                  <p>Out: {visit.checkOutMethod}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${visit.status === 'Closed' ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-700'}`}>{visit.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => setSelectedVisit(visit)} className="text-hct-blue hover:underline font-bold text-xs">View Timeline</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timeline Modal */}
      <AnimatePresence>
        {selectedVisit && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
               <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                 <div>
                   <h3 className="text-xl font-black text-slate-800 mb-1">Visit Timeline</h3>
                   <p className="text-sm font-bold text-slate-500">{selectedVisit.passId} • {selectedVisit.visitorName}</p>
                 </div>
                 <button onClick={() => setSelectedVisit(null)} className="text-slate-400 hover:text-slate-700 p-1"><X className="w-5 h-5"/></button>
               </div>
               
               <div className="p-8 overflow-y-auto relative">
                 {/* Vertical line connecting timeline events */}
                 <div className="absolute left-[39px] top-10 bottom-10 w-0.5 bg-slate-200"></div>

                 <div className="space-y-8 relative">
                   {/* Event 1: Entry Scan / Check-in */}
                   <div className="flex gap-6">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-white ${selectedVisit.checkInMethod === 'QR' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                       {selectedVisit.checkInMethod === 'QR' ? <QrCode className="w-4 h-4"/> : <FileSignature className="w-4 h-4"/>}
                     </div>
                     <div>
                       <p className="font-black text-slate-800">{selectedVisit.checkInMethod === 'QR' ? 'QR Scanned at Entry' : 'Manual Check-in by Admin'}</p>
                       <p className="text-xs font-bold text-slate-500 mb-2">{selectedVisit.checkInTime}</p>
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                         Status changed to <strong className="text-emerald-600">Checked In</strong>
                       </div>
                     </div>
                   </div>

                   {/* Event 2: Exit Scan / Force Checkout */}
                   <div className="flex gap-6">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-white ${selectedVisit.checkOutMethod === 'QR' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                       {selectedVisit.checkOutMethod === 'QR' ? <QrCode className="w-4 h-4"/> : <History className="w-4 h-4"/>}
                     </div>
                     <div>
                       <p className="font-black text-slate-800">{selectedVisit.checkOutMethod === 'QR' ? 'QR Scanned at Exit' : 'Force Check-out by Admin'}</p>
                       <p className="text-xs font-bold text-slate-500 mb-2">{selectedVisit.checkOutTime}</p>
                       {selectedVisit.forceReason && (
                         <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-xs text-red-800 font-medium mb-2">
                           <strong className="block mb-1">Mandatory Reason:</strong> "{selectedVisit.forceReason}"
                         </div>
                       )}
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                         Status changed to <strong className="text-slate-600">{selectedVisit.checkOutMethod === 'QR' ? 'Checked Out' : 'Force Checked Out'}</strong>
                       </div>
                     </div>
                   </div>

                   {/* Event 3: Closure & Invalidation */}
                   <div className="flex gap-6">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-white bg-emerald-100 text-emerald-600">
                       <CheckCircle2 className="w-5 h-5"/>
                     </div>
                     <div>
                       <p className="font-black text-slate-800">Visit Closed & QR Invalidated</p>
                       <p className="text-xs font-bold text-slate-500 mb-2">{selectedVisit.checkOutTime}</p>
                       <p className="text-xs text-slate-600">Total duration: <strong>{selectedVisit.duration}</strong></p>
                     </div>
                   </div>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VisitHistory;
