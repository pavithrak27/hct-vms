import React, { createContext, useState, useContext } from 'react';
import AuthorizationService from '../services/AuthorizationService';

const RoleContext = createContext();

export const CAMPUSES = [
  { id: 'CMP-01', name: 'Abu Dhabi Men\'s Campus' },
  { id: 'CMP-02', name: 'Abu Dhabi Women\'s Campus' },
  { id: 'CMP-05', name: 'Dubai Men\'s Campus' },
  { id: 'CMP-06', name: 'Dubai Women\'s Campus' },
];

export const ALL_PERMISSIONS = [
  'view_visitors', 'create_visitor', 'edit_visitor', 'delete_visitor', 'approve_visitor', 'reject_visitor',
  'qr_checkin', 'manual_checkin', 'qr_checkout', 'force_checkout', 'view_active_visits', 'view_visit_history',
  'view_contractors', 'create_contractor', 'approve_contractor', 'view_employees', 'approve_employees',
  'create_pass_request', 'approve_pass_request',
  'view_restricted_list', 'add_restricted_visitor', 'security_review', 'temporary_release', 'permanent_release',
  'view_reports', 'export_reports',
  'manage_campuses', 'manage_smtp', 'manage_sms', 'manage_ad', 'manage_roles', 'manage_integrations'
];

export const roles = [
  { 
    id: 'superadmin', label: 'Superadmin', portals: ['dashboard', 'visitor', 'host', 'security', 'contractor', 'reporting', 'settings'],
    defaultPermissions: ALL_PERMISSIONS, defaultCampuses: ['ALL']
  },
  { 
    id: 'campusadmin', label: 'Campus Admin', portals: ['dashboard', 'visitor', 'contractor', 'security', 'reporting', 'campus-settings'],
    defaultPermissions: ['view_visitors', 'view_active_visits', 'view_visit_history', 'view_reports', 'view_contractors'], defaultCampuses: ['CMP-01', 'ALL']
  },
  { 
    id: 'host', label: 'Host', portals: ['dashboard', 'visitor', 'host', 'security', 'contractor', 'reporting', 'visitor-list', 'pre-scheduled', 'host-approvals', 'contractor-approvals', 'employee-approvals', 'pass-approvals', 'registered-contractors', 'employees', 'passes', 'approval-history', 'reports'],
    defaultPermissions: ['view_visitors', 'create_visitor', 'approve_visitor', 'reject_visitor', 'approve_contractor', 'approve_employees', 'approve_pass_request', 'view_contractors'], defaultCampuses: ['CMP-01', 'ALL']
  },
  { 
    id: 'security', label: 'Security', portals: ['dashboard', 'visitor-list', 'contractor-passes', 'qr-scanner', 'check-in-out', 'active-visits', 'restricted', 'reports-visitor', 'reports-contractor'],
    defaultPermissions: ['qr_checkin', 'qr_checkout', 'view_active_visits', 'view_restricted_list', 'security_review'], defaultCampuses: ['CMP-01']
  },
  { 
    id: 'reception', label: 'Reception', portals: ['dashboard', 'walk-in', 'visitor-list', 'qr-scanner', 'check-in-out', 'active-visits', 'history'],
    defaultPermissions: ['create_visitor', 'manual_checkin', 'view_active_visits'], defaultCampuses: ['CMP-01']
  },
  {
    id: 'contractor', label: 'Contractor', portals: ['dashboard', 'my-company', 'employees', 'pass-requests', 'generated-passes', 'reports'],
    defaultPermissions: ['view_employees', 'create_pass_request'], defaultCampuses: ['ALL']
  },
  {
    id: 'visitor', label: 'Visitor', portals: ['registration', 'my-visit', 'my-pass'],
    defaultPermissions: [], defaultCampuses: ['ALL']
  }
];

