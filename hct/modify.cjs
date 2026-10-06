const fs = require('fs');
const file = 'src/components/security/AdminPassRequests.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                      <div><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.nationality}</p></div>
                    </div>`;

const replacement = `                      <div className="flex-1"><p className="font-bold text-slate-800">{emp.name}</p><p className="text-xs text-slate-500">{emp.id} • {emp.nationality}</p></div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setViewEmployee(emp); }} className="text-hct-blue bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors" title="View Details">
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>`;

content = content.replace(target, replacement);
fs.writeFileSync(file, content);
