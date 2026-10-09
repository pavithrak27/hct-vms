const fs = require('fs');
const path = 'c:\\Users\\iproa_jfqyrsl\\Downloads\\web-projects\\hct\\src\\components\\layout\\Layout.jsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /const allNavigation = \[[\s\S]*?\];\s+const navigation = allNavigation\.filter\(nav => currentRole\.portals\.includes\(nav\.id\)\);/;

const newNav = `
  const ROLE_NAVIGATION = {
    host: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText },
      { id: 'pre-scheduled', name: 'Pre-Scheduled Visitors', href: '/visitor-list?filter=prescheduled', icon: Calendar },
      { id: 'host-approvals', name: 'Host Approvals', href: '/host', icon: UserCheck },
      { id: 'reports', name: 'Visitor Reports', href: '/reports/visitor', icon: BarChart3 },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    visitor: [
      { id: 'registration', name: 'Registration', href: '/visitor-list', icon: FileText },
      { id: 'my-visit', name: 'My Visit', href: '/', icon: Calendar },
      { id: 'my-pass', name: 'My Pass', href: '/visitor-list?pass=true', icon: QrCode },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    security: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'visitor-list', name: 'Security Visitor List', href: '/visitor-list', icon: FileText },
      { id: 'contractor-passes', name: 'Contractor Passes', href: '/admin/pass-requests', icon: Briefcase },
      { id: 'qr-scanner', name: 'QR Scanner', href: '/qr-scanner', icon: ScanLine },
      { id: 'check-in-out', name: 'Check-in / Check-out', href: '/check-in-out', icon: CheckSquare },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: Clock },
      { id: 'restricted', name: 'Restricted Visitors', href: '/restricted', icon: ShieldAlert },
      { id: 'reports-visitor', name: 'Visitor Reports', href: '/reports/visitor', icon: FileText },
      { id: 'reports-contractor', name: 'Contractor Visitor Reports', href: '/reports/contractor-visitor', icon: FileSpreadsheet },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    contractor: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'my-company', name: 'My Contractor Details', href: '/contractor', icon: Building },
      { id: 'employees', name: 'Employees', href: '/contractor/employees', icon: Users },
      { id: 'pass-requests', name: 'Pass Requests', href: '/contractor/requests', icon: FileSignature },
      { id: 'generated-passes', name: 'Generated Passes', href: '/contractor/passes', icon: QrCode },
      { id: 'reports', name: 'My Reports', href: '/reports/contractor-visitor', icon: BarChart3 },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    approver: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'contractor-approvals', name: 'Contractor Approvals', href: '/contractors-hub', icon: Building2 },
      { id: 'employee-approvals', name: 'Employee Approvals', href: '/contractors-hub?tab=employees', icon: UserCheck },
      { id: 'pass-approvals', name: 'Contractor Approvals', href: '/pass-approvals', icon: CheckSquare },
      { id: 'registered-contractors', name: 'Registered Contractors', href: '/contractors-hub?view=registered', icon: Building },
      { id: 'employees', name: 'Employees', href: '/contractors-hub?tab=employees&view=all', icon: Users },
      { id: 'passes', name: 'Passes', href: '/admin/pass-requests', icon: QrCode },
      { id: 'approval-history', name: 'Approval History', href: '/visit-history', icon: History },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    reception: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'walk-in', name: 'Walk-in Registration', href: '/visitor-list?new=true', icon: Plus },
      { id: 'visitor-list', name: 'Visitor List', href: '/visitor-list', icon: FileText },
      { id: 'qr-scanner', name: 'QR Scanner', href: '/qr-scanner', icon: ScanLine },
      { id: 'check-in-out', name: 'Check-in / Check-out', href: '/check-in-out', icon: CheckSquare },
      { id: 'active-visits', name: 'Active Visits', href: '/active-visits', icon: Clock },
      { id: 'history', name: 'Visitor History', href: '/visit-history', icon: History },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings },
    ],
    campus_admin: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'visitor', name: 'Visitor Management', href: '/visitor-list', icon: FileText },
      { id: 'contractor', name: 'Contractor Management', href: '/contractors-hub', icon: Building },
      { id: 'pass-requests', name: 'Pass Requests', href: '/admin/pass-requests', icon: FileSignature },
      { id: 'employees', name: 'Employees', href: '/contractors-hub?tab=employees', icon: Users },
      { id: 'approvals', name: 'Approvals', href: '/pass-approvals', icon: CheckSquare },
      { id: 'security', name: 'Security / Active Visits', href: '/active-visits', icon: ShieldCheck },
      { id: 'restricted', name: 'Restricted Visitors', href: '/restricted', icon: ShieldAlert },
      { id: 'reports', name: 'Reports', href: '/reporting', icon: BarChart3 },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'campus-settings', name: 'Campus Settings', href: '/settings/campus', icon: Settings },
      { id: 'users', name: 'Users', href: '/settings/users', icon: UserCog },
      { id: 'audit', name: 'Audit Logs', href: '/reports/audit', icon: Database },
    ],
    superadmin: [
      { id: 'dashboard', name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { id: 'visitor', name: 'Visitor Management', href: '/visitor-list', icon: FileText },
      { id: 'contractor', name: 'Contractor Management', href: '/contractors-hub', icon: Building },
      { id: 'pass-requests', name: 'Pass Requests', href: '/admin/pass-requests', icon: FileSignature },
      { id: 'employees', name: 'Employees', href: '/contractors-hub?tab=employees', icon: Users },
      { id: 'approvals', name: 'Approvals', href: '/pass-approvals', icon: CheckSquare },
      { id: 'security', name: 'Security / Active Visits', href: '/active-visits', icon: ShieldCheck },
      { id: 'restricted', name: 'Restricted Visitors', href: '/restricted', icon: ShieldAlert },
      { id: 'reports', name: 'Reports', href: '/reporting', icon: BarChart3 },
      { id: 'notifications', name: 'Notifications', href: '/notifications', icon: Bell },
      { id: 'settings', name: 'System Settings', href: '/settings/system', icon: Settings },
      { id: 'campus-settings', name: 'Campus Settings', href: '/settings/campus', icon: Building2 },
      { id: 'users', name: 'Users', href: '/settings/users', icon: UserCog },
      { id: 'audit', name: 'Audit Logs', href: '/reports/audit', icon: Database },
    ]
  };

  const navigation = ROLE_NAVIGATION[currentRole.id] || [];
`;

if (content.match(regex)) {
  content = content.replace(regex, newNav);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Layout.jsx updated successfully.');
} else {
  console.log('Regex did not match.');
}
