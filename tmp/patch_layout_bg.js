const fs = require('fs');
let layoutPath = 'app/layout.tsx';

if (fs.existsSync(layoutPath)) {
  let text = fs.readFileSync(layoutPath, 'utf8');

  text = text.replace('bg-surface ', '');

  fs.writeFileSync(layoutPath, text);
  console.log("Patched layout bg");
}
