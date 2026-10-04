import React, { createContext, useState, useContext } from 'react';

const CheckInContext = createContext();

export const CheckInProvider = ({ children }) => {
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
      campus: 'Main Campus',
      checkInTime: '2026-10-04 09:15 AM',
      checkInMethod: 'QR',
      gate: 'North Gate',
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
      campus: 'Main Campus',
      checkInTime: '2026-10-04 10:30 AM',
      checkInMethod: 'Manual',
      gate: 'Main Reception',
      status: 'Checked In',
      photo: 'https://i.pravatar.cc/300?img=47'
    }
  ]);

  const [visitHistory, setVisitHistory] = useState([
    {
      id: 'VIS-0999',
      visitorId: 'VST-550',
      passId: 'PASS-00118',
      visitorName: 'David Brown',
      visitorType: 'Contractor',
      host: 'Facility Manager',
      checkInTime: '2026-10-04 08:00 AM',
      checkOutTime: '2026-10-04 12:00 PM',
      checkInMethod: 'QR',
      checkOutMethod: 'QR',
      duration: '4h 0m',
      status: 'Closed'
    }
  ]);

  // Database of all expected passes today
  const [expectedPasses, setExpectedPasses] = useState([
    { passId: 'PASS-00125', name: 'John Smith', type: 'Contractor', host: 'Ahmed Ali', status: 'ACTIVE', photo: 'https://i.pravatar.cc/300?img=11' },
    { passId: 'PASS-00126', name: 'Mike Ross', type: 'Pre-Scheduled', host: 'HR Dept', status: 'ACTIVE', photo: 'https://i.pravatar.cc/300?img=12' },
    { passId: 'PASS-00120', name: 'Ahmed Khan', type: 'Contractor', host: 'Facility Manager', status: 'CHECKED_IN', photo: 'https://i.pravatar.cc/300?img=33' }
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
      campus: 'Main Campus',
      matchTime: '2026-10-04 08:30 AM',
      status: 'Pending Security Review',
      photo: 'https://i.pravatar.cc/300?img=68'
    }
  ]);

  const addRestrictedVisitor = (visitor) => {
    setRestrictedVisitors([visitor, ...restrictedVisitors]);
  };

  const checkIn = (passId, method = 'QR') => {
    const pass = expectedPasses.find(p => p.passId === passId);
    if (!pass) return { success: false, message: 'Invalid Pass ID. Pass not found.' };
    if (pass.status === 'CHECKED_IN') return { success: false, message: 'Visitor is already checked in.' };
    if (pass.status === 'INVALIDATED') return { success: false, message: 'This visitor pass has already been used and is no longer valid.' };

    // --- NEW LOGIC: Check Restricted List ---
    // In a real system, we would match by Emirates ID. Here we simulate a match based on the name.
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
        campus: 'Main Campus',
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
      campus: 'Main Campus',
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
      activeVisits, visitHistory, expectedPasses, stats, checkIn, checkOut,
      restrictedVisitors, securityReviews, addRestrictedVisitor, actionSecurityReview
    }}>
      {children}
    </CheckInContext.Provider>
  );
};

export const useCheckIn = () => useContext(CheckInContext);
