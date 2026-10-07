const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

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
  // Inject right before Security Action Modal
  content = content.replace('{/* Security Action Modal */}', modalJsx + '\n      {/* Security Action Modal */}');
  
  if (!content.includes('Confirm Action Modal')) {
     // fallback: inject right before the final closing div
     const idx = content.lastIndexOf('</div>');
     if (idx !== -1) {
       content = content.substring(0, idx) + modalJsx + '\n' + content.substring(idx);
     }
  }

  fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
  console.log('Modal injected!');
} else {
  console.log('Modal already exists.');
}
