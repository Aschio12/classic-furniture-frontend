const fs = require('fs');
const path = './app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The landing page should REDIRECT if authenticated, instead of rendering a weird dashboard, 
// OR it should just render the landing page for everyone but with the DASHBOARD button.
// And no MainLayout!

// Let's remove MainLayout
// Wait, the user wants: "Ensure the Navbar is 100% hidden on this page."
// "Verify that no other components are leaking onto this page." 
content = content.replace(/<AnimatePresence mode="wait">[\s\S]*?\{isAuthenticated \? \([\s\S]*?className="grid gap-6 md:grid-cols-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/motion.section>\s*<\/MainLayout>\s*\)\ : \(\s*(<motion\.div)/, '<AnimatePresence mode="wait">\n$1');

// After stripping the isAuthenticated block, we need to close the `)` that matched ` : (`
// Let's just find exactly where the `return` is in `app/page.tsx`
