const fs = require('fs');
let shopPath = 'app/shop/page.tsx';

if (fs.existsSync(shopPath)) {
  let text = fs.readFileSync(shopPath, 'utf8');

  text = text.replace('bg-[#FAFAFA]', 'bg-transparent');

  fs.writeFileSync(shopPath, text);
  console.log("Patched Shop bg");
}

let mainLayout = 'components/shared/MainLayout.tsx';
if (fs.existsSync(mainLayout)) {
  let text = fs.readFileSync(mainLayout, 'utf8');
  text = text.replace(/bg-\[\#F9F9FB\]/g, 'bg-transparent');
  text = text.replace(/bg-\[\#FAFAFA\]/g, 'bg-transparent');
  fs.writeFileSync(mainLayout, text);
}

