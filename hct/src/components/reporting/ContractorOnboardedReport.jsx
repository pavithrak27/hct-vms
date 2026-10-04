import React from 'react';
import ReportTable from './ReportTable';

const ContractorOnboardedReport = () => {
  const onboardedData = [
    {
      id: 'COMP-101',
      name: 'Global Maintenance LLC',
      contractNum: 'CTR-2025-001',
      jobDesc: 'HVAC Maintenance across all campus buildings.',
      start: '2025-01-01',
      expiry: '2027-12-31',
      passValidityFrom: '2025-01-10',
      passValidityTo: '2027-12-31',
      contact: 'Omar Hassan',
      email: 'omar@globalmaint.com',
      mobile: '+971 50 123 9999',
      empCount: 45,
      onboarded: '2024-12-28',
      status: 'Onboarded'
    },
    {
      id: 'COMP-102',
      name: 'SecureTech Systems',
      contractNum: 'CTR-2026-042',
      jobDesc: 'IT infrastructure and CCTV upgrades.',
      start: '2026-06-01',
      expiry: '2026-12-31',
      passValidityFrom: '2026-06-05',
      passValidityTo: '2026-12-31',
      contact: 'Jane Smith',
      email: 'jane@securetech.com',
      mobile: '+971 50 444 5555',
      empCount: 12,
      onboarded: '2026-05-20',
      status: 'Onboarded'
    },
    {
      id: 'COMP-103',
      name: 'BuildRight Construction',
      contractNum: 'CTR-2026-088',
      jobDesc: 'New library wing construction.',
      start: '2026-11-01',
      expiry: '2028-05-31',
      passValidityFrom: '-',
      passValidityTo: '-',
      contact: 'Robert Johnson',
      email: 'robert@buildright.com',
      mobile: '+971 50 777 8888',
      empCount: 0,
      onboarded: '-',
      status: 'Pending'
    },
    {
      id: 'COMP-099',
      name: 'Elite Catering',
      contractNum: 'CTR-2023-015',
      jobDesc: 'Cafeteria food services.',
      start: '2023-01-01',
      expiry: '2025-12-31',
      passValidityFrom: '2023-01-05',
      passValidityTo: '2025-12-31',
      contact: 'Fatima Ali',
      email: 'fatima@elitecatering.com',
      mobile: '+971 50 222 3333',
      empCount: 28,
      onboarded: '2022-12-15',
      status: 'Expired'
    }
  ];

  const columns = [
    { header: 'Company Name', accessor: 'name', render: (row) => (
      <div>
        <p className="font-bold text-slate-800">{row.name}</p>
        <p className="text-[10px] text-slate-500">{row.id}</p>
      </div>
    ) },
    { header: 'Contract Info', accessor: 'contractNum', render: (row) => (
      <div>
        <p className="font-bold text-slate-700">{row.contractNum}</p>
        <p className="text-xs text-slate-500 w-48 truncate" title={row.jobDesc}>{row.jobDesc}</p>
      </div>
    ) },
    { header: 'Validity', accessor: 'expiry', render: (row) => (
      <div className="text-xs font-bold text-slate-600">
        <p>Start: {row.start}</p>
        <p>End: {row.expiry}</p>
      </div>
    ) },
    { header: 'Contact Person', accessor: 'contact', render: (row) => (
      <div className="text-xs text-slate-500">
        <p className="font-bold text-slate-700 text-sm">{row.contact}</p>
        <p>{row.mobile}</p>
        <p>{row.email}</p>
      </div>
    ) },
    { header: 'Employees', accessor: 'empCount', render: (row) => <span className="font-black text-slate-700 bg-slate-100 px-2 py-1 rounded">{row.empCount}</span> },
    { header: 'Onboarded Date', accessor: 'onboarded' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${row.status === 'Onboarded' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
        {row.status}
      </span>
    )}
  ];

  return (
    <ReportTable 
      title="Contractor Onboarded Report" 
      description="Status of contractor companies, validities, and onboarded employee counts."
      columns={columns}
      data={onboardedData}
      searchPlaceholder="Search by Company Name or Contract..."
      searchableKeys={['name', 'contractNum']}
    />
  );
};

export default ContractorOnboardedReport;
