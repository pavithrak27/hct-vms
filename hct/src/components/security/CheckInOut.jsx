import React, { useState } from 'react';
import { Search, ScanLine, AlertCircle, CheckCircle2, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const CheckInOut = () => {
  const { expectedPasses, stats, checkIn, checkOut } = useCheckIn();
  const [activeTab, setActiveTab] = useState('qr');
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null); // { success: true/false, message: '', type: 'checkin'/'checkout', visit: {} }
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const handleScan = (passId) => {
    const idToScan = passId || scanInput;
    if (!idToScan) return;

    // Determine what to do based on the pass status
    const pass = expectedPasses.find(p => p.passId === idToScan);
    
    if (!pass) {
      setScanResult({ success: false, message: 'Invalid QR Code. No pass found with this ID.' });
      return;
    }

    if (pass.status === 'ACTIVE') {
      const res = checkIn(idToScan, 'QR');
      setScanResult({ ...res, type: 'checkin' });
    } else if (pass.status === 'CHECKED_IN') {
      const res = checkOut(idToScan, 'QR');
      setScanResult({ ...res, type: 'checkout' });
    } else {
      setScanResult({ success: false, message: 'This visitor pass has already been used and is invalidated.' });
    }
    
    setScanInput('');
  };

  const handleManualCheckIn = () => {
    if (selectedVisitor) {
      const res = checkIn(selectedVisitor.passId, 'Manual');
      setScanResult({ ...res, type: 'checkin' });
      setSelectedVisitor(null);
    }
  };

  const filteredExpected = expectedPasses.filter(p => p.status === 'ACTIVE' && (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.passId.includes(searchQuery.toUpperCase())));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Check-in & Check-out</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Manage automated QR gates and manual visitor access.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
         <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-sm"><p className="text-slate-500 text-xs font-bold uppercase mb-1">Total Visits</p><p className="text-2xl font-black text-slate-800">{stats.totalToday}</p></div>
         <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-center shadow-sm"><p className="text-blue-700 text-xs font-bold uppercase mb-1">Expected</p><p className="text-2xl font-black text-blue-600">{expectedPasses.filter(p=>p.status==='ACTIVE').length}</p></div>
         <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center shadow-sm"><p className="text-emerald-700 text-xs font-bold uppercase mb-1">Checked In</p><p className="text-2xl font-black text-emerald-600">{stats.checkedInToday - stats.checkedOutToday}</p></div>
         <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center shadow-sm"><p className="text-slate-700 text-xs font-bold uppercase mb-1">Checked Out</p><p className="text-2xl font-black text-slate-600">{stats.checkedOutToday}</p></div>
         <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center shadow-sm"><p className="text-red-700 text-xs font-bold uppercase mb-1">Overdue</p><p className="text-2xl font-black text-red-600">{stats.overdue}</p></div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex p-2 bg-slate-50 border-b border-slate-200">
          <button onClick={() => setActiveTab('qr')} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'qr' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><ScanLine className="w-5 h-5"/> QR Scanner Simulator</button>
          <button onClick={() => setActiveTab('manual')} className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${activeTab === 'manual' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}><UserCheck className="w-5 h-5"/> Manual Check-in</button>
        </div>

        <div className="p-8">
          {activeTab === 'qr' ? (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Simulate Gate Scanner</h3>
                <p className="text-slate-500 mb-6">Type a Pass ID to simulate a physical QR scan at the gate.</p>
                <div className="flex gap-2">
                  <input type="text" value={scanInput} onChange={(e) => setScanInput(e.target.value)} placeholder="e.g. PASS-00125" className="flex-1 p-4 text-center font-mono text-xl rounded-xl border-2 border-slate-300 focus:border-hct-blue outline-none" />
                  <button onClick={() => handleScan()} className="px-8 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900">Scan</button>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Demo Passes (Click to scan)</p>
                <div className="flex flex-wrap gap-2">
                  {expectedPasses.map(p => (
                    <button key={p.passId} onClick={() => handleScan(p.passId)} className={`px-4 py-2 rounded-lg font-mono text-sm border font-bold transition-all ${p.status === 'ACTIVE' ? 'bg-white border-slate-300 hover:border-blue-500' : p.status === 'CHECKED_IN' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-200 text-red-500 line-through'}`}>{p.passId}</button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search expected visitors by name or pass ID..." className="w-full pl-12 p-3 rounded-xl border border-slate-300 outline-none focus:border-hct-blue focus:ring-2 focus:ring-blue-100" />
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {filteredExpected.length === 0 ? (
                  <p className="text-center py-8 text-slate-500">No expected visitors found matching your search.</p>
                ) : filteredExpected.map(pass => (
                  <div key={pass.passId} onClick={() => setSelectedVisitor(pass)} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md cursor-pointer transition-all">
                    <div className="flex items-center gap-4">
                      <img src={pass.photo} alt={pass.name} className="w-12 h-12 rounded-full border border-slate-200" />
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{pass.name}</h4>
                        <p className="text-sm text-slate-500">{pass.type} • {pass.passId}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">Expected</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manual Check-in Modal */}
      <AnimatePresence>
        {selectedVisitor && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-[24px] p-8 max-w-md w-full">
               <div className="flex justify-between items-start mb-6">
                 <h3 className="text-2xl font-bold">Manual Check-in</h3>
                 <button onClick={() => setSelectedVisitor(null)} className="text-slate-400 hover:text-slate-700"><X className="w-6 h-6"/></button>
               </div>
               
               <div className="flex flex-col items-center mb-6">
                 <img src={selectedVisitor.photo} alt={selectedVisitor.name} className="w-24 h-24 rounded-full border-4 border-slate-100 mb-4 shadow-sm" />
                 <h4 className="text-xl font-bold text-slate-800">{selectedVisitor.name}</h4>
                 <p className="text-sm font-medium text-slate-500">{selectedVisitor.type}</p>
               </div>

               <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm mb-6 space-y-3">
                 <div className="flex justify-between"><span className="text-slate-500">Pass ID</span><span className="font-bold">{selectedVisitor.passId}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500">Host</span><span className="font-bold">{selectedVisitor.host}</span></div>
                 <div className="flex justify-between"><span className="text-slate-500">Gate</span><span className="font-bold">Main Reception</span></div>
                 <div className="flex justify-between"><span className="text-slate-500">Current Time</span><span className="font-bold text-blue-600">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
               </div>

               <button onClick={handleManualCheckIn} className="w-full py-3 bg-hct-blue text-white rounded-xl font-bold shadow-md hover:bg-blue-800">Confirm Check-in</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scan Result Modal */}
      <AnimatePresence>
        {scanResult && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[24px] p-8 max-w-md w-full text-center relative overflow-hidden">
               {scanResult.success ? (
                 <>
                   <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 className="w-10 h-10 text-emerald-500"/></div>
                   <h3 className="text-2xl font-bold mb-2 text-slate-800">Check-{scanResult.type === 'checkin' ? 'in' : 'out'} Successful</h3>
                   <img src={scanResult.visit.photo} alt="Visitor" className="w-24 h-24 rounded-xl object-cover mx-auto my-4 shadow-md border border-slate-200" />
                   <p className="text-lg font-black text-slate-800">{scanResult.visit.visitorName}</p>
                   <p className="text-sm font-bold text-slate-500 mb-6">{scanResult.visit.passId} • {scanResult.visit.host}</p>
                   
                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm flex justify-between mb-8">
                     <span className="font-bold text-slate-500">{scanResult.type === 'checkin' ? 'In' : 'Out'} Time:</span>
                     <span className="font-black text-emerald-600">{scanResult.type === 'checkin' ? scanResult.visit.checkInTime : scanResult.visit.checkOutTime}</span>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle className="w-10 h-10 text-red-500"/></div>
                   <h3 className="text-2xl font-bold mb-4 text-slate-800">Scan Failed</h3>
                   <p className="text-red-600 font-bold mb-8">{scanResult.message}</p>
                 </>
               )}
               <button onClick={() => setScanResult(null)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default CheckInOut;