export const RoleProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  
  // New granular RBAC States
  const [sessionUser, setSessionUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [userCampuses, setUserCampuses] = useState([]);
  const [activeCampus, setActiveCampus] = useState('ALL'); // For the top-nav selector

  const login = (roleId, customUser = null) => {
    // If someone attempts to log in as approver, map to host
    const effectiveRoleId = roleId === 'approver' ? 'host' : roleId;
    const role = roles.find(r => r.id === effectiveRoleId);
    if (role) {
      setCurrentRole(role);
      
      let mappedUser = customUser;
      if (!mappedUser) {
        // Pre-defined mock profiles for robust RBAC testing
        switch (effectiveRoleId) {
          case 'superadmin':
            mappedUser = { id: 'USR-ADMIN', name: 'Super Admin', email: 'admin@hct.ac.ae', role: 'superadmin', portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          case 'campusadmin':
            mappedUser = { id: 'USR-CAMPUS-01', name: 'Campus Admin ADMC', email: 'cadmin@hct.ac.ae', role: 'campusadmin', portals: role.portals, campuses: ['CMP-01', 'ALL'], permissions: role.defaultPermissions };
            break;
          case 'host':
            mappedUser = { id: 'USR-HOST-01', name: 'Prof. Tariq (Host & Approver)', email: 'tariq@hct.ac.ae', role: 'host', hostId: 'Dr. Ahmed Al-Maktoum', approvalScope: ['Tech Solutions LLC', 'Global Services Group'], portals: role.portals, campuses: ['CMP-01', 'ALL'], permissions: role.defaultPermissions };
            break;
          case 'security':
            mappedUser = { id: 'USR-SEC-01', name: 'Security ADMC Gate 2', email: 'sec@hct.ac.ae', role: 'security', portals: role.portals, campuses: ['CMP-01'], gateId: 'GATE-02', permissions: role.defaultPermissions };
            break;
          case 'reception':
            mappedUser = { id: 'USR-REC-01', name: 'Receptionist ADMC', email: 'rec@hct.ac.ae', role: 'reception', portals: role.portals, campuses: ['CMP-01'], permissions: role.defaultPermissions };
            break;
          case 'contractor':
            mappedUser = { id: 'USR-CON-01', name: 'ABC Cleaning Admin', email: 'admin@abccleaning.com', role: 'contractor', companyId: 'Tech Solutions LLC', portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          case 'visitor':
            mappedUser = { id: 'USR-VIS-01', name: 'John Smith', email: 'john@example.com', role: 'visitor', visitorId: 'V-101', portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          default:
            mappedUser = { id: `USR-${Math.floor(Math.random()*9000)+1000}`, name: `Mock ${role.label}`, email: `user@hct.ac.ae`, role: effectiveRoleId, portals: role.portals, campuses: role.defaultCampuses, permissions: role.defaultPermissions };
        }
      }
      
      setSessionUser(mappedUser);
      setUserPermissions(mappedUser.permissions || []);
      setUserCampuses(mappedUser.campuses || []);
      
      // Auto-set the active campus
      if (mappedUser.campuses && mappedUser.campuses.includes('ALL')) {
        setActiveCampus('ALL');
      } else if (mappedUser.campuses && mappedUser.campuses.length > 0) {
        setActiveCampus(mappedUser.campuses[0]);
      } else {
        setActiveCampus('ALL');
      }

      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setCurrentRole(null);
    setSessionUser(null);
    setUserPermissions([]);
    setUserCampuses([]);
    setActiveCampus('ALL');
    setIsAuthenticated(false);
  };

  const hasPermission = (perm) => {
    return AuthorizationService.hasPermission(sessionUser, perm);
  };

  const hasCampusAccess = (campusId) => {
    return AuthorizationService.canAccessCampus(sessionUser, campusId);
  };

  return (
    <RoleContext.Provider value={{ 
      isAuthenticated, currentRole, login, logout, roles,
      sessionUser, userPermissions, userCampuses, activeCampus, setActiveCampus,
      hasPermission, hasCampusAccess,
      authService: AuthorizationService
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
