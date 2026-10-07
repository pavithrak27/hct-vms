const fs = require('fs');
const files = ['CampusAdminDashboard', 'HostDashboard', 'VisitorDashboard', 'SecurityDashboard', 'ContractorDashboard', 'ApproverDashboard', 'ReceptionDashboard'];
files.forEach(f => {
  fs.writeFileSync('./dashboards/' + f + '.jsx', 'import React from "react";\nexport default function ' + f + '() { return <div className="p-6">' + f + ' Placeholder</div>; }\n');
});
console.log('done');
