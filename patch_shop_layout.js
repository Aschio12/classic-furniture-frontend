const fs = require('fs');
const content = fs.readFileSync('app/shop/layout.tsx', 'utf8');

let newContent = content.replace(
  /<header className="fixed.*?<\/header>/s,
  "<MainNavbar />"
);

// Add import if not present
if (!newContent.includes('MainNavbar')) {
  newContent = newContent.replace('import { motion, AnimatePresence } from "framer-motion";', 'import { motion, AnimatePresence } from "framer-motion";\nimport MainNavbar from "@/components/shared/MainNavbar";');
}

fs.writeFileSync('app/shop/layout.tsx', newContent);
