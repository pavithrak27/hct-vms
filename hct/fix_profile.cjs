const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8');

// Add Profile to all menus in ROLE_NAVIGATION if it doesn't exist
const roles = ['superadmin', 'campusadmin', 'host', 'security', 'contractor', 'approver', 'reception'];
// visitor already has it, but I'll replace its implementation so it works correctly.

// 1. Render button for profile
const renderTarget = `                return (
                  <Link
                    key={item.name}
                    to={item.href}`;
                    
const renderReplacement = `                if (item.id === 'profile') {
                  return (
                    <button
                      key={item.name}
                      onClick={() => setShowProfileModal(true)}
                      className={\`w-full text-left flex items-center gap-3 py-2.5 transition-all group relative overflow-hidden \${isCollapsed ? 'justify-center px-4 mx-2 rounded-xl' : 'px-6'} \${item.isSubItem && !isCollapsed ? 'pl-10 text-sm' : ''} text-blue-100/60 hover:text-white hover:bg-white/5\`}
                    >
                      <Icon className={\`\${item.isSubItem ? 'w-[18px] h-[18px]' : 'w-5 h-5'} shrink-0 text-blue-200/40 group-hover:text-blue-200/80 transition-colors\`} />
                      {!isCollapsed && <span className="font-medium tracking-wide">{item.name}</span>}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}`;

// 2. Add profile menu to all roles
// Just regex replace the end of each array with the profile menu
content = content.replace(/(\]\,\n\s+visitor: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For host
content = content.replace(/(\]\,\n\s+security: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For visitor
content = content.replace(/(\]\,\n\s+contractor: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For security
content = content.replace(/(\]\,\n\s+approver: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For contractor
content = content.replace(/(\]\,\n\s+reception: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For approver
content = content.replace(/(\]\,\n\s+superadmin: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For reception
content = content.replace(/(\]\,\n\s+campusadmin: \[)/, `{ id: 'profile', name: 'Profile', icon: UserCog },\n    $1`); // For superadmin

// Wait, the regex replace above might not catch all if I just do them sequentially, and I need to be careful with visitor since it already has profile.
// Actually, let's just use a more careful replacement. Let's do it in JS.

function replaceHelper(src, trg, rpl) {
    if (src.includes(trg)) return src.replace(trg, rpl);
    const trgCRLF = trg.replace(/\\n/g, '\\r\\n');
    const rplCRLF = rpl.replace(/\\n/g, '\\r\\n');
    if (src.includes(trgCRLF)) return src.replace(trgCRLF, rplCRLF);
    return src;
}

content = replaceHelper(content, renderTarget, renderReplacement);

// Fix visitor profile href which was pointing to /settings/users
content = content.replace(
  `{ id: 'profile', name: 'Profile', href: '/settings/users', icon: Settings }`,
  `{ id: 'profile', name: 'Profile', icon: UserCog }`
);

// Instead of manually injecting profile in every array, I can simply push it programmatically before rendering or define it dynamically.
// Or just let's inject it into all arrays in ROLE_NAVIGATION.
const navTarget = `const ROLE_NAVIGATION = {`;
const navEnd = `};`;

let navStartIdx = content.indexOf(navTarget);
let navEndIdx = content.indexOf(`  const navItems = ROLE_NAVIGATION[currentRole.id] || [];`);

let navStr = content.substring(navStartIdx, navEndIdx);
// Let's replace '],' with '  { id: 'profile', name: 'Profile', icon: UserCog },\n    ],'
// Except we need to be careful about sub-arrays. But ROLE_NAVIGATION is just a flat array of objects for each role.
// Actually, it's safer to just inject it at the bottom.
const injection = `
  Object.keys(ROLE_NAVIGATION).forEach(role => {
    if (!ROLE_NAVIGATION[role].find(item => item.id === 'profile')) {
      ROLE_NAVIGATION[role].push({ id: 'profile', name: 'Profile', icon: UserCog });
    }
  });
`;

content = content.slice(0, navEndIdx) + injection + content.slice(navEndIdx);

fs.writeFileSync('src/components/layout/Layout.jsx', content);
console.log('Fixed profile button in navigation');
