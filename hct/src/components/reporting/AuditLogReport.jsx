import React from 'react';
import ReportTable from './ReportTable';

const AuditLogReport = () => {
  const auditData = [
    {
      auditId: 'AUD-99201',
      timestamp: '2026-10-04 14:30:12',
      user: 'Security Admin',
      role: 'Security',
      module: 'Restricted Visitors',
      action: 'Temporary Release',
      entity: 'John Smith (BR-2026-00125)',
      prevStatus: 'Restricted',
      newStatus: 'Temporarily Released',
      ip: '192.168.1.105',
      desc: 'Granted temporary release until 18:00. Reason: Exceptional clearance approved.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99200',
      timestamp: '2026-10-04 14:25:00',
      user: 'System',
      role: 'System',
      module: 'Check-in / Check-out',
      action: 'Check-in Intercepted',
      entity: 'John Smith (PASS-00125)',
      prevStatus: '-',
      newStatus: 'Pending Security Review',
      ip: 'Gate Scanner 1',
      desc: 'Restricted visitor match detected during QR scan.',
      result: 'Blocked'
    },
    {
      auditId: 'AUD-99199',
      timestamp: '2026-10-04 12:00:45',
      user: 'Security Reception',
      role: 'Reception',
      module: 'Check-in / Check-out',
      action: 'Force Check-out',
      entity: 'David Brown (VIS-0999)',
      prevStatus: 'Checked In',
      newStatus: 'Force Checked Out',
      ip: '192.168.1.42',
      desc: 'Visitor left without scanning.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99198',
      timestamp: '2026-10-04 10:30:00',
      user: 'HR Dept',
      role: 'Host',
      module: 'Visitor Management',
      action: 'Visitor Approved',
      entity: 'Mike Ross (PASS-00126)',
      prevStatus: 'Pending',
      newStatus: 'Approved',
      ip: '10.0.0.55',
      desc: 'Pre-scheduled visit approved by host.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99197',
      timestamp: '2026-10-04 08:00:12',
      user: 'System',
      role: 'System',
      module: 'Check-in / Check-out',
      action: 'QR Check-in',
      entity: 'David Brown (PASS-00118)',
      prevStatus: 'Active',
      newStatus: 'Checked In',
      ip: 'Gate Scanner 2',
      desc: 'First valid scan at entry gate.',
      result: 'Success'
    }
  ];

  const columns = [
    { header: 'Audit ID & Time', accessor: 'auditId', render: (row) => (
      <div>
        <p className="font-mono text-[10px] text-slate-400">{row.auditId}</p>
        <p className="font-bold text-slate-800 text-xs">{row.timestamp}</p>
      </div>
    ) },
    { header: 'User Info', accessor: 'user', render: (row) => (
      <div>
        <p className="font-bold text-slate-800">{row.user}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase">{row.role} • {row.ip}</p>
      </div>
    ) },
    { header: 'Action Context', accessor: 'action', render: (row) => (
      <div>
        <p className="font-bold text-hct-blue text-xs uppercase tracking-wider">{row.module}</p>
        <p className="font-bold text-slate-800">{row.action}</p>
        <p className="text-[10px] text-slate-500">{row.entity}</p>
      </div>
    ) },
    { header: 'State Change', accessor: 'newStatus', render: (row) => (
      <div className="text-[10px] font-bold">
        {row.prevStatus !== '-' && <p className="text-slate-400 line-through mb-0.5">{row.prevStatus}</p>}
        <p className="text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded w-max">{row.newStatus}</p>
      </div>
    ) },
    { header: 'Description', accessor: 'desc', render: (row) => <span className="text-xs text-slate-600 truncate max-w-[200px] block" title={row.desc}>{row.desc}</span> },
    { header: 'Result', accessor: 'result', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.result === 'Success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {row.result}
      </span>
    )}
  ];

  return (
    <ReportTable 
      title="Audit Log Report" 
      description="Immutable system-wide log capturing all important actions, state changes, and workflow events."
      columns={columns}
      data={auditData}
      searchPlaceholder="Search by Audit ID, User, or Entity..."
      searchableKeys={['auditId', 'user', 'entity', 'action', 'desc']}
    />
  );
};

export default AuditLogReport;
