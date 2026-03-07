const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'components', 'shared', 'MainNavbar.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /className="relative flex w-full max-w-4xl items-center justify-between rounded-full px-6 py-3\.5 sm:px-8 sm:py-4 transition-all duration-700 ease-out"/,
  'className="relative flex w-[94%] max-w-7xl items-center justify-between rounded-full px-6 py-3.5 sm:px-8 sm:py-4 transition-all duration-700 ease-out"'
);

fs.writeFileSync(file, content);
console.log('Successfully patched app/components/shared/MainNavbar.tsx');
