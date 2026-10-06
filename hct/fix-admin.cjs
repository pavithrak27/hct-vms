const fs = require('fs');

const file = 'src/components/security/AdminPassRequests.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add viewEmployee state
if (!content.includes('const [viewEmployee, setViewEmployee] = useState(null);')) {
  content = content.replace(
    'const [renewModalData, setRenewModalData] = useState(null); // holds pass to renew',
    'const [renewModalData, setRenewModalData] = useState(null); // holds pass to renew\n  const [viewEmployee, setViewEmployee] = useState(null);'
  );
}

// 2. Replace the employee list rendering (exact substring match to avoid bullet point issues)
const targetBlock = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employeesData[selectedCompany.id].map(emp => (
                    <div key={emp.id} onClick={() => {
                      if(selectedEmps.includes(emp.id)) setSelectedEmps(selectedEmps.filter(id=>id!==emp.id));
                      else setSelectedEmps([...selectedEmps, emp.id]);
                    }} className={\`border-2 rounded-xl p-4 cursor-pointer transition-all flex gap-4 items-center \${selectedEmps.includes(emp.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}\`}>
                      <div className={\`w-6 h-6 rounded-md flex items-center justify-center border \${selectedEmps.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}\`}>
                        {selectedEmps.includes(emp.id) && <Check className="w-4 h-4"/>}
                      </div>
                      <div><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.nationality}</p></div>
                    </div>
                  ))}
                </div>`;

const newBlock = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {employeesData[selectedCompany.id].map(emp => (
                    <div key={emp.id} onClick={() => {
                      if(selectedEmps.includes(emp.id)) setSelectedEmps(selectedEmps.filter(id=>id!==emp.id));
                      else setSelectedEmps([...selectedEmps, emp.id]);
                    }} className={\`border-2 rounded-xl p-4 cursor-pointer transition-all flex justify-between items-center \${selectedEmps.includes(emp.id) ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}\`}>
                      <div className="flex gap-4 items-center">
                        <div className={\`w-6 h-6 rounded-md flex items-center justify-center border \${selectedEmps.includes(emp.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}\`}>
                          {selectedEmps.includes(emp.id) && <Check className="w-4 h-4"/>}
                        </div>
                        <div><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.nationality}</p></div>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setViewEmployee(emp); }} className="text-hct-blue bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors" title="View Details">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>`;

content = content.replace(targetBlock, newBlock);

// 3. Add the modal at the end before </motion.div>
const modalStr = `
      {/* View Employee Details Modal */}
      {viewEmployee && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[120] p-4">
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setViewEmployee(null)} className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X className="w-5 h-5"/></button>
            <h3 className="text-xl font-bold mb-6">Employee Details</h3>
            <div className="flex items-center gap-4 mb-6">
              <img src={viewEmployee.photo || \`https://ui-avatars.com/api/?name=\${viewEmployee.name}&background=random\`} alt={viewEmployee.name} className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
              <div>
                <p className="font-bold text-lg text-slate-800">{viewEmployee.name}</p>
                <p className="text-sm text-slate-500">{viewEmployee.id} • {viewEmployee.nationality || 'Nationality N/A'}</p>
                <p className="text-sm text-slate-500">{viewEmployee.mobile || 'Mobile N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">Identity Documents</h4>
              {viewEmployee.document ? (
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <FileText className="w-5 h-5 text-hct-blue" />
                  <span className="font-bold text-slate-700 flex-1">{viewEmployee.document}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Valid</span>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No documents available.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
`;

if (!content.includes('View Employee Details Modal')) {
  content = content.replace('    </motion.div>\r\n  );\r\n};\r\n\r\nexport default AdminPassRequests;', modalStr + '\n    </motion.div>\r\n  );\r\n};\r\n\r\nexport default AdminPassRequests;');
  content = content.replace('    </motion.div>\n  );\n};\n\nexport default AdminPassRequests;', modalStr + '\n    </motion.div>\n  );\n};\n\nexport default AdminPassRequests;');
}

fs.writeFileSync(file, content);
