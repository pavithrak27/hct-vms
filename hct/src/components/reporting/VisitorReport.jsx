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

  // Map the visitHistory data to a flat structure suitable for the table and CSV export
  let reportData = visitHistory.map(v => ({
    visitorId: v.visitorId,
    visitorName: v.visitorName,
    visitorType: v.visitorType,
    host: v.host,
    campus: v.campus || 'Main Campus',
    date: v.checkInTime ? '2026-10-04' : '-',
    checkInTime: v.checkInTime,
    checkOutTime: v.checkOutTime,
    duration: v.duration,
    passId: v.passId,
    status: v.status,
    checkInMethod: v.checkInMethod,
    checkOutMethod: v.checkOutMethod
  }));

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
    reportData = reportData.filter(v => new Date(v.date) >= new Date(startDate));
  }
  if (endDate) {
    reportData = reportData.filter(v => new Date(v.date) <= new Date(endDate));
  }

  const customFilters = (
    <div className="flex items-center gap-2 ml-4">
      <select value={filterType} onChange={e => setFilterType(e.target.value)} className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600">
        <option value="All">All Types</option>
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
          <option value="Dr. Ahmed Al-Maktoum">Dr. Ahmed Al-Maktoum</option>
          <option value="Dr. Sarah Smith">Dr. Sarah Smith</option>
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
    { header: 'Pass ID', accessor: 'passId', render: (row) => <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.passId}</span> },
    { header: 'Visitor Name', accessor: 'visitorName', render: (row) => <span className="font-bold text-slate-800">{row.visitorName}</span> },
    { header: 'Type', accessor: 'visitorType', render: (row) => <span className="text-slate-500 text-xs font-bold">{row.visitorType}</span> },
    { header: 'Host', accessor: 'host' },
    { header: 'Campus', accessor: 'campus' },
    { header: 'Visit Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkInTime', render: (row) => <span className="text-emerald-600 font-bold">{row.checkInTime}</span> },
    { header: 'Check Out', accessor: 'checkOutTime', render: (row) => <span className="text-slate-600 font-bold">{row.checkOutTime}</span> },
    { header: 'Duration', accessor: 'duration' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.status === 'Closed' ? 'bg-slate-100 text-slate-600' : row.status === 'Force Checked Out' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <ReportTable 
        title="Visitor Report" 
        description="Detailed historical log of individual visit transactions, entry/exit times, and durations."
        columns={columns}
        data={reportData}
        searchPlaceholder="Search by Visitor Name or Pass ID..."
        searchableKeys={['visitorName', 'passId', 'host']}
        customFilters={customFilters}
      />
    </div>
  );
};

export default VisitorReport;
