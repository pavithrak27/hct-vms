const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

const summaryJsx = `
      {/* --- SUMMARY CARDS --- */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total List</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredVisitors.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-sm flex flex-col justify-center">
            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">Approved</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => v.status === 'Expected' || v.status === 'Approved').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm flex flex-col justify-center">
            <p className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Checked In</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => v.status === 'Checked In').length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex flex-col justify-center">
            <p className="text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Blocked</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{filteredVisitors.filter(v => v.status === 'Blocked').length}</p>
          </div>
        </div>
      )}
`;

if (!content.includes('SUMMARY CARDS')) {
  content = content.replace(
    '{/* --- VISITOR LIST VIEW --- */}',
    summaryJsx + '\n\n      {/* --- VISITOR LIST VIEW --- */}'
  );
  fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
  console.log('Injected summary cards');
}
