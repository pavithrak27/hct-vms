import React, { createContext, useState, useContext, useMemo } from 'react';
import { useRole } from './RoleContext';
import AuthorizationService from '../services/AuthorizationService';

const ContractorContext = createContext();

export const ContractorProvider = ({ children }) => {
  const { sessionUser } = useRole();

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
  
  const [approvalConfig, setApprovalConfig] = useState({
    contractor: {
      mode: 'flow', // 'flow', 'auto-approve', 'auto-reject'
      levels: [
        { id: 1, role: 'Department Head of Logistics', note: '' },
        { id: 2, role: 'Security Manager', note: '' }
      ]
    },
    restriction: {
      mode: 'flow',
      levels: [
        { id: 1, role: 'Security Manager', note: '' }
      ]
    },
    blocked: {
      mode: 'flow',
      levels: [
        { id: 1, role: 'Security Manager', note: '' }
      ]
    },
    visitor: {
      mode: 'flow',
      levels: [
        { id: 1, role: 'Host', note: '' }
      ]
    }
  });

  // Filtered data based on RBAC
  const scopedEmployees = useMemo(() => {
    return employees.filter(emp => AuthorizationService.canAccessCompany(sessionUser, emp.company));
  }, [employees, sessionUser]);

  const scopedPassRequests = useMemo(() => {
    return passRequests.filter(req => AuthorizationService.canAccessCompany(sessionUser, req.company));
  }, [passRequests, sessionUser]);

  const scopedGeneratedPasses = useMemo(() => {
    return generatedPasses.filter(pass => AuthorizationService.canAccessCompany(sessionUser, pass.company));
  }, [generatedPasses, sessionUser]);

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
    // Basic RBAC check: only admins/approvers should call this, not contractors
    if (sessionUser && sessionUser.role === 'contractor') {
      console.error("Access Denied: Contractors cannot approve passes.");
      return;
    }
    
    setPassRequests(passRequests.map(r => {
      if (r.id === id) {
        const currentConfig = approvalConfig.contractor || { mode: 'flow', levels: [] };
        
        if (rejectReason || currentConfig.mode === 'auto-reject') {
          return { ...r, status: 'Rejected', rejectionReason: rejectReason || 'Auto-rejected by system configuration' };
        }
        
        // If mode is auto-approve or if it's explicitly the final step in a flow
        const isFinalApproval = currentConfig.mode === 'auto-approve' || isFinal;
        
        if (isFinalApproval) {
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
          return { ...r, status: 'Approved', approvalLevel: currentConfig.levels.length || 1 };
        } else {
          // Increment level
          const newLevel = (r.approvalLevel || 1) + 1;
          const isNextLevelFinal = newLevel === currentConfig.levels.length;
          
          const nextRoleName = currentConfig.levels[newLevel - 1]?.role || `Level ${newLevel}`;
          const newStatus = isNextLevelFinal ? 'Pending Final Approval' : `Pending ${nextRoleName} Approval`;
          
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
      employees: scopedEmployees, 
      addEmployee, updateEmployee, deleteEmployee, approveEmployee, rejectEmployee,
      passRequests: scopedPassRequests, 
      addPassRequest, updatePassRequest, approvePassRequest,
      generatedPasses: scopedGeneratedPasses, 
      approvalConfig, setApprovalConfig
    }}>
      {children}
    </ContractorContext.Provider>
  );
};

export const useContractor = () => useContext(ContractorContext);
