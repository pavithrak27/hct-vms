import React from 'react';
import { useCheckIn } from '../../../context/CheckInContext';
import { useRole } from '../../../context/RoleContext';
import { Calendar, MapPin, QrCode, User, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VisitorDashboard() {
  const { sessionUser } = useRole();
  const { expectedPasses, activeVisits } = useCheckIn();

  // Find the visitor's pass
  // Mock data simulation: In a real app we'd match by visitorId or email.
  // We use name as a fallback for the mock data matching.
  const myPasses = expectedPasses.filter(p => p.name === sessionUser?.name || p.visitorId === sessionUser?.visitorId);
  const activeVisit = activeVisits.find(v => v.visitorName === sessionUser?.name || v.visitorId === sessionUser?.visitorId);

  const currentPass = myPasses.length > 0 ? myPasses[0] : null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Visitor Portal</h1>
        <p className="text-slate-500 mt-1">Welcome back, {sessionUser?.name}</p>
      </div>

      {!currentPass && !activeVisit ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Upcoming Visits</h2>
          <p className="text-slate-500 max-w-md mx-auto">You don't have any scheduled visits at the moment. If you're expecting an invitation, please contact your host.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Visit Details Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                My Visit Details
              </h3>
              {currentPass?.status === 'ACTIVE' && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle2 size={14} /> Approved
                </span>
              )}
              {currentPass?.status === 'PENDING' && (
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-medium flex items-center gap-1">
                  <Clock size={14} /> Pending
                </span>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Host</p>
                  <p className="font-medium text-slate-900 dark:text-white">{currentPass?.host || activeVisit?.host}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Campus</p>
                  <p className="font-medium text-slate-900 dark:text-white">{currentPass?.campus || activeVisit?.campus}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-500">Scheduled Time</p>
                  <p className="font-medium text-slate-900 dark:text-white">Today, 09:00 AM - 11:00 AM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* QR Pass Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" />
                Digital Pass
              </h3>
            </div>
            <div className="p-6 flex-1 flex flex-col items-center justify-center">
              {currentPass?.status === 'ACTIVE' || activeVisit ? (
                <>
                  <div className="w-48 h-48 bg-white border-4 border-slate-100 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentPass?.passId || activeVisit?.passId}`} alt="QR Code" className="w-full h-full object-cover mix-blend-multiply" />
                    {activeVisit && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="bg-emerald-600 text-white font-bold py-1 px-3 rounded text-sm tracking-widest shadow-lg">CHECKED IN</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-mono tracking-wider">{currentPass?.passId || activeVisit?.passId}</p>
                  <p className="text-xs text-slate-400 mt-2">Scan at the gate for entry</p>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="w-10 h-10 text-amber-500" />
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium mb-1">Waiting for Approval</p>
                  <p className="text-slate-500 text-sm">Your pass will be generated once your host approves the visit.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
