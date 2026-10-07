const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

const actionsSearch = '<td className="px-6 py-4 text-right">';
const actionsReplace = `<td className="px-6 py-4 text-right">
  <div className="flex justify-end items-center gap-2">
    {(isHost && visitor.status === 'Expected') && (
      <>
        <button onClick={() => {
          setVisitorsList(visitorsList.map(v => v.id === visitor.id ? { ...v, status: 'Checked In' } : v));
        }} className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-wide">
          <CheckCircle2 className="w-4 h-4" /> Approve
        </button>
        <button onClick={() => {
          setVisitorsList(visitorsList.map(v => v.id === visitor.id ? { ...v, status: 'Blocked' } : v));
        }} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)] rounded-xl text-xs font-black transition-all flex items-center gap-2 uppercase tracking-wide">
          <XCircle className="w-4 h-4" /> Reject
        </button>
      </>
    )}
    <button onClick={() => setSelectedVisitor(visitor)} className="p-2 text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/30 border border-transparent hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] rounded-xl transition-all" title="View Details">
      <Eye className="w-5 h-5" />
    </button>
    <div className="relative">
      <button 
        onClick={() => setActiveMenuId(activeMenuId === visitor.id ? null : visitor.id)}
        className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 border border-transparent hover:border-slate-600 rounded-xl transition-all"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {activeMenuId === visitor.id && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F172A]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
            <button 
              onClick={() => { 
                setVisitorToBlock(visitor);
                setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny');
                setShowBlockModal(true);
                setActiveMenuId(null); 
              }} 
              className={\`w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 \${visitor.isBlocked ? 'text-emerald-400 hover:bg-emerald-500/20' : 'text-red-400 hover:bg-red-500/20'}\`}
            >
              <ShieldAlert className="w-4 h-4"/> {visitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
            </button>
        </div>
      )}
    </div>
  </div>
</td>
<!--ACTIONS_END-->`;

// Using split and splice to accurately replace the block
const parts = content.split('<td className="px-6 py-4 text-right">');
if (parts.length > 1) {
  const restOfFile = parts[1];
  const endOfActions = restOfFile.indexOf('</td>') + 5;
  content = parts[0] + actionsReplace.replace('<!--ACTIONS_END-->', '') + restOfFile.substring(endOfActions);
}

const theadSearch = '<thead className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700/50">';
const theadReplace = `<thead className="bg-gradient-to-r from-indigo-900/40 to-blue-900/40 text-indigo-100 border-b border-indigo-500/30 backdrop-blur-xl">
  <tr>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">ID</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">Visitor Name</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">Host</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">Type</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">Date & Time</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300">Status</th>
    <th className="px-6 py-5 font-black uppercase tracking-[0.2em] text-[10px] text-indigo-300 text-right">Actions</th>
  </tr>
</thead>
<!--THEAD_END-->`;

const theadParts = content.split(theadSearch);
if (theadParts.length > 1) {
  const rest = theadParts[1];
  const end = rest.indexOf('</thead>') + 8;
  content = theadParts[0] + theadReplace.replace('<!--THEAD_END-->', '') + rest.substring(end);
}

// Ensure the container is aesthetic
const containerSearch = 'className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden"';
const containerReplace = 'className="bg-white/10 dark:bg-[#0B1121]/80 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-white/20 dark:border-white/10 overflow-hidden relative ring-1 ring-white/10"';
content = content.replace(containerSearch, containerReplace);

fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Fixed actions and thead');
