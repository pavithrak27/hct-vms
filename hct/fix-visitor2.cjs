const fs = require('fs');

let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// The exact string in the file (using regex to be safe about whitespace)
const regex = /\{\/\* Registration Type Selector \*\/\}\s+\{step < 4 && \(\s+<div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">\s+<h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type<\/h3>\s+<div className="bg-slate-100 dark:bg-slate-800 p-1\.5 rounded-xl inline-flex shadow-inner">\s+<button \s+onClick=\{\(\) => setActiveTab\('walkin'\)\} \s+className=\{`px-6 py-2 rounded-lg font-bold text-xs transition-colors \$\{activeTab === 'walkin' \? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'\}`\}\s+>\s+Walk-In\s+<\/button>\s+<button \s+onClick=\{\(\) => setActiveTab\('preapproved'\)\} \s+className=\{`px-6 py-2 rounded-lg font-bold text-xs transition-colors \$\{activeTab === 'preapproved' \? 'bg-white text-hct-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'\}`\}\s+>\s+Pre-Approved\s+<\/button>\s+<\/div>\s+<\/div>\s+\)\}/m;

const replacement = `{/* Registration Type Selector */}
              {step < 4 && (
                <div className="flex flex-col items-center mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                  <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Registration Type</h3>
                  {isHost ? (
                    <div className="bg-blue-50 text-hct-blue px-6 py-2 rounded-lg font-bold text-sm shadow-sm border border-blue-200">
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

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
    console.log('Successfully updated VisitorList.jsx');
} else {
    console.log('Regex did not match.');
}
