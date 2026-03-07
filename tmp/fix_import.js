const fs = require('fs');
let text = fs.readFileSync('components/shared/MainLayout.tsx', 'utf8');
text = text.replace(/import MainNavbar from "@\/components\/shared\/MainNavbar";\nimport MainNavbar from "@\/components\/shared\/MainNavbar";/, 'import MainNavbar from "@/components/shared/MainNavbar";');
fs.writeFileSync('components/shared/MainLayout.tsx', text);
