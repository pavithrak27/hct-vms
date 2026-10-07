const fs = require('fs');

let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

const searchStr = `<div className="flex justify-end items-center gap-2">
                             <button onClick={() => setSelectedVisitor(visitor)} className="p-1.5 text-slate-400 hover:text-hct-blue bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View Details">
                               <Eye className="w-4 h-4" />
                             </button>
                             <div className="relative">
                               <button 
                                 onClick={() => setActiveMenuId(activeMenuId === visitor.id ? null : visitor.id)}
                                 className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                               >
                                 <MoreVertical className="w-4 h-4" />
                               </button>
                               {activeMenuId === visitor.id && (
                                 <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                                     <button 
                                       onClick={() => { 
                                         setVisitorToBlock(visitor);
                                         setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny');
                                         setShowBlockModal(true);
                                         setActiveMenuId(null); 
                                       }} 
                                       className={\`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 \${visitor.isBlocked ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}\`}
                                     >
                                       <ShieldAlert className="w-4 h-4"/> {visitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                                     </button>
                                 </div>
                               )}
                             </div>
                          </div>`;

const replacement = `<div className="flex justify-end items-center gap-2">
                             {(isHost && visitor.status === 'Expected') && (
                               <>
                                 <button onClick={() => {
                                   setVisitorsList(visitorsList.map(v => v.id === visitor.id ? { ...v, status: 'Approved' } : v));
                                 }} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                                   <CheckCircle2 className="w-3 h-3" /> Approve
                                 </button>
                                 <button onClick={() => {
                                   setVisitorsList(visitorsList.map(v => v.id === visitor.id ? { ...v, status: 'Rejected' } : v));
                                 }} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1">
                                   <XCircle className="w-3 h-3" /> Reject
                                 </button>
                               </>
                             )}
                             <button onClick={() => setSelectedVisitor(visitor)} className="p-1.5 text-slate-400 hover:text-hct-blue bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="View Details">
                               <Eye className="w-4 h-4" />
                             </button>
                             <div className="relative">
                               <button 
                                 onClick={() => setActiveMenuId(activeMenuId === visitor.id ? null : visitor.id)}
                                 className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-50 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                               >
                                 <MoreVertical className="w-4 h-4" />
                               </button>
                               {activeMenuId === visitor.id && (
                                 <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
                                     <button 
                                       onClick={() => { 
                                         setVisitorToBlock(visitor);
                                         setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny');
                                         setShowBlockModal(true);
                                         setActiveMenuId(null); 
                                       }} 
                                       className={\`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 \${visitor.isBlocked ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20' : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}\`}
                                     >
                                       <ShieldAlert className="w-4 h-4"/> {visitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                                     </button>
                                 </div>
                               )}
                             </div>
                          </div>`;

content = content.replace(searchStr, replacement);
fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Added Approve/Reject buttons to VisitorList.jsx');
