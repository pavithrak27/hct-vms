const fs = require('fs');
const path = 'c:\\Users\\iproa_jfqyrsl\\Downloads\\web-projects\\hct\\src\\components\\dashboard\\DashboardView.jsx';
let content = fs.readFileSync(path, 'utf8');

// Use regex to replace to avoid exact whitespace issues
content = content.replace(
  /<div className="grid grid-cols-3 gap-2.5 mb-5">/g,
  '<div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 mb-5">'
);

const newTiles = `              {/* Tile 1b: Contractor Check In */}
              <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Contractor<br />Check In
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">12</span>
                </div>
              </div>

              {/* Tile 1c: Contractor Check Out */}
              <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Contractor<br />Check Out
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">8</span>
                </div>
              </div>

              {/* Tile 1d: Employees Count */}
              <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight">
                  Total<br />Employees
                </span>
                <div className="mt-2.5">
                  <span className="text-2xl font-black text-slate-900 dark:text-white block">45</span>
                </div>
              </div>

              {/* Tile 2: Expired Passes */}`;

content = content.replace(
  /\{\/\* Tile 2: Expired Passes \*\/\}/g,
  newTiles
);

fs.writeFileSync(path, content, 'utf8');
console.log('Success');
