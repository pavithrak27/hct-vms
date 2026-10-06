import React, { useState } from 'react';
import { ScanLine, ShieldAlert, CheckCircle, XCircle, LogIn, LogOut, Search, Clock, ShieldCheck, AlertTriangle, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const SecurityPortal = () => {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'restricted'
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'valid' | 'restricted' | 'checked-in' | 'expired' | 'checked-out'
  const [forcedCheckoutModal, setForcedCheckoutModal] = useState(false);
  const [forcedCheckoutReason, setForcedCheckoutReason] = useState('');
  const [unblockModal, setUnblockModal] = useState(null); // 'permanent' | 'temporary'
  const [unblockExpiry, setUnblockExpiry] = useState('');
  const [manualCheckInModal, setManualCheckInModal] = useState(false);
  const [manualSearch, setManualSearch] = useState('');
  
  const [addRestrictedModal, setAddRestrictedModal] = useState(false);
  const [restrictedId, setRestrictedId] = useState('');

  const handleScan = (type) => {
    setScanState('scanning');
    setTimeout(() => {
      setScanState(type);
    }, 1500);
  };

  const resetScan = () => setScanState('idle');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full relative"
    >
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800 dark:text-white">Security & Gate Portal</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Validate passes, manage access, and handle exceptions (FR-QR, FR-CI, FR-BR).</p>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 dark:border-white/10 overflow-hidden mb-8">
        <div className="flex p-3 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border-b border-white/40 dark:border-white/5">
          <div className="flex gap-2 bg-slate-200/40 dark:bg-slate-900/40 p-1.5 rounded-full w-full max-w-xl mx-auto shadow-inner">
            <button 
              className={`flex-1 px-6 py-3 rounded-full font-bold transition-all ${activeTab === 'scan' ? 'bg-white dark:bg-slate-700 text-hct-blue dark:text-blue-400 shadow-md transform scale-[1.02]' : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white/20'}`}
              onClick={() => setActiveTab('scan')}
            >
              Gate Scanner (FR-QR & FR-CI)
            </button>
            <button 
              className={`flex-1 px-6 py-3 rounded-full font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'restricted' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-md transform scale-[1.02]' : 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-white/20'}`}
              onClick={() => setActiveTab('restricted')}
            >
              <ShieldAlert className="w-5 h-5" /> Restricted Handling
            </button>
          </div>
        </div>

        <div className="p-8 min-h-[500px]">
          {activeTab === 'scan' && (
            <div className="max-w-2xl mx-auto">
              {scanState === 'idle' && (
                <div className="text-center animate-in fade-in flex flex-col items-center">
                  <div className="w-48 h-48 bg-white/60 dark:bg-slate-800/60 rounded-full shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border border-white dark:border-slate-700 mx-auto flex items-center justify-center mb-8 relative overflow-hidden group hover:scale-105 transition-transform duration-500 cursor-pointer">
                    <div className="absolute inset-0 border-[6px] border-dashed border-hct-blue/30 dark:border-blue-500/30 rounded-full group-hover:rotate-180 transition-all duration-[3s] linear"></div>
                    <ScanLine className="w-20 h-20 text-slate-400 group-hover:text-hct-blue dark:group-hover:text-blue-400 transition-colors drop-shadow-md" />
                  </div>
                  <h3 className="text-3xl font-bold mb-8 text-slate-800 dark:text-white tracking-tight">Ready to Scan QR Pass</h3>
                  
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 mb-10 w-full max-w-3xl">
                    <button onClick={() => handleScan('valid')} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-hct-blue hover:from-blue-700 hover:to-blue-900 text-white rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all font-bold">
                      <CheckCircle className="w-5 h-5" /> Valid QR
                    </button>
                    <button onClick={() => handleScan('expired')} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all font-bold">
                      <AlertTriangle className="w-5 h-5" /> Expired ID
                    </button>
                    <button onClick={() => handleScan('restricted')} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-slate-800 hover:to-black text-white rounded-2xl shadow-lg shadow-slate-900/30 hover:shadow-slate-900/50 hover:-translate-y-1 transition-all font-bold">
                      <ShieldAlert className="w-5 h-5 text-red-400" /> Restricted
                    </button>
                  </div>

                  <div className="pt-6 w-full border-t border-slate-200/50 dark:border-slate-700/50">
                    <button onClick={() => setManualCheckInModal(true)} className="px-6 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all flex items-center justify-center gap-2 mx-auto">
                      <LogIn className="w-4 h-4 text-hct-blue dark:text-blue-400" /> Manual Check-in Override (FR-CI-03)
                    </button>
                  </div>
                </div>
              )}

              {scanState === 'scanning' && (
                <div className="text-center animate-pulse py-12">
                  <div className="w-40 h-40 bg-blue-50 rounded-3xl mx-auto flex items-center justify-center border-4 border-hct-blue mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-400/20 w-full h-1/2 animate-[scan_2s_ease-in-out_infinite]" />
                    <ScanLine className="w-20 h-20 text-hct-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-hct-blue">Scanning & Validating...</h3>
                </div>
              )}

              {scanState === 'expired' && (
                <div className="bg-white border border-yellow-300 rounded-2xl p-8 shadow-xl animate-in zoom-in-95">
                  <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Validation Error (FR-QR-04)</h3>
                      <p className="text-yellow-600 font-bold">Identity Document Expired</p>
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6">The Emirates ID/Passport associated with this pass has expired. Access cannot be granted.</p>
                  <button onClick={resetScan} className="w-full py-3 bg-slate-100 text-slate-700 rounded-lg font-bold hover:bg-slate-200 transition-colors">Dismiss</button>
                </div>
              )}

              {scanState === 'valid' && (
                <div className="bg-white border-2 border-green-500 rounded-2xl p-8 shadow-xl animate-in zoom-in-95 max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">QR Gate Validation Successful</h3>
                      <p className="text-green-600 font-bold">Access Granted (FR-QR-01, FR-QR-02)</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-slate-700 mb-2 border-b pb-2">Visitor Details</h4>
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Name:</span> <span className="font-bold text-slate-800">Jane Smith</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Type:</span> <span className="font-bold text-slate-800">Pre-Scheduled Visitor</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-500 font-medium">Host:</span> <span className="font-bold text-slate-800">Dr. Ahmed</span></div>
                    </div>
                    
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3 border-b border-blue-200 pb-2">Gate Validation Checks</h4>
                      <ul className="space-y-2 text-sm text-blue-800 font-medium">
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Valid QR Signature</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Date/Time Window Active</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Authorized for this Gate</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ID Document Verified</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={() => setScanState('checked-in')} className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1">
                        <LogIn className="w-6 h-6" /> Activate QR & Check-in (FR-CI-01)
                     </button>
                  </div>
                </div>
              )}
              
              {scanState === 'checked-in' && (
                 <div className="text-center py-8">
                   <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-hct-blue">
                      <UserCheck className="w-12 h-12 text-hct-blue" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Visitor is On-Campus</h3>
                   <p className="text-slate-500 mb-8 max-w-md mx-auto">The visitor has been checked in. The next scan will automatically process their check-out.</p>
                   
                   <div className="flex gap-4 justify-center">
                     <button onClick={() => setScanState('checked-out')} className="px-6 py-3 border-2 border-slate-300 rounded-xl hover:bg-slate-50 font-bold text-slate-700 transition-colors flex items-center gap-2">
                       <LogOut className="w-5 h-5" /> Normal Gate Check-out Scan
                     </button>
                     <button onClick={() => setForcedCheckoutModal(true)} className="px-6 py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-100 font-bold transition-colors flex items-center gap-2">
                       <ShieldAlert className="w-5 h-5" /> Forced Check-out (FR-CI-04)
                     </button>
                   </div>
                 </div>
              )}

              {scanState === 'checked-out' && (
                 <div className="text-center py-8 animate-in zoom-in">
                   <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-500">
                      <LogOut className="w-12 h-12 text-green-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Check-out Successful</h3>
                   <p className="text-slate-500 mb-6 max-w-md mx-auto">The visitor has been successfully checked out at the gate. The QR pass is now deactivated (FR-CI-02).</p>
                   
                   <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 text-sm font-bold max-w-md mx-auto mb-8">
                     FR-CI-05: Greeting email with a feedback survey has been automatically sent to the visitor.
                   </div>

                   <button onClick={resetScan} className="px-8 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-md">
                     Scan Next Visitor
                   </button>
                 </div>
              )}

              {scanState === 'restricted' && (
                <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-8 shadow-xl animate-in zoom-in-95">
                  <div className="flex items-center gap-4 mb-6 border-b border-red-200 pb-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-red-900">Restricted Match Detected</h3>
                      <p className="text-red-600 font-bold">Security Review Required (FR-BR-02)</p>
                    </div>
                  </div>
                  <p className="text-red-800 mb-8 font-medium">This ID matches a record on the restricted list. The visitor has been routed to the restricted handling workflow instead of an automatic permanent rejection.</p>
                  <button onClick={() => { setActiveTab('restricted'); resetScan(); }} className="w-full py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 flex justify-center items-center gap-2 shadow-lg transition-transform hover:-translate-y-1">
                     <ShieldAlert className="w-6 h-6" /> Open Restricted Handling
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'restricted' && (
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Restricted Visitor Review</h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Manage permanent and temporary unblocks (FR-BR-04, FR-BR-05) and maintain list (FR-BR-01).</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search ID..." className="pl-10 pr-4 py-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none font-medium" />
                  </div>
                  <button onClick={() => setAddRestrictedModal(true)} className="px-5 py-2.5 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 shadow-md shadow-[#00249c]/20 hover:shadow-[#00249c]/40 transition-all whitespace-nowrap">
                    + Add to Restricted List
                  </button>
                </div>
              </div>
              
              <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/60 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-white/40 dark:border-white/5">
                    <tr>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300">ID / Passport</th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300">Visitor Info</th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300">Status</th>
                      <th className="p-5 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/20 dark:border-white/5 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="p-5 font-bold text-slate-800 dark:text-white">784-1234-567890-1</td>
                      <td className="p-5 text-slate-700 dark:text-slate-300">
                        <div className="font-bold">Unknown Visitor</div>
                        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Attempted Entry: 10 mins ago</div>
                      </td>
                      <td className="p-5"><span className="px-3.5 py-1.5 bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-500/30">Blocked</span></td>
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setUnblockModal('permanent')} className="px-4 py-2 text-sm font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all">Permanent Unblock</button>
                          <button onClick={() => setUnblockModal('temporary')} className="px-4 py-2 text-sm font-bold bg-hct-blue text-white rounded-lg shadow-md hover:bg-blue-800 transition-all">Temp Unblock</button>
                        </div>
                        <div className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2">Requires Host Exception Approval (FR-BR-03)</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forced Check-out Modal */}
      {forcedCheckoutModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Forced Check-out</h3>
            <p className="text-slate-500 mb-6 text-sm">FR-CI-04: You are forcing a check-out for this visitor. A reason is mandatory for the audit log.</p>
            
            <textarea 
              value={forcedCheckoutReason}
              onChange={(e) => setForcedCheckoutReason(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl mb-6 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Enter mandatory reason..."
              rows="3"
            ></textarea>
            
            <div className="flex gap-4">
              <button onClick={() => setForcedCheckoutModal(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
              <button 
                disabled={!forcedCheckoutReason.trim()}
                onClick={() => { setForcedCheckoutModal(false); setScanState('checked-out'); alert("Forced check-out recorded in audit log. (FR-CI-04)\n\nFR-CI-05: Feedback survey email sent."); }} 
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 shadow-md"
              >
                Force Check-out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Modal */}
      {unblockModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              {unblockModal === 'permanent' ? 'Permanent Unblock (FR-BR-04)' : 'Temporary Unblock (FR-BR-05)'}
            </h3>
            <p className="text-slate-500 mb-6 text-sm">
              {unblockModal === 'permanent' 
                ? 'This will permanently remove the visitor from the restricted list.' 
                : 'This will allow the visitor access until the specified expiry time, after which they revert to restricted.'}
            </p>
            
            {unblockModal === 'temporary' && (
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-2">Set Expiry Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={unblockExpiry}
                  onChange={(e) => setUnblockExpiry(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none"
                />
              </div>
            )}
            
            <div className="flex gap-4">
              <button onClick={() => setUnblockModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
              <button 
                disabled={unblockModal === 'temporary' && !unblockExpiry}
                onClick={() => { setUnblockModal(null); alert("Unblock action sent for Exceptional Approval. (FR-BR-03)\n\nFR-BR-06: Activity logged in audit trail."); }} 
                className="flex-1 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50 shadow-md"
              >
                Request Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Restricted Modal (FR-BR-01) */}
      {addRestrictedModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Add to Restricted List</h3>
            <p className="text-slate-500 mb-6 text-sm">FR-BR-01: Maintain restricted visitors by Emirates ID or Passport number.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Emirates ID / Passport Number *</label>
                <input 
                  type="text" 
                  value={restrictedId}
                  onChange={(e) => setRestrictedId(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none" 
                  placeholder="e.g. 784-XXXX-XXXXXXX-X"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Reason for Restriction *</label>
                <textarea 
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none" 
                  rows="3"
                  placeholder="Security incident description..."
                ></textarea>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => {setAddRestrictedModal(false); setRestrictedId('');}} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
              <button 
                disabled={!restrictedId.trim()}
                onClick={() => { setAddRestrictedModal(false); setRestrictedId(''); alert("Visitor added to restricted list.\n\nFR-BR-06: Activity logged in audit trail."); }} 
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50 shadow-md"
              >
                Block Visitor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Check-in Modal (FR-CI-03) */}
      {manualCheckInModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Manual Check-in Override</h3>
            <p className="text-slate-500 mb-6 text-sm">FR-CI-03: Authorized users can manually check in a visitor without scanning their QR code.</p>
            
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={manualSearch}
                onChange={(e) => setManualSearch(e.target.value)}
                placeholder="Search visitor name or ID..."
                className="pl-10 w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-hct-blue outline-none"
              />
              
              {manualSearch.length > 2 && (
                <div className="border border-slate-200 rounded-xl mt-2 p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 flex items-center justify-between" onClick={() => setManualSearch('Jane Smith')}>
                  <div>
                    <div className="font-bold text-slate-800">Jane Smith</div>
                    <div className="text-sm text-slate-500">Pre-Scheduled (Host: Dr. Ahmed)</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button onClick={() => {setManualCheckInModal(false); setManualSearch('');}} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Cancel</button>
              <button 
                disabled={manualSearch !== 'Jane Smith'}
                onClick={() => { setManualCheckInModal(false); setManualSearch(''); setScanState('checked-in'); }} 
                className="flex-1 py-3 bg-hct-blue text-white rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50 shadow-md"
              >
                Check-in Visitor
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SecurityPortal;

