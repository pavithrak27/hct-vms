const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// 1. Add state variables
const stateTarget = `  // Document Viewer Modal
  const [showDocModal, setShowDocModal] = useState(false);`;

const stateReplacement = `  // Document Viewer Modal
  const [showDocModal, setShowDocModal] = useState(false);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [visitorToTransfer, setVisitorToTransfer] = useState(null);
  const [transferCampus, setTransferCampus] = useState('');
  const [transferDate, setTransferDate] = useState('');

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    if(!transferCampus || !transferDate) {
      alert("Please select campus and future date.");
      return;
    }
    // Update the visitor's date (and theoretically campus, though not displayed directly in list)
    setVisitorsList(visitorsList.map(v => 
      v.id === visitorToTransfer.id ? { ...v, date: transferDate } : v
    ));
    alert(\`Visitor \${visitorToTransfer.name} transferred to \${transferCampus} on \${transferDate}.\`);
    setShowTransferModal(false);
    setVisitorToTransfer(null);
    setTransferCampus('');
    setTransferDate('');
  };`;

// 2. Add the button in the dropdown menu
const menuTarget = `                              {activeMenuId === visitor.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                  <button
                                    onClick={() => { setVisitorToBlock(visitor); setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny'); setShowBlockModal(true); setActiveMenuId(null); }}`;

const menuReplacement = `                              {activeMenuId === visitor.id && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                  {isHost && visitor.status === 'Approved' && (
                                    <button
                                      onClick={() => { setVisitorToTransfer(visitor); setShowTransferModal(true); setActiveMenuId(null); }}
                                      className="w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                      Transfer Campus
                                    </button>
                                  )}
                                  <button
                                    onClick={() => { setVisitorToBlock(visitor); setSecurityActionType(visitor.isBlocked ? 'temp' : 'deny'); setShowBlockModal(true); setActiveMenuId(null); }}`;

// 3. Add the modal at the end before final closing div
const modalTarget = `      {/* Document Viewer Modal */}`;

const modalReplacement = `      {/* Transfer Modal */}
      {showTransferModal && visitorToTransfer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTransferModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" />
                Transfer Visitor
              </h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleTransferSubmit} className="p-6 space-y-5">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Transfer visitor <span className="font-bold text-slate-900 dark:text-white">{visitorToTransfer.name}</span> to another campus.
              </p>
              
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Campus *</label>
                <select required value={transferCampus} onChange={(e) => setTransferCampus(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm">
                  <option value="">Select Campus</option>
                  <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
                  <option value="Dubai Men's Campus">Dubai Men's Campus</option>
                  <option value="Dubai Women's Campus">Dubai Women's Campus</option>
                  <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">Select Future Date *</label>
                <input required type="date" min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-hct-blue outline-none text-sm" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-500/30">Transfer</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Document Viewer Modal */}`;

function replaceHelper(src, trg, rpl) {
    if (src.includes(trg)) return src.replace(trg, rpl);
    const trgCRLF = trg.replace(/\n/g, '\r\n');
    const rplCRLF = rpl.replace(/\n/g, '\r\n');
    if (src.includes(trgCRLF)) return src.replace(trgCRLF, rplCRLF);
    return src;
}

content = replaceHelper(content, stateTarget, stateReplacement);
content = replaceHelper(content, menuTarget, menuReplacement);
content = replaceHelper(content, modalTarget, modalReplacement);

fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Script executed');
