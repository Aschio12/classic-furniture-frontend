const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'components/shared/MainLayout.tsx');
let content = fs.readFileSync(file, 'utf8');

// replace the old header with our MainNavbar component
content = content.replace(/import { UserCircle } from "lucide-react";/, 'import MainNavbar from "@/components/shared/MainNavbar";\nimport { UserCircle } from "lucide-react";');

// Now remove the <motion.header>...</motion.header> chunk
content = content.replace(/<motion\.header[\s\S]*?<\/motion\.header>/, '<MainNavbar />');

fs.writeFileSync(file, content);
console.log('Successfully patched MainLayout.tsx');
