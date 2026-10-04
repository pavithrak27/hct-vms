import React, { createContext, useState, useContext } from 'react';

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
    id: 'superadmin', label: 'Superadmin', portals: ['dashboard', 'visitor', 'host', 'security', 'contractor', 'reporting'],
    defaultPermissions: ALL_PERMISSIONS, defaultCampuses: ['ALL']
  },
  { 
    id: 'campusadmin', label: 'Campus Admin', portals: ['dashboard', 'visitor', 'security', 'reporting'],
    defaultPermissions: ['view_visitors', 'view_active_visits', 'view_visit_history', 'view_reports', 'view_contractors'], defaultCampuses: ['CMP-01']
  },
  { 
    id: 'host', label: 'Host', portals: ['dashboard', 'host'],
    defaultPermissions: ['view_visitors', 'create_visitor', 'approve_visitor', 'reject_visitor'], defaultCampuses: ['CMP-01']
  },
  { 
    id: 'security', label: 'Security', portals: ['dashboard', 'security'],
    defaultPermissions: ['qr_checkin', 'qr_checkout', 'view_active_visits', 'view_restricted_list', 'security_review'], defaultCampuses: ['CMP-01']
  },
  { 
    id: 'reception', label: 'Reception', portals: ['dashboard', 'visitor'],
    defaultPermissions: ['create_visitor', 'manual_checkin', 'view_active_visits'], defaultCampuses: ['CMP-01']
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
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setCurrentRole(role);
      
      // Simulate SAML/AD Session mapping
      const mappedUser = customUser || {
        id: `USR-${Math.floor(Math.random()*9000)+1000}`,
        name: `Mock ${role.label}`,
        email: `user@hct.ac.ae`,
        employeeId: 'HCT-9912',
      };
      
      setSessionUser(mappedUser);
      setUserPermissions(role.defaultPermissions);
      setUserCampuses(role.defaultCampuses);
      
      // Auto-set the active campus
      if (role.defaultCampuses.includes('ALL')) {
        setActiveCampus('ALL');
      } else {
        setActiveCampus(role.defaultCampuses[0]);
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
    return userPermissions.includes(perm);
  };

  const hasCampusAccess = (campusId) => {
    return userCampuses.includes('ALL') || userCampuses.includes(campusId);
  };

  return (
    <RoleContext.Provider value={{ 
      isAuthenticated, currentRole, login, logout, roles,
      sessionUser, userPermissions, userCampuses, activeCampus, setActiveCampus,
      hasPermission, hasCampusAccess
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
