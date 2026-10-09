class AuthorizationService {
  canView(user, module) {
    if (!user || !user.role) return false;
    if (user.role === 'superadmin') return true;
    
    // Direct match for granular portals
    if (user.portals && user.portals.includes(module)) return true;

    // Broad module mappings for App.jsx routes
    const role = user.role;
    switch(module) {
      case 'visitor':
        return ['campusadmin', 'host', 'reception', 'security', 'superadmin'].includes(role);
      case 'security':
        return ['campusadmin', 'security', 'reception', 'superadmin', 'approver', 'host'].includes(role);
      case 'contractor':
        return ['campusadmin', 'contractor', 'approver', 'superadmin', 'host', 'security'].includes(role);
      case 'reporting':
        return ['campusadmin', 'security', 'host', 'superadmin', 'contractor', 'approver'].includes(role);
      case 'host':
        return ['host', 'superadmin'].includes(role);
      default:
        return false;
    }
  }

  hasPermission(user, permission) {
    if (!user || !user.permissions) return false;
    if (user.role === 'superadmin') return true;
    return user.permissions.includes(permission);
  }

  canAccessCampus(user, campusId) {
    if (!user || !user.campuses) return false;
    if (user.role === 'superadmin') return true;
    if (user.campuses.includes('ALL')) return true;
    return user.campuses.includes(campusId);
  }

  canAccessCompany(user, companyId) {
    if (!user) return false;
    if (['superadmin', 'campusadmin', 'host', 'security'].includes(user.role)) return true;
    if (user.role === 'approver') {
      return user.approvalScope && user.approvalScope.includes(companyId);
    }
    return user.companyId === companyId;
  }

  canAccessHostData(user, hostId) {
    if (!user) return false;
    if (user.role === 'superadmin' || user.role === 'campusadmin') return true;
    return user.hostId === hostId;
  }

  canAccessVisitorData(user, visitorId) {
    if (!user) return false;
    if (user.role === 'superadmin' || user.role === 'campusadmin') return true;
    return user.visitorId === visitorId;
  }
}

export default new AuthorizationService();
