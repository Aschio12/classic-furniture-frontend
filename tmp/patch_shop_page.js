const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'app', 'shop', 'page.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the animation duration to be exactly 40 seconds (using inline styles to be certain)
content = content.replace(
  /className="absolute inset-y-0 -left-\[160%\] w-\[75%\] bg-gradient-to-r from-transparent via-white\/50 to-transparent animate-\[continuous-shine_40s_ease-in-out_infinite\] group-hover:animate-none group-hover:translate-x-\[450%\] transition-transform duration-\[1200ms\]" \/>/,
  'className="absolute inset-y-0 -left-[160%] w-[75%] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-none group-hover:translate-x-[450%] transition-transform duration-[1200ms]" style={{ animation: "continuous-shine 40s ease-in-out infinite" }} />'
);

// 2. Change the details button to match the minimalist glassy aesthetic
content = content.replace(
  /className="group\/link flex items-center justify-center p-3 sm:p-3\.5 rounded-\[1rem\] bg-\[#D4AF37\] shadow-\[0_4px_12px_rgba\(212,175,55,0\.2\)\] border border-transparent text-white transition-all duration-300 hover:bg-\[#C9A961\] hover:scale-105"/,
  'className="group/link flex items-center justify-center p-3 sm:p-3.5 rounded-[1rem] bg-transparent border border-[#2C2C2C]/15 text-[#2C2C2C] transition-all duration-300 hover:bg-[#2C2C2C] hover:text-white hover:border-[#2C2C2C] hover:scale-105 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"'
);

fs.writeFileSync(file, content);
console.log('Successfully patched app/shop/page.tsx');
