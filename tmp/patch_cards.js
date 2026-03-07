const fs = require('fs');

let shopCard = 'components/shop/ShopProductCard.tsx';
if (fs.existsSync(shopCard)) {
  let text = fs.readFileSync(shopCard, 'utf8');
  text = text.replace(/<p className="text-gray-500 mt-2 text-sm font-light line-clamp-2 leading-relaxed">\s*\{product\.description \|\| "Refined aesthetics crafted for timeless elegance\."\}\s*<\/p>/g, '');
  fs.writeFileSync(shopCard, text);
}

let dashCard = 'components/dashboard/DashboardProductCard.tsx';
if (fs.existsSync(dashCard)) {
  let text = fs.readFileSync(dashCard, 'utf8');
  text = text.replace(/<p className="text-gray-500 mt-2 text-sm line-clamp-2 font-light leading-relaxed">\s*\{product\.description \|\| "Luxurious crafted piece for your home\."\}\s*<\/p>/g, '');
  fs.writeFileSync(dashCard, text);
}

console.log("Removed descriptions from cards.");
