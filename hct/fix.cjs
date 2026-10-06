const fs = require('fs');
const file = 'src/components/security/AdminPassRequests.jsx';
let content = fs.readFileSync(file, 'utf8');

const correctBlock = `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <button onClick={(e) => { e.stopPropagation(); setViewEmployee(emp); }} className="text-hct-blue bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors" title="View Details">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>`;

const startIdx = content.indexOf('<div className="grid grid-cols-1 md:grid-cols-2 gap-4">');
const endIdx = content.indexOf('                </div>', startIdx) + '                </div>'.length;

content = content.substring(0, startIdx) + correctBlock + content.substring(endIdx);
fs.writeFileSync(file, content);
