const fs = require('fs');
const path = 'c:\\Users\\iproa_jfqyrsl\\Downloads\\web-projects\\hct\\src\\context\\RoleContext.jsx';
let content = fs.readFileSync(path, 'utf8');

const rolesOld = /export const roles = \[\s*\{[\s\S]*?\}\s*\];/;
const rolesNew = `export const roles = [
  { 
    id: 'superadmin', label: 'Superadmin', portals: ['dashboard', 'visitor', 'host', 'security', 'contractor', 'reporting', 'settings'],
    defaultPermissions: ALL_PERMISSIONS, defaultCampuses: ['ALL']
  },
  { 
    id: 'campusadmin', label: 'Campus Admin', portals: ['dashboard', 'visitor', 'contractor', 'security', 'reporting', 'campus-settings'],
    defaultPermissions: ['view_visitors', 'view_active_visits', 'view_visit_history', 'view_reports', 'view_contractors'], defaultCampuses: ['CMP-01']
  },
  { 
    id: 'host', label: 'Host', portals: ['dashboard', 'visitor-list', 'pre-scheduled', 'host-approvals', 'reports'],
    defaultPermissions: ['view_visitors', 'create_visitor', 'approve_visitor', 'reject_visitor'], defaultCampuses: ['CMP-01']
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
    id: 'approver', label: 'Approver', portals: ['dashboard', 'contractor-approvals', 'employee-approvals', 'pass-approvals', 'registered-contractors', 'employees', 'passes', 'approval-history'],
    defaultPermissions: ['approve_contractor', 'approve_employees', 'approve_pass_request'], defaultCampuses: ['ALL']
  },
  {
    id: 'visitor', label: 'Visitor', portals: ['registration', 'my-visit', 'my-pass'],
    defaultPermissions: [], defaultCampuses: ['ALL']
  }
];`;
content = content.replace(rolesOld, rolesNew);

const switchOld = /switch \(roleId\) \{[\s\S]*?default:/;
const switchNew = `switch (roleId) {
          case 'superadmin':
            mappedUser = { id: 'USR-ADMIN', name: 'Global Admin', email: 'admin@hct.ac.ae', role: 'superadmin', portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          case 'campusadmin':
            mappedUser = { id: 'USR-CAMPUS-01', name: 'Campus Admin ADMC', email: 'cadmin@hct.ac.ae', role: 'campusadmin', portals: role.portals, campuses: ['CMP-01'], permissions: role.defaultPermissions };
            break;
          case 'host':
            mappedUser = { id: 'USR-HOST-01', name: 'Prof. Tariq', email: 'tariq@hct.ac.ae', role: 'host', hostId: 'Dr. Ahmed Al-Maktoum', portals: role.portals, campuses: ['CMP-01'], permissions: role.defaultPermissions };
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
          case 'approver':
            mappedUser = { id: 'USR-APP-01', name: 'Approver Level 1', email: 'app@hct.ac.ae', role: 'approver', approvalScope: ['Tech Solutions LLC', 'Global Services Group'], portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          case 'visitor':
            mappedUser = { id: 'USR-VIS-01', name: 'John Smith', email: 'john@example.com', role: 'visitor', visitorId: 'V-101', portals: role.portals, campuses: ['ALL'], permissions: role.defaultPermissions };
            break;
          default:`;

content = content.replace(switchOld, switchNew);
fs.writeFileSync(path, content, 'utf8');
console.log('RoleContext updated successfully');
