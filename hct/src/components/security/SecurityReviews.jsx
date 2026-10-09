import React, { useState, useMemo } from 'react';
import { Search, FileSearch, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, X, Clock, Unlock, Lock, Filter, User, HardHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCheckIn } from '../../context/CheckInContext';

const SecurityReviews = () => {
  const { securityReviews, restrictedVisitors, actionSecurityReview } = useCheckIn();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL', 'WALK_IN', 'CONTRACTOR'
  
  // Security Review Action States
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionModal, setActionModal] = useState(null); // 'DENY', 'TEMP_RELEASE', 'PERM_RELEASE'
  const [actionDetails, setActionDetails] = useState({ expiry: '', reason: '' });

  const handleAction = () => {
    if ((actionModal === 'DENY' || actionModal === 'PERM_RELEASE') && !actionDetails.reason) {
      alert("Reason is mandatory."); return;
    }
    if (actionModal === 'TEMP_RELEASE' && (!actionDetails.expiry || !actionDetails.reason)) {
      alert("Expiry Date and Reason are mandatory for Temporary Release."); return;
    }

    actionSecurityReview(selectedReview.id, actionModal, actionDetails);
    
    // Reset
    setActionModal(null);
    setSelectedReview(null);
    setActionDetails({ expiry: '', reason: '' });
  };

  // Combine Security Reviews and Restricted Visitors into one unified table list
  const combinedList = useMemo(() => {
    const reviewsMapped = securityReviews.map((r, index) => ({
      id: r.id,
      recordType: 'Security Review',
      visitorCategory: r.visitorCategory || (index % 2 === 0 ? 'Walk-in Visitor' : 'Contractor Visitor'),
      name: r.visitorName,
      docNumber: r.docNumber,
      docType: 'Emirates ID',
      mobile: r.mobile || '-',
      reason: r.reason,
      host: r.host,
      dateOrTime: r.matchTime,
      status: r.status,
      photo: r.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.visitorName)}&background=f59e0b&color=fff`,
      rawReview: r,
      releaseType: '-',
      expiry: '-'
    }));

    const restrictedMapped = restrictedVisitors.map((v, index) => ({
      id: v.id,
      recordType: 'Blocked Visitor',
      visitorCategory: v.visitorCategory || (v.type === 'Policy Violation' || index % 2 === 1 ? 'Contractor Visitor' : 'Visitor'),
      name: v.name,
      docNumber: v.docNumber,
      docType: v.docType || 'Emirates ID',
      mobile: v.mobile || '-',
      reason: `${v.type} • ${v.reason}`,
      host: '-',
      dateOrTime: v.restrictedDate,
      status: v.status,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(v.name)}&background=ef4444&color=fff`,
      rawReview: null,
      releaseType: v.releaseType || '-',
      expiry: v.expiry || '-'
    }));

    const extraSampleRecords = [
      {
        id: 'SR-2026-0004',
        recordType: 'Security Review',
        visitorCategory: 'Contractor Visitor',
        name: 'Tariq Al-Mansoori',
        docNumber: '784-1982-9988112-3',
        docType: 'Emirates ID',
        mobile: '+971 50 777 4433',
        reason: 'Expired Contractor Induction Pass',
        host: 'Facilities Engineering',
        dateOrTime: '2026-10-05 10:15 AM',
        status: 'Pending Security Review',
        photo: 'https://i.pravatar.cc/300?img=59',
        rawReview: { id: 'SR-2026-0004', visitorName: 'Tariq Al-Mansoori', docNumber: '784-1982-9988112-3', reason: 'Expired Contractor Induction Pass', host: 'Facilities Engineering', matchTime: '2026-10-05 10:15 AM', photo: 'https://i.pravatar.cc/300?img=59' },
        releaseType: '-',
        expiry: '-'
      },
      {
        id: 'SR-2026-0005',
        recordType: 'Security Review',
        visitorCategory: 'Visitor',
        name: 'Elena Rostova',
        docNumber: 'P-99221100',
        docType: 'Passport',
        mobile: '+971 54 888 2211',
        reason: 'Unscheduled VIP Walk-in Intercept',
        host: 'Dean Office',
        dateOrTime: '2026-10-05 11:30 AM',
        status: 'Pending Security Review',
        photo: 'https://i.pravatar.cc/300?img=49',
        rawReview: { id: 'SR-2026-0005', visitorName: 'Elena Rostova', docNumber: 'P-99221100', reason: 'Unscheduled VIP Walk-in Intercept', host: 'Dean Office', matchTime: '2026-10-05 11:30 AM', photo: 'https://i.pravatar.cc/300?img=49' },
        releaseType: '-',
        expiry: '-'
      }
    ];

    return [...reviewsMapped, ...restrictedMapped, ...extraSampleRecords];
  }, [securityReviews, restrictedVisitors]);

  const filteredList = useMemo(() => {
    return combinedList.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category Filter (Walk-in vs Contractor)
      if (categoryFilter === 'WALK_IN' && item.visitorCategory !== 'Walk-in Visitor') return false;
      if (categoryFilter === 'CONTRACTOR' && item.visitorCategory !== 'Contractor Visitor') return false;

      // Status Filter
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'PENDING') return item.status === 'Pending Security Review';
      if (statusFilter === 'RESTRICTED') return item.status === 'Restricted';
      if (statusFilter === 'TEMP_RELEASED') return item.status === 'Temporarily Released';
      if (statusFilter === 'PERM_RELEASED') return item.status === 'Permanently Released';
      if (statusFilter === 'DENIED') return item.status === 'Denied';

      return true;
    });
  }, [combinedList, searchQuery, statusFilter, categoryFilter]);

  const pendingCount = securityReviews.filter(r => r.status === 'Pending Security Review').length;
  const restrictedCount = restrictedVisitors.filter(r => r.status === 'Restricted').length;
  const tempReleasedCount = combinedList.filter(r => r.status === 'Temporarily Released').length;
  const permReleasedCount = combinedList.filter(r => r.status === 'Permanently Released').length;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-6">
      
      {/* Top Header */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-amber-500 shrink-0" /> Security Review
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          Unified security manifest displaying pending reviews, blocklist interceptions, walk-in visitors, and contractor visitor records.
        </p>
      </div>

      {/* Summary Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">Pending Reviews</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-300">{pendingCount}</p>
        </div>
        <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Blocked List</p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{restrictedCount}</p>
        </div>
        <div className="bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Temp Released</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-300">{tempReleasedCount}</p>
        </div>
        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 p-4 rounded-2xl text-center shadow-sm">
          <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Perm Released</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-300">{permReleasedCount}</p>
        </div>
      </div>

      {/* Main Single Table Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Search & Filter Header Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-800/40">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search Name, ID, Case, Reason..." 
                className="w-full pl-9 p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white text-sm outline-none focus:ring-2 focus:ring-hct-blue" 
              />
            </div>

            {/* Visitor Category Filter (Walk-in vs Contractor) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto bg-slate-200/60 dark:bg-slate-800/80 p-1 rounded-xl">
              {[
                { id: 'ALL', label: 'All Visitor Types', icon: User },
                { id: 'WALK_IN', label: 'Visitor', icon: User },
                { id: 'CONTRACTOR', label: 'Contractor Visitor', icon: HardHat },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    categoryFilter === cat.id
                      ? 'bg-hct-blue text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
            {[
              { id: 'ALL', label: 'All Statuses' },
              { id: 'PENDING', label: `Pending (${pendingCount})` },
              { id: 'RESTRICTED', label: `Blocked (${restrictedCount})` },
              { id: 'TEMP_RELEASED', label: 'Temp Released' },
              { id: 'PERM_RELEASED', label: 'Perm Released' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === f.id
                    ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100/60 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Record ID & Type</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Visitor Info & Category</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Restriction Matched / Details</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs">Security Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-xs text-right">Action / Release Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {filteredList.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  
                  {/* Record ID & Type */}
                  <td className="p-4">
                    <p className="font-mono font-bold text-slate-800 dark:text-white">{item.id}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      item.recordType === 'Security Review' 
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' 
                        : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {item.recordType}
                    </span>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{item.dateOrTime}</p>
                  </td>

                  {/* Visitor Info & Category */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.photo} alt={item.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 object-cover shrink-0" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.docType}: <strong>{item.docNumber}</strong></p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          item.visitorCategory === 'Contractor Visitor' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {item.visitorCategory}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Restriction Matched / Details */}
                  <td className="p-4">
                    <p className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 shrink-0"/> {item.reason}
                    </p>
                    {item.host && item.host !== '-' && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Host: {item.host}</p>
                    )}
                  </td>

                  {/* Security Status */}
                  <td className="p-4">
                    {item.status === 'Pending Security Review' && (
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-3 h-3"/> Pending Review
                      </span>
                    )}
                    {item.status === 'Restricted' && (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-red-200 dark:border-red-800">
                        <Lock className="w-3 h-3"/> Blocked
                      </span>
                    )}
                    {item.status === 'Denied' && (
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-red-200 dark:border-red-800">
                        <XCircle className="w-3 h-3"/> Denied
                      </span>
                    )}
                    {item.status === 'Temporarily Released' && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-blue-200 dark:border-blue-800">
                        <Clock className="w-3 h-3"/> Temp Released
                      </span>
                    )}
                    {item.status === 'Permanently Released' && (
                      <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full font-bold flex items-center gap-1 w-max text-xs border border-emerald-200 dark:border-emerald-800">
                        <Unlock className="w-3 h-3"/> Perm Released
                      </span>
                    )}
                  </td>

                  {/* Action / Release Details */}
                  <td className="p-4 text-right">
                    {item.status === 'Pending Security Review' && item.rawReview ? (
                      <button 
                        onClick={() => setSelectedReview(item.rawReview)} 
                        className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-xl font-bold shadow-md text-xs transition-colors"
                      >
                        Review Now
                      </button>
                    ) : item.releaseType && item.releaseType !== '-' ? (
                      <div>
                        <p className="font-bold text-xs text-slate-700 dark:text-slate-300">{item.releaseType} Release</p>
                        {item.expiry && item.expiry !== '-' && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Exp: {item.expiry}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">Active Record</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                    No security reviews or restricted visitor records found matching selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Review Action Modal */}
      <AnimatePresence>
        {selectedReview && !actionModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 rounded-[24px] overflow-hidden max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800">
               <div className="bg-amber-50 dark:bg-amber-950/50 border-b border-amber-200 dark:border-amber-900/60 p-6 flex justify-between items-start">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/60 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-300">
                     <AlertTriangle className="w-6 h-6"/>
                   </div>
                   <div>
                     <h3 className="text-2xl font-black text-amber-900 dark:text-amber-200 mb-1">Security Review Required</h3>
                     <p className="text-amber-700 dark:text-amber-400 font-medium text-sm">Visitor intercepted during Check-in attempt.</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedReview(null)} className="text-amber-400 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-200">
                   <X className="w-6 h-6"/>
                 </button>
               </div>
               
               <div className="p-8">
                 <div className="flex gap-8 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">
                   <img src={selectedReview.photo} alt={selectedReview.visitorName} className="w-32 h-32 rounded-2xl object-cover shadow-md border border-slate-200 dark:border-slate-700" />
                   <div>
                     <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Visitor Details</p>
                     <h4 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{selectedReview.visitorName}</h4>
                     <p className="font-mono text-slate-600 dark:text-slate-300 mb-1">ID: <strong>{selectedReview.docNumber}</strong></p>
                     <p className="text-slate-600 dark:text-slate-300">Host: <strong>{selectedReview.host}</strong></p>
                     <p className="text-slate-600 dark:text-slate-300">Attempt Time: <strong>{selectedReview.matchTime}</strong></p>
                   </div>
                 </div>

                 <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl p-6 mb-8">
                   <p className="text-sm font-bold text-red-800 dark:text-red-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                     <ShieldAlert className="w-4 h-4"/> Restriction Matched
                   </p>
                   <p className="font-bold text-red-900 dark:text-red-200 text-lg mb-1">{selectedReview.reason}</p>
                   <p className="text-red-700 dark:text-red-400 text-sm font-medium">Restriction ID: {selectedReview.restrictionId || 'BR-2026-MATCH'}</p>
                 </div>

                 <p className="font-bold text-slate-800 dark:text-white mb-4 text-center">Select Security Action</p>
                 <div className="grid grid-cols-3 gap-4">
                   <button onClick={() => setActionModal('DENY')} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900/60 hover:border-red-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-red-50 dark:bg-red-950/60 text-red-500 rounded-full flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                       <XCircle className="w-5 h-5"/>
                     </div>
                     <span className="font-bold text-red-700 dark:text-red-400">Blocked</span>
                   </button>

                   <button onClick={() => setActionModal('TEMP_RELEASE')} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-900/60 hover:border-blue-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/60 text-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                       <Clock className="w-5 h-5"/>
                     </div>
                     <span className="font-bold text-blue-700 dark:text-blue-400 text-center">Temporary Release</span>
                   </button>

                   <button onClick={() => setActionModal('PERM_RELEASE')} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-500 rounded-xl group transition-colors">
                     <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                       <Unlock className="w-5 h-5"/>
                     </div>
                     <span className="font-bold text-emerald-700 dark:text-emerald-400 text-center">Permanent Release</span>
                   </button>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Configuration Modal */}
      <AnimatePresence>
        {actionModal && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className={`bg-white dark:bg-slate-900 rounded-[24px] p-8 max-w-md w-full border-t-8 ${actionModal === 'DENY' ? 'border-red-500' : actionModal === 'TEMP_RELEASE' ? 'border-blue-500' : 'border-emerald-500'} shadow-2xl`}>
               <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-6">
                 {actionModal === 'DENY' && 'Confirm Denial'}
                 {actionModal === 'TEMP_RELEASE' && 'Configure Temporary Release'}
                 {actionModal === 'PERM_RELEASE' && 'Confirm Permanent Release'}
               </h3>
               
               {actionModal === 'TEMP_RELEASE' && (
                 <div className="mb-4">
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Release Expiry Date/Time *</label>
                   <input type="datetime-local" value={actionDetails.expiry} onChange={(e)=>setActionDetails({...actionDetails, expiry: e.target.value})} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none focus:border-blue-400" />
                 </div>
               )}

               <div className="mb-6">
                 <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Authorization Reason *</label>
                 <textarea value={actionDetails.reason} onChange={(e)=>setActionDetails({...actionDetails, reason: e.target.value})} placeholder="Provide justification for this security decision..." className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white outline-none min-h-[100px]"></textarea>
               </div>

               <div className="flex justify-end gap-3">
                 <button onClick={() => setActionModal(null)} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition-colors">Cancel</button>
                 <button onClick={handleAction} className={`px-8 py-3 text-white rounded-xl font-bold shadow-md transition-colors ${actionModal === 'DENY' ? 'bg-red-600 hover:bg-red-700' : actionModal === 'TEMP_RELEASE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                   Confirm Action
                 </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default SecurityReviews;
