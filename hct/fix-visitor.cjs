const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// 1. Add useRole import
if (!content.includes('useRole')) {
  content = content.replace('import { Search', 'import { useRole } from \'../../context/RoleContext\';\nimport { Search');
}

// 2. Add useRole hook inside component
if (!content.includes('const { sessionUser } = useRole()')) {
  content = content.replace('const VisitorList = () => {', 'const VisitorList = () => {\n  const { sessionUser } = useRole();\n  const isHost = sessionUser?.role === \'host\';');
}

// 3. Modify Add New Visitor button logic
content = content.replace('setActiveTab(\'walkin\');', 'setActiveTab(isHost ? \'preapproved\' : \'walkin\');');

// 4. Modify Registration Type Selector
const searchStr = '{/* Registration Type Selector */}\n              {step < 4 && (\n                <div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">\n                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type</h3>\n                  <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex shadow-inner">\n                    <button \n                      onClick={() => setActiveTab(\'walkin\')} \n                      className={`px-6 py-2 rounded-lg font-bold text-xs transition-colors ${activeTab === \'walkin\' ? \'bg-white text-hct-blue shadow-sm\' : \'text-slate-500 hover:text-slate-700\'}`}\n                    >\n                      Walk-In\n                    </button>\n                    <button \n                      onClick={() => setActiveTab(\'preapproved\')} \n                      className={`px-6 py-2 rounded-lg font-bold text-xs transition-colors ${activeTab === \'preapproved\' ? \'bg-white text-hct-blue shadow-sm\' : \'text-slate-500 hover:text-slate-700\'}`}\n                    >\n                      Pre-Approved\n                    </button>\n                  </div>\n                </div>\n              )}';

const replacement = `{/* Registration Type Selector */}
              {step < 4 && (
                <div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type</h3>
                  {isHost ? (
                    <div className="bg-blue-50 text-hct-blue px-6 py-2 rounded-lg font-bold text-sm shadow-sm">
                      Pre-Approved Registration
                    </div>
                  ) : (
                    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex shadow-inner">
                      <button 
                        onClick={() => setActiveTab('walkin')} 
                        className={\`px-6 py-2 rounded-lg font-bold text-xs transition-colors \${activeTab === 'walkin' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                      >
                        Walk-In
                      </button>
                      <button 
                        onClick={() => setActiveTab('preapproved')} 
                        className={\`px-6 py-2 rounded-lg font-bold text-xs transition-colors \${activeTab === 'preapproved' ? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
                      >
                        Pre-Approved
                      </button>
                    </div>
                  )}
                </div>
              )}`;

content = content.replace(searchStr, replacement);
fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Successfully updated VisitorList.jsx');
