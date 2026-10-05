import React, { createContext, useState, useContext } from 'react';

const ContractorContext = createContext();

export const ContractorProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
    { id: 'EMP-CT-2026-001', name: 'John Smith', nationality: 'UK', mobile: '+971501234567', jobTitle: 'Site Engineer', company: 'Tech Solutions LLC', status: 'Approved', docExpiry: '2027-12-31', photo: 'https://i.pravatar.cc/300?img=11', document: 'Passport_Copy_JSmith.pdf', submissionDate: '2026-10-01' },
    { id: 'EMP-CT-2026-002', name: 'Ravi Kumar', nationality: 'India', mobile: '+971509876543', jobTitle: 'Technician', company: 'Tech Solutions LLC', status: 'Pending Approval', docExpiry: '2027-05-15', photo: 'https://i.pravatar.cc/300?img=12', document: 'EmiratesID_RKumar.pdf', submissionDate: '2026-10-04' },
    { id: 'EMP-CT-2026-003', name: 'Alex Johnson', nationality: 'Canada', mobile: '+971551122334', jobTitle: 'Safety Officer', company: 'Tech Solutions LLC', status: 'Rejected', rejectionReason: 'Passport copy unclear', docExpiry: '2027-08-20', photo: 'https://i.pravatar.cc/300?img=13', document: 'Passport_Copy_AJohnson.pdf', submissionDate: '2026-10-02' }
  ]);

  const [passRequests, setPassRequests] = useState([
    { 
      id: 'CPR-2026-0001', 
      company: 'Tech Solutions LLC',
      contractId: 'CON-2026-101',
      contractNumber: 'CT-2025-9981',
      employees: ['EMP-CT-2026-001'],
      start: '2026-11-05 08:00', 
      end: '2026-11-10 18:00',
      modifiedStart: null,
      modifiedEnd: null,
      status: 'Pending Level 1 Approval', 
      approvalLevel: 1,
      submissionDate: '2026-10-01' 
    }
  ]);

  const [generatedPasses, setGeneratedPasses] = useState([]);
  
  // Configurable number of approval levels (as requested in FR)
  const [approvalHierarchyLevels, setApprovalHierarchyLevels] = useState(3);

  const addEmployee = (emp) => {
    setEmployees([emp, ...employees]);
  };

  const approveEmployee = (id) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
  };

  const rejectEmployee = (id, reason) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status: 'Rejected', rejectionReason: reason } : e));
  };

  const addPassRequest = (req) => {
    setPassRequests([req, ...passRequests]);
  };

  const updatePassRequest = (id, newStart, newEnd) => {
    setPassRequests(passRequests.map(r => r.id === id ? { ...r, modifiedStart: newStart, modifiedEnd: newEnd } : r));
  };

  const approvePassRequest = (id, isFinal, rejectReason = null) => {
    setPassRequests(passRequests.map(r => {
      if (r.id === id) {
        if (rejectReason) {
          return { ...r, status: 'Rejected', rejectionReason: rejectReason };
        }
        if (isFinal) {
          // Generate individual passes for each employee
          const finalStart = r.modifiedStart || r.start;
          const finalEnd = r.modifiedEnd || r.end;
          
          const newPasses = r.employees.map((empId, idx) => {
            const empDetails = employees.find(e => e.id === empId);
            return {
              passId: `${r.id}-${String(idx + 1).padStart(2, '0')}`,
              requestId: r.id,
              company: r.company,
              contractId: r.contractId,
              empName: empDetails?.name || 'Unknown',
              empId: empId,
              photo: empDetails?.photo || 'https://i.pravatar.cc/300',
              validFrom: finalStart,
              validTo: finalEnd,
              status: 'Active'
            };
          });
          
          setGeneratedPasses(prev => [...newPasses, ...prev]);
          return { ...r, status: 'Approved', approvalLevel: 3 };
        } else {
          // Increment level
          const newLevel = (r.approvalLevel || 1) + 1;
          const newStatus = newLevel === approvalHierarchyLevels ? 'Pending Final Approval' : `Pending Level ${newLevel} Approval`;
          return { ...r, status: newStatus, approvalLevel: newLevel };
        }
      }
      return r;
    }));
  };

  const updateEmployee = (updatedEmp) => {
    setEmployees(employees.map(e => e.id === updatedEmp.id ? updatedEmp : e));
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  return (
    <ContractorContext.Provider value={{
      employees, addEmployee, updateEmployee, deleteEmployee, approveEmployee, rejectEmployee,
      passRequests, addPassRequest, updatePassRequest, approvePassRequest,
      generatedPasses, approvalHierarchyLevels, setApprovalHierarchyLevels
    }}>
      {children}
    </ContractorContext.Provider>
  );
};

export const useContractor = () => useContext(ContractorContext);
