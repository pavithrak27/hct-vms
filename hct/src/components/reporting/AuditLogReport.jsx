import React from 'react';
import ReportTable from './ReportTable';
import { Monitor, Smartphone, Laptop, Cpu } from 'lucide-react';

const AuditLogReport = () => {
  const auditData = [
    {
      auditId: 'AUD-99205',
      timestamp: '2026-10-09 16:45:10',
      user: 'Security Guard Gate 1',
      role: 'Security',
      module: 'Check-in / Check-out',
      action: 'Gate Check-out',
      entity: 'Sarah Jenkins (VIS-2026-0891)',
      prevStatus: 'Checked In',
      newStatus: 'Checked Out',
      ip: '192.168.1.112',
      deviceInfo: {
        name: 'Gate Reader 01',
        type: 'Mobile Reader',
        location: 'North Gate Turnstile',
        ip: '192.168.1.112'
      },
      desc: 'NFC Pass scan completed at exit gate. Badge returned.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99204',
      timestamp: '2026-10-09 16:15:30',
      user: 'System Kiosk',
      role: 'System',
      module: 'Check-in / Check-out',
      action: 'Kiosk Self Check-in',
      entity: 'Robert Chen (CONT-9912)',
      prevStatus: 'Approved',
      newStatus: 'Checked In',
      ip: '10.0.8.22',
      deviceInfo: {
        name: 'Lobby Touch Kiosk 02',
        type: 'Kiosk Terminal',
        location: 'Main HQ Reception',
        ip: '10.0.8.22'
      },
      desc: 'Self check-in via QR code scan and HSE agreement signed.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99203',
      timestamp: '2026-10-09 15:30:00',
      user: 'Security Admin',
      role: 'Security',
      module: 'Security Review',
      action: 'Clearance Override',
      entity: 'Alexander Wright (WALK-0412)',
      prevStatus: 'Flagged',
      newStatus: 'Cleared',
      ip: '192.168.1.105',
      deviceInfo: {
        name: 'Admin Desktop Security 1',
        type: 'Web Workstation',
        location: 'Security Control Room',
        ip: '192.168.1.105'
      },
      desc: 'Manual identity verification passed. Host confirmation attached.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99202',
      timestamp: '2026-10-09 14:30:12',
      user: 'Security Officer',
      role: 'Security',
      module: 'Restricted Visitors',
      action: 'Temporary Release',
      entity: 'John Smith (BR-2026-00125)',
      prevStatus: 'Restricted',
      newStatus: 'Temporarily Released',
      ip: '192.168.1.105',
      deviceInfo: {
        name: 'Admin Desktop Security 1',
        type: 'Web Workstation',
        location: 'Security Control Room',
        ip: '192.168.1.105'
      },
      desc: 'Granted temporary release until 18:00. Reason: Exceptional clearance approved.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99201',
      timestamp: '2026-10-09 14:25:00',
      user: 'System Automated Gate',
      role: 'System',
      module: 'Check-in / Check-out',
      action: 'Check-in Intercepted',
      entity: 'John Smith (PASS-00125)',
      prevStatus: 'Active Pass',
      newStatus: 'Pending Security Review',
      ip: '192.168.2.14',
      deviceInfo: {
        name: 'East Turnstile Gate Scanner',
        type: 'Turnstile Scanner',
        location: 'East Employee Entry',
        ip: '192.168.2.14'
      },
      desc: 'Restricted watchlist match detected during turnstile QR scan.',
      result: 'Blocked'
    },
    {
      auditId: 'AUD-99200',
      timestamp: '2026-10-09 12:00:45',
      user: 'Security Reception',
      role: 'Reception',
      module: 'Check-in / Check-out',
      action: 'Force Check-out',
      entity: 'David Brown (VIS-0999)',
      prevStatus: 'Checked In',
      newStatus: 'Force Checked Out',
      ip: '192.168.1.42',
      deviceInfo: {
        name: 'Reception Mobile Reader',
        type: 'Mobile Reader',
        location: 'Main Reception Desk',
        ip: '192.168.1.42'
      },
      desc: 'Visitor left premises without scanning out at turnstile.',
      result: 'Warning'
    },
    {
      auditId: 'AUD-99199',
      timestamp: '2026-10-09 10:30:00',
      user: 'HR Department',
      role: 'Host',
      module: 'Visitor Management',
      action: 'Visitor Approved',
      entity: 'Mike Ross (PASS-00126)',
      prevStatus: 'Pending Approval',
      newStatus: 'Approved',
      ip: '10.0.0.55',
      deviceInfo: {
        name: 'HR Web Console',
        type: 'Web Workstation',
        location: 'Building B HR Office',
        ip: '10.0.0.55'
      },
      desc: 'Pre-scheduled vendor visit approved by host department.',
      result: 'Success'
    },
    {
      auditId: 'AUD-99198',
      timestamp: '2026-10-09 08:00:12',
      user: 'System Automated Gate',
      role: 'System',
      module: 'Check-in / Check-out',
      action: 'QR Check-in',
      entity: 'David Brown (PASS-00118)',
      prevStatus: 'Approved',
      newStatus: 'Checked In',
      ip: '192.168.2.15',
      deviceInfo: {
        name: 'Main South Gate Scanner',
        type: 'Turnstile Scanner',
        location: 'South Gate Barrier',
        ip: '192.168.2.15'
      },
      desc: 'First valid turnstile scan at main south barrier.',
      result: 'Success'
    }
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Turnstile Scanner':
        return <Cpu className="w-3.5 h-3.5 text-blue-500" />;
      case 'Kiosk Terminal':
        return <Monitor className="w-3.5 h-3.5 text-purple-500" />;
      case 'Mobile Reader':
        return <Smartphone className="w-3.5 h-3.5 text-amber-500" />;
      case 'Web Workstation':
      default:
        return <Laptop className="w-3.5 h-3.5 text-emerald-500" />;
    }
  };

  const columns = [
    {
      header: 'Audit ID & Time',
      accessor: 'auditId',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white block">{row.auditId}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">{row.timestamp}</span>
        </div>
      )
    },
    {
      header: 'Initiator / User',
      accessor: 'user',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{row.user}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">Role: {row.role}</span>
        </div>
      )
    },
    {
      header: 'Action & Entity',
      accessor: 'action',
      render: (row) => (
        <div>
          <span className="text-xs font-bold text-hct-blue block">{row.action}</span>
          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium block truncate max-w-[180px]" title={row.entity}>
            {row.entity}
          </span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 inline-block mt-0.5">
            Module: {row.module}
          </span>
        </div>
      )
    },
    {
      header: 'Device Info',
      accessor: 'deviceInfo',
      render: (row) => (
        <div>
          <div className="flex items-center gap-1">
            {getDeviceIcon(row.deviceInfo.type)}
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{row.deviceInfo.name}</span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{row.deviceInfo.location}</span>
          <span className="font-mono text-[9px] text-slate-400 block">{row.deviceInfo.ip}</span>
        </div>
      )
    },
    {
      header: 'State Change',
      accessor: 'prevStatus',
      render: (row) => (
        <div className="text-[11px]">
          <span className="text-slate-500 dark:text-slate-400 line-through">{row.prevStatus}</span>
          <span className="text-slate-400 mx-1">→</span>
          <span className="font-bold text-slate-800 dark:text-white">{row.newStatus}</span>
        </div>
      )
    },
    {
      header: 'Description',
      accessor: 'desc',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 max-w-[220px] block truncate" title={row.desc}>
          {row.desc}
        </span>
      )
    },
    {
      header: 'Result',
      accessor: 'result',
      render: (row) => {
        let badgeStyle = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
        if (row.result === 'Blocked') badgeStyle = 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800';
        if (row.result === 'Warning') badgeStyle = 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';

        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${badgeStyle}`}>
            {row.result}
          </span>
        );
      }
    }
  ];

  return (
    <ReportTable
      title="Audit Log Report"
      description="Immutable system-wide log capturing all check-in/check-out activities, device info, state changes, and security events."
      columns={columns}
      data={auditData}
      searchPlaceholder="Search by Audit ID, User, Device, or Entity..."
      searchableKeys={['auditId', 'user', 'entity', 'action', 'desc']}
    />
  );
};

export default AuditLogReport;
