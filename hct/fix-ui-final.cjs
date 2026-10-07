const fs = require('fs');
let content = fs.readFileSync('src/components/visitor/VisitorList.jsx', 'utf8');

// 1. Fix Mock Data to ensure the 'Expected' status is set for Host's visitors
content = content.replace(
  /const initialVisitors = \[[\s\S]*?\];/,
  `const initialVisitors = [
  { id: 'V-1021', name: 'John Smith', company: 'Tech Solutions LLC', host: 'Dr. Ahmed Al-Maktoum', type: 'Walk-In', date: '2026-10-05', time: '09:00 AM', status: 'Expected', phone: '+971 50 123 4567', docId: '784-1990-1234567-1', isBlocked: false },
  { id: 'V-1023', name: 'Michael Chang', company: 'Global Services', host: 'Prof. Tariq', type: 'Contractor', date: '2026-10-05', time: '11:15 AM', status: 'Expected', phone: '+971 52 555 1234', docId: '784-1985-7654321-9', isBlocked: false },
  { id: 'V-1024', name: 'Emma Wilson', company: 'Ministry of Education', host: 'Prof. Tariq', type: 'Guest', date: '2026-10-05', time: '01:00 PM', status: 'Expected', phone: '+971 54 333 9999', docId: '784-1992-1112223-4', isBlocked: false },
  { id: 'V-1025', name: 'David Lee', company: 'ABC Cleaning', host: 'Jane Doe', type: 'Delivery', date: '2026-10-05', time: '02:45 PM', status: 'Expected', phone: '+971 56 777 8888', docId: 'P-11223344', isBlocked: true },
];`
);

// 2. Futuristic UI - Container
content = content.replace(
  `className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col"`,
  `className="bg-white/20 dark:bg-[#080d19]/60 backdrop-blur-3xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(59,130,246,0.1)] border border-white/40 dark:border-white/10 flex flex-col overflow-hidden ring-1 ring-black/5 dark:ring-white/10 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none"`
);

// 3. Toolbar
content = content.replace(
  `className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 rounded-t-[24px]"`,
  `className="p-5 border-b border-white/20 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-100/50 to-white/50 dark:from-slate-800/40 dark:to-[#080d19]/40 backdrop-blur-md relative z-10"`
);

// 4. Thead
content = content.replace(
  `<thead className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">`,
  `<thead className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-indigo-100 dark:border-indigo-500/20 text-indigo-900/70 dark:text-indigo-200 backdrop-blur-xl relative z-10">`
);

// 5. TR headers
content = content.replaceAll(
  `className="p-4 font-bold uppercase tracking-wider"`,
  `className="p-5 font-extrabold uppercase tracking-widest text-[11px] opacity-90"`
);

// 6. TR rows
content = content.replaceAll(
  `<tr key={visitor.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors relative">`,
  `<tr key={visitor.id} className="hover:bg-white/40 dark:hover:bg-white/5 transition-all duration-300 relative group cursor-pointer border-b border-slate-100/50 dark:border-white/5 last:border-0 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] z-10">`
);

// 7. Names
content = content.replaceAll(
  `<p className="font-bold text-slate-800 dark:text-white">{visitor.name}</p>`,
  `<p className="font-black text-slate-800 dark:text-white text-base tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{visitor.name}</p>`
);

// 8. Td styles
content = content.replaceAll(
  `className="px-6 py-4 font-medium text-slate-500"`,
  `className="px-6 py-5 font-bold text-indigo-500/80 dark:text-indigo-400/80 text-xs"`
);

// 9. Ensure approve/reject buttons use nice classes
content = content.replace(
  `className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"`,
  `className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"`
);
content = content.replace(
  `className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"`,
  `className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"`
);

fs.writeFileSync('src/components/visitor/VisitorList.jsx', content);
console.log('Futuristic UI applied to VisitorList.jsx');
