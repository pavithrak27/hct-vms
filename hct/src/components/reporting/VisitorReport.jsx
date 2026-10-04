import React from 'react';
import ReportTable from './ReportTable';
import { useCheckIn } from '../../context/CheckInContext';

const VisitorReport = () => {
  const { visitHistory } = useCheckIn();

  // Map the visitHistory data to a flat structure suitable for the table and CSV export
  const reportData = visitHistory.map(v => ({
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

  const columns = [
    { header: 'Pass ID', accessor: 'passId', render: (row) => <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{row.passId}</span> },
    { header: 'Visitor Name', accessor: 'visitorName', render: (row) => <span className="font-bold text-slate-800">{row.visitorName}</span> },
    { header: 'Type', accessor: 'visitorType', render: (row) => <span className="text-slate-500 text-xs font-bold">{row.visitorType}</span> },
    { header: 'Host', accessor: 'host' },
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
    <ReportTable 
      title="Visitor Report" 
      description="Detailed historical log of individual visit transactions, entry/exit times, and durations."
      columns={columns}
      data={reportData}
      searchPlaceholder="Search by Visitor Name or Pass ID..."
      searchableKeys={['visitorName', 'passId', 'host']}
    />
  );
};

export default VisitorReport;
