const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// Fix getStatusBadge call
content = content.replace('{getStatusBadge(selectedVisitor.status)}', '{getStatusBadge(selectedVisitor)}');

// Inject Approve/Reject buttons into the modal
const modalButtonsSearch = '<div className="flex gap-3 pt-2">';
const modalButtonsReplace = `<div className="flex flex-col gap-3 pt-2">
                  {(isHost && selectedVisitor.status === 'Expected') && (
                    <div className="flex gap-3 w-full">
                      <button onClick={() => {
                        setConfirmAction({ type: 'Approve', visitor: selectedVisitor });
                        setSelectedVisitor(null);
                      }} className="flex-1 px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" /> Approve
                      </button>
                      <button onClick={() => {
                        setConfirmAction({ type: 'Reject', visitor: selectedVisitor });
                        setSelectedVisitor(null);
                      }} className="flex-1 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800">
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                  <div className="flex gap-3 w-full">`;

content = content.replace(modalButtonsSearch, modalButtonsReplace);

// We changed the structure, so we need to add a closing div for the extra flex wrapper
const afterButtonsSearch = `                    <ShieldAlert className="w-4 h-4"/> {selectedVisitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                  </button>
                </div>`;
const afterButtonsReplace = `                    <ShieldAlert className="w-4 h-4"/> {selectedVisitor.isBlocked ? 'Unblock Visitor' : 'Block Visitor'}
                  </button>
                </div>
                </div>`; // Close the outer <div className="flex flex-col gap-3 pt-2">

content = content.replace(afterButtonsSearch, afterButtonsReplace);

fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Modal buttons injected.');
