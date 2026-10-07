const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// 1. Fix the container to be clean white
const containerSearch = 'className="bg-white/10 dark:bg-[#0B1121]/80 backdrop-blur-3xl rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-white/20 dark:border-white/10 overflow-hidden relative ring-1 ring-white/10"';
const containerReplace = 'className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden relative"';
content = content.replace(containerSearch, containerReplace);

// Remove the gradient overlay
content = content.replace('<div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>', '');

// 2. Fix the Table Header to be crisp
const theadSearch = /<thead className="bg-gradient-to-r from-indigo-900\/40 to-blue-900\/40[\s\S]*?<\/thead>/;
const theadReplace = `
<thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
  <tr>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">ID</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Visitor Name</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Host</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Type</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Date & Time</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
    <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
  </tr>
</thead>
`;
content = content.replace(theadSearch, theadReplace);

// 3. Fix the Table Rows to be clean
content = content.replaceAll(
  'className="hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 relative group cursor-pointer border-b border-slate-100/50 dark:border-white/5 last:border-0 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] z-10"',
  'className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0 group"'
);

// Fix text styles in the row
content = content.replaceAll(
  'className="px-6 py-5 font-bold text-indigo-500/80 dark:text-indigo-400/80 text-xs"',
  'className="px-6 py-4 font-medium text-slate-600 dark:text-slate-400"'
);

content = content.replaceAll(
  'className="font-black text-slate-800 dark:text-white text-base tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"',
  'className="font-bold text-slate-900 dark:text-white"'
);

// 4. Update the Action Buttons to open the Modal
const actionsSearch = /<td className="px-6 py-4 text-right">[\s\S]*?<\/td>/;
const actionsReplace = `
<td className="px-6 py-4 text-right">
  <div className="flex justify-end items-center gap-2">
    {(isHost && visitor.status === 'Expected') && (
      <>
        <button onClick={() => {
          setConfirmAction({ type: 'Approve', visitor });
        }} className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
        </button>
        <button onClick={() => {
          setConfirmAction({ type: 'Reject', visitor });
        }} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-red-200 dark:border-red-800">
          <XCircle className="w-3.5 h-3.5" /> Reject
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
        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
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
  </div>
</td>
`;
content = content.replace(actionsSearch, actionsReplace);

// 5. Inject State variable for Confirm Modal
if (!content.includes('const [confirmAction, setConfirmAction]')) {
  content = content.replace(
    'const [visitorToBlock, setVisitorToBlock] = useState(null);',
    'const [visitorToBlock, setVisitorToBlock] = useState(null);\n  const [confirmAction, setConfirmAction] = useState(null); // { type: \'Approve\' | \'Reject\', visitor }'
  );
}

// 6. Inject the Confirm Modal JSX
const modalJsx = `
      {/* Confirm Action Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {confirmAction.type} Visitor
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
                Are you sure you want to {confirmAction.type.toLowerCase()} the visit for <strong>{confirmAction.visitor.name}</strong>?
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setVisitorsList(visitorsList.map(v => v.id === confirmAction.visitor.id ? { ...v, status: confirmAction.type === 'Approve' ? 'Checked In' : 'Blocked' } : v));
                    setConfirmAction(null);
                  }}
                  className={\`flex-1 px-4 py-2 text-white rounded-xl font-bold text-sm transition-colors shadow-sm \${confirmAction.type === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}\`}
                >
                  Yes, {confirmAction.type}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
`;

if (!content.includes('Confirm Action Modal')) {
  // Inject right before the last closing div of the return statement
  content = content.replace(
    /\n    <\/div>\n  \);\n}\n\s*export default VisitorList;/,
    `\n${modalJsx}\n    </div>\n  );\n}\n\nexport default VisitorList;`
  );
}

fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Clean UI and Confirm Modal applied');
