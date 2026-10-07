import React, { useState } from 'react';
import ReportTable from './ReportTable';
import { useRole } from '../../context/RoleContext';

const VisitorDirectoryReport = () => {
  const { sessionUser } = useRole();
  const isHost = sessionUser?.role === 'host';
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Simulated directory data (independent of transaction history)
  let directoryData = [
    {
      visitorId: 'VST-550',
      photo: 'https://i.pravatar.cc/150?img=68',
      name: 'David Brown',
      mobile: '+971 50 111 2222',
      email: 'dbrown@example.com',
      nationality: 'UK',
      type: 'Contractor',
      company: 'Global Maintenance',
      host: 'Facility Manager',
      campus: 'Main Campus',
      idType: 'Emirates ID',
      idNumber: '784-XXXX-XXXX-1234',
      firstVisit: '2026-01-15',
      lastVisit: '2026-10-04',
      totalVisits: 45,
      status: 'Active'
    },
    {
      visitorId: 'VST-552',
      photo: 'https://i.pravatar.cc/150?img=33',
      name: 'Ahmed Khan',
      mobile: '+971 50 333 4444',
      email: 'akhan@example.com',
      nationality: 'UAE',
      type: 'Contractor',
      company: 'Global Maintenance',
      host: 'Facility Manager',
      campus: 'Main Campus',
      idType: 'Emirates ID',
      idNumber: '784-XXXX-XXXX-5678',
      firstVisit: '2026-03-10',
      lastVisit: '2026-10-04',
      totalVisits: 12,
      status: 'Active'
    },
    {
      visitorId: 'VST-553',
      photo: 'https://i.pravatar.cc/150?img=47',
      name: 'Sarah Jenkins',
      mobile: '+971 50 555 6666',
      email: 'sjenkins@techcorp.com',
      nationality: 'USA',
      type: 'Pre-Scheduled',
      company: 'TechCorp',
      host: 'IT Dept',
      campus: 'Main Campus',
      idType: 'Passport',
      idNumber: 'PXXXXX789',
      firstVisit: '2026-10-04',
      lastVisit: '2026-10-04',
      totalVisits: 1,
      status: 'Active'
    },
    {
      visitorId: 'VST-110',
      photo: 'https://i.pravatar.cc/150?img=11',
      name: 'John Smith',
      mobile: '+971 50 123 4567',
      email: 'jsmith@example.com',
      nationality: 'Canada',
      type: 'Pre-Scheduled',
      company: 'Freelance',
      host: 'Dr. Ahmed Al-Maktoum',
      campus: 'Main Campus',
      idType: 'Emirates ID',
      idNumber: '784-XXXX-XXXX-9999',
      firstVisit: '2025-11-20',
      lastVisit: '2026-09-15',
      totalVisits: 3,
      status: 'Restricted'
    }
  ];

  if (isHost) {
    const userHostId = sessionUser.hostId || sessionUser.name;
    directoryData = directoryData.filter(v => v.host === userHostId);
  }

  if (startDate) {
    directoryData = directoryData.filter(v => new Date(v.lastVisit) >= new Date(startDate));
  }
  if (endDate) {
    directoryData = directoryData.filter(v => new Date(v.lastVisit) <= new Date(endDate));
  }

  const columns = [
    { header: 'Visitor', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <img src={row.photo} alt={row.name} className="w-8 h-8 rounded-full border border-slate-200" />
        <div>
          <p className="font-bold text-slate-800">{row.name}</p>
          <p className="text-[10px] text-slate-500">{row.visitorId}</p>
        </div>
      </div>
    ) },
    { header: 'Type / Company', accessor: 'type', render: (row) => (
      <div>
        <p className="font-bold text-slate-700">{row.type}</p>
        <p className="text-xs text-slate-500">{row.company}</p>
      </div>
    ) },
    { header: 'Identity (Masked)', accessor: 'idNumber', render: (row) => (
      <div>
        <p className="font-bold text-slate-700">{row.idType}</p>
        <p className="font-mono text-xs text-slate-500 tracking-wider bg-slate-100 px-1 py-0.5 rounded w-max">{row.idNumber}</p>
      </div>
    ) },
    { header: 'Contact', accessor: 'mobile', render: (row) => (
      <div className="text-xs text-slate-500">
        <p>{row.mobile}</p>
        <p>{row.email}</p>
      </div>
    ) },
    { header: 'Total Visits', accessor: 'totalVisits', render: (row) => <span className="font-black text-slate-700">{row.totalVisits}</span> },
    { header: 'Last Visit', accessor: 'lastVisit' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Start Date (Last Visit)</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">End Date (Last Visit)</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800" />
        </div>
      </div>
      <ReportTable 
        title="Visitor Directory Report" 
        description="Master directory of known visitor profiles, identities (masked for privacy), and aggregated visit counts."
        columns={columns}
        data={directoryData}
        searchPlaceholder="Search by Name, Email, or Company..."
        searchableKeys={['name', 'email', 'company']}
      />
    </div>
  );
};

export default VisitorDirectoryReport;
