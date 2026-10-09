import React, { useState } from 'react';
import ReportTable from './ReportTable';
import { RefreshCw, ArrowRight, MapPin, Calendar, User } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

const initialTransferVisits = [
  {
    id: 'TRF-2026-001',
    visitorId: 'V-1021',
    visitorName: 'John Smith',
    company: 'Tech Solutions LLC',
    phone: '+971 50 123 4567',
    email: 'john.smith@techsolutions.com',
    host: 'Dr. Ahmed Al-Maktoum',
    originalCampus: "Dubai Men's Campus",
    transferredCampus: "Dubai Women's Campus",
    originalDate: '2026-10-05',
    transferredDate: '2026-10-12',
    transferredBy: 'Dr. Ahmed Al-Maktoum',
    transferStatus: 'Transferred',
    transferReason: "Meeting rescheduled & relocated to Women's Campus Lab",
    transferTimestamp: '2026-10-04 14:30'
  },
  {
    id: 'TRF-2026-002',
    visitorId: 'V-1023',
    visitorName: 'Michael Chang',
    company: 'Global Services',
    phone: '+971 52 555 1234',
    email: 'm.chang@globalservices.com',
    host: 'Prof. Tariq',
    originalCampus: "Sharjah Men's Campus",
    transferredCampus: "Abu Dhabi Men's Campus",
    originalDate: '2026-10-05',
    transferredDate: '2026-10-15',
    transferredBy: 'Prof. Tariq',
    transferStatus: 'Transferred',
    transferReason: 'Site inspection campus reassignment',
    transferTimestamp: '2026-10-04 16:15'
  },
  {
    id: 'TRF-2026-003',
    visitorId: 'V-1024',
    visitorName: 'Emma Wilson',
    company: 'Ministry of Education',
    phone: '+971 54 333 9999',
    email: 'e.wilson@moe.gov.ae',
    host: 'Prof. Tariq',
    originalCampus: "Dubai Women's Campus",
    transferredCampus: "Sharjah Men's Campus",
    originalDate: '2026-10-05',
    transferredDate: '2026-10-18',
    transferredBy: 'Super Admin',
    transferStatus: 'Approved',
    transferReason: 'Requested by Ministry delegate for Sharjah conference',
    transferTimestamp: '2026-10-05 09:10'
  },
  {
    id: 'TRF-2026-004',
    visitorId: 'V-1028',
    visitorName: 'Sarah Jenkins',
    company: 'Apex Logistics',
    phone: '+971 50 999 8877',
    email: 's.jenkins@apexlogistics.com',
    host: 'Dr. Sarah Parker',
    originalCampus: "Abu Dhabi Men's Campus",
    transferredCampus: "Dubai Men's Campus",
    originalDate: '2026-10-02',
    transferredDate: '2026-10-08',
    transferredBy: 'Dr. Sarah Parker',
    transferStatus: 'Completed',
    transferReason: 'Equipment delivery venue changed',
    transferTimestamp: '2026-10-01 11:20'
  }
];

