const fs = require('fs');

// 1. DashboardProductCard
let dashCardPath = 'components/dashboard/DashboardProductCard.tsx';
if (fs.existsSync(dashCardPath)) {
  let text = fs.readFileSync(dashCardPath, 'utf8');
  text = text.replace(/animate-\[shine-sweep_3s_infinite_ease-in-out\]/g, 'animate-[shine-sweep_40s_infinite_ease-in-out]');
  text = text.replace(/group-hover:text-gray-900 transition-colors/g, 'text-[#D4AF37] group-hover:text-[#B8860B] transition-colors');
  fs.writeFileSync(dashCardPath, text);
}

// 2. ShopProductCard
let shopCardPath = 'components/shop/ShopProductCard.tsx';
if (fs.existsSync(shopCardPath)) {
  let text = fs.readFileSync(shopCardPath, 'utf8');
  text = text.replace(/group-hover:text-gray-900 transition-colors/g, 'text-[#D4AF37] group-hover:text-[#B8860B] transition-colors');
  fs.writeFileSync(shopCardPath, text);
}

// 3. app/shop/page.tsx (the inline inline details button)
let shopPagePath = 'app/shop/page.tsx';
if (fs.existsSync(shopPagePath)) {
  let text = fs.readFileSync(shopPagePath, 'utf8');
  // replace inline details button
  text = text.replace(/bg-transparent border border-\[#2C2C2C\]\/15 text-\[#2C2C2C\] transition-all duration-300 hover:bg-\[#2C2C2C\] hover:text-white hover:border-\[#2C2C2C\]/g, 
  'bg-transparent border border-[#D4AF37]/30 text-[#B8860B] transition-all duration-300 hover:bg-[#D4AF37]/10 hover:text-[#8B6508] hover:border-[#D4AF37]/50');
  fs.writeFileSync(shopPagePath, text);
}

console.log('Patched card shine and colors.');
