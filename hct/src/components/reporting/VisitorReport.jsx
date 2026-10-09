import React, { useState } from 'react';
import ReportTable from './ReportTable';
import { useCheckIn } from '../../context/CheckInContext';
import { useRole } from '../../context/RoleContext';

const VisitorReport = () => {
  const { visitHistory } = useCheckIn();
  const { sessionUser } = useRole();
  const isHost = sessionUser?.role === 'host';

  const [filterType, setFilterType] = useState('All');
  const [filterCampus, setFilterCampus] = useState('All');
  const [filterHost, setFilterHost] = useState(isHost ? sessionUser.hostId || sessionUser.name : 'All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Enriched default records to match comprehensive reporting format
  const sampleVisitorRecords = [
    {
      passId: 'PASS-00118',
      passRequestId: 'PR-2026-001',
      visitorName: 'David Brown',
      visitorId: 'EMP-001',
      nationality: 'UK',
      visitorType: 'Contractor',
      host: 'Facility Manager',
      company: 'Global Maintenance LLC',
      contractorId: 'COMP-101',
      campus: 'Main Campus',
      visitStart: '2026-10-04 08:00',
      visitEnd: '2026-10-04 18:00',
      checkInTime: '08:00 AM',
      checkOutTime: '12:00 PM',
      visitStatus: 'COMPLETED',
      qrStatus: 'INVALIDATED'
    },
    {
      passId: 'PASS-00120',
      passRequestId: 'PR-2026-002',
      visitorName: 'Ahmed Khan',
      visitorId: 'EMP-002',
      nationality: 'UAE',
      visitorType: 'Contractor',
      host: 'Facility Manager',
      company: 'Global Maintenance LLC',
      contractorId: 'COMP-101',
      campus: 'Main Campus',
      visitStart: '2026-10-04 09:00',
      visitEnd: '2026-10-04 18:00',
      checkInTime: '09:15 AM',
      checkOutTime: '-',
      visitStatus: 'CHECKED IN',
      qrStatus: 'ACTIVE'
    },
    {
      passId: 'PASS-00125',
      passRequestId: 'PR-2026-003',
      visitorName: 'John Smith',
      visitorId: 'EMP-015',
      nationality: 'Canada',
      visitorType: 'Pre-Approved',
      host: 'SecureTech Systems',
      company: 'SecureTech Systems',
      contractorId: 'COMP-102',
      campus: 'North Campus',
      visitStart: '2026-10-04 10:00',
      visitEnd: '2026-10-04 14:00',
      checkInTime: '-',
      checkOutTime: '-',
      visitStatus: 'PENDING',
      qrStatus: 'ACTIVE'
    },
    {
      passId: 'PASS-00128',
      passRequestId: 'PR-2026-004',
      visitorName: 'John Smith',
      visitorId: 'EMP-001',
      nationality: 'USA',
      visitorType: 'Contractor',
      host: 'Dr. Ahmed Al-Maktoum',
      company: 'Tech Solutions LLC',
      contractorId: 'CON-2026-101',
      campus: 'Main Campus',
      visitStart: '2026-10-10 08:00',
      visitEnd: '2026-10-10 18:00',
      checkInTime: '-',
      checkOutTime: '-',
      visitStatus: 'PENDING',
      qrStatus: 'ACTIVE'
    },
    {
      passId: 'PASS-00129',
      passRequestId: 'PR-2026-005',
      visitorName: 'Sarah Jane',
      visitorId: 'EMP-002',
      nationality: 'UK',
      visitorType: 'Pre-Approved',
      host: 'Jane Doe',
      company: 'Tech Solutions LLC',
      contractorId: 'CON-2026-101',
      campus: 'Main Campus',
      visitStart: '2026-10-01 09:00',
      visitEnd: '2026-10-01 17:00',
      checkInTime: '09:05 AM',
      checkOutTime: '05:00 PM',
      visitStatus: 'COMPLETED',
      qrStatus: 'INVALIDATED'
    }
  ];

  // Map context visit history
  const contextMapped = visitHistory.map((v, i) => ({
    passId: v.passId || `PASS-00${130 + i}`,
    passRequestId: `PR-2026-0${10 + i}`,
    visitorName: v.visitorName,
    visitorId: v.visitorId || `VST-0${10 + i}`,
    nationality: v.nationality || 'UAE',
    visitorType: v.visitorType || 'Walk-In',
    host: v.host || 'Host Admin',
    company: v.company || 'External Organization',
    contractorId: `COMP-${200 + i}`,
    campus: v.campus || 'Main Campus',
    visitStart: `${v.date || '2026-10-04'} 09:00`,
    visitEnd: `${v.date || '2026-10-04'} 17:00`,
    checkInTime: v.checkInTime || '09:00 AM',
    checkOutTime: v.checkOutTime || '-',
    visitStatus: v.status === 'Closed' ? 'COMPLETED' : v.status === 'Checked In' ? 'CHECKED IN' : (v.status || 'PENDING').toUpperCase(),
    qrStatus: v.status === 'Closed' || v.status === 'Force Checked Out' ? 'INVALIDATED' : 'ACTIVE'
  }));

  let reportData = [...sampleVisitorRecords, ...contextMapped];

  // Apply Role-Based Access Control
  if (isHost) {
    reportData = reportData.filter(v => v.host === (sessionUser.hostId || sessionUser.name));
  }

  // Apply Filters
  if (filterType !== 'All') {
    reportData = reportData.filter(v => v.visitorType === filterType);
  }
  if (filterCampus !== 'All') {
    reportData = reportData.filter(v => v.campus === filterCampus);
  }
  if (!isHost && filterHost !== 'All') {
    reportData = reportData.filter(v => v.host === filterHost);
  }
  if (startDate) {
    reportData = reportData.filter(v => new Date(v.visitStart.split(' ')[0]) >= new Date(startDate));
  }
  if (endDate) {
    reportData = reportData.filter(v => new Date(v.visitStart.split(' ')[0]) <= new Date(endDate));
  }

  const customFilters = (
    <div className="flex items-center gap-2 ml-4">
      <select value={filterType} onChange={e => setFilterType(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600">
        <option value="All">All Types</option>
        <option value="Contractor">Contractor</option>
        <option value="Walk-In">Walk-In</option>
        <option value="Pre-Approved">Pre-Approved</option>
      </select>
      <select value={filterCampus} onChange={e => setFilterCampus(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600">
        <option value="All">All Campuses</option>
        <option value="Main Campus">Main Campus</option>
        <option value="North Campus">North Campus</option>
      </select>
      {!isHost && (
        <select value={filterHost} onChange={e => setFilterHost(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600">
          <option value="All">All Hosts</option>
          <option value="Facility Manager">Facility Manager</option>
          <option value="Dr. Ahmed Al-Maktoum">Dr. Ahmed Al-Maktoum</option>
          <option value="Jane Doe">Jane Doe</option>
        </select>
      )}
      <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600" />
        <span className="text-slate-400 font-bold">-</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600" />
      </div>
      {(filterType !== 'All' || filterCampus !== 'All' || (!isHost && filterHost !== 'All') || startDate || endDate) && (
        <button 
          onClick={() => { setFilterType('All'); setFilterCampus('All'); if(!isHost) setFilterHost('All'); setStartDate(''); setEndDate(''); }}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );

  const columns = [
    { 
      header: 'PASS INFO', 
      accessor: 'passId', 
      render: (row) => (
        <div>
          <p className="font-mono font-bold text-slate-800">{row.passId}</p>
          <p className="text-[10px] text-slate-500">Req: {row.passRequestId}</p>
        </div>
      ) 
    },
    { 
      header: 'VISITOR', 
      accessor: 'visitorName', 
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800">{row.visitorName}</p>
          <p className="text-xs text-slate-500">{row.visitorId} • {row.nationality}</p>
        </div>
      ) 
    },
    { 
      header: 'HOST', 
      accessor: 'company', 
      render: (row) => (
        <div>
          <p className="font-bold text-slate-700">{row.company}</p>
          <p className="text-[10px] text-slate-500">{row.host} ({row.contractorId})</p>
        </div>
      ) 
    },
    { 
      header: 'VISIT WINDOW', 
      accessor: 'visitStart', 
      render: (row) => (
        <div className="text-xs font-bold text-slate-600">
          <p>Start: {row.visitStart}</p>
          <p>End: {row.visitEnd}</p>
        </div>
      ) 
    },
    { 
      header: 'ACTUAL TIMES', 
      accessor: 'checkInTime', 
      render: (row) => (
        <div className="text-xs font-bold">
          <p className="text-emerald-600">In: {row.checkInTime || '-'}</p>
          <p className="text-slate-600">Out: {row.checkOutTime || '-'}</p>
        </div>
      ) 
    },
    { 
      header: 'VISIT STATUS', 
      accessor: 'visitStatus', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.visitStatus === 'COMPLETED' ? 'bg-slate-100 text-slate-700' :
          row.visitStatus === 'CHECKED IN' ? 'bg-emerald-100 text-emerald-700' :
          row.visitStatus === 'REJECTED' || row.visitStatus === 'FORCE CHECKED OUT' ? 'bg-red-100 text-red-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {row.visitStatus}
        </span>
      ) 
    },
    { 
      header: 'QR STATUS', 
      accessor: 'qrStatus', 
      render: (row) => (
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          row.qrStatus === 'ACTIVE' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-500 border border-red-200 line-through'
        }`}>
          {row.qrStatus}
        </span>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      <ReportTable 
        title="Visitor Report" 
        description="Detailed log of gate passes, check-ins, and visit transactions specifically linked to approved contractors and visitors."
        columns={columns}
        data={reportData}
        searchPlaceholder="Search by Pass ID, Visitor, or Company..."
        searchableKeys={['passId', 'visitorName', 'company', 'visitorId', 'host']}
        customFilters={customFilters}
      />
    </div>
  );
};

export default VisitorReport;
