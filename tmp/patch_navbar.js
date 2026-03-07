const fs = require('fs');

let navPath = 'components/shared/MainNavbar.tsx';
if (fs.existsSync(navPath)) {
  let text = fs.readFileSync(navPath, 'utf8');
  
  // Make state for mobile menu
  if (!text.includes('isMobileMenuOpen')) {
    text = text.replace(/const \[isVisible, setIsVisible\] = useState\(true\);/, "const [isVisible, setIsVisible] = useState(true);\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);");
  }

  // Improve text visibility for nav links
  text = text.replace(/text-gray-700 group-hover\/link:text-\[\#8B6508\]/g, "text-gray-900 font-semibold group-hover/link:text-black drop-shadow-md");
  text = text.replace(/isActive \? "text-\[\#8B6508\]"/g, 'isActive ? "text-black font-bold drop-shadow-md"');
  text = text.replace(/text-\[11px\] tracking-\[0\.25em\] font-medium/, "text-[12px] tracking-[0.2em] font-bold");

  // Fix the mobile menu dropdown
  const mobileMenuPlaceholder = /{?\/\* Mobile Nav Fallback Placeholder \*\//;
  if(text.match(mobileMenuPlaceholder)) {
    const replacement = `
            {/* Mobile Nav Button */}
            <div className="lg:hidden flex items-center relative z-10">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-900 font-bold tracking-widest text-xs bg-[#D4AF37]/20 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.4)]"
              >
                {isMobileMenuOpen ? "CLOSE" : "MENU"}
              </button>
            </div>
            
          </div>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl z-40 lg:hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  border: "1px solid rgba(212, 175, 55, 0.3)"
                }}
              >
                <div className="flex flex-col gap-2">
                  {[
                    { name: "Collections", path: "/shop" },
                    { name: "My Orders", path: "/orders" },
                    { name: "Profile", path: "/profile" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={\`px-6 py-3 rounded-2xl text-center text-xs tracking-widest font-bold \${
                        pathname === item.path 
                          ? "bg-[#D4AF37]/20 text-black" 
                          : "text-gray-700 hover:bg-[#D4AF37]/10"
                      }\`}
                    >
                      {item.name.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Prevent the style tag from being replaced badly, dummy wrapper */}
          <div className="hidden">
    `;

    text = text.replace(/\{\/\* Mobile Nav Fallback Placeholder \*\/\}[\s\S]*?MENU\s*<\/div>\s*<\/div>\s*(<style dangerouslySetInnerHTML)/, replacement + "$1");
  }

  fs.writeFileSync(navPath, text);
}

console.log("Patched Navbar");
