const fs = require('fs');

const ensureAbsolute = `
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/')) return \`https://classic-furniture-backend.onrender.com\${url}\`;
    return \`https://classic-furniture-backend.onrender.com/\${url}\`;
  };
`;

let shopCard = 'components/shop/ShopProductCard.tsx';
if (fs.existsSync(shopCard)) {
  let text = fs.readFileSync(shopCard, 'utf8');
  // Add getImageUrl helper
  if (!text.includes('getImageUrl')) {
    text = text.replace(/const imageUrl = (.*?);/, \`const imageUrl = \$1;\n\${ensureAbsolute}\`);
  }
  // Replace src
  text = text.replace(/src=\{imageUrl\}/g, 'src={getImageUrl(imageUrl)}');
  // Remove title
  text = text.replace(/<h3 className="font-serif text-lg text-gray-900 leading-tight truncate">.*<\/h3>/g, '');
  fs.writeFileSync(shopCard, text);
}

let dashCard = 'components/dashboard/DashboardProductCard.tsx';
if (fs.existsSync(dashCard)) {
  let text = fs.readFileSync(dashCard, 'utf8');
  // Add getImageUrl helper
  if (!text.includes('getImageUrl')) {
    text = text.replace(/export default function DashboardProductCard(\(.*?\)) \{/, \`export default function DashboardProductCard\$1 {\n\${ensureAbsolute}\`);
  }
  // Replace src
  text = text.replace(/src=\{product.images\[0\]\}/g, 'src={getImageUrl(product.images[0])}');
  text = text.replace(/src=\{product.imageUrl\}/g, 'src={getImageUrl(product.imageUrl)}');
  // Remove title
  text = text.replace(/<h3 className="font-serif font-medium text-xl text-gray-900 truncate">.*<\/h3>/g, '');
  fs.writeFileSync(dashCard, text);
}

console.log("Patched cards with image helper and removed titles.");
