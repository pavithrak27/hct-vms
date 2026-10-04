import React from 'react';
import ReportTable from './ReportTable';

const ContractorVisitorReport = () => {
  const visitorData = [
    {
      passRequestId: 'PR-2026-001',
      passId: 'PASS-00118',
      company: 'Global Maintenance LLC',
      contractorId: 'COMP-101',
      employeeName: 'David Brown',
      employeeId: 'EMP-001',
      nationality: 'UK',
      campus: 'Main Campus',
      visitStart: '2026-10-04 08:00',
      visitEnd: '2026-10-04 18:00',
      approvedStart: '2026-10-04',
      approvedEnd: '2026-10-04',
      checkInTime: '08:00 AM',
      checkOutTime: '12:00 PM',
      passStatus: 'Approved',
      visitStatus: 'Completed',
      qrStatus: 'Invalidated'
    },
    {
      passRequestId: 'PR-2026-002',
      passId: 'PASS-00120',
      company: 'Global Maintenance LLC',
      contractorId: 'COMP-101',
      employeeName: 'Ahmed Khan',
      employeeId: 'EMP-002',
      nationality: 'UAE',
      campus: 'Main Campus',
      visitStart: '2026-10-04 09:00',
      visitEnd: '2026-10-04 18:00',
      approvedStart: '2026-10-04',
      approvedEnd: '2026-10-04',
      checkInTime: '09:15 AM',
      checkOutTime: '-',
      passStatus: 'Approved',
      visitStatus: 'Checked In',
      qrStatus: 'Active'
    },
    {
      passRequestId: 'PR-2026-003',
      passId: 'PASS-00125',
      company: 'SecureTech Systems',
      contractorId: 'COMP-102',
      employeeName: 'John Smith',
      employeeId: 'EMP-015',
      nationality: 'Canada',
      campus: 'North Campus',
      visitStart: '2026-10-04 10:00',
      visitEnd: '2026-10-04 14:00',
      approvedStart: '2026-10-04',
      approvedEnd: '2026-10-04',
      checkInTime: '-',
      checkOutTime: '-',
      passStatus: 'Approved',
      visitStatus: 'Pending',
      qrStatus: 'Active'
    }
  ];

  const columns = [
    { header: 'Pass Info', accessor: 'passId', render: (row) => (
      <div>
        <p className="font-mono font-bold text-slate-800">{row.passId}</p>
        <p className="text-[10px] text-slate-500">Req: {row.passRequestId}</p>
      </div>
    ) },
    { header: 'Employee', accessor: 'employeeName', render: (row) => (
      <div>
        <p className="font-bold text-slate-800">{row.employeeName}</p>
        <p className="text-xs text-slate-500">{row.employeeId} • {row.nationality}</p>
      </div>
    ) },
    { header: 'Contractor', accessor: 'company', render: (row) => (
      <div>
        <p className="font-bold text-slate-700">{row.company}</p>
        <p className="text-[10px] text-slate-500">{row.contractorId}</p>
      </div>
    ) },
    { header: 'Visit Window', accessor: 'visitStart', render: (row) => (
      <div className="text-xs font-bold text-slate-600">
        <p>Start: {row.visitStart}</p>
        <p>End: {row.visitEnd}</p>
      </div>
    ) },
    { header: 'Actual Times', accessor: 'checkInTime', render: (row) => (
      <div className="text-xs font-bold">
        <p className="text-emerald-600">In: {row.checkInTime}</p>
        <p className="text-slate-600">Out: {row.checkOutTime}</p>
      </div>
    ) },
    { header: 'Visit Status', accessor: 'visitStatus', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.visitStatus === 'Completed' ? 'bg-slate-100 text-slate-600' : row.visitStatus === 'Checked In' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
        {row.visitStatus}
      </span>
    ) },
    { header: 'QR Status', accessor: 'qrStatus', render: (row) => (
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.qrStatus === 'Active' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-red-50 text-red-500 border border-red-200 line-through'}`}>
        {row.qrStatus}
      </span>
    ) }
  ];

  return (
    <ReportTable 
      title="Contractor Visitor Report" 
      description="Detailed log of gate passes and visits specifically linked to approved contractor companies."
      columns={columns}
      data={visitorData}
      searchPlaceholder="Search by Pass ID, Employee, or Company..."
      searchableKeys={['passId', 'employeeName', 'company', 'employeeId']}
    />
  );
};

export default ContractorVisitorReport;
