import React, { createContext, useState, useContext, useMemo } from 'react';
import { useRole } from './RoleContext';
import AuthorizationService from '../services/AuthorizationService';

const CheckInContext = createContext();

export const CheckInProvider = ({ children }) => {
  const { sessionUser } = useRole();

  // Simulated initial state
  const [activeVisits, setActiveVisits] = useState([
    {
      id: 'VIS-1001',
      visitorId: 'VST-552',
      passId: 'PASS-00120',
      visitorName: 'Ahmed Khan',
      visitorType: 'Contractor',
      host: 'Facility Manager',
      company: 'Global Maintenance',
      campus: 'CMP-01',
      checkInTime: '2026-10-04 09:15 AM',
      checkInMethod: 'QR',
      gate: 'North Gate',
      expectedCheckOutTime: '2026-10-04 05:00 PM',
      checkOutGate: 'North Gate Exit',
      checkOutMethod: 'Pending Exit (QR)',
      status: 'Checked In',
      photo: 'https://i.pravatar.cc/300?img=33'
    },
    {
      id: 'VIS-1002',
      visitorId: 'VST-553',
      passId: 'PASS-00121',
      visitorName: 'Sarah Jenkins',
      visitorType: 'Pre-Scheduled',
      host: 'IT Dept',
      company: 'TechCorp',
      campus: 'CMP-02',
      checkInTime: '2026-10-04 10:30 AM',
      checkInMethod: 'Manual',
      gate: 'Main Reception',
      expectedCheckOutTime: '2026-10-04 04:30 PM',
      checkOutGate: 'Main Reception Exit',
      checkOutMethod: 'Pending Exit (Manual)',
      status: 'Checked In',
      photo: 'https://i.pravatar.cc/300?img=47'
    }
  ]);

  const initialVisitHistory = [
    {
      id: 'VIS-0999',
      visitorId: 'VST-550',
      passId: 'PASS-00118',
      visitorName: 'David Brown',
      visitorType: 'Contractor',
      host: 'Facility Manager',
      campus: 'CMP-01',
      checkInTime: '2026-10-04 08:00 AM',
      checkOutTime: '2026-10-04 12:00 PM',
      checkInMethod: 'QR',
      checkOutMethod: 'QR',
      duration: '4h 0m',
      status: 'Closed',
      gateId: 'GATE-01'
    },
    {
      id: 'VIS-1000',
      visitorId: 'VST-110',
      passId: 'PASS-00119',
      visitorName: 'John Smith',
      visitorType: 'Pre-Approved',
      host: 'Prof. Tariq',
      campus: 'CMP-01',
      checkInTime: '2026-10-04 09:30 AM',
      checkOutTime: '2026-10-04 11:30 AM',
      checkInMethod: 'QR',
      checkOutMethod: 'QR',
      duration: '2h 0m',
      status: 'Closed',
      gateId: 'GATE-01'
    },
    {
      id: 'VIS-1001',
      visitorId: 'VST-111',
      passId: 'PASS-00122',
      visitorName: 'Michael Chang',
      visitorType: 'Walk-In',
      host: 'Dr. Ahmed Al-Maktoum',
      campus: 'CMP-02',
      checkInTime: '2026-10-04 01:00 PM',
      checkOutTime: '2026-10-04 03:00 PM',
      checkInMethod: 'Manual',
      checkOutMethod: 'Manual',
      duration: '2h 0m',
      status: 'Closed',
      gateId: 'GATE-02'
    }
  ];

  // Generate 150 more mock visitors
  const mockNames = ['Emily Johnson', 'Liam Williams', 'Olivia Brown', 'Noah Jones', 'Ava Garcia', 'William Miller', 'Sophia Davis', 'James Rodriguez', 'Isabella Martinez', 'Benjamin Hernandez'];
  const generatedVisitors = Array.from({ length: 150 }).map((_, i) => ({
      id: `VIS-${2000 + i}`,
      visitorId: `VST-${600 + i}`,
      passId: `PASS-${10000 + i}`,
      visitorName: mockNames[i % mockNames.length] + ` ${i}`,
      visitorType: i % 3 === 0 ? 'Contractor' : i % 2 === 0 ? 'Pre-Approved' : 'Walk-In',
      host: i % 2 === 0 ? 'Prof. Tariq' : 'Dr. Ahmed Al-Maktoum',
      campus: i % 3 === 0 ? 'CMP-02' : 'CMP-01',
      checkInTime: `2026-10-0${(i % 5) + 1} 09:30 AM`,
      checkOutTime: `2026-10-0${(i % 5) + 1} 11:30 AM`,
      checkInMethod: i % 2 === 0 ? 'QR' : 'Manual',
      checkOutMethod: i % 2 === 0 ? 'QR' : 'Manual',
      duration: '2h 0m',
      status: 'Closed',
      gateId: i % 2 === 0 ? 'GATE-01' : 'GATE-02'
  }));

  const [visitHistory, setVisitHistory] = useState([...initialVisitHistory, ...generatedVisitors]);

  // Database of all expected passes today
  const [expectedPasses, setExpectedPasses] = useState([
    { passId: 'PASS-00125', name: 'John Smith', type: 'Contractor', host: 'Ahmed Ali', campus: 'CMP-01', status: 'ACTIVE', photo: 'https://i.pravatar.cc/300?img=11' },
    { passId: 'PASS-00126', name: 'Mike Ross', type: 'Pre-Scheduled', host: 'Dr. Ahmed Al-Maktoum', campus: 'CMP-01', status: 'ACTIVE', photo: 'https://i.pravatar.cc/300?img=12' },
    { passId: 'PASS-00120', name: 'Ahmed Khan', type: 'Contractor', host: 'Facility Manager', campus: 'CMP-01', status: 'CHECKED_IN', photo: 'https://i.pravatar.cc/300?img=33' }
  ]);

  const [stats, setStats] = useState({
    expected: 42,
    checkedInToday: 18,
    checkedOutToday: 15,
    overdue: 3,
    totalToday: 33
  });

  // Blocked / Restricted Visitors Data
  const [restrictedVisitors, setRestrictedVisitors] = useState([
    {
      id: 'BR-2026-00125',
      name: 'John Smith',
      docType: 'Emirates ID',
      docNumber: '784-1234-5678901-1', // Simulated match condition
      mobile: '+971 50 123 4567',
      type: 'Policy Violation',
      reason: 'Previous unauthorized access attempt.',
      restrictedDate: '2026-09-15',
      restrictedBy: 'Security Admin',
      status: 'Restricted',
      releaseType: '-',
      expiry: '-'
    }
  ]);

  const [securityReviews, setSecurityReviews] = useState([
    {
      id: 'SR-2026-0001',
      visitorName: 'David Brown',
      docNumber: '784-9876-5432109-2',
      restrictionId: 'BR-2026-00110',
      reason: 'Security Concern',
      host: 'Facility Manager',
      campus: 'CMP-01',
      matchTime: '2026-10-04 08:30 AM',
      status: 'Pending Security Review',
      photo: 'https://i.pravatar.cc/300?img=68'
    }
  ]);

  // RBAC Filters
  const scopedActiveVisits = useMemo(() => {
    return activeVisits.filter(v => {
      if (sessionUser?.role === 'host') {
        return AuthorizationService.canAccessHostData(sessionUser, v.host) && v.visitorType !== 'Walk-in';
      }
      if (sessionUser?.role === 'visitor') {
        return AuthorizationService.canAccessVisitorData(sessionUser, v.visitorId);
      }
      if (sessionUser?.role === 'security') {
        const hasCampus = AuthorizationService.canAccessCampus(sessionUser, v.campus);
        const hasGate = sessionUser.gateId ? sessionUser.gateId === v.gateId : true; // Fallback if gateId isn't on visitor object
        return hasCampus && hasGate;
      }
      return AuthorizationService.canAccessCampus(sessionUser, v.campus);
    });
  }, [activeVisits, sessionUser]);

  const scopedVisitHistory = useMemo(() => {
    return visitHistory.filter(v => {
      if (sessionUser?.role === 'host') {
        return AuthorizationService.canAccessHostData(sessionUser, v.host) && v.visitorType !== 'Walk-in';
      }
      if (sessionUser?.role === 'visitor') {
        return AuthorizationService.canAccessVisitorData(sessionUser, v.visitorId);
      }
      if (sessionUser?.role === 'security') {
        const hasCampus = AuthorizationService.canAccessCampus(sessionUser, v.campus);
        const hasGate = sessionUser.gateId ? sessionUser.gateId === v.gateId : true;
        return hasCampus && hasGate;
      }
      return AuthorizationService.canAccessCampus(sessionUser, v.campus);
    });
  }, [visitHistory, sessionUser]);

  const scopedExpectedPasses = useMemo(() => {
    return expectedPasses.filter(p => {
      if (sessionUser?.role === 'host') {
        return AuthorizationService.canAccessHostData(sessionUser, p.host) && p.type !== 'Walk-in';
      }
      if (sessionUser?.role === 'visitor') {
        // Here we simulate filtering by visitor name/id
        // In real API, expectedPasses would have visitorId
        return p.name === sessionUser.name; 
      }
      if (sessionUser?.role === 'security') {
        return AuthorizationService.canAccessCampus(sessionUser, p.campus);
      }
      return AuthorizationService.canAccessCampus(sessionUser, p.campus);
    });
  }, [expectedPasses, sessionUser]);

  const scopedSecurityReviews = useMemo(() => {
    return securityReviews.filter(r => AuthorizationService.canAccessCampus(sessionUser, r.campus));
  }, [securityReviews, sessionUser]);

  const addRestrictedVisitor = (visitor) => {
    setRestrictedVisitors([visitor, ...restrictedVisitors]);
  };

  const checkIn = (passId, method = 'QR') => {
    // Only Security/Reception/Admins should check in
    if (sessionUser?.role === 'host' || sessionUser?.role === 'contractor') {
      return { success: false, message: 'Access Denied: You do not have permission to perform check-ins.' };
    }

    const pass = expectedPasses.find(p => p.passId === passId);
    if (!pass) return { success: false, message: 'Invalid Pass ID. Pass not found.' };
    if (pass.status === 'CHECKED_IN') return { success: false, message: 'Visitor is already checked in.' };
    if (pass.status === 'INVALIDATED') return { success: false, message: 'This visitor pass has already been used and is no longer valid.' };

    // --- NEW LOGIC: Check Restricted List ---
    const isRestricted = restrictedVisitors.find(r => r.name.toLowerCase() === pass.name.toLowerCase() && r.status === 'Restricted');
    
    if (isRestricted) {
      // Intercept and create Security Review
      const newReview = {
        id: `SR-2026-${Math.floor(Math.random() * 900) + 100}`,
        visitorName: pass.name,
        docNumber: isRestricted.docNumber,
        restrictionId: isRestricted.id,
        reason: isRestricted.reason,
        host: pass.host,
        campus: pass.campus,
        matchTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: 'Pending Security Review',
        photo: pass.photo,
        passId: passId
      };
      setSecurityReviews([newReview, ...securityReviews]);
      return { success: false, isRestricted: true, reviewId: newReview.id, message: 'Restricted Visitor Detected. Security Review required.' };
    }
    // --- END NEW LOGIC ---

    const newVisit = {
      id: `VIS-${Math.floor(Math.random() * 9000) + 1000}`,
      visitorId: `VST-${Math.floor(Math.random() * 900) + 100}`,
      passId: pass.passId,
      visitorName: pass.name,
      visitorType: pass.type,
      host: pass.host,
      company: 'Simulated Corp',
      campus: pass.campus,
      checkInTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      checkInMethod: method,
      gate: 'Main Gate',
      status: 'Checked In',
      photo: pass.photo
    };

    setActiveVisits([newVisit, ...activeVisits]);
    
    // Update pass status
    setExpectedPasses(expectedPasses.map(p => p.passId === passId ? { ...p, status: 'CHECKED_IN' } : p));
    setStats({ ...stats, checkedInToday: stats.checkedInToday + 1, totalToday: stats.totalToday + 1 });

    return { success: true, visit: newVisit };
  };

  const checkOut = (passId, method = 'QR', reason = null) => {
    if (sessionUser?.role === 'host' || sessionUser?.role === 'contractor') {
      return { success: false, message: 'Access Denied: You do not have permission to perform check-outs.' };
    }

    const activeVisit = activeVisits.find(v => v.passId === passId);
    if (!activeVisit) return { success: false, message: 'No active check-in found for this pass.' };

    const closedVisit = {
      ...activeVisit,
      checkOutTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      checkOutMethod: method,
      forceReason: reason,
      duration: 'Simulated (2h)',
      status: method === 'Force Check-out' ? 'Force Checked Out' : 'Closed'
    };

    setVisitHistory([closedVisit, ...visitHistory]);
    setActiveVisits(activeVisits.filter(v => v.passId !== passId));
    
    // Invalidate pass
    setExpectedPasses(expectedPasses.map(p => p.passId === passId ? { ...p, status: 'INVALIDATED' } : p));
    setStats({ ...stats, checkedOutToday: stats.checkedOutToday + 1 });

    return { success: true, visit: closedVisit };
  };

  const actionSecurityReview = (reviewId, action, details) => {
    if (sessionUser?.role !== 'security' && sessionUser?.role !== 'superadmin' && sessionUser?.role !== 'campusadmin') {
      return; // Unauthorized
    }

    const review = securityReviews.find(r => r.id === reviewId);
    if (!review) return;

    if (action === 'DENY') {
      setSecurityReviews(securityReviews.map(r => r.id === reviewId ? { ...r, status: 'Denied' } : r));
    } 
    else if (action === 'TEMP_RELEASE') {
      setSecurityReviews(securityReviews.map(r => r.id === reviewId ? { ...r, status: 'Temporarily Released' } : r));
      setRestrictedVisitors(restrictedVisitors.map(r => r.id === review.restrictionId ? { 
        ...r, status: 'Temporarily Released', releaseType: 'Temporary', expiry: details.expiry 
      } : r));
    }
    else if (action === 'PERM_RELEASE') {
      setSecurityReviews(securityReviews.map(r => r.id === reviewId ? { ...r, status: 'Permanently Released' } : r));
      setRestrictedVisitors(restrictedVisitors.map(r => r.id === review.restrictionId ? { 
        ...r, status: 'Permanently Released', releaseType: 'Permanent', expiry: 'N/A' 
      } : r));
    }
  };

  return (
    <CheckInContext.Provider value={{ 
      activeVisits: scopedActiveVisits, 
      visitHistory: scopedVisitHistory, 
      expectedPasses: scopedExpectedPasses, 
      stats, 
      checkIn, checkOut,
      restrictedVisitors, 
      securityReviews: scopedSecurityReviews, 
      addRestrictedVisitor, actionSecurityReview
    }}>
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => useContext(CheckInContext);