const TransferVisitReport = () => {
  const { sessionUser } = useRole();
  const isHost = sessionUser?.role === 'host';

  const [filterCampus, setFilterCampus] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  let reportData = initialTransferVisits;

  // Role filter: if host, show visits where host matches
  if (isHost) {
    reportData = reportData.filter(v => v.host === (sessionUser.hostId || sessionUser.name || 'Dr. Ahmed Al-Maktoum'));
  }

  // Apply filters
  if (filterCampus !== 'All') {
    reportData = reportData.filter(v => v.transferredCampus === filterCampus || v.originalCampus === filterCampus);
  }
  if (filterStatus !== 'All') {
    reportData = reportData.filter(v => v.transferStatus === filterStatus);
  }
  if (startDate) {
    reportData = reportData.filter(v => new Date(v.transferredDate) >= new Date(startDate));
  }
  if (endDate) {
    reportData = reportData.filter(v => new Date(v.transferredDate) <= new Date(endDate));
  }

  const customFilters = (
    <div className="flex items-center gap-2 ml-4 flex-wrap">
      <select 
        value={filterCampus} 
        onChange={e => setFilterCampus(e.target.value)} 
        className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600"
      >
        <option value="All">All Campuses</option>
        <option value="Dubai Men's Campus">Dubai Men's Campus</option>
        <option value="Dubai Women's Campus">Dubai Women's Campus</option>
        <option value="Abu Dhabi Men's Campus">Abu Dhabi Men's Campus</option>
        <option value="Sharjah Men's Campus">Sharjah Men's Campus</option>
      </select>

      <select 
        value={filterStatus} 
        onChange={e => setFilterStatus(e.target.value)} 
        className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600"
      >
        <option value="All">All Statuses</option>
        <option value="Transferred">Transferred</option>
        <option value="Approved">Approved</option>
        <option value="Completed">Completed</option>
      </select>

      <div className="flex items-center gap-1 border-l border-slate-200 pl-2 ml-1">
        <input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
          className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600" 
        />
        <span className="text-slate-400 font-bold">-</span>
        <input 
          type="date" 
          value={endDate} 
          onChange={e => setEndDate(e.target.value)} 
          className="p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-hct-blue bg-white font-medium text-slate-600" 
        />
      </div>

      {(filterCampus !== 'All' || filterStatus !== 'All' || startDate || endDate) && (
        <button 
          onClick={() => { setFilterCampus('All'); setFilterStatus('All'); setStartDate(''); setEndDate(''); }}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 ml-1"
        >
          Clear
        </button>
      )}
    </div>
  );

  const columns = [
    {
      header: 'Transfer Ref',
      accessor: 'id',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-bold text-hct-blue bg-blue-50 px-2 py-1 rounded border border-blue-200">{row.id}</span>
          <p className="text-[10px] text-slate-400 mt-1 font-mono">Visitor: {row.visitorId}</p>
        </div>
      )
    },
    {
      header: 'Visitor Details',
      accessor: 'visitorName',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-800">{row.visitorName}</p>
          <p className="text-xs text-slate-500">{row.company}</p>
          <p className="text-[10px] text-slate-400">{row.phone}</p>
        </div>
      )
    },
    {
      header: 'Host',
      accessor: 'host',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>{row.host}</span>
        </div>
      )
    },
    {
      header: 'Campus Transfer',
      accessor: 'transferredCampus',
      render: (row) => (
        <div className="flex flex-col text-xs font-semibold">
          <span className="text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" /> {row.originalCampus}
          </span>
          <div className="flex items-center gap-1 text-hct-blue font-bold my-0.5">
            <ArrowRight className="w-3 h-3" />
            <span>{row.transferredCampus}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Visit Date Change',
      accessor: 'transferredDate',
      render: (row) => (
        <div className="text-xs">
          <p className="text-slate-400 line-through text-[11px]">{row.originalDate}</p>
          <p className="text-emerald-600 font-bold flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {row.transferredDate}
          </p>
        </div>
      )
    },
    {
      header: 'Transferred By',
      accessor: 'transferredBy',
      render: (row) => (
        <div>
          <p className="font-bold text-slate-700 text-xs">{row.transferredBy}</p>
          <p className="text-[10px] text-slate-400">{row.transferTimestamp}</p>
        </div>
      )
    },
    {
      header: 'Transfer Remarks',
      accessor: 'transferReason',
      render: (row) => (
        <p className="text-xs text-slate-600 max-w-xs whitespace-normal italic bg-slate-50 p-2 rounded-lg border border-slate-100">
          "{row.transferReason}"
        </p>
      )
    },
    {
      header: 'Status',
      accessor: 'transferStatus',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.transferStatus === 'Completed' ? 'bg-slate-100 text-slate-600' :
          row.transferStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {row.transferStatus}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <ReportTable 
        title="Transfer Visit Report" 
        description="Comprehensive audit log of all visitors transferred across campuses, date modifications, and associated remarks."
        columns={columns}
        data={reportData}
        searchPlaceholder="Search by Visitor Name, Ref, Host, or Campus..."
        searchableKeys={['id', 'visitorId', 'visitorName', 'company', 'host', 'originalCampus', 'transferredCampus', 'transferredBy', 'transferReason']}
        customFilters={customFilters}
      />
    </div>
  );
};

export default TransferVisitReport;
