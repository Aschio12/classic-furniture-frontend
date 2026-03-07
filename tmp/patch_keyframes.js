const fs = require('fs');

let dashCardPath = 'components/dashboard/DashboardProductCard.tsx';
if (fs.existsSync(dashCardPath)) {
  let text = fs.readFileSync(dashCardPath, 'utf8');
  text = text.replace(/20% { left: 200%; top: 50%; }/g, '5% { left: 200%; top: 50%; }');
  text = text.replace(/\/\* wait for the remainder of 3 seconds \*\//g, '/* wait for the remainder of 40 seconds */');
  fs.writeFileSync(dashCardPath, text);
}

let shopPagePath = 'app/shop/page.tsx';
if (fs.existsSync(shopPagePath)) {
  let text = fs.readFileSync(shopPagePath, 'utf8');
  text = text.replace(/0%, 20% { transform: translateX\(0\); opacity: 0; }/g, '0% { transform: translateX(0); opacity: 0; }');
  text = text.replace(/40%, 60% { opacity: 1; }/g, '2.5% { opacity: 1; }\n          5% { transform: translateX(450%); opacity: 0; }');
  text = text.replace(/100% { transform: translateX\(450%\); opacity: 0; }/g, '100% { transform: translateX(450%); opacity: 0; }');
  fs.writeFileSync(shopPagePath, text);
}

console.log("Patched keyframes");
