const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/dashboards/HostDashboard.jsx', 'utf8');

// Replace any occurrence of \` with `
content = content.replace(/\\`/g, '`');
// Replace any occurrence of \$ with $
content = content.replace(/\\\$/g, '$');

fs.writeFileSync('src/components/dashboard/dashboards/HostDashboard.jsx', content);
console.log('Fixed escapes.');
